'use client';

import { useState } from 'react';
import Link from 'next/link';

type EventData = {
  id: string;
  yearValue: number;
  displayYear: string;
  content: string;
  category: { id: string; name: string };
  relatedDocuments: { id: string; displayId: string; title: string }[];
};

export default function TimelineAccordionItem({ event }: { event: EventData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative border-l border-[#bbb4a4]/50 ml-2 pl-10 py-8 transition-all duration-300 group">
      {/* Node Marker - Interactive circle with connecting line */}
      {/* Adjusted top position to align with the center of the displayYear h3 */}
      <div className="absolute -left-[6px] top-[80px] flex items-center transition-all duration-300">
        <div className="w-3 h-3 rounded-full border-2 border-[#2e2a24] bg-[#f4efe4] group-hover:bg-[#2e2a24] transition-colors duration-300" />
        <div className="w-4 h-[1px] bg-[#bbb4a4]/50" />
      </div>
      
      {/* Header Area (Click to toggle) */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="cursor-pointer select-none"
      >
        <div className="flex flex-col mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[9px] font-mono tracking-[0.4em] text-[#8b857a] uppercase font-bold">
              REF-HIST-{event.id.slice(-4).toUpperCase()}
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] border border-[#bbb4a4]/40 px-2 py-0.5 text-[#57534e] bg-[#f9f5eb]/50">
              {event.category.name.toUpperCase()}
            </span>
          </div>
          
          <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-[#1c1917] group-hover:opacity-70 transition-opacity">
            {event.displayYear}
          </h3>
        </div>
        
        {!isOpen && event.content && (
          <p className="text-sm font-serif text-[#57534e] opacity-60 line-clamp-1 tracking-wider italic">
            {event.content}
          </p>
        )}
      </div>

      {/* Expanded Content Area */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-8">
          <div className="p-8 border border-[#bbb4a4]/30 bg-[#fefcf8] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 font-mono text-[8px] opacity-20 uppercase tracking-tighter">
              Confidential // {event.category.name}
            </div>
            
            <p className="whitespace-pre-wrap font-serif text-base leading-relaxed tracking-wider text-[#1c1917]">
              {event.content}
            </p>
          </div>
          
          {event.relatedDocuments && event.relatedDocuments.length > 0 && (
            <div className="pl-4 border-l-2 border-[#2e2a24]/10">
              <h4 className="text-[10px] font-mono tracking-[0.3em] text-[#8b857a] mb-4 uppercase font-bold">
                Linked Records // 関連収蔵資料
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.relatedDocuments.map(doc => (
                  <li key={doc.id}>
                    <Link 
                      href={`/document/${doc.displayId}`}
                      className="flex items-center gap-4 bg-white/40 hover:bg-[#2e2a24] hover:text-[#f4efe4] p-4 transition-all duration-300 border border-[#bbb4a4]/30 group/link"
                    >
                      <div className="flex flex-col min-w-[100px]">
                        <span className="text-[9px] font-mono text-[#8b857a] group-hover/link:text-[#bbb4a4] tracking-widest uppercase mb-0.5">Archive ID</span>
                        <span className="text-xs font-mono font-bold tracking-widest">{doc.displayId}</span>
                      </div>
                      <div className="flex-1 border-l border-[#bbb4a4]/20 pl-4 overflow-hidden">
                        <span className="text-sm font-serif font-bold truncate block">{doc.title}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
