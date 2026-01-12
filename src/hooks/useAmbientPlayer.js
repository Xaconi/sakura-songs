import { useState, useEffect, useCallback, useRef } from 'react';
import ambientGenerator from '../utils/ambientGenerator';

function useAmbientPlayer(sceneId) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sceneIdRef = useRef(sceneId);

  // Update ref when sceneId changes
  useEffect(() => {
    sceneIdRef.current = sceneId;
  }, [sceneId]);

  // Handle scene changes
  useEffect(() => {
    if (sceneId && hasInteracted) {
      ambientGenerator.changePreset(sceneId);
      if (isPlaying) {
        ambientGenerator.play(sceneId);
      }
    }
  }, [sceneId, hasInteracted, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ambientGenerator.stop();
    };
  }, []);

  // Play function
  const play = useCallback(() => {
    setHasInteracted(true);
    ambientGenerator.play(sceneIdRef.current);
    setIsPlaying(true);
  }, []);

  // Pause function
  const pause = useCallback(() => {
    ambientGenerator.pause();
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Get current track info based on scene
  const getTrackInfo = useCallback(() => {
    const presets = {
      day: { title: 'Morning Calm', id: 1 },
      sunset: { title: 'Golden Hour', id: 2 },
      night: { title: 'Deep Sleep', id: 3 }
    };
    return presets[sceneId] || { title: 'Ambient', id: 0 };
  }, [sceneId]);

  return {
    currentTrack: getTrackInfo(),
    isPlaying,
    isLoading: false,
    play,
    pause,
    toggle,
    hasInteracted
  };
}

export default useAmbientPlayer;
