import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSleepTimer from '.';

describe('useSleepTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should_initialize_with_inactive_state', () => {
      const { result } = renderHook(() => useSleepTimer());

      expect(result.current.isActive).toBe(false);
      expect(result.current.remainingSeconds).toBe(0);
      expect(result.current.isFading).toBe(false);
      expect(result.current.formattedTime).toBe('00:00');
    });

    it('should_expose_presets_array', () => {
      const { result } = renderHook(() => useSleepTimer());

      expect(result.current.PRESETS).toEqual([15, 30, 45, 60, 90]);
    });

    it('should_expose_required_functions', () => {
      const { result } = renderHook(() => useSleepTimer());

      expect(typeof result.current.startTimer).toBe('function');
      expect(typeof result.current.cancelTimer).toBe('function');
      expect(typeof result.current.validateCustomTime).toBe('function');
    });
  });

  describe('startTimer', () => {
    it('should_activate_timer_with_correct_seconds', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(15);
      });

      expect(result.current.isActive).toBe(true);
      expect(result.current.remainingSeconds).toBe(900); // 15 * 60
    });

    it('should_not_start_with_zero_minutes', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(0);
      });

      expect(result.current.isActive).toBe(false);
    });

    it('should_not_start_with_negative_minutes', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(-5);
      });

      expect(result.current.isActive).toBe(false);
    });

    it('should_not_start_with_non_integer_minutes', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(1.5);
      });

      expect(result.current.isActive).toBe(false);
    });

    it('should_replace_existing_timer_when_starting_new_one', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(60);
      });

      expect(result.current.remainingSeconds).toBe(3600);

      act(() => {
        result.current.startTimer(30);
      });

      expect(result.current.remainingSeconds).toBe(1800);
    });
  });

  describe('Countdown', () => {
    it('should_decrement_seconds_every_second', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(1); // 1 minuto = 60 segundos
      });

      expect(result.current.remainingSeconds).toBe(60);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.remainingSeconds).toBe(59);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.remainingSeconds).toBe(54);
    });

    it('should_format_time_correctly_as_MM_SS', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(5); // 5 minutos
      });

      expect(result.current.formattedTime).toBe('05:00');

      act(() => {
        vi.advanceTimersByTime(61000); // 61 segundos
      });

      expect(result.current.formattedTime).toBe('03:59');
    });

    it('should_format_single_digit_seconds_with_leading_zero', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(1);
      });

      act(() => {
        vi.advanceTimersByTime(55000); // 55 segundos
      });

      expect(result.current.formattedTime).toBe('00:05');
    });
  });

  describe('cancelTimer', () => {
    it('should_reset_all_state', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(30);
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.isActive).toBe(true);

      act(() => {
        result.current.cancelTimer();
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.remainingSeconds).toBe(0);
      expect(result.current.isFading).toBe(false);
    });

    it('should_stop_countdown_after_cancel', () => {
      const { result } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(5);
      });

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const secondsBeforeCancel = result.current.remainingSeconds;

      act(() => {
        result.current.cancelTimer();
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Debería estar en 0, no seguir decrementando
      expect(result.current.remainingSeconds).toBe(0);
    });
  });

  describe('Timer End', () => {
    it('should_call_onTimerEnd_when_countdown_reaches_zero', () => {
      const onTimerEnd = vi.fn();
      const { result } = renderHook(() => useSleepTimer(onTimerEnd));

      act(() => {
        result.current.startTimer(1); // 1 minuto
      });

      act(() => {
        vi.advanceTimersByTime(60000); // 60 segundos
      });

      expect(onTimerEnd).toHaveBeenCalledTimes(1);
    });

    it('should_set_isFading_to_true_when_timer_ends', () => {
      const onTimerEnd = vi.fn();
      const { result } = renderHook(() => useSleepTimer(onTimerEnd));

      act(() => {
        result.current.startTimer(1);
      });

      act(() => {
        vi.advanceTimersByTime(60000);
      });

      expect(result.current.isFading).toBe(true);
    });

    it('should_reset_after_fade_duration', () => {
      const onTimerEnd = vi.fn();
      const { result } = renderHook(() => useSleepTimer(onTimerEnd));

      act(() => {
        result.current.startTimer(1);
      });

      act(() => {
        vi.advanceTimersByTime(60000); // Timer ends
      });

      expect(result.current.isFading).toBe(true);
      expect(result.current.isActive).toBe(true);

      act(() => {
        vi.advanceTimersByTime(5000); // Fade duration
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.isFading).toBe(false);
    });

    it('should_not_call_onTimerEnd_if_cancelled_before_zero', () => {
      const onTimerEnd = vi.fn();
      const { result } = renderHook(() => useSleepTimer(onTimerEnd));

      act(() => {
        result.current.startTimer(5);
      });

      act(() => {
        vi.advanceTimersByTime(60000); // 1 minuto
      });

      act(() => {
        result.current.cancelTimer();
      });

      act(() => {
        vi.advanceTimersByTime(300000); // 5 minutos más
      });

      expect(onTimerEnd).not.toHaveBeenCalled();
    });
  });

  describe('validateCustomTime', () => {
    it('should_validate_positive_integers', () => {
      const { result } = renderHook(() => useSleepTimer());

      expect(result.current.validateCustomTime('30')).toEqual({ valid: true });
      expect(result.current.validateCustomTime('1')).toEqual({ valid: true });
      expect(result.current.validateCustomTime('480')).toEqual({ valid: true });
    });

    it('should_reject_zero', () => {
      const { result } = renderHook(() => useSleepTimer());

      const validation = result.current.validateCustomTime('0');
      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });

    it('should_reject_negative_numbers', () => {
      const { result } = renderHook(() => useSleepTimer());

      const validation = result.current.validateCustomTime('-5');
      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });

    it('should_reject_non_numeric_values', () => {
      const { result } = renderHook(() => useSleepTimer());

      const validation = result.current.validateCustomTime('abc');
      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });

    it('should_reject_empty_string', () => {
      const { result } = renderHook(() => useSleepTimer());

      const validation = result.current.validateCustomTime('');
      expect(validation.valid).toBe(false);
    });

    it('should_reject_values_over_480_minutes', () => {
      const { result } = renderHook(() => useSleepTimer());

      const validation = result.current.validateCustomTime('500');
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('480');
    });
  });

  describe('Cleanup', () => {
    it('should_clear_interval_on_unmount', () => {
      const { result, unmount } = renderHook(() => useSleepTimer());

      act(() => {
        result.current.startTimer(5);
      });

      unmount();

      // No debería haber errores ni warnings
    });
  });
});
