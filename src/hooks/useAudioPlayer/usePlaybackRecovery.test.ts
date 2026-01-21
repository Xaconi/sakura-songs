import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Howl, Howler } from 'howler';
import {
  getAudioContextState,
  resumeAudioContext,
  safePlay,
} from './usePlaybackRecovery';

describe('usePlaybackRecovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (Howler.ctx as { state: string }).state = 'running';
  });

  describe('getAudioContextState', () => {
    it('should return "running" when context is running', () => {
      (Howler.ctx as { state: string }).state = 'running';
      expect(getAudioContextState()).toBe('running');
    });

    it('should return "suspended" when context is suspended', () => {
      (Howler.ctx as { state: string }).state = 'suspended';
      expect(getAudioContextState()).toBe('suspended');
    });

    it('should return "unavailable" when ctx is null', () => {
      const originalCtx = Howler.ctx;
      (Howler as { ctx: unknown }).ctx = null;
      expect(getAudioContextState()).toBe('unavailable');
      (Howler as { ctx: unknown }).ctx = originalCtx;
    });
  });

  describe('resumeAudioContext', () => {
    it('should return true when context is already running', async () => {
      (Howler.ctx as { state: string }).state = 'running';
      const result = await resumeAudioContext();
      expect(result).toBe(true);
    });

    it('should call resume() when context is suspended', async () => {
      (Howler.ctx as { state: string }).state = 'suspended';
      (Howler.ctx as { resume: ReturnType<typeof vi.fn> }).resume.mockImplementation(async () => {
        (Howler.ctx as { state: string }).state = 'running';
      });

      const result = await resumeAudioContext();

      expect(Howler.ctx?.resume).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when resume fails', async () => {
      (Howler.ctx as { state: string }).state = 'suspended';
      (Howler.ctx as { resume: ReturnType<typeof vi.fn> }).resume.mockRejectedValue(new Error('Resume failed'));

      const result = await resumeAudioContext();
      expect(result).toBe(false);
    });
  });

  describe('safePlay', () => {
    it('should return error when howl is null', async () => {
      const result = await safePlay(null);
      expect(result.success).toBe(false);
      expect(result.error).toBe('No Howl instance provided');
    });

    it('should successfully play when context is running', async () => {
      const mockHowl = new Howl({ src: ['test.mp3'] });
      (Howler.ctx as { state: string }).state = 'running';

      const result = await safePlay(mockHowl);

      expect(result.success).toBe(true);
      expect(result.attempts).toBe(1);
    });

    it('should return error when howl is unloaded', async () => {
      const mockHowl = new Howl({ src: ['test.mp3'] });
      (mockHowl.state as ReturnType<typeof vi.fn>).mockReturnValue('unloaded');

      const result = await safePlay(mockHowl);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Howl instance was unloaded');
    });

    it('should prevent concurrent plays on same instance', async () => {
      const mockHowl = new Howl({ src: ['test.mp3'] });
      (mockHowl.play as ReturnType<typeof vi.fn>).mockImplementation(() => {
        return new Promise(resolve => setTimeout(() => resolve(1), 100));
      });

      const promise1 = safePlay(mockHowl);
      const promise2 = safePlay(mockHowl);

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(false);
      expect(result2.error).toBe('Play already in progress');
    });

    it('should attempt resume when context is suspended', async () => {
      const mockHowl = new Howl({ src: ['test.mp3'] });
      (Howler.ctx as { state: string }).state = 'suspended';
      (Howler.ctx as { resume: ReturnType<typeof vi.fn> }).resume.mockImplementation(async () => {
        (Howler.ctx as { state: string }).state = 'running';
      });

      const result = await safePlay(mockHowl);

      expect(Howler.ctx?.resume).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });
});
