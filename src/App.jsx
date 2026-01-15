import { useState, useCallback } from 'react';
import Carousel from './components/Carousel/Carousel';
import Controls from './components/Controls/Controls';
import SceneIndicator from './components/SceneIndicator/SceneIndicator';
import SleepTimerModal from './components/SleepTimer/SleepTimerModal';
import useAudioPlayer from './hooks/useAudioPlayer';
import useSleepTimer from './hooks/useSleepTimer';
import { scenes } from './data/scenes';
import './App.css';

function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [showTimerEndMessage, setShowTimerEndMessage] = useState(false);
  const currentScene = scenes[currentSceneIndex];

  // Audio player hook - usa los tracks de la escena actual
  const {
    currentTrack,
    isPlaying,
    isLoading,
    error,
    toggle,
    clearError,
    fadeOut,
  } = useAudioPlayer(currentScene?.tracks || [], currentScene?.id);

  // Sleep timer callback
  const handleTimerEnd = useCallback(() => {
    fadeOut(5000, () => {
      setShowTimerEndMessage(true);
      setTimeout(() => setShowTimerEndMessage(false), 3000);
    });
  }, [fadeOut]);

  // Sleep timer hook
  const {
    isActive: sleepTimerActive,
    isFading: sleepTimerIsFading,
    formattedTime: sleepTimerTime,
    PRESETS,
    startTimer,
    cancelTimer,
    validateCustomTime,
  } = useSleepTimer(handleTimerEnd);

  // Timer modal handlers
  const handleOpenTimerModal = useCallback(() => {
    setIsTimerModalOpen(true);
  }, []);

  const handleCloseTimerModal = useCallback(() => {
    setIsTimerModalOpen(false);
  }, []);

  const handleStartTimer = useCallback((minutes) => {
    startTimer(minutes);
  }, [startTimer]);

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

      {/* Audio error message */}
      {error && (
        <div className="audio-error" role="alert">
          <span>{error}</span>
          <button onClick={clearError} aria-label="Cerrar mensaje">×</button>
        </div>
      )}

      {/* Scene indicator dots */}
      <SceneIndicator
        scenes={scenes}
        currentIndex={currentSceneIndex}
        onSelect={handleSceneChange}
      />

      {/* Control panel - at bottom */}
      <Controls
        isPlaying={isPlaying}
        isLoading={isLoading}
        onToggle={toggle}
        onPrevScene={prevScene}
        onNextScene={nextScene}
        currentTrack={currentTrack}
        sceneName={currentScene?.name}
        onSleepTimerClick={handleOpenTimerModal}
        sleepTimerActive={sleepTimerActive}
        sleepTimerTime={sleepTimerTime}
        sleepTimerIsFading={sleepTimerIsFading}
        onSleepTimerCancel={cancelTimer}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isTimerModalOpen}
        onClose={handleCloseTimerModal}
        onStartTimer={handleStartTimer}
        presets={PRESETS}
        validateCustomTime={validateCustomTime}
      />

      {/* Timer End Message */}
      {showTimerEndMessage && (
        <div className="timer-end-message" role="status" aria-live="polite">
          <span>Dulces sueños</span>
        </div>
      )}
    </div>
  );
}

export default App;
