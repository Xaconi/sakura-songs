interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
}

export function NavButton({ direction, onClick }: NavButtonProps) {
  const isPrev = direction === 'prev';
  const label = isPrev ? 'Escena anterior' : 'Siguiente escena';
  return (
    <button
      className="controls__btn controls__btn--nav"
      onClick={onClick}
      aria-label={label}
      data-tooltip={label}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points={isPrev ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
      </svg>
    </button>
  );
}

interface PlayButtonProps {
  isPlaying: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export function PlayButton({ isPlaying, isLoading, onClick }: PlayButtonProps) {
  const label = isPlaying ? 'Pausar' : 'Reproducir';
  return (
    <button
      className="controls__btn controls__btn--main"
      onClick={onClick}
      disabled={isLoading}
      aria-label={label}
      data-tooltip={label}
    >
      {isLoading ? (
        <div className="controls__loader" />
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
  );
}

interface TimerButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export function TimerButton({ isActive, onClick }: TimerButtonProps) {
  return (
    <button
      className={`controls__btn controls__btn--timer ${isActive ? 'active' : ''}`}
      onClick={onClick}
      aria-label="Temporizador"
      aria-pressed={isActive}
      data-tooltip="Temporizador"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
      </svg>
    </button>
  );
}
