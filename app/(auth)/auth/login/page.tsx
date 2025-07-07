"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const message = searchParams.get('message');
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#56007C] to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {(error || message) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {message || '인증 오류가 발생했습니다.'}
          </motion.div>
        )}
        
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#56007C] to-purple-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}