import React, { useState, useEffect } from 'react';
import { TrophyIcon, SpookySkullIcon } from './GameIcons';
import { LeaderboardEntry } from '../types';
import { soundFx } from '../utils/audio';
import { getTimeUntilMidnight } from '../utils/leaderboard';

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  playerKills: number;
}

export const RankingModal: React.FC<RankingModalProps> = ({
  isOpen,
  onClose,
  entries,
  playerKills,
}) => {
  const [resetCountdown, setResetCountdown] = useState(getTimeUntilMidnight());

  // Live 1-second countdown to daily midnight reset
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setResetCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    soundFx.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs select-none animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-[380px] rounded-3xl p-4 sm:p-5 game-panel-border border-4 border-[#07170E] flex flex-col max-h-[88vh] shadow-2xl animate-scaleUp">
        
        {/* Header with Trophy & Daily Reset Timer */}
        <div className="flex items-center justify-between pb-2.5 border-b border-emerald-900/60">
          <div className="flex items-center gap-2">
            <TrophyIcon size={32} />
            <div>
              <h2 className="font-lilita text-xl sm:text-2xl text-[#FFE57F] tracking-wide stroke-dark-sm drop-shadow">
                DAILY RANKINGS
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-fredoka">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Resets in: <strong className="text-amber-300 font-lilita">{resetCountdown}</strong></span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            id="btn-close-ranking"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#0a1f13] border-2 border-[#040f09] flex items-center justify-center text-emerald-300 font-lilita text-base hover:bg-emerald-950 active:scale-90 cursor-pointer shadow"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Leaderboard Cards (Ranked by Kills) */}
        <div className="flex-1 overflow-y-auto my-2.5 pr-0.5 flex flex-col gap-1.5">
          {entries.map((entry) => {
            const isTop1 = entry.rank === 1;
            const isTop2 = entry.rank === 2;
            const isTop3 = entry.rank === 3;

            return (
              <div
                key={entry.rank}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                  entry.isPlayer
                    ? 'bg-emerald-900/50 border-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.25)]'
                    : 'bg-[#091b11] border-[#07170e]'
                }`}
              >
                {/* Rank Badge + Hero Info */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-lilita text-xs sm:text-sm ${
                      isTop1
                        ? 'bg-gradient-to-b from-yellow-300 to-amber-500 text-amber-950 border border-yellow-200 shadow'
                        : isTop2
                        ? 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-900 border border-slate-100'
                        : isTop3
                        ? 'bg-gradient-to-b from-amber-600 to-amber-800 text-amber-100 border border-amber-500'
                        : 'bg-[#0d281a] text-emerald-300 border border-[#091f13]'
                    }`}
                  >
                    #{entry.rank}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-lilita text-sm tracking-wide ${
                          entry.isPlayer ? 'text-amber-300 font-bold' : 'text-emerald-100'
                        }`}
                      >
                        {entry.name}
                      </span>
                      {entry.isPlayer && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-500 font-fredoka">
                      {entry.hero} • Wave {entry.wave}
                    </span>
                  </div>
                </div>

                {/* Prominent Kills Metric */}
                <div className="flex items-center gap-1.5 text-right">
                  <SpookySkullIcon size={16} />
                  <div className="font-lilita text-base sm:text-lg text-[#FFE57F] tracking-wide stroke-dark-sm">
                    {entry.kills.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Player Current Best Bar */}
        <div className="p-2.5 rounded-2xl bg-[#06140c] border-2 border-[#092215] flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="font-lilita text-xs sm:text-sm text-emerald-400">TODAY'S KILLS:</span>
            <span className="font-lilita text-base sm:text-lg text-amber-400 flex items-center gap-1">
              <SpookySkullIcon size={18} /> {playerKills.toLocaleString()}
            </span>
          </div>
          <button
            id="btn-ranking-got-it"
            onClick={handleClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-800 text-white font-lilita text-sm tracking-wider border border-emerald-400 active:scale-95 shadow cursor-pointer"
          >
            OK
          </button>
        </div>

      </div>
    </div>
  );
};
