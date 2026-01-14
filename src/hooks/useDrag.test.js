import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDrag from './useDrag';

describe('useDrag', () => {
  const defaultOptions = {
    onSwipeLeft: vi.fn(),
    onSwipeRight: vi.fn(),
    threshold: 0.2,
    resetDeps: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock offsetWidth para cálculos de threshold
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 1000,
    });
  });

  describe('Initialization', () => {
    it('should_initialize_with_correct_defaults', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      expect(result.current.isDragging).toBe(false);
      expect(result.current.dragOffset).toBe(0);
      expect(result.current.containerRef.current).toBe(null);
    });

    it('should_return_all_handlers', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      expect(result.current.handlers).toHaveProperty('onTouchStart');
      expect(result.current.handlers).toHaveProperty('onTouchMove');
      expect(result.current.handlers).toHaveProperty('onTouchEnd');
      expect(result.current.handlers).toHaveProperty('onMouseDown');
      expect(result.current.handlers).toHaveProperty('onMouseMove');
      expect(result.current.handlers).toHaveProperty('onMouseUp');
      expect(result.current.handlers).toHaveProperty('onMouseLeave');
    });
  });

  describe('Mouse Drag', () => {
    it('should_set_isDragging_true_on_mousedown', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      expect(result.current.isDragging).toBe(true);
    });

    it('should_update_dragOffset_on_mousemove', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 400 });
      });

      expect(result.current.dragOffset).toBe(-100);
    });

    it('should_not_update_dragOffset_if_not_dragging', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 400 });
      });

      expect(result.current.dragOffset).toBe(0);
    });

    it('should_set_isDragging_false_on_mouseup', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      act(() => {
        result.current.handlers.onMouseUp();
      });

      expect(result.current.isDragging).toBe(false);
    });

    it('should_reset_dragOffset_on_mouseup', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 400 });
      });

      expect(result.current.dragOffset).toBe(-100);

      act(() => {
        result.current.handlers.onMouseUp();
      });

      expect(result.current.dragOffset).toBe(0);
    });

    it('should_end_drag_on_mouseleave_if_dragging', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      expect(result.current.isDragging).toBe(true);

      act(() => {
        result.current.handlers.onMouseLeave();
      });

      expect(result.current.isDragging).toBe(false);
    });

    it('should_not_do_anything_on_mouseleave_if_not_dragging', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onMouseLeave();
      });

      // No debería cambiar nada
      expect(result.current.isDragging).toBe(false);
      expect(result.current.dragOffset).toBe(0);
    });
  });

  describe('Touch Drag', () => {
    it('should_set_isDragging_true_on_touchstart', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onTouchStart({
          touches: [{ clientX: 500 }]
        });
      });

      expect(result.current.isDragging).toBe(true);
    });

    it('should_update_dragOffset_on_touchmove', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onTouchStart({
          touches: [{ clientX: 500 }]
        });
      });

      act(() => {
        result.current.handlers.onTouchMove({
          touches: [{ clientX: 350 }]
        });
      });

      expect(result.current.dragOffset).toBe(-150);
    });

    it('should_end_drag_on_touchend', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      act(() => {
        result.current.handlers.onTouchStart({
          touches: [{ clientX: 500 }]
        });
      });

      act(() => {
        result.current.handlers.onTouchEnd();
      });

      expect(result.current.isDragging).toBe(false);
      expect(result.current.dragOffset).toBe(0);
    });
  });

  describe('Swipe Callbacks', () => {
    it('should_call_onSwipeLeft_when_drag_exceeds_threshold_left', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      // Mock container width
      result.current.containerRef.current = { offsetWidth: 1000 };

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 200 }); // -300px (30%)
      });

      act(() => {
        result.current.handlers.onMouseUp();
      });

      expect(defaultOptions.onSwipeLeft).toHaveBeenCalledTimes(1);
      expect(defaultOptions.onSwipeRight).not.toHaveBeenCalled();
    });

    it('should_call_onSwipeRight_when_drag_exceeds_threshold_right', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      result.current.containerRef.current = { offsetWidth: 1000 };

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 200
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 500 }); // +300px (30%)
      });

      act(() => {
        result.current.handlers.onMouseUp();
      });

      expect(defaultOptions.onSwipeRight).toHaveBeenCalledTimes(1);
      expect(defaultOptions.onSwipeLeft).not.toHaveBeenCalled();
    });

    it('should_not_call_callbacks_if_drag_below_threshold', () => {
      const { result } = renderHook(() => useDrag(defaultOptions));

      result.current.containerRef.current = { offsetWidth: 1000 };

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 450 }); // -50px (5%)
      });

      act(() => {
        result.current.handlers.onMouseUp();
      });

      expect(defaultOptions.onSwipeLeft).not.toHaveBeenCalled();
      expect(defaultOptions.onSwipeRight).not.toHaveBeenCalled();
    });

    it('should_use_custom_threshold', () => {
      const customOptions = {
        ...defaultOptions,
        onSwipeLeft: vi.fn(),
        threshold: 0.1, // 10%
      };

      const { result } = renderHook(() => useDrag(customOptions));

      result.current.containerRef.current = { offsetWidth: 1000 };

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 380 }); // -120px (12%)
      });

      act(() => {
        result.current.handlers.onMouseUp();
      });

      expect(customOptions.onSwipeLeft).toHaveBeenCalledTimes(1);
    });
  });

  describe('Reset Dependencies', () => {
    it('should_reset_dragOffset_when_resetDeps_change', () => {
      const { result, rerender } = renderHook(
        ({ deps }) => useDrag({ ...defaultOptions, resetDeps: deps }),
        { initialProps: { deps: [0] } }
      );

      // Simular drag
      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 400 });
      });

      expect(result.current.dragOffset).toBe(-100);

      // Cambiar dependencias - esto resetea el offset
      rerender({ deps: [1] });

      expect(result.current.dragOffset).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should_handle_undefined_callbacks_gracefully', () => {
      const { result } = renderHook(() => useDrag({
        threshold: 0.2,
        resetDeps: [],
        // No callbacks
      }));

      result.current.containerRef.current = { offsetWidth: 1000 };

      // No debería lanzar error
      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 500
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 200 });
      });

      act(() => {
        result.current.handlers.onMouseUp();
      });

      // Después de mouseUp isDragging vuelve a false
      expect(result.current.isDragging).toBe(false);
    });

    it('should_use_window_innerWidth_if_container_not_set', () => {
      const originalInnerWidth = window.innerWidth;
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 800,
      });

      const onSwipeLeft = vi.fn();
      const { result } = renderHook(() => useDrag({
        ...defaultOptions,
        onSwipeLeft,
      }));

      // No establecer containerRef.current

      act(() => {
        result.current.handlers.onMouseDown({
          preventDefault: vi.fn(),
          clientX: 400
        });
      });

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 200 }); // -200px (25% de 800)
      });

      act(() => {
        result.current.handlers.onMouseUp();
      });

      expect(onSwipeLeft).toHaveBeenCalled();

      // Restaurar
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: originalInnerWidth,
      });
    });
  });
});
