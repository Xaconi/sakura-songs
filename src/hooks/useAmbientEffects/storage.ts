import { STORAGE_KEY, DEFAULT_VOLUME, AMBIENT_EFFECTS } from '../../data/ambientEffects';
import type { AmbientEffectsState } from './types';

interface StoredState {
  activeEffectId: string | null;
  volumes: Record<string, number>;
}

function getDefaultVolumes(): Record<string, number> {
  return AMBIENT_EFFECTS.reduce((acc, effect) => {
    acc[effect.id] = DEFAULT_VOLUME;
    return acc;
  }, {} as Record<string, number>);
}

export function loadStoredState(): Pick<AmbientEffectsState, 'activeEffectId' | 'volumes'> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { activeEffectId: null, volumes: getDefaultVolumes() };
    }
    const parsed: StoredState = JSON.parse(stored);
    return {
      activeEffectId: parsed.activeEffectId ?? null,
      volumes: { ...getDefaultVolumes(), ...parsed.volumes },
    };
  } catch {
    return { activeEffectId: null, volumes: getDefaultVolumes() };
  }
}

export function saveState(state: Pick<AmbientEffectsState, 'activeEffectId' | 'volumes'>): void {
  try {
    const toStore: StoredState = {
      activeEffectId: state.activeEffectId,
      volumes: state.volumes,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Silently fail if localStorage is not available
  }
}
