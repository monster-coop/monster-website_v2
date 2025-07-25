"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Award,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getLatestProgramsByCategory } from "@/lib/database/programs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

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
  const [latestPrograms, setLatestPrograms] = useState<Record<string, Array<{title: string; id: string}>>>({});
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
        <Header />

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
                  href="/programs"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  지금 시작하기 <ArrowRight size={20} />
                </a>
                {/* <a
                  href="/programs"
                  className="border border-purple-400 text-purple-400 px-8 py-3 rounded-full hover:bg-purple-400/10 transition-colors backdrop-blur-sm cursor-pointer"
                >
                  프로그램 보기
                </a> */}
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

        {/* Partners & Awards Section */}
        <section id="about" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                >
                  신뢰받는 교육 파트너
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-300 max-w-3xl mx-auto"
                >
                  다양한 기관과의 협력을 통해 검증된 교육 프로그램을 제공합니다
                </motion.p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Partners */}
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <h3 className="text-2xl font-bold text-white mb-8 text-center lg:text-left">
                    협력 파트너
                  </h3>
                  <div className="grid gap-6">
                    <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                          <Users className="text-purple-400" size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">이우학교</h4>
                          <p className="text-gray-300">정규 교육과정 운영 파트너</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                          <Users className="text-blue-400" size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">HBM 사회적협동조합</h4>
                          <p className="text-gray-300">교육 프로그램 공동 개발</p>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center group-hover:bg-green-600/30 transition-colors">
                          <Users className="text-green-400" size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">노원구청</h4>
                          <p className="text-gray-300">지역사회 연계 교육 협력</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Awards */}
                <motion.div
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <h3 className="text-2xl font-bold text-white mb-8 text-center lg:text-left">
                    수상 및 인정
                  </h3>
                  <div className="space-y-6">
                    <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                          <Award className="text-yellow-400" size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">노원구청장 표창</h4>
                          <p className="text-gray-300">우수 교육 기관 인정 (2023)</p>
                        </div>
                      </div>
                    </div>

                    <div className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                          <CheckCircle className="text-purple-400" size={28} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">정규과정 운영 실적</h4>
                          <p className="text-gray-300">지속적인 교육 품질 인증</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 연혁 보러가기 링크 */}
                  <div className="text-center lg:text-left mt-8">
                    <Link
                      href="/history"
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium"
                    >
                      자세한 연혁 보러가기 <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                >
                  전문가 팀
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-300 max-w-3xl mx-auto"
                >
                  풍부한 경험과 전문성을 바탕으로 최고의 교육을 제공하는 전문가들
                </motion.p>
              </motion.div>

              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-8"
              >
                <motion.div variants={fadeInUp} className="group">
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-pink-600/30 transition-all duration-300">
                      <Users className="text-purple-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">대표 이사</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      팀 기업가정신 교육의 선구자로서 혁신적인 교육 방법론을 개발하고 
                      다년간의 현장 경험을 통해 검증된 프로그램을 설계합니다.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-4 py-2 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-400/30">
                        교육학 박사
                      </span>
                      <span className="px-4 py-2 bg-pink-600/20 text-pink-300 text-sm rounded-full border border-pink-400/30">
                        창업 멘토
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="group">
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-all duration-300">
                      <Award className="text-blue-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">교육 디렉터</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      프로젝트 기반 학습(PBL)과 팀워크 교육의 전문가로서 
                      실무 중심의 교육 커리큘럼을 개발하고 운영합니다.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-4 py-2 bg-blue-600/20 text-blue-300 text-sm rounded-full border border-blue-400/30">
                        PBL 전문가
                      </span>
                      <span className="px-4 py-2 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-400/30">
                        팀빌딩
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="group">
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:from-green-600/30 group-hover:to-blue-600/30 transition-all duration-300">
                      <Calendar className="text-green-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">프로그램 매니저</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      체험형 학습과 글로벌 교육 여행 프로그램을 기획하고 
                      참가자들의 성장을 위한 최적의 경험을 설계합니다.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="px-4 py-2 bg-green-600/20 text-green-300 text-sm rounded-full border border-green-400/30">
                        여행 기획
                      </span>
                      <span className="px-4 py-2 bg-blue-600/20 text-blue-300 text-sm rounded-full border border-blue-400/30">
                        체험 학습
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="subscription" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl md:text-6xl font-bold text-white mb-6"
                >
                  팀프러너의 여정을
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    지금 시작하세요
                  </span>
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  혁신적인 교육 프로그램을 통해 새로운 가능성을 발견하고,
                  <br className="hidden sm:block" />
                  전문가와 함께 성장의 기회를 만들어보세요
                </motion.p>
              </motion.div>

              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid md:grid-cols-3 gap-8 mb-16"
              >
                <motion.div variants={fadeInUp} className="group">
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 text-center">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600/30 transition-colors">
                      <Users className="text-purple-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">오프라인 교육</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      실습 중심의 팀 기업가정신 교육과
                      체험형 학습 프로그램
                    </p>
                    <a
                      href="/programs"
                      className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      프로그램 보기 <ArrowRight size={18} className="ml-2" />
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="group">
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-pink-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 text-center">
                    <div className="w-16 h-16 bg-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-600/30 transition-colors">
                      <Award className="text-pink-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">SQUEEZE LMS</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      온라인 학습 관리 시스템으로
                      언제 어디서나 학습 가능
                    </p>
                    <a
                      href="/subscription"
                      className="inline-flex items-center bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
                    >
                      구독하기 <ArrowRight size={18} className="ml-2" />
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="group">
                  <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 text-center">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600/30 transition-colors">
                      <Calendar className="text-blue-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">개별 상담</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      맞춤형 교육 상담으로
                      최적의 학습 경로 제안
                    </p>
                    <a
                      href="/contact"
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      상담 신청 <ArrowRight size={18} className="ml-2" />
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* 추가 혜택 섹션 */}
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center border border-white/10"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  지금 시작하면 받을 수 있는 특별 혜택
                </h3>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="text-green-400" size={24} />
                    <span className="text-gray-300 font-medium">전문가 1:1 멘토링</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="text-green-400" size={24} />
                    <span className="text-gray-300 font-medium">수료증 발급</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="text-green-400" size={24} />
                    <span className="text-gray-300 font-medium">네트워킹 기회 제공</span>
                  </div>
                </div>
                <a
                  href="/programs"
                  className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  무료 체험 신청하기 <ArrowRight size={20} className="ml-2" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
