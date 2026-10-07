import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f1f6f2",
};

export const metadata: Metadata = {
  title: "جامع الحق | الصرح الإيماني والمنارة المجتمعية",
  description: "الموقع الرسمي لجامع الحق - صرح إيماني ومجتمعي يجمع بين أصالة العمارة الإسلامية وروحانية الرسالة الخالدة ومواقيت الصلاة.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f1f6f2] text-[#0f172a]">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
