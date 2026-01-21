import { Howler, Howl } from 'howler';

type AudioContextState = 'suspended' | 'running' | 'closed' | 'unavailable';

interface PlaybackRecoveryResult {
  success: boolean;
  attempts: number;
  error?: string;
}

const RETRY_DELAYS_MS = [0, 100, 300];
const MAX_RETRIES = 3;
const PLAY_ATTEMPT_TIMEOUT_MS = 500;

const activeAttempts = new WeakMap<Howl, boolean>();

export function getAudioContextState(): AudioContextState {
  const ctx = Howler.ctx;
  if (!ctx) return 'unavailable';
  return ctx.state as AudioContextState;
}

export async function resumeAudioContext(): Promise<boolean> {
  const ctx = Howler.ctx;
  if (!ctx) return false;

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
      return ctx.state === 'running';
    } catch {
      return false;
    }
  }

  return ctx.state === 'running';
}

async function attemptPlay(howl: Howl): Promise<boolean> {
  return new Promise((resolve) => {
    const state = howl.state();
    if (state === 'unloaded') {
      resolve(false);
      return;
    }

    const playId = howl.play();

    if (typeof playId === 'number' && playId >= 0) {
      resolve(true);
      return;
    }

    let resolved = false;

    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        howl.off('play', onPlay);
        howl.off('playerror', onError);
      }
    };

    const onPlay = () => {
      cleanup();
      clearTimeout(timeout);
      resolve(true);
    };

    const onError = () => {
      cleanup();
      clearTimeout(timeout);
      resolve(false);
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve(false);
    }, PLAY_ATTEMPT_TIMEOUT_MS);

    howl.once('play', onPlay);
    howl.once('playerror', onError);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function safePlay(howl: Howl | null): Promise<PlaybackRecoveryResult> {
  if (!howl) {
    return { success: false, attempts: 0, error: 'No Howl instance provided' };
  }

  if (activeAttempts.get(howl)) {
    return { success: false, attempts: 0, error: 'Play already in progress' };
  }

  activeAttempts.set(howl, true);

  try {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        await delay(RETRY_DELAYS_MS[attempt] || 300);
      }

      if (howl.state() === 'unloaded') {
        return {
          success: false,
          attempts: attempt + 1,
          error: 'Howl instance was unloaded'
        };
      }

      const contextResumed = await resumeAudioContext();
      if (!contextResumed && getAudioContextState() === 'suspended') {
        continue;
      }

      const playSuccess = await attemptPlay(howl);
      if (playSuccess) {
        return { success: true, attempts: attempt + 1 };
      }
    }

    const state = getAudioContextState();
    return {
      success: false,
      attempts: MAX_RETRIES,
      error: `Failed after ${MAX_RETRIES} retries. AudioContext: ${state}`
    };
  } finally {
    activeAttempts.delete(howl);
  }
}

export function usePlaybackRecovery() {
  return {
    safePlay,
    resumeAudioContext,
    getAudioContextState,
  };
}
