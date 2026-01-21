import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Carousel from './components/Carousel/Carousel';
import Controls from './components/Controls/Controls';
import SceneIndicator from './components/SceneIndicator/SceneIndicator';
import SleepTimerModal from './components/SleepTimer/SleepTimerModal';
import { AmbientEffectsModal } from './components/AmbientEffects';
import useAudioPlayer from './hooks/useAudioPlayer';
import useSleepTimer from './hooks/useSleepTimer';
import useTimerModal from './hooks/useTimerModal';
import useSceneNavigation from './hooks/useSceneNavigation';
import useAmbientEffects from './hooks/useAmbientEffects';
import { scenes } from './data/scenes';
import { getSceneIdFromUrl, isValidSceneId } from './utils/shareUtils';
import './App.css';

function getInitialSceneIndex(): number {
  const sceneId = getSceneIdFromUrl();
  if (!isValidSceneId(sceneId)) return 0;
  const index = scenes.findIndex((s) => s.id === sceneId);
  return index >= 0 ? index : 0;
}

export default function App() {
  const initialIndex = useMemo(() => getInitialSceneIndex(), []);
  const { currentIndex, currentScene, goToScene, nextScene, prevScene } =
    useSceneNavigation(scenes, initialIndex);

  const { currentTrack, isPlaying, isLoading, error, toggle, clearError, fadeOut } =
    useAudioPlayer(currentScene?.tracks || [], currentScene?.id);

  const { isOpen, showEndMessage, open, close, showMessage } = useTimerModal();

  const [isAmbientModalOpen, setIsAmbientModalOpen] = useState(false);
  const ambientEffects = useAmbientEffects();

  // Sync ambient effects with main audio play state (for iOS lock screen controls)
  const prevIsPlayingRef = useRef(isPlaying);
  useEffect(() => {
    if (prevIsPlayingRef.current !== isPlaying) {
      prevIsPlayingRef.current = isPlaying;
      if (isPlaying) {
        ambientEffects.resume();
      } else {
        ambientEffects.pause();
      }
    }
  }, [isPlaying, ambientEffects]);

  const handleTimerEnd = useCallback(() => {
    fadeOut(5000, () => {
      ambientEffects.stopAll();
      showMessage();
    });
  }, [fadeOut, ambientEffects, showMessage]);

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
        sceneId={currentScene?.id ?? 'day'}
        onSleepTimerClick={open}
        sleepTimerActive={sleepTimerActive}
        sleepTimerTime={sleepTimerTime}
        sleepTimerIsFading={sleepTimerIsFading}
        onSleepTimerCancel={cancelTimer}
        onAmbientEffectsClick={() => setIsAmbientModalOpen(true)}
        ambientEffectActive={ambientEffects.activeEffectId !== null}
      />

      <SleepTimerModal
        isOpen={isOpen}
        onClose={close}
        onStartTimer={startTimer}
        presets={PRESETS}
        validateCustomTime={validateCustomTime}
      />

      <AmbientEffectsModal
        isOpen={isAmbientModalOpen}
        onClose={() => setIsAmbientModalOpen(false)}
        effects={ambientEffects.effects}
        activeEffectId={ambientEffects.activeEffectId}
        isLoading={ambientEffects.isLoading}
        onToggleEffect={ambientEffects.toggleEffect}
        onVolumeChange={ambientEffects.setVolume}
        getVolume={ambientEffects.getVolume}
      />

      {showEndMessage && (
        <div className="timer-end-message" role="status" aria-live="polite">
          <span>Dulces suenos</span>
        </div>
      )}
    </div>
  );
}
