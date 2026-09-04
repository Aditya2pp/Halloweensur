import { Enemy, EnemyType } from '../types';

export interface WaveConfig {
  wave: number;
  duration: number; // in seconds
  spawnInterval: number; // in seconds
  maxEnemies: number;
  levelWeights: { level: number; weight: number }[];
  enemyTypeWeights: { type: EnemyType; weight: number }[];
  eliteChance: number;
  bossType?: EnemyType;
  bossLevel?: number;
}

export function getWaveConfig(wave: number): WaveConfig {
  // Wave duration starts at 45s, scales up to 80s gradually
  const duration = 45 + Math.min(35, (wave - 1) * 4);

  // Spawn interval decreases from 1.8s down to 0.45s for dense action
  const spawnInterval = Math.max(0.45, 1.8 - Math.min(1.35, (wave - 1) * 0.09));

  // Max simultaneous enemies on screen
  const maxEnemies = Math.min(90, 30 + wave * 5);

  // Elite spawn probability
  const eliteChance = Math.min(0.35, 0.05 + wave * 0.025);

  // Dynamic Level Weights based on wave
  // Wave 1: 100% Lv.1
  // Wave 2: 70% Lv.1, 30% Lv.2
  // Wave 3: 45% Lv.1, 40% Lv.2, 15% Lv.3
  // Wave 4: 25% Lv.1, 45% Lv.2, 25% Lv.3, 5% Lv.4
  // Wave 5+: Higher levels dominate
  const levelWeights: { level: number; weight: number }[] = [];

  if (wave === 1) {
    levelWeights.push({ level: 1, weight: 100 });
  } else if (wave === 2) {
    levelWeights.push({ level: 1, weight: 70 }, { level: 2, weight: 30 });
  } else if (wave === 3) {
    levelWeights.push({ level: 1, weight: 45 }, { level: 2, weight: 40 }, { level: 3, weight: 15 });
  } else if (wave === 4) {
    levelWeights.push({ level: 1, weight: 25 }, { level: 2, weight: 45 }, { level: 3, weight: 25 }, { level: 4, weight: 5 });
  } else if (wave === 5) {
    levelWeights.push({ level: 1, weight: 15 }, { level: 2, weight: 35 }, { level: 3, weight: 35 }, { level: 4, weight: 15 });
  } else {
    // Wave 6 and beyond: scalable dynamic distribution
    const minLevel = Math.min(5, Math.floor(1 + (wave - 1) * 0.4));
    const maxLevel = Math.min(10, Math.floor(2 + (wave - 1) * 0.6));
    for (let lvl = minLevel; lvl <= maxLevel; lvl++) {
      const distFromCenter = Math.abs(lvl - (minLevel + maxLevel) / 2);
      const weight = Math.max(10, 50 - distFromCenter * 15);
      levelWeights.push({ level: lvl, weight });
    }
  }

  // Enemy Type Weights
  const enemyTypeWeights: { type: EnemyType; weight: number }[] = [
    { type: 'zombie', weight: Math.max(15, 50 - wave * 3) },
    { type: 'stone_zombie', weight: wave >= 1 ? Math.min(26, 12 + wave * 2) : 10 },
    { type: 'ghost', weight: Math.min(25, 15 + wave * 2) },
    { type: 'demon', weight: wave >= 2 ? Math.min(25, 12 + wave * 2) : 0 },
    { type: 'pumpkin', weight: wave >= 3 ? Math.min(22, 10 + wave * 1.8) : 0 },
    { type: 'armored', weight: wave >= 4 ? Math.min(22, 5 + wave * 2) : 0 },
  ];

  // Boss detection on milestone waves (every 5 waves: 5, 10, 15, 20...)
  let bossType: EnemyType | undefined;
  let bossLevel: number | undefined;

  if (wave % 5 === 0) {
    const bossIndex = Math.floor(wave / 5) % 3;
    bossType = bossIndex === 1 ? 'boss_lich' : bossIndex === 2 ? 'boss_demon' : 'boss_warlord';
    bossLevel = Math.min(10, Math.floor(2 + wave * 0.4));
  }

  return {
    wave,
    duration,
    spawnInterval,
    maxEnemies,
    levelWeights,
    enemyTypeWeights,
    eliteChance,
    bossType,
    bossLevel,
  };
}

export function pickWeightedLevel(weights: { level: number; weight: number }[]): number {
  const totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const item of weights) {
    if (roll < item.weight) return item.level;
    roll -= item.weight;
  }
  return weights[0]?.level || 1;
}

export function pickWeightedEnemyType(weights: { type: EnemyType; weight: number }[]): EnemyType {
  const active = weights.filter((w) => w.weight > 0);
  const totalWeight = active.reduce((acc, curr) => acc + curr.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const item of active) {
    if (roll < item.weight) return item.type;
    roll -= item.weight;
  }
  return 'zombie';
}

export interface EnemyStatsParams {
  type: EnemyType;
  level: number;
  wave: number;
  isElite?: boolean;
  isBoss?: boolean;
}

export function calculateEnemyStats(params: EnemyStatsParams) {
  const { type, level, wave, isElite, isBoss } = params;

  // Base stats per type
  let baseHp = 30;
  let baseSpeed = 95;
  let baseRadius = 22;
  let baseScore = 40;
  let baseDamage = 1;
  let coinChance = 0.4;
  let name = 'Zombie';

  switch (type) {
    case 'stone_zombie':
      baseHp = 80;
      baseSpeed = 74;
      baseRadius = 24;
      baseScore = 80;
      baseDamage = 2;
      coinChance = 0.6;
      name = 'Stone Zombie';
      break;
    case 'ghost':
      baseHp = 22;
      baseSpeed = 145;
      baseRadius = 18;
      baseScore = 50;
      baseDamage = 1;
      coinChance = 0.45;
      name = 'Ghost';
      break;
    case 'demon':
      baseHp = 42;
      baseSpeed = 120;
      baseRadius = 20;
      baseScore = 65;
      baseDamage = 1;
      coinChance = 0.5;
      name = 'Demon';
      break;
    case 'pumpkin':
      baseHp = 65;
      baseSpeed = 82;
      baseRadius = 24;
      baseScore = 80;
      baseDamage = 1;
      coinChance = 0.55;
      name = 'Pumpkin';
      break;
    case 'armored':
      baseHp = 130;
      baseSpeed = 72;
      baseRadius = 28;
      baseScore = 120;
      baseDamage = 2;
      coinChance = 0.65;
      name = 'Elite Knight';
      break;
    case 'boss_lich':
      baseHp = 650;
      baseSpeed = 65;
      baseRadius = 44;
      baseScore = 1500;
      baseDamage = 3;
      coinChance = 1.0;
      name = 'Lich Lord';
      break;
    case 'boss_demon':
      baseHp = 800;
      baseSpeed = 75;
      baseRadius = 46;
      baseScore = 2000;
      baseDamage = 3;
      coinChance = 1.0;
      name = 'Demon Overlord';
      break;
    case 'boss_warlord':
      baseHp = 1000;
      baseSpeed = 60;
      baseRadius = 48;
      baseScore = 2500;
      baseDamage = 4;
      coinChance = 1.0;
      name = 'Dread Warlord';
      break;
  }

  // Level and Wave Scaling Multipliers
  const waveHpMult = 1 + (wave - 1) * 0.18;
  const levelHpMult = 1 + (level - 1) * 0.35;
  const levelSpeedMult = 1 + Math.min(0.4, (level - 1) * 0.04);

  let hp = Math.round(baseHp * waveHpMult * levelHpMult);
  let speed = Math.round(baseSpeed * levelSpeedMult * (0.95 + Math.random() * 0.1));
  let radius = baseRadius;
  let score = Math.round((baseScore + (level - 1) * 30) * (isElite ? 2.5 : 1));

  if (isElite) {
    hp = Math.round(hp * 2.2);
    radius = Math.round(radius * 1.25);
    speed = Math.round(speed * 1.08);
    coinChance = 0.85;
    name = `Elite ${name}`;
  }

  if (isBoss) {
    hp = Math.round(baseHp * (1 + (wave - 1) * 0.3) * (1 + (level - 1) * 0.5));
    name = `BOSS: ${name}`;
  }

  return {
    hp,
    maxHp: hp,
    speed,
    radius,
    damage: baseDamage,
    scoreValue: score,
    coinDropChance: coinChance,
    name,
    swordCost: Math.max(1, level), // Sword cost is equal to enemy level
  };
}
