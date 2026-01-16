import type { ValidationResult } from '../../hooks/useSleepTimer/types';

export interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTimer: (minutes: number) => void;
  presets: number[];
  validateCustomTime: (value: string) => ValidationResult;
}

export interface PresetButtonsProps {
  presets: number[];
  onSelect: (minutes: number) => void;
}

export interface CustomTimeInputProps {
  value: string;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onStart: () => void;
  isDisabled: boolean;
}
