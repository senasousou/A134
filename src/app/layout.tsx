import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "記録資料一三四号 - TENGEN ARCHIVE",
  description: "創作叙事詩「てんげん」に関連する記録資料の保管庫",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f4efe4]">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="py-12 border-t border-[#bbb4a4]/20 text-center bg-[#f4efe4]">
          <p className="font-mono text-[10px] tracking-[0.4em] text-[#8b857a] uppercase opacity-60">
            ©️2026 SENA SOUSOU / ARCHIVE134 / TENGEN
          </p>
        </footer>
      </body>
    </html>
  );
}
