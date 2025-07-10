import Link from "next/link";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#56007C] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold">몬스터 협동조합</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              팀프러너를 양성하는 No.1 교육 기관으로, 혁신적인 교육 프로그램과
              실무 중심의 커리큘럼을 제공합니다.
            </p>

            {/* Corporate Information */}

            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <span className="font-medium">대표자:</span> 강승원
              </div>
              <div>
                <span className="font-medium">상호명:</span> 몬스터 협동조합
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>서울특별시 서대문구 이화여대 1길 38, 201호</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>대표자 : 010-8864-8029</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>info@monstercoop.co.kr</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">프로그램</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/programs"
                  className="hover:text-white transition-colors"
                >
                  전체 프로그램
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=startup"
                  className="hover:text-white transition-colors"
                >
                  창업 프로그램
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=leadership"
                  className="hover:text-white transition-colors"
                >
                  리더십 교육
                </Link>
              </li>
              <li>
                <Link
                  href="/programs?category=business"
                  className="hover:text-white transition-colors"
                >
                  비즈니스 스킬
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">지원</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  내 계정
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-white transition-colors"
                >
                  도움말
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  자주 묻는 질문
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 몬스터 협동조합. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="/refund"
                className="text-gray-400 hover:text-white transition-colors"
              >
                환불정책
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
