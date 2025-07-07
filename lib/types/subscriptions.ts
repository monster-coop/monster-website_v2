import { Database } from '@/types/database'

// Core subscription types
export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row']
export type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row']

// Enhanced subscription types
export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'expired' | 'paused'
export type BillingCycle = 'monthly' | 'yearly'

export interface EnhancedSubscriptionPlan extends SubscriptionPlan {
  discount_percentage?: number
  trial_period_days?: number
  feature_comparison?: FeatureComparison
}

export interface FeatureComparison {
  basic: string[]
  pro: string[]
  enterprise: string[]
}

// SQUEEZE LMS specific types
export interface LMSProgress {
  user_id: string
  total_courses: number
  completed_courses: number
  completion_percentage: number
  total_study_time: number // in minutes
  streak_days: number
  last_activity: string
  achievements: Achievement[]
  learning_path: LearningPath[]
}

export interface LearningPath {
  id: string
  title: string
  description: string
  estimated_duration: number // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  courses: Course[]
  completion_rate: number
  is_recommended: boolean
}

export interface Course {
  id: string
  title: string
  description: string
  duration: number // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructor: Instructor
  modules: Module[]
  prerequisites?: string[]
  learning_objectives: string[]
  completion_rate: number
  rating: number
  enrollments: number
  last_updated: string
}

export interface Module {
  id: string
  title: string
  description: string
  duration: number // in minutes
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'project'
  content_url?: string
  order: number
  is_completed: boolean
  completion_date?: string
  score?: number
}

export interface Instructor {
  id: string
  name: string
  bio: string
  avatar_url?: string
  expertise: string[]
  rating: number
  courses_count: number
  students_count: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon_url: string
  category: 'completion' | 'streak' | 'skill' | 'social' | 'special'
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earned_date: string
  conditions: AchievementCondition[]
}

export interface AchievementCondition {
  type: 'course_completion' | 'study_time' | 'streak' | 'score' | 'social_interaction'
  target_value: number
  current_value: number
  is_met: boolean
}

// Analytics and reporting
export interface LMSAnalytics {
  user_id: string
  subscription_plan: string
  learning_analytics: {
    total_study_time: number
    average_session_duration: number
    preferred_study_times: string[]
    learning_velocity: number // courses per week
    retention_rate: number
    engagement_score: number
  }
  performance_analytics: {
    average_quiz_score: number
    assignment_completion_rate: number
    project_success_rate: number
    skill_progression: SkillProgression[]
  }
  social_analytics: {
    discussions_participated: number
    questions_asked: number
    answers_provided: number
    peer_reviews_given: number
    collaboration_score: number
  }
}

export interface SkillProgression {
  skill: string
  category: string
  current_level: number
  max_level: number
  progress_percentage: number
  courses_contributing: string[]
  last_updated: string
}

// Personalization and recommendations
export interface LearningRecommendations {
  recommended_courses: Course[]
  recommended_paths: LearningPath[]
  skill_gaps: SkillGap[]
  study_schedule: StudySchedule
  peer_comparisons: PeerComparison[]
}

export interface SkillGap {
  skill: string
  current_level: number
  target_level: number
  recommended_courses: string[]
  estimated_time: number // hours to fill gap
}

export interface StudySchedule {
  optimal_times: string[]
  recommended_duration: number // minutes per session
  weekly_goal: number // hours per week
  break_intervals: number // minutes
  preferred_content_types: string[]
}

export interface PeerComparison {
  metric: string
  user_value: number
  peer_average: number
  percentile: number
  trend: 'improving' | 'declining' | 'stable'
}

// Subscription management
export interface SubscriptionUsage {
  user_id: string
  subscription_id: string
  billing_period_start: string
  billing_period_end: string
  features_used: FeatureUsage[]
  usage_limits: UsageLimit[]
  overage_charges: number
  next_billing_date: string
}

export interface FeatureUsage {
  feature: string
  usage_count: number
  usage_limit: number
  overage_count: number
  last_used: string
}

export interface UsageLimit {
  feature: string
  limit: number
  current_usage: number
  reset_date: string
  overage_rate?: number // cost per additional usage
}

// Billing and invoicing
export interface Invoice {
  id: string
  subscription_id: string
  user_id: string
  invoice_number: string
  issue_date: string
  due_date: string
  amount: number
  tax_amount: number
  total_amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  line_items: InvoiceLineItem[]
  payment_method: string
  paid_date?: string
  notes?: string
}

export interface InvoiceLineItem {
  description: string
  quantity: number
  unit_price: number
  total_price: number
  tax_rate: number
  category: 'subscription' | 'overage' | 'addon' | 'discount'
}

// Team and enterprise features
export interface OrganizationSubscription {
  id: string
  organization_id: string
  plan_id: string
  admin_users: string[]
  member_users: string[]
  seats_total: number
  seats_used: number
  group_analytics: GroupAnalytics
  learning_policies: LearningPolicy[]
  content_library: ContentLibrary
}

export interface GroupAnalytics {
  average_completion_rate: number
  total_study_time: number
  top_performing_members: string[]
  skill_distribution: Record<string, number>
  progress_trends: ProgressTrend[]
  department_comparisons: DepartmentComparison[]
}

export interface ProgressTrend {
  date: string
  metric: string
  value: number
  change_percentage: number
}

export interface DepartmentComparison {
  department: string
  member_count: number
  average_score: number
  completion_rate: number
  study_time: number
}

export interface LearningPolicy {
  id: string
  name: string
  description: string
  mandatory_courses: string[]
  completion_deadline: string
  applies_to: string[] // user IDs or department IDs
  consequences: PolicyConsequence[]
}

export interface PolicyConsequence {
  condition: string
  action: 'notification' | 'restriction' | 'escalation'
  parameters: Record<string, any>
}

export interface ContentLibrary {
  custom_courses: Course[]
  uploaded_materials: Material[]
  shared_resources: Resource[]
  access_permissions: AccessPermission[]
}

export interface Material {
  id: string
  title: string
  type: 'document' | 'video' | 'presentation' | 'spreadsheet'
  file_url: string
  size: number
  uploaded_by: string
  upload_date: string
  tags: string[]
  access_level: 'public' | 'private' | 'department' | 'organization'
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'link' | 'tool' | 'template' | 'guide'
  url: string
  category: string
  shared_by: string
  share_date: string
  usage_count: number
  rating: number
}

export interface AccessPermission {
  resource_id: string
  resource_type: string
  user_id?: string
  department_id?: string
  permission_level: 'read' | 'write' | 'admin'
  granted_by: string
  granted_date: string
  expires_date?: string
}