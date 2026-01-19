import { useRef, useEffect, useCallback, useState } from 'react';
import type { Scene } from '../../data/types';
import './Carousel.css';

interface CarouselProps {
  scenes: Scene[];
  currentIndex: number;
  onChangeScene: (index: number) => void;
}

const PROGRAMMATIC_SCROLL_TIMEOUT = 400;

export default function Carousel({
  scenes,
  currentIndex,
  onChangeScene,
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;

    isScrollingRef.current = true;
    const slideWidth = container.offsetWidth;
    container.scrollTo({ left: index * slideWidth, behavior: 'smooth' });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, PROGRAMMATIC_SCROLL_TIMEOUT);
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

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        onChangeScene(currentIndex - 1);
      } else if (event.key === 'ArrowRight' && currentIndex < scenes.length - 1) {
        onChangeScene(currentIndex + 1);
      }
    },
    [currentIndex, scenes.length, onChangeScene]
  );

  const handleImageLoad = useCallback((imageUrl: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageUrl));
  }, []);

  const handleImageError = useCallback((imageUrl: string) => {
    setFailedImages((prev) => new Set(prev).add(imageUrl));
  }, []);

  useEffect(() => {
    scenes.forEach((scene) => {
      if (!loadedImages.has(scene.image) && !failedImages.has(scene.image)) {
        const img = new Image();
        img.onload = () => handleImageLoad(scene.image);
        img.onerror = () => handleImageError(scene.image);
        img.src = scene.image;
      }
    });
  }, [scenes, loadedImages, failedImages, handleImageLoad, handleImageError]);

  return (
    <div
      ref={containerRef}
      className="carousel"
      role="region"
      aria-label="Carrusel de escenas"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {scenes.map((scene, index) => {
        const isLoading = !loadedImages.has(scene.image) && !failedImages.has(scene.image);
        const hasFailed = failedImages.has(scene.image);

        return (
          <div
            key={scene.id}
            className="carousel__slide"
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`Escena ${scene.name}`}
            aria-hidden={index !== currentIndex}
          >
            <div className="carousel__gradient" style={{ background: scene.gradient }} />
            {isLoading && (
              <div className="carousel__loading" aria-label="Cargando imagen">
                <div className="carousel__spinner" />
              </div>
            )}
            {hasFailed && (
              <div className="carousel__error" aria-label="Error al cargar imagen">
                <span className="carousel__error-icon">⚠</span>
              </div>
            )}
            {!hasFailed && (
              <div
                className={`carousel__image ${isLoading ? 'carousel__image--loading' : ''}`}
                style={{ backgroundImage: `url(${scene.image})` }}
              />
            )}
            <div className="carousel__overlay" />
          </div>
        );
      })}
    </div>
  );
}
