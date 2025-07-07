import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'

// Types
type Program = Database['public']['Tables']['programs']['Row']

export interface ProgramFilters {
  category_id?: string
  search?: string
  status?: string
  difficulty_level?: string
  is_featured?: boolean
  is_active?: boolean
  limit?: number
  offset?: number
}

// ================================
// CLIENT-SIDE READ OPERATIONS
// ================================

/**
 * 프로그램 목록 조회 (필터링 지원) - 클라이언트용
 * @param filters - 필터 옵션
 * @returns 프로그램 목록
 */
export async function getPrograms(filters?: ProgramFilters) {
  const supabase = createClient()
  
  let query = supabase
    .from('programs')
    .select(`
      *,
      program_categories(
        id,
        name,
        slug,
        icon
      )
    `)
    .order('created_at', { ascending: false })

  // 필터 적용
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.difficulty_level) {
    query = query.eq('difficulty_level', filters.difficulty_level)
  }

  if (filters?.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured)
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active)
  }

  // 페이징
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching programs:', error)
    throw new Error('프로그램 목록을 불러오는데 실패했습니다.')
  }

  return data
}

/**
 * 모든 프로그램 조회 (호환성을 위한 함수) - 클라이언트용
 * @returns 프로그램 목록과 응답 형태
 */
export async function getAllPrograms() {
  try {
    const data = await getPrograms({ is_active: true })
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : '프로그램을 불러오는데 실패했습니다.' }
  }
}

/**
 * 활성 프로그램 목록 조회 - 클라이언트용
 * @param filters - 필터 옵션
 * @returns 활성 프로그램 목록
 */
export async function getActivePrograms(filters?: Omit<ProgramFilters, 'is_active'>) {
  return getPrograms({ ...filters, is_active: true, status: 'open' })
}

/**
 * 추천 프로그램 목록 조회 - 클라이언트용
 * @param limit - 제한 수
 * @returns 추천 프로그램 목록
 */
export async function getFeaturedPrograms(limit = 6) {
  return getPrograms({ is_featured: true, is_active: true, limit })
}

/**
 * ID로 프로그램 조회 - 클라이언트용
 * @param id - 프로그램 ID
 * @returns 프로그램 상세 정보
 */
export async function getProgramById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      program_categories(
        id,
        name,
        slug,
        icon,
        description
      ),
      program_participants(
        id,
        status,
        created_at,
        profiles(
          id,
          full_name,
          email
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching program by ID:', error)
    return null
  }

  return data
}

/**
 * 슬러그로 프로그램 조회 - 클라이언트용
 * @param slug - 프로그램 슬러그
 * @returns 프로그램 상세 정보
 */
export async function getProgramBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      program_categories(
        id,
        name,
        slug,
        icon,
        description
      ),
      program_participants(
        id,
        status,
        created_at,
        profiles(
          id,
          full_name
        )
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching program by slug:', error)
    return { data: null, error: '프로그램을 찾을 수 없습니다.' }
  }

  return { data, error: null }
}

/**
 * 카테고리별 프로그램 조회 - 클라이언트용
 * @param categorySlug - 카테고리 슬러그
 * @param limit - 제한 수
 * @returns 카테고리별 프로그램 목록
 */
export async function getProgramsByCategory(categorySlug: string, limit?: number) {
  const supabase = createClient()

  let query = supabase
    .from('programs')
    .select(`
      *,
      program_categories!inner(
        id,
        name,
        slug,
        icon
      )
    `)
    .eq('program_categories.slug', categorySlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching programs by category:', error)
    throw new Error('카테고리별 프로그램을 불러오는데 실패했습니다.')
  }

  return data
}

/**
 * 프로그램 검색 - 클라이언트용
 * @param query - 검색어
 * @param options - 검색 옵션
 * @returns 검색된 프로그램 목록
 */
export async function searchPrograms(query: string, options?: {
  category_id?: string
  difficulty_level?: string
  limit?: number
}) {
  const supabase = createClient()

  let supabaseQuery = supabase
    .from('programs')
    .select(`
      *,
      program_categories(
        id,
        name,
        slug,
        icon
      )
    `)
    .eq('is_active', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  // 추가 필터 적용
  if (options?.category_id) {
    supabaseQuery = supabaseQuery.eq('category_id', options.category_id)
  }

  if (options?.difficulty_level) {
    supabaseQuery = supabaseQuery.eq('difficulty_level', options.difficulty_level)
  }

  if (options?.limit) {
    supabaseQuery = supabaseQuery.limit(options.limit)
  }

  const { data, error } = await supabaseQuery

  if (error) {
    console.error('Error searching programs:', error)
    throw new Error('프로그램 검색에 실패했습니다.')
  }

  return data
}

/**
 * 프로그램 예약 가능 여부 확인 - 클라이언트용
 * @param programId - 프로그램 ID
 * @returns 예약 가능 여부
 */
export async function checkProgramAvailability(programId: string): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('programs')
    .select('max_participants, current_participants, status')
    .eq('id', programId)
    .single()

  if (error || !data) {
    console.error('Error checking program availability:', error)
    return false
  }

  return data.status === 'open' && 
         (!data.max_participants || (data.current_participants || 0) < data.max_participants)
}

/**
 * 프로그램 유효 가격 계산 (얼리버드 할인 고려) - 클라이언트용
 * @param program - 프로그램 정보
 * @returns 유효 가격 정보
 */
export function getEffectivePrice(program: Program): { price: number; isEarlyBird: boolean } {
  const now = new Date()
  const earlyBirdDeadline = program.early_bird_deadline ? new Date(program.early_bird_deadline) : null
  
  const isEarlyBird = earlyBirdDeadline && 
                     now <= earlyBirdDeadline && 
                     program.early_bird_price !== null

  return {
    price: isEarlyBird ? program.early_bird_price! : program.base_price,
    isEarlyBird: !!isEarlyBird
  }
}

// ================================
// 몬스터 협동조합 특화 함수들
// ================================

/**
 * 4가지 핵심 교육 카테고리별 최신 프로그램 조회 - 클라이언트용
 * @param limit - 각 카테고리당 프로그램 수 제한 (기본값: 1)
 * @returns 카테고리별 최신 프로그램 목록
 */
export async function getLatestProgramsByCategory(limit = 1) {
  const supabase = createClient()
  
  const categories = [
    'team-entrepreneurship',  // 팀기업가정신 교육
    'squeeze-lrs',           // SQUEEZE LRS
    'challenge-trip',        // 챌린지 트립
    'writer-trip'            // 작가가 되는 트립
  ]

  const promises = categories.map(async (categorySlug) => {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        program_categories!inner(
          id,
          name,
          slug,
          icon,
          description
        )
      `)
      .eq('program_categories.slug', categorySlug)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error(`Error fetching programs for category ${categorySlug}:`, error)
      return { category: categorySlug, programs: [] }
    }

    return { category: categorySlug, programs: data || [] }
  })

  try {
    const results = await Promise.all(promises)
    return results.reduce((acc, { category, programs }) => {
      acc[category] = programs
      return acc
    }, {} as Record<string, typeof programs>)
  } catch (error) {
    console.error('Error fetching latest programs by category:', error)
    throw new Error('카테고리별 최신 프로그램을 불러오는데 실패했습니다.')
  }
}

/**
 * 팀기업가정신 교육 프로그램 조회 - 클라이언트용
 * @param limit - 조회할 프로그램 수 제한
 * @returns 팀기업가정신 교육 프로그램 목록
 */
export async function getTeamEntrepreneurshipPrograms(limit?: number) {
  return getProgramsByCategory('team-entrepreneurship', limit)
}

/**
 * SQUEEZE LRS 프로그램 조회 - 클라이언트용
 * @param limit - 조회할 프로그램 수 제한
 * @returns SQUEEZE LRS 프로그램 목록
 */
export async function getSqueezeLrsPrograms(limit?: number) {
  return getProgramsByCategory('squeeze-lrs', limit)
}

/**
 * 챌린지 트립 프로그램 조회 - 클라이언트용
 * @param limit - 조회할 프로그램 수 제한
 * @returns 챌린지 트립 프로그램 목록
 */
export async function getChallengeTripPrograms(limit?: number) {
  return getProgramsByCategory('challenge-trip', limit)
}

/**
 * 작가가 되는 트립 프로그램 조회 - 클라이언트용
 * @param limit - 조회할 프로그램 수 제한
 * @returns 작가가 되는 트립 프로그램 목록
 */
export async function getWriterTripPrograms(limit?: number) {
  return getProgramsByCategory('writer-trip', limit)
}

/**
 * 프로그램 히스토리 조회 (모든 프로그램 - 활성/비활성 포함) - 클라이언트용
 * @param options - 조회 옵션
 * @returns 프로그램 히스토리 목록
 */
export async function getAllProgramsHistory(options?: {
  category_id?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('programs')
    .select(`
      *,
      program_categories(
        id,
        name,
        slug,
        icon,
        description
      ),
      program_participants(
        id,
        status,
        participant_name,
        created_at
      )
    `)
    .order('created_at', { ascending: false })

  // 필터 적용
  if (options?.category_id) {
    query = query.eq('category_id', options.category_id)
  }

  if (options?.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
  }

  // 페이징
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching programs history:', error)
    throw new Error('프로그램 히스토리를 불러오는데 실패했습니다.')
  }

  return data
}

/**
 * 프로그램 통계 조회 - 클라이언트용
 * @returns 프로그램 통계 정보
 */
export async function getProgramStats() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('programs')
    .select(`
      id,
      status,
      is_active,
      category_id,
      current_participants,
      max_participants,
      program_categories(name, slug)
    `)

  if (error) {
    console.error('Error fetching program stats:', error)
    throw new Error('프로그램 통계를 불러오는데 실패했습니다.')
  }

  const stats = {
    total: data.length,
    active: data.filter(p => p.is_active).length,
    open: data.filter(p => p.status === 'open').length,
    full: data.filter(p => p.status === 'full').length,
    completed: data.filter(p => p.status === 'completed').length,
    cancelled: data.filter(p => p.status === 'cancelled').length,
    totalParticipants: data.reduce((sum, p) => sum + (p.current_participants || 0), 0),
    totalCapacity: data.reduce((sum, p) => sum + (p.max_participants || 0), 0),
    byCategory: data.reduce((acc, p) => {
      if (p.program_categories) {
        const categoryName = p.program_categories.name
        if (!acc[categoryName]) {
          acc[categoryName] = { count: 0, participants: 0 }
        }
        acc[categoryName].count++
        acc[categoryName].participants += p.current_participants || 0
      }
      return acc
    }, {} as Record<string, { count: number; participants: number }>)
  }

  return stats
}