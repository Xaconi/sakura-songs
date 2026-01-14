import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

function useAudioPlayer(tracks, sceneId = null) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const howlRef = useRef(null);
  const tracksRef = useRef(tracks);
  const isLoadingRef = useRef(false);
  const prevSceneIdRef = useRef(sceneId);

  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  const loadTrack = useCallback((index, autoplay = false) => {
    if (isLoadingRef.current) return;

    const currentTracks = tracksRef.current;
    if (!currentTracks || currentTracks.length === 0) return;

    const trackIndex = index % currentTracks.length;
    const track = currentTracks[trackIndex];

    if (!track?.src) return;

    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    howlRef.current = new Howl({
      src: [track.src],
      html5: true,
      volume: 0.7,
      preload: 'metadata',
      onload: () => {
        isLoadingRef.current = false;
        setIsLoading(false);
        setError(null);
        if (autoplay) {
          howlRef.current?.play();
        }
      },
      onplay: () => {
        isLoadingRef.current = false;
        setIsLoading(false);
        setIsPlaying(true);
        setError(null);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onend: () => {
        const nextIndex = (trackIndex + 1) % currentTracks.length;
        setCurrentTrackIndex(nextIndex);
        loadTrack(nextIndex, true);
      },
      onloaderror: (id, errorCode) => {
        isLoadingRef.current = false;
        setIsLoading(false);
        setError('No se pudo cargar el audio. Verifica tu conexión.');
      },
      onplayerror: (id, errorCode) => {
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
  }, []);

  useEffect(() => {
    if (tracks && tracks.length > 0 && !howlRef.current) {
      loadTrack(0, false);
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (prevSceneIdRef.current === sceneId) return;

    const wasPlaying = isPlaying;
    prevSceneIdRef.current = sceneId;

    if (tracks && tracks.length > 0) {
      isLoadingRef.current = false;
      setCurrentTrackIndex(0);
      loadTrack(0, wasPlaying);
    }
  }, [sceneId, tracks, isPlaying, loadTrack]);

  const play = useCallback(() => {
    setHasInteracted(true);

    if (howlRef.current && !isLoadingRef.current) {
      howlRef.current.play();
    } else if (tracksRef.current && tracksRef.current.length > 0) {
      loadTrack(currentTrackIndex, true);
    }
  }, [currentTrackIndex, loadTrack]);

  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    const currentTracks = tracksRef.current;
    if (!currentTracks || currentTracks.length === 0) return;

    const nextIndex = (currentTrackIndex + 1) % currentTracks.length;
    setCurrentTrackIndex(nextIndex);
    loadTrack(nextIndex, isPlaying);
  }, [currentTrackIndex, isPlaying, loadTrack]);

  const prevTrack = useCallback(() => {
    const currentTracks = tracksRef.current;
    if (!currentTracks || currentTracks.length === 0) return;

    const prevIndex = currentTrackIndex === 0
      ? currentTracks.length - 1
      : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    loadTrack(prevIndex, isPlaying);
  }, [currentTrackIndex, isPlaying, loadTrack]);

  const currentTrack = tracks?.[currentTrackIndex] || null;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isLoading,
    error,
    play,
    pause,
    toggle,
    nextTrack,
    prevTrack,
    hasInteracted,
    clearError,
  };
}

export default useAudioPlayer;
