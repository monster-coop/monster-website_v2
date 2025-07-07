"use client";

import { motion } from "framer-motion";
import { Calendar, Trophy, Users, MapPin, BookOpen, Award } from "lucide-react";
import { useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const historyData = [
  {
    year: "2021",
    events: [
      {
        date: "2021년 3월",
        title: "몬스터 협동조합 설립",
        description: "팀프러너 양성을 목표로 한 교육 전문 협동조합 설립",
        icon: <Users className="w-5 h-5" />,
        type: "foundation"
      },
      {
        date: "2021년 6월",
        title: "첫 번째 팀기업가정신 교육 프로그램 런칭",
        description: "10명의 학생들과 함께 시작한 첫 번째 교육 프로그램",
        icon: <BookOpen className="w-5 h-5" />,
        type: "program"
      },
      {
        date: "2021년 9월",
        title: "이우학교 정규과정 협약 체결",
        description: "이우학교와 팀기업가정신 교육 정규과정 운영 협약",
        icon: <Trophy className="w-5 h-5" />,
        type: "partnership"
      }
    ]
  },
  {
    year: "2022",
    events: [
      {
        date: "2022년 2월",
        title: "HBM 사회적협동조합과 교육 협력 시작",
        description: "교육 콘텐츠 개발 및 프로그램 운영 협력",
        icon: <Users className="w-5 h-5" />,
        type: "partnership"
      },
      {
        date: "2022년 5월",
        title: "첫 번째 챌린지 트립 프로그램 실시",
        description: "제주도 체험형 학습 프로그램으로 새로운 교육 방식 도입",
        icon: <MapPin className="w-5 h-5" />,
        type: "program"
      },
      {
        date: "2022년 8월",
        title: "SQUEEZE LRS 프로토타입 개발",
        description: "프로젝트 수업 보조 솔루션 시스템 개발 착수",
        icon: <BookOpen className="w-5 h-5" />,
        type: "development"
      },
      {
        date: "2022년 11월",
        title: "누적 교육생 100명 달성",
        description: "설립 후 첫 번째 중요한 마일스톤 달성",
        icon: <Trophy className="w-5 h-5" />,
        type: "achievement"
      }
    ]
  },
  {
    year: "2023",
    events: [
      {
        date: "2023년 1월",
        title: "작가가 되는 트립 프로그램 런칭",
        description: "개인 브랜딩과 창작 능력 개발을 위한 새로운 프로그램 시작",
        icon: <BookOpen className="w-5 h-5" />,
        type: "program"
      },
      {
        date: "2023년 4월",
        title: "노원구청과 지역사회 연계 협약",
        description: "지역 사회 교육 발전을 위한 협력 관계 구축",
        icon: <Users className="w-5 h-5" />,
        type: "partnership"
      },
      {
        date: "2023년 7월",
        title: "SQUEEZE LRS 베타 버전 출시",
        description: "과정 중심 평가를 위한 프로젝트 수업 보조 솔루션 출시",
        icon: <BookOpen className="w-5 h-5" />,
        type: "development"
      },
      {
        date: "2023년 10월",
        title: "누적 매출 1억원 달성",
        description: "설립 후 첫 번째 매출 목표 달성",
        icon: <Trophy className="w-5 h-5" />,
        type: "achievement"
      },
      {
        date: "2023년 12월",
        title: "노원구청장 표창 수상",
        description: "지역 교육 발전에 기여한 공로로 노원구청장 표창 수상",
        icon: <Award className="w-5 h-5" />,
        type: "award"
      }
    ]
  },
  {
    year: "2024",
    events: [
      {
        date: "2024년 2월",
        title: "온라인 교육 플랫폼 SQUEEZE LMS 정식 출시",
        description: "구독 기반 온라인 학습 관리 시스템 정식 서비스 시작",
        icon: <BookOpen className="w-5 h-5" />,
        type: "development"
      },
      {
        date: "2024년 5월",
        title: "글로벌 챌린지 트립 프로그램 확장",
        description: "국내를 넘어 해외 체험형 학습 프로그램 도입",
        icon: <MapPin className="w-5 h-5" />,
        type: "program"
      },
      {
        date: "2024년 8월",
        title: "누적 교육생 500명 돌파",
        description: "지속적인 성장으로 교육생 500명 달성",
        icon: <Users className="w-5 h-5" />,
        type: "achievement"
      },
      {
        date: "2024년 11월",
        title: "기업형 팀기업가정신 교육 프로그램 런칭",
        description: "기업 대상 맞춤형 교육 프로그램 개발 및 출시",
        icon: <BookOpen className="w-5 h-5" />,
        type: "program"
      }
    ]
  },
  {
    year: "2025",
    events: [
      {
        date: "2025년 1월",
        title: "AI 기반 개인 맞춤형 학습 시스템 도입",
        description: "SQUEEZE LMS에 AI 기술을 적용한 개인별 맞춤 학습 경험 제공",
        icon: <BookOpen className="w-5 h-5" />,
        type: "development"
      },
      {
        date: "2025년 4월",
        title: "전국 교육기관 네트워크 구축 계획",
        description: "전국 단위 교육 기관과의 파트너십 확대 추진",
        icon: <Users className="w-5 h-5" />,
        type: "partnership"
      },
      {
        date: "2025년 7월",
        title: "목표 달성: 누적 교육생 1,000명 (예정)",
        description: "설립 4년 만에 누적 교육생 1,000명 달성 목표",
        icon: <Trophy className="w-5 h-5" />,
        type: "achievement"
      },
      {
        date: "2025년 12월",
        title: "차세대 팀프러너 양성 프로그램 2.0 출시 (예정)",
        description: "경험과 노하우를 바탕으로 한 차세대 교육 프로그램 개발",
        icon: <BookOpen className="w-5 h-5" />,
        type: "program"
      }
    ]
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "foundation":
      return "bg-purple-500/20 text-purple-300";
    case "program":
      return "bg-blue-500/20 text-blue-300";
    case "partnership":
      return "bg-green-500/20 text-green-300";
    case "development":
      return "bg-orange-500/20 text-orange-300";
    case "achievement":
      return "bg-yellow-500/20 text-yellow-300";
    case "award":
      return "bg-pink-500/20 text-pink-300";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};

export default function HistoryPage() {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const years = historyData.map(item => item.year);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-purple-500/10 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/15 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white/5 backdrop-blur-xl z-50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  몬스터 협동조합
                </a>
              </div>
              
              {/* Desktop Menu */}
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-200 hover:text-purple-400 transition-colors">홈</a>
                <a href="/programs" className="text-gray-200 hover:text-purple-400 transition-colors">프로그램</a>
                <a href="/history" className="text-purple-400 font-semibold">연혁</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                몬스터 협동조합의
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  성장 여정
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-300 max-w-2xl mx-auto"
              >
                2021년부터 2025년까지, 팀프러너 양성을 위한 우리의 발자취를 소개합니다.
              </motion.p>
            </motion.div>

            {/* Year Filter */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <button
                onClick={() => setSelectedYear(null)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedYear === null
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                전체보기
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    selectedYear === year
                      ? "bg-purple-600 text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {year}년
                </button>
              ))}
            </motion.div>

            {/* Timeline */}
            <div className="space-y-16">
              {historyData
                .filter(item => !selectedYear || item.year === selectedYear)
                .map((yearData, yearIndex) => (
                  <motion.div
                    key={yearData.year}
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                    className="relative"
                  >
                    {/* Year Header */}
                    <motion.div
                      variants={fadeInUp}
                      className="text-center mb-12"
                    >
                      <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        {yearData.year}
                      </div>
                      <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto"></div>
                    </motion.div>

                    {/* Events */}
                    <div className="space-y-8">
                      {yearData.events.map((event, eventIndex) => (
                        <motion.div
                          key={eventIndex}
                          variants={fadeInUp}
                          className="relative"
                        >
                          {/* Timeline Line */}
                          {eventIndex !== yearData.events.length - 1 && (
                            <div className="absolute left-6 top-16 w-0.5 h-16 bg-gradient-to-b from-purple-400/50 to-transparent"></div>
                          )}

                          {/* Event Card */}
                          <div className="flex items-start gap-6">
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(event.type)}`}>
                              {event.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <div className="text-purple-300 font-medium">{event.date}</div>
                                <div className={`px-3 py-1 rounded-full text-sm ${getTypeColor(event.type)} w-fit`}>
                                  {event.type === "foundation" && "설립"}
                                  {event.type === "program" && "프로그램"}
                                  {event.type === "partnership" && "파트너십"}
                                  {event.type === "development" && "개발"}
                                  {event.type === "achievement" && "성과"}
                                  {event.type === "award" && "수상"}
                                </div>
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                              <p className="text-gray-300">{event.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Future Vision */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={fadeInUp}
              className="mt-20 text-center"
            >
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-4">미래를 향한 비전</h2>
                <p className="text-gray-300 text-lg mb-6">
                  2030년까지 50,000명의 팀프러너를 양성하여<br />
                  대한민국 교육 혁신을 이끌어가겠습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/programs"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                  >
                    프로그램 참여하기
                  </a>
                  <a
                    href="/#contact"
                    className="border border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    문의하기
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}