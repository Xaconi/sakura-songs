import type { PresetButtonsProps } from '../../types';

export default function PresetButtons({ presets, onSelect }: PresetButtonsProps) {
  return (
    <div className="sleep-timer-modal__presets">
      <span className="sleep-timer-modal__label">Tiempo predefinido</span>
      <div className="sleep-timer-modal__preset-buttons">
        {presets.map((minutes) => (
          <button
            key={minutes}
            className="sleep-timer-modal__preset-btn"
            onClick={() => onSelect(minutes)}
          >
            {minutes} min
          </button>
        ))}
      </div>
    </div>
  );
}
