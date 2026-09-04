import React, { useState } from 'react';
import skeletonHeroImg from '../assets/images/skeleton_sword_hero_1788333310950.jpg';
import { soundFx } from '../utils/audio';
import { RubySwordIcon } from './GameIcons';

interface ChibiHeroStageProps {
  swordCount: number;
  healthLevel: number;
  swordLevel: number;
}

export const ChibiHeroStage: React.FC<ChibiHeroStageProps> = ({
  swordCount,
  healthLevel,
  swordLevel,
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleHeroTap = () => {
    setIsClicked(true);
    soundFx.playSwordClang();
    setTimeout(() => setIsClicked(false), 500);
  };

  // Generate swords evenly spaced around orbit
  const swords = Array.from({ length: Math.min(swordCount, 8) });

  return (
    <div className="relative w-full flex flex-col items-center justify-center pointer-events-auto py-2 select-none">
      {/* Ground Shadow & Magic Green Rune Aura */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
        {/* Ground shadow ellipse */}
        <div className="absolute bottom-3 w-36 h-9 bg-black/70 rounded-full blur-[4px]" />
        
        {/* Spooky Glowing Ground Circle */}
        <div className="absolute bottom-2.5 w-40 h-10 rounded-full border border-emerald-500/40 bg-emerald-950/30 blur-[1px] animate-pulse-glow" />

        {/* Orbiting Swords Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-full h-full animate-[spin_5s_linear_infinite]">
            {swords.map((_, index) => {
              const angle = (index * 360) / swords.length;
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translate(84px) rotate(-${angle}deg)`,
                  }}
                >
                  {/* Orbiting Clean Ruby Broadsword Graphic */}
                  <div className="relative -ml-5 -mt-5 transition-transform duration-300">
                    {/* Ruby-Gem Stylized Broadsword Sprite */}
                    <div
                      className="relative filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                      style={{
                        transform: `rotate(${angle + 45}deg)`,
                      }}
                    >
                      <RubySwordIcon size={44} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chibi Skeleton Hero Character Container */}
        <div
          onClick={handleHeroTap}
          className={`relative z-10 cursor-pointer select-none transition-transform duration-300 ${
            isClicked ? 'scale-110 rotate-3' : 'hover:scale-105 active:scale-95'
          }`}
        >
          {/* Hero bobbing floating container */}
          <div className="relative animate-hero-float flex flex-col items-center">
            
            {/* Chibi Skeleton Warrior Portrait */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center">
              
              {/* Back Soft Spooky Green Aura */}
              <div className="absolute inset-1 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />

              {/* Chibi Skeleton with Sword in Hand */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-[4px] border-[#07170E] bg-gradient-to-b from-[#1b3d2b] to-[#0a1b12] shadow-[0_10px_25px_rgba(0,0,0,0.95),inset_0_2px_6px_rgba(255,255,255,0.25)]">
                <img
                  src={skeletonHeroImg}
                  alt="Chibi Skeleton Hero with Sword"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-105"
                />
                {/* Gloss reflection overlay */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-full" />
              </div>

              {/* Level Badge */}
              <div className="absolute -bottom-1.5 z-30 px-3 py-0.5 rounded-full bg-[#0d2217] border-2 border-[#05110a] shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-lilita tracking-wider text-emerald-200 uppercase stroke-dark-sm">
                  LV.{Math.max(healthLevel, swordLevel)} SKELETON WARRIOR
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
