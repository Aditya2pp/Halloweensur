import React, { useState } from 'react';
import { SpookySkullIcon, CoinIcon, TrophyIcon, AdTvIcon } from '../GameIcons';
import { soundFx } from '../../utils/audio';
import { isRewardedSupported, showRewardedAd } from '../../utils/playgamaBridge';

interface GameOverModalProps {
  isOpen: boolean;
  isVictory?: boolean;
  wave: number;
  score: number;
  kills: number;
  coinsEarned: number;
  onRetry: () => void;
  onMainMenu: () => void;
  onRewardBonusCoins?: (amount: number) => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isVictory = false,
  wave,
  score,
  kills,
  coinsEarned,
  onRetry,
  onMainMenu,
  onRewardBonusCoins,
}) => {
  const [hasClaimedAdBonus, setHasClaimedAdBonus] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRetry = () => {
    soundFx.playBattleStart();
    onRetry();
  };

  const handleMenu = () => {
    soundFx.playClick();
    onMainMenu();
  };

  const handleWatchAdBonus = () => {
    if (hasClaimedAdBonus || isAdLoading) return;
    soundFx.playClick();

    if (isRewardedSupported()) {
      setIsAdLoading(true);
      setBonusMessage(null);

      const started = showRewardedAd(
        'game_over_bonus',
        () => {
          // Reward +500 coins only after rewardedState becomes "rewarded"
          soundFx.playUpgradeSuccess();
          setHasClaimedAdBonus(true);
          setBonusMessage('+500 COINS ADDED!');
          onRewardBonusCoins?.(500);
        },
        () => {
          setIsAdLoading(false);
        }
      );

      if (!started) {
        setIsAdLoading(false);
        setBonusMessage('Ad unavailable');
        setTimeout(() => setBonusMessage(null), 2000);
      }
    } else {
      setBonusMessage('Ad unavailable');
      setTimeout(() => setBonusMessage(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl p-5 game-panel-border border-4 border-[#07170E] flex flex-col items-center shadow-2xl animate-scaleUp">
        
        {/* Skull / Trophy Badge */}
        <div className="p-3 bg-[#0d2217] rounded-full border-2 border-emerald-500/40 mb-2 shadow-lg">
          {isVictory ? <TrophyIcon size={46} /> : <SpookySkullIcon size={46} />}
        </div>

        {/* Title */}
        <h2
          className={`font-lilita text-3xl tracking-wider stroke-dark-sm drop-shadow ${
            isVictory ? 'text-[#FFE57F]' : 'text-red-400'
          }`}
        >
          {isVictory ? 'VICTORY SURVIVOR!' : 'GAME OVER'}
        </h2>
        <p className="text-xs text-emerald-300 font-fredoka mt-0.5">
          {isVictory ? 'You mastered the graveyard!' : 'Your swords were shattered in battle'}
        </p>

        {/* Stats Card */}
        <div className="w-full my-3 p-3.5 rounded-2xl bg-[#091b11] border border-[#07170e] flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm font-lilita">
            <span className="text-emerald-400">WAVE REACHED:</span>
            <span className="text-yellow-300">WAVE {wave}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-lilita">
            <span className="text-emerald-400">ENEMIES SLAIN:</span>
            <span className="text-emerald-100">{kills}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-lilita">
            <span className="text-emerald-400 flex items-center gap-1">
              <CoinIcon size={16} /> COINS GAINED:
            </span>
            <span className="text-[#FFE57F]">+{coinsEarned}</span>
          </div>
          <div className="pt-2 border-t border-emerald-900/60 flex justify-between items-center text-base font-lilita">
            <span className="text-emerald-300">FINAL SCORE:</span>
            <span className="text-amber-400">{score.toLocaleString()} PTS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
          {/* Small separate Watch Ad +500 Bonus Button */}
          <button
            id="btn-watch-ad-bonus"
            onClick={handleWatchAdBonus}
            disabled={hasClaimedAdBonus || isAdLoading}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-lilita text-sm tracking-wider transition-transform ${
              hasClaimedAdBonus
                ? 'bg-[#062413] border border-emerald-500/60 text-emerald-300 opacity-90 cursor-default'
                : 'bg-gradient-to-r from-[#92400E] via-[#D97706] to-[#B45309] border-2 border-[#FDE047] text-white shadow-[0_3px_10px_rgba(217,119,6,0.35)] hover:brightness-110 active:scale-95 cursor-pointer'
            }`}
          >
            <AdTvIcon size={18} />
            <span>
              {hasClaimedAdBonus
                ? '✓ +500 COINS CLAIMED!'
                : isAdLoading
                ? 'LOADING AD...'
                : bonusMessage || 'WATCH AD +500'}
            </span>
          </button>

          {/* Normal Retry Button - Do NOT require an ad to restart */}
          <button
            id="btn-gameover-retry"
            onClick={handleRetry}
            className="w-full py-3 rounded-2xl play-btn-glow flex items-center justify-center font-lilita text-xl text-white stroke-black-play tracking-wider cursor-pointer active:scale-95 shadow-lg"
          >
            {isVictory ? 'PLAY AGAIN' : 'TRY AGAIN'}
          </button>

          <button
            id="btn-gameover-mainmenu"
            onClick={handleMenu}
            className="w-full py-2.5 rounded-xl bg-[#0d2618] border-2 border-[#091d12] text-emerald-300 hover:text-white font-lilita text-sm tracking-wider cursor-pointer active:scale-95 transition-colors"
          >
            MAIN MENU
          </button>
        </div>

      </div>
    </div>
  );
};

