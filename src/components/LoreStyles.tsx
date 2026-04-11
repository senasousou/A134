import React from 'react';

// [ 2026.04.02 // 観測記録 ] のような、等幅フォントのバッジ
export function ObservationBadge({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode, 
  className?: string 
}) {
  return (
    <div className={`font-mono text-[10px] md:text-xs tracking-[0.2em] text-[#8b8b8b] uppercase ${className}`}>
      [ <span className="px-1">{children}</span> ]
    </div>
  );
}

// ページ下部の System Log: [RESTRICTED] 演出
export function RestrictedLog({ 
  children, 
  className = "" 
}: { 
  children?: React.ReactNode, 
  className?: string 
}) {
  return (
    <div className={`mt-24 pt-8 border-t border-[#bbb4a4]/30 opacity-40 hover:opacity-100 transition-opacity duration-700 ${className}`}>
      <h4 className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#5a5248] mb-3">
        System Log: [RESTRICTED]
      </h4>
      <p className="text-[9px] font-mono leading-relaxed tracking-wider">
        {children || "ERROR: MEMORY FRAGMENTATION DETECTED // OBSERVATIONAL DRIFT: +0.024% // STATUS: MONITORING CONTINUES."}
      </p>
    </div>
  );
}

// 点線で囲まれた注釈ブロック
export function AdministratorNote({ 
  children, 
  className = "",
  signature = false
}: { 
  children: React.ReactNode, 
  className?: string,
  signature?: boolean
}) {
  return (
    <div className={`my-12 p-6 md:p-8 border border-dashed border-[#bbb4a4] bg-[#f5ebd5]/10 relative group ${className}`}>
      <div className="absolute -top-3 left-6 bg-[#FFF8E7] px-3 py-0.5 text-[10px] font-mono tracking-widest text-[#5a5248] uppercase">
        Admin Note
      </div>
      <div className="text-sm md:text-base italic leading-relaxed text-[#4a443c]">
        {children}
      </div>
      {signature && (
        <div className="mt-6 text-right font-serif text-sm tracking-widest text-[#5a5248]">
          — 瀬名 桑想 (S. Sena)
        </div>
      )}
    </div>
  );
}
