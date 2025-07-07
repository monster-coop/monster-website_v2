// User journey and experience optimization types

export interface UserJourney {
  id: string
  user_id: string
  session_id: string
  journey_type: JourneyType
  steps: JourneyStep[]
  status: JourneyStatus
  started_at: string
  completed_at?: string
  abandoned_at?: string
  conversion_events: ConversionEvent[]
  total_duration: number // in seconds
  page_views: number
  interactions: number
}

export type JourneyType = 
  | 'onboarding'
  | 'program_discovery'
  | 'program_enrollment'
  | 'subscription_signup'
  | 'learning_journey'
  | 'support_journey'

export type JourneyStatus = 'started' | 'in_progress' | 'completed' | 'abandoned'

export interface JourneyStep {
  id: string
  step_name: string
  step_type: StepType
  page_url: string
  entered_at: string
  exited_at?: string
  duration: number
  interactions: StepInteraction[]
  completion_status: 'completed' | 'abandoned' | 'skipped'
  conversion_value?: number
}

export type StepType = 
  | 'landing'
  | 'discovery'
  | 'details'
  | 'form_input'
  | 'payment'
  | 'confirmation'
  | 'onboarding'
  | 'learning'

export interface StepInteraction {
  type: InteractionType
  element: string
  timestamp: string
  value?: any
  metadata?: Record<string, any>
}

export type InteractionType = 
  | 'click'
  | 'scroll'
  | 'form_input'
  | 'form_submit'
  | 'video_play'
  | 'video_pause'
  | 'download'
  | 'search'
  | 'filter'
  | 'share'

export interface ConversionEvent {
  event_name: string
  timestamp: string
  value: number
  currency?: string
  metadata: Record<string, any>
}

// User experience optimization
export interface UserExperience {
  user_id: string
  device_info: DeviceInfo
  performance_metrics: PerformanceMetrics
  accessibility_preferences: AccessibilityPreferences
  personalization_data: PersonalizationData
  feedback_history: FeedbackEntry[]
}

export interface DeviceInfo {
  device_type: 'desktop' | 'tablet' | 'mobile'
  operating_system: string
  browser: string
  screen_resolution: string
  network_speed: 'slow' | 'medium' | 'fast'
  location?: GeolocationData
}

export interface GeolocationData {
  country: string
  region: string
  city: string
  timezone: string
  ip_address: string
}

export interface PerformanceMetrics {
  page_load_time: number
  time_to_interactive: number
  first_contentful_paint: number
  largest_contentful_paint: number
  cumulative_layout_shift: number
  navigation_timing: NavigationTiming[]
}

export interface NavigationTiming {
  page: string
  load_time: number
  dom_ready_time: number
  resource_load_time: number
  timestamp: string
}

export interface AccessibilityPreferences {
  screen_reader: boolean
  high_contrast: boolean
  large_text: boolean
  reduced_motion: boolean
  keyboard_navigation: boolean
  color_blind_support: boolean
  language_preference: string
}

export interface PersonalizationData {
  interests: string[]
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  learning_goals: string[]
  preferred_content_types: ContentType[]
  study_schedule: StudySchedulePreference
  communication_preferences: CommunicationPreference[]
}

export type ContentType = 'video' | 'text' | 'interactive' | 'audio' | 'quiz' | 'project'

export interface StudySchedulePreference {
  preferred_times: string[]
  session_duration: number
  frequency: 'daily' | 'weekly' | 'flexible'
  timezone: string
}

export interface CommunicationPreference {
  channel: 'email' | 'sms' | 'push' | 'in_app'
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly'
  topics: string[]
}

export interface FeedbackEntry {
  id: string
  type: FeedbackType
  rating: number
  comment?: string
  page_url: string
  feature: string
  timestamp: string
  response_provided: boolean
  resolved: boolean
}

export type FeedbackType = 'bug_report' | 'feature_request' | 'usability_issue' | 'content_feedback' | 'general'

// A/B Testing and Optimization
export interface ABTest {
  id: string
  name: string
  description: string
  hypothesis: string
  variants: ABTestVariant[]
  target_audience: ABTestAudience
  metrics: ABTestMetric[]
  status: ABTestStatus
  start_date: string
  end_date?: string
  results?: ABTestResults
}

export interface ABTestVariant {
  id: string
  name: string
  description: string
  traffic_allocation: number // percentage
  configuration: Record<string, any>
  is_control: boolean
}

export interface ABTestAudience {
  criteria: AudienceCriteria[]
  size_estimate: number
  actual_size?: number
}

export interface AudienceCriteria {
  field: string
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than'
  value: any
}

export interface ABTestMetric {
  name: string
  type: 'conversion_rate' | 'revenue' | 'engagement' | 'retention' | 'custom'
  primary: boolean
  goal: 'increase' | 'decrease'
  baseline_value?: number
  target_improvement?: number
}

export type ABTestStatus = 'draft' | 'running' | 'paused' | 'completed' | 'cancelled'

export interface ABTestResults {
  statistical_significance: number
  confidence_interval: number
  winner?: string
  performance_by_variant: VariantPerformance[]
  recommendations: string[]
}

export interface VariantPerformance {
  variant_id: string
  participants: number
  conversions: number
  conversion_rate: number
  revenue: number
  engagement_score: number
  statistical_significance: number
}

// User segmentation
export interface UserSegment {
  id: string
  name: string
  description: string
  criteria: SegmentCriteria[]
  user_count: number
  performance_metrics: SegmentMetrics
  created_at: string
  updated_at: string
}

export interface SegmentCriteria {
  field: string
  operator: string
  value: any
  logic: 'AND' | 'OR'
}

export interface SegmentMetrics {
  conversion_rate: number
  average_revenue: number
  engagement_score: number
  retention_rate: number
  lifetime_value: number
  churn_rate: number
}

// Recommendation engine
export interface RecommendationEngine {
  user_id: string
  recommendations: Recommendation[]
  algorithm_version: string
  generated_at: string
  interaction_history: RecommendationInteraction[]
}

export interface Recommendation {
  id: string
  type: RecommendationType
  item_id: string
  title: string
  description: string
  confidence_score: number
  reasoning: string[]
  priority: number
  expires_at?: string
}

export type RecommendationType = 
  | 'program'
  | 'course'
  | 'content'
  | 'feature'
  | 'subscription_upgrade'
  | 'learning_path'

export interface RecommendationInteraction {
  recommendation_id: string
  action: 'viewed' | 'clicked' | 'dismissed' | 'converted'
  timestamp: string
  context?: Record<string, any>
}

// Onboarding optimization
export interface OnboardingFlow {
  id: string
  name: string
  description: string
  target_user_type: string
  steps: OnboardingStep[]
  completion_rate: number
  average_duration: number
  drop_off_points: DropOffAnalysis[]
}

export interface OnboardingStep {
  id: string
  name: string
  description: string
  type: OnboardingStepType
  is_mandatory: boolean
  estimated_duration: number
  completion_rate: number
  success_criteria: string[]
}

export type OnboardingStepType = 
  | 'welcome'
  | 'profile_setup'
  | 'preferences'
  | 'tutorial'
  | 'first_action'
  | 'verification'

export interface DropOffAnalysis {
  step_id: string
  drop_off_rate: number
  common_issues: string[]
  improvement_suggestions: string[]
}

// Engagement optimization
export interface EngagementMetrics {
  user_id: string
  daily_active_days: number
  weekly_active_days: number
  monthly_active_days: number
  session_frequency: number
  average_session_duration: number
  feature_adoption: FeatureAdoption[]
  engagement_score: number
  risk_score: number // churn risk
}

export interface FeatureAdoption {
  feature_name: string
  first_used: string
  last_used: string
  usage_frequency: number
  proficiency_level: number
}

// Conversion optimization
export interface ConversionFunnel {
  id: string
  name: string
  description: string
  steps: FunnelStep[]
  conversion_rate: number
  revenue_impact: number
  optimization_opportunities: OptimizationOpportunity[]
}

export interface FunnelStep {
  id: string
  name: string
  description: string
  entry_count: number
  exit_count: number
  conversion_rate: number
  average_time_spent: number
  bounce_rate: number
}

export interface OptimizationOpportunity {
  step_id: string
  issue_type: 'high_drop_off' | 'long_duration' | 'low_engagement' | 'technical_issue'
  impact_score: number
  effort_score: number
  recommendations: string[]
  expected_improvement: number
}