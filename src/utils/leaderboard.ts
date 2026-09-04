import { LeaderboardEntry } from '../types';

const STORAGE_KEY = 'halloween_survivor_daily_board_v1';

// Preset pool of themed competitors
const BOT_NAMES = [
  { name: 'NightReaper', hero: 'Chibi Lich', baseKills: 380, rate: 32 },
  { name: 'SpookyBonez', hero: 'Skeleton King', baseKills: 310, rate: 26 },
  { name: 'GhostBlade', hero: 'Phantom Knight', baseKills: 240, rate: 21 },
  { name: 'BatWhisperer', hero: 'Vampire Chibi', baseKills: 175, rate: 16 },
  { name: 'DemonHunter', hero: 'Dread Rogue', baseKills: 130, rate: 12 },
  { name: 'SoulSeeker', hero: 'Shadow Mage', baseKills: 95, rate: 9 },
  { name: 'CryptStalker', hero: 'Bone Archer', baseKills: 65, rate: 7 },
  { name: 'GraveDigger', hero: 'Ghoul Master', baseKills: 45, rate: 5 },
];

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getHoursPassedToday(): number {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}

export function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

interface StoredLeaderboardData {
  dateKey: string;
  playerKills: number;
  playerWave: number;
  entries: {
    id: string;
    name: string;
    hero: string;
    baseKills: number;
    rate: number;
    wave: number;
  }[];
}

function initializeDailyData(): StoredLeaderboardData {
  const dateKey = getTodayKey();
  const entries = BOT_NAMES.map((bot, idx) => ({
    id: `bot-${idx}`,
    name: bot.name,
    hero: bot.hero,
    baseKills: bot.baseKills + Math.floor(Math.random() * 30),
    rate: bot.rate + Math.floor(Math.random() * 6),
    wave: Math.max(1, Math.floor(bot.baseKills / 25)),
  }));

  const data: StoredLeaderboardData = {
    dateKey,
    playerKills: 0,
    playerWave: 1,
    entries,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }

  return data;
}

export function getDailyLeaderboard(): { entries: LeaderboardEntry[]; playerBestKills: number } {
  let data: StoredLeaderboardData;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      data = JSON.parse(raw);
      // Reset if date changed (Daily Reset)
      if (data.dateKey !== getTodayKey()) {
        data = initializeDailyData();
      }
    } else {
      data = initializeDailyData();
    }
  } catch {
    data = initializeDailyData();
  }

  const hoursPassed = getHoursPassedToday();

  // Compute live updated kills for bot entries based on elapsed hours
  const liveBots: LeaderboardEntry[] = data.entries.map((b) => {
    const totalKills = Math.floor(b.baseKills + hoursPassed * b.rate);
    const wave = Math.max(b.wave, Math.floor(totalKills / 28) + 1);
    return {
      rank: 0,
      name: b.name,
      hero: b.hero,
      kills: totalKills,
      wave,
      isPlayer: false,
    };
  });

  // Add player entry if player has recorded kills today
  const playerEntry: LeaderboardEntry = {
    rank: 0,
    name: 'You (Skeleton)',
    hero: 'Chibi Skeleton',
    kills: data.playerKills,
    wave: data.playerWave || 1,
    isPlayer: true,
  };

  const combined = [...liveBots, playerEntry];

  // Sort strictly by KILLS descending
  combined.sort((a, b) => b.kills - a.kills);

  // Assign ranks
  const ranked = combined.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  return {
    entries: ranked,
    playerBestKills: data.playerKills,
  };
}

export function savePlayerRecord(kills: number, wave: number): void {
  try {
    let data: StoredLeaderboardData;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      data = JSON.parse(raw);
      if (data.dateKey !== getTodayKey()) {
        data = initializeDailyData();
      }
    } else {
      data = initializeDailyData();
    }

    if (kills > data.playerKills) {
      data.playerKills = kills;
      data.playerWave = Math.max(data.playerWave, wave);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Save error:', e);
  }
}
