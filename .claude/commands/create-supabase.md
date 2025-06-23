# Supabase Function Generator

Supabase 기반 데이터베이스 함수를 자동으로 생성합니다. 백엔드 API 없이 Supabase MCP와 클라이언트를 활용한 함수들을 생성합니다.

## Usage

```
/project:create-supabase <function_type> [table_name] [additional_options]
```

### Arguments
- `function_type`: 생성할 함수 타입 (database, auth, payments, subscriptions, realtime)
- `table_name`: 대상 테이블명 (programs, profiles, payments 등)
- `additional_options`: 추가 옵션 (crud, validation, rls 등)

### Examples

1. **Database CRUD Functions**
```
/project:create-supabase database programs crud
```
→ 프로그램 테이블 CRUD 함수 생성

2. **Authentication Functions**
```
/project:create-supabase auth profiles validation
```
→ 사용자 인증 및 프로필 관리 함수

3. **Payment Functions**
```
/project:create-supabase payments toss-integration
```
→ TossPayments 연동 함수

4. **Subscription Management**
```
/project:create-supabase subscriptions plans rls
```
→ 구독 관리 함수 (RLS 포함)

5. **Realtime Functions**
```
/project:create-supabase realtime notifications
```
→ 실시간 알림 함수

## Function Types

### 1. Database Functions (database)
Supabase 클라이언트를 사용한 데이터베이스 CRUD 함수를 생성합니다.

#### Generated Structure:
```typescript
// lib/database/[table_name].ts
import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

// CRUD Operations
export async function get[TableName]s(filters?: Filters)
export async function get[TableName]ById(id: string)
export async function create[TableName](data: CreateData)
export async function update[TableName](id: string, data: UpdateData)
export async function delete[TableName](id: string)

// Advanced Queries
export async function get[TableName]sWithPagination(page: number, limit: number)
export async function search[TableName]s(query: string)
export async function get[TableName]sByCategory(categoryId: string)
```

#### Table-Specific Functions:

**Programs Table:**
- `getActivePrograms()` - 활성 프로그램 조회
- `getProgramsByCategory()` - 카테고리별 프로그램
- `searchPrograms()` - 프로그램 검색
- `updateProgramParticipants()` - 참가자 수 업데이트
- `checkProgramAvailability()` - 참가 가능 여부 확인

**Profiles Table:**
- `getUserProfile()` - 사용자 프로필 조회
- `updateUserProfile()` - 프로필 업데이트
- `checkUserPermissions()` - 권한 확인
- `getUserStats()` - 사용자 통계

**Program Participants:**
- `registerForProgram()` - 프로그램 등록
- `cancelRegistration()` - 등록 취소
- `getUserRegistrations()` - 사용자 등록 내역
- `checkRegistrationStatus()` - 등록 상태 확인

### 2. Authentication Functions (auth)
Supabase Auth와 연동된 인증 관련 함수를 생성합니다.

#### Generated Structure:
```typescript
// lib/auth/index.ts
import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

// Auth Operations
export async function signUp(email: string, password: string, userData?: any)
export async function signIn(email: string, password: string)
export async function signOut()
export async function resetPassword(email: string)
export async function updatePassword(newPassword: string)

// Profile Management
export async function updateProfile(profileData: ProfileData)
export async function deleteAccount()

// Role & Permission
export async function checkIsAdmin(userId: string)
export async function updateUserRole(userId: string, role: string)
```

### 3. Payment Functions (payments)
TossPayments와 Supabase를 연동한 결제 관리 함수를 생성합니다.

#### Generated Structure:
```typescript
// lib/payments/index.ts
import { createClient } from '@/lib/supabase/server'

// Payment Processing
export async function initiatePayment(paymentData: PaymentData)
export async function confirmPayment(paymentKey: string, orderId: string, amount: number)
export async function cancelPayment(paymentKey: string, reason: string)

// Payment Records
export async function createPaymentRecord(paymentData: PaymentRecord)
export async function updatePaymentStatus(paymentId: string, status: PaymentStatus)
export async function getUserPayments(userId: string)

// Refund Management
export async function requestRefund(paymentId: string, reason: string)
export async function processRefund(refundId: string)
```

### 4. Subscription Functions (subscriptions)
SQUEEZE LMS 구독 관리 함수를 생성합니다.

#### Generated Structure:
```typescript
// lib/subscriptions/index.ts
import { createClient } from '@/lib/supabase/server'

// Subscription Management
export async function createSubscription(userId: string, planId: string)
export async function updateSubscription(subscriptionId: string, updates: SubscriptionUpdates)
export async function cancelSubscription(subscriptionId: string)
export async function pauseSubscription(subscriptionId: string)

// Plan Management
export async function getSubscriptionPlans()
export async function getUserSubscription(userId: string)
export async function checkSubscriptionStatus(userId: string)

// Billing
export async function processSubscriptionPayment(subscriptionId: string)
export async function sendSubscriptionInvoice(subscriptionId: string)
```

### 5. Realtime Functions (realtime)
Supabase Realtime을 활용한 실시간 기능 함수를 생성합니다.

#### Generated Structure:
```typescript
// lib/realtime/index.ts
import { createClient } from '@/lib/supabase/client'

// Realtime Subscriptions
export function subscribeToPrograms(callback: (payload: any) => void)
export function subscribeToUserNotifications(userId: string, callback: (payload: any) => void)
export function subscribeToPaymentUpdates(orderId: string, callback: (payload: any) => void)

// Notification Management
export async function sendNotification(userId: string, notification: NotificationData)
export async function markNotificationAsRead(notificationId: string)
export async function getUserNotifications(userId: string)
```

## Generated File Structure

각 함수 타입별로 다음과 같은 파일들이 생성됩니다:

```
lib/
├── database/
│   ├── programs.ts          # 프로그램 관련 DB 함수
│   ├── profiles.ts          # 사용자 프로필 DB 함수
│   ├── participants.ts      # 참가자 관리 DB 함수
│   ├── subscriptions.ts     # 구독 DB 함수
│   ├── payments.ts          # 결제 DB 함수
│   └── inquiries.ts         # 문의 DB 함수
├── auth/
│   ├── index.ts             # 인증 메인 함수
│   ├── profile.ts           # 프로필 관리
│   └── permissions.ts       # 권한 관리
├── payments/
│   ├── index.ts             # 결제 메인 함수
│   ├── toss.ts              # TossPayments 연동
│   └── refunds.ts           # 환불 관리
├── subscriptions/
│   ├── index.ts             # 구독 메인 함수
│   ├── plans.ts             # 플랜 관리
│   └── billing.ts           # 빌링 관리
└── realtime/
    ├── index.ts             # 실시간 메인 함수
    ├── notifications.ts     # 알림 관리
    └── subscriptions.ts     # 실시간 구독
```

## Code Generation Features

### 1. TypeScript Integration
- 완전한 타입 안전성
- Database 타입 자동 import
- Zod 스키마 validation
- JSDoc 문서화

### 2. Error Handling
- 표준화된 에러 처리
- Supabase 에러 래핑
- 커스텀 에러 타입
- 로깅 시스템

### 3. Performance Optimization
- 자동 쿼리 최적화
- 인덱스 활용 가이드
- 캐싱 전략 적용
- Batch operations

### 4. Security Features
- RLS 정책 자동 적용
- 입력값 검증
- SQL Injection 방지
- 권한 확인 로직

### 5. Testing Support
- Jest 테스트 파일 자동 생성
- Mock 데이터 생성
- 테스트 유틸리티
- E2E 테스트 시나리오

## 브랜드 가이드라인 적용

모든 생성된 함수는 다음 가이드라인을 준수합니다:

- **에러 메시지**: 한국어 지원
- **로깅**: 몬스터 협동조합 형식
- **네이밍**: camelCase 일관성
- **문서화**: JSDoc 한국어 주석
- **타입**: 명확한 타입 정의

## Supabase MCP Integration

생성된 함수들은 Supabase MCP와 완벽하게 통합됩니다:

```typescript
// MCP 명령어 자동 생성 예시
// /mcp:supabase execute-sql "SELECT * FROM programs WHERE status = 'active'"
// /mcp:supabase apply-migration "add_program_rating_column"
// /mcp:supabase generate-types
```

## 실행 예시

```bash
# 프로그램 관리 함수 생성
/project:create-supabase database programs crud

# 인증 시스템 생성  
/project:create-supabase auth profiles validation

# 결제 시스템 생성
/project:create-supabase payments toss-integration

# 구독 관리 생성
/project:create-supabase subscriptions plans rls

# 실시간 알림 생성
/project:create-supabase realtime notifications
```

Arguments: $ARGUMENTS 