import React, { useState, useCallback } from 'react';
import { GameSettings, PlayerStats } from '../types';
import { GameCanvas } from './Gameplay/GameCanvas';
import { GameHUD } from './Gameplay/GameHUD';
import { VirtualJoystick } from './Gameplay/VirtualJoystick';
import { TargetCombatButton } from './Gameplay/TargetCombatButton';
import { GameOverModal } from './Gameplay/GameOverModal';
import { PauseModal } from './Gameplay/PauseModal';
import { savePlayerRecord } from '../utils/leaderboard';

interface GameplaySceneProps {
  stats: PlayerStats;
  settings: GameSettings;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onExitToMenu: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const GameplayScene: React.FC<GameplaySceneProps> = ({
  stats,
  settings,
  onUpdateStats,
  onExitToMenu,
  onToggleSound,
  onToggleMusic,
}) => {
  // Gameplay State
  const [wave, setWave] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [currentSwords, setCurrentSwords] = useState(stats.swordCount);

  // Controls & Skills
  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 });
  const [targetAttackTrigger, setTargetAttackTrigger] = useState(0);
  const [targetCooldownProgress, setTargetCooldownProgress] = useState(1);

  // Buffs
  const [shieldTimeRemaining, setShieldTimeRemaining] = useState(0);
  const [speedBoostTimeRemaining, setSpeedBoostTimeRemaining] = useState(0);

  // Modals
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  // Handle Target Attack Click (Consumes 1 sword per focused slash)
  const handleTargetAttack = useCallback(() => {
    if (targetCooldownProgress < 1 || currentSwords <= 0) return;

    // Consume 1 sword for the powerful focused blade attack
    setCurrentSwords((prev) => Math.max(0, prev - 1));
    setTargetAttackTrigger(Date.now());
    setTargetCooldownProgress(0);

    // 2-second cooldown recharge timer
    const interval = window.setInterval(() => {
      setTargetCooldownProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return Math.min(1, prev + 0.1);
      });
    }, 200);
  }, [currentSwords, targetCooldownProgress]);

  // Handle Coin Pickup
  const handleCoinCollected = useCallback((amount: number) => {
    setSessionCoins((prev) => prev + amount);
    setScore((prev) => prev + amount * 2);
  }, []);

  // Handle Enemy Kill
  const handleEnemyKilled = useCallback((scoreVal: number) => {
    setKills((prev) => prev + 1);
    setScore((prev) => prev + scoreVal);
  }, []);

  // Handle Wave Completion
  const handleWaveComplete = useCallback(() => {
    const waveBonus = wave * 250;
    setScore((prev) => prev + waveBonus);
    setSessionCoins((prev) => prev + 50 + wave * 25);

    // Give player +1 sword as wave clear bonus
    setCurrentSwords((prev) => Math.min(8, prev + 1));

    // Advance to next wave indefinitely for true survival scaling
    setWave((prev) => prev + 1);
  }, [wave]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    setIsGameOver(true);
    savePlayerRecord(kills, wave);
    // Persist stats: Add earned coins, update high score and total kills
    onUpdateStats({
      coins: stats.coins + sessionCoins,
      highScore: Math.max(stats.highScore, score),
      totalKills: Math.max(stats.totalKills || 0, kills),
      wavesCleared: Math.max(stats.wavesCleared, wave - 1),
    });
  }, [onUpdateStats, stats.coins, stats.highScore, stats.totalKills, stats.wavesCleared, sessionCoins, score, kills, wave]);

  // Handle Bonus Coins from Rewarded Ad in GameOver Modal
  const handleRewardBonusCoins = useCallback((amount: number) => {
    setSessionCoins((prev) => prev + amount);
    onUpdateStats({ coins: stats.coins + amount });
  }, [onUpdateStats, stats.coins]);

  // Restart Current Run
  const handleRetry = () => {
    setIsGameOver(false);
    setIsVictory(false);
    setIsPaused(false);
    setWave(1);
    setScore(0);
    setKills(0);
    setSessionCoins(0);
    setCurrentSwords(stats.swordCount);
    setShieldTimeRemaining(0);
    setSpeedBoostTimeRemaining(0);
  };

  // Return to Main Menu
  const handleMainMenu = () => {
    savePlayerRecord(kills, wave);
    onUpdateStats({
      coins: stats.coins + sessionCoins,
      highScore: Math.max(stats.highScore, score),
      totalKills: Math.max(stats.totalKills || 0, kills),
      wavesCleared: Math.max(stats.wavesCleared, wave - 1),
    });
    onExitToMenu();
  };

  return (
    <main className="relative w-full h-full overflow-hidden bg-[#07190F] select-none touch-none">
      {/* 1. Fast 60 FPS HTML5 Canvas Game Engine */}
      <GameCanvas
        wave={wave}
        swordCount={currentSwords}
        swordDamage={stats.swordDamage}
        settings={settings}
        joystickVector={joystickVector}
        onSwordCountChange={setCurrentSwords}
        onCoinCollected={handleCoinCollected}
        onEnemyKilled={handleEnemyKilled}
        onTimeUpdate={setTimeRemaining}
        onWaveComplete={handleWaveComplete}
        onGameOver={handleGameOver}
        isPaused={isPaused || isGameOver}
        shieldTimeRemaining={shieldTimeRemaining}
        setShieldTimeRemaining={setShieldTimeRemaining}
        speedBoostTimeRemaining={speedBoostTimeRemaining}
        setSpeedBoostTimeRemaining={setSpeedBoostTimeRemaining}
        targetAttackTrigger={targetAttackTrigger}
      />

      {/* 2. Top Game HUD (Wave, Countdown, Kills, Coins, Pause) */}
      <GameHUD
        wave={wave}
        timeRemaining={timeRemaining}
        score={score}
        kills={kills}
        coins={sessionCoins + stats.coins}
        swordCount={currentSwords}
        shieldTimeRemaining={shieldTimeRemaining}
        speedBoostTimeRemaining={speedBoostTimeRemaining}
        onPause={() => setIsPaused(true)}
      />

      {/* 3. Bottom Controls (Joystick on bottom-left, Target Combat Attack Button on bottom-right) */}
      <footer className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none flex items-end justify-between select-none">
        {/* Virtual Joystick */}
        <div className="pointer-events-auto">
          <VirtualJoystick onMove={setJoystickVector} />
        </div>

        {/* Target Combat Attack Button */}
        <div className="pointer-events-auto mb-1">
          <TargetCombatButton
            onAttack={handleTargetAttack}
            cooldownProgress={targetCooldownProgress}
            swordCount={currentSwords}
          />
        </div>
      </footer>

      {/* 4. Modals */}
      <PauseModal
        isOpen={isPaused && !isGameOver}
        onResume={() => setIsPaused(false)}
        onRestart={handleRetry}
        onQuit={handleMainMenu}
        soundEnabled={settings.soundEnabled}
        musicEnabled={settings.musicEnabled}
        onToggleSound={onToggleSound}
        onToggleMusic={onToggleMusic}
      />

      <GameOverModal
        isOpen={isGameOver}
        isVictory={isVictory}
        wave={wave}
        score={score}
        kills={kills}
        coinsEarned={sessionCoins}
        onRetry={handleRetry}
        onMainMenu={handleMainMenu}
        onRewardBonusCoins={handleRewardBonusCoins}
      />
    </main>
  );
};
