import { useCallback } from 'react';
import type { Track } from '../../data/types';
import type { HowlRefs } from './types';

interface UsePlaybackControlsOptions {
  howlRefs: HowlRefs;
  tracksRef: React.MutableRefObject<Track[]>;
  currentTrackIndex: number;
  isPlaying: boolean;
  loadTrack: (tracks: Track[], index: number, autoplay: boolean) => void;
  setCurrentTrackIndex: (index: number) => void;
  setHasInteracted: (value: boolean) => void;
}

export function usePlaybackControls(options: UsePlaybackControlsOptions) {
  const {
    howlRefs, tracksRef, currentTrackIndex, isPlaying,
    loadTrack, setCurrentTrackIndex, setHasInteracted,
  } = options;

  const play = useCallback(() => {
    setHasInteracted(true);
    if (howlRefs.howlRef.current && !howlRefs.isLoadingRef.current) {
      howlRefs.howlRef.current.play();
    } else if (tracksRef.current?.length) {
      loadTrack(tracksRef.current, currentTrackIndex, true);
    }
  }, [currentTrackIndex, loadTrack, howlRefs, tracksRef, setHasInteracted]);

  const pause = useCallback(() => {
    howlRefs.howlRef.current?.pause();
  }, [howlRefs]);

  const toggle = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    if (!tracksRef.current?.length) return;
    const next = (currentTrackIndex + 1) % tracksRef.current.length;
    setCurrentTrackIndex(next);
    loadTrack(tracksRef.current, next, isPlaying);
  }, [currentTrackIndex, isPlaying, loadTrack, tracksRef, setCurrentTrackIndex]);

  const prevTrack = useCallback(() => {
    if (!tracksRef.current?.length) return;
    const prev = currentTrackIndex === 0
      ? tracksRef.current.length - 1
      : currentTrackIndex - 1;
    setCurrentTrackIndex(prev);
    loadTrack(tracksRef.current, prev, isPlaying);
  }, [currentTrackIndex, isPlaying, loadTrack, tracksRef, setCurrentTrackIndex]);

  return { play, pause, toggle, nextTrack, prevTrack };
}
