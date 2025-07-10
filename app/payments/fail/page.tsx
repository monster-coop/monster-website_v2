"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

function PaymentFailContent() {
  const searchParams = useSearchParams();
  
  const errorCode = searchParams?.get('code');
  const errorMessage = searchParams?.get('message');
  const orderId = searchParams?.get('orderId');

  const getErrorDescription = (code: string | null) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '사용자가 결제를 취소했습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 진행 중 오류가 발생했습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거절했습니다.';
      case 'INSUFFICIENT_FUNDS':
        return '잔액이 부족합니다.';
      case 'INVALID_CARD_EXPIRATION':
        return '카드 유효기간을 확인해 주세요.';
      case 'INVALID_STOPPED_CARD':
        return '정지된 카드입니다.';
      case 'EXCEED_MAX_DAILY_PAYMENT_COUNT':
        return '일일 결제 한도를 초과했습니다.';
      case 'NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT':
        return '할부 결제를 지원하지 않는 카드입니다.';
      default:
        return errorMessage || '알 수 없는 오류가 발생했습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            결제에 실패했습니다
          </h1>
          <p className="text-lg text-gray-600">
            결제 처리 중 문제가 발생했습니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">오류 상세 정보</h2>
          
          <div className="space-y-3">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호</span>
                <span className="font-medium">{orderId}</span>
              </div>
            )}
            {errorCode && (
              <div className="flex justify-between">
                <span className="text-gray-600">오류 코드</span>
                <span className="font-medium text-red-600">{errorCode}</span>
              </div>
            )}
            <div className="flex justify-between items-start">
              <span className="text-gray-600">오류 내용</span>
              <span className="font-medium text-right max-w-xs">
                {getErrorDescription(errorCode)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8"
        >
          <h3 className="font-semibold text-yellow-900 mb-2">해결 방법</h3>
          <ul className="text-yellow-800 space-y-1 text-sm">
            <li>• 카드 정보를 다시 확인해 주세요</li>
            <li>• 카드 한도 및 잔액을 확인해 주세요</li>
            <li>• 다른 결제 수단을 시도해 보세요</li>
            <li>• 문제가 계속되면 카드사에 문의해 주세요</li>
            <li>• 지속적인 문제 발생 시 고객센터로 연락해 주세요</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-[#56007C] text-white px-6 py-3 rounded-lg hover:bg-[#56007C]/90 transition-colors font-medium"
          >
            <RefreshCw size={16} />
            다시 결제하기
          </button>
          <Link
            href="/programs"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            프로그램 목록으로
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            결제 관련 문의: <span className="font-medium">1588-1234</span> | 
            평일 9:00 - 18:00
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">결제 결과를 확인하는 중...</p>
        </div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}