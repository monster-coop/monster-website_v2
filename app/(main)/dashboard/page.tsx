"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  MapPin, 
  BookOpen,
  CreditCard,
  Bell,
  Settings,
  User,
  PlusCircle,
  Award,
  TrendingUp,
  LogOut,
  Phone,
  Receipt
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser, signOut } from "@/lib/auth";
import { createClient } from '@/lib/supabase/client';
import { Database } from "@/types/database";
import ProfileEditModal from "@/components/profile/ProfileEditModal";

type ProgramParticipant = Database['public']['Tables']['program_participants']['Row'] & {
  programs?: Database['public']['Tables']['programs']['Row'] & {
    program_categories?: Database['public']['Tables']['program_categories']['Row'] | null;
  };
  payments?: Database['public']['Tables']['payments']['Row'][];
};

interface DashboardStats {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  totalSpent: number;
  upcomingPrograms: ProgramParticipant[];
  recentActivities: ProgramParticipant[];
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalPrograms: 0,
    activePrograms: 0,
    completedPrograms: 0,
    totalSpent: 0,
    upcomingPrograms: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // 사용자 정보 가져오기
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth/login');
        return;
      }
      setUser(currentUser as any);

      const supabase = createClient();

      // 프로필 정보 가져오기
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      setProfile(profileData);

      // 프로그램 참가 내역 가져오기
      const { data: participations } = await supabase
        .from('program_participants')
        .select(`
          *,
          programs!inner(
            *,
            program_categories(*)
          ),
          payments(*)
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (participations) {
        const totalPrograms = participations.length;
        const activePrograms = participations.filter(p => 
          p.status === 'confirmed' || p.status === 'registered'
        ).length;
        const completedPrograms = participations.filter(p => 
          p.status === 'completed'
        ).length;
        const totalSpent = participations.reduce((sum, p) => 
          sum + (p.amount_paid || 0), 0
        );

        // 다가오는 프로그램 (시작일이 미래인 것들)
        const now = new Date();
        const upcomingPrograms = participations.filter(p => 
          p.programs && new Date(p.programs.start_date!) > now &&
          (p.status === 'confirmed' || p.status === 'registered')
        );

        setStats({
          totalPrograms,
          activePrograms,
          completedPrograms,
          totalSpent,
          upcomingPrograms,
          recentActivities: participations.slice(0, 5)
        });
      }

    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleProfileUpdated = (updatedProfile: Database['public']['Tables']['profiles']['Row']) => {
    setProfile(updatedProfile);
    // 필요시 stats도 업데이트
    loadUserData();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">확정</span>;
      case 'registered':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">등록</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">완료</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">취소</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">대기</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">대시보드를 불러오는 중...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
              <p className="text-gray-600">안녕하세요, {profile?.full_name || '회원'}님!</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/programs"
                className="bg-[#56007C] text-white px-4 py-2 rounded-lg hover:bg-[#56007C]/90 transition-colors flex items-center gap-2"
              >
                <PlusCircle size={16} />
                프로그램 신청
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
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
            {/* Total Programs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-[#56007C]/10 rounded-lg">
                  <BookOpen className="text-[#56007C]" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">총 프로그램</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
                </div>
              </div>
            </div>

            {/* Active Programs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">진행 중</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.activePrograms}</p>
                </div>
              </div>
            </div>

            {/* Completed Programs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">완료한 프로그램</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedPrograms}</p>
                </div>
              </div>
            </div>

            {/* Total Spent */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">총 결제금액</h3>
                  <p className="text-2xl font-bold text-gray-900">₩{formatPrice(stats.totalSpent)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upcoming Programs */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar size={20} />
                    다가오는 프로그램
                  </h2>
                </div>
                <div className="p-6">
                  {stats.upcomingPrograms.length > 0 ? (
                    <div className="space-y-4">
                      {stats.upcomingPrograms.map((participation) => (
                        <div key={participation.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {participation.programs?.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {participation.programs?.program_categories?.name}
                              </p>
                            </div>
                            {getStatusBadge(participation.status || '')}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} />
                              <span>{participation.programs?.start_date ? formatDate(participation.programs.start_date) : '날짜 미정'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              <span>{participation.programs?.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard size={14} />
                              <span>₩{formatPrice(participation.amount_paid || 0)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            <Link
                              href={`/programs/${participation.programs?.slug}`}
                              className="text-[#56007C] hover:text-[#56007C]/80 text-sm font-medium"
                            >
                              프로그램 보기
                            </Link>
                            {participation.status === 'registered' && (
                              <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                취소하기
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">다가오는 프로그램이 없습니다.</p>
                      <Link
                        href="/programs"
                        className="mt-2 inline-block text-[#56007C] hover:text-[#56007C]/80 font-medium"
                      >
                        프로그램 둘러보기
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions & Profile */}
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-[#56007C]/10 rounded-full flex items-center justify-center">
                    <User className="text-[#56007C]" size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {profile?.full_name || '이름 없음'}
                    </h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {profile?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.occupation && (
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span>{profile.occupation}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="mt-4 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <Settings size={16} />
                  프로필 편집
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">빠른 실행</h3>
                <div className="space-y-3">
                  <Link
                    href="/programs"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-[#56007C]/10 rounded-lg">
                      <BookOpen className="text-[#56007C]" size={16} />
                    </div>
                    <span className="text-sm font-medium">프로그램 둘러보기</span>
                  </Link>
                  
                  <Link
                    href="/dashboard/payments"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Receipt className="text-purple-600" size={16} />
                    </div>
                    <span className="text-sm font-medium">결제 내역</span>
                  </Link>
                  
                  <Link
                    href="/subscription"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="text-blue-600" size={16} />
                    </div>
                    <span className="text-sm font-medium">SQUEEZE LMS 구독</span>
                  </Link>
                  
                  <Link
                    href="/support"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Bell className="text-green-600" size={16} />
                    </div>
                    <span className="text-sm font-medium">고객 지원</span>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">최근 활동</h3>
                {stats.recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivities.slice(0, 3).map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#56007C] rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {activity.programs?.title} 신청
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.created_at || '')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">최근 활동이 없습니다.</p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={profile}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
}