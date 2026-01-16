import type { ValidationResult } from './ValidationResult';

export interface SleepTimerActions {
  startTimer: (minutes: number) => void;
  cancelTimer: () => void;
  validateCustomTime: (value: string) => ValidationResult;
}
