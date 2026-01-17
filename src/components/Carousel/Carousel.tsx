import { useRef, useEffect, useCallback } from 'react';
import type { Scene } from '../../data/types';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    isScrollingRef.current = true;
    const slideWidth = container.offsetWidth;
    container.scrollTo({ left: index * slideWidth, behavior: 'smooth' });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 400);
  }, []);

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, [currentIndex, scrollToIndex]);

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const slideWidth = container.offsetWidth;
    const newIndex = Math.round(container.scrollLeft / slideWidth);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < scenes.length) {
      onChangeScene(newIndex);
    }
  }, [currentIndex, scenes.length, onChangeScene]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scrollend', handleScroll);
    return () => container.removeEventListener('scrollend', handleScroll);
  }, [handleScroll]);

  return (
    <div ref={containerRef} className="carousel">
      {scenes.map((scene) => (
        <div key={scene.id} className="carousel__slide">
          <div className="carousel__gradient" style={{ background: scene.gradient }} />
          <div
            className="carousel__image"
            style={{ backgroundImage: `url(${scene.image})` }}
          />
          <div className="carousel__overlay" />
        </div>
      ))}
    </div>
  );
}
