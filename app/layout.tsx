import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { GoogleAnalytics } from "@next/third-parties/google";


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
  keywords: "팀프러너, 팀 기업가정신, 교육, 프로젝트 기반 학습, 리더십, 창업, 협동조합, SQUEEZE LRS, 챌린지 트립, 작가가 되는 트립",
  authors: [{ name: "몬스터 협동조합" }],
  metadataBase: new URL('https://monstercoop.co.kr'),
  alternates: {
    canonical: 'https://monstercoop.co.kr',
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/globe.svg",
    shortcut: "/globe.svg",
    apple: "/globe.svg",
  },
  openGraph: {
    title: "몬스터 협동조합 - 팀프러너를 양성하는 No.1 교육 기관",
    description: "팀프러너로써 변화된 모습을 세상에 마음껏 펼치세요. 전문적인 팀 기업가정신 교육을 제공합니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://monstercoop.co.kr",
    siteName: "몬스터 협동조합",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "몬스터 협동조합 OG 이미지",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "몬스터 협동조합 - 팀프러너를 양성하는 No.1 교육 기관",
    description: "팀프러너로써 변화된 모습을 세상에 마음껏 펼치세요. 전문적인 팀 기업가정신 교육을 제공합니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      'naver-site-verification': process.env.NAVER_SITE_VERIFICATION || '',
    },
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
        <GoogleAnalytics gaId={process.env.GA_ID || ''} />
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
