import { Database } from '@/types/database'

// Core program types from the database
export type Program = Database['public']['Tables']['programs']['Row']
export type ProgramInsert = Database['public']['Tables']['programs']['Insert']
export type ProgramUpdate = Database['public']['Tables']['programs']['Update']

export type ProgramCategory = Database['public']['Tables']['program_categories']['Row']
export type ProgramParticipant = Database['public']['Tables']['program_participants']['Row']

// Enhanced program types for the platform
export type ProgramType = 
  | 'team_entrepreneurship'    // 팀기업가정신 교육
  | 'squeeze_lrs'             // SQUEEZE LRS
  | 'challenge_trip'          // 챌린지 트립
  | 'writer_trip'             // 작가가 되는 트립

export type ProgramStatus = 'open' | 'full' | 'cancelled' | 'completed'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface EnhancedProgram extends Program {
  category?: ProgramCategory
  current_participants_count?: number
  is_early_bird_eligible?: boolean
  days_until_start?: number
  notion_content?: NotionContent
}

export interface NotionContent {
  curriculum?: string
  instructor_profile?: string
  learning_objectives?: string[]
  schedule?: ProgramSchedule[]
  requirements?: string[]
  benefits?: string[]
}

export interface ProgramSchedule {
  week: number
  title: string
  description: string
  activities: string[]
  deliverables?: string[]
}

export interface ProgramFilters {
  category_id?: string
  type?: ProgramType
  status?: ProgramStatus
  difficulty_level?: DifficultyLevel
  price_range?: {
    min: number
    max: number
  }
  date_range?: {
    start: string
    end: string
  }
  location?: string
  search?: string
  featured_only?: boolean
  available_only?: boolean
}

export interface ProgramStats {
  total_programs: number
  active_programs: number
  total_participants: number
  average_rating: number
  completion_rate: number
  revenue_total: number
  popular_categories: Array<{
    category: string
    count: number
  }>
}

// Program session management
export interface ProgramSession {
  id: string
  program_id: string
  title: string
  start_date: string
  end_date: string
  start_time?: string
  end_time?: string
  location: string
  instructor_name?: string
  max_participants: number
  current_participants: number
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  zoom_link?: string
  materials?: string[]
}

// Learning progress tracking
export interface LearningProgress {
  id: string
  user_id: string
  program_id: string
  session_id?: string
  completion_rate: number
  last_activity: string
  achievements: Achievement[]
  feedback?: string
  rating?: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  earned_date: string
  badge_url?: string
}

// Reservation system
export interface Reservation {
  id: string
  user_id: string
  program_id: string
  session_id?: string
  participant_info: ParticipantInfo
  special_requests?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_id?: string
  created_at: string
  updated_at: string
}

export interface ParticipantInfo {
  full_name: string
  email: string
  phone: string
  emergency_contact?: string
  dietary_restrictions?: string
  accessibility_needs?: string
  motivation?: string
}

// Payment integration
export interface PaymentInfo {
  amount: number
  currency: string
  payment_method?: 'card' | 'transfer' | 'simple'
  installment_months?: number
  coupon_code?: string
  discount_amount?: number
}

// Analytics and reporting
export interface ProgramAnalytics {
  program_id: string
  enrollment_rate: number
  completion_rate: number
  satisfaction_score: number
  retention_rate: number
  revenue: number
  popular_time_slots: string[]
  demographics: {
    age_groups: Record<string, number>
    occupations: Record<string, number>
    locations: Record<string, number>
  }
}