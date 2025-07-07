import { createClient } from '@/lib/supabase/client'
import { sendProgramReminder } from './notifications'

/**
 * Send program reminders for programs starting in 24 hours
 * This function should be called by a scheduled task (cron job, webhook, etc.)
 */
export async function sendScheduledProgramReminders(): Promise<{ success: boolean; sent: number; error?: string }> {
  const supabase = createClient()
  
  try {
    // Calculate 24 hours from now
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0) // Start of tomorrow
    
    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(dayAfter.getDate() + 1) // End of tomorrow
    
    // Get programs starting tomorrow
    const { data: programs, error } = await supabase
      .from('programs')
      .select('id, title, start_date')
      .gte('start_date', tomorrow.toISOString())
      .lt('start_date', dayAfter.toISOString())
      .eq('status', 'open')
    
    if (error) {
      console.error('Error fetching programs for reminders:', error)
      return { success: false, sent: 0, error: '프로그램 조회에 실패했습니다.' }
    }
    
    if (!programs || programs.length === 0) {
      return { success: true, sent: 0 }
    }
    
    // Send reminders for each program
    let successCount = 0
    for (const program of programs) {
      try {
        const result = await sendProgramReminder(program.id)
        if (result.success) {
          successCount++
        }
      } catch (error) {
        console.error(`Error sending reminder for program ${program.id}:`, error)
      }
    }
    
    return { success: true, sent: successCount }
  } catch (error) {
    console.error('Error in sendScheduledProgramReminders:', error)
    return { success: false, sent: 0, error: '예약된 알림 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Clean up expired waitlist entries
 * This function should be called periodically to remove expired waitlist entries
 */
export async function cleanupExpiredWaitlistEntries(): Promise<{ success: boolean; cleaned: number; error?: string }> {
  const supabase = createClient()
  
  try {
    // Delete expired waitlist entries
    const { data, error } = await supabase
      .from('waitlist')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id')
    
    if (error) {
      console.error('Error cleaning up waitlist entries:', error)
      return { success: false, cleaned: 0, error: '대기 목록 정리에 실패했습니다.' }
    }
    
    return { success: true, cleaned: data?.length || 0 }
  } catch (error) {
    console.error('Error in cleanupExpiredWaitlistEntries:', error)
    return { success: false, cleaned: 0, error: '대기 목록 정리 중 오류가 발생했습니다.' }
  }
}

/**
 * Send feedback request notifications for completed programs
 * This function should be called periodically to request feedback from participants
 */
export async function sendFeedbackRequests(): Promise<{ success: boolean; sent: number; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get programs that ended 1 day ago and haven't sent feedback requests yet
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    oneDayAgo.setHours(23, 59, 59, 999) // End of yesterday
    
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    twoDaysAgo.setHours(0, 0, 0, 0) // Start of day before yesterday
    
    const { data: programs, error } = await supabase
      .from('programs')
      .select(`
        id, 
        title, 
        end_date,
        program_participants!inner(
          user_id,
          status,
          feedback_requested
        )
      `)
      .gte('end_date', twoDaysAgo.toISOString())
      .lt('end_date', oneDayAgo.toISOString())
      .eq('status', 'completed')
    
    if (error) {
      console.error('Error fetching completed programs:', error)
      return { success: false, sent: 0, error: '완료된 프로그램 조회에 실패했습니다.' }
    }
    
    if (!programs || programs.length === 0) {
      return { success: true, sent: 0 }
    }
    
    let successCount = 0
    
    for (const program of programs) {
      // Get participants who haven't received feedback requests yet
      const eligibleParticipants = program.program_participants.filter(
        p => p.status === 'completed' && !p.feedback_requested
      )
      
      for (const participant of eligibleParticipants) {
        try {
          // Send feedback request notification
          const { sendNotification } = await import('./notifications')
          
          const result = await sendNotification(participant.user_id, {
            title: '프로그램 후기를 남겨주세요',
            message: `${program.title} 프로그램은 어떠셨나요? 소중한 후기와 평점을 남겨주시면 다른 분들에게 큰 도움이 됩니다.`,
            type: 'feedback_request',
            channels: ['email', 'in_app'],
            priority: 'normal',
            action_url: `/programs/${program.id}/feedback`,
            metadata: {
              program_id: program.id,
              program_title: program.title
            }
          })
          
          if (result.success) {
            // Mark as feedback requested
            await supabase
              .from('program_participants')
              .update({ feedback_requested: true })
              .eq('user_id', participant.user_id)
              .eq('program_id', program.id)
            
            successCount++
          }
        } catch (error) {
          console.error(`Error sending feedback request to user ${participant.user_id}:`, error)
        }
      }
    }
    
    return { success: true, sent: successCount }
  } catch (error) {
    console.error('Error in sendFeedbackRequests:', error)
    return { success: false, sent: 0, error: '후기 요청 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Send subscription renewal reminders
 * This function should be called periodically to remind users about upcoming subscription renewals
 */
export async function sendSubscriptionRenewalReminders(): Promise<{ success: boolean; sent: number; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get subscriptions expiring in 7 days
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    
    const eightDaysFromNow = new Date()
    eightDaysFromNow.setDate(eightDaysFromNow.getDate() + 8)
    
    const { data: subscriptions, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plan:subscription_plans(name, price),
        profile:profiles(full_name, email)
      `)
      .gte('expires_at', sevenDaysFromNow.toISOString())
      .lt('expires_at', eightDaysFromNow.toISOString())
      .eq('status', 'active')
      .eq('renewal_reminder_sent', false)
    
    if (error) {
      console.error('Error fetching expiring subscriptions:', error)
      return { success: false, sent: 0, error: '만료 예정 구독 조회에 실패했습니다.' }
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      return { success: true, sent: 0 }
    }
    
    let successCount = 0
    
    for (const subscription of subscriptions) {
      try {
        const { sendNotification } = await import('./notifications')
        
        const result = await sendNotification(subscription.user_id, {
          title: '구독 갱신 안내',
          message: `${subscription.subscription_plan.name} 구독이 7일 후 만료됩니다. 계속 이용하시려면 갱신해주세요.`,
          type: 'subscription',
          channels: ['email', 'in_app'],
          priority: 'high',
          action_url: `/dashboard/subscription`,
          metadata: {
            subscription_id: subscription.id,
            plan_name: subscription.subscription_plan.name,
            expires_at: subscription.expires_at
          }
        })
        
        if (result.success) {
          // Mark reminder as sent
          await supabase
            .from('user_subscriptions')
            .update({ renewal_reminder_sent: true })
            .eq('id', subscription.id)
          
          successCount++
        }
      } catch (error) {
        console.error(`Error sending renewal reminder for subscription ${subscription.id}:`, error)
      }
    }
    
    return { success: true, sent: successCount }
  } catch (error) {
    console.error('Error in sendSubscriptionRenewalReminders:', error)
    return { success: false, sent: 0, error: '구독 갱신 알림 발송 중 오류가 발생했습니다.' }
  }
}

/**
 * Main scheduled task runner
 * This function should be called by a cron job or scheduled webhook
 */
export async function runScheduledNotificationTasks(): Promise<{
  success: boolean
  results: {
    program_reminders: { sent: number; error?: string }
    waitlist_cleanup: { cleaned: number; error?: string }
    feedback_requests: { sent: number; error?: string }
    renewal_reminders: { sent: number; error?: string }
  }
}> {
  console.log('Starting scheduled notification tasks...')
  
  const results = {
    program_reminders: { sent: 0 },
    waitlist_cleanup: { cleaned: 0 },
    feedback_requests: { sent: 0 },
    renewal_reminders: { sent: 0 }
  }
  
  try {
    // Run all scheduled tasks
    const [
      reminderResult,
      cleanupResult,
      feedbackResult,
      renewalResult
    ] = await Promise.allSettled([
      sendScheduledProgramReminders(),
      cleanupExpiredWaitlistEntries(),
      sendFeedbackRequests(),
      sendSubscriptionRenewalReminders()
    ])
    
    // Process results
    if (reminderResult.status === 'fulfilled') {
      results.program_reminders = reminderResult.value
    } else {
      results.program_reminders.error = reminderResult.reason?.message || 'Unknown error'
    }
    
    if (cleanupResult.status === 'fulfilled') {
      results.waitlist_cleanup = cleanupResult.value
    } else {
      results.waitlist_cleanup.error = cleanupResult.reason?.message || 'Unknown error'
    }
    
    if (feedbackResult.status === 'fulfilled') {
      results.feedback_requests = feedbackResult.value
    } else {
      results.feedback_requests.error = feedbackResult.reason?.message || 'Unknown error'
    }
    
    if (renewalResult.status === 'fulfilled') {
      results.renewal_reminders = renewalResult.value
    } else {
      results.renewal_reminders.error = renewalResult.reason?.message || 'Unknown error'
    }
    
    console.log('Scheduled notification tasks completed:', results)
    
    return { success: true, results }
  } catch (error) {
    console.error('Error running scheduled notification tasks:', error)
    return {
      success: false,
      results: {
        ...results,
        program_reminders: { sent: 0, error: 'Task runner failed' },
        waitlist_cleanup: { cleaned: 0, error: 'Task runner failed' },
        feedback_requests: { sent: 0, error: 'Task runner failed' },
        renewal_reminders: { sent: 0, error: 'Task runner failed' }
      }
    }
  }
}