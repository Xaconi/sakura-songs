export interface AudioPlayerActions {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  clearError: () => void;
  stop: () => void;
  fadeOut: (durationMs?: number, onComplete?: () => void) => void;
}
