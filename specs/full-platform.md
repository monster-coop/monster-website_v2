# 몬스터 협동조합 전체 플랫폼 명세서

## 시스템 개요

**미션**: 팀프러너 양성을 위한 통합 교육 플랫폼 구축
**비전**: 2030년까지 50,000명의 팀프러너 양성 및 100억 매출 달성

## 플랫폼 아키텍처

### 1. 프론트엔드 시스템
- **Framework**: Next.js 15 (App Router)
- **UI Library**: Shadcn/ui + Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: TanStack Query + React State
- **Forms**: React Hook Form + Zod

### 2. 백엔드 시스템
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Payment**: TossPayments Integration

### 3. 하이브리드 CMS
- **Metadata**: Supabase (가격, 재고, 기본정보)
- **Content**: Notion API (커리큘럼, 강사소개)
- **Rendering**: react-notion-x

## 핵심 기능 모듈

### 모듈 1: 사용자 관리 시스템
**기능 범위**:
- 회원가입/로그인 (이메일 + 소셜)
- 프로필 관리 및 설정
- 역할 기반 권한 관리
- 사용자 활동 추적

**데이터 구조**:
```sql
-- Users 테이블
users (
  id uuid PRIMARY KEY,
  email varchar UNIQUE,
  name varchar,
  phone varchar,
  role user_role DEFAULT 'user',
  created_at timestamp,
  updated_at timestamp
)

-- Profiles 테이블
profiles (
  id uuid PRIMARY KEY REFERENCES users(id),
  avatar_url text,
  bio text,
  interests text[],
  education_goals text,
  company varchar,
  position varchar
)
```

### 모듈 2: 교육 프로그램 시스템
**4가지 핵심 프로그램**:

#### 2-1. 팀기업가정신 교육
- 프로젝트 기반 학습 (PBL)
- 팀 구성 및 역할 분담
- 실제 비즈니스 모델 개발
- 성과 발표 및 피드백

#### 2-2. SQUEEZE LRS
- 과정 중심 평가 시스템
- 개인별 학습 진도 추적
- 실시간 피드백 제공
- 성취도 분석 리포트

#### 2-3. 챌린지 트립
- 맞춤형 체험 학습 프로그램
- 글로벌 역량 개발
- 문화 이해 및 적응
- 네트워킹 기회 제공

#### 2-4. 작가가 되는 트립
- 개인 여행 기획 프로젝트
- 콘텐츠 창작 및 편집
- 출판 과정 체험
- 개인 브랜딩 구축

**데이터 구조**:
```sql
-- Programs 테이블
programs (
  id uuid PRIMARY KEY,
  name varchar NOT NULL,
  type program_type,
  description text,
  duration_weeks integer,
  max_participants integer,
  price decimal,
  status program_status,
  notion_page_id varchar,
  created_at timestamp
)

-- Program Sessions 테이블
program_sessions (
  id uuid PRIMARY KEY,
  program_id uuid REFERENCES programs(id),
  title varchar,
  start_date timestamp,
  end_date timestamp,
  location varchar,
  instructor_id uuid,
  max_participants integer
)
```

### 모듈 3: 예약 및 결제 시스템
**예약 프로세스**:
1. 프로그램 선택 및 일정 확인
2. 참가자 정보 입력
3. 결제 정보 확인
4. TossPayments 결제 처리
5. 예약 확정 및 알림 발송

**결제 시스템**:
- 신용카드, 계좌이체, 간편결제
- 할부 결제 옵션
- 환불 정책 자동 적용
- 결제 실패 시 재시도 로직

**데이터 구조**:
```sql
-- Reservations 테이블
reservations (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  session_id uuid REFERENCES program_sessions(id),
  status reservation_status,
  payment_id uuid,
  special_requests text,
  created_at timestamp
)

-- Payments 테이블
payments (
  id uuid PRIMARY KEY,
  reservation_id uuid REFERENCES reservations(id),
  amount decimal,
  payment_method varchar,
  toss_payment_key varchar,
  status payment_status,
  approved_at timestamp
)
```

### 모듈 4: SQUEEZE LMS 구독 시스템
**구독 플랜**:
- **Basic**: 월 29,000원 - 기본 LRS 기능
- **Pro**: 월 59,000원 - 고급 분석 + 맞춤 피드백
- **Enterprise**: 월 99,000원 - 조직 관리 + API 연동

**LMS 기능**:
- 개인별 학습 대시보드
- 진도 추적 및 성취도 분석
- 실시간 피드백 시스템
- 팀 프로젝트 관리 도구

**데이터 구조**:
```sql
-- Subscriptions 테이블
subscriptions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  plan subscription_plan,
  status subscription_status,
  current_period_start timestamp,
  current_period_end timestamp,
  auto_renew boolean DEFAULT true
)

-- Learning Progress 테이블
learning_progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  program_id uuid REFERENCES programs(id),
  completion_rate decimal,
  last_activity timestamp,
  achievements jsonb
)
```

### 모듈 5: 관리자 시스템
**관리 기능**:
- 프로그램 생성 및 관리
- 참가자 현황 모니터링
- 결제 및 환불 처리
- 통계 및 리포트 생성

**분석 대시보드**:
- 프로그램별 참가율
- 수익 분석 및 예측
- 사용자 행동 패턴
- 만족도 조사 결과

### 모듈 6: 커뮤니케이션 시스템
**알림 시스템**:
- 이메일 자동 발송
- SMS 알림 (선택적)
- 앱 푸시 알림
- 브라우저 알림

**문의 관리**:
- 실시간 채팅 지원
- 문의 티켓 시스템
- FAQ 자동 응답
- 상담 예약 시스템

## 사용자 여정 (User Journey)

### 신규 사용자
1. **발견**: 검색/광고를 통한 랜딩 페이지 유입
2. **탐색**: 프로그램 소개 및 후기 확인
3. **가입**: 간편 회원가입 (소셜 로그인)
4. **선택**: 관심 프로그램 및 일정 선택
5. **결제**: 안전한 결제 프로세스
6. **참여**: 프로그램 참여 및 학습
7. **성과**: 수료증 발급 및 포트폴리오 구축

### 기존 사용자
1. **로그인**: 자동 로그인 또는 빠른 인증
2. **대시보드**: 개인 학습 현황 확인
3. **추천**: AI 기반 맞춤 프로그램 추천
4. **예약**: 원클릭 예약 및 결제
5. **학습**: 연속적인 학습 경험
6. **공유**: 성과 공유 및 후기 작성

## 기술적 구현 사항

### 보안 요구사항
- HTTPS 강제 적용
- JWT 토큰 기반 인증
- Row Level Security (RLS)
- 입력값 검증 및 SQL Injection 방지
- GDPR 및 개인정보보호법 준수

### 성능 최적화
- CDN을 통한 정적 자원 배포
- 이미지 최적화 (WebP, lazy loading)
- 코드 분할 및 번들 최적화
- 데이터베이스 인덱싱
- Redis 캐싱 전략

### 확장성 고려사항
- 마이크로서비스 아키텍처 준비
- API 버전 관리
- 로드 밸런싱
- 자동 스케일링
- 모니터링 및 로깅

## 개발 로드맵

### Phase 1: MVP (4주)
- 기본 랜딩 페이지
- 사용자 인증 시스템
- 프로그램 소개 페이지
- 기본 예약 시스템

### Phase 2: 핵심 기능 (6주)
- 결제 시스템 연동
- 사용자 대시보드
- 관리자 패널
- 이메일 알림 시스템

### Phase 3: 고도화 (8주)
- SQUEEZE LMS 기능
- 고급 분석 대시보드
- 모바일 앱 (PWA)
- API 문서화

### Phase 4: 확장 (지속적)
- AI 기반 추천 시스템
- 챗봇 고객 지원
- 다국어 지원
- 파트너 API 연동

## 품질 보증

### 테스트 전략
- 단위 테스트 (Jest + Testing Library)
- 통합 테스트 (API 테스트)
- E2E 테스트 (Playwright)
- 성능 테스트 (Lighthouse)

### 모니터링
- 실시간 에러 추적 (Sentry)
- 성능 모니터링 (Vercel Analytics)
- 사용자 행동 분석 (Google Analytics)
- 서버 모니터링 (Supabase Dashboard)

## 성공 지표 (KPI)

### 비즈니스 지표
- 월간 활성 사용자 (MAU)
- 프로그램 참가율
- 구독 전환율 및 이탈률
- 평균 수익 per 사용자 (ARPU)

### 기술 지표
- 페이지 로딩 속도
- 시스템 가용성 (99.9% 목표)
- API 응답 시간
- 에러율 (< 1% 목표)

### 사용자 만족도
- NPS (Net Promoter Score)
- 사용자 리텐션율
- 프로그램 완주율
- 고객 지원 만족도

이 명세서를 바탕으로 완전한 몬스터 협동조합 플랫폼을 단계적으로 구축해주세요. 