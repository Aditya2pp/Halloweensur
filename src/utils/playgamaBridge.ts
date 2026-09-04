// Official Playgama Bridge SDK Integration using Core Plain JS
import { soundFx } from './audio';

export interface PlaygamaBridge {
  version: string;
  isInitialized: boolean;
  initialize: (options?: unknown) => Promise<void>;
  platform: {
    sendMessage: (message: string) => void;
    [key: string]: unknown;
  };
  advertisement: {
    isInterstitialSupported: boolean | (() => boolean);
    isRewardedSupported: boolean | (() => boolean);
    minimumDelayBetweenInterstitial: number;
    interstitialState: string;
    rewardedState: string;
    showInterstitial: (placement?: string) => void | Promise<void>;
    showRewarded: (placement?: string) => void | Promise<void>;
    on: (eventName: string, callback: (state: string) => void) => void;
    [key: string]: unknown;
  };
  EVENT_NAME: {
    INTERSTITIAL_STATE_CHANGED: string;
    REWARDED_STATE_CHANGED: string;
    [key: string]: string;
  };
  INTERSTITIAL_STATE: {
    LOADING: string;
    OPENED: string;
    CLOSED: string;
    FAILED: string;
  };
  REWARDED_STATE: {
    LOADING: string;
    OPENED: string;
    CLOSED: string;
    REWARDED: string;
    FAILED: string;
  };
}

declare global {
  interface Window {
    bridge?: PlaygamaBridge;
    playgamaBridge?: PlaygamaBridge;
  }
}

// Track initialization state
let isBridgeInitialized = false;
let initPromise: Promise<boolean> | null = null;
let lastInterstitialTimestamp = 0;

/**
 * 1. INITIALIZATION
 * - Initialize Playgama Bridge before using SDK features.
 * - After initialization, send: bridge.platform.sendMessage("game_ready")
 */
export async function initPlaygamaBridge(): Promise<boolean> {
  if (isBridgeInitialized) return true;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Find bridge instance on window (created by playgama-bridge.js)
      let bridge = window.bridge || window.playgamaBridge;

      // If script is still executing, poll briefly (up to 2 seconds)
      if (!bridge) {
        for (let i = 0; i < 20; i++) {
          await new Promise((res) => setTimeout(res, 100));
          bridge = window.bridge || window.playgamaBridge;
          if (bridge) break;
        }
      }

      if (!bridge) {
        console.warn('[Playgama Bridge] SDK script not detected on window.');
        return false;
      }

      if (!bridge.isInitialized) {
        await bridge.initialize();
      }

      isBridgeInitialized = true;

      // Mandatory platform readiness notification
      if (bridge.platform && typeof bridge.platform.sendMessage === 'function') {
        bridge.platform.sendMessage('game_ready');
        console.info('[Playgama Bridge] Sent "game_ready" message to platform.');
      }

      return true;
    } catch (err) {
      console.warn('[Playgama Bridge] Initialization exception (continuing normally):', err);
      return false;
    }
  })();

  return initPromise;
}

/**
 * Helper to get active bridge instance if ready
 */
function getActiveBridge(): PlaygamaBridge | null {
  const bridge = window.bridge || window.playgamaBridge;
  if (!bridge || !bridge.isInitialized || !bridge.advertisement) {
    return null;
  }
  return bridge;
}

/**
 * Check if interstitial advertisement is supported and ready
 */
export function isInterstitialSupported(): boolean {
  const bridge = getActiveBridge();
  if (!bridge) return false;
  const val = bridge.advertisement.isInterstitialSupported;
  return typeof val === 'function' ? val() : Boolean(val);
}

/**
 * Check if the SDK allows showing an interstitial right now (respecting minimum delay)
 */
export function canShowInterstitial(): boolean {
  if (!isInterstitialSupported()) return false;
  const bridge = getActiveBridge();
  if (!bridge) return false;

  const minDelaySec = bridge.advertisement.minimumDelayBetweenInterstitial ?? 60;
  const elapsedSec = (Date.now() - lastInterstitialTimestamp) / 1000;

  if (lastInterstitialTimestamp > 0 && elapsedSec < minDelaySec) {
    return false;
  }

  return true;
}

/**
 * 2. INTERSTITIAL
 * When PLAY is clicked:
 * - Check bridge.advertisement.isInterstitialSupported.
 * - Show interstitial only when it can actually be shown and the SDK allows it.
 * - After ad closes OR if unavailable/unsupported/failed, start the game immediately.
 * - Never make the player wait for an unavailable ad.
 * - Respect Playgama's minimum interstitial delay.
 * - Pause/mute gameplay while the ad is open and restore it after closing/failure.
 */
export function showPlayInterstitial(onFinished: () => void): void {
  // If not supported or SDK does not allow it yet, start game immediately
  if (!canShowInterstitial()) {
    onFinished();
    return;
  }

  const bridge = getActiveBridge();
  if (!bridge) {
    onFinished();
    return;
  }

  let isComplete = false;
  const prevMuted = soundFx.getIsMuted();
  const prevMusicMuted = soundFx.getIsMusicMuted();

  const handleDone = () => {
    if (isComplete) return;
    isComplete = true;
    clearTimeout(safetyTimer);

    // Restore gameplay sound & music states
    soundFx.setMuted(prevMuted);
    soundFx.setMusicMuted(prevMusicMuted);

    // Start game immediately
    onFinished();
  };

  // Safety watchdog: Never make player wait if ad fails to load or open within 3 seconds
  let safetyTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    handleDone();
  }, 3000);

  // Subscribe to interstitial state change
  const eventName = bridge.EVENT_NAME?.INTERSTITIAL_STATE_CHANGED || 'interstitial_state_changed';
  const stateHandler = (state: string) => {
    const s = (state || '').toLowerCase();
    if (s === 'opened') {
      // Pause/mute gameplay while the ad is open
      soundFx.setMuted(true);
      soundFx.setMusicMuted(true);

      // Ad opened successfully - clear startup timeout
      if (safetyTimer) {
        clearTimeout(safetyTimer);
        safetyTimer = null;
      }
      // Set safety timeout for ad duration (e.g. 60 seconds max) in case ad gets stuck
      setTimeout(() => {
        handleDone();
      }, 60000);
    } else if (s === 'closed' || s === 'failed') {
      lastInterstitialTimestamp = Date.now();
      handleDone();
    }
  };

  if (typeof bridge.advertisement.on === 'function') {
    bridge.advertisement.on(eventName, stateHandler);
  }

  try {
    bridge.advertisement.showInterstitial('play');
  } catch (err) {
    console.warn('[Playgama Bridge] showInterstitial failed (continuing immediately):', err);
    handleDone();
  }
}

/**
 * Check if rewarded video advertisement is supported
 */
export function isRewardedSupported(): boolean {
  const bridge = getActiveBridge();
  if (!bridge) return false;
  const val = bridge.advertisement.isRewardedSupported;
  return typeof val === 'function' ? val() : Boolean(val);
}

/**
 * 3. REWARDED COINS & 4. GAME OVER BONUS
 * When clicked:
 * - Check bridge.advertisement.isRewardedSupported.
 * - Call bridge.advertisement.showRewarded(placement)
 * - Give reward ONLY when: bridge.advertisement.rewardedState === "rewarded"
 * - Closing/failing the ad gives 0 coins.
 * - Never reward twice from the same ad.
 * - Returns true if ad display flow was initiated, false if unavailable.
 */
export function showRewardedAd(
  placement: string,
  onReward: () => void,
  onComplete?: () => void
): boolean {
  if (!isRewardedSupported()) {
    onComplete?.();
    return false;
  }

  const bridge = getActiveBridge();
  if (!bridge) {
    onComplete?.();
    return false;
  }

  let hasRewarded = false;
  let isDone = false;

  const prevMuted = soundFx.getIsMuted();
  const prevMusicMuted = soundFx.getIsMusicMuted();

  const handleFinish = () => {
    if (isDone) return;
    isDone = true;
    clearTimeout(safetyTimer);

    // Restore sound settings
    soundFx.setMuted(prevMuted);
    soundFx.setMusicMuted(prevMusicMuted);

    onComplete?.();
  };

  // Safety timer for ad lifecycle
  const safetyTimer = setTimeout(() => {
    handleFinish();
  }, 180000); // 3 minutes timeout

  const eventName = bridge.EVENT_NAME?.REWARDED_STATE_CHANGED || 'rewarded_state_changed';
  const stateHandler = (state: string) => {
    const s = (state || '').toLowerCase();
    if (s === 'opened') {
      // Pause/mute audio while ad is active
      soundFx.setMuted(true);
      soundFx.setMusicMuted(true);
    } else if (s === 'rewarded' || bridge.advertisement.rewardedState === 'rewarded') {
      // Give +500 coins ONLY when rewardedState === "rewarded"
      // Guard against rewarding twice from the same ad
      if (!hasRewarded) {
        hasRewarded = true;
        onReward();
      }
    } else if (s === 'closed' || s === 'failed') {
      // Closing/failing the ad without "rewarded" state gives 0 coins
      handleFinish();
    }
  };

  if (typeof bridge.advertisement.on === 'function') {
    bridge.advertisement.on(eventName, stateHandler);
  }

  try {
    bridge.advertisement.showRewarded(placement);
    return true;
  } catch (err) {
    console.warn('[Playgama Bridge] showRewarded error (continuing):', err);
    handleFinish();
    return false;
  }
}
