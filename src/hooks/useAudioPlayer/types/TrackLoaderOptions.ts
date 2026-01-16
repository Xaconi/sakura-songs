import type { HowlRefs } from './HowlRefs';

export interface TrackLoaderOptions {
  howlRefs: HowlRefs;
  currentTrackIndexRef: React.MutableRefObject<number>;
  setIsLoading: (loading: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentTrackIndex: (index: number) => void;
}
