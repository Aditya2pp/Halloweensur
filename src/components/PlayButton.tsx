import React from 'react';
import { soundFx } from '../utils/audio';

interface PlayButtonProps {
  onPlay: () => void;
}

export const PlayButton: React.FC<PlayButtonProps> = ({ onPlay }) => {
  const handleClick = () => {
    soundFx.playBattleStart();
    onPlay();
  };

  return (
    <div className="relative w-full flex justify-center items-center select-none py-1">
      {/* Outer button glow aura */}
      <div className="absolute w-48 h-16 bg-amber-500/20 rounded-3xl blur-xl pointer-events-none animate-pulse-glow" />

      <button
        id="btn-main-play"
        onClick={handleClick}
        className="relative w-56 sm:w-64 h-16 sm:h-18 rounded-2xl sm:rounded-3xl play-btn-glow flex items-center justify-center cursor-pointer transition-transform duration-100 active:translate-y-1 hover:brightness-105"
      >
        {/* Top Gloss Reflection Line */}
        <div className="absolute top-1.5 left-4 right-4 h-3 bg-gradient-to-b from-white/60 to-transparent rounded-full pointer-events-none" />

        {/* Text "PLAY" with multi-layered 3D stroke */}
        <span
          className="font-lilita text-4xl sm:text-5xl tracking-widest text-white stroke-black-play uppercase drop-shadow-[0_4px_0_#4a2003]"
          style={{
            filter: 'drop-shadow(0 3px 0 #2b1200) drop-shadow(0 6px 8px rgba(0,0,0,0.8))',
          }}
        >
          PLAY
        </span>
      </button>
    </div>
  );
};
