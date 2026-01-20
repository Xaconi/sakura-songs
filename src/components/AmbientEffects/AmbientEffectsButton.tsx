interface AmbientEffectsButtonProps {
  onClick: () => void;
  isActive: boolean;
  showNewBadge?: boolean;
}

export default function AmbientEffectsButton({
  onClick,
  isActive,
  showNewBadge = false,
}: AmbientEffectsButtonProps) {
  return (
    <button
      className={`ambient-effects-button ${isActive ? 'ambient-effects-button--active' : ''}`}
      onClick={onClick}
      aria-label={`Sonidos ambiente ${isActive ? '(activo)' : ''}`}
      title="Sonidos ambiente"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19c-4.3 1.4-8-1-8-5 0-3.3 2.7-6 6-6h12c3.3 0 6 2.7 6 6 0 4-3.7 6.4-8 5" strokeLinecap="round" />
        <path d="M9 19v-2m0-8V7m6 12v-2m0-8V7" strokeLinecap="round" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
      </svg>
      {isActive && <span className="ambient-effects-button__indicator" />}
      {showNewBadge && <span className="ambient-effects-button__badge">Nuevo</span>}
    </button>
  );
}
