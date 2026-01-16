import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { SleepTimerHook } from './types';
import { PRESETS, FADE_DURATION } from './constants';
import { validateCustomTime, formatTime } from './validation';

export default function useSleepTimer(
  onTimerEnd?: () => void
): SleepTimerHook {
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const initiateFadeOut = useCallback(() => {
    setIsFading(true);
    onTimerEnd?.();
    setTimeout(() => {
      setTimerMinutes(null);
      setRemainingSeconds(0);
      setIsFading(false);
    }, FADE_DURATION);
  }, [onTimerEnd]);

  useEffect(() => {
    if (timerMinutes === null || isFading) {
      clearTimerInterval();
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearTimerInterval();
          initiateFadeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimerInterval;
  }, [timerMinutes, isFading, clearTimerInterval, initiateFadeOut]);

  useEffect(() => clearTimerInterval, [clearTimerInterval]);

  const startTimer = useCallback((minutes: number) => {
    if (minutes <= 0 || !Number.isInteger(minutes)) return;
    clearTimerInterval();
    setTimerMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setIsFading(false);
  }, [clearTimerInterval]);

  const cancelTimer = useCallback(() => {
    clearTimerInterval();
    setTimerMinutes(null);
    setRemainingSeconds(0);
    setIsFading(false);
  }, [clearTimerInterval]);

  const formattedTime = useMemo(
    () => formatTime(remainingSeconds),
    [remainingSeconds]
  );

  return {
    isActive: timerMinutes !== null,
    remainingSeconds,
    isFading,
    formattedTime,
    PRESETS: [...PRESETS],
    startTimer,
    cancelTimer,
    validateCustomTime,
  };
}
