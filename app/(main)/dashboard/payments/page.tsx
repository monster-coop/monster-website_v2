"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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

      // 결제 내역 가져오기
      const { data: paymentsData } = await supabase
        .from('payments')
        .select(`
          *,
          program_participants!inner(
            programs!inner(
              *,
              program_categories(*)
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
      case 'paid':
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

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
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
        <DialogContent className="sm:max-w-[600px]">
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
                <h4 className="font-semibold text-gray-900 mb-2">결제 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500">결제금액</span>
                    <p className="font-semibold">₩{formatPrice(selectedPayment.amount || 0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500">결제방법</span>
                    <p className="font-semibold">{getPaymentMethodText(selectedPayment.payment_method || '')}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500">결제상태</span>
                    <div className="mt-1">
                      {getStatusBadge(selectedPayment.status || '')}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-sm text-gray-500">결제일시</span>
                    <p className="font-semibold text-sm">
                      {selectedPayment.created_at ? formatDate(selectedPayment.created_at) : '날짜 없음'}
                    </p>
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
                  </div>
                </div>
              </div>

              {/* 환불 버튼 */}
              {selectedPayment.status === 'paid' && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      // TODO: 환불 액션 추가 예정
                      console.log('환불 요청:', selectedPayment.id);
                    }}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    환불 요청
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}