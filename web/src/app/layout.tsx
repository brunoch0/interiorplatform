import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "두바이인테리어 — 신뢰 기반 인테리어 오픈 플랫폼",
  description: "정량 지표로 검증된 두바이 인테리어 업체를 비교하고, 에스크로와 전문 감리로 안전하게 공사를 관리하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-slate-900 antialiased">
        <Nav />
        <main>{children}</main>
        <footer className="mt-20 border-t border-gray-100 bg-white py-10">
          <div className="mx-auto max-w-6xl px-4 text-xs text-gray-400">
            <p className="font-semibold text-gray-500">두바이인테리어 · Growtoday Holdings FZE</p>
            <p className="mt-2 leading-relaxed">
              본 플랫폼의 모든 업체 지표는 인증 리뷰 데이터 기반 정량 수치이며 주관적 평가를 포함하지 않습니다. UAE 연방법 및 명예훼손 관련 규정을 준수합니다.
              에스크로 결제는 CBUAE 규정 검토 후 단계적으로 제공됩니다.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
