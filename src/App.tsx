import React, { useState, useEffect } from 'react';
import hauntedMenuBg from './assets/images/haunted_menu_bg_1788284407811.jpg';
import { CoinIcon, SettingsCogIcon, TrophyIcon, AdTvIcon } from './components/GameIcons';
import { TitleBanner } from './components/TitleBanner';
import { ChibiHeroStage } from './components/ChibiHeroStage';
import { UpgradePanel } from './components/UpgradePanel';
import { PlayButton } from './components/PlayButton';
import { RankingModal } from './components/RankingModal';
import { SettingsModal } from './components/SettingsModal';
import { ParticleEffect } from './components/ParticleEffect';
import { GameplayScene } from './components/GameplayScene';
import { PlayerStats, UpgradeCost, FloatingNotification, LeaderboardEntry, GameSettings } from './types';
import { soundFx } from './utils/audio';
import { getDailyLeaderboard } from './utils/leaderboard';
import {
  initPlaygamaBridge,
  showPlayInterstitial,
  isRewardedSupported,
  showRewardedAd,
} from './utils/playgamaBridge';

export default function App() {
  // Initialize official Playgama Bridge SDK on mount
  useEffect(() => {
    initPlaygamaBridge();
  }, []);

  // Current active scene: 'menu' | 'gameplay'
  const [scene, setScene] = useState<'menu' | 'gameplay'>('menu');

  // Game Player State (Initial matching reference image: 1250 Coins, 500 upgrade costs)
  const [stats, setStats] = useState<PlayerStats>({
    coins: 1250,
    healthLevel: 1,
    maxHealth: 100,
    swordLevel: 1,
    swordCount: 3, // 3 initial orbiting swords matching chibi survivor style
    swordDamage: 30,
    highScore: 4850,
    totalKills: 0,
    wavesCleared: 3,
  });

  const [costs, setCosts] = useState<UpgradeCost>({
    health: 500,
    sword: 500,
  });

  const [notifications, setNotifications] = useState<FloatingNotification[]>([]);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<{ entries: LeaderboardEntry[]; playerBestKills: number }>(() => getDailyLeaderboard());

  const [settings, setSettings] = useState<GameSettings>({
    sfxVolume: 0.8,
    musicVolume: 0.5,
    soundEnabled: true,
    musicEnabled: true,
    hapticFeedback: true,
    screenShake: true,
    graphicsQuality: 'high',
  });

  // Helper to trigger floating text animation
  const addNotification = (text: string, type: FloatingNotification['type'], x: number, y: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, text, type, x, y }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 1200);
  };

  // Upgrades
  const handleBuyHealth = () => {
    if (stats.coins < costs.health) return;

    setStats((prev) => ({
      ...prev,
      coins: prev.coins - costs.health,
      healthLevel: prev.healthLevel + 1,
      maxHealth: prev.maxHealth + 50,
    }));

    setCosts((prev) => ({
      ...prev,
      health: prev.health + 250,
    }));

    addNotification('+50 MAX HP!', 'health', 25, 45);
  };

  const handleBuySword = () => {
    if (stats.coins < costs.sword) return;

    setStats((prev) => ({
      ...prev,
      coins: prev.coins - costs.sword,
      swordLevel: prev.swordLevel + 1,
      swordCount: Math.min(prev.swordCount + 1, 8),
      swordDamage: prev.swordDamage + 15,
    }));

    setCosts((prev) => ({
      ...prev,
      sword: prev.sword + 250,
    }));

    addNotification('+1 SWORD ORBIT!', 'sword', 25, 58);
  };

  // Rewarded Ad for Main Menu Coins Bar (+500 Coins)
  const handleCoinsBarClick = () => {
    soundFx.playClick();

    if (isRewardedSupported()) {
      const started = showRewardedAd(
        'coins',
        () => {
          // Give +500 coins ONLY when rewardedState === "rewarded"
          soundFx.playUpgradeSuccess();
          setStats((prev) => ({ ...prev, coins: prev.coins + 500 }));
          addNotification('+500 COINS!', 'coin', 20, 10);
        },
        () => {
          // Ad closed or failed without reward -> 0 coins
        }
      );

      if (!started) {
        addNotification('Ad unavailable', 'coin', 20, 10);
      }
    } else {
      // If ad is not supported or ready, continue normally without blocking
      addNotification('Ad unavailable', 'coin', 20, 10);
    }
  };

  // Ranking Button Click
  const handleOpenRanking = () => {
    soundFx.playClick();
    setLeaderboardData(getDailyLeaderboard());
    setIsRankingOpen(true);
  };

  // Settings Button Click
  const handleOpenSettings = () => {
    soundFx.playClick();
    setIsSettingsOpen(true);
  };

  // Play Button Click -> Check Interstitial, show if allowed, then start game immediately
  const handlePlayClick = () => {
    soundFx.playBattleStart();
    showPlayInterstitial(() => {
      setScene('gameplay');
    });
  };

  const handleUpdateStats = (newVals: Partial<PlayerStats>) => {
    setStats((prev) => ({ ...prev, ...newVals }));
  };

  const handleToggleSound = () => {
    setSettings((prev) => {
      const next = !prev.soundEnabled;
      soundFx.setMuted(!next);
      return { ...prev, soundEnabled: next };
    });
  };

  const handleToggleMusic = () => {
    setSettings((prev) => {
      const next = !prev.musicEnabled;
      soundFx.setMusicMuted(!next);
      return { ...prev, musicEnabled: next };
    });
  };

  return (
    <div className="relative w-screen h-screen min-h-[100dvh] bg-[#030905] flex items-center justify-center overflow-hidden font-fredoka select-none">
      
      {/* Mobile Screen Container (Matching 9:19.5 smartphone vertical layout) */}
      <div className="relative w-full max-w-[440px] h-full max-h-[920px] aspect-[9/19.5] sm:rounded-[36px] overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] border-0 sm:border-[5px] border-[#06140c]">
        
        {scene === 'gameplay' ? (
          /* ================= ACTIVE GAMEPLAY SCENE ================= */
          <GameplayScene
            stats={stats}
            settings={settings}
            onUpdateStats={handleUpdateStats}
            onExitToMenu={() => setScene('menu')}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
          />
        ) : (
          /* ================= MAIN MENU / DASHBOARD ================= */
          <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-5">
            
            {/* Background Layer: Haunted Emerald Forest, Castle, Moon, and Pumpkins */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src={hauntedMenuBg}
                alt="Haunted Halloween Environment"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-[1.02]"
              />

              {/* Dark Green Gradient Vignette & Atmospheric Fog Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#041009]/90 via-transparent to-[#041009]/70" />
              <div className="absolute inset-0 bg-emerald-950/20 mix-blend-color" />
              
              {/* Animated Fog Wisps */}
              <div className="absolute bottom-10 -left-10 w-96 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-fog-drift" />
              <div className="absolute top-40 -right-10 w-80 h-36 bg-emerald-400/10 rounded-full blur-3xl animate-fog-drift" />
            </div>

            {/* Ambient Spooky Particles & Floating Popups */}
            <ParticleEffect notifications={notifications} />

            {/* ================= TOP HEADER BAR ================= */}
            <header className="relative z-20 w-full flex items-center justify-between pt-1">
              {/* Top-Left: Custom Coin Pill with tiny original 2D TV/ad icon in the corner */}
              <div
                id="coin-display-pill"
                onClick={handleCoinsBarClick}
                title="Watch Ad for +500 Coins"
                className="relative group flex items-center gap-2 pl-1.5 pr-4 py-1 rounded-full game-pill cursor-pointer transition-transform active:scale-95 hover:brightness-110"
              >
                <div className="transition-transform group-hover:rotate-12">
                  <CoinIcon size={30} />
                </div>
                <span
                  className="font-lilita text-lg sm:text-xl tracking-wider text-[#FFFFFF] stroke-dark-sm drop-shadow"
                  style={{
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.8))'
                  }}
                >
                  {stats.coins.toLocaleString()}
                </span>

                {/* Tiny ORIGINAL 2D TV/ad icon in the corner of the Coins Bar */}
                <div
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center p-0.5 rounded-md bg-[#180802] border border-[#F59E0B] shadow-[0_2px_6px_rgba(0,0,0,0.85)] transition-transform group-hover:scale-110"
                  title="Watch Ad for +500 Coins"
                >
                  <AdTvIcon size={16} />
                </div>
              </div>

              {/* Top-Right: Settings Button (Matching Reference) */}
              <button
                id="btn-open-settings"
                onClick={handleOpenSettings}
                title="Settings"
                className="w-11 h-11 rounded-2xl flex items-center justify-center game-panel-border game-panel-interactive cursor-pointer hover:brightness-110"
              >
                <SettingsCogIcon size={24} />
              </button>
            </header>

            {/* ================= TITLE BANNER ================= */}
            <div className="relative z-20 w-full flex flex-col items-center mt-0">
              <TitleBanner />
            </div>

            {/* ================= MAIN CENTER: HERO & UPGRADES ================= */}
            <div className="relative z-20 w-full flex-1 flex items-center justify-between px-1">
              
              {/* Left-Middle: Upgrade Buttons (Buy Health & Buy Sword) */}
              <div className="flex flex-col justify-center">
                <UpgradePanel
                  coins={stats.coins}
                  healthCost={costs.health}
                  swordCost={costs.sword}
                  healthLevel={stats.healthLevel}
                  swordLevel={stats.swordLevel}
                  onBuyHealth={handleBuyHealth}
                  onBuySword={handleBuySword}
                />
              </div>

              {/* Center: Chibi Skeleton Hero Stage with Orbiting Swords */}
              <div className="flex-1 flex justify-center items-center">
                <ChibiHeroStage
                  swordCount={stats.swordCount}
                  healthLevel={stats.healthLevel}
                  swordLevel={stats.swordLevel}
                />
              </div>

              {/* Empty spacer on right for balance */}
              <div className="w-16 hidden sm:block pointer-events-none" />
            </div>

            {/* ================= BOTTOM AREA: PLAY & RANKING ================= */}
            <footer className="relative z-20 w-full flex flex-col items-center pb-2">
              
              {/* Main Dominant PLAY Button */}
              <div className="w-full flex justify-center">
                <PlayButton onPlay={handlePlayClick} />
              </div>

              {/* Bottom Row: Compact Ranking Button (Positioned at Bottom-Right matching reference) */}
              <div className="w-full flex justify-end items-center mt-2 pr-1">
                <button
                  id="btn-open-ranking"
                  onClick={handleOpenRanking}
                  title="Graveyard Leaderboard"
                  className="group flex flex-col items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-1.5 game-panel-border game-panel-interactive cursor-pointer hover:brightness-110"
                >
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    <TrophyIcon size={30} />
                  </div>
                  <span className="mt-0.5 text-[11px] font-lilita tracking-widest text-[#E2F7D8] uppercase stroke-dark-sm">
                    RANKING
                  </span>
                </button>
              </div>

            </footer>

            {/* Modals for Menu */}
            <RankingModal
              isOpen={isRankingOpen}
              onClose={() => setIsRankingOpen(false)}
              entries={leaderboardData.entries}
              playerKills={stats.totalKills || leaderboardData.playerBestKills}
            />

            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              settings={settings}
              onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
            />

          </div>
        )}

      </div>
    </div>
  );
}
