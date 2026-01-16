import type { CustomTimeInputProps } from '../../types';

export default function CustomTimeInput({
  value,
  error,
  onChange,
  onKeyDown,
  onStart,
  isDisabled,
}: CustomTimeInputProps) {
  return (
    <div className="sleep-timer-modal__custom">
      <label htmlFor="custom-time" className="sleep-timer-modal__label">
        Tiempo personalizado (minutos)
      </label>
      <div className="sleep-timer-modal__custom-row">
        <input
          id="custom-time"
          type="number"
          min="1"
          max="480"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Ej: 25"
          aria-invalid={!!error}
          aria-describedby={error ? 'custom-error' : undefined}
        />
        <button
          className="sleep-timer-modal__custom-btn"
          onClick={onStart}
          disabled={isDisabled}
        >
          Iniciar
        </button>
      </div>
      {error && (
        <span id="custom-error" className="sleep-timer-modal__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
