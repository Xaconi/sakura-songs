import { useState, useCallback } from 'react';
import type { Scene } from '../data/types';

interface UseSceneNavigationReturn {
  currentIndex: number;
  currentScene: Scene;
  goToScene: (index: number) => void;
  nextScene: () => void;
  prevScene: () => void;
}

export default function useSceneNavigation(
  scenes: Scene[],
  initialIndex = 0
): UseSceneNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToScene = useCallback((index: number) => {
    if (index >= 0 && index < scenes.length) {
      setCurrentIndex(index);
    }
  }, [scenes.length]);

  const nextScene = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % scenes.length);
  }, [scenes.length]);

  const prevScene = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? scenes.length - 1 : prev - 1));
  }, [scenes.length]);

  return {
    currentIndex,
    currentScene: scenes[currentIndex],
    goToScene,
    nextScene,
    prevScene,
  };
}
