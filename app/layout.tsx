import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "몬스터 협동조합 - 팀프러너를 양성하는 No.1 교육 기관",
  description: "팀프러너로써 변화된 모습을 세상에 마음껏 펼치세요. 실무 중심의 프로젝트 기반 학습을 통해 팀워크와 리더십을 개발하는 전문 교육 기관입니다.",
  keywords: "팀프러너, 팀 기업가정신, 교육, 프로젝트 기반 학습, 리더십, 창업, 협동조합",
  authors: [{ name: "몬스터 협동조합" }],
  openGraph: {
    title: "몬스터 협동조합 - 팀프러너를 양성하는 No.1 교육 기관",
    description: "팀프러너로써 변화된 모습을 세상에 마음껏 펼치세요. 전문적인 팀 기업가정신 교육을 제공합니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
