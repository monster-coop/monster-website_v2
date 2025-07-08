'use client'

import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()
        setProfile(profile)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsProfileOpen(false)
    window.location.href = '/'
  }

  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name
    if (user?.email) return user.email.split('@')[0]
    return '사용자'
  }

  return (
    <header className="fixed top-0 w-full bg-white/5 backdrop-blur-xl z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              몬스터 협동조합
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-200 hover:text-purple-400 transition-colors">소개</a>
            <a href="#programs" className="text-gray-200 hover:text-purple-400 transition-colors">프로그램</a>
            <a href="#subscription" className="text-gray-200 hover:text-purple-400 transition-colors">구독서비스</a>
            <a href="#contact" className="text-gray-200 hover:text-purple-400 transition-colors">문의하기</a>
          </div>

          {/* Desktop CTA & Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <a href="/auth/login" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 cursor-pointer">
                로그인
              </a>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-200 hover:text-purple-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  <User size={20} />
                  <span>{getUserDisplayName()}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 shadow-lg">
                    <div className="py-2">
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-purple-400 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        마이페이지
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-red-400 transition-colors flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-purple-400 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-xl border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#about" className="block py-2 text-gray-200 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>소개</a>
              <a href="#programs" className="block py-2 text-gray-200 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>프로그램</a>
              <a href="#subscription" className="block py-2 text-gray-200 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>구독서비스</a>
              <a href="#contact" className="block py-2 text-gray-200 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>문의하기</a>
              
              {!user ? (
                <a href="/auth/login" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mt-2 block text-center">
                  로그인
                </a>
              ) : (
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex items-center space-x-2 px-2 py-2 text-gray-200">
                    <User size={20} />
                    <span>{getUserDisplayName()}</span>
                  </div>
                  <a
                    href="/dashboard"
                    className="block py-2 px-2 text-gray-200 hover:text-purple-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    마이페이지
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left py-2 px-2 text-gray-200 hover:text-red-400 transition-colors flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>로그아웃</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  )
}