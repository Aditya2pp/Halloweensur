import React, { useRef, useEffect, useCallback } from 'react';
import {
  Enemy,
  PickupItem,
  FloatingText,
  Particle,
  Projectile,
  WorldObstacle,
  GameSettings,
} from '../../types';
import { soundFx } from '../../utils/audio';
import {
  getWaveConfig,
  pickWeightedLevel,
  pickWeightedEnemyType,
  calculateEnemyStats,
} from '../../utils/waveConfig';

// --- HIGH FIDELITY ASSET DRAWING HELPERS ---

// 1. Ruby Broadsword matching images (1).jpeg (Chisel apex, notch on spine, beveled facets, golden winged guard with center ruby gem, ring pommel)
function drawRubyBroadsword(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1,
  rotation: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  // Blade Shadow
  ctx.fillStyle = 'rgba(4, 18, 8, 0.4)';
  ctx.beginPath();
  ctx.moveTo(2, -26);
  ctx.lineTo(-7, -12);
  ctx.lineTo(-3, -4);
  ctx.lineTo(-7, 2);
  ctx.lineTo(10, 2);
  ctx.closePath();
  ctx.fill();

  // Left light facet of blade
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2.2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -28); // Tip
  ctx.lineTo(-7, -14); // Left corner
  ctx.lineTo(-3, -6);  // Notch on spine
  ctx.lineTo(-6, 2);   // Base
  ctx.lineTo(0, 2);    // Center base
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right shaded facet of blade
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(0, 2);
  ctx.lineTo(6, 2);
  ctx.lineTo(7, -14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Chisel point apex facet
  ctx.fillStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(-7, -14);
  ctx.lineTo(0, -14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Center blade ridge line
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(0, 2);
  ctx.stroke();

  // White Specular Highlight
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-1, -26);
  ctx.lineTo(-6, -15);
  ctx.stroke();

  // Golden Winged Crossguard
  ctx.fillStyle = '#EAB308';
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-14, 2);
  ctx.lineTo(-12, 8);
  ctx.lineTo(-4, 5);
  ctx.lineTo(-3, 8);
  ctx.lineTo(3, 8);
  ctx.lineTo(4, 5);
  ctx.lineTo(12, 8);
  ctx.lineTo(14, 2);
  ctx.lineTo(4, 0);
  ctx.lineTo(-4, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Guard highlights
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-12, 3);
  ctx.lineTo(-4, 2);
  ctx.moveTo(4, 2);
  ctx.lineTo(12, 3);
  ctx.stroke();

  // Center Red Ruby Gem
  ctx.save();
  ctx.translate(0, 4);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#DC2626';
  ctx.strokeStyle = '#7F1D1D';
  ctx.lineWidth = 1.6;
  ctx.fillRect(-3.5, -3.5, 7, 7);
  ctx.strokeRect(-3.5, -3.5, 7, 7);

  // Inner Ruby Facet Highlight
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(-2, -2, 4, 4);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-1.5, -1.5, 1.5, 1.5);
  ctx.restore();

  // Golden Grip
  ctx.fillStyle = '#CA8A04';
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 1.6;
  ctx.fillRect(-2.5, 8, 5, 8);
  ctx.strokeRect(-2.5, 8, 5, 8);

  // Grip wraps
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-2.5, 11);
  ctx.lineTo(2.5, 10);
  ctx.moveTo(-2.5, 14);
  ctx.lineTo(2.5, 13);
  ctx.stroke();

  // Circular Ring Pommel
  ctx.fillStyle = '#EAB308';
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 19, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner Pommel Cut
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(0, 19, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 2. Cartoon Bomb matching images (2).jpeg (Glossy black sphere, white bubble shines, dark collar, ribbed fuse, fiery 12-point explosive spark)
function drawCartoonBomb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1,
  time: number = 0,
  isHighlighted: boolean = false
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Highlight Beacon Radar Ring
  if (isHighlighted) {
    const pulseRadius = 26 + (Math.sin(time * 0.006) * 0.5 + 0.5) * 14;
    const pulseAlpha = 0.65 - (Math.sin(time * 0.006) * 0.5 + 0.5) * 0.35;

    // Outer Expanding Red Shockwave Ring
    ctx.strokeStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 4, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary Yellow Inner Aura
    ctx.fillStyle = 'rgba(254, 224, 71, 0.22)';
    ctx.beginPath();
    ctx.arc(0, 4, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 22, 18, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Spherical Black Bomb Body
  ctx.fillStyle = '#18181B';
  ctx.strokeStyle = '#09090B';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 4, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3D Inner radial shading
  const innerGrad = ctx.createRadialGradient(-4, 0, 2, 0, 4, 18);
  innerGrad.addColorStop(0, '#3F3F46');
  innerGrad.addColorStop(0.4, '#18181B');
  innerGrad.addColorStop(1, '#09090B');
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.arc(0, 4, 16.5, 0, Math.PI * 2);
  ctx.fill();

  // Smooth White Bubble Highlights (Matching reference image 2)
  // Large upper-right oval highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(7, -1, 4.2, 6.5, -Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  // Small lower dot highlight
  ctx.beginPath();
  ctx.arc(6, 10, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // Bomb Collar / Neck
  ctx.fillStyle = '#374151';
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(-6, -16, 12, 6, 2);
  ctx.fill();
  ctx.stroke();

  // Curved Ribbed Rope Fuse
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.quadraticCurveTo(8, -22, 12, -26);
  ctx.stroke();

  // Fuse Ribs
  ctx.strokeStyle = '#451A03';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(2, -18);
  ctx.lineTo(4, -16);
  ctx.moveTo(6, -21);
  ctx.lineTo(8, -19);
  ctx.moveTo(9, -24);
  ctx.lineTo(11, -22);
  ctx.stroke();

  // Fiery 12-Point Explosive Starburst Spark at Fuse Tip
  const sparkX = 14;
  const sparkY = -28;
  const sparkFlicker = 1 + Math.sin(time * 0.02) * 0.15;

  ctx.save();
  ctx.translate(sparkX, sparkY);
  ctx.scale(sparkFlicker, sparkFlicker);

  // Outer Red Starburst Spikes
  ctx.fillStyle = '#EF4444';
  ctx.strokeStyle = '#450A0A';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  const outerSpikes = 12;
  const rOuter = 12;
  const rInner = 6;
  for (let sp = 0; sp < outerSpikes * 2; sp++) {
    const r = sp % 2 === 0 ? rOuter : rInner;
    const a = (sp * Math.PI) / outerSpikes;
    if (sp === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner Yellow/Orange Starburst Core
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  const innerSpikes = 10;
  for (let sp = 0; sp < innerSpikes * 2; sp++) {
    const r = sp % 2 === 0 ? 8 : 4;
    const a = (sp * Math.PI) / innerSpikes + Math.PI / 8;
    if (sp === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();

  // White Hot Spark Center
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Spark fly-away particles
  ctx.fillStyle = '#FEF08A';
  ctx.fillRect(-8 + Math.sin(time * 0.03) * 4, -8, 2, 2);
  ctx.fillRect(8, -6 + Math.cos(time * 0.03) * 4, 2, 2);
  ctx.fillRect(-2, -12, 2, 2);

  ctx.restore();
  ctx.restore();
}

// 3. Custom Stylized Lightning Bolt matching ⚡ (Electric Pedestal, Golden Thunderbolt, Energetic Sparks)
function drawCartoonLightningBolt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1,
  time: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Radiant Golden Electric Aura
  const pulseR = 32 + Math.sin(time * 0.008) * 4;
  const glowGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, pulseR);
  glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
  glowGrad.addColorStop(0.55, 'rgba(245, 158, 11, 0.35)');
  glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, pulseR, 0, Math.PI * 2);
  ctx.fill();

  // Dark Amber Rune Platform
  ctx.fillStyle = '#451A03';
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Electric crackle arcs
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 2;
  const arcAngle = (time * 0.005) % (Math.PI * 2);
  ctx.beginPath();
  ctx.moveTo(Math.cos(arcAngle) * 19, Math.sin(arcAngle) * 19);
  ctx.lineTo(Math.cos(arcAngle + 0.3) * 26, Math.sin(arcAngle + 0.3) * 26);
  ctx.lineTo(Math.cos(arcAngle + 0.6) * 21, Math.sin(arcAngle + 0.6) * 21);
  ctx.stroke();

  // Draw ⚡ Thunderbolt Geometry
  ctx.save();
  ctx.translate(0, -1);
  ctx.scale(0.78, 0.78);

  // Heavy Dark Cartoon Border
  ctx.fillStyle = '#1C0D02';
  ctx.strokeStyle = '#1C0D02';
  ctx.lineWidth = 5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(6, -24);
  ctx.lineTo(-14, 2);
  ctx.lineTo(-1, 2);
  ctx.lineTo(-8, 25);
  ctx.lineTo(16, -4);
  ctx.lineTo(2, -4);
  ctx.lineTo(8, -24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Outer Golden Amber Layer
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.moveTo(5, -22);
  ctx.lineTo(-12, 1);
  ctx.lineTo(0, 1);
  ctx.lineTo(-6, 22);
  ctx.lineTo(14, -3);
  ctx.lineTo(2, -3);
  ctx.lineTo(7, -22);
  ctx.closePath();
  ctx.fill();

  // Vibrant Lemon Core
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.moveTo(4, -19);
  ctx.lineTo(-9, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(-4, 18);
  ctx.lineTo(11, -3);
  ctx.lineTo(2, -3);
  ctx.lineTo(6, -19);
  ctx.closePath();
  ctx.fill();

  // White Hot Specular Shine
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(3, -16);
  ctx.lineTo(-6, -1);
  ctx.lineTo(0, -1);
  ctx.lineTo(-2, 12);
  ctx.lineTo(7, -3);
  ctx.lineTo(1, -3);
  ctx.lineTo(4, -16);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  ctx.restore();
}

interface GameCanvasProps {
  wave: number;
  swordCount: number;
  swordDamage: number;
  settings: GameSettings;
  joystickVector: { x: number; y: number };
  onSwordCountChange: (newCount: number) => void;
  onCoinCollected: (amount: number) => void;
  onEnemyKilled: (scoreValue: number) => void;
  onTimeUpdate: (timeRemaining: number) => void;
  onWaveComplete: () => void;
  onGameOver: () => void;
  isPaused: boolean;
  shieldTimeRemaining: number;
  setShieldTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  speedBoostTimeRemaining: number;
  setSpeedBoostTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  targetAttackTrigger: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  wave,
  swordCount,
  swordDamage,
  settings,
  joystickVector,
  onSwordCountChange,
  onCoinCollected,
  onEnemyKilled,
  onTimeUpdate,
  onWaveComplete,
  onGameOver,
  isPaused,
  shieldTimeRemaining,
  setShieldTimeRemaining,
  speedBoostTimeRemaining,
  setSpeedBoostTimeRemaining,
  targetAttackTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Large explorable map
  const WORLD_WIDTH = 2600;
  const WORLD_HEIGHT = 2600;

  // Mutable Game Engine State Refs for smooth 60 FPS
  const stateRef = useRef({
    player: {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
      vx: 0,
      vy: 0,
      radius: 26,
      speed: 215, // px per sec
      facingRight: true,
      orbitAngle: 0,
      swordOrbitRadius: 74,
      invulnerableTimer: 0,
      walkTimer: 0,
      swordHandSwing: 0,
    },
    camera: {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
    },
    enemies: [] as Enemy[],
    pickups: [] as PickupItem[],
    projectiles: [] as Projectile[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    obstacles: [] as WorldObstacle[],
    waveTimer: 50,
    spawnTimer: 0,
    bombSpawnTimer: 0,
    swordSpawnTimer: 0,
    screenShake: 0,
    currentSwords: swordCount,
    lastTime: performance.now(),
    lastAttackTrigger: 0,
    bossSpawned: false,
  });

  // Sync swords count
  useEffect(() => {
    stateRef.current.currentSwords = swordCount;
  }, [swordCount]);

  // Generate Obstacles: ONLY Trees and Gravestones
  useEffect(() => {
    const waveConfig = getWaveConfig(wave);
    stateRef.current.waveTimer = waveConfig.duration;
    stateRef.current.bossSpawned = false;

    const obs: WorldObstacle[] = [];
    const types: WorldObstacle['type'][] = ['tree', 'gravestone'];

    // Place trees and gravestones across the map
    for (let i = 0; i < 140; i++) {
      const type = types[i % 2 === 0 ? 0 : 1];
      const x = 140 + Math.random() * (WORLD_WIDTH - 280);
      const y = 140 + Math.random() * (WORLD_HEIGHT - 280);

      // Keep center starting spawn clear
      if (Math.hypot(x - WORLD_WIDTH / 2, y - WORLD_HEIGHT / 2) < 220) continue;

      obs.push({
        x,
        y,
        radius: type === 'tree' ? 36 : 24,
        type,
        variant: Math.floor(Math.random() * 3),
      });
    }

    // Initial item spawns in world:
    // Rule: Increase Swords Quantity, decrease bomb quantity, wave by wave increase swords and bombs, MAX 5 BOMBS on any map!
    const initialPickups: PickupItem[] = [];

    // 1. Spawning strictly <= 5 Bombs 💣 across the map (Wave 1: 2, Wave 2: 3, Wave 3: 4, Wave 4+: 5 max)
    const targetBombs = Math.min(5, Math.max(2, 1 + wave));
    for (let i = 0; i < targetBombs; i++) {
      initialPickups.push({
        id: Math.random().toString(36),
        type: 'bomb',
        x: 140 + Math.random() * (WORLD_WIDTH - 280),
        y: 140 + Math.random() * (WORLD_HEIGHT - 280),
        radius: 28,
        value: 1,
        createdAt: performance.now(),
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. Spawning abundant Ruby Swords 🗡 increasing wave by wave (Wave 1: 24, Wave 2: 28, Wave 3: 32, Wave 4: 36...)
    const targetSwords = Math.min(65, 20 + wave * 4);
    for (let i = 0; i < targetSwords; i++) {
      initialPickups.push({
        id: Math.random().toString(36),
        type: 'sword',
        x: 160 + Math.random() * (WORLD_WIDTH - 320),
        y: 160 + Math.random() * (WORLD_HEIGHT - 320),
        radius: 26,
        value: 1,
        createdAt: performance.now(),
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    // 3. Spawning 8 Lightning Speed ⚡ Pickups
    for (let i = 0; i < 8; i++) {
      initialPickups.push({
        id: Math.random().toString(36),
        type: 'lightning_speed',
        x: 160 + Math.random() * (WORLD_WIDTH - 320),
        y: 160 + Math.random() * (WORLD_HEIGHT - 320),
        radius: 26,
        value: 1,
        createdAt: performance.now(),
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    // 4. Spawning 6 Sapphire Shields 🛡
    for (let i = 0; i < 6; i++) {
      initialPickups.push({
        id: Math.random().toString(36),
        type: 'shield',
        x: 160 + Math.random() * (WORLD_WIDTH - 320),
        y: 160 + Math.random() * (WORLD_HEIGHT - 320),
        radius: 26,
        value: 1,
        createdAt: performance.now(),
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    // 5. Spawning 16 Gold Coins 🪙
    for (let i = 0; i < 16; i++) {
      initialPickups.push({
        id: Math.random().toString(36),
        type: 'coin',
        x: 160 + Math.random() * (WORLD_WIDTH - 320),
        y: 160 + Math.random() * (WORLD_HEIGHT - 320),
        radius: 20,
        value: 25,
        createdAt: performance.now(),
        bobOffset: Math.random() * Math.PI * 2,
      });
    }

    stateRef.current.obstacles = obs;
    stateRef.current.pickups = initialPickups;
  }, [wave, WORLD_WIDTH, WORLD_HEIGHT]);

  // Floating text
  const addFloatingText = useCallback((text: string, x: number, y: number, color: string, size = 16) => {
    stateRef.current.floatingTexts.push({
      id: Math.random().toString(36),
      text,
      x,
      y,
      color,
      size,
      lifetime: 0,
      maxLifetime: 0.95,
      vy: -42,
    });
  }, []);

  // Particles
  const emitParticles = useCallback((x: number, y: number, count: number, color: string, type: Particle['type'] = 'spark') => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 140;
      stateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: type === 'smoke' ? 7 + Math.random() * 8 : 2.5 + Math.random() * 4,
        color,
        alpha: 1,
        decay: 1.6 + Math.random() * 1.4,
        type,
      });
    }
  }, []);

  // Enemy Kill Handler (Swords are NO LONGER consumed by orbiting kills)
  const processEnemyDeath = useCallback(
    (enemy: Enemy) => {
      if (enemy.isDead) return;
      enemy.isDead = true;

      soundFx.playEnemyDeath();

      onEnemyKilled(enemy.scoreValue);

      // Floating Score
      addFloatingText(`+${enemy.scoreValue}`, enemy.x, enemy.y - 12, '#FFE57F', 15);

      // Death particles
      emitParticles(
        enemy.x,
        enemy.y,
        enemy.isBoss ? 32 : 16,
        enemy.type === 'stone_zombie' ? '#64748B' : enemy.type === 'ghost' ? '#67E8F9' : enemy.type === 'demon' ? '#F87171' : enemy.type === 'zombie' ? '#4ADE80' : '#FBBF24',
        'smoke'
      );

      // Drops (Coins & Only 4 Powerups: Sword, Shield, Bomb, Lightning Speed)
      const { pickups } = stateRef.current;
      if (Math.random() < enemy.coinDropChance) {
        pickups.push({
          id: Math.random().toString(36),
          type: 'coin',
          x: enemy.x,
          y: enemy.y,
          radius: 20,
          value: enemy.isBoss ? 300 : enemy.isElite ? 100 : 25 + (enemy.level - 1) * 10,
          createdAt: performance.now(),
          bobOffset: Math.random() * Math.PI * 2,
        });
      }

      // Chance to drop power-ups (High sword drop rate, strict 5-bomb map cap)
      const dropRoll = Math.random();
      if (dropRoll < 0.42 || enemy.isBoss) {
        const rand = Math.random();
        const currentBombsOnMap = pickups.filter((p) => p.type === 'bomb').length;
        const maxAllowedBombs = Math.min(5, Math.max(2, 1 + wave));
        const canDropBomb = currentBombsOnMap < maxAllowedBombs && currentBombsOnMap < 5;

        let chosen: PickupItem['type'];
        if (canDropBomb && rand < 0.10) {
          chosen = 'bomb';
        } else if (rand < 0.68) {
          chosen = 'sword'; // Plentiful swords!
        } else if (rand < 0.86) {
          chosen = 'lightning_speed';
        } else {
          chosen = 'shield';
        }

        pickups.push({
          id: Math.random().toString(36),
          type: chosen,
          x: enemy.x + (Math.random() - 0.5) * 20,
          y: enemy.y + (Math.random() - 0.5) * 20,
          radius: 28,
          value: 1,
          createdAt: performance.now(),
          bobOffset: Math.random() * Math.PI * 2,
        });
      }
    },
    [addFloatingText, emitParticles, onEnemyKilled]
  );

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const waveConfig = getWaveConfig(wave);

    const gameLoop = (timestamp: number) => {
      const dt = Math.min((timestamp - stateRef.current.lastTime) / 1000, 0.05);
      stateRef.current.lastTime = timestamp;

      if (!isPaused) {
        // --- 1. WAVE TIMER & COUNTDOWN ---
        stateRef.current.waveTimer -= dt;
        onTimeUpdate(Math.max(0, Math.ceil(stateRef.current.waveTimer)));

        if (stateRef.current.waveTimer <= 0) {
          soundFx.playWaveComplete();
          addFloatingText('WAVE CLEARED!', stateRef.current.player.x, stateRef.current.player.y - 60, '#4ADE80', 24);
          onWaveComplete();
          return;
        }

        // --- 2. UPDATE BUFF TIMERS ---
        if (shieldTimeRemaining > 0) {
          setShieldTimeRemaining((prev) => Math.max(0, prev - dt));
        }
        if (speedBoostTimeRemaining > 0) {
          setSpeedBoostTimeRemaining((prev) => Math.max(0, prev - dt));
        }

        // --- 3. HANDLE TARGET ATTACK TRIGGER ---
        if (targetAttackTrigger && targetAttackTrigger !== stateRef.current.lastAttackTrigger) {
          stateRef.current.lastAttackTrigger = targetAttackTrigger;

          // Find nearest alive enemy
          let nearestEnemy: Enemy | null = null;
          let minDist = 500;
          for (const e of stateRef.current.enemies) {
            if (e.isDead) continue;
            const dist = Math.hypot(e.x - stateRef.current.player.x, e.y - stateRef.current.player.y);
            if (dist < minDist) {
              minDist = dist;
              nearestEnemy = e;
            }
          }

          if (nearestEnemy) {
            soundFx.playFocusedAttack();
            const angle = Math.atan2(
              nearestEnemy.y - stateRef.current.player.y,
              nearestEnemy.x - stateRef.current.player.x
            );
            const speed = 680;
            stateRef.current.projectiles.push({
              id: Math.random().toString(36),
              x: stateRef.current.player.x,
              y: stateRef.current.player.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              damage: swordDamage * 2.8,
              radius: 22,
              angle,
              distanceTraveled: 0,
              maxDistance: 480,
              isFocusedSlash: true,
              pierceCount: 4,
            });

            // Hand sword thrust animation
            stateRef.current.player.swordHandSwing = 1.0;
            emitParticles(stateRef.current.player.x, stateRef.current.player.y, 10, '#EF4444', 'spark');
          }
        }

        // --- 4. PLAYER MOVEMENT & ORBIT SWORDS ---
        const { player, camera } = stateRef.current;
        const currentSpeed = speedBoostTimeRemaining > 0 ? player.speed * 1.45 : player.speed;

        if (joystickVector.x !== 0 || joystickVector.y !== 0) {
          player.vx = joystickVector.x * currentSpeed;
          player.vy = joystickVector.y * currentSpeed;
          player.x = Math.max(player.radius, Math.min(WORLD_WIDTH - player.radius, player.x + player.vx * dt));
          player.y = Math.max(player.radius, Math.min(WORLD_HEIGHT - player.radius, player.y + player.vy * dt));

          if (joystickVector.x > 0.05) player.facingRight = true;
          else if (joystickVector.x < -0.05) player.facingRight = false;

          player.walkTimer += dt * 10;
        } else {
          player.vx = 0;
          player.vy = 0;
        }

        // Sword Hand Swing decay
        if (player.swordHandSwing > 0) {
          player.swordHandSwing = Math.max(0, player.swordHandSwing - dt * 4);
        }

        // Sword Orbit Rotation
        player.orbitAngle += dt * 4.0;

        // Player invulnerability decay & screen shake decay
        if (player.invulnerableTimer > 0) {
          player.invulnerableTimer = Math.max(0, player.invulnerableTimer - dt);
        }
        if (stateRef.current.screenShake > 0) {
          stateRef.current.screenShake = Math.max(0, stateRef.current.screenShake - dt * 25);
        }

        // Camera smoothly follows player
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewW = canvas.width / dpr;
        const viewH = canvas.height / dpr;

        camera.x += (player.x - camera.x) * (dt * 7);
        camera.y += (player.y - camera.y) * (dt * 7);

        // --- 5. PROGRESSIVE ENEMY & BOSS SPAWNING ---
        stateRef.current.spawnTimer += dt;

        // Boss Spawn Check
        if (waveConfig.bossType && !stateRef.current.bossSpawned && stateRef.current.waveTimer <= waveConfig.duration - 4) {
          stateRef.current.bossSpawned = true;
          soundFx.playBossWarning();

          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = Math.max(viewW, viewH) * 0.65;
          const bx = player.x + Math.cos(spawnAngle) * spawnDist;
          const by = player.y + Math.sin(spawnAngle) * spawnDist;

          const bossStats = calculateEnemyStats({
            type: waveConfig.bossType,
            level: waveConfig.bossLevel || 4,
            wave,
            isBoss: true,
          });

          stateRef.current.enemies.push({
            id: Math.random().toString(36),
            type: waveConfig.bossType,
            level: waveConfig.bossLevel || 4,
            swordCost: bossStats.swordCost,
            x: Math.max(80, Math.min(WORLD_WIDTH - 80, bx)),
            y: Math.max(80, Math.min(WORLD_HEIGHT - 80, by)),
            vx: 0,
            vy: 0,
            radius: bossStats.radius,
            hp: bossStats.hp,
            maxHp: bossStats.hp,
            speed: bossStats.speed,
            damage: bossStats.damage,
            scoreValue: bossStats.scoreValue,
            coinDropChance: bossStats.coinDropChance,
            isBoss: true,
            hitFlashTimer: 0,
            animFrame: 0,
            attackCooldown: 0,
            name: bossStats.name,
          });

          addFloatingText('WARNING: BOSS APPEARED!', player.x, player.y - 80, '#EF4444', 22);
          stateRef.current.screenShake = 10;
        }

        // Periodic Bomb Check (Strictly max 5 bombs on map, scaled by wave)
        stateRef.current.bombSpawnTimer += dt;
        const maxAllowedBombs = Math.min(5, Math.max(2, 1 + wave));
        if (stateRef.current.bombSpawnTimer >= 10.0) {
          stateRef.current.bombSpawnTimer = 0;
          const currentBombs = stateRef.current.pickups.filter((p) => p.type === 'bomb').length;
          if (currentBombs < maxAllowedBombs && currentBombs < 5) {
            const bAngle = Math.random() * Math.PI * 2;
            const bDist = 200 + Math.random() * 520;
            const bx = Math.max(120, Math.min(WORLD_WIDTH - 120, player.x + Math.cos(bAngle) * bDist));
            const by = Math.max(120, Math.min(WORLD_HEIGHT - 120, player.y + Math.sin(bAngle) * bDist));

            stateRef.current.pickups.push({
              id: Math.random().toString(36),
              type: 'bomb',
              x: bx,
              y: by,
              radius: 28,
              value: 1,
              createdAt: performance.now(),
              bobOffset: Math.random() * Math.PI * 2,
            });
          }
        }

        // Periodic Sword Spawner (Keeps swords abundant and scaled wave by wave across the map)
        stateRef.current.swordSpawnTimer += dt;
        const targetSwordsOnMap = Math.min(55, 18 + wave * 4);
        if (stateRef.current.swordSpawnTimer >= 3.5) {
          stateRef.current.swordSpawnTimer = 0;
          const currentSwords = stateRef.current.pickups.filter((p) => p.type === 'sword').length;
          if (currentSwords < targetSwordsOnMap) {
            const sAngle = Math.random() * Math.PI * 2;
            const sDist = 180 + Math.random() * 520;
            const sx = Math.max(120, Math.min(WORLD_WIDTH - 120, player.x + Math.cos(sAngle) * sDist));
            const sy = Math.max(120, Math.min(WORLD_HEIGHT - 120, player.y + Math.sin(sAngle) * sDist));

            stateRef.current.pickups.push({
              id: Math.random().toString(36),
              type: 'sword',
              x: sx,
              y: sy,
              radius: 26,
              value: 1,
              createdAt: performance.now(),
              bobOffset: Math.random() * Math.PI * 2,
            });
          }
        }

        // Regular Mob Spawning
        if (stateRef.current.spawnTimer >= waveConfig.spawnInterval && stateRef.current.enemies.length < waveConfig.maxEnemies) {
          stateRef.current.spawnTimer = 0;

          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnDist = Math.max(viewW, viewH) * 0.65 + 60;
          const sx = player.x + Math.cos(spawnAngle) * spawnDist;
          const sy = player.y + Math.sin(spawnAngle) * spawnDist;

          const eType = pickWeightedEnemyType(waveConfig.enemyTypeWeights);
          const eLevel = pickWeightedLevel(waveConfig.levelWeights);
          const isElite = Math.random() < waveConfig.eliteChance;

          const stats = calculateEnemyStats({
            type: eType,
            level: eLevel,
            wave,
            isElite,
          });

          stateRef.current.enemies.push({
            id: Math.random().toString(36),
            type: eType,
            level: eLevel,
            swordCost: stats.swordCost,
            x: Math.max(60, Math.min(WORLD_WIDTH - 60, sx)),
            y: Math.max(60, Math.min(WORLD_HEIGHT - 60, sy)),
            vx: 0,
            vy: 0,
            radius: stats.radius,
            hp: stats.hp,
            maxHp: stats.hp,
            speed: stats.speed,
            damage: stats.damage,
            scoreValue: stats.scoreValue,
            coinDropChance: stats.coinDropChance,
            isElite,
            hitFlashTimer: 0,
            animFrame: Math.random() * 10,
            attackCooldown: 0,
            name: stats.name,
          });
        }

        // --- 6. UPDATE ENEMIES & SWORD COLLISIONS ---
        const { enemies, projectiles, pickups } = stateRef.current;
        const currentSwordCount = stateRef.current.currentSwords;

        for (let i = enemies.length - 1; i >= 0; i--) {
          const enemy = enemies[i];
          if (enemy.isDead) {
            enemies.splice(i, 1);
            continue;
          }

          enemy.animFrame += dt * 6;
          if (enemy.hitFlashTimer > 0) {
            enemy.hitFlashTimer = Math.max(0, enemy.hitFlashTimer - dt * 8);
          }
          if (enemy.attackCooldown > 0) {
            enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
          }

          // Move towards player
          const edx = player.x - enemy.x;
          const edy = player.y - enemy.y;
          const edist = Math.hypot(edx, edy);

          if (edist > 0) {
            enemy.vx = (edx / edist) * enemy.speed;
            enemy.vy = (edy / edist) * enemy.speed;
            enemy.x += enemy.vx * dt;
            enemy.y += enemy.vy * dt;
          }

          // Check collision with orbiting swords
          if (currentSwordCount > 0) {
            for (let s = 0; s < currentSwordCount; s++) {
              const swordAngle = player.orbitAngle + (s * Math.PI * 2) / currentSwordCount;
              const swordX = player.x + Math.cos(swordAngle) * player.swordOrbitRadius;
              const swordY = player.y + Math.sin(swordAngle) * player.swordOrbitRadius;

              const swordDist = Math.hypot(enemy.x - swordX, enemy.y - swordY);
              if (swordDist < enemy.radius + 18) {
                // Hit enemy!
                enemy.hp -= swordDamage;
                enemy.hitFlashTimer = 1;

                // Knockback
                enemy.x -= (edx / (edist || 1)) * 22;
                enemy.y -= (edy / (edist || 1)) * 22;

                // Special: Stone Zombie 🪨 rock armor breaks player's sword!
                if (enemy.type === 'stone_zombie') {
                  const remainingSwords = Math.max(0, stateRef.current.currentSwords - 1);
                  stateRef.current.currentSwords = remainingSwords;
                  onSwordCountChange(remainingSwords);

                  soundFx.playSwordBroken();
                  stateRef.current.screenShake = Math.max(stateRef.current.screenShake, 8.5);

                  // Rock debris & shattered blade fragments
                  emitParticles(swordX, swordY, 14, '#94A3B8', 'spark');
                  emitParticles(swordX, swordY, 10, '#E2E8F0', 'spark');
                  emitParticles(swordX, swordY, 8, '#EF4444', 'spark');

                  if (remainingSwords <= 0) {
                    onGameOver();
                    return;
                  }
                } else {
                  soundFx.playHit();
                  emitParticles(swordX, swordY, 5, '#FDE047', 'spark');
                  addFloatingText(`-${Math.round(swordDamage)}`, enemy.x, enemy.y - 14, '#EF4444', 14);
                  stateRef.current.screenShake = Math.max(stateRef.current.screenShake, 2.5);
                }

                if (enemy.hp <= 0) {
                  processEnemyDeath(enemy);
                  enemies.splice(i, 1);
                }
                break;
              }
            }
          }

          // Check collision with player body
          if (edist < player.radius + enemy.radius && enemy.attackCooldown <= 0 && !enemy.isDead) {
            enemy.attackCooldown = 0.9;

            if (shieldTimeRemaining > 0) {
              soundFx.playSwordClang();
              emitParticles(player.x, player.y, 8, '#38BDF8', 'magic');
              addFloatingText('BLOCKED!', player.x, player.y - 30, '#38BDF8', 16);
            } else if (player.invulnerableTimer <= 0) {
              player.invulnerableTimer = 0.8;
              stateRef.current.screenShake = 8;
              soundFx.playPlayerHurt();

              const nextSwords = Math.max(0, currentSwordCount - enemy.damage);
              stateRef.current.currentSwords = nextSwords;
              onSwordCountChange(nextSwords);

              emitParticles(player.x, player.y, 10, '#EF4444', 'spark');

              if (nextSwords <= 0) {
                onGameOver();
                return;
              }
            }
          }
        }

        // --- 7. UPDATE PROJECTILES ---
        for (let p = projectiles.length - 1; p >= 0; p--) {
          const proj = projectiles[p];
          proj.x += proj.vx * dt;
          proj.y += proj.vy * dt;
          proj.distanceTraveled += Math.hypot(proj.vx, proj.vy) * dt;

          for (let eIdx = enemies.length - 1; eIdx >= 0; eIdx--) {
            const enemy = enemies[eIdx];
            if (enemy.isDead) continue;

            const pdist = Math.hypot(enemy.x - proj.x, enemy.y - proj.y);
            if (pdist < enemy.radius + proj.radius) {
              enemy.hp -= proj.damage;
              enemy.hitFlashTimer = 1;
              soundFx.playSwordClang();
              emitParticles(proj.x, proj.y, 8, '#F87171', 'spark');
              addFloatingText(`CRIT! -${Math.round(proj.damage)}`, enemy.x, enemy.y - 18, '#FBBF24', 18);

              if (enemy.hp <= 0) {
                processEnemyDeath(enemy);
                enemies.splice(eIdx, 1);
              }

              proj.pierceCount--;
              if (proj.pierceCount <= 0) break;
            }
          }

          if (proj.distanceTraveled >= proj.maxDistance || proj.pierceCount <= 0) {
            projectiles.splice(p, 1);
          }
        }

        // --- 8. UPDATE PICKUPS (Only Swords, Shield, Bomb, Speed, Coin) ---
        for (let k = pickups.length - 1; k >= 0; k--) {
          const item = pickups[k];
          const pdist = Math.hypot(item.x - player.x, item.y - player.y);

          // Magnetic collection
          if (pdist < 95) {
            item.x += (player.x - item.x) * dt * 9.5;
            item.y += (player.y - item.y) * dt * 9.5;
          }

          if (pdist < player.radius + item.radius) {
            if (item.type === 'coin') {
              soundFx.playCoinPickup();
              onCoinCollected(item.value);
              emitParticles(item.x, item.y, 8, '#FDE047', 'spark');
            } else if (item.type === 'sword') {
              soundFx.playSwordPickup();
              const nextSwords = Math.min(stateRef.current.currentSwords + 1, 8);
              stateRef.current.currentSwords = nextSwords;
              onSwordCountChange(nextSwords);
              emitParticles(item.x, item.y, 14, '#38BDF8', 'magic');
            } else if (item.type === 'shield') {
              soundFx.playShieldPickup();
              setShieldTimeRemaining((prev) => prev + 8.0);
              emitParticles(item.x, item.y, 14, '#38BDF8', 'magic');
            } else if (item.type === 'lightning_speed' || item.type === 'speed_boot') {
              soundFx.playLightningPickup();
              setSpeedBoostTimeRemaining((prev) => prev + 7.5);
              emitParticles(item.x, item.y, 18, '#FDE047', 'spark');
              emitParticles(item.x, item.y, 12, '#F59E0B', 'spark');
            } else if (item.type === 'bomb') {
              soundFx.playBombExplosion();
              stateRef.current.screenShake = 14;
              emitParticles(item.x, item.y, 30, '#EF4444', 'bomb_fire');
              emitParticles(item.x, item.y, 20, '#F97316', 'smoke');

              // Massive explosion damage to nearby mobs
              for (let eIdx = enemies.length - 1; eIdx >= 0; eIdx--) {
                const e = enemies[eIdx];
                if (Math.hypot(e.x - item.x, e.y - item.y) < 220) {
                  e.hp -= 200;
                  e.hitFlashTimer = 1;
                  if (e.hp <= 0) {
                    processEnemyDeath(e);
                    enemies.splice(eIdx, 1);
                  }
                }
              }
            }

            pickups.splice(k, 1);
          }
        }

        // --- 9. PARTICLES & FLOATING TEXTS ---
        for (let pt = stateRef.current.particles.length - 1; pt >= 0; pt--) {
          const p = stateRef.current.particles[pt];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.alpha -= dt * p.decay;
          if (p.alpha <= 0) stateRef.current.particles.splice(pt, 1);
        }

        for (let ft = stateRef.current.floatingTexts.length - 1; ft >= 0; ft--) {
          const f = stateRef.current.floatingTexts[ft];
          f.y += f.vy * dt;
          f.lifetime += dt;
          if (f.lifetime >= f.maxLifetime) stateRef.current.floatingTexts.splice(ft, 1);
        }
      }

      // ================= RENDER SCENE (CANVAS) =================
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);

      const viewW = canvas.width / dpr;
      const viewH = canvas.height / dpr;

      // Screen Shake
      const shakeX = (Math.random() - 0.5) * stateRef.current.screenShake;
      const shakeY = (Math.random() - 0.5) * stateRef.current.screenShake;

      const offsetX = viewW / 2 - stateRef.current.camera.x + shakeX;
      const offsetY = viewH / 2 - stateRef.current.camera.y + shakeY;

      // Background
      ctx.fillStyle = '#06160d';
      ctx.fillRect(0, 0, viewW, viewH);

      ctx.save();
      ctx.translate(offsetX, offsetY);

      // --- 1. TILED DUNGEON FLOOR ---
      const tileSize = 64;
      const startCol = Math.max(0, Math.floor((stateRef.current.camera.x - viewW / 2 - 100) / tileSize));
      const endCol = Math.min(WORLD_WIDTH / tileSize, Math.ceil((stateRef.current.camera.x + viewW / 2 + 100) / tileSize));
      const startRow = Math.max(0, Math.floor((stateRef.current.camera.y - viewH / 2 - 100) / tileSize));
      const endRow = Math.min(WORLD_HEIGHT / tileSize, Math.ceil((stateRef.current.camera.y + viewH / 2 + 100) / tileSize));

      for (let c = startCol; c < endCol; c++) {
        for (let r = startRow; r < endRow; r++) {
          const tx = c * tileSize;
          const ty = r * tileSize;
          const isEven = (c + r) % 2 === 0;

          ctx.fillStyle = isEven ? '#0f291c' : '#0c2317';
          ctx.fillRect(tx, ty, tileSize, tileSize);

          ctx.strokeStyle = '#05110a';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(tx, ty, tileSize, tileSize);

          if ((c * 7 + r * 13) % 5 === 0) {
            ctx.fillStyle = '#163a28';
            ctx.fillRect(tx + 12, ty + 12, 10, 6);
          }
          if ((c * 11 + r * 3) % 7 === 0) {
            ctx.fillStyle = '#091a11';
            ctx.fillRect(tx + 36, ty + 40, 8, 8);
          }
        }
      }

      // --- 2. WORLD OBSTACLES: ONLY TREES & GRAVESTONES ---
      for (const obs of stateRef.current.obstacles) {
        if (Math.hypot(obs.x - stateRef.current.camera.x, obs.y - stateRef.current.camera.y) > viewW * 0.85) continue;

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.beginPath();
        ctx.ellipse(obs.x, obs.y + obs.radius * 0.7, obs.radius * 1.1, obs.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        if (obs.type === 'gravestone') {
          // Ancient Stone Gravestone with Carved Cross & Moss
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.roundRect(obs.x - 16, obs.y - 24, 32, 38, [14, 14, 2, 2]);
          ctx.fill();
          ctx.stroke();

          // Gravestone highlights
          ctx.fillStyle = '#475569';
          ctx.fillRect(obs.x - 13, obs.y - 21, 4, 32);

          // Carved Cross
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y - 16);
          ctx.lineTo(obs.x, obs.y + 6);
          ctx.moveTo(obs.x - 8, obs.y - 6);
          ctx.lineTo(obs.x + 8, obs.y - 6);
          ctx.stroke();

          // Green Moss patch on base
          ctx.fillStyle = '#166534';
          ctx.beginPath();
          ctx.arc(obs.x + 8, obs.y + 10, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'tree') {
          // Spooky Twisted Dead Halloween Tree
          ctx.fillStyle = '#1c1917';
          ctx.strokeStyle = '#0c0a09';
          ctx.lineWidth = 4;
          ctx.beginPath();
          // Twisted Trunk & Branches
          ctx.moveTo(obs.x - 12, obs.y + 24);
          ctx.lineTo(obs.x - 8, obs.y - 18);
          ctx.lineTo(obs.x - 26, obs.y - 42);
          ctx.lineTo(obs.x - 5, obs.y - 24);
          ctx.lineTo(obs.x, obs.y - 48);
          ctx.lineTo(obs.x + 6, obs.y - 24);
          ctx.lineTo(obs.x + 26, obs.y - 38);
          ctx.lineTo(obs.x + 8, obs.y - 18);
          ctx.lineTo(obs.x + 12, obs.y + 24);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Knot hole in tree
          ctx.fillStyle = '#0c0a09';
          ctx.beginPath();
          ctx.ellipse(obs.x - 1, obs.y - 2, 3, 5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- 3. BIGGER & IMPROVED POWER-UPS (Swords, Shield, Bomb, Speed, Coins) ---
      for (const item of stateRef.current.pickups) {
        const bob = Math.sin(timestamp * 0.005 + item.bobOffset) * 5;
        const iy = item.y + bob;

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(item.x, item.y + 18, 18, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        if (item.type === 'sword') {
          // --- 1. BIG SWORD POWER-UP (Glowing Emerald-Gold Pedestal with Ruby Broadsword) ---
          const glowGrad = ctx.createRadialGradient(item.x, iy, 4, item.x, iy, 36);
          glowGrad.addColorStop(0, 'rgba(52, 211, 153, 0.7)');
          glowGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.3)');
          glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(item.x, iy, 36, 0, Math.PI * 2);
          ctx.fill();

          // Emerald Rune Seal Badge
          ctx.fillStyle = '#064E3B';
          ctx.strokeStyle = '#34D399';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(item.x, iy, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Render Ruby Broadsword
          drawRubyBroadsword(ctx, item.x, iy, 1.1, Math.PI / 4);
        } else if (item.type === 'shield') {
          // --- 2. BIG SHIELD POWER-UP (Luminous Azure Aegis Barrier Shield) ---
          const glowGrad = ctx.createRadialGradient(item.x, iy, 4, item.x, iy, 36);
          glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.75)');
          glowGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.3)');
          glowGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(item.x, iy, 36, 0, Math.PI * 2);
          ctx.fill();

          // Cobalt Aegis Shield
          ctx.fillStyle = '#0369A1';
          ctx.strokeStyle = '#38BDF8';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(item.x, iy - 18);
          ctx.lineTo(item.x + 16, iy - 9);
          ctx.lineTo(item.x + 16, iy + 8);
          ctx.lineTo(item.x, iy + 19);
          ctx.lineTo(item.x - 16, iy + 8);
          ctx.lineTo(item.x - 16, iy - 9);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Inner Shimmer Rune
          ctx.fillStyle = '#BAE6FD';
          ctx.beginPath();
          ctx.arc(item.x, iy - 1, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (item.type === 'bomb') {
          // --- 3. BIG BOMB POWER-UP (Glossy Obsidian Bomb with Fiery 12-point Spark & Radar Highlighting) ---
          drawCartoonBomb(ctx, item.x, iy, 1.15, timestamp, true);
        } else if (item.type === 'lightning_speed' || item.type === 'speed_boot') {
          // --- 4. BIG LIGHTNING BOLT ⚡ (Custom Stylized Electric Thunderbolt matching ⚡) ---
          drawCartoonLightningBolt(ctx, item.x, iy, 1.15, timestamp);
        } else if (item.type === 'coin') {
          // Gold Coin
          ctx.fillStyle = '#F59E0B';
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(item.x, iy, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(item.x, iy, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#B45309';
          ctx.beginPath();
          ctx.arc(item.x, iy - 1, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- 4. DRAW ENEMIES WITH LEVEL BADGES ---
      for (const enemy of stateRef.current.enemies) {
        if (enemy.isDead) continue;

        // Ground Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(enemy.x, enemy.y + enemy.radius * 0.85, enemy.radius * 0.95, enemy.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        if (enemy.hitFlashTimer > 0) {
          ctx.filter = 'brightness(2.4)';
        }

        const walkBounce = Math.sin(enemy.animFrame) * 2.5;

        if (enemy.type === 'zombie') {
          // Chibi Zombie
          ctx.translate(0, walkBounce);
          ctx.fillStyle = '#22C55E';
          ctx.strokeStyle = '#052E16';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -6, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(-5, -6, 3.5, 0, Math.PI * 2);
          ctx.arc(5, -6, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#14532D';
          ctx.beginPath();
          ctx.arc(-5, -6, 1.5, 0, Math.PI * 2);
          ctx.arc(5, -6, 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#052E16';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-8, -14);
          ctx.lineTo(-2, -14);
          ctx.moveTo(-5, -16);
          ctx.lineTo(-5, -12);
          ctx.stroke();
        } else if (enemy.type === 'stone_zombie') {
          // --- STONE ZOMBIE 🪨 (Heavy Granite Rock Armor, Sword Breaker, Chiseled Boulders) ---
          ctx.translate(0, walkBounce * 0.7);

          // Boulder Rock Shoulders & Back
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(-14, -7, 10, 0, Math.PI * 2);
          ctx.arc(14, -7, 10, 0, Math.PI * 2);
          ctx.arc(0, -18, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Chiseled Granite Head & Rock Plate Body
          ctx.fillStyle = '#64748B';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.roundRect(-16, -18, 32, 34, 6);
          ctx.fill();
          ctx.stroke();

          // Stone Texture Cracks
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-10, -12);
          ctx.lineTo(-2, -5);
          ctx.lineTo(-6, 4);
          ctx.moveTo(8, -14);
          ctx.lineTo(4, -6);
          ctx.lineTo(9, 2);
          ctx.stroke();

          // Mineral Veins (Grey/White Quartz Highlights)
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-9, -13);
          ctx.lineTo(-3, -6);
          ctx.moveTo(7, -13);
          ctx.lineTo(3, -7);
          ctx.stroke();

          // Deep Chiseled Rock Eye Sockets
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.roundRect(-11, -9, 8, 7, 2);
          ctx.roundRect(3, -9, 8, 7, 2);
          ctx.fill();

          // Piercing Amber Stone Eyes
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(-7, -5, 2.5, 0, Math.PI * 2);
          ctx.arc(7, -5, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Heavy Rock Jaw with jagged granite teeth
          ctx.fillStyle = '#475569';
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(-12, 6, 24, 10, 3);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#CBD5E1';
          ctx.fillRect(-8, 7, 4, 4);
          ctx.fillRect(4, 7, 4, 4);
          ctx.fillRect(-2, 11, 4, 4);
        } else if (enemy.type === 'ghost') {
          // Ghost
          ctx.fillStyle = 'rgba(165, 243, 252, 0.9)';
          ctx.strokeStyle = '#083344';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -4, 14, Math.PI, 0, false);
          ctx.lineTo(14, 10);
          ctx.lineTo(7, 6);
          ctx.lineTo(0, 12);
          ctx.lineTo(-7, 6);
          ctx.lineTo(-14, 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#0891B2';
          ctx.beginPath();
          ctx.arc(-4, -4, 2.5, 0, Math.PI * 2);
          ctx.arc(4, -4, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'demon') {
          // Demon
          ctx.translate(0, walkBounce);
          ctx.fillStyle = '#DC2626';
          ctx.strokeStyle = '#450A0A';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, -4, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#1C1917';
          ctx.beginPath();
          ctx.moveTo(-9, -11);
          ctx.lineTo(-14, -22);
          ctx.lineTo(-4, -16);
          ctx.closePath();
          ctx.moveTo(9, -11);
          ctx.lineTo(14, -22);
          ctx.lineTo(4, -16);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(-4, -4, 3, 0, Math.PI * 2);
          ctx.arc(4, -4, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'pumpkin') {
          // Pumpkin
          ctx.translate(0, walkBounce);
          ctx.fillStyle = '#EA580C';
          ctx.strokeStyle = '#431407';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.moveTo(-6, -4);
          ctx.lineTo(-2, -4);
          ctx.lineTo(-4, -8);
          ctx.closePath();
          ctx.moveTo(6, -4);
          ctx.lineTo(2, -4);
          ctx.lineTo(4, -8);
          ctx.closePath();
          ctx.fill();
        } else if (enemy.type === 'armored') {
          // Armored Knight
          ctx.translate(0, walkBounce);
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#020617';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(0, -6, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#64748B';
          ctx.beginPath();
          ctx.moveTo(-12, -12);
          ctx.lineTo(-20, -22);
          ctx.lineTo(-8, -18);
          ctx.closePath();
          ctx.moveTo(12, -12);
          ctx.lineTo(20, -22);
          ctx.lineTo(8, -18);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#EF4444';
          ctx.fillRect(-10, -8, 20, 4);
        } else {
          // Boss
          ctx.fillStyle = '#4C1D95';
          ctx.strokeStyle = '#020617';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, -8, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.moveTo(-18, -26);
          ctx.lineTo(-24, -42);
          ctx.lineTo(-10, -32);
          ctx.lineTo(0, -46);
          ctx.lineTo(10, -32);
          ctx.lineTo(24, -42);
          ctx.lineTo(18, -26);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#22D3EE';
          ctx.beginPath();
          ctx.arc(-9, -8, 4.5, 0, Math.PI * 2);
          ctx.arc(9, -8, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Level Badge
        const levelBadgeY = enemy.y - enemy.radius - 22;
        const isStone = enemy.type === 'stone_zombie';
        const lvlColor =
          isStone
            ? '#94A3B8'
            : enemy.level === 1
            ? '#22C55E'
            : enemy.level === 2
            ? '#38BDF8'
            : enemy.level === 3
            ? '#FBBF24'
            : enemy.level === 4
            ? '#F97316'
            : '#EF4444';

        const badgeText = enemy.isBoss
          ? `BOSS Lv.${enemy.level}`
          : isStone
          ? `🪨 STONE Lv.${enemy.level}`
          : `Lv.${enemy.level}`;

        ctx.save();
        ctx.font = '800 11px "Lilita One", sans-serif';
        ctx.textAlign = 'center';
        const textMetrics = ctx.measureText(badgeText);
        const badgeW = textMetrics.width + 12;
        const badgeH = 15;

        ctx.fillStyle = '#051209';
        ctx.strokeStyle = lvlColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(enemy.x - badgeW / 2, levelBadgeY - 11, badgeW, badgeH, 7);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = lvlColor;
        ctx.fillText(badgeText, enemy.x, levelBadgeY);
        ctx.restore();

        // Enemy Health Bar
        if (enemy.hp < enemy.maxHp) {
          const barW = Math.max(34, enemy.radius * 1.7);
          const barH = 5;
          const pct = Math.max(0, enemy.hp / enemy.maxHp);

          ctx.fillStyle = '#000000';
          ctx.fillRect(enemy.x - barW / 2 - 1, enemy.y - enemy.radius - 8, barW + 2, barH + 2);
          ctx.fillStyle = '#EF4444';
          ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.radius - 7, barW * pct, barH);
        }
      }

      // --- 5. PROJECTILES (FOCUSED RUBY BROADSWORD SLASHES) ---
      for (const proj of stateRef.current.projectiles) {
        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.angle);

        // Crimson energy slash shockwave
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.beginPath();
        ctx.arc(0, 0, 26, -Math.PI / 2, Math.PI / 2);
        ctx.fill();

        // Flying Ruby Broadsword
        drawRubyBroadsword(ctx, 4, 0, 1.25, Math.PI / 2);

        ctx.restore();
      }

      // --- 6. DRAW HERO: CHIBI SKELETON WITH SWORD IN HAND ---
      const { player } = stateRef.current;
      const walkOffset = Math.sin(player.walkTimer) * 3;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.ellipse(player.x, player.y + 24, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shield Aura
      if (shieldTimeRemaining > 0) {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 3.5;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
        ctx.beginPath();
        ctx.arc(player.x, player.y, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(player.x, player.y + walkOffset);

      if (player.invulnerableTimer > 0 && Math.floor(timestamp / 60) % 2 === 0) {
        ctx.filter = 'brightness(2.5)';
      }

      // Flip hero if facing left
      if (!player.facingRight) {
        ctx.scale(-1, 1);
      }

      // --- HERO BODY & CLOTHING ---
      // Red Scarf Bandana fluttering behind
      ctx.fillStyle = '#DC2626';
      ctx.strokeStyle = '#450A0A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-6, 10);
      ctx.lineTo(-24 + Math.sin(player.walkTimer * 0.8) * 4, 14);
      ctx.lineTo(-18, 20);
      ctx.lineTo(-4, 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Dark Tunic Armor
      ctx.fillStyle = '#0F291C';
      ctx.strokeStyle = '#05110A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-10, 10, 20, 15, 3);
      ctx.fill();
      ctx.stroke();

      // Gold Belt Buckle
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-3, 20, 6, 4);

      // Bony Legs & Feet
      ctx.fillStyle = '#F1F5F9';
      ctx.strokeStyle = '#0A120B';
      ctx.lineWidth = 2;
      const legOffset = Math.sin(player.walkTimer) * 4;
      ctx.fillRect(-8, 24, 5, 8 + legOffset);
      ctx.strokeRect(-8, 24, 5, 8 + legOffset);
      ctx.fillRect(3, 24, 5, 8 - legOffset);
      ctx.strokeRect(3, 24, 5, 8 - legOffset);

      // --- CHIBI SKULL HEAD ---
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0A120B';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, -6, 21, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Red Bandana Headband on Skull
      ctx.fillStyle = '#DC2626';
      ctx.strokeStyle = '#450A0A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-19, -23, 38, 9, 3);
      ctx.fill();
      ctx.stroke();

      // Teeth & Jaw
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(-8, 8, 16, 5);
      ctx.strokeRect(-8, 8, 16, 5);

      // Eye Sockets
      ctx.fillStyle = '#09150E';
      ctx.beginPath();
      ctx.arc(-7, -4, 5.5, 0, Math.PI * 2);
      ctx.arc(7, -4, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Cyan Pupils
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(-5, -4, 2.5, 0, Math.PI * 2);
      ctx.arc(9, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // --- SKELETON HAND HOLDING SWORD (Ruby Broadsword matching images 1) ---
      ctx.save();
      const handX = 14;
      const handY = 12;
      const swingAngle = player.swordHandSwing * 0.8 + Math.sin(player.walkTimer) * 0.15;
      ctx.translate(handX, handY);
      ctx.rotate(swingAngle);

      // Bony Arm
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0A120B';
      ctx.lineWidth = 2;
      ctx.fillRect(-3, -2, 6, 8);
      ctx.strokeRect(-3, -2, 6, 8);

      // Render Ruby Broadsword in Hero's hand
      drawRubyBroadsword(ctx, 0, 6, 0.95, Math.PI / 4 + 0.15);

      ctx.restore();

      ctx.restore();

      // --- 7. DRAW ORBITING SWORDS AROUND SKELETON (Ruby Broadswords matching images 1) ---
      const activeSwordCount = stateRef.current.currentSwords;
      if (activeSwordCount > 0) {
        for (let s = 0; s < activeSwordCount; s++) {
          const swordAngle = player.orbitAngle + (s * Math.PI * 2) / activeSwordCount;
          const sx = player.x + Math.cos(swordAngle) * player.swordOrbitRadius;
          const sy = player.y + Math.sin(swordAngle) * player.swordOrbitRadius;

          ctx.save();
          ctx.translate(sx, sy);

          // Render Ruby Broadsword orbiting cleanly without any green halo underneath
          drawRubyBroadsword(ctx, 0, 0, 0.95, swordAngle + Math.PI / 2);

          ctx.restore();
        }
      }

      // --- 8. DRAW PARTICLES ---
      for (const p of stateRef.current.particles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- 9. DRAW FLOATING TEXTS ---
      for (const f of stateRef.current.floatingTexts) {
        ctx.save();
        ctx.font = `900 ${f.size}px "Lilita One", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = f.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        ctx.strokeText(f.text, f.x, f.y);
        ctx.fillText(f.text, f.x, f.y);
        ctx.restore();
      }

      ctx.restore(); // Restore camera translation
      ctx.restore(); // Restore DPR scaling

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [
    isPaused,
    joystickVector,
    onCoinCollected,
    onGameOver,
    onSwordCountChange,
    onTimeUpdate,
    onWaveComplete,
    processEnemyDeath,
    setShieldTimeRemaining,
    setSpeedBoostTimeRemaining,
    shieldTimeRemaining,
    speedBoostTimeRemaining,
    swordDamage,
    targetAttackTrigger,
    wave,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block touch-none select-none pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};
