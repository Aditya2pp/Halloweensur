import React from 'react';
import { CoinIcon, SpookySkullIcon, RubySwordIcon, LightningSpeedIcon } from '../GameIcons';

interface GameHUDProps {
  wave: number;
  timeRemaining: number; // in seconds
  score: number;
  kills: number;
  coins: number;
  swordCount: number;
  shieldTimeRemaining: number;
  speedBoostTimeRemaining: number;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  wave,
  timeRemaining,
  kills,
  coins,
  swordCount,
  shieldTimeRemaining,
  speedBoostTimeRemaining,
  onPause,
}) => {
  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.floor(Math.max(0, secs) % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-3 pointer-events-none select-none flex flex-col gap-1">
      {/* Top Bar matching reference */}
      <div className="w-full flex items-center justify-between">
        
        {/* Top-Left: Pause Button (interactive) */}
        <button
          id="btn-gameplay-pause"
          onClick={onPause}
          title="Pause Game"
          className="pointer-events-auto w-11 h-11 rounded-2xl game-panel-border game-panel-interactive flex items-center justify-center cursor-pointer hover:brightness-110 shadow-lg"
        >
          <div className="flex gap-1">
            <div className="w-1.5 h-4.5 bg-emerald-200 rounded-xs" />
            <div className="w-1.5 h-4.5 bg-emerald-200 rounded-xs" />
          </div>
        </button>

        {/* Top-Center: WAVE & Countdown Timer */}
        <div className="flex flex-col items-center">
          <div className="font-lilita text-xl sm:text-2xl text-white tracking-widest stroke-dark-sm drop-shadow">
            WAVE {wave}
          </div>
          <div
            className={`font-lilita text-lg sm:text-xl tracking-wider ${
              timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-emerald-100'
            } stroke-dark-sm drop-shadow`}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Top-Right: Swords, Kills & Coin Counters */}
        <div className="flex flex-col items-end gap-1.5">
          {/* Swords Available */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full game-pill shadow">
            <RubySwordIcon size={18} />
            <span className="font-lilita text-sm sm:text-base text-[#38BDF8] tracking-wide stroke-dark-sm">
              {swordCount}
            </span>
          </div>

          {/* Kills (Skull) */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full game-pill shadow">
            <SpookySkullIcon size={16} />
            <span className="font-lilita text-sm sm:text-base text-white tracking-wide stroke-dark-sm">
              {kills}
            </span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full game-pill shadow">
            <CoinIcon size={18} />
            <span className="font-lilita text-sm sm:text-base text-[#FFE57F] tracking-wide stroke-dark-sm">
              {coins.toLocaleString()}
            </span>
          </div>
        </div>

      </div>

      {/* Buff Indicators (Shield, Speed) */}
      <div className="flex items-center gap-2 mt-1">
        {shieldTimeRemaining > 0 && (
          <div className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-200 font-lilita text-xs tracking-wider flex items-center gap-1 animate-pulse shadow">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            SHIELD: {shieldTimeRemaining.toFixed(1)}s
          </div>
        )}

        {speedBoostTimeRemaining > 0 && (
          <div className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400 text-amber-200 font-lilita text-xs tracking-wider flex items-center gap-1.5 animate-pulse shadow">
            <LightningSpeedIcon size={16} />
            <span>SPEED: {speedBoostTimeRemaining.toFixed(1)}s</span>
          </div>
        )}
      </div>
    </header>
  );
};
