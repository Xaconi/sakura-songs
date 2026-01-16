export interface DragOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  resetDeps?: React.DependencyList;
}
