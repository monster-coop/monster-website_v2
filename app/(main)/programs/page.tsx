"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Users, Star, ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { getAllPrograms } from "@/lib/database/programs-client";
import { Database } from "@/types/database";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Program = Database['public']['Tables']['programs']['Row'] & {
  program_categories?: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  } | null;
};

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

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    filterPrograms();
  }, [programs, searchQuery, selectedCategory, selectedDifficulty]);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const response = await getAllPrograms();
      if (response.data) {
        setPrograms(response.data);
      }
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPrograms = () => {
    let filtered = programs;

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(program =>
        program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 카테고리 필터
    if (selectedCategory !== "all") {
      filtered = filtered.filter(program =>
        program.program_categories?.slug === selectedCategory
      );
    }

    // 난이도 필터
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(program =>
        program.difficulty_level === selectedDifficulty
      );
    }

    setFilteredPrograms(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '전체';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#56007C] mx-auto"></div>
          <p className="mt-4 text-gray-600">프로그램을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
        
      {/* Hero Section */}
      <section className="bg-white shadow-sm pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#56007C] to-purple-600 bg-clip-text text-transparent"
            >
              교육 프로그램
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              팀프러너로 성장하는 다양한 교육 프로그램을 만나보세요
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="프로그램명, 키워드 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#56007C] focus:border-transparent placeholder-gray-400 text-gray-900"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#56007C] focus:border-transparent text-gray-900"
              >
                <option value="all">전체 카테고리</option>
                <option value="team-entrepreneurship">팀기업가정신 교육</option>
                <option value="squeeze-lrs">SQUEEZE LRS</option>
                <option value="challenge-trip">챌린지 트립</option>
                <option value="writer-trip">작가가 되는 트립</option>
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#56007C] focus:border-transparent text-gray-900"
              >
                <option value="all">전체 난이도</option>
                <option value="beginner">초급</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">검색 조건에 맞는 프로그램이 없습니다.</p>
            </div>
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPrograms.map((program) => (
                <motion.div
                  key={program.id}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group shadow-lg"
                >
                  {/* Program Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#56007C]/20 to-purple-600/30">
                    {program.is_featured && (
                      <div className="absolute top-4 left-4 bg-[#56007C] text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star size={14} />
                        추천
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(program.difficulty_level || '')}`}>
                        {getDifficultyLabel(program.difficulty_level || '')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Category */}
                    <div className="text-sm text-[#56007C] font-semibold mb-2">
                      {program.program_categories?.name}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#56007C] transition-colors">
                      {program.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {program.description}
                    </p>

                    {/* Program Details */}
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#56007C]" />
                        <span>{formatDate(program.start_date!)} - {formatDate(program.end_date!)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#56007C]" />
                        <span>{program.duration_hours}시간</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#56007C]" />
                        <span>{program.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-[#56007C]" />
                        <span>{program.current_participants}/{program.max_participants}명</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {program.tags && program.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {program.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {program.early_bird_price && new Date(program.early_bird_deadline!) > new Date() ? (
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-[#56007C]">
                              ₩{formatPrice(program.early_bird_price)}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              ₩{formatPrice(program.base_price)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-[#56007C]">
                            ₩{formatPrice(program.base_price)}
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        {program.status === 'full' && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">마감</span>
                        )}
                        {program.status === 'open' && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">모집중</span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/programs/${program.slug}`}
                      className="w-full bg-[#56007C] text-white py-2 px-4 rounded-lg hover:bg-[#56007C]/90 transition-colors flex items-center justify-center gap-2 group"
                    >
                      자세히 보기
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}