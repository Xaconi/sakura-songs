import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const PRESETS = [15, 30, 45, 60, 90];
const FADE_DURATION = 5000;

function useSleepTimer(onTimerEnd) {
  const [timerMinutes, setTimerMinutes] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const intervalRef = useRef(null);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const initiateFadeOut = useCallback(() => {
    setIsFading(true);

    if (onTimerEnd) {
      onTimerEnd();
    }

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

  useEffect(() => {
    return () => {
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  const startTimer = useCallback((minutes) => {
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

  const validateCustomTime = useCallback((value) => {
    if (value === '' || value === null || value === undefined) {
      return { valid: false, error: 'Introduce un numero' };
    }

    const num = parseInt(value, 10);

    if (isNaN(num)) {
      return { valid: false, error: 'Introduce un numero valido' };
    }
    if (num <= 0) {
      return { valid: false, error: 'El tiempo debe ser mayor a 0' };
    }
    if (num > 480) {
      return { valid: false, error: 'Maximo 480 minutos (8 horas)' };
    }
    if (!Number.isInteger(Number(value))) {
      return { valid: false, error: 'Introduce un numero entero' };
    }

    return { valid: true };
  }, []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formattedTime = useMemo(
    () => formatTime(remainingSeconds),
    [remainingSeconds, formatTime]
  );

  const isActive = timerMinutes !== null;

  return {
    isActive,
    remainingSeconds,
    isFading,
    formattedTime,
    PRESETS,
    startTimer,
    cancelTimer,
    validateCustomTime,
  };
}

export default useSleepTimer;
