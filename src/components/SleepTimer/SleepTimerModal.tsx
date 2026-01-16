import { useEffect, useRef } from 'react';
import type { SleepTimerModalProps } from './types';
import PresetButtons from './components/PresetButtons';
import CustomTimeInput from './components/CustomTimeInput';
import { useModalLogic } from './useModalLogic';
import './SleepTimerModal.css';

export default function SleepTimerModal({
  isOpen, onClose, onStartTimer, presets, validateCustomTime,
}: SleepTimerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    customValue, customError,
    handlePresetClick, handleCustomChange, handleCustomStart, handleKeyDown,
  } = useModalLogic({ isOpen, onClose, onStartTimer, validateCustomTime });

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.querySelector<HTMLButtonElement>('.sleep-timer-modal__preset-btn')?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="sleep-timer-modal__overlay" onClick={onClose} role="presentation" />
      )}
      <div
        ref={modalRef}
        className={`sleep-timer-modal ${isOpen ? 'sleep-timer-modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sleep-timer-title"
        aria-hidden={!isOpen}
      >
        <div className="sleep-timer-modal__header">
          <h2 id="sleep-timer-title">Temporizador de sueño</h2>
          <button className="sleep-timer-modal__close" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="sleep-timer-modal__content">
          <PresetButtons presets={presets} onSelect={handlePresetClick} />
          <div className="sleep-timer-modal__divider"><span>o</span></div>
          <CustomTimeInput
            value={customValue}
            error={customError}
            onChange={handleCustomChange}
            onKeyDown={handleKeyDown}
            onStart={handleCustomStart}
            isDisabled={!customValue || !!customError}
          />
        </div>
      </div>
    </>
  );
}
