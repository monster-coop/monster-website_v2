import { createClient } from '@/lib/supabase/client'
import { 
  EnhancedSubscriptionPlan,
  UserSubscription,
  SubscriptionStatus,
  BillingCycle,
  LMSProgress,
  LearningRecommendations,
  SubscriptionUsage,
  LMSAnalytics
} from '@/lib/types/subscriptions'

// ================================
// SUBSCRIPTION PLAN MANAGEMENT
// ================================

/**
 * Get all subscription plans
 * @returns Available subscription plans
 */
export async function getSubscriptionPlans(): Promise<EnhancedSubscriptionPlan[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching subscription plans:', error)
      return []
    }

    // Enhance plans with feature comparison
    const enhancedPlans = data.map(plan => ({
      ...plan,
      discount_percentage: plan.price_yearly && plan.price_monthly ? 
        Math.round((1 - (plan.price_yearly / 12) / plan.price_monthly) * 100) : 0,
      trial_period_days: plan.trial_days || 14,
      feature_comparison: getFeatureComparison()
    }))

    return enhancedPlans
  } catch (error) {
    console.error('Error in getSubscriptionPlans:', error)
    return []
  }
}

/**
 * Get feature comparison for plans
 * @returns Feature comparison object
 */
function getFeatureComparison() {
  return {
    basic: [
      '기본 LRS 대시보드',
      '개인 학습 진도 추적',
      '월 50시간 학습 콘텐츠',
      '기본 성취도 분석',
      '이메일 지원'
    ],
    pro: [
      '고급 분석 대시보드',
      '맞춤형 학습 추천',
      '무제한 학습 콘텐츠',
      '실시간 피드백',
      '팀 프로젝트 관리',
      '우선 지원'
    ],
    enterprise: [
      '조직 관리 도구',
      'API 연동',
      '커스텀 브랜딩',
      '고급 보고서',
      '전용 계정 매니저',
      '24/7 지원',
      'SSO 연동'
    ]
  }
}

// ================================
// USER SUBSCRIPTION MANAGEMENT
// ================================

/**
 * Create user subscription
 * @param userId - User ID
 * @param planId - Subscription plan ID
 * @param billingCycle - Billing cycle
 * @returns Created subscription
 */
export async function createUserSubscription(
  userId: string,
  planId: string,
  billingCycle: BillingCycle
): Promise<{ success: boolean; subscription?: UserSubscription; error?: string }> {
  const supabase = createClient()
  
  try {
    // Get plan details
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (!plan) {
      return { success: false, error: '구독 플랜을 찾을 수 없습니다.' }
    }

    // Check for existing active subscription
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['trial', 'active'])
      .single()

    if (existingSubscription) {
      return { success: false, error: '이미 활성화된 구독이 있습니다.' }
    }

    // Calculate subscription dates
    const now = new Date()
    const trialEnd = new Date(now.getTime() + (plan.trial_days || 14) * 24 * 60 * 60 * 1000)
    const periodEnd = billingCycle === 'yearly' ? 
      new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) :
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Create subscription
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'trial',
        billing_cycle: billingCycle,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        trial_end: trialEnd.toISOString(),
        cancel_at_period_end: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return { success: false, error: '구독 생성에 실패했습니다.' }
    }

    // Initialize LMS progress
    await initializeLMSProgress(userId)

    return { success: true, subscription }
  } catch (error) {
    console.error('Error in createUserSubscription:', error)
    return { success: false, error: '구독 처리 중 오류가 발생했습니다.' }
  }
}

/**
 * Get user's active subscription
 * @param userId - User ID
 * @returns User's active subscription with plan details
 */
export async function getUserSubscription(userId: string): Promise<(UserSubscription & { plan: EnhancedSubscriptionPlan }) | null> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .in('status', ['trial', 'active', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching user subscription:', error)
      return null
    }

    return data as any
  } catch (error) {
    console.error('Error in getUserSubscription:', error)
    return null
  }
}

/**
 * Update subscription status
 * @param subscriptionId - Subscription ID
 * @param status - New status
 * @returns Update result
 */
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: SubscriptionStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('user_subscriptions')
      .update(updateData)
      .eq('id', subscriptionId)

    if (error) {
      console.error('Error updating subscription status:', error)
      return { success: false, error: '구독 상태 업데이트에 실패했습니다.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateSubscriptionStatus:', error)
    return { success: false, error: '구독 상태 업데이트 중 오류가 발생했습니다.' }
  }
}

// ================================
// LMS PROGRESS TRACKING
// ================================

/**
 * Initialize LMS progress for new subscriber
 * @param userId - User ID
 */
async function initializeLMSProgress(userId: string): Promise<void> {
  const supabase = createClient()
  
  try {
    await supabase
      .from('learning_progress' as any)
      .insert({
        user_id: userId,
        total_courses: 0,
        completed_courses: 0,
        completion_percentage: 0,
        total_study_time: 0,
        streak_days: 0,
        last_activity: new Date().toISOString(),
        achievements: [],
        learning_path: []
      })
  } catch (error) {
    console.error('Error initializing LMS progress:', error)
  }
}

/**
 * Get user's LMS progress
 * @param userId - User ID
 * @returns LMS progress data
 */
export async function getLMSProgress(userId: string): Promise<LMSProgress | null> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('learning_progress' as any)
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching LMS progress:', error)
      return null
    }

    return data as any
  } catch (error) {
    console.error('Error in getLMSProgress:', error)
    return null
  }
}

/**
 * Update learning progress
 * @param userId - User ID
 * @param progressUpdate - Progress update data
 * @returns Update result
 */
export async function updateLMSProgress(
  userId: string,
  progressUpdate: Partial<LMSProgress>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('learning_progress' as any)
      .update({
        ...progressUpdate,
        last_activity: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating LMS progress:', error)
      return { success: false, error: '학습 진도 업데이트에 실패했습니다.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateLMSProgress:', error)
    return { success: false, error: '학습 진도 업데이트 중 오류가 발생했습니다.' }
  }
}

// ================================
// LEARNING RECOMMENDATIONS
// ================================

/**
 * Get personalized learning recommendations
 * @param userId - User ID
 * @returns Learning recommendations
 */
export async function getLearningRecommendations(userId: string): Promise<LearningRecommendations | null> {
  const supabase = createClient()
  
  try {
    // Get user's learning progress and preferences
    const progress = await getLMSProgress(userId)
    if (!progress) return null

    // Get user's subscription plan for feature access
    const subscription = await getUserSubscription(userId)
    if (!subscription || !['pro', 'enterprise'].includes(subscription.plan.slug)) {
      // Basic plan users get limited recommendations
      return getBasicRecommendations()
    }

    // Advanced recommendations for Pro/Enterprise users
    return getAdvancedRecommendations(userId, progress)
  } catch (error) {
    console.error('Error in getLearningRecommendations:', error)
    return null
  }
}

/**
 * Get basic recommendations for Basic plan users
 * @returns Basic recommendations
 */
function getBasicRecommendations(): LearningRecommendations {
  return {
    recommended_courses: [],
    recommended_paths: [],
    skill_gaps: [],
    study_schedule: {
      optimal_times: ['09:00', '14:00', '19:00'],
      recommended_duration: 30,
      weekly_goal: 5,
      break_intervals: 10,
      preferred_content_types: ['video', 'text']
    },
    peer_comparisons: []
  }
}

/**
 * Get advanced recommendations for Pro/Enterprise users
 * @param userId - User ID
 * @param progress - User's learning progress
 * @returns Advanced recommendations
 */
async function getAdvancedRecommendations(userId: string, progress: LMSProgress): Promise<LearningRecommendations> {
  // TODO: Implement AI-based recommendation engine
  // This would analyze:
  // - User's completed courses and performance
  // - Learning patterns and preferences
  // - Industry trends and skill demands
  // - Peer comparisons and benchmarks
  
  return {
    recommended_courses: [],
    recommended_paths: [],
    skill_gaps: [],
    study_schedule: {
      optimal_times: ['09:00', '14:00', '19:00'],
      recommended_duration: 45,
      weekly_goal: 8,
      break_intervals: 15,
      preferred_content_types: ['video', 'interactive', 'project']
    },
    peer_comparisons: []
  }
}

// ================================
// SUBSCRIPTION ANALYTICS
// ================================

/**
 * Get LMS analytics for user
 * @param userId - User ID
 * @returns LMS analytics data
 */
export async function getLMSAnalytics(userId: string): Promise<LMSAnalytics | null> {
  const supabase = createClient()
  
  try {
    // Get subscription info
    const subscription = await getUserSubscription(userId)
    if (!subscription) return null

    // Get learning progress
    const progress = await getLMSProgress(userId)
    if (!progress) return null

    // Calculate analytics based on subscription plan
    const planFeatures = getFeatureComparison()
    const hasAdvancedAnalytics = ['pro', 'enterprise'].includes(subscription.plan.slug)

    return {
      user_id: userId,
      subscription_plan: subscription.plan.slug,
      learning_analytics: {
        total_study_time: progress.total_study_time,
        average_session_duration: 35, // TODO: Calculate from actual data
        preferred_study_times: ['09:00', '14:00', '19:00'],
        learning_velocity: 2.5, // courses per week
        retention_rate: 0.85,
        engagement_score: hasAdvancedAnalytics ? 8.5 : 0
      },
      performance_analytics: {
        average_quiz_score: hasAdvancedAnalytics ? 85 : 0,
        assignment_completion_rate: hasAdvancedAnalytics ? 0.92 : 0,
        project_success_rate: hasAdvancedAnalytics ? 0.78 : 0,
        skill_progression: hasAdvancedAnalytics ? [] : []
      },
      social_analytics: {
        discussions_participated: hasAdvancedAnalytics ? 15 : 0,
        questions_asked: hasAdvancedAnalytics ? 8 : 0,
        answers_provided: hasAdvancedAnalytics ? 12 : 0,
        peer_reviews_given: hasAdvancedAnalytics ? 5 : 0,
        collaboration_score: hasAdvancedAnalytics ? 7.2 : 0
      }
    }
  } catch (error) {
    console.error('Error in getLMSAnalytics:', error)
    return null
  }
}

/**
 * Get subscription usage statistics
 * @param userId - User ID
 * @returns Subscription usage data
 */
export async function getSubscriptionUsage(userId: string): Promise<SubscriptionUsage | null> {
  const supabase = createClient()
  
  try {
    const subscription = await getUserSubscription(userId)
    if (!subscription) return null

    // Calculate usage based on plan limits
    const planLimits = getPlanLimits(subscription.plan.slug)

    return {
      user_id: userId,
      subscription_id: subscription.id,
      billing_period_start: subscription.current_period_start,
      billing_period_end: subscription.current_period_end,
      features_used: [],
      usage_limits: planLimits,
      overage_charges: 0,
      next_billing_date: subscription.current_period_end
    }
  } catch (error) {
    console.error('Error in getSubscriptionUsage:', error)
    return null
  }
}

/**
 * Get plan usage limits
 * @param planSlug - Plan slug
 * @returns Usage limits for the plan
 */
function getPlanLimits(planSlug: string) {
  const limits = {
    basic: [
      { feature: 'study_hours', limit: 50, current_usage: 0, reset_date: new Date().toISOString() },
      { feature: 'courses_access', limit: 10, current_usage: 0, reset_date: new Date().toISOString() },
      { feature: 'analytics_reports', limit: 1, current_usage: 0, reset_date: new Date().toISOString() }
    ],
    pro: [
      { feature: 'study_hours', limit: -1, current_usage: 0, reset_date: new Date().toISOString() }, // unlimited
      { feature: 'courses_access', limit: -1, current_usage: 0, reset_date: new Date().toISOString() },
      { feature: 'analytics_reports', limit: 10, current_usage: 0, reset_date: new Date().toISOString() },
      { feature: 'team_projects', limit: 5, current_usage: 0, reset_date: new Date().toISOString() }
    ],
    enterprise: [
      { feature: 'study_hours', limit: -1, current_usage: 0, reset_date: new Date().toISOString() },
      { feature: 'courses_access', limit: -1, current_usage: 0, reset_date: new Date().toISOString() },
      { feature: 'analytics_reports', limit: -1, current_usage: 0, reset_date: new Date().toISOString() },
      { feature: 'team_projects', limit: -1, current_usage: 0, reset_date: new Date().toISOString() },
      { feature: 'api_calls', limit: 10000, current_usage: 0, reset_date: new Date().toISOString() }
    ]
  }

  return limits[planSlug as keyof typeof limits] || limits.basic
}