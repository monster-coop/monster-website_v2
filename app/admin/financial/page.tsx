"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  RotateCcw,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Users
} from "lucide-react";
import { getFinancialReports } from "@/lib/database/admin";
import { FinancialReports } from "@/lib/types/admin";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function AdminFinancialPage() {
  const [reports, setReports] = useState<FinancialReports | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const financialData = await getFinancialReports(selectedPeriod);
      setReports(financialData);
    } catch (error) {
      console.error('Failed to load financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">재무 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="text-center py-12">
        <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">데이터를 불러올 수 없습니다</h3>
        <p className="text-gray-500">나중에 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">재무 관리</h1>
          <p className="text-gray-600">플랫폼의 재무 현황과 수익 분석을 확인하세요</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#56007C] focus:border-transparent"
          >
            <option value="weekly">주간</option>
            <option value="monthly">월간</option>
            <option value="quarterly">분기</option>
            <option value="yearly">연간</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#56007C] text-white rounded-lg hover:bg-[#56007C]/90 transition-colors">
            <Download size={16} />
            보고서 다운로드
          </button>
        </div>
      </div>

      {/* Revenue Overview */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">총 매출</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reports.revenue_report.total_revenue)}
              </p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp size={12} className="mr-1" />
                +12.5%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">프로그램 매출</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reports.revenue_report.program_revenue)}
              </p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp size={12} className="mr-1" />
                +8.3%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">구독 매출</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reports.revenue_report.subscription_revenue)}
              </p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp size={12} className="mr-1" />
                +25.1%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <RotateCcw className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">환불 금액</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reports.refund_report.total_refunds)}
              </p>
              <div className="flex items-center text-sm text-red-600">
                <span className="text-sm">환불률 {formatPercentage(reports.refund_report.refund_rate)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Breakdown */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">매출 구성</h3>
            <PieChart className="text-gray-400" size={20} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">프로그램 매출</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(reports.revenue_report.program_revenue)}</p>
                <p className="text-sm text-gray-500">
                  {((reports.revenue_report.program_revenue / reports.revenue_report.total_revenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">구독 매출</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(reports.revenue_report.subscription_revenue)}</p>
                <p className="text-sm text-gray-500">
                  {((reports.revenue_report.subscription_revenue / reports.revenue_report.total_revenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subscription Metrics */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">구독 지표</h3>
            <Users className="text-gray-400" size={20} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{reports.subscription_report.new_subscriptions}</p>
              <p className="text-sm text-gray-600">신규 구독</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{reports.subscription_report.cancelled_subscriptions}</p>
              <p className="text-sm text-gray-600">구독 해지</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(reports.subscription_report.churn_rate)}</p>
              <p className="text-sm text-gray-600">이탈률</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(reports.subscription_report.ltv)}</p>
              <p className="text-sm text-gray-600">고객 생애가치</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#56007C]/5 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">고객 획득 비용 (CAC)</span>
              <span className="text-lg font-bold text-[#56007C]">{formatCurrency(reports.subscription_report.cac)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              LTV/CAC 비율: {reports.subscription_report.ltv > 0 ? (reports.subscription_report.ltv / reports.subscription_report.cac).toFixed(1) : 0}:1
            </p>
          </div>
        </motion.div>
      </div>

      {/* Detailed Reports */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">프로그램별 매출 분석</h3>
          <button className="text-[#56007C] hover:text-[#56007C]/80 text-sm font-medium">
            전체 보기
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">프로그램</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">참가자 수</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">총 매출</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">인당 평균 매출</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">성장률</th>
              </tr>
            </thead>
            <tbody>
              {reports.revenue_report.breakdown_by_program.map((program, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{program.program_title || `프로그램 ${index + 1}`}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{program.participant_count}</td>
                  <td className="py-3 px-4 font-medium">{formatCurrency(program.revenue)}</td>
                  <td className="py-3 px-4 text-gray-600">{formatCurrency(program.average_revenue_per_participant)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-green-600">
                      <TrendingUp size={12} className="mr-1" />
                      +15.2%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Tax Report */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">세무 정보</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{formatCurrency(reports.tax_report.total_taxable_amount)}</p>
            <p className="text-sm text-gray-600">과세 대상 금액</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{formatCurrency(reports.tax_report.tax_collected)}</p>
            <p className="text-sm text-gray-600">징수 세액</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-bold text-gray-900">{formatPercentage(reports.tax_report.tax_rate)}</p>
            <p className="text-sm text-gray-600">세율</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}