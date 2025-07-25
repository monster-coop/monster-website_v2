"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefundPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the combined privacy page with refund section
    router.replace("/privacy#refund");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
        <p className="mt-4 text-gray-600">환불정책 페이지로 이동 중...</p>
      </div>
    </div>
  );
}