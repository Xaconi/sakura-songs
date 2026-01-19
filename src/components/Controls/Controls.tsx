import { useState, useCallback } from 'react';
import type { Track } from '../../data/types';
import SleepTimerBadge from './components/SleepTimerBadge';
import { NavButton, PlayButton, TimerButton } from './components/ControlButtons';
import { ShareButton, type ShareMethod } from './components/ShareButton';
import { Toast } from '../Toast';
import './Controls.css';

interface ControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onToggle: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  currentTrack: Track | null;
  sceneName: string;
  sceneId: string;
  onSleepTimerClick: () => void;
  sleepTimerActive: boolean;
  sleepTimerTime: string;
  sleepTimerIsFading: boolean;
  onSleepTimerCancel: () => void;
}

export default function Controls({
  isPlaying, isLoading, onToggle, onPrevScene, onNextScene,
  currentTrack, sceneName, sceneId, onSleepTimerClick,
  sleepTimerActive, sleepTimerTime, sleepTimerIsFading, onSleepTimerCancel,
}: ControlsProps) {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const handleShareSuccess = useCallback((method: ShareMethod) => {
    const message = method === 'clipboard'
      ? 'Link copiado al portapapeles'
      : 'Escena compartida';
    setToast({ show: true, message, type: 'success' });
  }, []);

  const handleShareError = useCallback(() => {
    setToast({ show: true, message: 'No se pudo compartir', type: 'error' });
  }, []);

  const handleToastClose = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <div className="controls">
      <div className="controls__info">
        <span className="controls__scene">{sceneName}</span>
        {currentTrack && (
          <span className="controls__track">
            {isLoading ? 'Cargando...' : currentTrack.title}
          </span>
        )}
      </div>

      <div className="controls__buttons">
        <NavButton direction="prev" onClick={onPrevScene} />
        <PlayButton isPlaying={isPlaying} isLoading={isLoading} onClick={onToggle} />
        <NavButton direction="next" onClick={onNextScene} />
        <TimerButton isActive={sleepTimerActive} onClick={onSleepTimerClick} />
        <ShareButton
          sceneId={sceneId}
          sceneName={sceneName}
          onShareSuccess={handleShareSuccess}
          onShareError={handleShareError}
        />
      </div>

      {sleepTimerActive && (
        <SleepTimerBadge
          formattedTime={sleepTimerTime}
          isFading={sleepTimerIsFading}
          onCancel={onSleepTimerCancel}
        />
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}

      <div className="controls__hint">
        <span>Desliza para cambiar escena</span>
      </div>
    </div>
  );
}
