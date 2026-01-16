import type { Track } from '../../data/types';
import SleepTimerBadge from './components/SleepTimerBadge';
import { NavButton, PlayButton, TimerButton } from './components/ControlButtons';
import './Controls.css';

interface ControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  onToggle: () => void;
  onPrevScene: () => void;
  onNextScene: () => void;
  currentTrack: Track | null;
  sceneName: string;
  onSleepTimerClick: () => void;
  sleepTimerActive: boolean;
  sleepTimerTime: string;
  sleepTimerIsFading: boolean;
  onSleepTimerCancel: () => void;
}

export default function Controls({
  isPlaying, isLoading, onToggle, onPrevScene, onNextScene,
  currentTrack, sceneName, onSleepTimerClick,
  sleepTimerActive, sleepTimerTime, sleepTimerIsFading, onSleepTimerCancel,
}: ControlsProps) {
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
      </div>

      {sleepTimerActive && (
        <SleepTimerBadge
          formattedTime={sleepTimerTime}
          isFading={sleepTimerIsFading}
          onCancel={onSleepTimerCancel}
        />
      )}

      <div className="controls__hint">
        <span>Desliza para cambiar escena</span>
      </div>
    </div>
  );
}
