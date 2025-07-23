"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  Calendar, 
  Receipt, 
  RefreshCw,
  ArrowLeft,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from '@/lib/supabase/client';
import { Database } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Payment = Database['public']['Tables']['payments']['Row'] & {
  program_participants?: {
    programs?: Database['public']['Tables']['programs']['Row'] & {
      program_categories?: Database['public']['Tables']['program_categories']['Row'] | null;
    };
  };
};

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  refundedAmount: number;
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

export default function PaymentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalPayments: 0,
    totalAmount: 0,
    successfulPayments: 0,
    refundedAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [nicePayData, setNicePayData] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }
      setUser(currentUser as any);

      const supabase = createClient();

      // 결제 내역 가져오기 (프로그램 시작일 정보 포함)
      const { data: paymentsData } = await supabase
        .from('payments')
        .select(`
          *,
          program_participants!inner(
            programs!inner(
              *,
              program_categories(*),
              start_date
            )
          )
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (paymentsData) {
        setPayments(paymentsData);
        
        // 통계 계산
        const totalPayments = paymentsData.length;
        const totalAmount = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0);
        const successfulPayments = paymentsData.filter(p => p.status === 'paid').length;
        const refundedAmount = paymentsData
          .filter(p => p.status === 'refunded')
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        setStats({
          totalPayments,
          totalAmount,
          successfulPayments,
          refundedAmount
        });
      }

    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle size={12} className="mr-1" />
            결제완료
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock size={12} className="mr-1" />
            결제대기
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <RefreshCw size={12} className="mr-1" />
            환불완료
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle size={12} className="mr-1" />
            결제실패
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle size={12} className="mr-1" />
            알 수 없음
          </Badge>
        );
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'card':
        return '신용/체크카드';
      case 'transfer':
        return '계좌이체';
      case 'simple':
        return '간편결제';
      case 'virtual_account':
        return '가상계좌';
      default:
        return method;
    }
  };

  const handlePaymentClick = async (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
    setNicePayData(null);
    
    // NicePay 실시간 정보 조회
    if (payment.payment_key) {
      setIsLoadingDetail(true);
      try {
        const response = await fetch(`/api/payments/${payment.id}`);
        const result = await response.json();
        
        if (response.ok && result.nicePayData) {
          setNicePayData(result.nicePayData);
          
          // 결제 상태가 업데이트되었다면 목록 새로고침
          if (result.payment && result.payment.status !== payment.status) {
            loadPaymentData();
          }
        }
      } catch (error) {
        console.error('상세 정보 조회 오류:', error);
        toast.error('상세 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingDetail(false);
      }
    }
  };

  const handleCancelRequest = async () => {
    if (!selectedPayment || !cancelReason.trim()) {
      toast.error("취소 사유를 입력해주세요.");
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch('/api/payments/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          reason: cancelReason,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('결제 취소가 완료되었습니다.');
        setShowCancelModal(false);
        setIsDetailModalOpen(false);
        setCancelReason("");
        // 결제 목록 새로고침
        loadPaymentData();
      } else {
        toast.error(result.error || '취소 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Cancel request error:', error);
      toast.error('취소 요청 중 오류가 발생했습니다.');
    } finally {
      setIsCancelling(false);
    }
  };

  const isRefundable = (payment: Payment) => {
    // 이미 환불된 결제는 취소 불가
    if (payment.status === 'refunded') return false;
    
    // 완료되지 않은 결제는 취소 불가
    if (payment.status !== 'completed') return false;
    
    // NicePay 데이터에서 이미 취소된 거래인지 확인
    if (nicePayData?.status === 'cancelled' || nicePayData?.status === 'partialCancelled') {
      return false;
    }
    
    const startDate = payment.program_participants?.programs?.start_date;
    if (!startDate) return true; // 시작일이 없으면 환불 가능
    
    const now = new Date();
    const programStartDate = new Date(startDate);
    const daysDifference = Math.floor((programStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return daysDifference >= 7; // 7일 이상 남아야 환불 가능
  };

  const getRefundRestrictionMessage = (payment: Payment) => {
    // 이미 취소된 거래인지 확인
    if (nicePayData?.status === 'cancelled' || nicePayData?.status === 'partialCancelled') {
      return '이 결제는 이미 취소되었습니다.';
    }
    
    if (payment.status === 'refunded') {
      return '이 결제는 이미 환불되었습니다.';
    }
    
    const startDate = payment.program_participants?.programs?.start_date;
    if (!startDate) return null;
    
    const now = new Date();
    const programStartDate = new Date(startDate);
    const daysDifference = Math.floor((programStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 7 && daysDifference >= 0) {
      return `프로그램 시작 ${daysDifference}일 전으로 환불이 불가합니다.`;
    } else if (daysDifference < 0) {
      return '프로그램이 이미 시작되어 환불이 불가합니다.';
    }
    
    return null;
  };

  const openCancelModal = () => {
    if (!selectedPayment || !isRefundable(selectedPayment)) {
      toast.error('환불 불가능한 결제입니다.');
      return;
    }
    setShowCancelModal(true);
    setCancelReason("");
  };

  const mapNicePayStatusForUI = (status: string) => {
    switch (status) {
      case 'paid':
        return 'completed';
      case 'ready':
        return 'pending';
      case 'failed':
        return 'failed';
      case 'cancelled':
      case 'partialCancelled':
        return 'refunded';
      case 'expired':
        return 'failed';
      default:
        return 'pending';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">결제 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">결제 내역</h1>
                <p className="text-gray-600">나의 결제 현황을 확인하세요</p>
              </div>
            </div>
            <Button
              onClick={loadPaymentData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              새로고침
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Stats Grid */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-[#56007C]/10 rounded-lg">
                    <Receipt className="text-[#56007C]" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">총 결제건수</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">총 결제금액</h3>
                    <p className="text-2xl font-bold text-gray-900">₩{formatPrice(stats.totalAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">성공한 결제</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.successfulPayments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <RefreshCw className="text-orange-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">환불금액</h3>
                    <p className="text-2xl font-bold text-gray-900">₩{formatPrice(stats.refundedAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment History */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} />
                  결제 내역
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        onClick={() => handlePaymentClick(payment)}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {payment.program_participants?.programs?.title || '프로그램 정보 없음'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {payment.program_participants?.programs?.program_categories?.name || '카테고리 없음'}
                            </p>
                          </div>
                          {getStatusBadge(payment.status || '')}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">결제금액</span>
                            <p className="font-medium">₩{formatPrice(payment.amount || 0)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">결제방법</span>
                            <p className="font-medium">{getPaymentMethodText(payment.payment_method || '')}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">결제일시</span>
                            <p className="font-medium">{payment.created_at ? formatDate(payment.created_at) : '날짜 없음'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">주문번호</span>
                            <p className="font-medium font-mono text-xs">{payment.order_id || payment.id}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">결제 내역이 없습니다.</p>
                    <Link
                      href="/programs"
                      className="text-[#56007C] hover:text-[#56007C]/80 font-medium"
                    >
                      프로그램 둘러보기
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Payment Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>결제 상세 정보</DialogTitle>
            <DialogDescription>
              결제 내역의 상세 정보를 확인하세요.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              {/* 프로그램 정보 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">프로그램 정보</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium mb-1">
                    {selectedPayment.program_participants?.programs?.title || '프로그램 정보 없음'}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {selectedPayment.program_participants?.programs?.program_categories?.name || '카테고리 없음'}
                  </p>
                </div>
              </div>

              {/* 결제 정보 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">결제 정보</h4>
                  {isLoadingDetail && (
                    <div className="flex items-center text-sm text-gray-500">
                      <RefreshCw size={14} className="animate-spin mr-1" />
                      상세 정보 로딩 중...
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500">결제금액</span>
                    <p className="font-semibold">
                      ₩{formatPrice(nicePayData?.amount || selectedPayment.amount || 0)}
                    </p>
                    {nicePayData?.balanceAmt && nicePayData.balanceAmt !== nicePayData.amount && (
                      <p className="text-xs text-gray-500 mt-1">
                        취소 가능: ₩{formatPrice(nicePayData.balanceAmt)}
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500">결제방법</span>
                    <p className="font-semibold">
                      {nicePayData?.payMethod ? getPaymentMethodText(nicePayData.payMethod) : getPaymentMethodText(selectedPayment.payment_method || '')}
                    </p>
                    {nicePayData?.channel && (
                      <p className="text-xs text-gray-500 mt-1">
                        {nicePayData.channel === 'pc' ? 'PC결제' : '모바일결제'}
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500">결제상태</span>
                    <div className="mt-1">
                      {nicePayData?.status ? getStatusBadge(mapNicePayStatusForUI(nicePayData.status)) : getStatusBadge(selectedPayment.status || '')}
                    </div>
                    {nicePayData?.approveNo && (
                      <p className="text-xs text-gray-500 mt-1">
                        승인번호: {nicePayData.approveNo}
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500">결제일시</span>
                    <p className="font-semibold text-sm">
                      {nicePayData?.paidAt && nicePayData.paidAt !== '0' 
                        ? formatDate(nicePayData.paidAt) 
                        : selectedPayment.created_at ? formatDate(selectedPayment.created_at) : '날짜 없음'
                      }
                    </p>
                    {nicePayData?.cancelledAt && nicePayData.cancelledAt !== '0' && (
                      <p className="text-xs text-gray-500 mt-1">
                        취소일시: {formatDate(nicePayData.cancelledAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 주문 정보 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">주문 정보</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">주문번호:</span>
                      <span className="font-mono">{selectedPayment.order_id || selectedPayment.id}</span>
                    </div>
                    {selectedPayment.payment_key && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">결제키:</span>
                        <span className="font-mono text-xs">{selectedPayment.payment_key}</span>
                      </div>
                    )}
                    {selectedPayment.program_participants?.programs?.start_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">프로그램 시작일:</span>
                        <span className="font-medium">
                          {formatDate(selectedPayment.program_participants.programs.start_date)}
                        </span>
                      </div>
                    )}
                    {nicePayData?.goodsName && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">상품명:</span>
                        <span className="font-medium">{nicePayData.goodsName}</span>
                      </div>
                    )}
                    {nicePayData?.buyerName && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">구매자:</span>
                        <span className="font-medium">{nicePayData.buyerName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* NicePay 상세 정보 */}
              {nicePayData && (
                <>
                  {/* 카드 정보 */}
                  {nicePayData.card && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">카드 정보</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">카드사:</span>
                            <p className="font-medium">{nicePayData.card.cardName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">카드번호:</span>
                            <p className="font-medium font-mono">{nicePayData.card.cardNum || '마스킹 처리됨'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">할부:</span>
                            <p className="font-medium">
                              {nicePayData.card.cardQuota === '0' || nicePayData.card.cardQuota === 0 
                                ? '일시불' 
                                : `${nicePayData.card.cardQuota}개월`
                              }
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">무이자 여부:</span>
                            <p className="font-medium">{nicePayData.card.isInterestFree ? '무이자' : '일반'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 가상계좌 정보 */}
                  {nicePayData.vbank && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">가상계좌 정보</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">은행:</span>
                            <p className="font-medium">{nicePayData.vbank.vbankName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">계좌번호:</span>
                            <p className="font-medium font-mono">{nicePayData.vbank.vbankNumber}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">예금주:</span>
                            <p className="font-medium">{nicePayData.vbank.vbankHolder}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">입금만료일:</span>
                            <p className="font-medium">{formatDate(nicePayData.vbank.vbankExpDate)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 취소 내역 */}
                  {nicePayData.cancels && nicePayData.cancels.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">취소 내역</h4>
                      <div className="space-y-2">
                        {nicePayData.cancels.map((cancel: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">₩{formatPrice(cancel.amount)}</p>
                                <p className="text-sm text-gray-500">{cancel.reason}</p>
                              </div>
                              <p className="text-sm text-gray-500">{formatDate(cancel.cancelledAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 영수증 URL */}
                  {nicePayData.receiptUrl && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">영수증</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <a 
                          href={nicePayData.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#56007C] hover:text-[#56007C]/80 underline flex items-center gap-2"
                        >
                          <Receipt size={16} />
                          매출전표 확인
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 환불 버튼 */}
              {selectedPayment.status === 'completed' && (
                <div className="pt-4 border-t">
                  {isRefundable(selectedPayment) ? (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                      onClick={openCancelModal}
                      disabled={isCancelling}
                    >
                      <RefreshCw size={16} className="mr-2" />
                      {isCancelling ? '처리 중...' : '환불 요청'}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full text-gray-400 border-gray-200 cursor-not-allowed"
                        disabled
                      >
                        <RefreshCw size={16} className="mr-2" />
                        환불 불가
                      </Button>
                      <p className="text-sm text-gray-500 text-center">
                        {getRefundRestrictionMessage(selectedPayment)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Modal */}
      <AlertDialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>결제 취소 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 결제를 취소하시겠습니까? 취소된 결제는 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedPayment && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">취소할 결제</div>
                <div className="font-semibold">
                  {selectedPayment.program_participants?.programs?.title || '프로그램 정보 없음'}
                </div>
                <div className="text-sm text-gray-600">
                  ₩{formatPrice(selectedPayment.amount || 0)}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="cancelReason">취소 사유 *</Label>
              <Textarea
                id="cancelReason"
                placeholder="취소 사유를 입력해주세요."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRequest}
              disabled={isCancelling || !cancelReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? '처리 중...' : '취소 확정'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}