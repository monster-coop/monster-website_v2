"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { resetPassword, updatePassword, isValidEmail, validatePassword } from '@/lib/auth';

interface PasswordResetFormProps {
  mode?: 'request' | 'reset';
  onBack?: () => void;
}

export default function PasswordResetForm({ mode = 'request', onBack }: PasswordResetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Request mode state
  const [email, setEmail] = useState('');

  // Reset mode state
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateRequestForm = () => {
    const errors: {[key: string]: string} = {};

    if (!email) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!isValidEmail(email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateResetForm = () => {
    const errors: {[key: string]: string} = {};

    if (!passwords.newPassword) {
      errors.newPassword = '새 비밀번호를 입력해주세요.';
    } else {
      const passwordValidation = validatePassword(passwords.newPassword);
      if (!passwordValidation.isValid) {
        errors.newPassword = passwordValidation.message;
      }
    }

    if (!passwords.confirmPassword) {
      errors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRequestForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword(email);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setSuccess('비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인해주세요.');
    } catch (error) {
      console.error('Password reset request error:', error);
      setError('비밀번호 재설정 요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateResetForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await updatePassword(passwords.newPassword);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setSuccess('비밀번호가 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('Password reset error:', error);
      setError('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (mode === 'request') {
      setEmail(value);
    } else {
      setPasswords(prev => ({ ...prev, [field]: value }));
    }

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    setError(null);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'request' ? '이메일 전송 완료!' : '비밀번호 변경 완료!'}
        </h2>
        <p className="text-gray-600 mb-6">{success}</p>
        {mode === 'request' && (
          <div className="text-sm text-gray-500">
            <p>이메일이 도착하지 않았나요?</p>
            <p className="mt-1">스팸 폴더를 확인하거나 몇 분 후 다시 시도해보세요.</p>
          </div>
        )}
        {mode === 'reset' && (
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center w-full bg-[#56007C] text-white py-2 px-4 rounded-md hover:bg-[#56007C]/90 transition-colors"
          >
            로그인하기
          </a>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'request' ? '비밀번호 재설정' : '새 비밀번호 설정'}
        </h2>
        <p className="text-gray-600 mt-2">
          {mode === 'request' 
            ? '가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.'
            : '새로운 비밀번호를 설정해주세요.'
          }
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={mode === 'request' ? handleRequestSubmit : handleResetSubmit} className="space-y-4">
        {mode === 'request' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                placeholder="your@email.com"
              />
            </div>
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                placeholder="새 비밀번호를 입력하세요"
              />
              {validationErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:border-[#56007C]"
                placeholder="비밀번호를 다시 입력하세요"
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#56007C] text-white py-2 px-4 rounded-md hover:bg-[#56007C]/90 focus:outline-none focus:ring-2 focus:ring-[#56007C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              {mode === 'request' ? '전송 중...' : '변경 중...'}
            </>
          ) : (
            mode === 'request' ? '재설정 링크 전송' : '비밀번호 변경'
          )}
        </button>
      </form>

      {/* Back to login link */}
      <div className="mt-6 text-center">
        {onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-[#56007C] hover:underline"
          >
            <ArrowLeft size={16} className="mr-1" />
            뒤로 가기
          </button>
        ) : (
          <a
            href="/auth/login"
            className="inline-flex items-center text-sm text-[#56007C] hover:underline"
          >
            <ArrowLeft size={16} className="mr-1" />
            로그인으로 돌아가기
          </a>
        )}
      </div>
    </motion.div>
  );
}