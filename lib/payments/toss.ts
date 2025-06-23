import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

// Types
type Payment = Database['public']['Tables']['payments']['Row']

/**
 * TossPayments 결제 위젯 초기화
 * 
 * ⚠️ DB Schema 참조: payments 테이블
 * - payment_key, order_id, amount, status 필드 활용
 */
export async function initiateTossPayment(paymentData: {
  orderId: string
  amount: number
  orderName: string
  customerEmail: string
  customerName: string
  userId: string
  programId?: string
  subscriptionId?: string
}) {
  const supabase = await createClient()

  try {
    // 1. Supabase에 결제 정보 저장 (DB Schema 준수)
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        user_id: paymentData.userId,
        order_id: paymentData.orderId,
        amount: paymentData.amount,
        currency: 'KRW',
        status: 'pending',
        participant_id: paymentData.programId ? undefined : null,
        subscription_id: paymentData.subscriptionId ? paymentData.subscriptionId : null,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('결제 정보 저장 실패:', error)
      throw new Error('결제 초기화에 실패했습니다.')
    }

    // 2. TossPayments 클라이언트 키 반환
    return {
      payment,
      clientKey: process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payments/success`,
      failUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payments/fail`
    }

  } catch (error) {
    console.error('TossPayments 초기화 에러:', error)
    throw new Error('결제 시스템 초기화에 실패했습니다.')
  }
}

/**
 * TossPayments 결제 승인
 * 
 * ⚠️ DB Schema 참조: payments 테이블 status 필드 업데이트
 */
export async function confirmTossPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const supabase = await createClient()

  try {
    // 1. TossPayments API 결제 승인 요청
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.TOSS_PAYMENTS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`결제 승인 실패: ${errorData.message}`)
    }

    const tossPaymentData = await response.json()

    // 2. Supabase 결제 상태 업데이트 (DB Schema 준수)
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        payment_key: paymentKey,
        status: 'completed',
        toss_payment_data: tossPaymentData,
        paid_at: tossPaymentData.approvedAt,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)
      .select()
      .single()

    if (error) {
      console.error('결제 상태 업데이트 실패:', error)
      throw new Error('결제 정보 업데이트에 실패했습니다.')
    }

    // 3. 결제 완료 후 비즈니스 로직 처리
    await handlePaymentSuccess(payment)

    return {
      success: true,
      payment,
      tossData: tossPaymentData
    }

  } catch (error) {
    console.error('결제 승인 에러:', error)
    
    // 결제 실패 시 상태 업데이트
    await supabase
      .from('payments')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId)

    throw error
  }
}

/**
 * 결제 완료 후 비즈니스 로직 처리
 * 
 * ⚠️ DB Schema 참조: 
 * - program_participants 테이블 (프로그램 등록)
 * - user_subscriptions 테이블 (구독 활성화)
 */
async function handlePaymentSuccess(payment: Payment) {
  const supabase = await createClient()

  try {
    // 프로그램 결제인 경우
    if (payment.participant_id) {
      // 참가자 상태를 confirmed로 업데이트
      await supabase
        .from('program_participants')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.participant_id)
    }

    // 구독 결제인 경우
    if (payment.subscription_id) {
      // 구독 상태를 active로 업데이트
      await supabase
        .from('user_subscriptions')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.subscription_id)
    }

    // 알림 생성
    await supabase
      .from('notifications')
      .insert([{
        user_id: payment.user_id,
        title: '결제 완료',
        message: '결제가 성공적으로 완료되었습니다.',
        type: 'payment',
        created_at: new Date().toISOString()
      }])

  } catch (error) {
    console.error('결제 완료 처리 에러:', error)
  }
} 