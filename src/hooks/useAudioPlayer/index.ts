import { useState, useEffect, useCallback, useRef } from 'react';
import type { Track } from '../../data/types';
import type { AudioPlayerHook } from './types';
import { useHowlInstance, cleanupHowl } from './useHowlInstance';
import { useTrackLoader } from './useTrackLoader';
import { useFadeOut } from './useFadeOut';
import { usePlaybackControls } from './usePlaybackControls';
import { resumeAudioContext } from './usePlaybackRecovery';

export default function useAudioPlayer(
  tracks: Track[],
  sceneId: string | null = null
): AudioPlayerHook {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const prevSceneIdRef = useRef(sceneId);
  const currentTrackIndexRef = useRef(0);
  const howlRefs = useHowlInstance();

  const stop = useCallback(() => {
    if (howlRefs.fadeIntervalRef.current) {
      clearInterval(howlRefs.fadeIntervalRef.current);
      howlRefs.fadeIntervalRef.current = null;
    }
    if (howlRefs.howlRef.current) {
      howlRefs.howlRef.current.stop();
      howlRefs.howlRef.current.volume(0.7);
    }
    setIsPlaying(false);
  }, [howlRefs]);

  const { loadTrack, tracksRef } = useTrackLoader({
    howlRefs, currentTrackIndexRef, setIsLoading, setIsPlaying, setError, setCurrentTrackIndex,
  });

  const fadeOut = useFadeOut({ howlRefs, stop });

  const { play, pause, toggle, nextTrack, prevTrack } = usePlaybackControls({
    howlRefs, tracksRef, currentTrackIndex, isPlaying,
    loadTrack, setCurrentTrackIndex, setHasInteracted,
  });

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  useEffect(() => {
    if (tracks?.length && !howlRefs.howlRef.current) loadTrack(tracks, 0, false);
    return () => cleanupHowl(howlRefs);
  }, [tracks, loadTrack, howlRefs]);

  useEffect(() => {
    if (prevSceneIdRef.current === sceneId) return;
    const wasPlaying = isPlaying;
    prevSceneIdRef.current = sceneId;
    if (tracks?.length) {
      howlRefs.isLoadingRef.current = false;
      setCurrentTrackIndex(0);
      loadTrack(tracks, 0, wasPlaying);
    }
  }, [sceneId, tracks, isPlaying, loadTrack, howlRefs]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resumeAudioContext();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return {
    currentTrack: tracks?.[currentTrackIndex] || null,
    currentTrackIndex, isPlaying, isLoading, error, hasInteracted,
    play, pause, toggle, nextTrack, prevTrack,
    clearError: useCallback(() => setError(null), []),
    stop, fadeOut,
  };
}
