import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

// Types
type Program = Database['public']['Tables']['programs']['Row']
type ProgramInsert = Database['public']['Tables']['programs']['Insert']
type ProgramUpdate = Database['public']['Tables']['programs']['Update']

/**
 * 활성 프로그램 목록 조회
 * @param filters - 필터 옵션
 * @returns 활성 프로그램 목록
 */
export async function getActivePrograms(filters?: {
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
      program_categories(name, slug)
    `)
    .eq('is_active', true)
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching active programs:', error)
    throw new Error('프로그램 목록을 불러오는데 실패했습니다.')
  }

  return data
}

/**
 * 프로그램 상세 정보 조회
 * @param slug - 프로그램 슬러그
 * @returns 프로그램 상세 정보
 */
export async function getProgramBySlug(slug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      program_categories(name, slug),
      program_participants(
        id,
        status,
        profiles(full_name)
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching program:', error)
    return null
  }

  return data
}

/**
 * 프로그램 참가 가능 여부 확인
 * @param programId - 프로그램 ID
 * @returns 참가 가능 여부
 */
export async function checkProgramAvailability(programId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('programs')
    .select('max_participants, current_participants, status')
    .eq('id', programId)
    .single()

  if (error) {
    console.error('Error checking program availability:', error)
    return false
  }

  return data.status === 'open' && data.current_participants < data.max_participants
}

/**
 * 프로그램 참가자 수 업데이트 (서버 전용)
 * @param programId - 프로그램 ID
 * @param increment - 증가/감소 수
 */
export async function updateProgramParticipants(programId: string, increment: number) {
  const supabase = await createServerClient()

  const { error } = await supabase.rpc('update_program_participants', {
    program_id: programId,
    increment_amount: increment
  })

  if (error) {
    console.error('Error updating program participants:', error)
    throw new Error('참가자 수 업데이트에 실패했습니다.')
  }
}

/**
 * 카테고리별 프로그램 조회
 * @param categorySlug - 카테고리 슬러그
 * @returns 해당 카테고리의 프로그램 목록
 */
export async function getProgramsByCategory(categorySlug: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      program_categories!inner(name, slug)
    `)
    .eq('program_categories.slug', categorySlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching programs by category:', error)
    throw new Error('카테고리별 프로그램을 불러오는데 실패했습니다.')
  }

  return data
}

/**
 * 프로그램 검색
 * @param query - 검색어
 * @param options - 검색 옵션
 * @returns 검색 결과
 */
export async function searchPrograms(query: string, options?: {
  category_id?: string
  difficulty_level?: string
  limit?: number
}) {
  const supabase = createClient()

  let searchQuery = supabase
    .from('programs')
    .select(`
      *,
      program_categories(name, slug)
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (options?.category_id) {
    searchQuery = searchQuery.eq('category_id', options.category_id)
  }

  if (options?.difficulty_level) {
    searchQuery = searchQuery.eq('difficulty_level', options.difficulty_level)
  }

  if (options?.limit) {
    searchQuery = searchQuery.limit(options.limit)
  }

  const { data, error } = await searchQuery

  if (error) {
    console.error('Error searching programs:', error)
    throw new Error('프로그램 검색에 실패했습니다.')
  }

  return data
}