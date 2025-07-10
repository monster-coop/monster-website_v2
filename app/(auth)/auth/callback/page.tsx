import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; error_description?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  // Handle OAuth callback
  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code)
    
    if (error) {
      console.error('Auth callback error:', error)
      redirect('/auth/login?error=auth_failed&message=' + encodeURIComponent('인증에 실패했습니다.'))
    }

    // Successful authentication - redirect to dashboard
    redirect('/dashboard')
  }

  // Handle auth errors
  if (params.error) {
    const errorMessage = params.error_description || '인증 중 오류가 발생했습니다.'
    redirect('/auth/login?error=' + params.error + '&message=' + encodeURIComponent(errorMessage))
  }

  // No code or error - redirect to login
  redirect('/auth/login')
}