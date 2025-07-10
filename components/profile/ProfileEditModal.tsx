"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Briefcase, GraduationCap, Heart, Target, Loader2, Save, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { updateProfile, getUserProfile } from '@/lib/auth';
import { toast } from 'sonner';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: Profile | null;
  onProfileUpdated: (updatedProfile: Profile) => void;
}

export default function ProfileEditModal({ 
  isOpen, 
  onClose, 
  currentProfile,
  onProfileUpdated 
}: ProfileEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    birth_date: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    occupation: '',
    education_level: '',
    interests: [] as string[],
    learning_goals: '',
    marketing_consent: false
  });

  // 초기 데이터 로드
  useEffect(() => {
    if (currentProfile && isOpen) {
      setFormData({
        full_name: currentProfile.full_name || '',
        phone: currentProfile.phone || '',
        birth_date: currentProfile.birth_date || '',
        gender: currentProfile.gender as 'male' | 'female' | 'other' | '',
        occupation: currentProfile.occupation || '',
        education_level: currentProfile.education_level || '',
        interests: currentProfile.interests || [],
        learning_goals: currentProfile.learning_goals || '',
        marketing_consent: currentProfile.marketing_consent || false
      });
    }
  }, [currentProfile, isOpen]);

  const interestOptions = [
    '팀워크', '리더십', '창업', '기업가정신', 
    '프로젝트 관리', '마케팅', '개발', '디자인',
    '기획', '교육', '여행', '글쓰기'
  ];

  const educationOptions = [
    '고등학교 졸업', '대학교 재학', '대학교 졸업', 
    '대학원 재학', '대학원 졸업', '기타'
  ];

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Promise를 사용하여 toast.promise로 처리
      const updatePromise = new Promise<Profile>(async (resolve, reject) => {
        try {
          const updateData: ProfileUpdate = {
            full_name: formData.full_name || null,
            phone: formData.phone || null,
            birth_date: formData.birth_date || null,
            gender: formData.gender || null,
            occupation: formData.occupation || null,
            education_level: formData.education_level || null,
            interests: formData.interests.length > 0 ? formData.interests : null,
            learning_goals: formData.learning_goals || null,
            marketing_consent: formData.marketing_consent
          };

          const result = await updateProfile(updateData);

          if (result.error) {
            reject(new Error(result.error.message));
            return;
          }

          if (!result.data) {
            reject(new Error('프로필 업데이트에 실패했습니다.'));
            return;
          }

          resolve(result.data);
        } catch (error) {
          reject(error);
        }
      });

      const result = await toast.promise(updatePromise, {
        loading: '프로필을 업데이트하는 중...',
        success: '프로필이 성공적으로 업데이트되었습니다!',
        error: (error: Error) => error.message
      });

      // 성공 시 부모 컴포넌트에 업데이트된 프로필 전달
      onProfileUpdated(result as any);
      onClose();

    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User size={20} />
            프로필 편집
          </DialogTitle>
          <DialogDescription>
            개인정보를 수정하여 더 나은 서비스를 받아보세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <User size={18} />
              기본 정보
            </h3>
            
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                placeholder="홍길동"
              />
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                  placeholder="010-1234-5678"
                />
              </div>
            </div>

            {/* 생년월일 & 성별 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  생년월일
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  성별
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                >
                  <option value="">선택</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                </select>
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Briefcase size={18} />
              추가 정보
            </h3>

            {/* 직업 & 학력 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  직업
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                    placeholder="직업을 입력하세요"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학력
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={formData.education_level}
                    onChange={(e) => handleInputChange('education_level', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                  >
                    <option value="">선택</option>
                    {educationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 관심 분야 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Heart size={18} />
                관심 분야
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.interests.includes(interest)
                        ? 'bg-[#56007C] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* 학습 목표 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Target size={18} />
                학습 목표
              </label>
              <textarea
                value={formData.learning_goals}
                onChange={(e) => handleInputChange('learning_goals', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                placeholder="어떤 것을 배우고 싶으신가요?"
              />
            </div>

            {/* 마케팅 동의 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketing_consent"
                checked={formData.marketing_consent}
                onChange={(e) => handleInputChange('marketing_consent', e.target.checked)}
                className="h-4 w-4 text-[#56007C] focus:ring-[#56007C] border-gray-300 rounded"
              />
              <label htmlFor="marketing_consent" className="ml-2 block text-sm text-gray-700">
                마케팅 정보 수신에 동의합니다 (선택)
              </label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                취소
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#56007C] border border-transparent rounded-md hover:bg-[#56007C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#56007C] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  저장 중...
                </>
              ) : (
                <>
                  <Save size={16} />
                  저장하기
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}