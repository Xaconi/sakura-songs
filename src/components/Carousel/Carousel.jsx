import { useState, useRef, useEffect } from 'react';
import './Carousel.css';

function Carousel({ scenes, currentIndex, onChangeScene }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  // Reset drag offset when scene changes externally
  useEffect(() => {
    setDragOffset(0);
  }, [currentIndex]);

  const handleDragStart = (clientX) => {
    setIsDragging(true);
    startXRef.current = clientX;
    currentXRef.current = clientX;
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;

    currentXRef.current = clientX;
    const diff = clientX - startXRef.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const threshold = containerWidth * 0.2; // 20% threshold to change scene

    if (dragOffset > threshold && currentIndex > 0) {
      // Swipe right - go to previous
      onChangeScene(currentIndex - 1);
    } else if (dragOffset < -threshold && currentIndex < scenes.length - 1) {
      // Swipe left - go to next
      onChangeScene(currentIndex + 1);
    }

    setDragOffset(0);
  };

  // Touch events
  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse events (for desktop)
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Calculate transform for carousel effect
  const getSlideStyle = (index) => {
    const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;
    const baseOffset = (index - currentIndex) * containerWidth;
    const totalOffset = baseOffset + dragOffset;

    return {
      transform: `translateX(${totalOffset}px)`,
      transition: isDragging ? 'none' : 'transform 0.4s ease-out'
    };
  };

  return (
    <div
      ref={containerRef}
      className="carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          className="carousel-slide"
          style={getSlideStyle(index)}
        >
          {/* Gradient fallback */}
          <div
            className="carousel-gradient"
            style={{ background: scene.gradient }}
          />

          {/* Image */}
          <div
            className="carousel-image"
            style={{ backgroundImage: `url(${scene.image})` }}
          />

          {/* Overlay */}
          <div className="carousel-overlay" />
        </div>
      ))}

      {/* Drag indicator */}
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
