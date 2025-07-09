# 몬스터 협동조합 프로젝트 가이드

## 프로젝트 개요
**몬스터 협동조합**은 "팀프러너를 양성하는 No.1 교육 기관"으로, Next.js 15 기반의 현대적인 웹 플랫폼을 구축하는 프로젝트입니다.

### 핵심 목표
- 1차: 몬스터 협동조합 소개 및 브랜딩 플랫폼
- 2차: 오프라인 교육 프로그램 예약/결제 시스템
- 3차: SQUEEZE LMS 온라인 구독 서비스

## 기술 스택

### 프론트엔드
- **프레임워크**: Next.js 15 (App Router)
- **UI**: Shadcn/ui + Tailwind CSS
- **애니메이션**: Framer Motion
- **상태관리**: TanStack Query + React State
- **폼 관리**: React Hook Form + Zod

### 백엔드 & 데이터베이스
- **Database**: Supabase PostgreSQL (이미 스키마 적용 완료)
- **인증**: Supabase Auth
- **스토리지**: Supabase Storage
- **실시간**: Supabase Realtime
- **결제**: TossPayments
- **MCP**: Supabase MCP를 통한 데이터베이스 관리

### 데이터베이스 구조 (DB Schema 적용 완료)
- **사용자**: profiles, program_participants, wishlists
- **프로그램**: programs, program_categories
- **구독**: subscription_plans, user_subscriptions
- **결제**: payments, refunds
- **시스템**: inquiries, notifications, site_settings

### CMS (하이브리드)
- **Supabase**: 상품 메타데이터 (가격, 재고, 기본 정보)
- **Notion**: 상세 컨텐츠 (커리큘럼, 강사 소개, 리치 미디어)

## 코딩 표준

### 파일 구조
```
app/
├── (auth)/
├── (main)/
├── admin/
├── api/
├── components/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── database/
│   ├── auth/
│   ├── payments/
│   ├── utils/
│   └── types/
└── types/
```

### Supabase Client 사용법
```typescript
// 클라이언트 컴포넌트에서
import { createClient } from '@/lib/supabase/client'

// 서버 컴포넌트/API에서
import { createClient } from '@/lib/supabase/server'
```

### 네이밍 컨벤션
- 컴포넌트: PascalCase (UserProfile.tsx)
- 파일명: kebab-case (user-profile.tsx)
- 함수: camelCase (getUserProfile)
- 상수: UPPER_SNAKE_CASE (MAX_FILE_SIZE)

### 타입 정의
- 모든 컴포넌트에 props 타입 정의
- Zod 스키마를 통한 런타임 검증
- `/types` 디렉토리에서 중앙 집중 관리
- Database 타입은 Supabase CLI로 자동 생성

### 라이브러리 함수 구조 (/lib)
```
lib/
├── supabase/          # Supabase 클라이언트
├── database/          # DB 쿼리 함수들
│   ├── programs.ts    # 프로그램 관련 쿼리
│   ├── users.ts       # 사용자 관련 쿼리
│   ├── payments.ts    # 결제 관련 쿼리
│   └── subscriptions.ts # 구독 관련 쿼리
├── auth/              # 인증 관련 함수
├── payments/          # TossPayments 통합
├── utils/             # 유틸리티 함수
└── types/             # 공통 타입 정의
```

### 컴포넌트 작성 규칙
1. 기본 import 순서: React → Third-party → Internal → Types
2. Shadcn/ui 컴포넌트 우선 사용
3. 접근성(a11y) 고려사항 포함
4. 반응형 디자인 필수
5. Supabase 클라이언트는 서버/클라이언트 구분하여 사용

### 브랜드 가이드라인
- **메인 컬러**: #56007C (어두운 보라색)
- **보조 컬러**: White, Light Gray, Dark Gray
- **디자인 철학**: Modern & Clean, Professional, Approachable

## 개발 메모리

### Supabase 클라이언트 관련 중요 메모
- 항상 Supabase 인스턴스를 단일 함수 내에서 생성해야 함
- 동일 파일의 여러 함수에서 `const supabase = createClient()`를 한 번 선언하는 것은 허용되지 않음
- lib 파일이나 컴포넌트의 각 함수마다 Supabase 인스턴스를 새로 생성해야 함

### Supabase 데이터 관리 및 디버깅 메모
- 필요한 경우, Supabase MCP를 사용하여 데이터 삽입, 삭제, 업데이트 시 데이터 유효성 검사
- Supabase 구성 문제(테이블 정책, RLS, 함수, 트리거 등)가 발생하면 Supabase MCP를 현명하게 사용하여 디버깅

## 로깅 관련 메모
- console.error로 객체를 로깅할 때 전체 객체 내용이 표시되지 않음
- 전체 객체 로그를 출력하려면 console.dir()을 사용할 것

### Shadcn/UI 관련 메모
- this is very important. use shadcn/ui component. if possible. use it in every ui creation. use npx ~ to install shadcn ui.