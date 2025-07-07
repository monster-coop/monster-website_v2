import { createClient } from '@/lib/supabase/client'
import { 
  EnhancedProgram, 
  ProgramFilters, 
  ProgramStats, 
  ProgramSession,
  LearningProgress,
  Reservation,
  ParticipantInfo,
  ProgramAnalytics,
  ProgramType
} from '@/lib/types/programs'

// ================================
// PROGRAM MANAGEMENT
// ================================

/**
 * Get enhanced programs with all related data
 * @param filters - Filter criteria
 * @returns Enhanced programs with categories and stats
 */
export async function getEnhancedPrograms(filters?: ProgramFilters): Promise<EnhancedProgram[]> {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('programs')
      .select(`
        *,
        category:program_categories(*),
        participant_count:program_participants(count)
      `)
      .eq('is_active', true)

    // Apply filters
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level)
    }
    
    if (filters?.price_range) {
      query = query
        .gte('base_price', filters.price_range.min)
        .lte('base_price', filters.price_range.max)
    }
    
    if (filters?.date_range) {
      query = query
        .gte('start_date', filters.date_range.start)
        .lte('end_date', filters.date_range.end)
    }
    
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    
    if (filters?.search) {
      query = query.or(`
        title.ilike.%${filters.search}%,
        description.ilike.%${filters.search}%,
        instructor_name.ilike.%${filters.search}%
      `)
    }
    
    if (filters?.featured_only) {
      query = query.eq('is_featured', true)
    }
    
    if (filters?.available_only) {
      query = query.neq('status', 'full').neq('status', 'cancelled')
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching enhanced programs:', error)
      return []
    }

    // Enhance programs with calculated fields
    const enhancedPrograms = data.map(program => ({
      ...program,
      current_participants_count: program.participant_count?.[0]?.count || 0,
      is_early_bird_eligible: program.early_bird_deadline ? 
        new Date(program.early_bird_deadline) > new Date() : false,
      days_until_start: program.start_date ? 
        Math.ceil((new Date(program.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
    }))

    return enhancedPrograms
  } catch (error) {
    console.error('Error in getEnhancedPrograms:', error)
    return []
  }
}

/**
 * Get program statistics
 * @returns Platform-wide program statistics
 */
export async function getProgramStats(): Promise<ProgramStats> {
  const supabase = createClient()
  
  try {
    // Get basic program stats
    const { data: programsData } = await supabase
      .from('programs')
      .select('id, status, base_price, is_active')
      .eq('is_active', true)

    // Get participant stats
    const { data: participantsData } = await supabase
      .from('program_participants')
      .select('id, status, amount_paid')

    // Get category popularity
    const { data: categoriesData } = await supabase
      .from('programs')
      .select(`
        category_id,
        category:program_categories(name),
        participant_count:program_participants(count)
      `)
      .eq('is_active', true)

    const totalPrograms = programsData?.length || 0
    const activePrograms = programsData?.filter(p => p.status === 'open').length || 0
    const totalParticipants = participantsData?.length || 0
    const totalRevenue = participantsData?.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0) || 0

    // Calculate category popularity
    const categoryStats: Record<string, number> = {}
    categoriesData?.forEach(program => {
      const categoryName = program.category?.name || 'Unknown'
      const participantCount = program.participant_count?.[0]?.count || 0
      categoryStats[categoryName] = (categoryStats[categoryName] || 0) + participantCount
    })

    const popularCategories = Object.entries(categoryStats)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      total_programs: totalPrograms,
      active_programs: activePrograms,
      total_participants: totalParticipants,
      average_rating: 4.5, // TODO: Calculate from actual ratings
      completion_rate: 0.85, // TODO: Calculate from actual data
      revenue_total: totalRevenue,
      popular_categories: popularCategories
    }
  } catch (error) {
    console.error('Error fetching program stats:', error)
    return {
      total_programs: 0,
      active_programs: 0,
      total_participants: 0,
      average_rating: 0,
      completion_rate: 0,
      revenue_total: 0,
      popular_categories: []
    }
  }
}

// ================================
// PROGRAM SESSION MANAGEMENT
// ================================

/**
 * Create program session
 * @param sessionData - Session information
 * @returns Created session
 */
export async function createProgramSession(sessionData: Omit<ProgramSession, 'id' | 'current_participants'>): Promise<ProgramSession | null> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('program_sessions')
      .insert({
        program_id: sessionData.program_id,
        title: sessionData.title,
        start_date: sessionData.start_date,
        end_date: sessionData.end_date,
        start_time: sessionData.start_time,
        end_time: sessionData.end_time,
        location: sessionData.location,
        instructor_name: sessionData.instructor_name,
        max_participants: sessionData.max_participants,
        status: sessionData.status,
        zoom_link: sessionData.zoom_link,
        materials: sessionData.materials
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating program session:', error)
      return null
    }

    return {
      ...data,
      current_participants: 0
    }
  } catch (error) {
    console.error('Error in createProgramSession:', error)
    return null
  }
}

/**
 * Get program sessions
 * @param programId - Program ID
 * @returns Program sessions with participant counts
 */
export async function getProgramSessions(programId: string): Promise<ProgramSession[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('program_sessions')
      .select(`
        *,
        participant_count:program_participants(count)
      `)
      .eq('program_id', programId)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching program sessions:', error)
      return []
    }

    return data.map(session => ({
      ...session,
      current_participants: session.participant_count?.[0]?.count || 0
    }))
  } catch (error) {
    console.error('Error in getProgramSessions:', error)
    return []
  }
}

// ================================
// RESERVATION SYSTEM
// ================================

/**
 * Create program reservation
 * @param reservationData - Reservation details
 * @returns Created reservation
 */
export async function createReservation(
  programId: string,
  userId: string,
  participantInfo: ParticipantInfo,
  specialRequests?: string
): Promise<Reservation | null> {
  const supabase = createClient()
  
  try {
    // Check program availability
    const { data: program } = await supabase
      .from('programs')
      .select('max_participants, current_participants, status')
      .eq('id', programId)
      .single()

    if (!program || program.status !== 'open') {
      throw new Error('Program is not available for reservation')
    }

    if (program.current_participants >= program.max_participants) {
      throw new Error('Program is full')
    }

    // Create reservation
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        user_id: userId,
        program_id: programId,
        participant_info: participantInfo,
        special_requests: specialRequests,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating reservation:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in createReservation:', error)
    return null
  }
}

/**
 * Get user reservations
 * @param userId - User ID
 * @returns User's reservations with program details
 */
export async function getUserReservations(userId: string): Promise<(Reservation & { program: EnhancedProgram })[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        program:programs(
          *,
          category:program_categories(*)
        )
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

// ================================
// LEARNING PROGRESS TRACKING
// ================================

/**
 * Update learning progress
 * @param progressData - Progress update data
 * @returns Updated progress
 */
export async function updateLearningProgress(progressData: Partial<LearningProgress>): Promise<LearningProgress | null> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: progressData.user_id!,
        program_id: progressData.program_id!,
        session_id: progressData.session_id,
        completion_rate: progressData.completion_rate || 0,
        last_activity: new Date().toISOString(),
        achievements: progressData.achievements || [],
        feedback: progressData.feedback,
        rating: progressData.rating
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating learning progress:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updateLearningProgress:', error)
    return null
  }
}

/**
 * Get learning progress for user
 * @param userId - User ID
 * @param programId - Optional program ID filter
 * @returns Learning progress records
 */
export async function getUserLearningProgress(userId: string, programId?: string): Promise<LearningProgress[]> {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)

    if (programId) {
      query = query.eq('program_id', programId)
    }

    const { data, error } = await query.order('last_activity', { ascending: false })

    if (error) {
      console.error('Error fetching learning progress:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserLearningProgress:', error)
    return []
  }
}

// ================================
// ANALYTICS AND REPORTING
// ================================

/**
 * Get program analytics
 * @param programId - Program ID
 * @returns Detailed analytics for the program
 */
export async function getProgramAnalytics(programId: string): Promise<ProgramAnalytics | null> {
  const supabase = createClient()
  
  try {
    // Get enrollment data
    const { data: enrollmentData } = await supabase
      .from('program_participants')
      .select('status, amount_paid, created_at, participant_name')
      .eq('program_id', programId)

    // Get progress data
    const { data: progressData } = await supabase
      .from('learning_progress')
      .select('completion_rate, rating')
      .eq('program_id', programId)

    if (!enrollmentData || !progressData) {
      return null
    }

    const totalEnrollments = enrollmentData.length
    const completedPrograms = progressData.filter(p => p.completion_rate >= 1).length
    const totalRevenue = enrollmentData.reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0)
    const averageRating = progressData.reduce((sum, p) => sum + (p.rating || 0), 0) / progressData.length

    return {
      program_id: programId,
      enrollment_rate: totalEnrollments, // Raw count for now
      completion_rate: totalEnrollments > 0 ? completedPrograms / totalEnrollments : 0,
      satisfaction_score: averageRating || 0,
      retention_rate: 0.8, // TODO: Calculate actual retention
      revenue: totalRevenue,
      popular_time_slots: [], // TODO: Implement time slot analysis
      demographics: {
        age_groups: {},
        occupations: {},
        locations: {}
      }
    }
  } catch (error) {
    console.error('Error fetching program analytics:', error)
    return null
  }
}

// ================================
// PROGRAM CONTENT MANAGEMENT
// ================================

/**
 * Get program content from Notion (placeholder for Notion API integration)
 * @param notionPageId - Notion page ID
 * @returns Parsed program content
 */
export async function getProgramNotionContent(notionPageId: string): Promise<any> {
  // TODO: Implement Notion API integration using react-notion-x
  // This is a placeholder for the hybrid CMS functionality
  return {
    curriculum: "Detailed curriculum from Notion",
    instructor_profile: "Instructor bio and credentials",
    learning_objectives: ["Objective 1", "Objective 2"],
    schedule: [],
    requirements: ["Requirement 1", "Requirement 2"],
    benefits: ["Benefit 1", "Benefit 2"]
  }
}

// ================================
// CORE PROGRAM TEMPLATES
// ================================

/**
 * Create the 4 core program templates
 * @returns Array of core program templates
 */
export function getCorePrograms(): Array<Omit<EnhancedProgram, 'id' | 'created_at' | 'updated_at'>> {
  return [
    {
      // 팀기업가정신 교육
      title: "팀기업가정신 교육 프로그램",
      slug: "team-entrepreneurship-education",
      description: "프로젝트 기반 학습을 통한 실전 팀기업가정신 역량 개발",
      thumbnail_url: "/images/programs/team-entrepreneurship.jpg",
      instructor_name: "김혁신 대표",
      instructor_bio: "10년 경력의 스타트업 전문가",
      location: "서울 강남구 몬스터 협동조합",
      duration_hours: 120,
      max_participants: 20,
      min_participants: 8,
      base_price: 1500000,
      early_bird_price: 1200000,
      difficulty_level: "intermediate",
      tags: ["팀워크", "창업", "리더십", "프로젝트"],
      status: "open",
      is_featured: true,
      is_active: true,
      category_id: null,
      notion_page_id: "team-entrepreneurship-notion-id"
    },
    {
      // SQUEEZE LRS
      title: "SQUEEZE LRS 학습 시스템",
      slug: "squeeze-lrs-learning-system",
      description: "개인별 맞춤 학습과 실시간 피드백을 제공하는 혁신적 학습 시스템",
      thumbnail_url: "/images/programs/squeeze-lrs.jpg",
      instructor_name: "박데이터 박사",
      instructor_bio: "교육공학 박사, LRS 시스템 전문가",
      location: "온라인 + 오프라인 하이브리드",
      duration_hours: 80,
      max_participants: 30,
      min_participants: 10,
      base_price: 800000,
      early_bird_price: 640000,
      difficulty_level: "beginner",
      tags: ["학습", "데이터", "분석", "개인화"],
      status: "open",
      is_featured: true,
      is_active: true,
      category_id: null,
      notion_page_id: "squeeze-lrs-notion-id"
    },
    {
      // 챌린지 트립
      title: "글로벌 챌린지 트립",
      slug: "global-challenge-trip",
      description: "해외 현지에서 진행하는 문제 해결 중심의 체험 학습 프로그램",
      thumbnail_url: "/images/programs/challenge-trip.jpg",
      instructor_name: "최글로벌 팀장",
      instructor_bio: "국제교육 전문가, 30개국 교육 경험",
      location: "베트남 호치민 (3박 4일)",
      duration_hours: 96,
      max_participants: 15,
      min_participants: 8,
      base_price: 2500000,
      early_bird_price: 2000000,
      difficulty_level: "advanced",
      tags: ["글로벌", "문화", "체험", "네트워킹"],
      status: "open",
      is_featured: true,
      is_active: true,
      category_id: null,
      notion_page_id: "challenge-trip-notion-id"
    },
    {
      // 작가가 되는 트립
      title: "작가가 되는 트립",
      slug: "become-writer-trip",
      description: "개인 여행 기획부터 콘텐츠 창작, 출판까지 완성하는 통합 프로그램",
      thumbnail_url: "/images/programs/writer-trip.jpg",
      instructor_name: "이스토리 작가",
      instructor_bio: "베스트셀러 작가, 여행 콘텐츠 전문가",
      location: "제주도 (2박 3일) + 온라인 후속 과정",
      duration_hours: 60,
      max_participants: 12,
      min_participants: 6,
      base_price: 1800000,
      early_bird_price: 1440000,
      difficulty_level: "beginner",
      tags: ["여행", "글쓰기", "출판", "브랜딩"],
      status: "open",
      is_featured: true,
      is_active: true,
      category_id: null,
      notion_page_id: "writer-trip-notion-id"
    }
  ]
}