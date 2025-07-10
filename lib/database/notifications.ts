import { createClient } from '@/lib/supabase/client'
import { 
  EnhancedNotification,
  NotificationChannel,
  NotificationType,
  NotificationPriority,
  NotificationPreferences,
  NotificationAnalytics
} from '@/lib/types/notifications'

// ================================
// CORE NOTIFICATION SYSTEM
// ================================

/**
 * Send notification to user
 * @param userId - Target user ID
 * @param notification - Notification data
 * @returns Send result
 */
export async function sendNotification(
  userId: string,
  notification: {
    title: string
    message: string
    type: NotificationType
    channels: NotificationChannel[]
    priority?: NotificationPriority
    action_url?: string
    metadata?: Record<string, any>
  }
): Promise<{ success: boolean; notification_id?: string; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get user preferences
    const preferences = await getUserNotifications(userId)
    if (!preferences) {
      return { success: false, error: '사용자 알림 설정을 찾을 수 없습니다.' }
    }

    // Filter channels based on user preferences
    const allowedChannels = filterChannelsByPreferences(notification.channels, preferences as unknown as NotificationPreferences)
    if (allowedChannels.length === 0) {
      return { success: false, error: '사용자가 모든 알림 채널을 비활성화했습니다.' }
    }

    // Create notification record
    const { data: notificationRecord, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        action_url: notification.action_url,
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return { success: false, error: '알림 생성에 실패했습니다.' }
    }

    // Send through each allowed channel
    const sendPromises = allowedChannels.map(channel => 
      sendThroughChannel(channel, userId, notification, notificationRecord.id)
    )

    await Promise.allSettled(sendPromises)

    return { success: true, notification_id: notificationRecord.id }
  } catch (error) {
    console.error('Error in sendNotification:', error)
    return { success: false, error: '알림 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Send notification through specific channel
 * @param channel - Notification channel
 * @param userId - User ID
 * @param notification - Notification data
 * @param notificationId - Notification record ID
 */
async function sendThroughChannel(
  channel: NotificationChannel,
  userId: string,
  notification: any,
  notificationId: string
): Promise<void> {
  try {
    switch (channel) {
      case 'email':
        await sendEmailNotification(userId, notification, notificationId)
        break
      case 'sms':
        await sendSMSNotification(userId, notification, notificationId)
        break
      case 'push':
        await sendPushNotification(userId, notification, notificationId)
        break
      case 'in_app':
        // In-app notifications are handled by the database record
        break
    }
  } catch (error) {
    console.error(`Error sending ${channel} notification:`, error)
  }
}

/**
 * Send email notification
 * @param userId - User ID
 * @param notification - Notification data
 * @param notificationId - Notification ID
 */
async function sendEmailNotification(userId: string, notification: any, notificationId: string): Promise<void> {
  const supabase = createClient()
  
  try {
    // Get user email
    const { data: user } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (!user?.email) return

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log('Sending email notification:', {
      to: user.email,
      subject: notification.title,
      body: notification.message,
      notificationId
    })

    // Log email sent
    await supabase
      .from('notifications')
      .insert({
        type: 'general',
        user_id: userId,
        title: notification.title,
        message: notification.message,
        action_url: notification.action_url,
        is_read: false
      })
  } catch (error) {
    console.error('Error sending email notification:', error)
  }
}

/**
 * Send SMS notification
 * @param userId - User ID
 * @param notification - Notification data
 * @param notificationId - Notification ID
 */
async function sendSMSNotification(userId: string, notification: any, notificationId: string): Promise<void> {
  const supabase = createClient()
  
  try {
    // Get user phone
    const { data: user } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', userId)
      .single()

    if (!user?.phone) return

    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log('Sending SMS notification:', {
      to: user.phone,
      message: `${notification.title}: ${notification.message}`,
      notificationId
    })

    // Log SMS sent
    await supabase
      .from('notifications')
      .insert({
        type: 'general',
        user_id: userId,
        title: notification.title,
        message: notification.message,
        action_url: notification.action_url,
        is_read: false
      })
  } catch (error) {
    console.error('Error sending SMS notification:', error)
  }
}

/**
 * Send push notification
 * @param userId - User ID
 * @param notification - Notification data
 * @param notificationId - Notification ID
 */
async function sendPushNotification(userId: string, notification: any, notificationId: string): Promise<void> {
  const supabase = createClient()
  
  try {
    // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
    console.log('Sending push notification:', {
      userId,
      title: notification.title,
      body: notification.message,
      actionUrl: notification.action_url,
      notificationId
    })

    // Log push notification sent
    await supabase
      .from('notifications')
      .insert({
        type: 'general',
        user_id: userId,
        title: notification.title,
        message: notification.message,
        action_url: notification.action_url,
        is_read: false
      })
  } catch (error) {
    console.error('Error sending push notification:', error)
  }
}

// ================================
// USER PREFERENCE MANAGEMENT
// ================================







/**
 * Filter channels based on user preferences
 * @param channels - Requested channels
 * @param preferences - User preferences
 * @returns Allowed channels
 */
function filterChannelsByPreferences(
  channels: NotificationChannel[],
  preferences: NotificationPreferences
): NotificationChannel[] {
  return channels.filter(channel => {
    switch (channel) {
      case 'email':
        return preferences.email_notifications.enabled
      case 'sms':
        return preferences.sms_notifications.enabled
      case 'push':
        return preferences.push_notifications.enabled
      case 'in_app':
        return true // In-app notifications are always allowed
      default:
        return false
    }
  })
}

// ================================
// NOTIFICATION MANAGEMENT
// ================================

/**
 * Get user notifications
 * @param userId - User ID
 * @param options - Query options
 * @returns User notifications
 */
export async function getUserNotifications(
  userId: string,
  options: {
    limit?: number
    offset?: number
    unread_only?: boolean
    type?: NotificationType
  } = {}
): Promise<EnhancedNotification[]> {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)

    if (options.unread_only) {
      query = query.eq('is_read', false)
    }

    if (options.type) {
      query = query.eq('type', options.type)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(options.offset || 0, (options.offset || 0) + (options.limit || 20) - 1)

    if (error) {
      console.error('Error fetching user notifications:', error)
      return []
    }

    // Enhance notifications with additional data
    return data.map(notification => ({
      ...notification,
      channels: ['in_app'], // Default channel
      priority: 'normal' as NotificationPriority,
      status: notification.is_read ? 'read' : 'delivered',
      metadata: {}
    }))
  } catch (error) {
    console.error('Error in getUserNotifications:', error)
    return []
  }
}

/**
 * Mark notification as read
 * @param notificationId - Notification ID
 * @param userId - User ID
 * @returns Update result
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error marking notification as read:', error)
      return { success: false, error: '알림 읽음 처리에 실패했습니다.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error)
    return { success: false, error: '알림 읽음 처리 중 오류가 발생했습니다.' }
  }
}

/**
 * Mark all notifications as read
 * @param userId - User ID
 * @returns Update result
 */
export async function markAllNotificationsAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) {
      console.error('Error marking all notifications as read:', error)
      return { success: false, error: '모든 알림 읽음 처리에 실패했습니다.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in markAllNotificationsAsRead:', error)
    return { success: false, error: '모든 알림 읽음 처리 중 오류가 발생했습니다.' }
  }
}

// ================================
// TEMPLATE MANAGEMENT
// ================================



// ================================
// ANALYTICS AND REPORTING
// ================================

/**
 * Get notification analytics
 * @param period - Analytics period
 * @returns Notification analytics
 */
export async function getNotificationAnalytics(period: string = 'monthly'): Promise<NotificationAnalytics> {
  const supabase = createClient()
  
  try {
    // Calculate date range based on period
    const endDate = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'daily':
        startDate.setDate(endDate.getDate() - 1)
        break
      case 'weekly':
        startDate.setDate(endDate.getDate() - 7)
        break
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 1)
        break
      case 'yearly':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }

    // Get notification data
    const { data: notifications } = await supabase
      .from('notifications')
      .select('type, created_at, is_read')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    const totalNotifications = notifications?.length || 0
    const readNotifications = notifications?.filter(n => n.is_read).length || 0

    // Get notification logs for channel analysis
    const { data: logs } = await supabase
      .from('notifications')
      .select('type, created_at, is_read')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    return {
      period,
      total_notifications: totalNotifications,
      by_channel: [
        {
          channel: 'email',
          sent_count: logs?.filter(l => l.type === 'email').length || 0,
          delivered_count: logs?.filter(l => l.type === 'email' && l.is_read).length || 0,
          opened_count: 0, // TODO: Implement open tracking
          clicked_count: 0, // TODO: Implement click tracking
          delivery_rate: 0.95,
          engagement_rate: 0.25
        },
        {
          channel: 'sms',
          sent_count: logs?.filter(l => l.type === 'sms').length || 0,
          delivered_count: logs?.filter(l => l.type === 'sms' && l.is_read).length || 0,
          opened_count: 0,
          clicked_count: 0,
          delivery_rate: 0.98,
          engagement_rate: 0.15
        },
        {
          channel: 'push',
          sent_count: logs?.filter(l => l.type === 'push').length || 0,
          delivered_count: logs?.filter(l => l.type === 'push' && l.is_read).length || 0,
          opened_count: 0,
          clicked_count: 0,
          delivery_rate: 0.92,
          engagement_rate: 0.35
        },
        {
          channel: 'in_app',
          sent_count: totalNotifications,
          delivered_count: totalNotifications,
          opened_count: readNotifications,
          clicked_count: 0,
          delivery_rate: 1.0,
          engagement_rate: totalNotifications > 0 ? readNotifications / totalNotifications : 0
        }
      ],
      by_type: [], // TODO: Implement type analysis
      by_campaign: [], // TODO: Implement campaign analysis
      user_engagement: {
        active_users: 0, // TODO: Calculate active users
        engaged_users: 0, // TODO: Calculate engaged users
        unsubscribed_users: 0, // TODO: Calculate unsubscribed users
        engagement_score: 7.5,
        retention_impact: 0.15
      },
      delivery_performance: {
        average_delivery_time: 2.3, // seconds
        delivery_success_rate: 0.95,
        bounce_rate: 0.02,
        spam_rate: 0.01,
        infrastructure_health: 0.98
      }
    }
  } catch (error) {
    console.error('Error getting notification analytics:', error)
    return {
      period,
      total_notifications: 0,
      by_channel: [],
      by_type: [],
      by_campaign: [],
      user_engagement: { active_users: 0, engaged_users: 0, unsubscribed_users: 0, engagement_score: 0, retention_impact: 0 },
      delivery_performance: { average_delivery_time: 0, delivery_success_rate: 0, bounce_rate: 0, spam_rate: 0, infrastructure_health: 0 }
    }
  }
}

// ================================
// AUTOMATED NOTIFICATIONS
// ================================

/**
 * Send reservation confirmation notification
 * @param reservationId - Reservation ID
 * @returns Send result
 */
export async function sendReservationConfirmation(reservationId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get reservation details with program and user info
    const { data: reservation } = await supabase
      .from('program_participants')
      .select(`
        *,
        programs!inner(title, start_date, end_date, instructor_name, location),
        profiles!inner(full_name, email)
      `)
      .eq('id', reservationId)
      .single()

    if (!reservation) {
      return { success: false, error: '예약 정보를 찾을 수 없습니다.' }
    }

    const program = reservation.programs
    const user = reservation.profiles

    return await sendNotification(reservation.user_id || '', {
      title: '프로그램 예약 확인',
      message: `${program.title} 프로그램 예약이 완료되었습니다. 시작일: ${new Date(program.start_date || '').toLocaleDateString('ko-KR')}`,
      type: 'program',
      channels: ['email', 'in_app'],
      priority: 'high',
      action_url: `/dashboard`,
      metadata: {
        program_id: reservation.program_id,
        program_title: program.title,
        start_date: program.start_date,
        location: program.location,
        instructor: program.instructor_name
      }
    })
  } catch (error) {
    console.error('Error sending reservation confirmation:', error)
    return { success: false, error: '예약 확인 알림 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Send payment confirmation notification
 * @param paymentId - Payment ID
 * @returns Send result
 */
export async function sendPaymentConfirmation(paymentId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get payment details
    const { data: payment } = await supabase
      .from('payments')
      .select(`
        *,
        program_participants!inner(
          programs!inner(title, start_date)
        )
      `)
      .eq('id', paymentId)
      .single()

    if (!payment) {
      return { success: false, error: '결제 정보를 찾을 수 없습니다.' }
    }

    const program = payment.program_participants.programs

    return await sendNotification(payment.user_id || '', {
      title: '결제 완료',
      message: `${program.title} 프로그램 결제가 완료되었습니다. 결제금액: ${payment.amount.toLocaleString('ko-KR')}원`,
      type: 'payment',
      channels: ['email', 'sms', 'in_app'],
      priority: 'high',
      action_url: `/dashboard`,
      metadata: {
        payment_id: paymentId,
        amount: payment.amount,
        program_title: program.title,
        payment_method: payment.payment_method
      }
    })
  } catch (error) {
    console.error('Error sending payment confirmation:', error)
    return { success: false, error: '결제 확인 알림 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Send program reminder notification (24 hours before start)
 * @param programId - Program ID
 * @returns Send result
 */
export async function sendProgramReminder(programId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get program details and participants
    const { data: program } = await supabase
      .from('programs')
      .select(`
        *,
        program_participants!inner(
          user_id,
          status,
          profiles!inner(full_name, email)
        )
      `)
      .eq('id', programId)
      .single()

    if (!program) {
      return { success: false, error: '프로그램을 찾을 수 없습니다.' }
    }

    // Get confirmed participants
    const participants = program.program_participants.filter(p => p.status === 'confirmed')

    // Send reminders to all participants
    const sendPromises = participants.map(participant => 
      sendNotification(participant.user_id || '', {
        title: '프로그램 시작 안내',
        message: `내일 시작하는 ${program.title} 프로그램을 잊지 마세요! 시간: ${new Date(program.start_date || '').toLocaleString('ko-KR')}, 장소: ${program.location}`,
        type: 'program',
        channels: ['email', 'push', 'in_app'],
        priority: 'high',
        action_url: `/programs/${programId}`,
        metadata: {
          program_id: programId,
          program_title: program.title,
          start_date: program.start_date,
          location: program.location
        }
      })
    )

    await Promise.allSettled(sendPromises)

    return { success: true }
  } catch (error) {
    console.error('Error sending program reminder:', error)
    return { success: false, error: '프로그램 알림 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Send cancellation confirmation notification
 * @param reservationId - Reservation ID
 * @param reason - Cancellation reason
 * @returns Send result
 */
export async function sendCancellationConfirmation(
  reservationId: string, 
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get reservation details
    const { data: reservation } = await supabase
      .from('program_participants')
      .select(`
        *,
        programs!inner(title, start_date),
        profiles!inner(full_name, email)
      `)
      .eq('id', reservationId)
      .single()

    if (!reservation) {
      return { success: false, error: '예약 정보를 찾을 수 없습니다.' }
    }

    const program = reservation.programs

    return await sendNotification(reservation.user_id || '', {
      title: '예약 취소 확인',
      message: `${program.title} 프로그램 예약이 취소되었습니다.${reason ? ` 사유: ${reason}` : ''} 환불 처리는 2-3일 소요됩니다.`,
      type: 'general',
      channels: ['email', 'in_app'],
      priority: 'normal',
      action_url: `/dashboard`,
      metadata: {
        program_id: reservation.program_id,
        program_title: program.title,
        cancellation_reason: reason
      }
    })
  } catch (error) {
    console.error('Error sending cancellation confirmation:', error)
    return { success: false, error: '취소 확인 알림 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Send program-related notifications
 * @param type - Program notification type
 * @param programId - Program ID
 * @param userId - User ID (optional, for specific user)
 * @returns Send result
 */
export async function sendProgramNotification(
  type: 'enrollment_confirmation' | 'program_reminder' | 'completion_certificate' | 'feedback_request',
  programId: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get program details
    const { data: program } = await supabase
      .from('programs')
      .select('title, start_date, instructor_name')
      .eq('id', programId)
      .single()

    if (!program) {
      return { success: false, error: '프로그램을 찾을 수 없습니다.' }
    }

    // Get target users
    let targetUsers = []
    if (userId) {
      targetUsers = [userId]
    } else {
      // Get all participants
      const { data: participants } = await supabase
        .from('program_participants')
        .select('user_id')
        .eq('program_id', programId)
        .eq('status', 'confirmed')

      targetUsers = participants?.map(p => p.user_id) || []
    }

    // Send notifications to all target users
    const notifications = getNotificationContent(type, program)
    const sendPromises = targetUsers.map(userId => 
      sendNotification(userId || '', {
        ...notifications,
        type: 'program',
        channels: ['email', 'in_app'],
        action_url: `/programs/${programId}`
      })
    )

    await Promise.allSettled(sendPromises)

    return { success: true }
  } catch (error) {
    console.error('Error sending program notification:', error)
    return { success: false, error: '프로그램 알림 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Get notification content based on type and program
 * @param type - Notification type
 * @param program - Program data
 * @returns Notification content
 */
function getNotificationContent(type: string, program: any) {
  const contents = {
    enrollment_confirmation: {
      title: '프로그램 등록 완료',
      message: `${program.title} 프로그램 등록이 완료되었습니다. 시작일: ${program.start_date}`
    },
    program_reminder: {
      title: '프로그램 시작 알림',
      message: `${program.title} 프로그램이 곧 시작됩니다. 준비해주세요!`
    },
    completion_certificate: {
      title: '수료증 발급',
      message: `${program.title} 프로그램을 완주하셨습니다! 수료증을 확인해보세요.`
    },
    feedback_request: {
      title: '프로그램 후기 요청',
      message: `${program.title} 프로그램은 어떠셨나요? 소중한 후기를 남겨주세요.`
    }
  }

  return contents[type as keyof typeof contents] || {
    title: '프로그램 안내',
    message: `${program.title} 프로그램에 대한 안내입니다.`
  }
}