import React from 'react';
import { SettingsCogIcon } from '../GameIcons';
import { soundFx } from '../../utils/audio';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onResume,
  onRestart,
  onQuit,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl p-5 game-panel-border border-4 border-[#07170E] flex flex-col items-center shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <SettingsCogIcon size={28} />
          <h2 className="font-lilita text-3xl text-[#FFE57F] tracking-wider stroke-dark-sm drop-shadow">
            GAME PAUSED
          </h2>
        </div>

        {/* Audio Quick Toggles */}
        <div className="w-full my-3 flex flex-col gap-2 p-3 rounded-2xl bg-[#091b11] border border-[#07170e]">
          <div className="flex justify-between items-center">
            <span className="font-lilita text-xs text-emerald-200">SOUND EFFECTS</span>
            <button
              id="btn-pause-toggle-sfx"
              onClick={onToggleSound}
              className={`w-12 h-7 rounded-full p-0.5 border transition-colors flex items-center ${
                soundEnabled ? 'bg-emerald-600 border-emerald-400 justify-end' : 'bg-stone-800 border-stone-700 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-lilita text-xs text-emerald-200">AMBIENT MUSIC</span>
            <button
              id="btn-pause-toggle-music"
              onClick={onToggleMusic}
              className={`w-12 h-7 rounded-full p-0.5 border transition-colors flex items-center ${
                musicEnabled ? 'bg-emerald-600 border-emerald-400 justify-end' : 'bg-stone-800 border-stone-700 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            id="btn-pause-resume"
            onClick={() => {
              soundFx.playClick();
              onResume();
            }}
            className="w-full py-3.5 rounded-2xl play-btn-glow flex items-center justify-center font-lilita text-xl text-white stroke-black-play tracking-wider cursor-pointer active:scale-95 shadow-lg"
          >
            RESUME
          </button>

          <button
            id="btn-pause-restart"
            onClick={() => {
              soundFx.playBattleStart();
              onRestart();
            }}
            className="w-full py-2.5 rounded-xl bg-[#0d2618] border-2 border-[#091d12] text-emerald-200 font-lilita text-sm tracking-wider cursor-pointer active:scale-95 hover:text-white"
          >
            RESTART WAVE
          </button>

          <button
            id="btn-pause-quit"
            onClick={() => {
              soundFx.playClick();
              onQuit();
            }}
            className="w-full py-2.5 rounded-xl bg-red-950/50 border-2 border-red-900/60 text-red-300 font-lilita text-sm tracking-wider cursor-pointer active:scale-95 hover:text-white"
          >
            QUIT TO MENU
          </button>
        </div>

      </div>
    </div>
  );
};
