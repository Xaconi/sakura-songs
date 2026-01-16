import { useCallback } from 'react';
import type { Scene } from '../../data/types';
import useDrag from './hooks/useDrag';
import './Carousel.css';

interface CarouselProps {
  scenes: Scene[];
  currentIndex: number;
  onChangeScene: (index: number) => void;
}

export default function Carousel({
  scenes,
  currentIndex,
  onChangeScene,
}: CarouselProps) {
  const handleSwipeLeft = useCallback(() => {
    if (currentIndex < scenes.length - 1) {
      onChangeScene(currentIndex + 1);
    }
  }, [currentIndex, scenes.length, onChangeScene]);

  const handleSwipeRight = useCallback(() => {
    if (currentIndex > 0) {
      onChangeScene(currentIndex - 1);
    }
  }, [currentIndex, onChangeScene]);

  const { containerRef, isDragging, dragOffset, handlers } = useDrag({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 0.2,
    resetDeps: [currentIndex],
  });

  const getSlideStyle = useCallback((index: number) => {
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const baseOffset = (index - currentIndex) * containerWidth;
    const totalOffset = baseOffset + dragOffset;

    return {
      transform: `translateX(${totalOffset}px)`,
      transition: isDragging ? 'none' : 'transform 0.4s ease-out',
    };
  }, [containerRef, currentIndex, dragOffset, isDragging]);

  return (
    <div ref={containerRef} className="carousel" {...handlers}>
      {scenes.map((scene, index) => (
        <div key={scene.id} className="carousel__slide" style={getSlideStyle(index)}>
          <div className="carousel__gradient" style={{ background: scene.gradient }} />
          <div
            className="carousel__image"
            style={{ backgroundImage: `url(${scene.image})` }}
          />
          <div className="carousel__overlay" />
        </div>
      ))}

      {isDragging && (
        <div className="carousel__drag-indicator">
          {dragOffset > 50 && currentIndex > 0 && (
            <span className="carousel__drag-hint carousel__drag-hint--left">
              ← {scenes[currentIndex - 1]?.name}
            </span>
          )}
          {dragOffset < -50 && currentIndex < scenes.length - 1 && (
            <span className="carousel__drag-hint carousel__drag-hint--right">
              {scenes[currentIndex + 1]?.name} →
            </span>
          )}
        </div>
      )}
    </div>
  );
}
