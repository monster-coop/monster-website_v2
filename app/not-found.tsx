import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-purple-500/10 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-transparent rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 숫자 */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-none">
              404
            </h1>
          </div>
          
          {/* 메인 메시지 */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
              <br className="hidden sm:block" />
              홈페이지로 돌아가서 다시 탐색해보세요.
            </p>
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 font-semibold"
            >
              <Home size={20} />
              홈으로 돌아가기
            </Link>
            
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 border border-purple-400 text-purple-400 px-8 py-4 rounded-full hover:bg-purple-400/10 transition-all duration-300 backdrop-blur-sm font-semibold"
            >
              <Search size={20} />
              프로그램 둘러보기
            </Link>
          </div>
          
          {/* 추가 정보 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              이런 페이지들을 찾고 계셨나요?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Link
                href="/programs"
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} className="rotate-180" />
                교육 프로그램
              </Link>
              <Link
                href="/about"
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} className="rotate-180" />
                회사 소개
              </Link>
              <Link
                href="/contact"
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} className="rotate-180" />
                문의하기
              </Link>
              <Link
                href="/subscription"
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} className="rotate-180" />
                SQUEEZE LMS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}