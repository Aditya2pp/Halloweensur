import React from 'react';
import { SettingsCogIcon } from './GameIcons';
import { GameSettings } from '../types';
import { soundFx } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    soundFx.playClick();
    onClose();
  };

  const toggleSound = () => {
    soundFx.playClick();
    const newVal = !settings.soundEnabled;
    soundFx.setMuted(!newVal);
    onUpdateSettings({ soundEnabled: newVal });
  };

  const toggleMusic = () => {
    soundFx.playClick();
    const newVal = !settings.musicEnabled;
    soundFx.setMusicMuted(!newVal);
    onUpdateSettings({ musicEnabled: newVal });
  };

  const toggleScreenShake = () => {
    soundFx.playClick();
    onUpdateSettings({ screenShake: !settings.screenShake });
  };

  const toggleHaptics = () => {
    soundFx.playClick();
    onUpdateSettings({ hapticFeedback: !settings.hapticFeedback });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      {/* Modal Card */}
      <div className="relative w-full max-w-sm rounded-3xl p-5 game-panel-border border-4 border-[#07170E] flex flex-col shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/60">
          <div className="flex items-center gap-2.5">
            <SettingsCogIcon size={30} />
            <div>
              <h2 className="font-lilita text-2xl text-[#FFE57F] tracking-wide stroke-dark-sm drop-shadow">
                SETTINGS
              </h2>
              <p className="text-xs text-emerald-400 font-fredoka">Game Audio & Graphics</p>
            </div>
          </div>

          <button
            id="btn-close-settings"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#0a1f13] border-2 border-[#040f09] flex items-center justify-center text-emerald-300 font-lilita text-lg hover:bg-emerald-950 active:scale-90 cursor-pointer shadow"
          >
            ✕
          </button>
        </div>

        {/* Setting Toggles */}
        <div className="my-4 flex flex-col gap-3">
          
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#091b11] border border-[#07170e]">
            <div>
              <div className="font-lilita text-sm text-emerald-100 tracking-wide">SOUND EFFECTS</div>
              <div className="text-[11px] text-emerald-500 font-fredoka">Sword slashes, clicks, upgrades</div>
            </div>
            <button
              id="btn-toggle-sfx"
              onClick={toggleSound}
              className={`w-14 h-8 rounded-full p-1 border-2 transition-colors cursor-pointer flex items-center ${
                settings.soundEnabled
                  ? 'bg-emerald-600 border-emerald-400 justify-end'
                  : 'bg-stone-800 border-stone-700 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Music Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#091b11] border border-[#07170e]">
            <div>
              <div className="font-lilita text-sm text-emerald-100 tracking-wide">AMBIENT MUSIC</div>
              <div className="text-[11px] text-emerald-500 font-fredoka">Spooky background atmosphere</div>
            </div>
            <button
              id="btn-toggle-music"
              onClick={toggleMusic}
              className={`w-14 h-8 rounded-full p-1 border-2 transition-colors cursor-pointer flex items-center ${
                settings.musicEnabled
                  ? 'bg-emerald-600 border-emerald-400 justify-end'
                  : 'bg-stone-800 border-stone-700 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Screen Shake Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#091b11] border border-[#07170e]">
            <div>
              <div className="font-lilita text-sm text-emerald-100 tracking-wide">SCREEN SHAKE</div>
              <div className="text-[11px] text-emerald-500 font-fredoka">Impact FX on hits & explosions</div>
            </div>
            <button
              id="btn-toggle-shake"
              onClick={toggleScreenShake}
              className={`w-14 h-8 rounded-full p-1 border-2 transition-colors cursor-pointer flex items-center ${
                settings.screenShake
                  ? 'bg-emerald-600 border-emerald-400 justify-end'
                  : 'bg-stone-800 border-stone-700 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#091b11] border border-[#07170e]">
            <div>
              <div className="font-lilita text-sm text-emerald-100 tracking-wide">VIBRATION</div>
              <div className="text-[11px] text-emerald-500 font-fredoka">Mobile haptic pulse</div>
            </div>
            <button
              id="btn-toggle-haptics"
              onClick={toggleHaptics}
              className={`w-14 h-8 rounded-full p-1 border-2 transition-colors cursor-pointer flex items-center ${
                settings.hapticFeedback
                  ? 'bg-emerald-600 border-emerald-400 justify-end'
                  : 'bg-stone-800 border-stone-700 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Download Playgama Ready Build ZIP */}
          <a
            id="link-download-playgama-zip"
            href="./playgama-ready.zip"
            download="playgama-ready.zip"
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 border-2 border-yellow-300 text-white font-lilita text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_3px_10px_rgba(217,119,6,0.35)] hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <span>📦 DOWNLOAD PLAYGAMA WEB ZIP</span>
          </a>

        </div>

        {/* Footer info & OK button */}
        <div className="pt-2 flex items-center justify-between border-t border-emerald-900/60">
          <span className="text-[11px] font-fredoka text-emerald-600">v1.0.4 • Halloween Edition</span>
          <button
            id="btn-settings-save"
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-b from-emerald-600 to-emerald-800 text-white font-lilita text-sm tracking-wider border border-emerald-400 active:scale-95 shadow cursor-pointer"
          >
            SAVE
          </button>
        </div>

      </div>
    </div>
  );
};
