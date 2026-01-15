import SleepTimerBadge from '../SleepTimer/SleepTimerBadge';
import './Controls.css';

function Controls({
  isPlaying,
  isLoading,
  onToggle,
  onPrevScene,
  onNextScene,
  currentTrack,
  sceneName,
  onSleepTimerClick,
  sleepTimerActive,
  sleepTimerTime,
  sleepTimerIsFading,
  onSleepTimerCancel,
}) {
  return (
    <div className="controls">
      {/* Track info */}
      <div className="controls-info">
        <span className="controls-scene">{sceneName}</span>
        {currentTrack && (
          <span className="controls-track">
            {isLoading ? 'Cargando...' : currentTrack.title}
          </span>
        )}
      </div>

      {/* Main controls */}
      <div className="controls-buttons">
        {/* Previous Scene */}
        <button
          className="control-btn control-btn-nav"
          onClick={onPrevScene}
          aria-label="Escena anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          className="control-btn control-btn-main"
          onClick={onToggle}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isLoading ? (
            <div className="control-loader" />
          ) : isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Next Scene */}
        <button
          className="control-btn control-btn-nav"
          onClick={onNextScene}
          aria-label="Siguiente escena"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Sleep Timer Button */}
        <button
          className={`control-btn control-btn-timer ${sleepTimerActive ? 'active' : ''}`}
          onClick={onSleepTimerClick}
          aria-label={sleepTimerActive ? 'Ver temporizador de sueño' : 'Configurar temporizador de sueño'}
          aria-pressed={sleepTimerActive}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
          </svg>
        </button>
      </div>

      {/* Sleep Timer Badge */}
      {sleepTimerActive && (
        <SleepTimerBadge
          formattedTime={sleepTimerTime}
          isFading={sleepTimerIsFading}
          onCancel={onSleepTimerCancel}
        />
      )}

      {/* Swipe hint */}
      <div className="controls-hint">
        <span>Desliza para cambiar escena</span>
      </div>
    </div>
  );
}

export default Controls;
