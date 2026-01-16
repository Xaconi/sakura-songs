import type { HowlRefs } from './HowlRefs';

export interface TrackLoaderOptions {
  howlRefs: HowlRefs;
  setIsLoading: (loading: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentTrackIndex: (index: number) => void;
}
