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
  
  // 프로그램 데이터 조회
  let programQuery = supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false })

  // 필터 적용
  if (filters?.category_id) {
    programQuery = programQuery.eq('category_id', filters.category_id)
  }

  if (filters?.search) {
    programQuery = programQuery.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.status) {
    programQuery = programQuery.eq('status', filters.status)
  }

  if (filters?.difficulty_level) {
    programQuery = programQuery.eq('difficulty_level', filters.difficulty_level)
  }

  if (filters?.is_featured !== undefined) {
    programQuery = programQuery.eq('is_featured', filters.is_featured)
  }

  if (filters?.is_active !== undefined) {
    programQuery = programQuery.eq('is_active', filters.is_active)
  }

  // 페이징
  if (filters?.limit) {
    programQuery = programQuery.limit(filters.limit)
  }

  if (filters?.offset) {
    programQuery = programQuery.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data: programs, error: programError } = await programQuery

  if (programError) {
    console.error('Error fetching programs:', programError.message)
    throw new Error('프로그램 목록을 불러오는데 실패했습니다.')
  }

  if (!programs || programs.length === 0) {
    return programs || []
  }

  // 카테고리 데이터 별도 조회
  const categoryIds = [...new Set(programs.map(p => p.category_id).filter((id): id is string => Boolean(id)))]
  
  let categories: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  }> = []
  if (categoryIds.length > 0) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('program_categories')
      .select('id, name, slug, icon')
      .in('id', categoryIds)

    if (categoryError) {
      console.error('Error fetching categories:', categoryError.message)
      // 카테고리 오류는 무시하고 프로그램만 반환
    } else {
      categories = categoryData || []
    }
  }

  // 프로그램과 카테고리 데이터 결합
  const programsWithCategories = programs.map(program => ({
    ...program,
    program_categories: program.category_id 
      ? categories.find(cat => cat.id === program.category_id) || null 
      : null
  }))

  return programsWithCategories
}

/**
 * 모든 프로그램 조회 (호환성을 위한 함수) - 클라이언트용
 * @returns 프로그램 목록과 응답 형태
 */
export async function getAllPrograms() {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        program_categories (
          id,
          name,
          slug,
          icon
        ),
        thumbnail_photo:photos!thumbnail (
          storage_url
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

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

  // 프로그램 기본 정보 조회
  const { data: program, error: programError } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (programError) {
    console.error('Error fetching program by ID:', programError)
    return null
  }

  if (!program) {
    return null
  }

  // 카테고리 정보 조회
  let programCategory = null
  if (program.category_id) {
    const { data: categoryData } = await supabase
      .from('program_categories')
      .select('id, name, slug, icon, description')
      .eq('id', program.category_id)
      .single()
    
    programCategory = categoryData
  }

  // 참가자 정보 조회 (프로필 정보 포함)
  const { data: participants } = await supabase
    .from('program_participants')
    .select(`
      id,
      status,
      created_at,
      profiles!inner(
        id,
        full_name,
        email
      )
    `)
    .eq('program_id', id)

  return {
    ...program,
    program_categories: programCategory,
    program_participants: participants || []
  }
}

/**
 * 슬러그로 프로그램 조회 - 클라이언트용
 * @param slug - 프로그램 슬러그
 * @returns 프로그램 상세 정보 (호환성을 위한 응답 형태 포함)
 */
export async function getProgramBySlug(slug: string) {
  const supabase = createClient()

  // 프로그램 기본 정보 조회
  const { data: program, error: programError } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (programError) {
    console.error('Error fetching program by slug:', programError)
    return { data: null, error: '프로그램을 찾을 수 없습니다.' }
  }

  if (!program) {
    return { data: null, error: '프로그램을 찾을 수 없습니다.' }
  }

  // 카테고리 정보 조회
  let programCategory = null
  if (program.category_id) {
    const { data: categoryData } = await supabase
      .from('program_categories')
      .select('id, name, slug, icon, description')
      .eq('id', program.category_id)
      .single()
    
    programCategory = categoryData
  }

  // 참가자 정보 조회
  const { data: participants } = await supabase
    .from('program_participants')
    .select(`
      id,
      status,
      created_at,
      profiles!inner(
        id,
        full_name
      )
    `)
    .eq('program_id', program.id)

  // 프로그램 이미지 조회
  const { data: programPhotos } = await supabase
    .from('photos')
    .select('storage_url, filename')
    .eq('program_id', program.id)
    .order('created_at', { ascending: false })

  const result = {
    ...program,
    program_categories: programCategory,
    program_participants: participants || [],
    program_photos: (programPhotos || []).map(photo => ({
      photo_type: 'gallery', // 단순화된 형태로 전부 gallery로 반환
      photo: {
        storage_url: photo.storage_url,
        filename: photo.filename
      }
    }))
  }

  return { data: result, error: null }
}

/**
 * 카테고리별 프로그램 조회 - 클라이언트용
 * @param categorySlug - 카테고리 슬러그
 * @param limit - 제한 수
 * @returns 해당 카테고리의 프로그램 목록
 */
export async function getProgramsByCategory(categorySlug: string, limit?: number) {
  const supabase = createClient()

  // 먼저 카테고리 ID 조회
  const { data: category, error: categoryError } = await supabase
    .from('program_categories')
    .select('id, name, slug, icon')
    .eq('slug', categorySlug)
    .single()

  if (categoryError || !category) {
    console.error('Error fetching category:', categoryError)
    throw new Error('카테고리를 찾을 수 없습니다.')
  }

  // 해당 카테고리의 프로그램들 조회
  let query = supabase
    .from('programs')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data: programs, error: programError } = await query

  if (programError) {
    console.error('Error fetching programs by category:', programError)
    throw new Error('카테고리별 프로그램을 불러오는데 실패했습니다.')
  }

  // 프로그램에 카테고리 정보 추가
  const programsWithCategory = (programs || []).map(program => ({
    ...program,
    program_categories: category
  }))

  return programsWithCategory
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

  // 프로그램 검색
  let supabaseQuery = supabase
    .from('programs')
    .select('*')
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

  const { data: programs, error: programError } = await supabaseQuery

  if (programError) {
    console.error('Error searching programs:', programError)
    throw new Error('프로그램 검색에 실패했습니다.')
  }

  if (!programs || programs.length === 0) {
    return programs || []
  }

  // 카테고리 데이터 별도 조회
  const categoryIds = [...new Set(programs.map(p => p.category_id).filter((id): id is string => Boolean(id)))]
  
  let categories: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  }> = []
  
  if (categoryIds.length > 0) {
    const { data: categoryData, error: categoryError } = await supabase
      .from('program_categories')
      .select('id, name, slug, icon')
      .in('id', categoryIds)

    if (categoryError) {
      console.error('Error fetching categories:', categoryError.message)
    } else {
      categories = categoryData || []
    }
  }

  // 프로그램과 카테고리 데이터 결합
  const programsWithCategories = programs.map(program => ({
    ...program,
    program_categories: program.category_id 
      ? categories.find(cat => cat.id === program.category_id) || null 
      : null
  }))

  return programsWithCategories
}

/**
 * 프로그램 가용성 확인 - 클라이언트용
 * @param programId - 프로그램 ID
 * @returns 예약 가능 여부
 */
export async function checkProgramAvailability(programId: string): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('programs')
    .select('current_participants, max_participants, status')
    .eq('id', programId)
    .single()

  if (error || !data) {
    console.error('Error checking program availability:', error)
    return false
  }

  return (
    data.status === 'open' &&
    data.max_participants !== null &&
    (data.current_participants || 0) < data.max_participants
  )
}

/**
 * 효과적인 가격 계산 (얼리버드 적용)
 * @param program - 프로그램 정보
 * @returns 가격 정보
 */
export function getEffectivePrice(program: Program): { price: number; isEarlyBird: boolean } {
  const now = new Date()
  const hasEarlyBird = program.early_bird_price && program.early_bird_deadline
  const isEarlyBirdActive = hasEarlyBird && new Date(program.early_bird_deadline!) > now

  return {
    price: isEarlyBirdActive ? program.early_bird_price! : program.base_price,
    isEarlyBird: !!isEarlyBirdActive
  }
} 