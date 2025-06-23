# Monster Coop Infinite Agent Loop

무한 에이전트 루프를 활용하여 몬스터 협동조합 프로젝트의 기능을 자동으로 생성하고 개발합니다.
**Supabase 기반 프론트엔드 전용** 아키텍처를 사용합니다.

## Usage

```
/project:infinite <spec_file> <output_dir> <count>
```

### Arguments
- `spec_file`: 생성할 기능의 명세서 파일 경로 (예: specs/landing-page.md)
- `output_dir`: 생성된 파일들이 저장될 디렉토리 (예: app/, components/, lib/)
- `count`: 생성할 반복 횟수 (1, 5, 20, infinite)

### Examples

1. **Single Generation** - 랜딩 페이지 단일 생성
```
/project:infinite specs/landing-page.md app/(main) 1
```

2. **Small Batch** - Supabase 함수 5개 변형 생성
```
/project:infinite specs/db-schema.md lib/database 5
```

3. **Large Batch** - 컴포넌트 20개 생성
```
/project:infinite specs/full-platform.md components 20
```

4. **Infinite Mode** - 지속적 기능 개발
```
/project:infinite specs/full-platform.md src/ infinite
```

## Infinite Loop Orchestration

당신은 **Master Orchestrator**로서 다중 Sub Agent들을 조율하여 몬스터 협동조합 플랫폼을 체계적으로 구축합니다.

### Phase 1: Specification Analysis
1. 제공된 spec 파일을 철저히 분석
2. 기존 코드베이스 구조 파악 
3. 생성해야 할 구성요소 식별
4. 브랜드 가이드라인과 기술 스택 확인
5. **DB Schema 파일** (specs/db-schema.md) 참조

### Phase 2: Agent Deployment Strategy

**병렬 Sub Agent 배치:**

#### Frontend Agent (UI/UX 전문)
- React 컴포넌트 생성
- Shadcn/ui 활용한 디자인 시스템
- 반응형 레이아웃 구현
- Framer Motion 애니메이션

#### Supabase Agent (데이터베이스 전문)
- Supabase 클라이언트 함수 생성 (lib/database/)
- RLS 정책 준수 쿼리 작성
- 인증/권한 시스템 (lib/auth/)
- MCP 명령어 활용

#### Integration Agent (연동 전문)
- TossPayments 결제 연동 (lib/payments/)
- Notion API 통합
- 이메일 시스템 연동
- 외부 서비스 API

#### Quality Agent (품질 보증 전문)
- TypeScript 타입 정의 (lib/types/)
- 단위 테스트 생성
- E2E 테스트 시나리오
- 성능 최적화

### Phase 3: Parallel Execution

각 Sub Agent는 독립적으로 작업하되, 다음 원칙을 준수합니다:

1. **Unique Creativity**: 각 반복마다 다른 접근 방식 적용
2. **Brand Consistency**: #56007C 컬러 및 브랜드 가이드라인 준수
3. **Code Quality**: TypeScript, ESLint, Prettier 규칙 적용
4. **Korean Localization**: 한국형 UX 패턴 및 현지화
5. **Supabase Integration**: client.ts/server.ts 활용

### Phase 4: Wave Management (Infinite Mode)

무한 모드에서는 파도식 개발을 진행합니다:

**Wave 1: Core Foundation**
- 기본 페이지 구조
- Supabase 클라이언트 함수
- 인증 시스템

**Wave 2: Business Logic**
- 프로그램 예약 시스템
- 결제 연동 (lib/payments/)
- 사용자 대시보드

**Wave 3: Advanced Features**
- 구독 관리 (lib/subscriptions/)
- 실시간 기능 (lib/realtime/)
- 관리자 기능

**Wave 4: Optimization**
- 성능 최적화
- SEO 개선
- 모니터링 시스템

### Phase 5: Quality Assurance

각 생성물에 대해 다음 품질 검증을 수행합니다:

1. **Code Review**: 코딩 표준 준수 확인
2. **Type Safety**: TypeScript 타입 오류 해결
3. **Responsive Design**: 모바일/태블릿/데스크톱 호환성
4. **Accessibility**: WCAG 가이드라인 준수
5. **Performance**: Core Web Vitals 최적화
6. **Supabase RLS**: Row Level Security 정책 확인

### Phase 6: Git Integration

안전한 버전 관리를 위한 자동 Git 워크플로우:

1. **Feature Branch**: 각 기능별 브랜치 생성
2. **Atomic Commits**: 논리적 단위별 커밋
3. **Code Review**: 자동 코드 리뷰 및 개선
4. **Safe Merge**: 충돌 방지 및 안전한 병합

### Safety Protocols

무한 루프의 안전한 실행을 위한 프로토콜:

1. **Iteration Limits**: 기본 20회, 최대 100회 제한
2. **Resource Monitoring**: CPU, 메모리 사용량 모니터링
3. **Error Handling**: 예외 발생 시 graceful degradation
4. **User Intervention**: 언제든 사용자가 중단 가능
5. **Progress Tracking**: 실시간 진행 상황 표시
6. **Supabase MCP**: MCP 명령어 안전성 확인

## 생성 가능한 구성요소

### Pages (app/ 디렉토리)
- 랜딩 페이지 (/, /about, /history)
- 프로그램 페이지 (/programs, /programs/[slug])
- 구독 페이지 (/subscription)
- 사용자 페이지 (/mypage/*)
- 관리자 페이지 (/admin/*)

### Components (components/ 디렉토리)
- Header/Footer/Navigation
- 프로그램 카드/리스트
- 결제 폼/모달
- 대시보드 위젯
- 차트/통계 컴포넌트

### Supabase Functions (lib/ 디렉토리)
- 데이터베이스 쿼리 (lib/database/)
- 인증 관리 (lib/auth/)
- 결제 연동 (lib/payments/)
- 구독 관리 (lib/subscriptions/)
- 실시간 기능 (lib/realtime/)

### Database Schema (이미 적용됨)
- Users, Programs, Subscriptions
- Reservations, Payments, Reviews
- Notifications, Settings

## Supabase MCP 통합

### 자동 MCP 명령어 실행
```bash
# 테이블 조회
/mcp:supabase execute-sql "SELECT * FROM programs WHERE status = 'active'"

# 타입 생성
/mcp:supabase generate-typescript-types

# 마이그레이션 적용
/mcp:supabase apply-migration "update_program_schema"
```

### 참고 레포지토리
**Infinite Agentic Loop**: https://github.com/rungchan2/infinite-agentic-loop
- 검증된 패턴 및 구조 참고
- 몬스터 협동조합에 맞게 Supabase 최적화

시작합니다! Master Orchestrator로서 Sub Agent들을 배치하고 몬스터 협동조합 **Supabase 기반** 플랫폼을 구축해나가겠습니다.

Arguments: $ARGUMENTS 