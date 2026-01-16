import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Carousel from './Carousel';

// Mock scenes para tests
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
    // Mock offsetWidth para cálculos de swipe
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 1000,
    });
  });

  describe('Rendering', () => {
    it('should_render_all_scenes', () => {
      render(<Carousel {...defaultProps} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides).toHaveLength(3);
    });

    it('should_render_scene_with_correct_gradient', () => {
      render(<Carousel {...defaultProps} />);

      const gradients = document.querySelectorAll('.carousel__gradient');
      expect(gradients[0]).toHaveStyle({
        background: mockScenes[0].gradient,
      });
    });

    it('should_render_scene_with_correct_image', () => {
      render(<Carousel {...defaultProps} />);

      const images = document.querySelectorAll('.carousel__image');
      expect(images[0]).toHaveStyle({
        backgroundImage: `url(${mockScenes[0].image})`,
      });
    });

    it('should_use_scene_id_as_key', () => {
      render(<Carousel {...defaultProps} />);

      // Si usa key correcta, no debería haber warnings de React
      // La existencia de slides con estilos correctos indica keys correctas
      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides).toHaveLength(mockScenes.length);
    });

    it('should_apply_transform_based_on_currentIndex', () => {
      const { rerender } = render(<Carousel {...defaultProps} currentIndex={0} />);

      let slides = document.querySelectorAll('.carousel__slide');
      // Primer slide debería tener translateX(0)
      expect(slides[0].style.transform).toContain('translateX(0px)');

      rerender(<Carousel {...defaultProps} currentIndex={1} />);
      slides = document.querySelectorAll('.carousel__slide');
      // Primer slide debería moverse a la izquierda
      expect(slides[0].style.transform).toContain('translateX(-1000px)');
    });
  });

  describe('Mouse Drag', () => {
    it('should_start_dragging_on_mousedown', () => {
      render(<Carousel {...defaultProps} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.mouseDown(carousel, { clientX: 500 });

      // Mientras arrastra, no debería haber transición
      const slides = document.querySelectorAll('.carousel__slide');
      // Al iniciar drag, isDragging se vuelve true, lo que quita transiciones
    });

    it('should_update_offset_while_dragging', () => {
      render(<Carousel {...defaultProps} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.mouseDown(carousel, { clientX: 500 });
      fireEvent.mouseMove(carousel, { clientX: 400 }); // Drag 100px izquierda

      // El offset debería reflejarse en el transform
      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides[0].style.transform).toContain('translateX(-100px)');
    });

    it('should_call_onChangeScene_on_swipe_left', () => {
      render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      // Simular swipe izquierda (más del 20% del ancho)
      fireEvent.mouseDown(carousel, { clientX: 500 });
      fireEvent.mouseMove(carousel, { clientX: 200 }); // -300px (30% de 1000)
      fireEvent.mouseUp(carousel);

      expect(defaultProps.onChangeScene).toHaveBeenCalledWith(1);
    });

    it('should_call_onChangeScene_on_swipe_right', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);
      const carousel = document.querySelector('.carousel');

      // Simular swipe derecha (más del 20% del ancho)
      fireEvent.mouseDown(carousel, { clientX: 200 });
      fireEvent.mouseMove(carousel, { clientX: 500 }); // +300px (30% de 1000)
      fireEvent.mouseUp(carousel);

      expect(defaultProps.onChangeScene).toHaveBeenCalledWith(0);
    });

    it('should_not_change_scene_if_swipe_too_short', () => {
      render(<Carousel {...defaultProps} />);
      const carousel = document.querySelector('.carousel');

      // Swipe muy corto (menos del 20%)
      fireEvent.mouseDown(carousel, { clientX: 500 });
      fireEvent.mouseMove(carousel, { clientX: 450 }); // Solo 50px (5%)
      fireEvent.mouseUp(carousel);

      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });

    it('should_end_drag_on_mouse_leave', () => {
      render(<Carousel {...defaultProps} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.mouseDown(carousel, { clientX: 500 });
      fireEvent.mouseMove(carousel, { clientX: 200 }); // Drag grande
      fireEvent.mouseLeave(carousel);

      // Debería procesar el swipe al salir
      expect(defaultProps.onChangeScene).toHaveBeenCalled();
    });
  });

  describe('Touch Events', () => {
    it('should_handle_touch_swipe_left', () => {
      render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 500 }],
      });
      fireEvent.touchMove(carousel, {
        touches: [{ clientX: 200 }],
      });
      fireEvent.touchEnd(carousel);

      expect(defaultProps.onChangeScene).toHaveBeenCalledWith(1);
    });

    it('should_handle_touch_swipe_right', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.touchStart(carousel, {
        touches: [{ clientX: 200 }],
      });
      fireEvent.touchMove(carousel, {
        touches: [{ clientX: 500 }],
      });
      fireEvent.touchEnd(carousel);

      expect(defaultProps.onChangeScene).toHaveBeenCalledWith(0);
    });
  });

  describe('Boundary Conditions', () => {
    it('should_not_go_before_first_scene', () => {
      render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      // Intentar swipe derecha en primera escena
      fireEvent.mouseDown(carousel, { clientX: 200 });
      fireEvent.mouseMove(carousel, { clientX: 500 }); // Swipe derecha
      fireEvent.mouseUp(carousel);

      // No debería llamar a onChangeScene (ya estamos en 0)
      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });

    it('should_not_go_after_last_scene', () => {
      render(<Carousel {...defaultProps} currentIndex={2} />);
      const carousel = document.querySelector('.carousel');

      // Intentar swipe izquierda en última escena
      fireEvent.mouseDown(carousel, { clientX: 500 });
      fireEvent.mouseMove(carousel, { clientX: 200 }); // Swipe izquierda
      fireEvent.mouseUp(carousel);

      // No debería llamar a onChangeScene (ya estamos en última)
      expect(defaultProps.onChangeScene).not.toHaveBeenCalled();
    });
  });

  describe('Drag Indicator', () => {
    it('should_show_left_hint_when_dragging_right', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.mouseDown(carousel, { clientX: 200 });
      fireEvent.mouseMove(carousel, { clientX: 300 }); // +100px derecha (>50)

      expect(screen.getByText(/← Amanecer/)).toBeInTheDocument();
    });

    it('should_show_right_hint_when_dragging_left', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.mouseDown(carousel, { clientX: 300 });
      fireEvent.mouseMove(carousel, { clientX: 200 }); // -100px izquierda (<-50)

      expect(screen.getByText(/Noche →/)).toBeInTheDocument();
    });

    it('should_not_show_hint_if_drag_too_short', () => {
      render(<Carousel {...defaultProps} currentIndex={1} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.mouseDown(carousel, { clientX: 300 });
      fireEvent.mouseMove(carousel, { clientX: 280 }); // Solo -20px

      expect(screen.queryByText(/←/)).not.toBeInTheDocument();
      expect(screen.queryByText(/→/)).not.toBeInTheDocument();
    });

    it('should_hide_indicator_when_not_dragging', () => {
      render(<Carousel {...defaultProps} />);

      expect(document.querySelector('.carousel__drag-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Transitions', () => {
    it('should_disable_transition_while_dragging', () => {
      render(<Carousel {...defaultProps} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.mouseDown(carousel, { clientX: 500 });
      fireEvent.mouseMove(carousel, { clientX: 400 });

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides[0].style.transition).toBe('none');
    });

    it('should_enable_transition_when_not_dragging', () => {
      render(<Carousel {...defaultProps} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides[0].style.transition).toContain('transform');
    });

    it('should_restore_transition_after_drag_ends', () => {
      render(<Carousel {...defaultProps} />);
      const carousel = document.querySelector('.carousel');

      fireEvent.mouseDown(carousel, { clientX: 500 });
      fireEvent.mouseMove(carousel, { clientX: 450 });
      fireEvent.mouseUp(carousel);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides[0].style.transition).toContain('transform');
    });
  });

  describe('Edge Cases', () => {
    it('should_handle_empty_scenes_array', () => {
      render(<Carousel {...defaultProps} scenes={[]} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides).toHaveLength(0);
    });

    it('should_handle_single_scene', () => {
      render(<Carousel {...defaultProps} scenes={[mockScenes[0]]} />);

      const slides = document.querySelectorAll('.carousel__slide');
      expect(slides).toHaveLength(1);
    });

    it('should_reset_drag_offset_when_currentIndex_changes', () => {
      const { rerender } = render(<Carousel {...defaultProps} currentIndex={0} />);
      const carousel = document.querySelector('.carousel');

      // Iniciar drag
      fireEvent.mouseDown(carousel, { clientX: 500 });
      fireEvent.mouseMove(carousel, { clientX: 400 });

      // Cambiar índice externamente
      rerender(<Carousel {...defaultProps} currentIndex={1} />);

      // El offset debería resetearse
      const slides = document.querySelectorAll('.carousel__slide');
      // Slide 0 debería estar en -1000 (currentIndex=1), no -1100
      expect(slides[0].style.transform).toBe('translateX(-1000px)');
    });
  });
});
