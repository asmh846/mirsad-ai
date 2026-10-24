import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مِرْصاد AI | منصة التوظيف الذكية",
  description: "حلّل سيرتك الذاتية، واعثر على الوظيفة المناسبة، وحضّر للمقابلة بالذكاء الاصطناعي.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="min-h-screen bg-[#F6F4F1] font-sans text-[#2A2326] antialiased">
        {children}
      </body>
    </html>
  );
}
