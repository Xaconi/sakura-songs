import './SleepTimerBadge.css';

function SleepTimerBadge({
  formattedTime,
  isFading,
  onCancel,
}) {
  return (
    <div className={`sleep-timer-badge ${isFading ? 'fading' : ''}`}>
      <span className="badge-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
        </svg>
      </span>

      <span className="badge-time" aria-live="polite">
        {isFading ? 'Apagando...' : formattedTime}
      </span>

      {!isFading && (
        <button
          className="badge-btn badge-btn-cancel"
          onClick={onCancel}
          aria-label="Cancelar temporizador"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SleepTimerBadge;
