import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook para manejar drag/swipe en elementos
 * @param {Object} options - Opciones del hook
 * @param {Function} options.onSwipeLeft - Callback cuando se hace swipe a la izquierda
 * @param {Function} options.onSwipeRight - Callback cuando se hace swipe a la derecha
 * @param {number} options.threshold - Porcentaje del contenedor para activar swipe (0-1)
 * @param {Array} options.resetDeps - Dependencias que resetean el drag
 */
function useDrag({ onSwipeLeft, onSwipeRight, threshold = 0.2, resetDeps = [] }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const startXRef = useRef(0);

  // Reset drag cuando cambian las dependencias
  useEffect(() => {
    setDragOffset(0);
  }, resetDeps);

  const handleDragStart = useCallback((clientX) => {
    setIsDragging(true);
    startXRef.current = clientX;
  }, []);

  const handleDragMove = useCallback((clientX) => {
    if (!isDragging) return;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const swipeThreshold = containerWidth * threshold;

    if (dragOffset > swipeThreshold) {
      onSwipeRight?.();
    } else if (dragOffset < -swipeThreshold) {
      onSwipeLeft?.();
    }

    setDragOffset(0);
  }, [isDragging, dragOffset, threshold, onSwipeLeft, onSwipeRight]);

  // Touch handlers
  const onTouchStart = useCallback((e) => {
    handleDragStart(e.touches[0].clientX);
  }, [handleDragStart]);

  const onTouchMove = useCallback((e) => {
    handleDragMove(e.touches[0].clientX);
  }, [handleDragMove]);

  const onTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse handlers
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  }, [handleDragStart]);

  const onMouseMove = useCallback((e) => {
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const onMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const onMouseLeave = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

  return {
    containerRef,
    isDragging,
    dragOffset,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  };
}

export default useDrag;
