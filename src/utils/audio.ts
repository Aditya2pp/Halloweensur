// Web Audio API Procedural Sound Synthesizer for Mobile Game Feel
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private musicInterval: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (muted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMuted;
  }

  // Satisfying UI Button Click
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  // Upgrade Success Sound (Bright power-up arpeggio)
  public playUpgradeSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.04);

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.04);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.04 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.04);
      osc.stop(ctx.currentTime + i * 0.04 + 0.22);
    });
  }

  // Sword Slash / Upgrade Sound
  public playSwordClang() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.04);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  // Focused Targeted Sword Attack (Lunge / Super Slash)
  public playFocusedAttack() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Whoosh
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  }

  // Enemy Hit (Quick crunchy slice)
  public playHit() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  // Enemy Death / Vanish
  public playEnemyDeath() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  // Player Hurt (Bone rattle / warning)
  public playPlayerHurt() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.19);
  }

  // Coin Collect Ring
  public playCoinPickup() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [987.77, 1318.51]; // B5, E6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.13);
    });
  }

  // Sword Pickup Chime
  public playSwordPickup() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 1046.5]; // C5, E5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);

      gain.gain.setValueAtTime(0.22, ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.06);
      osc.stop(ctx.currentTime + i * 0.06 + 0.19);
    });
  }

  // Shield Pickup Magic Chime
  public playShieldPickup() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  }

  // Electric Lightning Bolt ⚡ Pickup Sound
  public playLightningPickup() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Fast high-pitch electric sizzle & arpeggio
    const notes = [659.25, 880.0, 1174.66, 1760.0];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.03);
      osc.frequency.linearRampToValueAtTime(freq * 1.5, ctx.currentTime + i * 0.03 + 0.05);

      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.03 + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.03);
      osc.stop(ctx.currentTime + i * 0.03 + 0.15);
    });
  }

  // Stone Zombie breaks player sword: Heavy stone thud + metallic blade shatter snap!
  public playSwordBroken() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // 1. Heavy stone crunch
    const rockOsc = ctx.createOscillator();
    const rockGain = ctx.createGain();
    rockOsc.type = 'triangle';
    rockOsc.frequency.setValueAtTime(140, ctx.currentTime);
    rockOsc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18);
    rockGain.gain.setValueAtTime(0.4, ctx.currentTime);
    rockGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    rockOsc.connect(rockGain);
    rockGain.connect(ctx.destination);
    rockOsc.start();
    rockOsc.stop(ctx.currentTime + 0.2);

    // 2. High metallic snap / fracture
    const metalOsc = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metalOsc.type = 'sawtooth';
    metalOsc.frequency.setValueAtTime(1200, ctx.currentTime);
    metalOsc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
    metalGain.gain.setValueAtTime(0.35, ctx.currentTime);
    metalGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    metalOsc.connect(metalGain);
    metalGain.connect(ctx.destination);
    metalOsc.start();
    metalOsc.stop(ctx.currentTime + 0.18);
  }

  // Potion Drink / Health Pickup Sound
  public playPotionDrink() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.16);
    });
  }

  // Sword Consumed on Enemy Kill
  public playSwordConsume() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.11);
  }

  // Boss Warning Roar
  public playBossWarning() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.4);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.85);
  }

  // Bomb Explosion (Deep sub boom + crackle)
  public playBombExplosion() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.45, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  // Wave Complete Fanfare
  public playWaveComplete() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chord = [523.25, 659.25, 783.99, 1046.5]; // C major fanfare
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
    });
  }

  // Not Enough Coins (Error buzz)
  public playError() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  // Play Button Launch (Deep cinematic impact & spooky bell)
  public playBattleStart() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Bass boom
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(140, ctx.currentTime);
    bassOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);

    bassGain.gain.setValueAtTime(0.4, ctx.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);

    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start();
    bassOsc.stop(ctx.currentTime + 0.7);

    // Spooky bell chime
    const bellOsc = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bellOsc.type = 'triangle';
    bellOsc.frequency.setValueAtTime(587.33, ctx.currentTime + 0.1); // D5

    bellGain.gain.setValueAtTime(0.3, ctx.currentTime + 0.1);
    bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    bellOsc.connect(bellGain);
    bellGain.connect(ctx.destination);
    bellOsc.start(ctx.currentTime + 0.1);
    bellOsc.stop(ctx.currentTime + 0.85);
  }

  // Ambient spooky music loop (Subtle atmospheric synth bells)
  public startMusic() {
    if (this.isMusicMuted || this.musicInterval) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const scale = [220, 261.63, 293.66, 329.63, 349.23, 440]; // A minor spooky vibe
    let step = 0;

    this.musicInterval = window.setInterval(() => {
      if (this.isMusicMuted || !this.ctx) return;
      try {
        const note = scale[step % scale.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.3);

        step = (step + 1) % scale.length;
      } catch {
        // audio context might be suspended
      }
    }, 1800);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundFx = new SoundEngine();
