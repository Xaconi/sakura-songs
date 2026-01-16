import type { SleepTimerState } from './SleepTimerState';
import type { SleepTimerActions } from './SleepTimerActions';

export type SleepTimerHook = SleepTimerState & SleepTimerActions & {
  PRESETS: number[];
};
