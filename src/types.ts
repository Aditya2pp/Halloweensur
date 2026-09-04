export interface PlayerStats {
  coins: number;
  healthLevel: number;
  maxHealth: number;
  swordLevel: number;
  swordCount: number;
  swordDamage: number;
  highScore: number;
  totalKills: number;
  wavesCleared: number;
}

export interface UpgradeCost {
  health: number;
  sword: number;
}

export interface FloatingNotification {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'health' | 'sword' | 'coin' | 'warning';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  kills: number;
  wave: number;
  hero: string;
  isPlayer?: boolean;
}

export interface GameSettings {
  sfxVolume: number; // 0 to 1
  musicVolume: number; // 0 to 1
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticFeedback: boolean;
  screenShake: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
}

// ================= GAMEPLAY ENGINE TYPES =================

export type GameSceneState = 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';

export type EnemyType = 
  | 'zombie' 
  | 'stone_zombie'
  | 'ghost' 
  | 'demon' 
  | 'pumpkin' 
  | 'armored' 
  | 'boss_lich' 
  | 'boss_demon' 
  | 'boss_warlord';

export interface Enemy {
  id: string;
  type: EnemyType;
  level: number; // Integer level (1 - 5+)
  swordCost: number; // Swords consumed on kill (= level)
  isDead?: boolean; // Atomic flag to prevent duplicate sword consumption
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  scoreValue: number;
  coinDropChance: number;
  isElite?: boolean;
  isBoss?: boolean;
  hitFlashTimer: number;
  animFrame: number;
  attackCooldown: number;
  name?: string;
}

export type PickupType = 'sword' | 'shield' | 'bomb' | 'lightning_speed' | 'speed_boot' | 'coin';

export interface PickupItem {
  id: string;
  type: PickupType;
  x: number;
  y: number;
  radius: number;
  value: number;
  createdAt: number;
  duration?: number;
  bobOffset: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  size: number;
  lifetime: number;
  maxLifetime: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  type?: 'spark' | 'smoke' | 'blood' | 'magic' | 'bomb_fire';
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  angle: number;
  distanceTraveled: number;
  maxDistance: number;
  isFocusedSlash?: boolean;
  pierceCount: number;
}

export interface WorldObstacle {
  x: number;
  y: number;
  radius: number;
  type: 'gravestone' | 'tree';
  variant: number;
}
