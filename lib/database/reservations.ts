import { createClient } from '@/lib/supabase/client'
import { getCurrentUser } from '@/lib/auth'
import { Database } from '@/types/database'
import { sendReservationConfirmation, sendCancellationConfirmation } from './notifications'

// Simplified types for compatibility
interface SimpleReservationData {
  program_id: string
  participant_name: string
  participant_email: string
  participant_phone: string
  emergency_contact: string
  dietary_restrictions?: string | null
  special_requests?: string | null
  amount_paid: number
}

export interface DatabaseResponse<T = any> {
  data: T | null
  error: string | null
}

// Types from the existing file
import { 
  ReservationFormData, 
  EnhancedReservation, 
  WaitlistEntry,
  RefundRequest,
  ReservationAnalytics,
  Coupon,
  DiscountCalculation
} from '@/lib/types/reservations'
import { generateOrderId, calculatePaymentAmount } from '@/lib/payments/toss'

// ================================
// SIMPLE RESERVATION FUNCTIONS (Compatibility)
// ================================

/**
 * Create a simple reservation
 * @param reservationData - Reservation data
 * @returns Created reservation
 */
export async function createReservation(reservationData: SimpleReservationData): Promise<DatabaseResponse> {
  const supabase = createClient()
  
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { data: null, error: '로그인이 필요합니다.' }
    }

    // Check program availability
    const { data: program, error: programError } = await supabase
      .from('programs')
      .select('max_participants, current_participants, status')
      .eq('id', reservationData.program_id)
      .single()

    if (programError || !program) {
      return { data: null, error: '프로그램을 찾을 수 없습니다.' }
    }

    if (program.status !== 'open') {
      return { data: null, error: '현재 예약할 수 없는 프로그램입니다.' }
    }

    if (program.current_participants >= program.max_participants) {
      return { data: null, error: '프로그램이 마감되었습니다.' }
    }

    // Check if user already has a reservation for this program
    const { data: existingReservation } = await supabase
      .from('program_participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('program_id', reservationData.program_id)
      .neq('status', 'cancelled')
      .single()

    if (existingReservation) {
      return { data: null, error: '이미 이 프로그램에 신청하셨습니다.' }
    }

    // Create participant record
    const { data: participant, error: participantError } = await supabase
      .from('program_participants')
      .insert({
        user_id: user.id,
        program_id: reservationData.program_id,
        participant_name: reservationData.participant_name,
        participant_email: reservationData.participant_email,
        participant_phone: reservationData.participant_phone,
        emergency_contact: reservationData.emergency_contact,
        dietary_restrictions: reservationData.dietary_restrictions,
        special_requests: reservationData.special_requests,
        amount_paid: reservationData.amount_paid,
        status: 'registered',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (participantError) {
      console.error('Error creating participant:', participantError)
      return { data: null, error: '예약 생성에 실패했습니다.' }
    }

    // Send reservation confirmation notification
    try {
      await sendReservationConfirmation(participant.id)
    } catch (error) {
      console.error('Error sending reservation confirmation:', error)
      // Don't fail the reservation if notification fails
    }

    return { data: participant, error: null }
  } catch (error) {
    console.error('Error in createReservation:', error)
    return { data: null, error: '예약 처리 중 오류가 발생했습니다.' }
  }
}

// ================================
// RESERVATION MANAGEMENT
// ================================

/**
 * Create program reservation
 * @param reservationData - Reservation form data
 * @param userId - User ID
 * @returns Created reservation
 */
export async function createProgramReservation(
  reservationData: ReservationFormData,
  userId: string
): Promise<{ success: boolean; reservation?: any; error?: string }> {
  const supabase = createClient()
  
  try {
    // 1. Check program availability
    const { data: program } = await supabase
      .from('programs')
      .select('max_participants, current_participants, status, base_price, early_bird_price, early_bird_deadline')
      .eq('id', reservationData.program_id)
      .single()

    if (!program) {
      return { success: false, error: '프로그램을 찾을 수 없습니다.' }
    }

    if (program.status !== 'open') {
      return { success: false, error: '현재 예약할 수 없는 프로그램입니다.' }
    }

    if (program.current_participants >= program.max_participants) {
      // Add to waitlist instead
      const waitlistEntry = await addToWaitlist(userId, reservationData.program_id)
      return { 
        success: false, 
        error: '프로그램이 마감되었습니다. 대기 목록에 추가되었습니다.',
        waitlist: waitlistEntry
      }
    }

    // 2. Calculate final amount with discounts
    const discountCalculation = await calculateDiscounts(
      program.base_price,
      program.early_bird_price,
      program.early_bird_deadline,
      reservationData.coupon_code
    )

    // 3. Create participant record
    const { data: participant, error: participantError } = await supabase
      .from('program_participants')
      .insert({
        user_id: userId,
        program_id: reservationData.program_id,
        participant_name: reservationData.participant_name,
        participant_email: reservationData.participant_email,
        participant_phone: reservationData.participant_phone,
        emergency_contact: reservationData.emergency_contact,
        dietary_restrictions: reservationData.dietary_restrictions,
        special_requests: reservationData.special_requests,
        amount_paid: discountCalculation.final_amount,
        status: 'registered',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (participantError) {
      console.error('Error creating participant:', participantError)
      return { success: false, error: '예약 생성에 실패했습니다.' }
    }

    // 4. Generate order ID for payment
    const orderId = generateOrderId(userId, reservationData.program_id)

    // 5. Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        participant_id: participant.id,
        order_id: orderId,
        amount: discountCalculation.final_amount,
        currency: 'KRW',
        payment_method: reservationData.payment_method,
        status: 'pending'
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Error creating payment:', paymentError)
      // Rollback participant creation
      await supabase.from('program_participants').delete().eq('id', participant.id)
      return { success: false, error: '결제 정보 생성에 실패했습니다.' }
    }

    // 6. Update program participant count
    await supabase.rpc('increment_program_participants', {
      program_id: reservationData.program_id
    })

    // 7. Send reservation confirmation notification
    try {
      await sendReservationConfirmation(participant.id)
    } catch (error) {
      console.error('Error sending reservation confirmation:', error)
      // Don't fail the reservation if notification fails
    }

    return {
      success: true,
      reservation: {
        participant,
        payment,
        orderId,
        discountCalculation
      }
    }
  } catch (error) {
    console.error('Error in createProgramReservation:', error)
    return { success: false, error: '예약 처리 중 오류가 발생했습니다.' }
  }
}

/**
 * Get user reservations
 * @param userId - User ID
 * @returns User's reservations with program details
 */
export async function getUserReservations(userId: string): Promise<EnhancedReservation[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('program_participants')
      .select(`
        *,
        program:programs(
          title,
          start_date,
          end_date,
          location,
          instructor_name,
          thumbnail_url
        ),
        payment:payments(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user reservations:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserReservations:', error)
    return []
  }
}

/**
 * Cancel reservation
 * @param reservationId - Reservation ID
 * @param userId - User ID
 * @param reason - Cancellation reason
 * @returns Cancellation result
 */
export async function cancelReservation(
  reservationId: string,
  userId: string,
  reason: string
): Promise<{ success: boolean; refund?: RefundRequest; error?: string }> {
  const supabase = createClient()
  
  try {
    // 1. Get reservation details
    const { data: reservation } = await supabase
      .from('program_participants')
      .select(`
        *,
        program:programs(start_date, title),
        payment:payments(*)
      `)
      .eq('id', reservationId)
      .eq('user_id', userId)
      .single()

    if (!reservation) {
      return { success: false, error: '예약을 찾을 수 없습니다.' }
    }

    if (reservation.status === 'cancelled') {
      return { success: false, error: '이미 취소된 예약입니다.' }
    }

    // 2. Check cancellation policy
    const daysUntilStart = Math.ceil(
      (new Date(reservation.program.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )

    const refundRate = getRefundRate(daysUntilStart)
    const refundAmount = reservation.amount_paid * refundRate

    // 3. Update reservation status
    const { error: updateError } = await supabase
      .from('program_participants')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', reservationId)

    if (updateError) {
      console.error('Error updating reservation:', updateError)
      return { success: false, error: '예약 취소에 실패했습니다.' }
    }

    // 4. Create refund request if applicable
    let refundRequest = null
    if (refundAmount > 0 && reservation.payment?.status === 'completed') {
      const { data: refund } = await supabase
        .from('refunds')
        .insert({
          payment_id: reservation.payment.id,
          user_id: userId,
          amount: refundAmount,
          reason: reason,
          status: 'pending'
        })
        .select()
        .single()

      refundRequest = refund
    }

    // 5. Update program participant count
    await supabase.rpc('decrement_program_participants', {
      program_id: reservation.program_id
    })

    // 6. Process waitlist if available
    await processWaitlist(reservation.program_id)

    // 7. Send cancellation confirmation notification
    try {
      await sendCancellationConfirmation(reservationId, reason)
    } catch (error) {
      console.error('Error sending cancellation confirmation:', error)
      // Don't fail the cancellation if notification fails
    }

    return {
      success: true,
      refund: refundRequest
    }
  } catch (error) {
    console.error('Error in cancelReservation:', error)
    return { success: false, error: '예약 취소 처리 중 오류가 발생했습니다.' }
  }
}

// ================================
// WAITLIST MANAGEMENT
// ================================

/**
 * Add user to waitlist
 * @param userId - User ID
 * @param programId - Program ID
 * @returns Waitlist entry
 */
export async function addToWaitlist(userId: string, programId: string): Promise<WaitlistEntry | null> {
  const supabase = createClient()
  
  try {
    // Get current waitlist position
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact' })
      .eq('program_id', programId)

    const position = (count || 0) + 1

    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        user_id: userId,
        program_id: programId,
        position: position,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding to waitlist:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in addToWaitlist:', error)
    return null
  }
}

/**
 * Process waitlist when spots become available
 * @param programId - Program ID
 */
export async function processWaitlist(programId: string): Promise<void> {
  const supabase = createClient()
  
  try {
    // Get next person on waitlist
    const { data: waitlistEntry } = await supabase
      .from('waitlist')
      .select(`
        *,
        user:profiles(email, full_name)
      `)
      .eq('program_id', programId)
      .eq('notification_sent', false)
      .order('position', { ascending: true })
      .limit(1)
      .single()

    if (waitlistEntry) {
      // Send notification
      await supabase
        .from('notifications')
        .insert({
          user_id: waitlistEntry.user_id,
          title: '프로그램 자리가 생겼어요!',
          message: '대기 중이던 프로그램에 자리가 생겼습니다. 지금 바로 예약하세요.',
          type: 'program',
          action_url: `/programs/${programId}`
        })

      // Mark as notified
      await supabase
        .from('waitlist')
        .update({ notification_sent: true })
        .eq('id', waitlistEntry.id)
    }
  } catch (error) {
    console.error('Error processing waitlist:', error)
  }
}

// ================================
// DISCOUNT AND COUPON SYSTEM
// ================================

/**
 * Calculate discounts for a reservation
 * @param basePrice - Base program price
 * @param earlyBirdPrice - Early bird price
 * @param earlyBirdDeadline - Early bird deadline
 * @param couponCode - Coupon code
 * @returns Discount calculation
 */
export async function calculateDiscounts(
  basePrice: number,
  earlyBirdPrice?: number,
  earlyBirdDeadline?: string,
  couponCode?: string
): Promise<DiscountCalculation> {
  const supabase = createClient()
  
  let finalPrice = basePrice
  let totalDiscount = 0
  let appliedCoupon = null
  let earlyBirdDiscount = 0

  // Check early bird discount
  if (earlyBirdPrice && earlyBirdDeadline) {
    const now = new Date()
    const deadline = new Date(earlyBirdDeadline)
    
    if (now < deadline) {
      earlyBirdDiscount = basePrice - earlyBirdPrice
      finalPrice = earlyBirdPrice
      totalDiscount += earlyBirdDiscount
    }
  }

  // Check coupon discount
  if (couponCode) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode)
      .eq('is_active', true)
      .gte('valid_until', new Date().toISOString())
      .single()

    if (coupon && coupon.usage_limit > coupon.used_count) {
      let couponDiscount = 0
      
      if (coupon.discount_type === 'percentage') {
        couponDiscount = finalPrice * (coupon.discount_value / 100)
        if (coupon.max_discount) {
          couponDiscount = Math.min(couponDiscount, coupon.max_discount)
        }
      } else {
        couponDiscount = coupon.discount_value
      }

      if (coupon.min_amount && finalPrice < coupon.min_amount) {
        // Coupon not applicable
      } else {
        finalPrice -= couponDiscount
        totalDiscount += couponDiscount
        appliedCoupon = coupon

        // Update coupon usage
        await supabase
          .from('coupons')
          .update({ used_count: coupon.used_count + 1 })
          .eq('id', coupon.id)
      }
    }
  }

  return {
    original_amount: basePrice,
    discount_amount: totalDiscount,
    final_amount: Math.max(0, finalPrice),
    coupon_applied: appliedCoupon,
    early_bird_discount: earlyBirdDiscount
  }
}

/**
 * Validate coupon code
 * @param couponCode - Coupon code
 * @param programId - Program ID (optional)
 * @returns Coupon validation result
 */
export async function validateCoupon(
  couponCode: string,
  programId?: string
): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
  const supabase = createClient()
  
  try {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode)
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return { valid: false, error: '유효하지 않은 쿠폰 코드입니다.' }
    }

    // Check validity period
    const now = new Date()
    const validFrom = new Date(coupon.valid_from)
    const validUntil = new Date(coupon.valid_until)

    if (now < validFrom || now > validUntil) {
      return { valid: false, error: '쿠폰 사용 기간이 아닙니다.' }
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, error: '쿠폰 사용 한도가 초과되었습니다.' }
    }

    // Check program applicability
    if (programId && coupon.applicable_programs && coupon.applicable_programs.length > 0) {
      if (!coupon.applicable_programs.includes(programId)) {
        return { valid: false, error: '이 프로그램에는 사용할 수 없는 쿠폰입니다.' }
      }
    }

    return { valid: true, coupon }
  } catch (error) {
    console.error('Error validating coupon:', error)
    return { valid: false, error: '쿠폰 검증 중 오류가 발생했습니다.' }
  }
}

// ================================
// ANALYTICS AND REPORTING
// ================================

/**
 * Get reservation analytics
 * @param dateRange - Date range filter
 * @returns Reservation analytics
 */
export async function getReservationAnalytics(dateRange?: {
  start: string
  end: string
}): Promise<ReservationAnalytics> {
  const supabase = createClient()
  
  try {
    // Build date filter
    let dateFilter = ''
    if (dateRange) {
      dateFilter = `created_at.gte.${dateRange.start},created_at.lte.${dateRange.end}`
    }

    // Get reservation data
    const { data: reservations } = await supabase
      .from('program_participants')
      .select(`
        *,
        program:programs(title),
        payment:payments(amount)
      `)
      .filter(dateFilter || 'created_at', 'gte', '1970-01-01')

    // Calculate metrics
    const totalReservations = reservations?.length || 0
    const confirmedReservations = reservations?.filter(r => r.status === 'confirmed').length || 0
    const cancelledReservations = reservations?.filter(r => r.status === 'cancelled').length || 0
    const cancellationRate = totalReservations > 0 ? cancelledReservations / totalReservations : 0

    // Revenue by program
    const revenueByProgram = reservations?.reduce((acc, reservation) => {
      const programTitle = reservation.program?.title || 'Unknown'
      const amount = reservation.payment?.amount || 0
      
      if (!acc[programTitle]) {
        acc[programTitle] = { revenue: 0, count: 0 }
      }
      
      acc[programTitle].revenue += Number(amount)
      acc[programTitle].count += 1
      
      return acc
    }, {} as Record<string, { revenue: number; count: number }>)

    const revenueByProgramArray = Object.entries(revenueByProgram || {}).map(([name, data]) => ({
      program_id: '',
      program_name: name,
      revenue: data.revenue,
      participant_count: data.count
    }))

    return {
      total_reservations: totalReservations,
      confirmed_reservations: confirmedReservations,
      cancellation_rate: cancellationRate,
      average_booking_lead_time: 7, // TODO: Calculate actual lead time
      popular_time_slots: [], // TODO: Implement time slot analysis
      revenue_by_program: revenueByProgramArray,
      conversion_funnel: {
        page_views: 0, // TODO: Implement with analytics
        program_details_views: 0,
        reservation_started: 0,
        payment_attempted: 0,
        payment_completed: confirmedReservations
      }
    }
  } catch (error) {
    console.error('Error getting reservation analytics:', error)
    return {
      total_reservations: 0,
      confirmed_reservations: 0,
      cancellation_rate: 0,
      average_booking_lead_time: 0,
      popular_time_slots: [],
      revenue_by_program: [],
      conversion_funnel: {
        page_views: 0,
        program_details_views: 0,
        reservation_started: 0,
        payment_attempted: 0,
        payment_completed: 0
      }
    }
  }
}

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Get refund rate based on cancellation timing
 * @param daysUntilStart - Days until program starts
 * @returns Refund rate (0-1)
 */
function getRefundRate(daysUntilStart: number): number {
  if (daysUntilStart >= 14) return 1.0      // 100% refund
  if (daysUntilStart >= 7) return 0.8       // 80% refund
  if (daysUntilStart >= 3) return 0.5       // 50% refund
  if (daysUntilStart >= 1) return 0.2       // 20% refund
  return 0                                  // No refund
}