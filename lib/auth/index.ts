import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

// Types
type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * 회원가입
 * @param email - 이메일
 * @param password - 비밀번호
 * @param userData - 사용자 추가 정보
 */
export async function signUp(
  email: string, 
  password: string, 
  userData?: {
    full_name?: string
    phone?: string
  }
) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })

  if (error) {
    console.error('Error signing up:', error)
    throw new Error('회원가입에 실패했습니다.')
  }

  return data
}

/**
 * 로그인
 * @param email - 이메일
 * @param password - 비밀번호
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Error signing in:', error)
    throw new Error('로그인에 실패했습니다.')
  }

  return data
}

/**
 * 로그아웃
 */
export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    throw new Error('로그아웃에 실패했습니다.')
  }
}

/**
 * 비밀번호 재설정
 * @param email - 이메일
 */
export async function resetPassword(email: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  })

  if (error) {
    console.error('Error resetting password:', error)
    throw new Error('비밀번호 재설정에 실패했습니다.')
  }
}

/**
 * 비밀번호 변경
 * @param newPassword - 새 비밀번호
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    console.error('Error updating password:', error)
    throw new Error('비밀번호 변경에 실패했습니다.')
  }
}

/**
 * 사용자 프로필 조회
 * @param userId - 사용자 ID (옵션, 없으면 현재 사용자)
 */
export async function getUserProfile(userId?: string) {
  const supabase = createClient()

  // 현재 사용자 세션 확인
  if (!userId) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null
    userId = session.user.id
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

/**
 * 프로필 업데이트
 * @param profileData - 업데이트할 프로필 데이터
 */
export async function updateProfile(profileData: ProfileUpdate) {
  const supabase = createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('로그인이 필요합니다.')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', session.user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('프로필 업데이트에 실패했습니다.')
  }

  return data
}

/**
 * 관리자 권한 확인
 * @param userId - 사용자 ID
 */
export async function checkIsAdmin(userId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error checking admin status:', error)
    return false
  }

  return data?.is_admin || false
}

/**
 * 현재 세션 확인
 */
export async function getCurrentSession() {
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

/**
 * 계정 삭제
 */
export async function deleteAccount() {
  const supabase = createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('로그인이 필요합니다.')
  }

  // 프로필 먼저 삭제 (cascade로 관련 데이터도 삭제됨)
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', session.user.id)

  if (profileError) {
    console.error('Error deleting profile:', profileError)
    throw new Error('계정 삭제에 실패했습니다.')
  }

  // Auth 사용자 삭제
  const { error: authError } = await supabase.auth.admin.deleteUser(session.user.id)

  if (authError) {
    console.error('Error deleting auth user:', authError)
    throw new Error('계정 삭제에 실패했습니다.')
  }
}