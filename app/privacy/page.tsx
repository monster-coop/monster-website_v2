"use client";

import { motion } from "framer-motion";
import { Shield, FileText, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#56007C] transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            홈으로 돌아가기
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            개인정보처리방침 및 이용약관
          </h1>
          <p className="text-gray-600">
            몬스터 협동조합의 개인정보처리방침, 이용약관 및 환불정책입니다.
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            목차
          </h2>
          <div className="space-y-2">
            <a href="#privacy" className="block text-[#56007C] hover:underline">1. 개인정보처리방침</a>
            <a href="#terms" className="block text-[#56007C] hover:underline">2. 이용약관</a>
            <a href="#refund" className="block text-[#56007C] hover:underline">3. 환불정책</a>
          </div>
        </motion.div>

        {/* Privacy Policy */}
        <motion.section
          id="privacy"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#56007C]">
            <Shield size={24} />
            1. 개인정보처리방침
          </h2>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-3">제1조 (개인정보의 수집 목적)</h3>
              <p className="mb-3">몬스터 협동조합(이하 &quot;회사&quot;)은 다음의 목적을 위하여 개인정보를 수집·이용합니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>회원가입 및 회원관리</li>
                <li>교육 프로그램 신청 접수 및 운영</li>
                <li>결제처리 및 환불업무</li>
                <li>고객상담 및 A/S 업무</li>
                <li>마케팅 및 광고 활용 (동의한 경우에 한함)</li>
                <li>서비스 개선 및 신규 서비스 개발</li>
                <li>법령상 의무 이행</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제2조 (수집하는 개인정보의 항목)</h3>
              
              <h4 className="font-medium mb-2">1) 회원가입 시 수집정보</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li><strong>필수항목:</strong> 이메일, 비밀번호, 성명</li>
                <li><strong>선택항목:</strong> 전화번호, 생년월일, 성별, 직업, 학력, 관심분야, 학습목표</li>
                <li><strong>마케팅 수신동의:</strong> 이메일/SMS 마케팅 수신 동의 여부</li>
              </ul>

              <h4 className="font-medium mb-2">2) 프로그램 신청 시 수집정보</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li><strong>필수항목:</strong> 참가자명, 참가자 이메일, 참가자 전화번호, 비상연락처</li>
                <li><strong>선택항목:</strong> 식단 제한사항, 특별 요청사항</li>
                <li><strong>동의정보:</strong> 이용약관 동의, 개인정보처리방침 동의</li>
              </ul>

              <h4 className="font-medium mb-2">3) 결제 시 수집정보</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li>결제금액, 결제수단, 주문번호</li>
                <li>토스페이먼츠를 통한 결제정보 (결제키, 승인번호 등)</li>
                <li>환불 시: 환불사유, 환불계좌 정보</li>
              </ul>

              <h4 className="font-medium mb-2">4) 서비스 이용 과정에서 수집되는 정보</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li>접속 IP주소, 쿠키, 서비스 이용기록</li>
                <li>기기정보 (OS, 브라우저 종류)</li>
                <li>알림 설정 정보</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제3조 (개인정보의 보유 및 이용기간)</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>회원정보:</strong> 회원 탈퇴 시까지 (탈퇴 후 즉시 삭제)</li>
                <li><strong>프로그램 참가기록:</strong> 프로그램 종료 후 3년</li>
                <li><strong>결제/환불 기록:</strong> 전자상거래법에 따라 5년</li>
                <li><strong>고객상담 기록:</strong> 상담 완료 후 3년</li>
                <li><strong>마케팅 활용:</strong> 동의 철회 시까지</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제4조 (개인정보의 제3자 제공)</h3>
              <p className="mb-3">회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                <li>결제처리를 위한 토스페이먼츠 등 필요한 범위 내에서의 제공</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제5조 (개인정보처리의 위탁)</h3>
              <p className="mb-3">회사는 서비스 향상을 위해 개인정보 처리업무를 외부에 위탁하고 있으며, 관련 업체는 다음과 같습니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Supabase:</strong> 데이터베이스 관리 및 사용자 인증</li>
                <li><strong>토스페이먼츠:</strong> 결제처리 및 결제정보 관리</li>
                <li><strong>Notion:</strong> 교육 컨텐츠 관리 (개인정보 미포함)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제6조 (이용자의 권리)</h3>
              <p className="mb-3">이용자는 다음과 같은 권리를 가집니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>개인정보 처리현황 통지요구권</li>
                <li>개인정보 열람요구권</li>
                <li>개인정보 정정·삭제요구권</li>
                <li>개인정보 처리정지요구권</li>
                <li>개인정보 손해배상청구권</li>
              </ul>
              <p className="mt-3">위 권리 행사를 원하시는 경우 대표 전화(010-8864-8029) 또는 이메일(info@monstercoop.co.kr)로 연락주시기 바랍니다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제7조 (개인정보보호책임자)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>개인정보보호책임자:</strong> 강승원 (대표)</p>
                <p><strong>연락처:</strong> 010-8864-8029</p>
                <p><strong>이메일:</strong> info@monstercoop.co.kr</p>
                <p><strong>주소:</strong> 서울특별시 서대문구 이화여대 1길 38, 201호</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                <strong>시행일자:</strong> 2025년 1월 1일<br/>
                본 개인정보처리방침은 시행일자부터 적용됩니다.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Terms of Service */}
        <motion.section
          id="terms"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#56007C]">
            <FileText size={24} />
            2. 이용약관
          </h2>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-3">제1조 (목적)</h3>
              <p>이 약관은 몬스터 협동조합(이하 &quot;회사&quot;)이 제공하는 교육 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제2조 (정의)</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>&quot;서비스&quot;</strong>란 회사가 제공하는 모든 교육 프로그램 및 온라인 플랫폼을 의미합니다.</li>
                <li><strong>&quot;이용자&quot;</strong>란 회사의 서비스를 이용하는 회원 및 비회원을 의미합니다.</li>
                <li><strong>&quot;회원&quot;</strong>이란 회사에 개인정보를 제공하여 회원등록을 한 자를 의미합니다.</li>
                <li><strong>&quot;프로그램&quot;</strong>이란 회사가 제공하는 오프라인/온라인 교육과정을 의미합니다.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제3조 (약관의 게시 및 개정)</h3>
              <p className="mb-3">① 회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기화면에 게시합니다.</p>
              <p className="mb-3">② 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
              <p>③ 약관이 개정되는 경우 회사는 개정일자 및 개정사유를 명시하여 현행약관과 함께 그 적용일자 7일 전부터 공지합니다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제4조 (회원가입)</h3>
              <p className="mb-3">① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</p>
              <p className="mb-3">② 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙하지 않을 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>가입신청자가 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제5조 (서비스의 제공)</h3>
              <p className="mb-3">① 회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>팀기업가정신 교육 프로그램</li>
                <li>리더십 개발 프로그램</li>
                <li>창업 교육 프로그램</li>
                <li>SQUEEZE LMS 온라인 학습 서비스</li>
                <li>기타 회사가 추가로 개발하거나 제휴회사와의 계약을 통해 제공하는 서비스</li>
              </ul>
              <p>② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 하되, 정기점검 등의 필요에 의해 서비스가 일시 중단될 수 있습니다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제6조 (프로그램 신청 및 결제)</h3>
              <p className="mb-3">① 프로그램 신청은 회원가입 후 해당 프로그램 페이지에서 신청할 수 있습니다.</p>
              <p className="mb-3">② 프로그램 참가비는 신청 즉시 결제되어야 하며, 결제가 완료되어야 신청이 확정됩니다.</p>
              <p className="mb-3">③ 결제수단은 신용카드, 계좌이체 등 회사가 정한 방법에 따릅니다.</p>
              <p>④ 참가 정원이 마감된 경우 신청이 제한될 수 있습니다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제7조 (이용자의 의무)</h3>
              <p className="mb-3">① 이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>신청 시 허위내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제8조 (서비스 이용의 제한)</h3>
              <p className="mb-3">① 회사는 이용자가 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.</p>
              <p>② 회사는 전항에도 불구하고, 주민등록법을 위반한 명의도용 및 결제도용, 전화번호 도용, 저작권법 및 컴퓨터프로그램보호법을 위반한 불법프로그램의 제공 및 운영방해, 정보통신망법을 위반한 불법통신 및 해킹, 악성프로그램의 배포, 접속권한 초과행위 등과 같이 관련법을 위반한 경우에는 즉시 영구이용정지를 할 수 있습니다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제9조 (손해배상)</h3>
              <p className="mb-3">① 회사는 무료서비스의 장애, 제공 중단, 보관된 자료 멸실 또는 삭제, 변조 등으로 인한 손해에 대하여는 배상책임을 지지 않습니다.</p>
              <p>② 회사는 이용자가 서비스를 이용하여 기대하는 손익이나 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                <strong>시행일자:</strong> 2025년 1월 1일<br/>
                본 이용약관은 시행일자부터 적용됩니다.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Refund Policy */}
        <motion.section
          id="refund"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#56007C]">
            <DollarSign size={24} />
            3. 환불정책
          </h2>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold mb-3">제1조 (환불 정책의 목적)</h3>
              <p>이 환불정책은 몬스터 협동조합이 제공하는 교육 서비스의 환불 조건 및 절차를 명확히 하여 이용자의 권익을 보호하고 분쟁을 예방함을 목적으로 합니다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제2조 (환불 가능 조건)</h3>
              
              <h4 className="font-medium mb-2">1) 교육 프로그램 환불</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li><strong>프로그램 시작 7일 전:</strong> 100% 환불 (결제수수료 제외)</li>
                <li><strong>프로그램 시작 3일 전:</strong> 80% 환불</li>
                <li><strong>프로그램 시작 1일 전:</strong> 50% 환불</li>
                <li><strong>프로그램 당일 또는 시작 후:</strong> 환불 불가</li>
              </ul>

              <h4 className="font-medium mb-2">2) SQUEEZE LMS 구독 서비스 환불</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li><strong>무료체험 기간:</strong> 언제든지 해지 가능 (과금 없음)</li>
                <li><strong>결제 후 7일 이내:</strong> 100% 환불 (미사용 시에 한함)</li>
                <li><strong>월간 구독:</strong> 결제일 기준 미사용 일할 환불</li>
                <li><strong>연간 구독:</strong> 결제일 기준 미사용 개월 환불</li>
              </ul>

              <h4 className="font-medium mb-2">3) 회사 귀책사유로 인한 환불</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li>프로그램 취소 또는 일정 변경 시: 100% 환불</li>
                <li>시설 문제 등으로 프로그램 진행 불가 시: 100% 환불</li>
                <li>서비스 장애로 이용 불가 시: 100% 환불 또는 서비스 연장</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제3조 (환불 불가 사유)</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>프로그램 시작 후 개인 사정으로 인한 불참</li>
                <li>허위 정보 제공으로 인한 참가 자격 상실</li>
                <li>프로그램 진행 중 부적절한 행동으로 인한 퇴장</li>
                <li>이용자의 과실로 인한 계정 정지</li>
                <li>구독 서비스 이용 후 단순 변심</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제4조 (환불 신청 절차)</h3>
              <p className="mb-3">① 환불을 원하는 경우 다음 방법으로 신청할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li>이메일: info@monstercoop.co.kr</li>
                <li>전화: 010-8864-8029 (평일 9:00~18:00)</li>
                <li>웹사이트 고객센터를 통한 온라인 신청</li>
              </ul>
              
              <p className="mb-3">② 환불 신청 시 다음 정보를 제공해야 합니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>신청자 성명 및 연락처</li>
                <li>주문번호 또는 결제정보</li>
                <li>환불 사유</li>
                <li>환불 받을 계좌 정보 (원결제수단 환불 불가한 경우)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제5조 (환불 처리 기간)</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>신용카드 결제:</strong> 환불 승인 후 3~5영업일</li>
                <li><strong>계좌이체:</strong> 환불 승인 후 2~3영업일</li>
                <li><strong>기타 결제수단:</strong> 각 결제업체 정책에 따름</li>
              </ul>
              <p className="mt-3">※ 금융기관의 영업일정에 따라 처리기간이 연장될 수 있습니다.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제6조 (환불 수수료)</h3>
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <p className="text-yellow-800"><strong>주의:</strong> 다음의 경우 환불 시 수수료가 차감됩니다:</p>
              </div>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>신용카드 환불: 결제 수수료 (약 2.5~3.5%)</li>
                <li>계좌이체 환불: 송금 수수료 (약 500원)</li>
                <li>부분 환불 시: 실제 환불 금액에 대한 수수료만 차감</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제7조 (분쟁 해결)</h3>
              <p className="mb-3">① 환불과 관련한 분쟁이 발생한 경우, 회사와 이용자는 상호 협의를 통해 해결하도록 노력합니다.</p>
              <p className="mb-3">② 협의가 이루어지지 않을 경우 다음 기관에 조정을 신청할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>소비자분쟁조정위원회</li>
                <li>개인정보 보호위원회</li>
                <li>공정거래위원회</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제8조 (특별 약관)</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 mb-2"><strong>천재지변 및 감염병 상황:</strong></p>
                <p className="text-blue-800">코로나19 등 감염병 확산, 자연재해 등 불가피한 상황으로 프로그램이 취소되거나 온라인으로 전환되는 경우, 이용자는 100% 환불 또는 온라인 프로그램 참여를 선택할 수 있습니다.</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">제9조 (연락처)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>환불 문의:</strong></p>
                <p><strong>담당자:</strong> 강승원 (대표)</p>
                <p><strong>전화:</strong> 010-8864-8029</p>
                <p><strong>이메일:</strong> info@monstercoop.co.kr</p>
                <p><strong>주소:</strong> 서울특별시 서대문구 이화여대 1길 38, 201호</p>
                <p><strong>운영시간:</strong> 평일 9:00~18:00 (토·일·공휴일 휴무)</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                <strong>시행일자:</strong> 2025년 1월 1일<br/>
                본 환불정책은 시행일자부터 적용되며, 관련 법령 개정 시 이에 따라 개정될 수 있습니다.
              </p>
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}