import type { AmbientEffect } from './types';
import { getAudioUrl } from '../config/cloudinary';

interface RawAmbientEffect {
  id: string;
  name: string;
  icon: string;
  filename: string;
}

const rawAmbientEffects: RawAmbientEffect[] = [
  { id: 'rain', name: 'Lluvia', icon: 'rain', filename: 'rain_k9p7lo.mp3' },
  { id: 'thunder', name: 'Tormenta', icon: 'thunder', filename: 'storm_mctbbw.mp3' },
  { id: 'wind', name: 'Viento', icon: 'wind', filename: 'wind_qaogtm.mp3' },
];

export const AMBIENT_EFFECTS: AmbientEffect[] = rawAmbientEffects.map((effect) => ({
  ...effect,
  src: getAudioUrl(effect.filename),
}));

export const DEFAULT_VOLUME = 50;
export const FADE_DURATION_MS = 500;
export const STORAGE_KEY = 'sakura-ambient-effects';

export function getEffectById(id: string): AmbientEffect | undefined {
  return AMBIENT_EFFECTS.find((effect) => effect.id === id);
}
