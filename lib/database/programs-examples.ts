/**
 * 프로그램 CRUD 사용 예제
 * 이 파일은 lib/database/programs.ts의 함수들을 어떻게 사용하는지 보여주는 예제입니다.
 */

import {
  createProgram,
  getPrograms,
  getActivePrograms,
  getFeaturedPrograms,
  getProgramById,
  getProgramBySlug,
  updateProgram,
  updateProgramStatus,
  toggleProgramActive,
  deleteProgram,
  softDeleteProgram,
  searchPrograms,
  checkProgramAvailability,
  updateProgramParticipants,
  getProgramStats,
  getEffectivePrice,
  // 새로 추가된 몬스터 협동조합 특화 함수들
  getLatestProgramsByCategory,
  getTeamEntrepreneurshipPrograms,
  getSqueezeLrsPrograms,
  getChallengeTripPrograms,
  getWriterTripPrograms,
  getAllProgramsHistory,
  CreateProgramData,
  UpdateProgramData
} from './programs'

// ================================
// CREATE 예제
// ================================

export async function exampleCreateProgram() {
  const newProgramData: CreateProgramData = {
    title: '스타트업 창업 기초 과정',
    slug: 'startup-basics-2024',
    description: '실무 중심의 창업 교육으로 팀프러너 역량을 키우는 4주 프로그램',
    category_id: '6a82f90c-6fcd-4120-a427-8e128c67c85b', // 팀기업가정신 교육 카테고리
    base_price: 300000,
    early_bird_price: 250000,
    early_bird_deadline: '2025-01-15T23:59:59+09:00',
    max_participants: 20,
    min_participants: 5,
    start_date: '2025-02-01',
    end_date: '2025-02-28',
    start_time: '19:00:00',
    end_time: '21:00:00',
    location: '몬스터 협동조합 본사',
    difficulty_level: 'beginner',
    duration_hours: 32,
    instructor_name: '김민수 대표',
    instructor_bio: '10년차 스타트업 전문가',
    tags: ['창업', '팀워크', '리더십', 'PBL'],
    is_featured: true,
    is_active: true
  }

  try {
    const newProgram = await createProgram(newProgramData)
    console.log('새 프로그램 생성 성공:', newProgram.title)
    return newProgram
  } catch (error) {
    console.error('프로그램 생성 실패:', error)
    throw error
  }
}

// ================================
// READ 예제
// ================================

export async function exampleGetPrograms() {
  try {
    // 1. 모든 활성 프로그램 조회
    const activePrograms = await getActivePrograms()
    console.log('활성 프로그램 수:', activePrograms.length)

    // 2. 추천 프로그램 조회
    const featuredPrograms = await getFeaturedPrograms(3)
    console.log('추천 프로그램:', featuredPrograms.map(p => p.title))

    // 3. 카테고리별 필터링
    const filteredPrograms = await getPrograms({
      category_id: '6a82f90c-6fcd-4120-a427-8e128c67c85b',
      difficulty_level: 'beginner',
      limit: 10
    })
    console.log('필터링된 프로그램:', filteredPrograms.length)

    // 4. 검색
    const searchResults = await searchPrograms('창업', {
      difficulty_level: 'beginner',
      limit: 5
    })
    console.log('검색 결과:', searchResults.length)

    return { activePrograms, featuredPrograms, filteredPrograms, searchResults }
  } catch (error) {
    console.error('프로그램 조회 실패:', error)
    throw error
  }
}

export async function exampleGetProgramDetail(slug: string) {
  try {
    const program = await getProgramBySlug(slug)
    if (!program) {
      console.log('프로그램을 찾을 수 없습니다:', slug)
      return null
    }

    console.log('프로그램 상세:', {
      title: program.title,
      participants: `${program.current_participants}/${program.max_participants}`,
      price: getEffectivePrice(program),
      category: program.program_categories?.name
    })

    return program
  } catch (error) {
    console.error('프로그램 상세 조회 실패:', error)
    throw error
  }
}

// ================================
// UPDATE 예제
// ================================

export async function exampleUpdateProgram(programId: string) {
  try {
    const updateData: UpdateProgramData = {
      id: programId,
      title: '스타트업 창업 심화 과정',
      base_price: 350000,
      difficulty_level: 'intermediate'
    }

    const updatedProgram = await updateProgram(updateData)
    console.log('프로그램 업데이트 성공:', updatedProgram.title)

    return updatedProgram
  } catch (error) {
    console.error('프로그램 업데이트 실패:', error)
    throw error
  }
}

export async function exampleManageProgramStatus(programId: string) {
  try {
    // 1. 프로그램 상태 변경
    await updateProgramStatus(programId, 'full')
    console.log('프로그램 상태를 "만석"으로 변경')

    // 2. 프로그램 비활성화
    await toggleProgramActive(programId, false)
    console.log('프로그램 비활성화')

    // 3. 다시 활성화
    await toggleProgramActive(programId, true)
    console.log('프로그램 재활성화')
  } catch (error) {
    console.error('프로그램 상태 관리 실패:', error)
    throw error
  }
}

export async function exampleManageParticipants(programId: string) {
  try {
    // 1. 참가 가능 여부 확인
    const isAvailable = await checkProgramAvailability(programId)
    console.log('참가 가능:', isAvailable)

    if (isAvailable) {
      // 2. 참가자 추가
      await updateProgramParticipants(programId, 1)
      console.log('참가자 1명 추가')

      // 3. 통계 확인
      const stats = await getProgramStats(programId)
      console.log('프로그램 통계:', stats)
    }
  } catch (error) {
    console.error('참가자 관리 실패:', error)
    throw error
  }
}

// ================================
// DELETE 예제
// ================================

export async function exampleDeleteProgram(programId: string, force = false) {
  try {
    if (force) {
      // 하드 삭제 (참가자가 있어도 삭제)
      await deleteProgram(programId, true)
      console.log('프로그램 완전 삭제 완료')
    } else {
      // 소프트 삭제 (is_active = false)
      await softDeleteProgram(programId)
      console.log('프로그램 소프트 삭제 완료')
    }
  } catch (error) {
    console.error('프로그램 삭제 실패:', error)
    throw error
  }
}

// ================================
// 통계 및 유틸리티 예제
// ================================

export async function exampleGetStatistics() {
  try {
    // 전체 프로그램 통계
    const overallStats = await getProgramStats()
    console.log('전체 통계:', {
      총프로그램수: overallStats?.totalPrograms,
      모집중프로그램: overallStats?.openPrograms,
      만석프로그램: overallStats?.fullPrograms,
      총참가자수: overallStats?.totalParticipants,
      점유율: `${overallStats?.occupancyRate.toFixed(1)}%`
    })

    return overallStats
  } catch (error) {
    console.error('통계 조회 실패:', error)
    throw error
  }
}

export function examplePriceCalculation() {
  // 예시 프로그램 데이터
  const program = {
    base_price: 300000,
    early_bird_price: 250000,
    early_bird_deadline: '2025-01-15T23:59:59+09:00'
  } as any

  const { price, isEarlyBird } = getEffectivePrice(program)
  
  console.log('가격 계산:', {
    현재가격: price.toLocaleString() + '원',
    얼리버드적용: isEarlyBird ? '예' : '아니오',
    할인금액: isEarlyBird ? (program.base_price - price).toLocaleString() + '원' : '0원'
  })

  return { price, isEarlyBird }
}

// ================================
// 통합 사용 예제
// ================================

export async function exampleFullWorkflow() {
  try {
    console.log('=== 프로그램 CRUD 전체 워크플로우 시작 ===')

    // 1. 프로그램 생성
    console.log('\n1. 프로그램 생성')
    const newProgram = await exampleCreateProgram()

    // 2. 프로그램 조회
    console.log('\n2. 프로그램 조회')
    await exampleGetPrograms()

    // 3. 프로그램 상세 조회
    console.log('\n3. 프로그램 상세 조회')
    await exampleGetProgramDetail(newProgram.slug)

    // 4. 프로그램 업데이트
    console.log('\n4. 프로그램 업데이트')
    await exampleUpdateProgram(newProgram.id)

    // 5. 참가자 관리
    console.log('\n5. 참가자 관리')
    await exampleManageParticipants(newProgram.id)

    // 6. 통계 조회
    console.log('\n6. 통계 조회')
    await exampleGetStatistics()

    // 7. 가격 계산
    console.log('\n7. 가격 계산')
    examplePriceCalculation()

    // 8. 프로그램 삭제 (소프트)
    console.log('\n8. 프로그램 소프트 삭제')
    await exampleDeleteProgram(newProgram.id, false)

    console.log('\n=== 프로그램 CRUD 전체 워크플로우 완료 ===')
  } catch (error) {
    console.error('워크플로우 실행 중 오류:', error)
    throw error
  }
}

// ================================
// 몬스터 협동조합 특화 함수 예제
// ================================

/**
 * 홈페이지에서 사용할 4가지 핵심 교육 프로그램 조회 예제
 */
export async function exampleGetHomepagePrograms() {
  try {
    console.log('=== 홈페이지 프로그램 조회 시작 ===')
    
    // 각 카테고리별 최신 프로그램 1개씩 조회
    const latestPrograms = await getLatestProgramsByCategory(1)
    
    console.log('카테고리별 최신 프로그램:')
    console.log('- 팀기업가정신 교육:', latestPrograms['team-entrepreneurship']?.[0]?.title || '없음')
    console.log('- SQUEEZE LRS:', latestPrograms['squeeze-lrs']?.[0]?.title || '없음')
    console.log('- 챌린지 트립:', latestPrograms['challenge-trip']?.[0]?.title || '없음')
    console.log('- 작가가 되는 트립:', latestPrograms['writer-trip']?.[0]?.title || '없음')
    
    return latestPrograms
  } catch (error) {
    console.error('홈페이지 프로그램 조회 실패:', error)
    throw error
  }
}

/**
 * 카테고리별 전용 페이지에서 사용할 프로그램 조회 예제
 */
export async function exampleGetCategoryPrograms() {
  try {
    console.log('=== 카테고리별 프로그램 조회 시작 ===')
    
    // 각 카테고리별 모든 프로그램 조회
    const [teamPrograms, squeezePrograms, challengePrograms, writerPrograms] = await Promise.all([
      getTeamEntrepreneurshipPrograms(),
      getSqueezeLrsPrograms(),
      getChallengeTripPrograms(),
      getWriterTripPrograms()
    ])
    
    console.log('카테고리별 프로그램 수:')
    console.log('- 팀기업가정신 교육:', teamPrograms.length, '개')
    console.log('- SQUEEZE LRS:', squeezePrograms.length, '개')
    console.log('- 챌린지 트립:', challengePrograms.length, '개')
    console.log('- 작가가 되는 트립:', writerPrograms.length, '개')
    
    return {
      teamPrograms,
      squeezePrograms,
      challengePrograms,
      writerPrograms
    }
  } catch (error) {
    console.error('카테고리별 프로그램 조회 실패:', error)
    throw error
  }
}

/**
 * 프로그램 히스토리/아카이브 페이지 예제
 */
export async function exampleGetProgramHistory() {
  try {
    console.log('=== 프로그램 히스토리 조회 시작 ===')
    
    // 1. 전체 히스토리 조회 (첫 12개)
    const allHistory = await getAllProgramsHistory({ limit: 12 })
    console.log('전체 히스토리:', allHistory.length, '개')
    
    // 2. 검색으로 필터링
    const searchResults = await getAllProgramsHistory({
      search: '트립',
      limit: 5
    })
    console.log('트립 관련 프로그램:', searchResults.length, '개')
    
    // 3. 페이징 예제 (2페이지)
    const page2 = await getAllProgramsHistory({
      limit: 6,
      offset: 6 // 2페이지 (1페이지 = 0-5, 2페이지 = 6-11)
    })
    console.log('2페이지 프로그램:', page2.length, '개')
    
    return { allHistory, searchResults, page2 }
  } catch (error) {
    console.error('프로그램 히스토리 조회 실패:', error)
    throw error
  }
}

/**
 * 관리자 대시보드용 통계 조회 예제
 */
export async function exampleGetDashboardData() {
  try {
    console.log('=== 대시보드 통계 조회 시작 ===')
    
    // 프로그램 통계 조회
    const stats = await getProgramStats()
    
    console.log('프로그램 통계:')
    console.log('- 총 프로그램 수:', stats.total)
    console.log('- 활성 프로그램:', stats.active)
    console.log('- 모집 중:', stats.open)
    console.log('- 만석:', stats.full)
    console.log('- 완료:', stats.completed)
    console.log('- 취소:', stats.cancelled)
    console.log('- 총 참가자 수:', stats.totalParticipants)
    console.log('- 총 수용 인원:', stats.totalCapacity)
    
    console.log('카테고리별 통계:')
    Object.entries(stats.byCategory).forEach(([category, data]) => {
      console.log(`- ${category}: ${data.count}개 프로그램, ${data.participants}명 참가`)
    })
    
    return stats
  } catch (error) {
    console.error('대시보드 통계 조회 실패:', error)
    throw error
  }
}

/**
 * React 컴포넌트에서 사용하는 실제 예제
 */
export function exampleReactUsage() {
  return `
// 홈페이지 컴포넌트 예제
export default function HomePage() {
  const [corePrograms, setCorePrograms] = useState(null)
  const [featuredPrograms, setFeaturedPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latest, featured] = await Promise.all([
          getLatestProgramsByCategory(1),
          getFeaturedPrograms(6)
        ])
        
        setCorePrograms(latest)
        setFeaturedPrograms(featured)
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>로딩 중...</div>

  return (
    <div>
      {/* 핵심 교육 프로그램 섹션 */}
      <section className="core-programs">
        <h2>핵심 교육 프로그램</h2>
        <div className="programs-grid">
          {corePrograms?.['team-entrepreneurship']?.[0] && (
            <ProgramCard 
              program={corePrograms['team-entrepreneurship'][0]} 
              category="팀기업가정신 교육"
            />
          )}
          {corePrograms?.['squeeze-lrs']?.[0] && (
            <ProgramCard 
              program={corePrograms['squeeze-lrs'][0]} 
              category="SQUEEZE LRS"
            />
          )}
          {corePrograms?.['challenge-trip']?.[0] && (
            <ProgramCard 
              program={corePrograms['challenge-trip'][0]} 
              category="챌린지 트립"
            />
          )}
          {corePrograms?.['writer-trip']?.[0] && (
            <ProgramCard 
              program={corePrograms['writer-trip'][0]} 
              category="작가가 되는 트립"
            />
          )}
        </div>
      </section>

      {/* 추천 프로그램 섹션 */}
      <section className="featured-programs">
        <h2>추천 프로그램</h2>
        <div className="programs-grid">
          {featuredPrograms.map(program => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>
    </div>
  )
}

// 팀기업가정신 교육 전용 페이지 예제
export default function TeamEntrepreneurshipPage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTeamEntrepreneurshipPrograms()
        setPrograms(data)
      } catch (error) {
        console.error('팀기업가정신 프로그램 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>로딩 중...</div>

  return (
    <div>
      <h1>팀기업가정신 교육</h1>
      <p>실제 결과물을 만드는 프로젝트 기반 학습</p>
      
      <div className="programs-grid">
        {programs.map(program => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
      
      {programs.length === 0 && (
        <div className="empty-state">
          현재 진행 중인 팀기업가정신 교육 프로그램이 없습니다.
        </div>
      )}
    </div>
  )
}

// 프로그램 히스토리 페이지 예제
export default function ProgramHistoryPage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const ITEMS_PER_PAGE = 12

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getAllProgramsHistory({
          search,
          limit: ITEMS_PER_PAGE,
          offset: (page - 1) * ITEMS_PER_PAGE
        })
        
        if (page === 1) {
          setPrograms(data)
        } else {
          setPrograms(prev => [...prev, ...data])
        }
        
        setHasMore(data.length === ITEMS_PER_PAGE)
      } catch (error) {
        console.error('프로그램 히스토리 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search, page])

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm)
    setPage(1)
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  return (
    <div>
      <h1>프로그램 히스토리</h1>
      
      <SearchInput 
        value={search}
        onChange={handleSearch}
        placeholder="프로그램명 또는 설명으로 검색..."
      />
      
      <div className="programs-grid">
        {programs.map(program => (
          <ProgramCard key={program.id} program={program} showHistory />
        ))}
      </div>
      
      {loading && <div>로딩 중...</div>}
      
      {hasMore && !loading && (
        <button onClick={loadMore} className="load-more-btn">
          더 보기
        </button>
      )}
      
      {programs.length === 0 && !loading && (
        <div className="empty-state">
          {search ? '검색 결과가 없습니다.' : '프로그램 히스토리가 없습니다.'}
        </div>
      )}
    </div>
  )
}
`
}

/**
 * 전체 몬스터 협동조합 특화 함수 워크플로우 예제
 */
export async function exampleMonsterCoopWorkflow() {
  try {
    console.log('=== 몬스터 협동조합 특화 함수 워크플로우 시작 ===')

    // 1. 홈페이지 데이터 조회
    console.log('\n1. 홈페이지 프로그램 조회')
    await exampleGetHomepagePrograms()

    // 2. 카테고리별 프로그램 조회
    console.log('\n2. 카테고리별 프로그램 조회')
    await exampleGetCategoryPrograms()

    // 3. 프로그램 히스토리 조회
    console.log('\n3. 프로그램 히스토리 조회')
    await exampleGetProgramHistory()

    // 4. 대시보드 통계 조회
    console.log('\n4. 대시보드 통계 조회')
    await exampleGetDashboardData()

    console.log('\n=== 몬스터 협동조합 특화 함수 워크플로우 완료 ===')
  } catch (error) {
    console.error('워크플로우 실행 중 오류:', error)
    throw error
  }
}