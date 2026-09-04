import React, { useState, useEffect } from 'react';
import chibiHeroImg from '../assets/images/chibi_skeleton_hero_1788284427196.jpg';
import { SpookySkullIcon, CoinIcon } from './GameIcons';
import { PlayerStats } from '../types';
import { soundFx } from '../utils/audio';

interface PlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onRewardEarned: (coins: number, score: number) => void;
}

export const PlayModal: React.FC<PlayModalProps> = ({
  isOpen,
  onClose,
  stats,
  onRewardEarned,
}) => {
  const [battleState, setBattleState] = useState<'prep' | 'fighting' | 'victory'>('prep');
  const [waveTimer, setWaveTimer] = useState(10);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setBattleState('prep');
      setWaveTimer(10);
      setEnemiesDefeated(0);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (battleState === 'fighting' && waveTimer > 0) {
      const timer = setInterval(() => {
        setWaveTimer((prev) => prev - 1);
        setEnemiesDefeated((prev) => prev + Math.floor(Math.random() * 3) + stats.swordCount);
        if (Math.random() > 0.4) soundFx.playSwordClang();
      }, 1000);
      return () => clearInterval(timer);
    } else if (battleState === 'fighting' && waveTimer === 0) {
      setBattleState('victory');
      soundFx.playUpgradeSuccess();
      const earnedCoins = 350 + stats.swordLevel * 50;
      const earnedScore = 1200 + enemiesDefeated * 45;
      onRewardEarned(earnedCoins, earnedScore);
    }
  }, [battleState, waveTimer, enemiesDefeated, onRewardEarned, stats.swordCount, stats.swordLevel]);

  if (!isOpen) return null;

  const startWave = () => {
    soundFx.playBattleStart();
    setBattleState('fighting');
  };

  const handleReturnToMenu = () => {
    soundFx.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-sm rounded-3xl p-5 game-panel-border border-4 border-[#07170E] flex flex-col items-center shadow-2xl animate-scaleUp">
        
        {battleState === 'prep' && (
          <div className="w-full flex flex-col items-center text-center">
            {/* Skull Emblem */}
            <div className="p-3 bg-emerald-950/60 rounded-full border-2 border-emerald-500/40 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <SpookySkullIcon size={44} />
            </div>

            <h2 className="font-lilita text-3xl text-[#FFE57F] tracking-wider stroke-dark-sm drop-shadow">
              STAGE 1: HAUNTED GATE
            </h2>
            <p className="text-xs text-emerald-300 font-fredoka mt-1">
              Survive against waves of pumpkin ghosts & bats!
            </p>

            {/* Hero Battle Stats Card */}
            <div className="w-full my-4 p-3.5 rounded-2xl bg-[#091b11] border border-[#07170e] flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-lilita">
                <span className="text-emerald-400">HERO MAX HP:</span>
                <span className="text-emerald-200">{stats.maxHealth} HP</span>
              </div>
              <div className="flex justify-between items-center text-xs font-lilita">
                <span className="text-emerald-400">ORBITING SWORDS:</span>
                <span className="text-amber-300">{stats.swordCount} SWORDS ({stats.swordDamage} DMG)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-lilita">
                <span className="text-emerald-400">CURRENT WAVE:</span>
                <span className="text-yellow-400">WAVE {stats.wavesCleared + 1}</span>
              </div>
            </div>

            {/* Launch Survival Button */}
            <button
              id="btn-start-survival-battle"
              onClick={startWave}
              className="w-full py-3.5 rounded-2xl play-btn-glow flex items-center justify-center font-lilita text-2xl text-white stroke-black-play tracking-wider cursor-pointer active:scale-95 transition-transform"
            >
              START WAVE!
            </button>

            {/* Back Button */}
            <button
              id="btn-cancel-battle"
              onClick={handleReturnToMenu}
              className="mt-3 text-xs font-lilita text-emerald-400/80 hover:text-emerald-200 tracking-wider cursor-pointer"
            >
              BACK TO MAIN MENU
            </button>
          </div>
        )}

        {battleState === 'fighting' && (
          <div className="w-full flex flex-col items-center text-center py-4">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/40 animate-ping" />
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-400 bg-emerald-950 flex items-center justify-center">
                <img
                  src={chibiHeroImg}
                  alt="Fighting Hero"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover animate-spin duration-1000"
                />
              </div>
            </div>

            <h3 className="font-lilita text-2xl text-emerald-200 mt-4 tracking-wide animate-pulse">
              SURVIVING... {waveTimer}s
            </h3>
            <p className="text-xs text-amber-300 font-fredoka mt-1">
              Swords Slashing! Ghosts Vanquished: {enemiesDefeated}
            </p>

            {/* Battle Progress Bar */}
            <div className="w-full h-3 rounded-full bg-black/60 border border-emerald-900 overflow-hidden mt-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-1000"
                style={{ width: `${((10 - waveTimer) / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {battleState === 'victory' && (
          <div className="w-full flex flex-col items-center text-center py-2">
            <div className="p-3 bg-amber-950/60 rounded-full border-2 border-amber-500/60 mb-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <SpookySkullIcon size={46} />
            </div>

            <h2 className="font-lilita text-3xl text-[#FFE57F] tracking-wider stroke-dark-sm drop-shadow">
              WAVE CLEARED!
            </h2>
            <p className="text-xs text-emerald-300 font-fredoka mt-1">
              You survived the haunted onslaught!
            </p>

            <div className="w-full my-4 p-3 rounded-2xl bg-[#091b11] border border-[#07170e] flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-lilita">
                <span className="text-emerald-400">ENEMIES DEFEATED:</span>
                <span className="text-emerald-200">+{enemiesDefeated}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-lilita">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CoinIcon size={18} /> COINS REWARD:
                </span>
                <span className="text-yellow-300">+{350 + stats.swordLevel * 50}</span>
              </div>
            </div>

            <button
              id="btn-claim-rewards"
              onClick={handleReturnToMenu}
              className="w-full py-3 rounded-2xl play-btn-glow flex items-center justify-center font-lilita text-xl text-white stroke-black-play tracking-wider cursor-pointer active:scale-95 shadow-lg"
            >
              COLLECT & RETURN
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
