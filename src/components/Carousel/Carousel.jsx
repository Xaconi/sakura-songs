import { useCallback } from 'react';
import useDrag from '../../hooks/useDrag';
import './Carousel.css';

function Carousel({ scenes, currentIndex, onChangeScene }) {
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

  const getSlideStyle = useCallback((index) => {
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
        <div key={scene.id} className="carousel-slide" style={getSlideStyle(index)}>
          <div className="carousel-gradient" style={{ background: scene.gradient }} />
          <div className="carousel-image" style={{ backgroundImage: `url(${scene.image})` }} />
          <div className="carousel-overlay" />
        </div>
      ))}

      {isDragging && (
        <div className="carousel-drag-indicator">
          {dragOffset > 50 && currentIndex > 0 && (
            <span className="drag-hint drag-hint-left">← {scenes[currentIndex - 1]?.name}</span>
          )}
          {dragOffset < -50 && currentIndex < scenes.length - 1 && (
            <span className="drag-hint drag-hint-right">{scenes[currentIndex + 1]?.name} →</span>
          )}
        </div>
      )}
    </div>
  );
}

export default Carousel;
