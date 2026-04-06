'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// モバイルメニュー用の独立したコンポーネント（状態変化で再マウントされないように外部に定義）
const MobileMenu = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  navItems 
}: { 
  isMenuOpen: boolean, 
  setIsMenuOpen: (open: boolean) => void,
  navItems: { name: string, href: string }[]
}) => {
  // アニメーション用のスタイルを定義
  const overlayStyle = {
    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out',
    transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
    opacity: isMenuOpen ? 1 : 0,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    backgroundColor: 'rgba(244, 239, 228, 0.7)', // 70% opacity Cosmic Latte
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] md:hidden pointer-events-none data-[open=true]:pointer-events-auto"
      style={overlayStyle}
      data-open={isMenuOpen}
    >
      {/* 閉じるボタン */}
      <button 
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-6 right-6 font-mono text-[10px] tracking-widest border border-[#bbb4a4] px-4 py-1 text-[#5a5248] hover:bg-[#2e2a24] hover:text-[#f4efe4] transition-all z-[10000]"
      >
        CLOSE
      </button>

      <div className="flex flex-col items-center justify-center h-full">
        {/* ロゴマーク - 130% 拡大 & 位置調整 */}
        <div 
          className="mb-24 grayscale"
          style={{
            transition: 'transform 1s ease-out 0.3s, opacity 1s ease-out 0.3s',
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-40px)',
            opacity: isMenuOpen ? 0.3 : 0
          }}
        >
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src="/logo.png" alt="Logo" className="h-16 md:h-20 w-auto" />
        </div>
        
        <nav className="flex flex-col items-center space-y-10 font-serif text-2xl tracking-[0.4em] font-bold text-[#2e2a24]">
          {navItems.map((item, idx) => (
            <Link 
              key={idx}
              href={item.href} 
              onClick={() => setIsMenuOpen(false)}
              className="hover:opacity-60 py-2 border-b border-transparent hover:border-[#2e2a24]"
              style={{ 
                transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
                transitionDelay: isMenuOpen ? `${idx * 60 + 400}ms` : '0ms',
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMenuOpen ? 1 : 0
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div 
          className="mt-20 pt-12 font-mono text-[9px] tracking-[0.5em] text-[#8b857a] uppercase border-t border-[#bbb4a4]/30 w-40 text-center"
          style={{
            transition: 'opacity 1s ease-out 0.8s',
            opacity: isMenuOpen ? 1 : 0
          }}
        >
          Archive134
        </div>
      </div>
    </div>
  );
};

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのマウントを確認
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // メニューが開いている間、背景のスクロールを禁止
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // 零号資料（DOC134-000）の特設ページでは、左側のロゴ一式（正式な看板）のみを表示する
  if (pathname === '/document/DOC134-000') {
    return (
      <header className="fixed top-0 z-50 w-full bg-transparent">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 md:gap-5 hover:opacity-80 transition-opacity">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-10 md:h-14 lg:h-16 w-auto object-contain" 
            />
            <div className="flex flex-col justify-center border-l border-[#bbb4a4] pl-4 md:pl-5">
              <h1 className="font-serif font-bold text-base md:text-lg lg:text-xl tracking-[0.2em] leading-tight text-[#2e2a24]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logotype.png" 
                  alt="記録資料一三四号" 
                  className="h-[16px] md:h-[22px] lg:h-[25px] w-auto object-contain brightness-0" 
                />
              </h1>
              <span className="font-mono text-[8px] md:text-[10px] tracking-widest uppercase mt-0.5 text-[#5a5248]">
                Archive134
              </span>
            </div>
          </Link>
        </div>
      </header>
    );
  }

  const navItems = [
    { name: '世界概要', href: '/about' },
    { name: '収蔵資料一覧', href: '/#section-02' },
    { name: '年表', href: '/timeline' },
    { name: '管理者情報', href: '/administrator' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#bbb4a4]/30 bg-[#f4efe4]/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4 md:gap-5 hover:opacity-80 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 md:h-14 lg:h-16 w-auto object-contain" 
          />
          <div className="flex flex-col justify-center border-l border-[#bbb4a4] pl-4 md:pl-5">
            <h1 className="font-serif font-bold text-base md:text-lg lg:text-xl tracking-[0.2em] leading-tight text-[#2e2a24]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logotype.png" 
                alt="記録資料一三四号" 
                className="h-[16px] md:h-[22px] lg:h-[25px] w-auto object-contain brightness-0" 
              />
            </h1>
            <span className="font-mono text-[8px] md:text-[10px] tracking-widest uppercase mt-0.5 text-[#5a5248]">
              Archive134
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-6 lg:gap-10 font-serif text-xs lg:text-sm font-bold tracking-[0.2em] text-[#2e2a24]">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={idx}
                href={item.href} 
                className={`transition-all duration-300 ${
                  isActive 
                    ? 'opacity-100 border-b border-[#2e2a24] pb-1 pointer-events-none' 
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* モバイル用メニューボタン */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="font-mono text-[10px] tracking-widest border border-[#bbb4a4] px-4 py-1 text-[#5a5248] hover:bg-[#2e2a24] hover:text-[#f4efe4] transition-all"
          >
            MENU
          </button>
        </div>
      </div>

      {/* ポータルを使用してメニューを body 直下へ転送（常にマウントしてアニメーションを確実にする） */}
      {mounted && createPortal(
        <MobileMenu 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          navItems={navItems} 
        />, 
        document.body
      )}
    </header>
  );
}
