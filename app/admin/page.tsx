"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  BookOpen,
  Activity,
  Server,
  Shield,
  Bell
} from "lucide-react";
import { getAdminDashboardStats, getSystemHealth } from "@/lib/database/admin";
import { AdminDashboardStats, SystemHealth } from "@/lib/types/admin";

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, healthData] = await Promise.all([
        getAdminDashboardStats(),
        getSystemHealth()
      ]);
      
      setStats(dashboardStats);
      setSystemHealth(healthData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const getHealthStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'critical': return <AlertCircle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">관리자 대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !stats || !systemHealth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-4">{error || '데이터를 불러올 수 없습니다.'}</p>
          <button
            onClick={loadDashboardData}
            className="bg-[#56007C] text-white px-6 py-2 rounded-lg hover:bg-[#56007C]/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600">몬스터 협동조합 플랫폼 전체 현황을 확인하세요</p>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Overview Stats */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">총 사용자</h3>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.overview.total_users)}</p>
                <p className="text-sm text-green-600">+{stats.overview.growth_rate.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">활성 프로그램</h3>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.programs.active_programs)}</p>
                <p className="text-sm text-gray-600">/{formatNumber(stats.programs.total_programs)} 전체</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">활성 구독</h3>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.overview.active_subscriptions)}</p>
                <p className="text-sm text-gray-600">MRR {formatCurrency(stats.subscriptions.mrr)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-[#56007C]/10 rounded-lg">
                <DollarSign className="text-[#56007C]" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">총 매출</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overview.total_revenue)}</p>
                <p className="text-sm text-gray-600">이번 달</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div variants={fadeInUp} className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">매출 현황</h3>
            <div className="space-y-4">
              {stats.financial.revenue_by_source.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      source.source === 'programs' ? 'bg-blue-500' :
                      source.source === 'subscriptions' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-gray-700 capitalize">
                      {source.source === 'programs' ? '프로그램' :
                       source.source === 'subscriptions' ? '구독' : '환불'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(source.amount)}</p>
                    <p className="text-sm text-gray-500">{source.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">시스템 상태</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Server size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-700">데이터베이스</span>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getHealthStatusColor(systemHealth.database.status)}`}>
                  {getHealthIcon(systemHealth.database.status)}
                  <span className="ml-1 capitalize">{systemHealth.database.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-700">API</span>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getHealthStatusColor(systemHealth.api.status)}`}>
                  {getHealthIcon(systemHealth.api.status)}
                  <span className="ml-1 capitalize">{systemHealth.api.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-700">결제 시스템</span>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getHealthStatusColor(systemHealth.payment_system.status)}`}>
                  {getHealthIcon(systemHealth.payment_system.status)}
                  <span className="ml-1 capitalize">{systemHealth.payment_system.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-700">알림 시스템</span>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs ${getHealthStatusColor(systemHealth.notification_system.status)}`}>
                  {getHealthIcon(systemHealth.notification_system.status)}
                  <span className="ml-1 capitalize">{systemHealth.notification_system.status}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp} className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 실행</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/users"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="text-[#56007C] mb-2" size={24} />
              <span className="text-sm font-medium">사용자 관리</span>
            </a>
            
            <a
              href="/admin/programs"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="text-[#56007C] mb-2" size={24} />
              <span className="text-sm font-medium">프로그램 관리</span>
            </a>
            
            <a
              href="/admin/financial"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DollarSign className="text-[#56007C] mb-2" size={24} />
              <span className="text-sm font-medium">재무 관리</span>
            </a>
            
            <a
              href="/admin/settings"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="text-[#56007C] mb-2" size={24} />
              <span className="text-sm font-medium">시스템 설정</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}