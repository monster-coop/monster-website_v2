import Link from 'next/link';
import { ArrowLeft, Search, Calendar } from 'lucide-react';

export default function ProgramNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-purple-500/10 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-transparent rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 아이콘 */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mb-6">
              <Search className="text-purple-400" size={64} />
            </div>
          </div>
          
          {/* 메인 메시지 */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              프로그램을 찾을 수 없습니다
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              요청하신 프로그램이 존재하지 않거나 더 이상 제공되지 않을 수 있습니다.
              <br className="hidden sm:block" />
              다른 프로그램들을 확인해보세요.
            </p>
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 font-semibold"
            >
              <Search size={20} />
              다른 프로그램 보기
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-purple-400 text-purple-400 px-8 py-4 rounded-full hover:bg-purple-400/10 transition-all duration-300 backdrop-blur-sm font-semibold"
            >
              <ArrowLeft size={20} />
              홈으로 돌아가기
            </Link>
          </div>
          
          {/* 추가 정보 */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">
              이런 프로그램들은 어떠세요?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <h4 className="text-purple-400 font-medium mb-2">팀 기업가정신 교육</h4>
                <p className="text-gray-300 mb-2">실제 결과물을 만드는 프로젝트 기반 학습</p>
                <Link
                  href="/programs?category=team-entrepreneurship"
                  className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                >
                  자세히 보기 <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
              
              <div className="text-left">
                <h4 className="text-purple-400 font-medium mb-2">챌린지 트립</h4>
                <p className="text-gray-300 mb-2">세상으로 떠나는 학교 맞춤형 수학여행</p>
                <Link
                  href="/programs?category=challenge-trip"
                  className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                >
                  자세히 보기 <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
              
              <div className="text-left">
                <h4 className="text-purple-400 font-medium mb-2">SQUEEZE LRS</h4>
                <p className="text-gray-300 mb-2">과정 중심 평가를 위한 프로젝트 수업 솔루션</p>
                <Link
                  href="/programs?category=squeeze-lrs"
                  className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                >
                  자세히 보기 <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
              
              <div className="text-left">
                <h4 className="text-purple-400 font-medium mb-2">작가가 되는 트립</h4>
                <p className="text-gray-300 mb-2">나만의 여행을 기획하고 책으로 출판</p>
                <Link
                  href="/programs?category=writer-trip"
                  className="text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
                >
                  자세히 보기 <ArrowLeft size={14} className="rotate-180" />
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-gray-400 text-sm mb-3">
                특정 프로그램을 찾고 계신가요?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
              >
                <Calendar size={16} />
                상담 신청하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}