import type { AmbientEffect } from '../../data/types';

export interface AmbientEffectsState {
  activeEffectId: string | null;
  volumes: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

export interface AmbientEffectsActions {
  toggleEffect: (effectId: string) => void;
  setVolume: (effectId: string, volume: number) => void;
  stopAll: () => void;
  getVolume: (effectId: string) => number;
}

export interface AmbientEffectsHook extends AmbientEffectsState, AmbientEffectsActions {
  effects: AmbientEffect[];
}
