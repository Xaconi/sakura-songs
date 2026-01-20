import { useEffect, useRef } from 'react';
import type { AmbientEffect } from '../../data/types';
import EffectItem from './EffectItem';
import './AmbientEffects.css';

interface AmbientEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  effects: AmbientEffect[];
  activeEffectId: string | null;
  isLoading: boolean;
  onToggleEffect: (effectId: string) => void;
  onVolumeChange: (effectId: string, volume: number) => void;
  getVolume: (effectId: string) => number;
}

export default function AmbientEffectsModal({
  isOpen,
  onClose,
  effects,
  activeEffectId,
  isLoading,
  onToggleEffect,
  onVolumeChange,
  getVolume,
}: AmbientEffectsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.querySelector<HTMLButtonElement>('.ambient-effect-item__toggle')?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="ambient-effects-modal__overlay"
          onClick={onClose}
          role="presentation"
        />
      )}
      <div
        ref={modalRef}
        className={`ambient-effects-modal ${isOpen ? 'ambient-effects-modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ambient-effects-title"
        aria-hidden={!isOpen}
      >
        <div className="ambient-effects-modal__header">
          <h2 id="ambient-effects-title">Sonidos ambiente</h2>
          <button
            className="ambient-effects-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="ambient-effects-modal__description">
          Selecciona un sonido ambiente para acompañar tu música
        </p>

        <div className="ambient-effects-modal__content">
          {effects.map((effect) => (
            <EffectItem
              key={effect.id}
              effect={effect}
              isActive={activeEffectId === effect.id}
              volume={getVolume(effect.id)}
              isLoading={isLoading && activeEffectId === effect.id}
              onToggle={() => onToggleEffect(effect.id)}
              onVolumeChange={(vol) => onVolumeChange(effect.id, vol)}
            />
          ))}
        </div>

        {activeEffectId && (
          <div className="ambient-effects-modal__active-indicator">
            <span className="ambient-effects-modal__active-dot" />
            Efecto activo: {effects.find(e => e.id === activeEffectId)?.name}
          </div>
        )}
      </div>
    </>
  );
}
