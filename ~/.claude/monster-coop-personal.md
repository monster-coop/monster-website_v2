# HEECHAN LEE (rungchan2) - 몬스터 협동조합 개인 설정

## 개발자 프로필
- **이름**: HEECHAN LEE
- **GitHub**: rungchan2
- **역할**: Full-Stack Developer (Frontend Focus)
- **경험**: Next.js, React, TypeScript, Supabase 전문
- **현재 프로젝트**: 몬스터 협동조합 플랫폼

## 아키텍처 선호도 (Supabase 기반)

### 백엔드 구조 (중요: 백엔드 없음!)
- **데이터베이스**: Supabase PostgreSQL (스키마 적용 완료)
- **인증**: Supabase Auth
- **파일 저장**: Supabase Storage
- **실시간**: Supabase Realtime
- **MCP**: Supabase MCP 활용

### 프론트엔드 구조
- **프레임워크**: Next.js 15 (App Router)
- **UI 라이브러리**: Shadcn/ui (선호)
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **상태관리**: TanStack Query + React State
- **폼**: React Hook Form + Zod
- **아이콘**: Lucide React

### 파일 구조 선호도
```
lib/
├── supabase/          # 이미 존재 (client.ts, server.ts)
├── database/          # DB 쿼리 함수들
│   ├── programs.ts    # 프로그램 관련 (생성됨)
│   ├── profiles.ts    # 사용자 관리
│   ├── participants.ts # 참가자 관리
│   └── subscriptions.ts # 구독 관리
├── auth/              # 인증 함수들 (생성됨)
├── payments/          # TossPayments 연동
├── subscriptions/     # 구독 관리
├── realtime/          # 실시간 기능
├── utils/             # 유틸리티 (constants.ts 생성됨)
└── types/             # 공통 타입
```

## 코딩 스타일 선호도

### 네이밍 컨벤션 (확고함)
- 컴포넌트: **PascalCase** (UserProfile)
- 함수: **camelCase** (getUserProfile)
- 파일명: **kebab-case** (user-profile.tsx)
- 상수: **UPPER_SNAKE_CASE** (BRAND_COLORS)

### TypeScript 패턴
- 모든 함수에 명시적 타입 정의
- Database 타입 자동 생성 활용
- Zod 스키마 런타임 검증
- JSDoc 주석 (한국어)

### Supabase 클라이언트 사용 패턴
```typescript
// 클라이언트 컴포넌트
import { createClient } from '@/lib/supabase/client'

// 서버 컴포넌트/API
import { createClient } from '@/lib/supabase/server'
```

## 자동화 설정

### Git Workflow 선호도
- **브랜치**: feature/기능명
- **커밋**: Conventional Commits 
- **자동화**: GitHub Actions (Vercel 배포)

### Infinite Agent Loop 설정
- **최대 반복**: 20회
- **배치 크기**: 5개
- **동시 에이전트**: 3개
- **안전 검사**: 활성화
- **Supabase 통합**: 활성화

### 선호하는 명령어 순서
1. `/project:infinite specs/full-platform.md lib/ 5` (Supabase 함수 생성)
2. `/project:create-page specs/landing-page.md marketing`
3. `/project:create-component ui`
4. `/project:create-supabase database programs crud`

## 브랜드 가이드라인 준수

### 색상 체계 (엄격 준수)
- **메인**: #56007C (어두운 보라색)
- **보조**: White, Light Gray, Dark Gray
- **사용 금지**: 다른 브랜드 컬러 절대 사용 안함

### 한국형 UX 패턴
- 교육업계 표준 예약 플로우
- 참가 확인서 자동 발급
- 관리자와 직접 소통 채널
- 한국어 에러 메시지

## 성능 최적화 선호도

### 이미지 처리
- **포맷**: WebP 우선
- **로딩**: Lazy loading 필수
- **최적화**: Next.js Image 컴포넌트

### 데이터 페칭
- **라이브러리**: TanStack Query
- **캐싱**: Supabase built-in + React Query
- **최적화**: 인덱스 활용 (DB 스키마에 적용됨)

## 테스트 전략

### 우선순위
1. **타입 안전성**: TypeScript 컴파일 에러 0개
2. **단위 테스트**: Jest + Testing Library
3. **E2E 테스트**: Playwright
4. **컴포넌트 테스트**: Storybook

## 배포 환경

### 개발 환경
- **Frontend**: Vercel Preview
- **Database**: Supabase Preview Branch
- **Testing**: Local + GitHub Actions

### 프로덕션 환경
- **Frontend**: Vercel Production
- **Database**: Supabase Production
- **Monitoring**: Vercel Analytics + Supabase Logs

## MCP 명령어 선호도

### 자주 사용하는 Supabase MCP 명령어
```bash
# 타입 생성
/mcp:supabase generate-typescript-types

# 테이블 조회  
/mcp:supabase execute-sql "SELECT * FROM programs WHERE status = 'active'"

# 마이그레이션 적용
/mcp:supabase apply-migration "add_new_column"

# RLS 정책 확인
/mcp:supabase list-tables
```

## 참고 레포지토리
- **Infinite Agentic Loop**: https://github.com/rungchan2/infinite-agentic-loop
- **패턴 참고**: 검증된 구조 및 명령어 시스템
- **최적화**: 몬스터 협동조합에 맞게 Supabase 특화

## 커뮤니케이션 선호도

### 에러 메시지
- **언어**: 한국어
- **톤**: 친근하고 명확함
- **형식**: "~에 실패했습니다" 패턴

### 문서화
- **주석**: JSDoc 한국어
- **README**: 명확한 설치/실행 가이드
- **타입**: 의미 있는 타입명

---

**마지막 업데이트**: 2024년 - Supabase 기반 아키텍처 적용 완료 