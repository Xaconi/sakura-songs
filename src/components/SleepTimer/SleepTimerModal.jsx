import { useState, useEffect, useRef, useCallback } from 'react';
import './SleepTimerModal.css';

function SleepTimerModal({
  isOpen,
  onClose,
  onStartTimer,
  presets,
  validateCustomTime,
}) {
  const [customValue, setCustomValue] = useState('');
  const [customError, setCustomError] = useState(null);
  const modalRef = useRef(null);

  const handlePresetClick = useCallback((minutes) => {
    onStartTimer(minutes);
    onClose();
  }, [onStartTimer, onClose]);

  const handleCustomChange = useCallback((e) => {
    const value = e.target.value;
    setCustomValue(value);

    if (value) {
      const validation = validateCustomTime(value);
      setCustomError(validation.valid ? null : validation.error);
    } else {
      setCustomError(null);
    }
  }, [validateCustomTime]);

  const handleCustomStart = useCallback(() => {
    if (!customValue || customError) return;

    const minutes = parseInt(customValue, 10);
    onStartTimer(minutes);
    setCustomValue('');
    setCustomError(null);
    onClose();
  }, [customValue, customError, onStartTimer, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !customError && customValue) {
      handleCustomStart();
    }
  }, [customError, customValue, handleCustomStart]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstButton = modalRef.current.querySelector('.preset-btn');
      firstButton?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCustomValue('');
      setCustomError(null);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="sleep-timer-overlay"
          onClick={onClose}
          role="presentation"
        />
      )}

      <div
        ref={modalRef}
        className={`sleep-timer-modal ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sleep-timer-title"
        aria-hidden={!isOpen}
      >
        <div className="sleep-timer-header">
          <h2 id="sleep-timer-title">Temporizador de sueño</h2>
          <button
            className="sleep-timer-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sleep-timer-content">
          <div className="sleep-timer-presets">
            <span className="sleep-timer-label">Tiempo predefinido</span>
            <div className="preset-buttons">
              {presets.map((minutes) => (
                <button
                  key={minutes}
                  className="preset-btn"
                  onClick={() => handlePresetClick(minutes)}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          <div className="sleep-timer-divider">
            <span>o</span>
          </div>

          <div className="sleep-timer-custom">
            <label htmlFor="custom-time" className="sleep-timer-label">
              Tiempo personalizado (minutos)
            </label>
            <div className="custom-input-row">
              <input
                id="custom-time"
                type="number"
                min="1"
                max="480"
                value={customValue}
                onChange={handleCustomChange}
                onKeyDown={handleKeyDown}
                placeholder="Ej: 25"
                aria-invalid={!!customError}
                aria-describedby={customError ? 'custom-error' : undefined}
              />
              <button
                className="custom-start-btn"
                onClick={handleCustomStart}
                disabled={!customValue || !!customError}
              >
                Iniciar
              </button>
            </div>
            {customError && (
              <span id="custom-error" className="custom-error" role="alert">
                {customError}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SleepTimerModal;
