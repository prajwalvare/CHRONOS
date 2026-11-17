import React, { useState, useEffect } from 'react';
import { ArrowUpRight, BookOpen, Feather } from 'lucide-react';

const TIME_QUOTES = [
  {
    quote: 'Dost thou love life? Then do not squander time, for that’s the stuff life is made of.',
    author: 'Benjamin Franklin',
    work: 'Poor Richard’s Almanack, 1746',
  },
  {
    quote: 'Time is a created thing. To say “I don’t have time” is like saying “I don’t want to”.',
    author: 'Lao Tzu',
    work: 'Daoist Horology',
  },
  {
    quote: 'It is not that we have a short time to live, but that we waste a lot of it.',
    author: 'Lucius Annaeus Seneca',
    work: 'De Brevitate Vitae, 49 AD',
  },
  {
    quote: 'Time is the moving image of eternity.',
    author: 'Plato',
    work: 'Timaeus',
  },
  {
    quote: 'Lost time is never found again.',
    author: 'Proverbial Maxim',
    work: 'Chronos Archives',
  },
];

export default function ParchmentNote({ onOpenHistory }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Pick a random quote on mount
    const idx = Math.floor(Math.random() * TIME_QUOTES.length);
    setQuoteIndex(idx);
  }, []);

  const current = TIME_QUOTES[quoteIndex];

  return (
    <div
      onClick={onOpenHistory}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenHistory()}
      className="group relative w-full max-w-sm p-6 bg-[#D8C7A5] text-[#1C1914] shadow-2xl rounded-xs border border-[#BFA67A] cursor-pointer hover:scale-[1.03] hover:-rotate-1 transition-all duration-300 select-none"
      title="Click to enter the Archival History Journal"
      style={{
        boxShadow: '0 12px 30px -4px rgba(0,0,0,0.7), inset 0 0 40px rgba(169,129,67,0.25)',
      }}
    >
      {/* Antique Paper Corner Fold Effect */}
      <div className="absolute top-0 right-0 border-solid border-t-[20px] border-r-[20px] border-t-[#080807] border-r-[#080807] border-b-[20px] border-l-[20px] border-b-[#B59D73] border-l-[#B59D73] w-0 h-0" />

      {/* Wax Seal Stamp (Top Left) */}
      <div className="flex justify-between items-center pb-2 mb-3 border-b border-[#A68F68]/40">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#8B261D] text-[#E9E0D0] flex items-center justify-center text-[10px] font-serif shadow-xs border border-[#5E1610]">
            Ω
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#5A4D3B] font-mono font-semibold">
            Chronos Journal
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[#5A4D3B] font-sans group-hover:text-[#8B261D] transition-colors">
          <span>Open History</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Handwritten / Engraved Serif Quote */}
      <div className="relative pl-3 border-l-2 border-[#8B261D]/50 my-2">
        <p className="text-sm font-serif italic text-[#261E14] leading-relaxed">
          “{current.quote}”
        </p>
      </div>

      {/* Attribution */}
      <div className="mt-3 flex justify-between items-end text-xs font-serif pt-1 border-t border-[#A68F68]/30 text-[#473B2B]">
        <div>
          <span className="font-bold text-[#2A2116] block">{current.author}</span>
          <span className="text-[10px] text-[#695741] italic font-sans">{current.work}</span>
        </div>
        <Feather className="w-4 h-4 text-[#7A664E] group-hover:rotate-12 transition-transform" />
      </div>

      {/* Click Invitation Hint */}
      <div className="mt-3 text-center text-[10px] tracking-widest uppercase text-[#735F47] font-mono group-hover:text-[#1C1914] transition-colors">
        [ Click note to view full archive ]
      </div>
    </div>
  );
}
