import { useCallback, useRef } from 'react';
import { Howl } from 'howler';
import type { Track } from '../../data/types';
import type { TrackLoaderOptions } from './types';

export function useTrackLoader(options: TrackLoaderOptions) {
  const { howlRefs, setIsLoading, setIsPlaying, setError, setCurrentTrackIndex } = options;
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
      const nextIndex = (trackIndex + 1) % tracksRef.current.length;
      setCurrentTrackIndex(nextIndex);
      loadTrack(tracksRef.current, nextIndex, true);
    };

    howlRef.current = new Howl({
      src: [track.src],
      html5: true,
      volume: 0.7,
      preload: 'metadata',
      onload: () => {
        isLoadingRef.current = false;
        setIsLoading(false);
        setError(null);
        if (autoplay) howlRef.current?.play();
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
      onplayerror: () => {
        isLoadingRef.current = false;
        setIsLoading(false);
        setError('Error al reproducir. Intenta de nuevo.');
      }
    });

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
