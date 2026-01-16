import { useCallback } from 'react';
import Carousel from './components/Carousel/Carousel';
import Controls from './components/Controls/Controls';
import SceneIndicator from './components/SceneIndicator/SceneIndicator';
import SleepTimerModal from './components/SleepTimer/SleepTimerModal';
import useAudioPlayer from './hooks/useAudioPlayer';
import useSleepTimer from './hooks/useSleepTimer';
import useTimerModal from './hooks/useTimerModal';
import useSceneNavigation from './hooks/useSceneNavigation';
import { scenes } from './data/scenes';
import './App.css';

export default function App() {
  const { currentIndex, currentScene, goToScene, nextScene, prevScene } =
    useSceneNavigation(scenes);

  const { currentTrack, isPlaying, isLoading, error, toggle, clearError, fadeOut } =
    useAudioPlayer(currentScene?.tracks || [], currentScene?.id);

  const { isOpen, showEndMessage, open, close, showMessage } = useTimerModal();

  const handleTimerEnd = useCallback(() => {
    fadeOut(5000, showMessage);
  }, [fadeOut, showMessage]);

  const {
    isActive: sleepTimerActive,
    isFading: sleepTimerIsFading,
    formattedTime: sleepTimerTime,
    PRESETS,
    startTimer,
    cancelTimer,
    validateCustomTime,
  } = useSleepTimer(handleTimerEnd);

  return (
    <div className="app">
      <Carousel scenes={scenes} currentIndex={currentIndex} onChangeScene={goToScene} />

      <header className="app-header">
        <h1 className="app-title">Sakura Songs</h1>
        <p className="app-subtitle">Encuentra tu paz interior</p>
      </header>

      {error && (
        <div className="audio-error" role="alert">
          <span>{error}</span>
          <button onClick={clearError} aria-label="Cerrar mensaje">x</button>
        </div>
      )}

      <SceneIndicator scenes={scenes} currentIndex={currentIndex} onSelect={goToScene} />

      <Controls
        isPlaying={isPlaying}
        isLoading={isLoading}
        onToggle={toggle}
        onPrevScene={prevScene}
        onNextScene={nextScene}
        currentTrack={currentTrack}
        sceneName={currentScene?.name ?? ''}
        onSleepTimerClick={open}
        sleepTimerActive={sleepTimerActive}
        sleepTimerTime={sleepTimerTime}
        sleepTimerIsFading={sleepTimerIsFading}
        onSleepTimerCancel={cancelTimer}
      />

      <SleepTimerModal
        isOpen={isOpen}
        onClose={close}
        onStartTimer={startTimer}
        presets={PRESETS}
        validateCustomTime={validateCustomTime}
      />

      {showEndMessage && (
        <div className="timer-end-message" role="status" aria-live="polite">
          <span>Dulces suenos</span>
        </div>
      )}
    </div>
  );
}
