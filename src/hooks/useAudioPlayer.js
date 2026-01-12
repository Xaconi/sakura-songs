import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

function useAudioPlayer(tracks) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const howlRef = useRef(null);
  const tracksRef = useRef(tracks);

  // Update tracks ref when tracks change
  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  // Load and play a specific track
  const loadTrack = useCallback((index, autoplay = false) => {
    // Unload previous track
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }

    const currentTracks = tracksRef.current;
    if (!currentTracks || currentTracks.length === 0) return;

    const trackIndex = index % currentTracks.length;
    const track = currentTracks[trackIndex];

    if (!track?.src) return;

    setIsLoading(true);

    howlRef.current = new Howl({
      src: [track.src],
      html5: true,
      volume: 0.7,
      onload: () => {
        setIsLoading(false);
        if (autoplay && hasInteracted) {
          howlRef.current?.play();
          setIsPlaying(true);
        }
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onend: () => {
        // Auto-play next track in loop
        const nextIndex = (trackIndex + 1) % currentTracks.length;
        setCurrentTrackIndex(nextIndex);
        loadTrack(nextIndex, true);
      },
      onloaderror: (id, error) => {
        console.warn('Audio load error:', error);
        setIsLoading(false);
        // Try next track on error
        const nextIndex = (trackIndex + 1) % currentTracks.length;
        if (nextIndex !== trackIndex) {
          setCurrentTrackIndex(nextIndex);
          loadTrack(nextIndex, autoplay);
        }
      }
    });

    setCurrentTrackIndex(trackIndex);
  }, [hasInteracted]);

  // Handle track changes when scene changes
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      loadTrack(0, isPlaying || hasInteracted);
    }

    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
    };
  }, [tracks]);

  // Play function
  const play = useCallback(() => {
    setHasInteracted(true);

    if (howlRef.current) {
      howlRef.current.play();
    } else if (tracksRef.current && tracksRef.current.length > 0) {
      loadTrack(currentTrackIndex, true);
    }
  }, [currentTrackIndex, loadTrack]);

  // Pause function
  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
    }
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Next track
  const nextTrack = useCallback(() => {
    const currentTracks = tracksRef.current;
    if (!currentTracks || currentTracks.length === 0) return;

    const nextIndex = (currentTrackIndex + 1) % currentTracks.length;
    setCurrentTrackIndex(nextIndex);
    loadTrack(nextIndex, isPlaying);
  }, [currentTrackIndex, isPlaying, loadTrack]);

  // Previous track
  const prevTrack = useCallback(() => {
    const currentTracks = tracksRef.current;
    if (!currentTracks || currentTracks.length === 0) return;

    const prevIndex = currentTrackIndex === 0
      ? currentTracks.length - 1
      : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    loadTrack(prevIndex, isPlaying);
  }, [currentTrackIndex, isPlaying, loadTrack]);

  // Get current track info
  const currentTrack = tracks?.[currentTrackIndex] || null;

  return {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isLoading,
    play,
    pause,
    toggle,
    nextTrack,
    prevTrack,
    hasInteracted
  };
}

export default useAudioPlayer;
