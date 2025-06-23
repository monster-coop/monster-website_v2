# Create Page Command

몬스터 협동조합 브랜드 가이드라인을 준수하여 완전한 Next.js 페이지를 생성합니다.

## Usage

```
/project:create-page <page_name> [page_type] [features]
```

### Arguments
- `page_name`: 생성할 페이지 이름 (예: landing, about, programs)
- `page_type`: 페이지 유형 (marketing, dashboard, form, detail)
- `features`: 추가 기능 (auth, payment, subscription, admin)

### Examples

```bash
# 마케팅 랜딩 페이지
/project:create-page landing marketing

# 프로그램 상세 페이지 (결제 기능 포함)
/project:create-page program-detail detail payment

# 사용자 대시보드 페이지 (인증 필요)
/project:create-page user-dashboard dashboard auth

# 관리자 페이지 (인증 + 관리자 권한)
/project:create-page admin-panel dashboard auth,admin
```

## Page Generation Protocol

당신은 **Page Architect Agent**로서 다음 프로토콜을 따라 페이지를 생성합니다:

### Step 1: Requirements Analysis
주어진 인수를 분석하여 다음을 결정합니다:
- 페이지의 주요 목적과 기능
- 필요한 컴포넌트와 레이아웃
- 데이터 요구사항과 API 연동
- 사용자 인터랙션 플로우

### Step 2: File Structure Planning
Next.js 15 App Router 구조에 맞춰 파일을 계획합니다:

```
app/
├── (main)/[page_name]/
│   ├── page.tsx          # 메인 페이지 컴포넌트
│   ├── layout.tsx        # 페이지별 레이아웃 (필요시)
│   ├── loading.tsx       # 로딩 상태
│   ├── error.tsx         # 에러 처리
│   └── components/       # 페이지 전용 컴포넌트
│       ├── hero-section.tsx
│       ├── feature-section.tsx
│       └── cta-section.tsx
├── api/[page_name]/      # API 라우트 (필요시)
│   ├── route.ts
│   └── [id]/route.ts
└── types/[page_name].ts  # 타입 정의
```

### Step 3: Component Architecture
페이지를 논리적 섹션으로 분할합니다:

#### Marketing Pages (marketing)
- **Hero Section**: 임팩트 있는 헤드라인, CTA 버튼
- **Features Section**: 주요 기능/혜택 소개
- **Social Proof**: 후기, 성과 지표, 파트너
- **CTA Section**: 행동 유도 섹션

#### Dashboard Pages (dashboard)
- **Header**: 네비게이션, 사용자 메뉴, 알림
- **Sidebar**: 메뉴, 탐색 링크
- **Main Content**: 위젯, 차트, 데이터 테이블
- **Status Bar**: 실시간 상태 정보

#### Detail Pages (detail)
- **Breadcrumb**: 탐색 경로
- **Content Header**: 제목, 메타 정보, 액션 버튼
- **Main Content**: 상세 정보, 미디어
- **Related Content**: 관련 항목, 추천

#### Form Pages (form)
- **Form Header**: 진행 상황, 단계 표시
- **Form Sections**: 논리적 그룹핑
- **Validation**: 실시간 검증, 에러 표시
- **Submit Actions**: 저장, 제출, 취소

### Step 4: Brand Compliance Check
모든 요소가 브랜드 가이드라인을 준수하는지 확인:

**Color Palette**
```css
:root {
  --monster-purple: #56007C;
  --monster-white: #FFFFFF;
  --monster-light-gray: #F8F9FA;
  --monster-dark-gray: #343A40;
}
```

**Typography**
- 헤딩: 강조와 신뢰감을 위한 고딕 계열
- 본문: 가독성을 위한 Sans-serif
- 반응형 타이포그래피 스케일

**Components**
- Shadcn/ui 컴포넌트 우선 사용
- 라운드 모서리, 미묘한 그림자
- 접근성 고려 (ARIA 라벨, 키보드 네비게이션)

### Step 5: Code Generation

#### Page Component Template
```typescript
import { Metadata } from 'next'
import { HeroSection } from './components/hero-section'
import { FeatureSection } from './components/feature-section'

export const metadata: Metadata = {
  title: '[Page Title] - 몬스터 협동조합',
  description: '[Page Description]',
  keywords: ['팀프러너', '교육', '협동조합'],
}

export default function [PageName]Page() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeatureSection />
      {/* Additional sections */}
    </div>
  )
}
```

#### Component Template
```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface [ComponentName]Props {
  // Define props
}

export function [ComponentName]({ ...props }: [ComponentName]Props) {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Component content */}
      </div>
    </section>
  )
}
```

### Step 6: Feature Integration

#### Authentication (auth)
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// 서버 컴포넌트에서 인증 확인
const supabase = createServerComponentClient({ cookies })
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  redirect('/login')
}
```

#### Payment (payment)
```typescript
import { TossPayments } from '@/lib/toss-payments'
import { PaymentForm } from '@/components/payment/payment-form'

// TossPayments 연동 컴포넌트
```

#### Admin (admin)
```typescript
import { checkAdminRole } from '@/lib/auth'

// 관리자 권한 확인 로직
```

### Step 7: Testing & Accessibility

생성된 페이지에 다음을 포함합니다:

#### Unit Tests
```typescript
import { render, screen } from '@testing-library/react'
import [PageName]Page from './page'

describe('[PageName]Page', () => {
  it('renders without crashing', () => {
    render(<[PageName]Page />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

#### Accessibility Features
- 시맨틱 HTML 구조
- ARIA 라벨과 역할
- 키보드 탐색 지원
- 스크린 리더 호환성
- 색상 대비 준수

### Step 8: Performance Optimization

#### Loading Optimization
```typescript
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  )
}
```

#### SEO Optimization
```typescript
export const metadata: Metadata = {
  title: '',
  description: '',
  keywords: [],
  openGraph: {
    title: '',
    description: '',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

페이지 생성을 시작합니다!

Page Name: $ARGUMENTS
Page Type: marketing (기본값)
Features: 없음 (기본값)

완전한 페이지 구조를 생성하고 모든 관련 파일을 생성하겠습니다. 