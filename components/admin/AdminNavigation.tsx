"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  Shield,
  LogOut,
  Menu,
  X,
  Home
} from "lucide-react";
import { signOut } from "@/lib/auth";

interface AdminNavigationProps {
  user: any;
}

const navigation = [
  { name: '대시보드', href: '/admin', icon: LayoutDashboard },
  { name: '사용자 관리', href: '/admin/users', icon: Users },
  { name: '프로그램 관리', href: '/admin/programs', icon: BookOpen },
  { name: '재무 관리', href: '/admin/financial', icon: DollarSign },
  { name: '분석 리포트', href: '/admin/analytics', icon: BarChart3 },
  { name: '알림 관리', href: '/admin/notifications', icon: Bell },
  { name: '시스템 설정', href: '/admin/settings', icon: Settings },
  { name: '권한 관리', href: '/admin/permissions', icon: Shield },
];

export function AdminNavigation({ user }: AdminNavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center">
            <div className="w-8 h-8 bg-[#56007C] rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">관리자</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-[#56007C] text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-[#56007C]/10 rounded-full flex items-center justify-center">
              <span className="text-[#56007C] font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">관리자</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Link
              href="/"
              className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Home className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              메인 사이트
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <Link href="/admin" className="flex items-center">
              <div className="w-8 h-8 bg-[#56007C] rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">관리자</span>
            </Link>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-[#56007C] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-[#56007C]/10 rounded-full flex items-center justify-center">
                <span className="text-[#56007C] font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">관리자</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <Link
                href="/"
                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <Home className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                메인 사이트
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin" className="flex items-center">
            <div className="w-8 h-8 bg-[#56007C] rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">관리자</span>
          </Link>
          <div className="w-8" /> {/* Spacer */}
        </div>
      </div>
    </>
  );
}