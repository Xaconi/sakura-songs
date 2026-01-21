import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl } from 'howler';
import { AMBIENT_EFFECTS, FADE_DURATION_MS, DEFAULT_VOLUME } from '../../data/ambientEffects';
import { loadStoredState, saveState } from './storage';
import { safePlay, resumeAudioContext } from '../useAudioPlayer/usePlaybackRecovery';
import type { AmbientEffectsHook } from './types';

export default function useAmbientEffects(): AmbientEffectsHook {
  const [activeEffectId, setActiveEffectId] = useState<string | null>(null);
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const howlRef = useRef<Howl | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isInitializedRef = useRef(false);

  // Load stored state on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const stored = loadStoredState();
    setVolumes(stored.volumes);
    // Don't auto-play on mount, just restore volume settings
    // activeEffectId will be restored but not played until user interacts
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (!isInitializedRef.current) return;
    saveState({ activeEffectId, volumes });
  }, [activeEffectId, volumes]);

  const cleanupHowl = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }
  }, []);

  const fadeIn = useCallback(async (howl: Howl, targetVolume: number) => {
    const steps = 25;
    const stepDuration = FADE_DURATION_MS / steps;
    const volumeIncrement = targetVolume / steps;
    let currentStep = 0;

    howl.volume(0);
    const result = await safePlay(howl);

    if (!result.success) {
      setError('No se pudo reproducir el efecto. Intenta de nuevo.');
      return;
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = Math.min(targetVolume, volumeIncrement * currentStep);
      howl.volume(newVolume);

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      }
    }, stepDuration);
  }, []);

  const fadeOut = useCallback((onComplete?: () => void) => {
    if (!howlRef.current) {
      onComplete?.();
      return;
    }

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const currentVolume = howlRef.current.volume();
    const steps = 25;
    const stepDuration = FADE_DURATION_MS / steps;
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
        cleanupHowl();
        onComplete?.();
      }
    }, stepDuration);
  }, [cleanupHowl]);

  const loadAndPlayEffect = useCallback((effectId: string) => {
    const effect = AMBIENT_EFFECTS.find(e => e.id === effectId);
    if (!effect?.src) {
      setError(`Effect ${effectId} not found`);
      return;
    }

    setIsLoading(true);
    setError(null);

    const volume = (volumes[effectId] ?? DEFAULT_VOLUME) / 100;

    const howl = new Howl({
      src: [effect.src],
      loop: true,
      volume: 0,
      onload: () => {
        setIsLoading(false);
        fadeIn(howl, volume);
      },
      onloaderror: (_id, errorMsg) => {
        setIsLoading(false);
        setError(`Failed to load ${effect.name}: ${errorMsg}`);
        cleanupHowl();
        setActiveEffectId(null);
      },
      onplayerror: async () => {
        const resumed = await resumeAudioContext();
        if (resumed && howl.state() !== 'unloaded') {
          const result = await safePlay(howl);
          if (result.success) return;
        }
        setIsLoading(false);
        setError('Error al reproducir efecto. Intenta de nuevo.');
      },
    });

    howlRef.current = howl;
  }, [volumes, fadeIn, cleanupHowl]);

  const toggleEffect = useCallback((effectId: string) => {
    if (activeEffectId === effectId) {
      // Deactivate current effect
      fadeOut(() => {
        setActiveEffectId(null);
      });
    } else {
      // Switch to new effect
      if (howlRef.current) {
        fadeOut(() => {
          setActiveEffectId(effectId);
          loadAndPlayEffect(effectId);
        });
      } else {
        setActiveEffectId(effectId);
        loadAndPlayEffect(effectId);
      }
    }
  }, [activeEffectId, fadeOut, loadAndPlayEffect]);

  const setVolume = useCallback((effectId: string, volume: number) => {
    const clampedVolume = Math.max(0, Math.min(100, volume));

    setVolumes(prev => ({
      ...prev,
      [effectId]: clampedVolume,
    }));

    // Update playing audio if this is the active effect
    if (activeEffectId === effectId && howlRef.current) {
      howlRef.current.volume(clampedVolume / 100);
    }
  }, [activeEffectId]);

  const getVolume = useCallback((effectId: string): number => {
    return volumes[effectId] ?? DEFAULT_VOLUME;
  }, [volumes]);

  const stopAll = useCallback(() => {
    fadeOut(() => {
      setActiveEffectId(null);
    });
  }, [fadeOut]);

  // Pre-resume AudioContext when returning to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resumeAudioContext();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupHowl();
    };
  }, [cleanupHowl]);

  return {
    effects: AMBIENT_EFFECTS,
    activeEffectId,
    volumes,
    isLoading,
    error,
    toggleEffect,
    setVolume,
    stopAll,
    getVolume,
  };
}

export type { AmbientEffectsHook } from './types';
