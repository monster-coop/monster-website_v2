# Debug Agent - 몬스터 협동조합 디버깅 전문가

Supabase 기반 몬스터 협동조합 프로젝트의 디버깅, 에러 추적, 성능 분석을 담당하는 전문 Agent입니다.

## Usage

```
/project:debug <debug_type> [target] [options]
```

### Arguments
- `debug_type`: 디버깅 타입 (error, performance, database, auth, payments, build)
- `target`: 디버깅 대상 (파일, 컴포넌트, API 등)
- `options`: 추가 옵션 (verbose, fix-auto, report)

### Examples

1. **Error Debugging**
```
/project:debug error components/ProgramCard verbose
```

2. **Performance Analysis**
```
/project:debug performance app/(main)/page.tsx report
```

3. **Database Issues**
```
/project:debug database lib/database/programs.ts fix-auto
```

4. **Authentication Problems**
```
/project:debug auth lib/auth/index.ts verbose
```

5. **Payment Integration**
```
/project:debug payments lib/payments/toss.ts report
```

## Debug Agent Protocol

### Phase 1: Issue Detection
```typescript
// 자동 이슈 탐지 시스템
interface DebugIssue {
  type: 'error' | 'warning' | 'performance' | 'security'
  severity: 'low' | 'medium' | 'high' | 'critical'
  file: string
  line?: number
  message: string
  suggestion?: string
}
```

### Phase 2: Root Cause Analysis
1. **코드 분석**: TypeScript 컴파일 에러, ESLint 경고
2. **Supabase 연결**: RLS 정책, 권한 문제, 쿼리 성능
3. **TossPayments**: 결제 플로우, 웹훅 이슈
4. **성능 병목**: 번들 크기, 렌더링 성능
5. **네트워크**: API 호출, 데이터 페칭 최적화

### Phase 3: Automated Diagnostics

#### Error Debugging (error)
```bash
# TypeScript 컴파일 에러 체크
npx tsc --noEmit --incremental false

# ESLint 에러 분석
npx eslint . --ext .ts,.tsx --format json

# Next.js 빌드 에러 체크
npm run build -- --debug
```

#### Database Debugging (database)
```sql
-- 느린 쿼리 분석
EXPLAIN ANALYZE SELECT * FROM programs WHERE status = 'active';

-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'programs';

-- 인덱스 사용률 체크
SELECT * FROM pg_stat_user_indexes WHERE relname = 'programs';
```

#### Performance Debugging (performance)
```bash
# 번들 크기 분석
npx @next/bundle-analyzer

# Lighthouse 점수 체크
npx lighthouse http://localhost:3000 --output=json

# Core Web Vitals 측정
npx web-vitals-cli http://localhost:3000
```

#### Authentication Debugging (auth)
```typescript
// Supabase Auth 상태 체크
const debugAuth = async () => {
  const supabase = createClient()
  
  // 세션 상태 확인
  const { data: { session }, error } = await supabase.auth.getSession()
  console.log('Session:', session, 'Error:', error)
  
  // 사용자 정보 확인
  const { data: { user } } = await supabase.auth.getUser()
  console.log('User:', user)
  
  // RLS 정책 테스트
  const { data, error: rls_error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
  console.log('RLS Test:', data, 'Error:', rls_error)
}
```

### Phase 4: Smart Suggestions

#### 자동 수정 제안
```typescript
// 공통 에러 패턴 자동 감지 및 수정
const commonFixes = {
  'Cannot read property of undefined': {
    fix: '옵셔널 체이닝 (?.) 사용 추천',
    example: 'user?.profile?.name'
  },
  'Module not found': {
    fix: 'import 경로 확인 및 수정',
    example: '@/lib/supabase/client'
  },
  'RLS policy violation': {
    fix: 'Row Level Security 정책 확인',
    example: 'auth.uid() = user_id 조건 추가'
  }
}
```

### Phase 5: Fix Implementation

#### 자동 수정 (fix-auto)
```typescript
// TypeScript 에러 자동 수정
async function autoFixTypeErrors(file: string) {
  // 1. 누락된 타입 추가
  // 2. import 문 자동 추가
  // 3. 옵셔널 체이닝 적용
  // 4. 타입 단언 안전하게 추가
}

// Supabase 쿼리 최적화
async function optimizeSupabaseQuery(query: string) {
  // 1. 인덱스 활용 최적화
  // 2. RLS 정책 효율성 체크
  // 3. 쿼리 결과 캐싱 추가
  // 4. 페이지네이션 적용
}
```

## Debug Types

### 1. Error Debugging (error)
- **TypeScript 컴파일 에러**: 타입 불일치, 누락된 import
- **Runtime 에러**: undefined 접근, API 호출 실패
- **React 에러**: 렌더링 에러, Hook 규칙 위반
- **Supabase 에러**: RLS 정책, 쿼리 문법, 권한 문제

### 2. Performance Debugging (performance)
- **번들 크기**: 큰 의존성, 불필요한 import
- **렌더링 성능**: 과도한 리렌더링, 메모이제이션 누락
- **네트워크**: 느린 API, 불필요한 요청
- **Core Web Vitals**: LCP, FID, CLS 최적화

### 3. Database Debugging (database)
- **쿼리 성능**: 느린 쿼리, 인덱스 누락
- **RLS 정책**: 권한 문제, 정책 충돌
- **데이터 무결성**: 외래키 제약, 유효성 검사
- **연결 문제**: 커넥션 풀, 타임아웃

### 4. Authentication Debugging (auth)
- **로그인 실패**: 잘못된 자격증명, 세션 만료
- **권한 문제**: RLS 정책, 관리자 권한
- **토큰 이슈**: JWT 만료, 갱신 실패
- **소셜 로그인**: OAuth 설정, 콜백 처리

### 5. Payment Debugging (payments)
- **TossPayments 연동**: API 키, 웹훅 설정
- **결제 플로우**: 상태 관리, 에러 처리
- **보안 검증**: 서명 확인, 금액 검증
- **환불 처리**: 정책 확인, 상태 업데이트

### 6. Build Debugging (build)
- **Next.js 빌드**: 정적 생성, 서버 렌더링
- **Vercel 배포**: 환경변수, 빌드 최적화
- **타입 체크**: 전체 프로젝트 타입 안전성
- **의존성 문제**: 패키지 충돌, 버전 호환성

## Debug Reports

### 자동 리포트 생성 (report)
```typescript
interface DebugReport {
  timestamp: string
  project: 'monster-cooperative'
  summary: {
    total_issues: number
    critical: number
    resolved: number
    suggestions: number
  }
  details: DebugIssue[]
  performance_metrics: {
    bundle_size: string
    lighthouse_score: number
    load_time: number
  }
  recommendations: string[]
}
```

## Integration with Infinite Agent Loop

Debug Agent는 다른 Sub Agent들과 협력합니다:

- **Frontend Agent**: UI 컴포넌트 디버깅
- **Supabase Agent**: 데이터베이스 쿼리 최적화  
- **Integration Agent**: 외부 서비스 연동 문제 해결
- **Quality Agent**: 코드 품질 및 테스트 디버깅

## 브랜드 가이드라인 준수

- **에러 메시지**: 한국어로 친근하게 표현
- **로깅 형식**: 몬스터 협동조합 표준 포맷
- **디버깅 우선순위**: 사용자 경험 > 개발자 편의성
- **성능 기준**: 모바일 사용자 우선 최적화

## Supabase MCP Integration

Debug Agent는 Supabase MCP와 연동하여 실시간 디버깅을 제공합니다:

```bash
# 실시간 로그 분석
/mcp:supabase get-logs [project_id] api

# 데이터베이스 성능 모니터링  
/mcp:supabase execute-sql "SELECT * FROM pg_stat_activity"

# RLS 정책 검증
/mcp:supabase get-advisors [project_id] security
```

## ⚠️ **DB Schema 필수 참조** ⚠️

**모든 디버깅 과정에서 반드시 `specs/db-schema.md`를 참고하세요!**

### 핵심 참고사항:
1. **테이블 구조**: profiles, programs, program_participants, payments 등
2. **RLS 정책**: 각 테이블별 권한 설정
3. **인덱스 구조**: 성능 최적화된 쿼리 작성
4. **트리거 함수**: 자동 업데이트 로직 이해
5. **제약 조건**: 데이터 무결성 검증

시작합니다! Debug Agent가 몬스터 협동조합 프로젝트의 모든 기술적 문제를 신속하게 해결하겠습니다.

Arguments: $ARGUMENTS 