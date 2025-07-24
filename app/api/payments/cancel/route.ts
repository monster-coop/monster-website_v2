import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/actions";

interface CancelRequest {
  paymentId: string;
  reason: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CancelRequest = await request.json();
    const { paymentId, reason } = body;

    if (!paymentId || !reason) {
      return NextResponse.json(
        { error: "결제 ID와 취소 사유는 필수입니다." },
        { status: 400 }
      );
    }

    // 사용자 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // 결제 정보 조회
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .eq("user_id", user.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: "결제 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 취소 가능한 상태 확인
    if (payment.status !== "completed") {
      return NextResponse.json(
        {
          error: "취소할 수 없는 결제입니다. 결제 완료 상태만 취소 가능합니다.",
        },
        { status: 400 }
      );
    }

    // NicePay 취소 요청에 필요한 정보 확인
    if (!payment.payment_key || !payment.order_id) {
      return NextResponse.json(
        { error: "결제 키 또는 주문번호 정보가 없습니다." },
        { status: 400 }
      );
    }

    // NicePay 취소 API 호출 (간단화)
    const cancelResult = await requestNicePayCancel({
      tid: payment.payment_key,
      orderId: payment.order_id,
      reason: reason
    });

    if (cancelResult.resultCode !== "0000") {
      return NextResponse.json(
        { error: `취소 실패: ${cancelResult.resultMsg}` },
        { status: 400 }
      );
    }

    // 데이터베이스 업데이트
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: "refunded",
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (updateError) {
      console.error("Database update error:", updateError);
    }

    // refunds 테이블에 환불 기록 추가
    const { error: refundError } = await supabase.from("refunds").insert({
      payment_id: paymentId,
      user_id: user.id,
      amount: cancelResult.amount || payment.amount,
      reason: reason,
      status: "completed",
      refund_tid: cancelResult.cancelledTid || cancelResult.tid,
      nicepay_refund_data: cancelResult,
      created_at: new Date().toISOString(),
    });

    if (refundError) {
      console.error("Refund record creation error:", refundError);
    }

    return NextResponse.json({
      success: true,
      message: "취소가 완료되었습니다.",
      cancelResult,
    });

  } catch (error) {
    console.error("Payment cancel error:", error);
    return NextResponse.json(
      { error: "취소 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

async function requestNicePayCancel({
  tid,
  orderId,
  reason,
}: {
  tid: string;
  orderId: string;
  reason: string;
}) {
  const NICEPAY_API_URL = process.env.NICEPAY_API_URL || "https://api.nicepay.co.kr";
  const NICEPAY_CLIENT_ID = process.env.NICEPAY_CLIENT_ID;
  const NICEPAY_SECRET_KEY = process.env.NICEPAY_SECRET_KEY;

  if (!NICEPAY_CLIENT_ID || !NICEPAY_SECRET_KEY) {
    throw new Error("NicePay 설정이 누락되었습니다.");
  }

  // Basic Auth 생성
  const auth = Buffer.from(
    `${NICEPAY_CLIENT_ID}:${NICEPAY_SECRET_KEY}`
  ).toString("base64");

  // 간단한 3개 파라미터만 사용
  const requestBody = {
    reason: reason,
    orderId: orderId,
  };

  console.log("NicePay Cancel Request:", {
    url: `${NICEPAY_API_URL}/v1/payments/${tid}/cancel`,
    body: requestBody,
  });

  const response = await fetch(`${NICEPAY_API_URL}/v1/payments/${tid}/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("NicePay API Error:", response.status, errorText);
    throw new Error(`NicePay API 오류: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("NicePay Cancel Response:", result);
  return result;
}