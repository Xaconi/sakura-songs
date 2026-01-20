import type { AmbientEffect } from '../../data/types';

interface EffectItemProps {
  effect: AmbientEffect;
  isActive: boolean;
  volume: number;
  isLoading: boolean;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
}

const EFFECT_ICONS: Record<string, string> = {
  rain: 'M12 2C9.11 2 6.6 3.64 5.35 6.04C2.34 6.36 0 8.91 0 12c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96C18.67 4.59 15.64 2 12 2zm-2 15.5v-3l-3 3h2.5l.5.5v2.5l3-3h-2.5l-.5-.5z',
  thunder: 'M19 16.9l-7-4-7 4V1l7 4 7-4v15.9zM12 5L7 8v7l5-3 5 3V8l-5-3zm0 9.5L8.5 12l1.5-1 2 1.5 2-1.5 1.5 1-3.5 2.5z',
  wind: 'M12.5 2C9.64 2 7.25 4.02 6.67 6.75c-.06.28.03.57.23.78.2.21.48.32.76.29 2.2-.22 4.34.62 5.86 2.14.76.76 1.29 1.68 1.58 2.66.29.98.34 2.02.14 3.03-.24 1.2-.84 2.29-1.7 3.15-.86.86-1.95 1.46-3.15 1.7-1.2.24-2.46.16-3.58-.24-1.12-.4-2.1-1.09-2.85-1.98a6.5 6.5 0 01-1.45-3.28H0a9 9 0 002.08 4.78 9 9 0 004.17 2.9 9 9 0 005.25.35 9 9 0 004.61-2.49 9 9 0 002.49-4.61 9 9 0 00-.35-5.25 9 9 0 00-2.9-4.17A9 9 0 0012.5 2z',
  fire: 'M12 23c-4.97 0-9-4.03-9-9 0-3.53 2.04-6.58 5-8.03V4c0-.55.45-1 1-1s1 .45 1 1v2.05A8.959 8.959 0 0112 5c1.05 0 2.07.18 3.01.52A6.991 6.991 0 0012 12c0 2.21 1.03 4.18 2.63 5.47A8.954 8.954 0 0112 23zm0-16c-3.87 0-7 3.13-7 7s3.13 7 7 7a6.98 6.98 0 004.94-2.06A5.99 5.99 0 0114 12c0-2.38 1.39-4.43 3.4-5.4A6.98 6.98 0 0012 7z',
  birds: 'M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  waves: 'M2 12c2-3 5-5 10-5s8 2 10 5c-2 3-5 5-10 5s-8-2-10-5zm0 4.5c2-1.5 5-2.5 10-2.5s8 1 10 2.5M2 7.5C4 6 7 5 12 5s8 1 10 2.5',
};

export default function EffectItem({
  effect,
  isActive,
  volume,
  isLoading,
  onToggle,
  onVolumeChange,
}: EffectItemProps) {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number(e.target.value));
  };

  return (
    <div className={`ambient-effect-item ${isActive ? 'ambient-effect-item--active' : ''}`}>
      <button
        className="ambient-effect-item__toggle"
        onClick={onToggle}
        disabled={isLoading}
        aria-pressed={isActive}
        aria-label={`${effect.name} ${isActive ? 'activado' : 'desactivado'}`}
      >
        <span className="ambient-effect-item__icon">
          {isLoading ? (
            <svg className="ambient-effect-item__spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d={EFFECT_ICONS[effect.icon] || EFFECT_ICONS.rain} />
            </svg>
          )}
        </span>
        <span className="ambient-effect-item__name">{effect.name}</span>
      </button>

      <div className="ambient-effect-item__volume">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          disabled={!isActive}
          aria-label={`Volumen de ${effect.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={volume}
        />
        <span className="ambient-effect-item__volume-value">{volume}%</span>
      </div>
    </div>
  );
}
