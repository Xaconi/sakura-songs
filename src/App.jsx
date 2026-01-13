import { useState, useCallback } from 'react';
import Carousel from './components/Carousel/Carousel';
import Controls from './components/Controls/Controls';
import SceneIndicator from './components/SceneIndicator/SceneIndicator';
import useAudioPlayer from './hooks/useAudioPlayer';
import { scenes } from './data/scenes';
import './App.css';

function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const currentScene = scenes[currentSceneIndex];

  // Audio player hook - usa los tracks de la escena actual
  const {
    currentTrack,
    isPlaying,
    isLoading,
    toggle,
    play,
    hasInteracted
  } = useAudioPlayer(currentScene?.tracks || [], currentScene?.id);

  // Handle scene change (from carousel or buttons)
  const handleSceneChange = useCallback((index) => {
    if (index >= 0 && index < scenes.length) {
      setCurrentSceneIndex(index);
    }
  }, []);

  // Navigate to next scene (with loop)
  const nextScene = useCallback(() => {
    setCurrentSceneIndex((prev) => (prev + 1) % scenes.length);
  }, []);

  // Navigate to previous scene (with loop)
  const prevScene = useCallback(() => {
    setCurrentSceneIndex((prev) =>
      prev === 0 ? scenes.length - 1 : prev - 1
    );
  }, []);

  // Handle play button or first interaction
  const handlePlay = useCallback(() => {
    play();
  }, [play]);

  return (
    <div className="app">
      {/* Carousel with swipe */}
      <Carousel
        scenes={scenes}
        currentIndex={currentSceneIndex}
        onChangeScene={handleSceneChange}
      />

      {/* Logo/Title - at top */}
      <header className="app-header">
        <h1 className="app-title">Sakura Songs</h1>
        <p className="app-subtitle">Encuentra tu paz interior</p>
      </header>

      {/* Scene indicator dots */}
      <SceneIndicator
        total={scenes.length}
        current={currentSceneIndex}
        onSelect={handleSceneChange}
      />

      {/* Control panel - at bottom */}
      <Controls
        isPlaying={isPlaying}
        isLoading={isLoading}
        onToggle={toggle}
        onPlay={handlePlay}
        onPrevScene={prevScene}
        onNextScene={nextScene}
        currentTrack={currentTrack}
        sceneName={currentScene?.name}
        hasInteracted={hasInteracted}
      />
    </div>
  );
}

export default App;
