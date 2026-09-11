import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#fffcf5] border-t-2 border-amber-200/80 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌈</span>
          <span className="font-rubik text-sm font-black text-amber-950">
            MathVenture Kids • Pure Playful Tactile Learning
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-jakarta text-xs font-extrabold text-amber-900">
          <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-amber-200 shadow-sm">
            <span>🧸</span> Parent Guided
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-amber-200 shadow-sm">
            <span>📺</span> Smartboard Ready
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-amber-200 shadow-sm">
            <span>⭐</span> Curriculum Aligned
          </span>
        </div>

        <div className="font-jakarta text-xs text-amber-900/70 font-semibold">
          © MathVenture Kids. Made for playful learners everywhere! ✨
        </div>
      </div>
    </footer>
  );
};
