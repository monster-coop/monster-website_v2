/**
 * Type definitions index file
 * Central export for all type definitions
 */

// Database types
export * from '@/types/database'

// Payment and reservation types
export * from './nicepay'
export * from './reservations'

// Program types
export * from './programs'

// Subscription types
export * from './subscriptions'

// Admin types
export * from './admin'

// User journey types
export * from './user-journey'

// Notification types
export * from './notifications'

// Re-export commonly used types for convenience
export type {
  NicePayPaymentRequest,
  NicePayAuthResult,
  NicePayApprovalResponse,
  NicePayPaymentRecord,
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
  EnhancedPayment,
  EnhancedReservation,
  ReservationFormData,
  RefundRequest
} from './nicepay'

export type {
  Reservation,
  Payment,
  ReservationStatus
} from './reservations'