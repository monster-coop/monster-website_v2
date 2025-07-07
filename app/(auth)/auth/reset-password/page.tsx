"use client";

import PasswordResetForm from '@/components/auth/PasswordResetForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#56007C] to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <PasswordResetForm mode="reset" />
      </div>
    </div>
  );
}