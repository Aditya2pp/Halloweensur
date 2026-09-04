import React, { useState } from 'react';
import { soundFx } from '../../utils/audio';
import { RubySwordIcon } from '../GameIcons';

interface TargetCombatButtonProps {
  onAttack: () => void;
  cooldownProgress: number; // 0 to 1 (1 = fully ready)
  swordCount: number;
  className?: string;
}

export const TargetCombatButton: React.FC<TargetCombatButtonProps> = ({
  onAttack,
  cooldownProgress,
  swordCount,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const canUse = cooldownProgress >= 0.99 && swordCount > 0;

  const handlePress = () => {
    if (!canUse) {
      if (swordCount <= 0) {
        soundFx.playError();
      }
      return;
    }
    setIsPressed(true);
    soundFx.playFocusedAttack();
    onAttack();
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <div className={`relative select-none touch-none flex flex-col items-center ${className}`}>
      {/* Outer Glow Aura when ready */}
      {canUse && (
        <div className="absolute inset-0 bg-red-500/35 rounded-full blur-lg animate-pulse pointer-events-none" />
      )}

      {/* Target Button matching reference artwork */}
      <button
        id="btn-gameplay-target-attack"
        onClick={handlePress}
        disabled={!canUse}
        title="Focused Sword Slash (Consumes 1 Sword)"
        className={`relative w-22 h-22 sm:w-26 sm:h-26 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-100 ${
          isPressed ? 'scale-90 translate-y-1' : 'active:scale-95'
        } ${!canUse ? 'opacity-65 grayscale-[0.4]' : 'hover:brightness-110'}`}
        style={{
          background: 'radial-gradient(circle at 35% 35%, #EF4444 0%, #DC2626 50%, #7F1D1D 100%)',
          border: '4px solid #350A0A',
          boxShadow:
            '0 6px 18px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.6)',
        }}
      >
        {/* White Target Rings (Bullseye) */}
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-white flex items-center justify-center shadow-inner pointer-events-none">
          {/* Inner Red Ring */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-4 border-[#DC2626] bg-white flex items-center justify-center">
            {/* Center Red Bullseye Dot with Ruby Sword Vector */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#B91C1C] flex items-center justify-center overflow-hidden">
              <div className="scale-75 -rotate-45">
                <RubySwordIcon size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Cooldown Overlay Sweep */}
        {cooldownProgress < 0.99 && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 pointer-events-none">
            <span className="font-lilita text-white text-xs drop-shadow">
              {Math.ceil((1 - cooldownProgress) * 2)}s
            </span>
          </div>
        )}

        {/* No Swords indicator */}
        {swordCount <= 0 && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 pointer-events-none">
            <span className="font-lilita text-red-300 text-[10px] sm:text-xs text-center px-1 leading-tight drop-shadow">
              NO SWORD
            </span>
          </div>
        )}
      </button>

      {/* Sword Ammo Badge */}
      <div className="absolute -top-2.5 z-20 px-2 py-0.5 rounded-full bg-[#110505] border-2 border-[#EF4444] shadow-md flex items-center gap-1">
        <RubySwordIcon size={14} />
        <span className="font-lilita text-[11px] text-white tracking-wider">
          -1 SWORD
        </span>
      </div>
    </div>
  );
};
