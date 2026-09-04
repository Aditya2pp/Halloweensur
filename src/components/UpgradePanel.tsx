import React from 'react';
import { HeartUpgradeIcon, SwordUpgradeIcon, CoinIcon } from './GameIcons';
import { soundFx } from '../utils/audio';

interface UpgradePanelProps {
  coins: number;
  healthCost: number;
  swordCost: number;
  healthLevel: number;
  swordLevel: number;
  onBuyHealth: () => void;
  onBuySword: () => void;
}

export const UpgradePanel: React.FC<UpgradePanelProps> = ({
  coins,
  healthCost,
  swordCost,
  healthLevel,
  swordLevel,
  onBuyHealth,
  onBuySword,
}) => {
  const canAffordHealth = coins >= healthCost;
  const canAffordSword = coins >= swordCost;

  const handleHealthClick = () => {
    if (canAffordHealth) {
      soundFx.playUpgradeSuccess();
      onBuyHealth();
    } else {
      soundFx.playError();
    }
  };

  const handleSwordClick = () => {
    if (canAffordSword) {
      soundFx.playSwordClang();
      onBuySword();
    } else {
      soundFx.playError();
    }
  };

  return (
    <div className="flex flex-col gap-3.5 select-none z-20">
      {/* BUY HEALTH Upgrade Button */}
      <button
        id="btn-buy-health"
        onClick={handleHealthClick}
        title="Upgrade Max Health"
        className={`group relative w-20 h-22 sm:w-22 sm:h-24 rounded-2xl flex flex-col items-center justify-center p-2 game-panel-border game-panel-interactive cursor-pointer ${
          !canAffordHealth ? 'opacity-75 grayscale-[0.3]' : 'hover:brightness-110'
        }`}
      >
        {/* Level Indicator Tag in Top-Left */}
        <div className="absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-md bg-[#091d12] border border-[#040e08] text-[9px] font-lilita text-emerald-300 shadow">
          L{healthLevel}
        </div>

        {/* Illustrated Heart with Plus Icon */}
        <div className="transition-transform duration-200 group-hover:scale-105">
          <HeartUpgradeIcon size={38} />
        </div>

        {/* Cost Row: Coin + Price */}
        <div className="mt-1 flex items-center justify-center gap-1">
          <CoinIcon size={16} />
          <span
            className={`font-lilita text-sm sm:text-base tracking-wide ${
              canAffordHealth ? 'text-[#FFE875]' : 'text-red-400'
            } stroke-dark-sm drop-shadow`}
          >
            {healthCost}
          </span>
        </div>
      </button>

      {/* BUY SWORD Upgrade Button */}
      <button
        id="btn-buy-sword"
        onClick={handleSwordClick}
        title="Upgrade Sword Arsenal"
        className={`group relative w-20 h-22 sm:w-22 sm:h-24 rounded-2xl flex flex-col items-center justify-center p-2 game-panel-border game-panel-interactive cursor-pointer ${
          !canAffordSword ? 'opacity-75 grayscale-[0.3]' : 'hover:brightness-110'
        }`}
      >
        {/* Level Indicator Tag in Top-Left */}
        <div className="absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-md bg-[#091d12] border border-[#040e08] text-[9px] font-lilita text-emerald-300 shadow">
          L{swordLevel}
        </div>

        {/* Illustrated Sword with Plus Icon */}
        <div className="transition-transform duration-200 group-hover:scale-105">
          <SwordUpgradeIcon size={38} />
        </div>

        {/* Cost Row: Coin + Price */}
        <div className="mt-1 flex items-center justify-center gap-1">
          <CoinIcon size={16} />
          <span
            className={`font-lilita text-sm sm:text-base tracking-wide ${
              canAffordSword ? 'text-[#FFE875]' : 'text-red-400'
            } stroke-dark-sm drop-shadow`}
          >
            {swordCost}
          </span>
        </div>
      </button>
    </div>
  );
};
