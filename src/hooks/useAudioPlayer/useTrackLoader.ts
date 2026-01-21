import { useCallback, useRef } from 'react';
import { Howl } from 'howler';
import type { Track } from '../../data/types';
import type { TrackLoaderOptions } from './types';
import { safePlay, resumeAudioContext } from './usePlaybackRecovery';

export function useTrackLoader(options: TrackLoaderOptions) {
  const { howlRefs, currentTrackIndexRef, setIsLoading, setIsPlaying, setError, setCurrentTrackIndex } = options;
  const tracksRef = useRef<Track[]>([]);

  const loadTrack = useCallback((
    tracks: Track[],
    index: number,
    autoplay = false
  ) => {
    const { howlRef, isLoadingRef } = howlRefs;

    if (isLoadingRef.current) return;
    if (!tracks || tracks.length === 0) return;

    tracksRef.current = tracks;
    const trackIndex = index % tracks.length;
    const track = tracks[trackIndex];

    if (!track?.src) return;

    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    const onTrackEnd = () => {
      const nextIndex = (currentTrackIndexRef.current + 1) % tracksRef.current.length;
      setCurrentTrackIndex(nextIndex);
      loadTrack(tracksRef.current, nextIndex, true);
    };

    const currentHowl = new Howl({
      src: [track.src],
      html5: true,
      volume: 0.7,
      preload: true,
      onload: async () => {
        isLoadingRef.current = false;
        setIsLoading(false);
        setError(null);
        if (autoplay && currentHowl.state() !== 'unloaded') {
          const result = await safePlay(currentHowl);
          if (!result.success) {
            setError('No se pudo reproducir automáticamente. Presiona play.');
          }
        }
      },
      onplay: () => {
        isLoadingRef.current = false;
        setIsLoading(false);
        setIsPlaying(true);
        setError(null);
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: onTrackEnd,
      onloaderror: () => {
        isLoadingRef.current = false;
        setIsLoading(false);
        setError('No se pudo cargar el audio. Verifica tu conexión.');
      },
      onplayerror: async () => {
        const resumed = await resumeAudioContext();
        if (resumed && currentHowl.state() !== 'unloaded') {
          const result = await safePlay(currentHowl);
          if (result.success) return;
        }
        isLoadingRef.current = false;
        setIsLoading(false);
        setError('Error al reproducir. Intenta de nuevo.');
      }
    });
    howlRef.current = currentHowl;

    setTimeout(() => {
      if (isLoadingRef.current) {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    }, 3000);

    setCurrentTrackIndex(trackIndex);
  }, [howlRefs, setIsLoading, setIsPlaying, setError, setCurrentTrackIndex]);

  return { loadTrack, tracksRef };
}
