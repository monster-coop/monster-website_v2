import { Database } from '@/types/database'

// Core reservation types
export type Reservation = Database['public']['Tables']['program_participants']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']

// Enhanced reservation types
export interface EnhancedReservation extends Reservation {
  program?: {
    title: string
    start_date: string
    end_date: string
    location: string
    instructor_name: string
  }
  payment?: Payment
}

export type ReservationStatus = 'registered' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'

// Reservation form data
export interface ReservationFormData {
  // Program selection
  program_id: string
  session_id?: string
  
  // Participant information
  participant_name: string
  participant_email: string
  participant_phone: string
  emergency_contact?: string
  dietary_restrictions?: string
  special_requests?: string
  
  // Payment information
  payment_method: 'card' | 'transfer' | 'simple'
  installment_months?: number
  coupon_code?: string
  
  // Terms and conditions
  terms_agreed: boolean
  privacy_agreed: boolean
  marketing_agreed?: boolean
}

// Payment integration with TossPayments
export interface TossPaymentRequest {
  orderId: string
  amount: number
  orderName: string
  customerEmail: string
  customerName: string
  customerMobilePhone?: string
  successUrl: string
  failUrl: string
  validHours?: number
  cashReceiptType?: 'personal' | 'corporate'
  easyPay?: string
  locale?: 'ko_KR' | 'en_US'
  flowMode?: 'DEFAULT' | 'DIRECT'
  discountCode?: string
}

export interface TossPaymentResponse {
  paymentKey: string
  orderId: string
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED'
  totalAmount: number
  balanceAmount: number
  suppliedAmount: number
  vat: number
  currency: string
  method: string
  version: string
  requestedAt: string
  approvedAt?: string
  receipt?: {
    url: string
  }
  checkout?: {
    url: string
  }
  card?: {
    company: string
    number: string
    installmentPlanMonths: number
    isInterestFree: boolean
    approveNo: string
    useCardPoint: boolean
    cardType: string
    ownerType: string
    acquireStatus: string
    receiptUrl: string
  }
  virtualAccount?: {
    accountType: string
    accountNumber: string
    bankCode: string
    customerName: string
    dueDate: string
    refundStatus: string
    expired: boolean
    settlementStatus: string
    refundReceiveAccount?: {
      bankCode: string
      accountNumber: string
      holderName: string
    }
  }
  transfer?: {
    bankCode: string
    settlementStatus: string
  }
  mobilePhone?: {
    customerMobilePhone: string
    settlementStatus: string
    receiptUrl: string
  }
  giftCertificate?: {
    approveNo: string
    settlementStatus: string
  }
  cashReceipt?: {
    type: string
    receiptKey: string
    issueNumber: string
    receiptUrl: string
    amount: number
    taxFreeAmount: number
  }
  discount?: {
    amount: number
  }
  cancels?: Array<{
    cancelAmount: number
    cancelReason: string
    taxFreeAmount: number
    taxAmount: number
    refundableAmount: number
    easyPayDiscountAmount: number
    canceledAt: string
    transactionKey: string
  }>
  secret?: string
  type: 'NORMAL' | 'BILLING'
  easyPay?: {
    provider: string
    amount: number
    discountAmount: number
  }
  country: string
  failure?: {
    code: string
    message: string
  }
}

// Note: Coupon system removed as coupons table is not defined in the current database schema

export interface DiscountCalculation {
  original_amount: number
  discount_amount: number
  final_amount: number
  coupon_applied?: any
  early_bird_discount?: number
  loyalty_discount?: number
}

// Notification preferences
export interface NotificationPreferences {
  email_confirmation: boolean
  sms_reminder: boolean
  push_notifications: boolean
  marketing_emails: boolean
  program_updates: boolean
  payment_notifications: boolean
}

// Note: Waitlist management removed as waitlist table is not defined in the current database schema

// Refund management
export interface RefundRequest {
  id: string
  payment_id: string
  user_id: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  processed_by?: string
  processed_at?: string
  refund_method: 'original' | 'account_transfer'
  bank_account?: {
    bank_code: string
    account_number: string
    holder_name: string
  }
  created_at: string
}

// Analytics for reservations
export interface ReservationAnalytics {
  total_reservations: number
  confirmed_reservations: number
  cancellation_rate: number
  average_booking_lead_time: number
  popular_time_slots: Array<{
    day: string
    time: string
    booking_count: number
  }>
  revenue_by_program: Array<{
    program_id: string
    program_name: string
    revenue: number
    participant_count: number
  }>
  conversion_funnel: {
    page_views: number
    program_details_views: number
    reservation_started: number
    payment_attempted: number
    payment_completed: number
  }
}