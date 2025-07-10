"use client";

import { motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Calendar, MapPin, Clock, User } from "lucide-react";
import Link from "next/link";
import { confirmTossPayment } from "@/lib/payments/toss";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    processPayment();
  }, []);

  const processPayment = async () => {
    try {
      const paymentKey = searchParams?.get('paymentKey');
      const orderId = searchParams?.get('orderId');
      const amount = searchParams?.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 누락되었습니다.');
        setLoading(false);
        return;
      }

      // Confirm payment with TossPayments
      const result = await confirmTossPayment(
        paymentKey,
        orderId,
        parseInt(amount)
      );

      setPaymentData(result);
      setLoading(false);
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      setError('결제 승인에 실패했습니다.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">결제를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 처리 실패</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/programs"
            className="bg-[#56007C] text-white px-6 py-2 rounded-lg hover:bg-[#56007C]/90 transition-colors"
          >
            프로그램 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            결제가 완료되었습니다!
          </h1>
          <p className="text-lg text-gray-600">
            프로그램 참가 신청이 성공적으로 처리되었습니다.
          </p>
        </motion.div>

        {paymentData && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">결제 상세 정보</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-medium">{paymentData.tossData?.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제방법</span>
                  <span className="font-medium">{paymentData.tossData?.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액</span>
                  <span className="font-medium text-[#56007C]">
                    ₩{paymentData.tossData?.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제일시</span>
                  <span className="font-medium">
                    {paymentData.tossData?.approvedAt && new Date(paymentData.tossData.approvedAt).toLocaleString('ko-KR')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">프로그램 정보</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>참가자 정보는 이메일로 발송됩니다</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>프로그램 일정 안내</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>장소 및 준비물 안내</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>참가 확정 안내</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
        >
          <h3 className="font-semibold text-blue-900 mb-2">다음 단계</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• 참가 확정 이메일이 발송됩니다</li>
            <li>• 프로그램 상세 정보를 확인해 주세요</li>
            <li>• 문의사항이 있으시면 고객센터로 연락해 주세요</li>
            <li>• 취소는 프로그램 시작 7일 전까지 가능합니다</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-[#56007C] text-white px-6 py-3 rounded-lg hover:bg-[#56007C]/90 transition-colors font-medium"
          >
            내 예약 관리
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/programs"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            다른 프로그램 보기
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">결제 결과를 확인하는 중...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}