import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Carousel from './Carousel';

const mockScenes = [
  {
    id: 'day',
    name: 'Amanecer',
    image: 'https://example.com/day.jpg',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    image: 'https://example.com/sunset.jpg',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'night',
    name: 'Noche',
    image: 'https://example.com/night.jpg',
    gradient: 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 100%)',
  },
];

describe('Carousel', () => {
  const defaultProps = {
    scenes: mockScenes,
    currentIndex: 0,
    onChangeScene: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 1000,
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      writable: true,
      value: 0,
    });

    HTMLElement.prototype.scrollTo = vi.fn(function ({ left }) {
      this.scrollLeft = left;
    });
  });

  describe('Rendering', () => {
    it('should render all scenes', () => {
      render(<Carousel {...defaultProps} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides).toHaveLength(3);
    });

    it('should render scene with correct gradient', () => {
      render(<Carousel {...defaultProps} />);

      const gradients = document.querySelectorAll('.carousel__gradient');
      expect(gradients[0]).toHaveStyle({
        background: mockScenes[0].gradient,
      });
    });

    it('should render scene with correct image', () => {
      render(<Carousel {...defaultProps} />);

      const images = document.querySelectorAll('.carousel__image');
      expect(images[0]).toHaveStyle({
        backgroundImage: `url(${mockScenes[0].image})`,
      });
    });

    it('should use scene id as key', () => {
      render(<Carousel {...defaultProps} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides).toHaveLength(mockScenes.length);
    });

    it('should have scroll-snap container class', () => {
      render(<Carousel {...defaultProps} />);

      const carousel = document.querySelector('.carousel');
      expect(carousel).toBeInTheDocument();
    });
  });

  describe('Scroll Navigation', () => {
    it('should scroll to correct position when currentIndex changes', () => {
      const { rerender } = render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      rerender(<Carousel {...defaultProps} currentIndex={1} />);

      expect(carousel.scrollTo).toHaveBeenCalledWith({
        left: 1000,
        behavior: 'smooth',
      });
    });

    it('should scroll to first slide when currentIndex is 0', () => {
      render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      expect(carousel.scrollTo).toHaveBeenCalledWith({
        left: 0,
        behavior: 'smooth',
      });
    });

    it('should scroll to last slide when currentIndex is last', () => {
      render(<Carousel {...defaultProps} currentIndex={2} />);
      const carousel = document.querySelector('.carousel');

      expect(carousel.scrollTo).toHaveBeenCalledWith({
        left: 2000,
        behavior: 'smooth',
      });
    });
  });

  describe('Scroll Events', () => {
    it('should call onChangeScene when scroll ends at different slide', () => {
      render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      vi.runAllTimers();

      carousel.scrollLeft = 1000;
      fireEvent(carousel, new Event('scrollend'));

      expect(defaultProps.onChangeScene).toHaveBeenCalledWith(1);
    });

    it('should not call onChangeScene when scroll ends at same slide', () => {
      render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      vi.runAllTimers();

      carousel.scrollLeft = 0;
      fireEvent(carousel, new Event('scrollend'));

      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });

    it('should ignore scrollend during programmatic scroll', () => {
      const { rerender } = render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      rerender(<Carousel {...defaultProps} currentIndex={1} />);

      carousel.scrollLeft = 1000;
      fireEvent(carousel, new Event('scrollend'));

      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });

    it('should respond to scrollend after programmatic scroll timeout', () => {
      const { rerender } = render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      rerender(<Carousel {...defaultProps} currentIndex={1} />);

      vi.advanceTimersByTime(500);

      carousel.scrollLeft = 2000;
      fireEvent(carousel, new Event('scrollend'));

      expect(defaultProps.onChangeScene).toHaveBeenCalledWith(2);
    });
  });

  describe('Boundary Conditions', () => {
    it('should not call onChangeScene for negative index', () => {
      render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      vi.runAllTimers();

      carousel.scrollLeft = -1000;
      fireEvent(carousel, new Event('scrollend'));

      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });

    it('should not call onChangeScene for index beyond scenes length', () => {
      render(<Carousel {...defaultProps} currentIndex={2} />);
      const carousel = document.querySelector('.carousel');

      vi.runAllTimers();

      carousel.scrollLeft = 5000;
      fireEvent(carousel, new Event('scrollend'));

      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty scenes array', () => {
      render(<Carousel {...defaultProps} scenes={[]} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides).toHaveLength(0);
    });

    it('should handle single scene', () => {
      render(<Carousel {...defaultProps} scenes={[mockScenes[0]]} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides).toHaveLength(1);
    });
  });

  describe('Accessibility', () => {
    it('should have role region on carousel container', () => {
      render(<Carousel {...defaultProps} />);

      const carousel = document.querySelector('.carousel');
      expect(carousel).toHaveAttribute('role', 'region');
    });

    it('should have aria-label on carousel container', () => {
      render(<Carousel {...defaultProps} />);

      const carousel = document.querySelector('.carousel');
      expect(carousel).toHaveAttribute('aria-label', 'Carrusel de escenas');
    });

    it('should have aria-live polite for dynamic updates', () => {
      render(<Carousel {...defaultProps} />);

      const carousel = document.querySelector('.carousel');
      expect(carousel).toHaveAttribute('aria-live', 'polite');
    });

    it('should be focusable with tabIndex', () => {
      render(<Carousel {...defaultProps} />);

      const carousel = document.querySelector('.carousel');
      expect(carousel).toHaveAttribute('tabIndex', '0');
    });

    it('should have role group on each slide', () => {
      render(<Carousel {...defaultProps} />);

      const slides = document.querySelectorAll('.carousel__slide');
      slides.forEach((slide) => {
        expect(slide).toHaveAttribute('role', 'group');
      });
    });

    it('should have aria-roledescription on each slide', () => {
      render(<Carousel {...defaultProps} />);

      const slides = document.querySelectorAll('.carousel__slide');
      slides.forEach((slide) => {
        expect(slide).toHaveAttribute('aria-roledescription', 'diapositiva');
      });
    });

    it('should have aria-label with scene name on each slide', () => {
      render(<Carousel {...defaultProps} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides[0]).toHaveAttribute('aria-label', 'Escena Amanecer');
      expect(slides[1]).toHaveAttribute('aria-label', 'Escena Atardecer');
      expect(slides[2]).toHaveAttribute('aria-label', 'Escena Noche');
    });

    it('should mark non-current slides as aria-hidden', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides[0]).toHaveAttribute('aria-hidden', 'true');
      expect(slides[1]).toHaveAttribute('aria-hidden', 'false');
      expect(slides[2]).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate to previous scene on ArrowLeft key', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);

      const carousel = document.querySelector('.carousel');
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

      expect(defaultProps.onChangeScene).toHaveBeenCalledWith(0);
    });

    it('should navigate to next scene on ArrowRight key', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);

      const carousel = document.querySelector('.carousel');
      fireEvent.keyDown(carousel, { key: 'ArrowRight' });

      expect(defaultProps.onChangeScene).toHaveBeenCalledWith(2);
    });

    it('should not navigate before first scene on ArrowLeft', () => {
      render(<Carousel {...defaultProps} currentIndex={0} />);

      const carousel = document.querySelector('.carousel');
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });

    it('should not navigate after last scene on ArrowRight', () => {
      render(<Carousel {...defaultProps} currentIndex={2} />);

      const carousel = document.querySelector('.carousel');
      fireEvent.keyDown(carousel, { key: 'ArrowRight' });

      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });

    it('should ignore other keys', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);

      const carousel = document.querySelector('.carousel');
      fireEvent.keyDown(carousel, { key: 'Enter' });
      fireEvent.keyDown(carousel, { key: 'Space' });
      fireEvent.keyDown(carousel, { key: 'Tab' });

      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });
  });

  describe('Image Loading States', () => {
    it('should show loading spinner initially', () => {
      render(<Carousel {...defaultProps} />);

      const loadingElements = document.querySelectorAll('.carousel__loading');
      expect(loadingElements.length).toBeGreaterThan(0);
    });

    it('should have loading class on image before load', () => {
      render(<Carousel {...defaultProps} />);

      const images = document.querySelectorAll('.carousel__image');
      images.forEach((img) => {
        expect(img).toHaveClass('carousel__image--loading');
      });
    });

    it('should show spinner with aria-label', () => {
      render(<Carousel {...defaultProps} />);

      const loadingElements = document.querySelectorAll('.carousel__loading');
      loadingElements.forEach((el) => {
        expect(el).toHaveAttribute('aria-label', 'Cargando imagen');
      });
    });

    it('should have spinner inside loading element', () => {
      render(<Carousel {...defaultProps} />);

      const spinners = document.querySelectorAll('.carousel__spinner');
      expect(spinners.length).toBeGreaterThan(0);
    });
  });
});
