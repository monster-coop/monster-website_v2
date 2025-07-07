"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SignUpForm from '@/components/auth/SignUpForm';

function SignUpPageContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#56007C] to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUpForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#56007C] to-purple-900 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    }>
      <SignUpPageContent />
    </Suspense>
  );
}