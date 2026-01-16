import type { Howl } from 'howler';

export interface HowlRefs {
  howlRef: React.MutableRefObject<Howl | null>;
  isLoadingRef: React.MutableRefObject<boolean>;
  fadeIntervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
}
