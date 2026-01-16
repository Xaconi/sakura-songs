import { useState, useRef, useCallback, useEffect } from 'react';
import type { DragOptions, DragState, DragHandlers } from './types';

interface UseDragReturn extends DragState {
  containerRef: React.RefObject<HTMLDivElement>;
  handlers: DragHandlers;
}

export default function useDrag({
  onSwipeLeft,
  onSwipeRight,
  threshold = 0.2,
  resetDeps = [],
}: DragOptions): UseDragReturn {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  useEffect(() => {
    setDragOffset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...resetDeps]);

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    setDragOffset(clientX - startXRef.current);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const swipeThreshold = containerWidth * threshold;

    if (dragOffset > swipeThreshold) onSwipeRight?.();
    else if (dragOffset < -swipeThreshold) onSwipeLeft?.();

    setDragOffset(0);
  }, [isDragging, dragOffset, threshold, onSwipeLeft, onSwipeRight]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  }, [handleDragStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  }, [handleDragMove]);

  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const onMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);

  const onMouseLeave = useCallback(() => {
    if (isDragging) handleDragEnd();
  }, [isDragging, handleDragEnd]);

  return {
    containerRef,
    isDragging,
    dragOffset,
    handlers: {
      onTouchStart, onTouchMove, onTouchEnd,
      onMouseDown, onMouseMove, onMouseUp, onMouseLeave,
    },
  };
}
