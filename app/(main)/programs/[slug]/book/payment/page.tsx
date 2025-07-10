"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  AlertCircle,
  CheckCircle,
  CreditCard,
  Clock
} from "lucide-react";
import Link from "next/link";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

// 클라이언트 키 및 고유 키 생성
const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENT_WIDGET_CLIENT_KEY || "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const generateRandomString = () => window.btoa(Math.random().toString()).slice(0, 20);

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 50000,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<any>(null);

  const slug = params?.slug as string;
  const reservationId = searchParams?.get('reservation');

  // 1단계: 예약 정보 확인 및 TossPayments 위젯 초기화
  useEffect(() => {
    console.log('🔍 Payment page mounted');
    console.log('reservationId:', reservationId);

    if (!reservationId) {
      console.log('❌ No reservation ID found');
      setError('예약 정보를 찾을 수 없습니다.');
      return;
    }

    // 이미 위젯이 생성되어 있으면 중복 생성 방지
    if (widgets) {
      console.log('⚠️ Widgets already exists, skipping initialization');
      return;
    }

    // Mock reservation data (실제로는 API에서 가져와야 함)
    const mockReservation = {
      id: reservationId,
      program: {
        title: "팀프러너 기초 과정",
        amount: 50000
      },
      participant_name: "홍길동",
      participant_email: "test@example.com"
    };
    
    console.log('✅ Mock reservation:', mockReservation);
    setReservation(mockReservation);
    
    // 결제 금액 설정
    setAmount({
      currency: "KRW",
      value: mockReservation.program.amount,
    });

    // TossPayments 위젯 초기화
    async function fetchPaymentWidgets() {
      try {
        console.log('📦 Loading TossPayments SDK...');
        console.log('🔑 Client key:', clientKey);
        
        const tossPayments = await loadTossPayments(clientKey);
        console.log('✅ TossPayments SDK loaded');

        // 비회원 결제 (실제로는 고유 customerKey를 사용해야 함)
        const paymentWidgets = tossPayments.widgets({
          customerKey: ANONYMOUS,
        });
        console.log('✅ Widgets created');

        setWidgets(paymentWidgets);
      } catch (error) {
        console.error('❌ Error fetching payment widget:', error);
        console.dir(error);
        setError(`결제 위젯 로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    }

    fetchPaymentWidgets();
  }, [reservationId, widgets]);

  // 2단계: 위젯이 준비되면 결제 UI 렌더링
  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        console.log('⏳ Widgets not ready yet');
        return;
      }

      if (ready) {
        console.log('⚠️ Widgets already rendered, skipping');
        return;
      }

      try {
        console.log('💰 Setting amount...', amount);
        
        // 결제 금액 설정 (필수 - 다른 렌더링보다 먼저 실행)
        await widgets.setAmount(amount);
        console.log('✅ Amount set');

        console.log('🎨 Rendering payment UI...');
        console.log('🔍 Looking for DOM elements...');
        
        const paymentElement = document.getElementById('payment-method');
        const agreementElement = document.getElementById('agreement');
        
        console.log('payment-method element:', paymentElement);
        console.log('agreement element:', agreementElement);
        
        if (!paymentElement || !agreementElement) {
          throw new Error('DOM 요소를 찾을 수 없습니다');
        }
        
        console.log('🎯 Starting renderPaymentMethods...');
        await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        });
        console.log('✅ Payment methods rendered');
        
        console.log('🎯 Starting renderAgreement...');
        await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        });
        console.log('✅ Agreement rendered');
        
        console.log('✅ Payment UI rendered successfully');
        setReady(true);
        console.log('🎉 Payment widgets ready!');
        
      } catch (error) {
        console.error('❌ Error rendering payment widgets:', error);
        console.dir(error);
        setError(`결제 UI 렌더링에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    }

    renderPaymentWidgets();
  }, [widgets, amount, ready]);

  // 결제 요청 처리
  const handlePayment = async () => {
    if (!widgets || !ready || !reservation) {
      console.log('❌ Payment not ready');
      return;
    }

    try {
      console.log('🚀 Starting payment request...');
      
      const orderId = generateRandomString();
      console.log('🏷️ Generated order ID:', orderId);

      await widgets.requestPayment({
        selector: "#payment-request-button",
        orderId: orderId,
        orderName: reservation.program.title,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
        customerEmail: reservation.participant_email,
        customerName: reservation.participant_name,
        customerMobilePhone: "01012341234",
      });
    } catch (error) {
      console.error('❌ Payment request failed:', error);
      setError(`결제 요청에 실패했습니다: ${error}`);
    }
  };

  // 로딩 중 표시
  if (!ready && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">결제 시스템을 준비하는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제할 수 없습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href={`/programs/${slug}/book`}
            className="bg-[#56007C] text-white px-6 py-2 rounded-lg hover:bg-[#56007C]/90 transition-colors"
          >
            예약 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/programs/${slug}/book`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#56007C] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            예약 페이지로 돌아가기
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#56007C] text-white">
              <CheckCircle size={16} />
            </div>
            <div className="flex-1 h-1 bg-[#56007C]"></div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#56007C] text-white">
              2
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>참가자 정보</span>
            <span>결제</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard size={24} />
                결제하기
              </h1>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">결제 수단 선택</h3>
                <div id="payment-method" className="min-h-[200px]">
                  {/* TossPayments 결제 UI가 여기에 렌더링됩니다 */}
                </div>
              </div>

              {/* Payment Agreement */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">약관 동의</h3>
                <div id="agreement" className="min-h-[100px]">
                  {/* TossPayments 약관 UI가 여기에 렌더링됩니다 */}
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-800">
                  <CheckCircle size={16} />
                  <span className="font-medium text-sm">안전한 결제</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  토스페이먼츠의 보안 시스템으로 안전하게 결제됩니다.
                </p>
              </div>

              {/* Payment Button */}
              <button
                id="payment-request-button"
                onClick={handlePayment}
                disabled={!ready}
                className="w-full bg-[#56007C] text-white py-4 px-6 rounded-lg hover:bg-[#56007C]/90 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reservation ? `₩${reservation.program.amount.toLocaleString()}` : ''}원 결제하기
              </button>
            </motion.div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">결제 요약</h3>
              
              {reservation && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{reservation.program.title}</h4>
                    <p className="text-sm text-gray-600">참가자: {reservation.participant_name}</p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">총 결제금액</span>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#56007C]">
                          ₩{reservation.program.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} className="text-green-600" />
                      <span>결제 후 즉시 확정됩니다</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}