import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params;

    // 사용자 인증 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // 결제 정보 조회
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', user.id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: '결제 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // NicePay에서 실시간 결제 정보 조회
    let nicePayData = null;
    if (payment.payment_key) {
      try {
        nicePayData = await getNicePayTransaction(payment.payment_key);
        
        // NicePay에서 가져온 최신 정보로 Supabase 업데이트
        if (nicePayData && nicePayData.resultCode === '0000') {
          const updateData: any = {
            status: mapNicePayStatus(nicePayData.status),
            updated_at: new Date().toISOString()
          };

          // 추가 정보 업데이트
          if (nicePayData.amount) updateData.amount = nicePayData.amount;
          if (nicePayData.paidAt && nicePayData.paidAt !== '0') updateData.paid_at = nicePayData.paidAt;
          if (nicePayData.cancelledAt && nicePayData.cancelledAt !== '0') updateData.cancelled_at = nicePayData.cancelledAt;
          if (nicePayData.failedAt && nicePayData.failedAt !== '0') updateData.failed_at = nicePayData.failedAt;

          const { error: updateError } = await supabase
            .from('payments')
            .update(updateData)
            .eq('id', paymentId);

          if (updateError) {
            console.error('Payment update error:', updateError);
          }
        }
      } catch (error) {
        console.error('NicePay API error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      payment,
      nicePayData
    });

  } catch (error) {
    console.error('Payment detail error:', error);
    return NextResponse.json(
      { error: '결제 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

async function getNicePayTransaction(tid: string) {
  const NICEPAY_API_URL = process.env.NICEPAY_API_URL || 'https://api.nicepay.co.kr';
  const NICEPAY_CLIENT_ID = process.env.NICEPAY_CLIENT_ID;
  const NICEPAY_SECRET_KEY = process.env.NICEPAY_SECRET_KEY;

  if (!NICEPAY_CLIENT_ID || !NICEPAY_SECRET_KEY) {
    throw new Error('NicePay 설정이 누락되었습니다.');
  }

  // Basic Auth 생성
  const auth = Buffer.from(`${NICEPAY_CLIENT_ID}:${NICEPAY_SECRET_KEY}`).toString('base64');

  const response = await fetch(`${NICEPAY_API_URL}/v1/payments/${tid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    }
  });

  if (!response.ok) {
    throw new Error(`NicePay API 오류: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

function mapNicePayStatus(nicePayStatus: string): string {
  switch (nicePayStatus) {
    case 'paid':
      return 'completed';
    case 'ready':
      return 'pending';
    case 'failed':
      return 'failed';
    case 'cancelled':
    case 'partialCancelled':
      return 'refunded';
    case 'expired':
      return 'failed';
    default:
      return 'pending';
  }
}