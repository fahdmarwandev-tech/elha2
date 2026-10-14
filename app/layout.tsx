import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1C130D",
};

export const metadata: Metadata = {
  title: "جامع الحق | الصرح الإيماني والمنارة المجتمعية",
  description: "الموقع الرسمي لجامع الحق - صرح إيماني ومجتمعي يجمع بين أصالة العمارة الإسلامية وروحانية الرسالة الخالدة وأوقات الصلاة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#1C130D] text-[#FAF7F0]">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
