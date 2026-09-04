import React from 'react';
import { SpookySkullIcon } from './GameIcons';

export const TitleBanner: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pt-1 pb-2">
      {/* Subtle spooky background aura */}
      <div className="absolute -top-3 w-56 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none animate-pulse-glow" />

      {/* Main Container with subtle cartoon float */}
      <div className="relative flex flex-col items-center animate-title-wobble">
        
        {/* Top Word: HALLOWEEN with Skull integrated */}
        <div className="relative flex items-center justify-center">
          {/* Back drop shadow layer */}
          <div className="absolute top-1 text-center font-lilita text-4xl sm:text-5xl tracking-wide text-black/80 blur-[1px]">
            HALLOWEEN
          </div>

          {/* Spooky Skull behind/between lettering */}
          <div className="absolute -top-3 z-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            <SpookySkullIcon size={38} />
          </div>

          {/* Lettering Left part "HALLO" and Right part "WEEN" with space for skull */}
          <div className="relative z-10 flex items-center font-lilita text-4xl sm:text-5xl tracking-normal">
            <span
              className="stroke-black-title text-transparent bg-clip-text bg-gradient-to-b from-[#FFF275] via-[#FFA41B] to-[#D35400] drop-shadow-[0_5px_0_#431407]"
              style={{
                filter: 'drop-shadow(0 2px 0 #1A0702) drop-shadow(0 4px 6px rgba(0,0,0,0.8))'
              }}
            >
              HALL
            </span>
            {/* Gap for skull */}
            <span className="w-9 inline-block" />
            <span
              className="stroke-black-title text-transparent bg-clip-text bg-gradient-to-b from-[#FFF275] via-[#FFA41B] to-[#D35400] drop-shadow-[0_5px_0_#431407]"
              style={{
                filter: 'drop-shadow(0 2px 0 #1A0702) drop-shadow(0 4px 6px rgba(0,0,0,0.8))'
              }}
            >
              WEEN
            </span>
          </div>
        </div>

        {/* Bottom Word: SURVIVOR (Slimy Toxic Green) */}
        <div className="relative -mt-2.5 z-30">
          {/* Shadow */}
          <div className="absolute top-1.5 left-0 right-0 text-center font-lilita text-4xl sm:text-5xl tracking-wider text-black/90 blur-[1px]">
            SURVIVOR
          </div>
          
          <h1
            className="relative font-lilita text-4xl sm:text-5xl tracking-wider stroke-black-survivor text-transparent bg-clip-text bg-gradient-to-b from-[#D4FC79] via-[#86EFAC] to-[#15803D]"
            style={{
              filter: 'drop-shadow(0 4px 0 #022c10) drop-shadow(0 6px 10px rgba(0,0,0,0.9))'
            }}
          >
            SURVIVOR
          </h1>

          {/* Slime Drip Accents */}
          <div className="absolute -bottom-1.5 left-8 w-1.5 h-3 bg-gradient-to-b from-[#86EFAC] to-[#15803D] rounded-full border border-black" />
          <div className="absolute -bottom-2.5 left-20 w-2 h-4 bg-gradient-to-b from-[#86EFAC] to-[#15803D] rounded-full border border-black" />
          <div className="absolute -bottom-2 right-12 w-1.5 h-3.5 bg-gradient-to-b from-[#86EFAC] to-[#15803D] rounded-full border border-black" />
          <div className="absolute -bottom-3 right-24 w-2 h-4.5 bg-gradient-to-b from-[#86EFAC] to-[#15803D] rounded-full border border-black" />
        </div>
      </div>
    </div>
  );
};
