import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useAudioPlayer from '.';
import { Howl } from 'howler';

// Mock tracks para tests
const mockTracks = [
  { id: 'track-1', title: 'Track 1', src: '/audio/track1.mp3' },
  { id: 'track-2', title: 'Track 2', src: '/audio/track2.mp3' },
  { id: 'track-3', title: 'Track 3', src: '/audio/track3.mp3' },
];

describe('useAudioPlayer', () => {
  let mockHowlInstance;
  let howlCallbacks;

  beforeEach(() => {
    howlCallbacks = {};
    mockHowlInstance = {
      play: vi.fn(),
      pause: vi.fn(),
      stop: vi.fn(),
      unload: vi.fn(),
      volume: vi.fn(),
      on: vi.fn((event, cb) => {
        howlCallbacks[event] = cb;
      }),
    };

    vi.mocked(Howl).mockImplementation((config) => {
      // Guardar callbacks de la configuración
      if (config.onload) howlCallbacks.load = config.onload;
      if (config.onplay) howlCallbacks.play = config.onplay;
      if (config.onpause) howlCallbacks.pause = config.onpause;
      if (config.onstop) howlCallbacks.stop = config.onstop;
      if (config.onend) howlCallbacks.end = config.onend;
      if (config.onloaderror) howlCallbacks.loaderror = config.onloaderror;
      if (config.onplayerror) howlCallbacks.playerror = config.onplayerror;
      return mockHowlInstance;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should_initialize_with_default_values', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(result.current.currentTrackIndex).toBe(0);
      expect(result.current.isPlaying).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.hasInteracted).toBe(false);
    });

    it('should_set_current_track_from_tracks_array', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(result.current.currentTrack).toEqual(mockTracks[0]);
    });

    it('should_create_howl_instance_on_mount', () => {
      renderHook(() => useAudioPlayer(mockTracks));

      expect(Howl).toHaveBeenCalledWith(
        expect.objectContaining({
          src: [mockTracks[0].src],
          html5: true,
          volume: 0.7,
        })
      );
    });

    it('should_return_null_track_when_tracks_empty', () => {
      const { result } = renderHook(() => useAudioPlayer([]));

      expect(result.current.currentTrack).toBe(null);
    });

    it('should_not_create_howl_when_tracks_empty', () => {
      renderHook(() => useAudioPlayer([]));

      expect(Howl).not.toHaveBeenCalled();
    });
  });

  describe('Play/Pause', () => {
    it('should_set_hasInteracted_true_when_play_called', async () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      await act(async () => {
        result.current.play();
      });

      expect(result.current.hasInteracted).toBe(true);
    });

    it('should_expose_pause_function', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(typeof result.current.pause).toBe('function');
    });

    it('should_expose_toggle_function', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(typeof result.current.toggle).toBe('function');
    });

    it('should_start_with_isPlaying_false', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('Track Navigation', () => {
    it('should_go_to_next_track', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      act(() => {
        result.current.nextTrack();
      });

      expect(result.current.currentTrackIndex).toBe(1);
      expect(result.current.currentTrack).toEqual(mockTracks[1]);
    });

    it('should_wrap_to_first_track_after_last', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      act(() => {
        result.current.nextTrack(); // -> 1
      });

      act(() => {
        result.current.nextTrack(); // -> 2
      });

      act(() => {
        result.current.nextTrack(); // -> 0 (wrap)
      });

      expect(result.current.currentTrackIndex).toBe(0);
    });

    it('should_go_to_previous_track', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      // Ir al track 2 primero
      act(() => {
        result.current.nextTrack();
      });

      act(() => {
        result.current.nextTrack();
      });

      expect(result.current.currentTrackIndex).toBe(2);

      act(() => {
        result.current.prevTrack();
      });

      expect(result.current.currentTrackIndex).toBe(1);
    });

    it('should_wrap_to_last_track_when_at_first', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(result.current.currentTrackIndex).toBe(0);

      act(() => {
        result.current.prevTrack();
      });

      expect(result.current.currentTrackIndex).toBe(2); // Last track
    });
  });

  describe('Scene Changes', () => {
    it('should_reload_track_when_sceneId_changes', () => {
      const { result, rerender } = renderHook(
        ({ tracks, sceneId }) => useAudioPlayer(tracks, sceneId),
        { initialProps: { tracks: mockTracks, sceneId: 'scene-1' } }
      );

      const initialCallCount = vi.mocked(Howl).mock.calls.length;

      rerender({ tracks: mockTracks, sceneId: 'scene-2' });

      // Debería haber creado una nueva instancia de Howl
      expect(vi.mocked(Howl).mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it('should_reset_track_index_when_scene_changes', () => {
      const { result, rerender } = renderHook(
        ({ tracks, sceneId }) => useAudioPlayer(tracks, sceneId),
        { initialProps: { tracks: mockTracks, sceneId: 'scene-1' } }
      );

      // Avanzar al track 2
      act(() => {
        result.current.nextTrack();
      });

      act(() => {
        result.current.nextTrack();
      });

      expect(result.current.currentTrackIndex).toBe(2);

      // Cambiar escena
      rerender({ tracks: mockTracks, sceneId: 'scene-2' });

      expect(result.current.currentTrackIndex).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should_start_with_null_error', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(result.current.error).toBe(null);
    });

    it('should_expose_clearError_function', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(typeof result.current.clearError).toBe('function');
    });

    it('should_clear_error_when_clearError_called', async () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      // clearError siempre debería funcionar
      await act(async () => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('Loading States', () => {
    it('should_expose_isLoading_state', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(typeof result.current.isLoading).toBe('boolean');
    });
  });

  describe('Cleanup', () => {
    it('should_unload_howl_on_unmount', () => {
      const { unmount } = renderHook(() => useAudioPlayer(mockTracks));

      unmount();

      expect(mockHowlInstance.unload).toHaveBeenCalled();
    });

    it('should_update_track_index_when_changing_tracks', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(result.current.currentTrackIndex).toBe(0);

      act(() => {
        result.current.nextTrack();
      });

      // El índice debería actualizarse, lo que internamente
      // provoca que se cargue un nuevo track
      expect(result.current.currentTrackIndex).toBe(1);
      expect(result.current.currentTrack).toEqual(mockTracks[1]);
    });
  });

  describe('Auto-advance', () => {
    it('should_advance_to_next_track_when_current_ends', () => {
      const { result } = renderHook(() => useAudioPlayer(mockTracks));

      expect(result.current.currentTrackIndex).toBe(0);

      act(() => {
        howlCallbacks.end?.();
      });

      expect(result.current.currentTrackIndex).toBe(1);
    });
  });
});
