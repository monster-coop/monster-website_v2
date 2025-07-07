"use client";

import { motion } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Users,
  Award,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getLatestProgramsByCategory } from "@/lib/database/programs";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [latestPrograms, setLatestPrograms] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPrograms = async () => {
      try {
        const programs = await getLatestProgramsByCategory(1);
        setLatestPrograms(programs);
      } catch (error) {
        console.error("Error fetching latest programs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPrograms();
  }, []);

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
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  몬스터 협동조합
                </div>
              </div>

              {/* Desktop Menu */}
              <nav className="hidden md:flex space-x-8">
                <a
                  href="#about"
                  className="text-gray-200 hover:text-purple-400 transition-colors"
                >
                  소개
                </a>
                <a
                  href="#programs"
                  className="text-gray-200 hover:text-purple-400 transition-colors"
                >
                  프로그램
                </a>
                <a
                  href="#subscription"
                  className="text-gray-200 hover:text-purple-400 transition-colors"
                >
                  구독서비스
                </a>
                <a
                  href="#contact"
                  className="text-gray-200 hover:text-purple-400 transition-colors"
                >
                  문의하기
                </a>
              </nav>

              <div className="hidden md:flex">
                <a
                  href="#programs"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 cursor-pointer"
                >
                  프로그램 신청하기
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? (
                  <X size={24} className="text-gray-200" />
                ) : (
                  <Menu size={24} className="text-gray-200" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/20 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-2 space-y-2">
                <a
                  href="#about"
                  className="block py-2 text-gray-200 hover:text-purple-400"
                >
                  소개
                </a>
                <a
                  href="#programs"
                  className="block py-2 text-gray-200 hover:text-purple-400"
                >
                  프로그램
                </a>
                <a
                  href="#subscription"
                  className="block py-2 text-gray-200 hover:text-purple-400"
                >
                  구독서비스
                </a>
                <a
                  href="#contact"
                  className="block py-2 text-gray-200 hover:text-purple-400"
                >
                  문의하기
                </a>
                <a
                  href="#programs"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mt-2 block text-center"
                >
                  프로그램 신청하기
                </a>
              </div>
            </motion.div>
          )}
        </header>

        {/* Hero Section */}
        <section className="min-h-[100dvh] flex items-center justify-center relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                팀프러너로써 변화된 모습을
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  세상에 마음껏 펼친다
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                No.1 교육 기관에서 제공하는 전문적인 팀 기업가정신 교육
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <a
                  href="#programs"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  지금 시작하기 <ArrowRight size={20} />
                </a>
                <a
                  href="/programs"
                  className="border border-purple-400 text-purple-400 px-8 py-3 rounded-full hover:bg-purple-400/10 transition-colors backdrop-blur-sm cursor-pointer"
                >
                  프로그램 보기
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Achievement Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center mb-12"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                  수치로 증명하는 성과
                </motion.h2>
              </motion.div>

              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
              >
                <motion.div variants={fadeInUp} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    2020
                  </div>
                  <div className="text-gray-300">설립연도</div>
                </motion.div>
                <motion.div variants={fadeInUp} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    1억+
                  </div>
                  <div className="text-gray-300">누적 매출 (2023)</div>
                </motion.div>
                <motion.div variants={fadeInUp} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    50,000
                  </div>
                  <div className="text-gray-300">목표 양성 인원 (2030)</div>
                </motion.div>
                <motion.div variants={fadeInUp} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    100억
                  </div>
                  <div className="text-gray-300">목표 매출</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-white mb-4"
              >
                4가지 핵심 교육 사업
              </motion.h2>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-8"
            >
              <motion.div
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                  <Users className="text-purple-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  팀기업가정신 교육
                </h3>
                <p className="text-gray-300 mb-4">
                  실제 결과물을 만드는 프로젝트 기반 학습을 통해 팀워크와
                  리더십을 개발하고 창업 마인드셋을 구축합니다.
                </p>
                {!isLoading && latestPrograms["team-entrepreneurship"]?.[0] && (
                  <div className="text-sm text-purple-300 mb-2">
                    최신 프로그램:{" "}
                    {latestPrograms["team-entrepreneurship"][0].title}
                  </div>
                )}
                <a
                  href="#contact"
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group-hover:translate-x-1 transform duration-300 cursor-pointer"
                >
                  자세히 보기 →
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                  <Award className="text-purple-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  SQUEEZE LRS
                </h3>
                <p className="text-gray-300 mb-4">
                  과정 중심 평가를 위한 프로젝트 수업 보조 솔루션으로 교육
                  효과를 극대화하고 개인별 맞춤 피드백을 제공합니다.
                </p>
                {!isLoading && latestPrograms["squeeze-lrs"]?.[0] && (
                  <div className="text-sm text-purple-300 mb-2">
                    최신 프로그램: {latestPrograms["squeeze-lrs"][0].title}
                  </div>
                )}
                <a
                  href="#contact"
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group-hover:translate-x-1 transform duration-300 cursor-pointer"
                >
                  자세히 보기 →
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                  <Calendar className="text-purple-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  챌린지 트립
                </h3>
                <p className="text-gray-300 mb-4">
                  세상으로 떠나는 학교 맞춤형 수학여행을 통해 체험형 학습
                  프로그램과 글로벌 역량을 개발합니다.
                </p>
                {!isLoading && latestPrograms["challenge-trip"]?.[0] && (
                  <div className="text-sm text-purple-300 mb-2">
                    최신 프로그램: {latestPrograms["challenge-trip"][0].title}
                  </div>
                )}
                <a
                  href="#contact"
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group-hover:translate-x-1 transform duration-300 cursor-pointer"
                >
                  자세히 보기 →
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                  <CheckCircle className="text-purple-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  작가가 되는 트립
                </h3>
                <p className="text-gray-300 mb-4">
                  나만의 여행을 기획하고 책으로 출판하는 경험을 통해 창작 능력을
                  개발하고 개인 브랜딩을 경험합니다.
                </p>
                {!isLoading && latestPrograms["writer-trip"]?.[0] && (
                  <div className="text-sm text-purple-300 mb-2">
                    최신 프로그램: {latestPrograms["writer-trip"][0].title}
                  </div>
                )}
                <a
                  href="#contact"
                  className="text-purple-400 font-semibold hover:text-purple-300 transition-colors group-hover:translate-x-1 transform duration-300 cursor-pointer"
                >
                  자세히 보기 →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Partners Section */}
        <section id="about" className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center mb-12"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                >
                  파트너 및 수상 내역
                </motion.h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12">
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    협력 기관
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-[#56007C]/10 rounded-lg flex items-center justify-center">
                        <Users className="text-[#56007C]" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          이우학교
                        </div>
                        <div className="text-sm text-gray-600">
                          정규과정 운영
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-[#56007C]/10 rounded-lg flex items-center justify-center">
                        <Users className="text-[#56007C]" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          HBM 사회적협동조합
                        </div>
                        <div className="text-sm text-gray-600">교육 협력</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-[#56007C]/10 rounded-lg flex items-center justify-center">
                        <Users className="text-[#56007C]" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          노원구청
                        </div>
                        <div className="text-sm text-gray-600">
                          지역사회 연계
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    수상 내역
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-[#56007C]/10 rounded-lg flex items-center justify-center">
                        <Award className="text-[#56007C]" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          노원구청장 표창
                        </div>
                        <div className="text-sm text-gray-600">2023년 수료</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-12 h-12 bg-[#56007C]/10 rounded-lg flex items-center justify-center">
                        <Award className="text-[#56007C]" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          이우학교 정규과정 운영
                        </div>
                        <div className="text-sm text-gray-600">
                          지속적인 교육 실적
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                몬스터 협동조합 팀
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-gray-600">
                전문성과 열정을 바탕으로 팀프러너를 양성하는 교육 전문가들
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-32 h-32 bg-[#56007C]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="text-[#56007C]" size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  대표 이사
                </h3>
                <p className="text-gray-600 mb-4">
                  팀 기업가정신 교육 전문가로 다년간의 교육 경험을 바탕으로
                  혁신적인 교육 프로그램을 설계합니다.
                </p>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 bg-[#56007C]/10 text-[#56007C] text-sm rounded-full">
                    교육학 박사
                  </span>
                  <span className="px-3 py-1 bg-[#56007C]/10 text-[#56007C] text-sm rounded-full">
                    창업 멘토
                  </span>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-32 h-32 bg-[#56007C]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="text-[#56007C]" size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  교육 디렉터
                </h3>
                <p className="text-gray-600 mb-4">
                  프로젝트 기반 학습과 팀워크 교육의 전문가로 실무 중심의
                  혁신적인 교육 방법론을 개발합니다.
                </p>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 bg-[#56007C]/10 text-[#56007C] text-sm rounded-full">
                    PBL 전문가
                  </span>
                  <span className="px-3 py-1 bg-[#56007C]/10 text-[#56007C] text-sm rounded-full">
                    팀빌딩
                  </span>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="text-center">
                <div className="w-32 h-32 bg-[#56007C]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="text-[#56007C]" size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  프로그램 매니저
                </h3>
                <p className="text-gray-600 mb-4">
                  체험형 학습 프로그램과 글로벌 교육 여행을 기획하고 운영하는
                  전문가입니다.
                </p>
                <div className="flex justify-center gap-2">
                  <span className="px-3 py-1 bg-[#56007C]/10 text-[#56007C] text-sm rounded-full">
                    여행 기획
                  </span>
                  <span className="px-3 py-1 bg-[#56007C]/10 text-[#56007C] text-sm rounded-full">
                    체험 학습
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="subscription"
          className="py-16 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold mb-4"
                >
                  지금 바로 시작하세요
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl mb-8 opacity-90"
                >
                  팀프러너로의 변화를 경험해보세요
                </motion.p>
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <a
                    href="#programs"
                    className="bg-white text-purple-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    프로그램 예약하기
                  </a>
                  <a
                    href="#subscription"
                    className="border border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                  >
                    SQUEEZE LMS 구독하기
                  </a>
                  <a
                    href="#contact"
                    className="border border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
                  >
                    상담 신청하기
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-2xl font-bold mb-4">몬스터 협동조합</div>
                <p className="text-gray-400 mb-4">
                  팀프러너를 양성하는 No.1 교육 기관
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">프로그램</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#programs"
                      className="hover:text-white transition-colors"
                    >
                      팀기업가정신 교육
                    </a>
                  </li>
                  <li>
                    <a
                      href="#programs"
                      className="hover:text-white transition-colors"
                    >
                      SQUEEZE LRS
                    </a>
                  </li>
                  <li>
                    <a
                      href="#programs"
                      className="hover:text-white transition-colors"
                    >
                      챌린지 트립
                    </a>
                  </li>
                  <li>
                    <a
                      href="#programs"
                      className="hover:text-white transition-colors"
                    >
                      작가가 되는 트립
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">서비스</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a
                      href="#subscription"
                      className="hover:text-white transition-colors"
                    >
                      SQUEEZE LMS
                    </a>
                  </li>
                  <li>
                    <a
                      href="#subscription"
                      className="hover:text-white transition-colors"
                    >
                      구독 서비스
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="hover:text-white transition-colors"
                    >
                      상담 예약
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">연락처</h3>
                <div className="space-y-2 text-gray-400">
                  <p>이메일: info@monster-coop.com</p>
                  <p>전화: 02-1234-5678</p>
                  <p>주소: 서울특별시 노원구</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 몬스터 협동조합. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
