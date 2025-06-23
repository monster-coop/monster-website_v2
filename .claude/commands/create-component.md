# Create Component Command

몬스터 협동조합 디자인 시스템에 맞는 재사용 가능한 React 컴포넌트를 생성합니다.

## Usage

```
/project:create-component <component_name> [component_type] [features]
```

### Arguments
- `component_name`: 컴포넌트 이름 (예: program-card, payment-form, user-profile)
- `component_type`: 컴포넌트 유형 (ui, layout, business, form)
- `features`: 추가 기능 (animation, responsive, interactive, data-fetching)

### Examples

```bash
# UI 컴포넌트 (기본)
/project:create-component program-card ui

# 애니메이션이 있는 레이아웃 컴포넌트
/project:create-component hero-section layout animation

# 데이터 연동이 있는 비즈니스 컴포넌트
/project:create-component program-list business data-fetching

# 인터랙티브 폼 컴포넌트
/project:create-component reservation-form form interactive,responsive
```

## Component Generation Protocol

당신은 **Component Engineer Agent**로서 다음 프로토콜을 따라 컴포넌트를 생성합니다:

### Step 1: Component Analysis
주어진 인수를 분석하여 다음을 결정합니다:
- 컴포넌트의 주요 목적과 책임
- Props 인터페이스와 상태 관리
- 하위 컴포넌트 구조
- 필요한 훅과 라이브러리

### Step 2: Component Type Classification

#### UI Components (ui)
기본 인터페이스 요소들:
- **Button Variants**: Primary, Secondary, Outline, Ghost
- **Card Components**: Product, Feature, Testimonial
- **Input Elements**: Text, Email, Phone, Password
- **Display Elements**: Badge, Avatar, Tag, Status

#### Layout Components (layout)
페이지 구조와 레이아웃:
- **Header/Footer**: Navigation, Branding, Links
- **Sections**: Hero, Features, CTA, Content
- **Containers**: Grid, Flex, Responsive Wrappers
- **Navigation**: Sidebar, Breadcrumb, Pagination

#### Business Components (business)
비즈니스 로직이 포함된 컴포넌트:
- **Program Cards**: 교육 프로그램 표시
- **Reservation Forms**: 예약 및 결제
- **User Dashboards**: 개인 정보 및 활동
- **Admin Panels**: 관리 기능

#### Form Components (form)
데이터 입력과 검증:
- **Multi-step Forms**: 단계별 진행
- **Validation Forms**: 실시간 검증
- **File Upload**: 이미지, 문서 업로드
- **Search Forms**: 필터링과 검색

### Step 3: File Structure Planning

```
components/
├── ui/                   # 기본 UI 컴포넌트
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
├── layout/               # 레이아웃 컴포넌트
│   ├── header.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
├── business/             # 비즈니스 로직 컴포넌트
│   ├── program-card.tsx
│   ├── reservation-form.tsx
│   └── user-dashboard.tsx
├── forms/                # 폼 컴포넌트
│   ├── contact-form.tsx
│   ├── payment-form.tsx
│   └── search-form.tsx
└── shared/               # 공통 컴포넌트
    ├── loading.tsx
    ├── error-boundary.tsx
    └── seo-head.tsx
```

### Step 4: Component Template Generation

#### Basic Component Template
```typescript
'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface [ComponentName]Props {
  className?: string
  // 컴포넌트별 props 정의
}

export function [ComponentName]({ 
  className,
  ...props 
}: [ComponentName]Props) {
  return (
    <div className={cn(
      "기본 스타일링",
      className
    )}>
      {/* 컴포넌트 내용 */}
    </div>
  )
}

[ComponentName].displayName = "[ComponentName]"
```

#### With Animation (Framer Motion)
```typescript
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface [ComponentName]Props {
  className?: string
  animate?: boolean
}

export function [ComponentName]({ 
  className,
  animate = true,
  ...props 
}: [ComponentName]Props) {
  const MotionComponent = animate ? motion.div : 'div'
  
  return (
    <MotionComponent
      className={cn("기본 스타일링", className)}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={animate ? { duration: 0.5 } : undefined}
    >
      {/* 컴포넌트 내용 */}
    </MotionComponent>
  )
}
```

#### With Data Fetching
```typescript
'use client'

import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface [ComponentName]Props {
  // props 정의
}

export function [ComponentName](props: [ComponentName]Props) {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['component-data'],
    queryFn: () => fetchComponentData(),
  })

  if (isLoading) {
    return <[ComponentName]Skeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          데이터를 불러오는 중 오류가 발생했습니다.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      {/* 데이터가 있는 컴포넌트 내용 */}
    </div>
  )
}

function [ComponentName]Skeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}
```

### Step 5: Brand Styling Integration

#### Color System
```typescript
const brandColors = {
  primary: '#56007C',      // 몬스터 퍼플
  primaryHover: '#44005f',
  secondary: '#FFFFFF',
  accent: '#F8F9FA',
  text: '#343A40',
  textMuted: '#6c757d',
}

// Tailwind 클래스 매핑
const brandClasses = {
  primary: 'bg-[#56007C] text-white hover:bg-[#44005f]',
  secondary: 'bg-white text-[#343A40] border border-gray-200',
  accent: 'bg-[#F8F9FA] text-[#343A40]',
}
```

#### Typography Scale
```typescript
const typography = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold',
  h4: 'text-xl md:text-2xl font-semibold',
  body: 'text-base md:text-lg',
  small: 'text-sm',
  muted: 'text-sm text-muted-foreground',
}
```

### Step 6: Interactive Features

#### Form Validation (React Hook Form + Zod)
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  // 스키마 정의
})

export function [FormComponent]() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // 기본값
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 제출 로직
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 폼 필드들 */}
      </form>
    </Form>
  )
}
```

#### Responsive Design
```typescript
const responsiveClasses = {
  mobile: 'block md:hidden',
  tablet: 'hidden md:block lg:hidden',
  desktop: 'hidden lg:block',
  mobileAndTablet: 'block lg:hidden',
  tabletAndDesktop: 'hidden md:block',
}
```

### Step 7: Accessibility Features

#### ARIA 지원
```typescript
export function [ComponentName]({ 
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props 
}: ComponentProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || '기본 라벨'}
      aria-describedby={ariaDescribedBy}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // 키보드 액션
        }
      }}
    >
      {/* 컴포넌트 내용 */}
    </div>
  )
}
```

#### Focus Management
```typescript
import { useRef, useEffect } from 'react'

export function [ComponentName]({ autoFocus }: { autoFocus?: boolean }) {
  const focusRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (autoFocus && focusRef.current) {
      focusRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div
      ref={focusRef}
      className="focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:ring-opacity-50"
    >
      {/* 컴포넌트 내용 */}
    </div>
  )
}
```

### Step 8: Testing & Storybook

#### Component Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { [ComponentName] } from './[component-name]'

describe('[ComponentName]', () => {
  it('renders correctly', () => {
    render(<[ComponentName] />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<[ComponentName] onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('supports keyboard navigation', () => {
    render(<[ComponentName] />)
    const element = screen.getByRole('button')
    
    fireEvent.keyDown(element, { key: 'Enter' })
    // 키보드 이벤트 검증
  })
})
```

#### Storybook Story
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { [ComponentName] } from './[component-name]'

const meta: Meta<typeof [ComponentName]> = {
  title: 'Components/[ComponentName]',
  component: [ComponentName],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // 기본 props
  },
}

export const WithAnimation: Story = {
  args: {
    animate: true,
  },
}

export const Responsive: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
      },
    },
  },
}
```

### Step 9: Documentation Generation

#### Component README
```markdown
# [ComponentName]

## Description
컴포넌트 설명

## Usage
```tsx
import { [ComponentName] } from '@/components/[category]/[component-name]'

<[ComponentName] prop1="value1" prop2="value2" />
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | - | 설명 |

## Examples
예제 코드들

## Accessibility
접근성 관련 정보
```

컴포넌트 생성을 시작합니다!

Component Name: $ARGUMENTS
Component Type: ui (기본값)
Features: 없음 (기본값)

완전한 컴포넌트 구조를 생성하고 관련 테스트, 스토리북, 문서를 포함하겠습니다. 