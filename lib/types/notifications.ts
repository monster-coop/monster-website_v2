import { Database } from '@/types/database'

// Core notification types
export type Notification = Database['public']['Tables']['notifications']['Row']

// Enhanced notification types (aligned with database schema)
export type NotificationType = 'program' | 'payment' | 'subscription' | 'general'
export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface EnhancedNotification extends Notification {
  channels: NotificationChannel[]
  priority: NotificationPriority
  status: NotificationStatus
  metadata: NotificationMetadata
  template_id?: string
  scheduled_for?: string
  expires_at?: string
}

export interface NotificationMetadata {
  campaign_id?: string
  user_segment?: string
  personalization_data?: Record<string, any>
  tracking_params?: Record<string, string>
  a_b_test_variant?: string
}

// Email system
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html_content: string
  text_content: string
  variables: TemplateVariable[]
  category: EmailCategory
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'url'
  description: string
  default_value?: any
  required: boolean
}

export type EmailCategory = 
  | 'transactional'
  | 'promotional' 
  | 'educational'
  | 'administrative'
  | 'system'

export interface EmailCampaign {
  id: string
  name: string
  description: string
  template_id: string
  target_audience: AudienceFilter
  schedule: CampaignSchedule
  status: CampaignStatus
  analytics: CampaignAnalytics
  created_by: string
  created_at: string
}

export interface AudienceFilter {
  user_segments: string[]
  subscription_plans: string[]
  program_interests: string[]
  activity_level: 'high' | 'medium' | 'low' | 'inactive'
  registration_date_range?: {
    start: string
    end: string
  }
  custom_criteria?: CustomCriteria[]
}

export interface CustomCriteria {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
}

export interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring' | 'triggered'
  send_time?: string
  timezone: string
  recurring_pattern?: RecurringPattern
  trigger_event?: TriggerEvent
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  interval: number
  days_of_week?: number[]
  day_of_month?: number
  end_date?: string
}

export interface TriggerEvent {
  event_type: 'user_signup' | 'program_enrollment' | 'payment_completed' | 'subscription_renewed' | 'custom'
  delay_minutes?: number
  conditions?: TriggerCondition[]
}

export interface TriggerCondition {
  field: string
  operator: string
  value: any
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled'

export interface CampaignAnalytics {
  recipients_count: number
  sent_count: number
  delivered_count: number
  opened_count: number
  clicked_count: number
  unsubscribed_count: number
  bounced_count: number
  delivery_rate: number
  open_rate: number
  click_rate: number
  unsubscribe_rate: number
  bounce_rate: number
  revenue_generated: number
}

// SMS system
export interface SMSTemplate {
  id: string
  name: string
  content: string
  variables: TemplateVariable[]
  category: SMSCategory
  is_active: boolean
  character_count: number
}

export type SMSCategory = 'verification' | 'reminder' | 'alert' | 'promotional' | 'transactional'

export interface SMSCampaign {
  id: string
  name: string
  template_id: string
  target_audience: AudienceFilter
  schedule: CampaignSchedule
  status: CampaignStatus
  analytics: SMSAnalytics
  cost_estimate: number
}

export interface SMSAnalytics {
  recipients_count: number
  sent_count: number
  delivered_count: number
  failed_count: number
  delivery_rate: number
  total_cost: number
  cost_per_sms: number
}

// Push notifications
export interface PushNotificationTemplate {
  id: string
  name: string
  title: string
  body: string
  icon?: string
  image?: string
  action_url?: string
  variables: TemplateVariable[]
  category: PushCategory
  is_active: boolean
}

export type PushCategory = 'reminder' | 'update' | 'promotion' | 'achievement' | 'social' | 'system'

export interface PushCampaign {
  id: string
  name: string
  template_id: string
  target_audience: AudienceFilter
  schedule: CampaignSchedule
  status: CampaignStatus
  analytics: PushAnalytics
}

export interface PushAnalytics {
  recipients_count: number
  sent_count: number
  delivered_count: number
  opened_count: number
  clicked_count: number
  delivery_rate: number
  open_rate: number
  click_rate: number
}

// User preferences
export interface NotificationPreferences {
  user_id: string
  email_notifications: EmailPreferences
  sms_notifications: SMSPreferences
  push_notifications: PushPreferences
  frequency_settings: FrequencySettings
  updated_at: string
}

export interface EmailPreferences {
  enabled: boolean
  program_updates: boolean
  payment_notifications: boolean
  marketing_emails: boolean
  educational_content: boolean
  system_alerts: boolean
  weekly_digest: boolean
}

export interface SMSPreferences {
  enabled: boolean
  payment_alerts: boolean
  program_reminders: boolean
  urgent_notifications: boolean
  verification_codes: boolean
}

export interface PushPreferences {
  enabled: boolean
  program_updates: boolean
  achievements: boolean
  social_interactions: boolean
  study_reminders: boolean
  system_alerts: boolean
}

export interface FrequencySettings {
  max_emails_per_day: number
  max_sms_per_week: number
  max_push_per_day: number
  quiet_hours: {
    start: string
    end: string
    timezone: string
  }
  preferred_days: number[]
}

// Automation workflows
export interface NotificationWorkflow {
  id: string
  name: string
  description: string
  trigger: WorkflowTrigger
  steps: WorkflowStep[]
  is_active: boolean
  created_by: string
  created_at: string
}

export interface WorkflowTrigger {
  type: 'event' | 'schedule' | 'condition'
  event_name?: string
  schedule?: CampaignSchedule
  conditions?: TriggerCondition[]
}

export interface WorkflowStep {
  id: string
  type: 'send_notification' | 'wait' | 'condition' | 'update_user' | 'tag_user'
  order: number
  configuration: WorkflowStepConfig
}

export interface WorkflowStepConfig {
  notification?: {
    channel: NotificationChannel
    template_id: string
    personalization?: Record<string, any>
  }
  wait?: {
    duration_minutes: number
  }
  condition?: {
    criteria: TriggerCondition[]
    true_path?: string
    false_path?: string
  }
  user_update?: {
    fields: Record<string, any>
  }
  user_tag?: {
    tags: string[]
    action: 'add' | 'remove'
  }
}

// Analytics and reporting
export interface NotificationAnalytics {
  period: string
  total_notifications: number
  by_channel: ChannelAnalytics[]
  by_type: TypeAnalytics[]
  by_campaign: CampaignAnalytics[]
  user_engagement: UserEngagementMetrics
  delivery_performance: DeliveryMetrics
}

export interface ChannelAnalytics {
  channel: NotificationChannel
  sent_count: number
  delivered_count: number
  opened_count: number
  clicked_count: number
  delivery_rate: number
  engagement_rate: number
}

export interface TypeAnalytics {
  type: NotificationType
  sent_count: number
  engagement_rate: number
  conversion_rate: number
  revenue_impact: number
}

export interface UserEngagementMetrics {
  active_users: number
  engaged_users: number
  unsubscribed_users: number
  engagement_score: number
  retention_impact: number
}

export interface DeliveryMetrics {
  average_delivery_time: number
  delivery_success_rate: number
  bounce_rate: number
  spam_rate: number
  infrastructure_health: number
}

// Integration settings
export interface NotificationProvider {
  id: string
  name: string
  type: NotificationChannel
  configuration: ProviderConfig
  is_active: boolean
  priority: number
  fallback_provider_id?: string
}

export interface ProviderConfig {
  api_key?: string
  sender_email?: string
  sender_name?: string
  webhook_url?: string
  rate_limits?: RateLimit[]
  custom_settings?: Record<string, any>
}

export interface RateLimit {
  period: 'minute' | 'hour' | 'day'
  limit: number
  burst_limit?: number
}