'use client';

import React from 'react';
import Image from 'next/image';

interface ConfidentialReportProps {
  id?: string;
  date?: string;
  classification?: string;
  author?: string;
  subject?: string;
  children: React.ReactNode;
}

/**
 * ConfidentialReport Component
 * mimics a formal, bureaucratic, and cold government document (CIA-style).
 */
export const ConfidentialReport: React.FC<ConfidentialReportProps> = ({
  id = 'DOC134-010-8492',
  date = '1961-02-24',
  classification = 'LEVEL 4 (CONFIDENTIAL)',
  author = 'REDACTED',
  subject = 'OPERATION BLUEBIRD - PRELIMINARY ANALYSIS',
  children,
}) => {
  return (
    <div className="max-w-4xl mx-auto my-10 p-12 bg-[#fdfcf0] border border-[#d1ccb8] shadow-2xl font-mono text-[#1a1a1a] relative overflow-hidden" 
         style={{ minHeight: '1100px', backgroundImage: 'radial-gradient(#e7e0cd 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}>
      
      {/* Decorative Paper Texture / Aged Feel */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")' }}></div>

      {/* Institutional Header (1961 Styled) */}
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div className="relative w-8 h-8 grayscale contrast-125">
           <Image src="/logos/logomark.png" alt="Archive 134 Mark" fill className="object-contain" />
        </div>
        <div className="text-sm font-bold uppercase tracking-[0.2em] text-stone-800">
          Archive 134
        </div>
      </div>

      {/* Small Balanced Titles */}
      <div className="text-center mb-10 relative z-10">
        <div className="text-xs font-bold tracking-[0.4em] text-stone-600 uppercase mb-1">
          CONFIDENTIAL
        </div>
        <div className="text-sm font-bold tracking-[0.2em] text-stone-800 uppercase">
          Record Document 134
        </div>
      </div>

      {/* Metadata Table */}
      <div className="mb-10 relative z-10 overflow-hidden border border-stone-800">
        <div className="grid grid-cols-4 text-sm">
          <div className="bg-stone-200 p-3 border-r border-b border-stone-800 font-bold">REFERENCE NO:</div>
          <div className="p-3 border-b border-stone-800 col-span-1">{id}</div>
          <div className="bg-stone-200 p-3 border-x border-b border-stone-800 font-bold">DATE:</div>
          <div className="p-3 border-b border-stone-800">{date}</div>
          
          <div className="bg-stone-200 p-3 border-r border-b border-stone-800 font-bold">CLASSIFICATION:</div>
          <div className="p-3 border-b border-stone-800 col-span-3 font-semibold text-red-800">{classification}</div>
          
          <div className="bg-stone-200 p-3 border-r border-b border-stone-800 font-bold">AUTHOR/HANDLER:</div>
          <div className="p-3 border-b border-stone-800 col-span-1">
             <RedactedText text={author} />
          </div>
          <div className="bg-stone-200 p-3 border-x border-b border-stone-800 font-bold">STATUS:</div>
          <div className="p-3 border-b border-stone-800">ACTIVE / PENDING REVIEW</div>

          <div className="bg-stone-200 p-3 border-r border-stone-800 font-bold">SUBJECT:</div>
          <div className="p-3 col-span-3 font-bold uppercase">{subject}</div>
        </div>
      </div>

      {/* Content Area */}
      <article className="prose prose-stone max-w-none text-justify leading-relaxed relative z-10 text-lg">
        {children}
      </article>

      {/* Footer Text */}
      <div className="absolute bottom-12 left-0 right-0 text-center text-[10px] text-stone-400 uppercase tracking-[0.3em] font-sans">
        Property of Archive 134 | Unauthorized disclosure is subject to immediate disciplinary and legal action
      </div>
      
      {/* Page Numbering */}
      <div className="absolute bottom-6 right-12 text-sm text-stone-400 font-mono italic">
        PAGE 001 / [EOF]
      </div>
    </div>
  );
};

interface RedactedTextProps {
  text: string;
  revealOnHover?: boolean;
}

export const RedactedText: React.FC<RedactedTextProps> = ({ text, revealOnHover = true }) => {
  return (
    <span 
      className={`bg-stone-900 rounded-sm px-1 cursor-help transition-colors duration-500 ease-in-out ${revealOnHover ? 'hover:bg-transparent hover:text-inherit' : ''}`}
      title={revealOnHover ? "Classification Required to View" : "Permanently Redacted"}
    >
      <span className={revealOnHover ? "opacity-0 hover:opacity-100 transition-opacity" : "invisible"}>
        {text}
      </span>
      <span className={`${revealOnHover ? 'inline hover:hidden' : 'inline'} text-stone-900 select-none`}>
        {"█".repeat(text.length || 8)}
      </span>
    </span>
  );
};
