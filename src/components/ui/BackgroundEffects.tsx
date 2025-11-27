'use client';

export function BackgroundEffects() {
  // Show background on ALL pages for consistency
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Background Pattern - Full Page */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      {/* Geometric Shapes - Full Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* === TOP SECTION === */}
        <div className="absolute top-20 right-[10%] w-40 h-40 rounded-full border border-gray-300/30 dark:border-gray-600/30" style={{ animation: 'float 25s ease-in-out infinite' }} />
        <div className="absolute top-48 right-[30%] w-24 h-24 rounded-full border border-blue-400/25 dark:border-blue-500/25" style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-8s' }} />
        <div className="absolute top-32 right-[8%] w-4 h-4 rounded-full bg-blue-500/35 dark:bg-blue-400/35" style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '-3s' }} />
        <div className="absolute top-16 left-[8%] w-32 h-32 rounded-full border border-gray-300/25 dark:border-gray-600/25" style={{ animation: 'float 23s ease-in-out infinite', animationDelay: '-2s' }} />
        <div className="absolute top-40 left-[15%] w-3 h-3 rounded-full bg-gray-500/30 dark:bg-gray-400/30" style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-6s' }} />
        <div className="absolute top-8 left-[45%] w-16 h-16 rounded-full border border-gray-300/20 dark:border-gray-600/20" style={{ animation: 'float 24s ease-in-out infinite', animationDelay: '-15s' }} />
        <div className="absolute top-36 right-[20%] w-28 h-28 border border-gray-400/25 dark:border-gray-500/25 rotate-45" style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-5s' }} />

        {/* === MIDDLE SECTION === */}
        <div className="absolute top-[30%] right-[5%] w-20 h-20 rounded-full border border-gray-400/25 dark:border-gray-500/25" style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-4s' }} />
        <div className="absolute top-[35%] left-[3%] w-16 h-16 border border-gray-400/20 dark:border-gray-500/20 rotate-[30deg]" style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-8s' }} />
        <div className="absolute top-[40%] right-[35%] w-12 h-12 border border-blue-300/30 dark:border-blue-600/30 rotate-12" style={{ animation: 'float 17s ease-in-out infinite', animationDelay: '-10s' }} />
        <div className="absolute top-[45%] left-[20%] w-6 h-6 rounded-full bg-blue-400/25 dark:bg-blue-500/25" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-12s' }} />
        <div className="absolute top-[50%] right-[15%] w-10 h-10 rounded-full border border-gray-300/25 dark:border-gray-600/25" style={{ animation: 'float 19s ease-in-out infinite', animationDelay: '-7s' }} />
        <div className="absolute top-[55%] left-[12%] w-14 h-14 border border-blue-400/20 dark:border-blue-500/20 rotate-[-18deg]" style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-9s' }} />

        {/* === BOTTOM SECTION === */}
        <div className="absolute top-[65%] right-[8%] w-24 h-24 rounded-full border border-gray-400/20 dark:border-gray-500/20" style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-3s' }} />
        <div className="absolute top-[70%] left-[5%] w-20 h-20 rounded-full border border-blue-400/20 dark:border-blue-500/20" style={{ animation: 'float 19s ease-in-out infinite', animationDelay: '-9s' }} />
        <div className="absolute top-[75%] right-[25%] w-8 h-8 border border-gray-400/25 dark:border-gray-500/25 rotate-45" style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-11s' }} />
        <div className="absolute top-[80%] left-[30%] w-5 h-5 rounded-full bg-gray-400/20 dark:bg-gray-500/20" style={{ animation: 'float 15s ease-in-out infinite', animationDelay: '-8s' }} />
        <div className="absolute top-[85%] right-[40%] w-18 h-18 rounded-full border border-blue-300/15 dark:border-blue-600/15" style={{ animation: 'float 23s ease-in-out infinite', animationDelay: '-14s' }} />
        <div className="absolute top-[90%] left-[45%] w-12 h-12 border border-gray-400/20 dark:border-gray-500/20 rotate-[22deg]" style={{ animation: 'float 20s ease-in-out infinite', animationDelay: '-6s' }} />

        {/* === SCATTERED SMALL SHAPES === */}
        <div className="absolute top-[25%] right-[45%] w-3 h-3 rounded-full bg-blue-400/30 dark:bg-blue-500/30" style={{ animation: 'float 14s ease-in-out infinite', animationDelay: '-5s' }} />
        <div className="absolute top-[60%] left-[40%] w-2 h-2 rounded-full bg-gray-500/35 dark:bg-gray-400/35" style={{ animation: 'float 13s ease-in-out infinite', animationDelay: '-10s' }} />
        <div className="absolute top-[42%] right-[50%] w-4 h-4 border border-gray-400/25 dark:border-gray-500/25 rotate-45" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-7s' }} />
        <div className="absolute top-[72%] left-[55%] w-3 h-3 rounded-full bg-blue-400/25 dark:bg-blue-500/25" style={{ animation: 'float 16s ease-in-out infinite', animationDelay: '-12s' }} />
        <div className="absolute top-[38%] left-[48%] w-6 h-6 rounded-full border border-gray-300/20 dark:border-gray-600/20" style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-4s' }} />

        {/* === LINES === */}
        <div className="absolute top-[20%] right-[25%] w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-400/35 to-transparent dark:via-gray-500/35 rotate-[20deg]" />
        <div className="absolute top-[45%] left-[10%] w-24 h-[1px] bg-gradient-to-r from-transparent via-gray-400/25 to-transparent dark:via-gray-500/25 rotate-[-25deg]" />
        <div className="absolute top-[68%] right-[18%] w-20 h-[1px] bg-gradient-to-r from-transparent via-blue-400/25 to-transparent dark:via-blue-500/25 rotate-[35deg]" />
        <div className="absolute top-[82%] left-[22%] w-28 h-[1px] bg-gradient-to-r from-transparent via-gray-400/20 to-transparent dark:via-gray-500/20 rotate-[-10deg]" />

        {/* === TRIANGLES === */}
        <div className="absolute top-[28%] left-[7%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-gray-400/25 dark:border-b-gray-500/25 rotate-[15deg]" style={{ animation: 'float 22s ease-in-out infinite', animationDelay: '-6s' }} />
        <div className="absolute top-[58%] right-[8%] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-blue-400/25 dark:border-b-blue-500/25 rotate-[-20deg]" style={{ animation: 'float 18s ease-in-out infinite', animationDelay: '-14s' }} />
        <div className="absolute top-[78%] left-[35%] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-gray-400/20 dark:border-b-gray-500/20 rotate-[-35deg]" style={{ animation: 'float 21s ease-in-out infinite', animationDelay: '-3s' }} />

        {/* === DOTS GROUPS === */}
        <div className="absolute top-[22%] right-[32%] flex gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-400/35 dark:bg-gray-500/35" />
          <div className="w-2 h-2 rounded-full bg-gray-400/45 dark:bg-gray-500/45" />
          <div className="w-2 h-2 rounded-full bg-gray-400/35 dark:bg-gray-500/35" />
        </div>
        <div className="absolute top-[52%] left-[6%] flex flex-col gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400/30 dark:bg-blue-500/30" />
          <div className="w-2 h-2 rounded-full bg-blue-400/40 dark:bg-blue-500/40" />
          <div className="w-2 h-2 rounded-full bg-blue-400/30 dark:bg-blue-500/30" />
        </div>
        <div className="absolute top-[75%] right-[35%] flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500/30 dark:bg-gray-400/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500/35 dark:bg-gray-400/35" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500/30 dark:bg-gray-400/30" />
        </div>

        {/* === PLUS SIGNS === */}
        <div className="absolute top-[32%] right-[38%]">
          <div className="w-5 h-[2px] bg-gray-400/35 dark:bg-gray-500/35" />
          <div className="w-[2px] h-5 bg-gray-400/35 dark:bg-gray-500/35 -mt-3 ml-[9px]" />
        </div>
        <div className="absolute top-[62%] left-[15%]">
          <div className="w-4 h-[1.5px] bg-blue-400/30 dark:bg-blue-500/30" />
          <div className="w-[1.5px] h-4 bg-blue-400/30 dark:bg-blue-500/30 -mt-2 ml-[7px]" />
        </div>
        <div className="absolute top-[88%] right-[20%] rotate-45">
          <div className="w-4 h-[1.5px] bg-gray-400/25 dark:bg-gray-500/25" />
          <div className="w-[1.5px] h-4 bg-gray-400/25 dark:bg-gray-500/25 -mt-2 ml-[7px]" />
        </div>
      </div>
    </div>
  );
}
