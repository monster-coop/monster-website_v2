"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle,
  AlertCircle,
  User,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { getProgramBySlug } from "@/lib/database/programs-client";
import { getCurrentUser } from "@/lib/auth";
import { createReservation } from "@/lib/database/reservations";
import { confirmTossPayment } from "@/lib/payments/toss";
import { Database } from "@/types/database";
import Footer from "@/components/Footer";

type Program = Database['public']['Tables']['programs']['Row'] & {
  program_categories?: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
  } | null;
  program_participants?: Array<{
    id: string;
    status: string | null;
    created_at: string | null;
    profiles: {
      id: string;
      full_name: string | null;
    };
  }>;
};

interface BookingForm {
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  emergencyContact: string;
  dietaryRestrictions: string;
  specialRequests: string;
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ProgramBookingPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<Program | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // 1: 정보입력, 2: 결제
  
  // TossPayments 관련 state
  const [widgets, setWidgets] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENT_WIDGET_CLIENT_KEY!;
  const ANONYMOUS = "ANONYMOUS";
  
  const [form, setForm] = useState<BookingForm>({
    participantName: '',
    participantEmail: '',
    participantPhone: '',
    emergencyContact: '',
    dietaryRestrictions: '',
    specialRequests: '',
    agreedToTerms: false,
    agreedToPrivacy: false
  });

  const slug = params?.slug as string;

  useEffect(() => {
    if (slug) {
      loadProgram();
      loadUser();
    }
  }, [slug]);

  const loadProgram = async () => {
    try {
      setLoading(true);
      const response = await getProgramBySlug(slug);
      if (response.data) {
        setProgram(response.data);
        
        // 프로그램 상태 확인
        if (response.data.status !== 'open') {
          setError('이 프로그램은 현재 신청할 수 없습니다.');
        }
      } else {
        router.push('/programs');
      }
    } catch (error) {
      console.error('Failed to load program:', error);
      router.push('/programs');
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }
      setUser(currentUser);
      
      // 사용자 정보로 폼 초기화
      setForm(prev => ({
        ...prev,
        participantEmail: currentUser.email || '',
        participantName: currentUser.user_metadata?.full_name || ''
      }));
    } catch (error) {
      console.error('Failed to load user:', error);
      router.push('/auth/login');
    }
  };

  const handleInputChange = (field: keyof BookingForm, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!form.participantName.trim()) {
      setError('참가자 이름을 입력해주세요.');
      return false;
    }
    if (!form.participantEmail.trim()) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    if (!form.participantPhone.trim()) {
      setError('연락처를 입력해주세요.');
      return false;
    }
    if (!form.emergencyContact.trim()) {
      setError('비상연락처를 입력해주세요.');
      return false;
    }
    if (!form.agreedToTerms) {
      setError('이용약관에 동의해주세요.');
      return false;
    }
    if (!form.agreedToPrivacy) {
      setError('개인정보처리방침에 동의해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !program || !user) return;

    try {
      setSubmitting(true);
      setError(null);

      // 1단계에서 2단계로 진행 (결제 준비)
      setStep(2);
      
    } catch (error) {
      console.error('Form submission failed:', error);
      setError('폼 제출 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  // TossPayments 위젯 초기화
  useEffect(() => {
    if (step === 2 && program && !widgets) {
      async function fetchPaymentWidgets() {
        try {
          const tossPayments = await loadTossPayments(clientKey);
          const paymentWidgets = tossPayments.widgets({
            customerKey: ANONYMOUS,
          });
          setWidgets(paymentWidgets);
        } catch (error) {
          console.error('TossPayments 위젯 초기화 실패:', error);
          setError('결제 시스템 초기화에 실패했습니다.');
        }
      }
      fetchPaymentWidgets();
    }
  }, [step, program, clientKey]);

  // TossPayments 위젯 렌더링
  useEffect(() => {
    if (widgets && program && step === 2) {
      async function renderPaymentWidgets() {
        try {
          if (!program) return;
          const effectivePrice = getEffectivePrice(program);
          
          await widgets.setAmount({
            currency: "KRW",
            value: effectivePrice.price,
          });

          await Promise.all([
            widgets.renderPaymentMethods({
              selector: "#payment-method",
              variantKey: "DEFAULT",
            }),
            widgets.renderAgreement({
              selector: "#agreement",
              variantKey: "AGREEMENT",
            }),
          ]);
          
          setReady(true);
        } catch (error) {
          console.error('결제 위젯 렌더링 실패:', error);
          setError('결제 화면 로드에 실패했습니다.');
        }
      }
      renderPaymentWidgets();
    }
  }, [widgets, program, step]);

  // 결제 처리
  const handlePayment = async () => {
    if (!widgets || !program || !user) return;

    try {
      setPaymentProcessing(true);
      setError(null);

      const effectivePrice = getEffectivePrice(program);
      const orderId = `ORDER_${Date.now()}`;
      
      // 결제 요청
      const response = await widgets.requestPayment({
        orderId,
        orderName: program.title,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
        customerName: form.participantName,
        customerEmail: form.participantEmail,
        customerMobilePhone: form.participantPhone,
      });

      // 결제 성공 시 데이터베이스에 저장
      if (response) {
        const reservationData = {
          program_id: program.id,
          participant_name: form.participantName,
          participant_email: form.participantEmail,
          participant_phone: form.participantPhone,
          emergency_contact: form.emergencyContact,
          dietary_restrictions: form.dietaryRestrictions || null,
          special_requests: form.specialRequests || null,
          amount_paid: effectivePrice.price
        };

        const reservationResponse = await createReservation(reservationData);
        
        if (reservationResponse.error) {
          setError(reservationResponse.error);
          return;
        }

        // 성공 페이지로 리다이렉트는 TossPayments가 처리
      }
      
    } catch (error) {
      console.error('결제 처리 실패:', error);
      setError('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEffectivePrice = (program: Program): { price: number; isEarlyBird: boolean } => {
    const now = new Date();
    const earlyBirdDeadline = program.early_bird_deadline ? new Date(program.early_bird_deadline) : null;
    
    const isEarlyBird = earlyBirdDeadline && 
                       now <= earlyBirdDeadline && 
                       program.early_bird_price !== null;

    return {
      price: isEarlyBird ? program.early_bird_price! : program.base_price,
      isEarlyBird: !!isEarlyBird
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">프로그램 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!program || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">예약할 수 없습니다</h2>
          <p className="text-gray-600 mb-4">{error || '프로그램을 찾을 수 없습니다.'}</p>
          <Link
            href={`/programs/${slug}`}
            className="bg-[#56007C] text-white px-6 py-2 rounded-lg hover:bg-[#56007C]/90 transition-colors"
          >
            프로그램 상세로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const effectivePrice = getEffectivePrice(program);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/programs/${slug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#56007C] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            프로그램 상세로 돌아가기
          </Link>
          
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-[#56007C] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-[#56007C]' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-[#56007C] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-2xl font-bold text-gray-900 mb-6"
              >
                프로그램 신청하기
              </motion.h1>

              {error && (
                <motion.div 
                  variants={fadeInUp}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-800">{error}</span>
                  </div>
                </motion.div>
              )}

              {step === 1 ? (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {/* 참가자 정보 */}
                <motion.div variants={fadeInUp}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} />
                    참가자 정보
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        참가자 이름 *
                      </label>
                      <input
                        type="text"
                        value={form.participantName}
                        onChange={(e) => handleInputChange('participantName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
                        placeholder="실명을 입력해주세요"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일 *
                      </label>
                      <input
                        type="email"
                        value={form.participantEmail}
                        onChange={(e) => handleInputChange('participantEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
                        placeholder="example@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        연락처 *
                      </label>
                      <input
                        type="tel"
                        value={form.participantPhone}
                        onChange={(e) => handleInputChange('participantPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
                        placeholder="010-0000-0000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        비상연락처 *
                      </label>
                      <input
                        type="tel"
                        value={form.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
                        placeholder="010-0000-0000"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* 추가 정보 */}
                <motion.div variants={fadeInUp}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    추가 정보 (선택사항)
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        식단 제한사항
                      </label>
                      <textarea
                        value={form.dietaryRestrictions}
                        onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
                        placeholder="알레르기, 종교적 제약 등이 있으시면 알려주세요"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        특별 요청사항
                      </label>
                      <textarea
                        value={form.specialRequests}
                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
                        placeholder="접근성 지원, 좌석 배치 등 특별한 요청사항이 있으시면 알려주세요"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* 약관 동의 */}
                <motion.div variants={fadeInUp}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    약관 동의
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.agreedToTerms}
                        onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#56007C] border-gray-300 rounded focus:ring-[#56007C]"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">이용약관</span>에 동의합니다. *
                        <Link href="/privacy#terms" target="_blank" className="text-[#56007C] hover:underline ml-1">
                          전문 보기
                        </Link>
                      </span>
                    </label>
                    
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={form.agreedToPrivacy}
                        onChange={(e) => handleInputChange('agreedToPrivacy', e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#56007C] border-gray-300 rounded focus:ring-[#56007C]"
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">개인정보처리방침</span>에 동의합니다. *
                        <Link href="/privacy#privacy" target="_blank" className="text-[#56007C] hover:underline ml-1">
                          전문 보기
                        </Link>
                      </span>
                    </label>
                  </div>
                </motion.div>

                {/* 제출 버튼 */}
                <motion.div variants={fadeInUp} className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#56007C] text-white py-3 px-4 rounded-lg hover:bg-[#56007C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {submitting ? '처리 중...' : '다음 단계'}
                  </button>
                </motion.div>
              </form>
              ) : (
                /* 2단계: 결제 */
                <div className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CreditCard size={20} />
                      결제 정보
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium mb-2">참가자 정보</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">이름:</span> {form.participantName}</p>
                        <p><span className="font-medium">이메일:</span> {form.participantEmail}</p>
                        <p><span className="font-medium">연락처:</span> {form.participantPhone}</p>
                      </div>
                    </div>
                    
                    {!ready && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56007C] mx-auto mb-4"></div>
                        <p className="text-gray-600">결제 UI를 준비하는 중...</p>
                      </div>
                    )}
                    
                    <div id="payment-method" className={ready ? '' : 'hidden'}></div>
                    <div id="agreement" className={ready ? '' : 'hidden'}></div>
                    
                    <div className="flex gap-4 pt-6">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                      >
                        이전
                      </button>
                      <button
                        onClick={handlePayment}
                        disabled={!ready || paymentProcessing}
                        className="flex-1 bg-[#56007C] text-white py-3 px-4 rounded-lg hover:bg-[#56007C]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                      >
                        {paymentProcessing ? '결제 처리 중...' : '결제하기'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - 프로그램 요약 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">예약 요약</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{program.title}</h4>
                  <p className="text-sm text-gray-600">{program.program_categories?.name}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{formatDate(program.start_date!)} - {formatDate(program.end_date!)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{formatTime(program.start_time!)} - {formatTime(program.end_time!)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span>{program.current_participants}/{program.max_participants}명</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">참가비</span>
                    <div className="text-right">
                      {effectivePrice.isEarlyBird ? (
                        <div>
                          <div className="text-lg font-bold text-[#56007C]">
                            ₩{formatPrice(effectivePrice.price)}
                          </div>
                          <div className="text-sm text-gray-500 line-through">
                            ₩{formatPrice(program.base_price)}
                          </div>
                          <div className="text-xs text-red-600">얼리버드 할인</div>
                        </div>
                      ) : (
                        <div className="text-lg font-bold text-[#56007C]">
                          ₩{formatPrice(effectivePrice.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>7일 전까지 무료 취소</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}