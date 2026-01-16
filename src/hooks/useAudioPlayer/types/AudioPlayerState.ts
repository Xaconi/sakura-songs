import type { Track } from '../../../data/types';

export interface AudioPlayerState {
  currentTrack: Track | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  hasInteracted: boolean;
}
