import { useCallback } from 'react';
import type { HowlRefs } from './types';

interface UseFadeOutOptions {
  howlRefs: HowlRefs;
  stop: () => void;
}

export function useFadeOut({ howlRefs, stop }: UseFadeOutOptions) {
  const fadeOut = useCallback((durationMs = 5000, onComplete?: () => void) => {
    const { howlRef, fadeIntervalRef } = howlRefs;

    if (!howlRef.current) {
      onComplete?.();
      return;
    }

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const currentVolume = howlRef.current.volume();
    const steps = 50;
    const stepDuration = durationMs / steps;
    const volumeDecrement = currentVolume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = Math.max(0, currentVolume - (volumeDecrement * currentStep));

      if (howlRef.current) {
        howlRef.current.volume(newVolume);
      }

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        stop();
        onComplete?.();
      }
    }, stepDuration);
  }, [howlRefs, stop]);

  return fadeOut;
}
