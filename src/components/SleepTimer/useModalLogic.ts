import { useState, useEffect, useCallback } from 'react';
import type { ValidationResult } from '../../hooks/useSleepTimer/types';

interface UseModalLogicOptions {
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (minutes: number) => void;
  validateCustomTime: (value: string) => ValidationResult;
}

export function useModalLogic(options: UseModalLogicOptions) {
  const { isOpen, onClose, onStartTimer, validateCustomTime } = options;
  const [customValue, setCustomValue] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  const handlePresetClick = useCallback((minutes: number) => {
    onStartTimer(minutes);
    onClose();
  }, [onStartTimer, onClose]);

  const handleCustomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    if (value) {
      const validation = validateCustomTime(value);
      setCustomError(validation.valid ? null : validation.error ?? null);
    } else {
      setCustomError(null);
    }
  }, [validateCustomTime]);

  const handleCustomStart = useCallback(() => {
    if (!customValue || customError) return;
    onStartTimer(parseInt(customValue, 10));
    setCustomValue('');
    setCustomError(null);
    onClose();
  }, [customValue, customError, onStartTimer, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !customError && customValue) handleCustomStart();
  }, [customError, customValue, handleCustomStart]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setCustomValue('');
      setCustomError(null);
    }
  }, [isOpen]);

  return {
    customValue, customError,
    handlePresetClick, handleCustomChange, handleCustomStart, handleKeyDown,
  };
}
