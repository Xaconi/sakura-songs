import { useRef } from 'react';
import type { Howl } from 'howler';
import type { HowlRefs } from './types';

export function useHowlInstance(): HowlRefs {
  const howlRef = useRef<Howl | null>(null);
  const isLoadingRef = useRef<boolean>(false);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  return { howlRef, isLoadingRef, fadeIntervalRef };
}

export function cleanupHowl(refs: HowlRefs): void {
  if (refs.howlRef.current) {
    refs.howlRef.current.unload();
    refs.howlRef.current = null;
  }
  if (refs.fadeIntervalRef.current) {
    clearInterval(refs.fadeIntervalRef.current);
    refs.fadeIntervalRef.current = null;
  }
}
