import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render message', () => {
    render(<Toast message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should have role="status" for accessibility', () => {
    render(<Toast message="Test" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have aria-live="polite"', () => {
    render(<Toast message="Test" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('should apply success class by default', () => {
    render(<Toast message="Success" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('toast--success');
  });

  it('should apply error class when type is error', () => {
    render(<Toast message="Error" type="error" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('toast--error');
  });

  it('should auto-hide after duration', () => {
    const onClose = vi.fn();
    render(<Toast message="Test" duration={2500} onClose={onClose} />);

    expect(screen.getByText('Test')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should apply exiting class before closing', () => {
    render(<Toast message="Test" duration={2500} />);

    act(() => {
      vi.advanceTimersByTime(2300);
    });

    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('toast--exiting');
  });

  it('should use custom duration', () => {
    const onClose = vi.fn();
    render(<Toast message="Test" duration={1000} onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render in portal (document.body)', () => {
    render(<Toast message="Portal test" />);
    const toast = document.body.querySelector('.toast');
    expect(toast).toBeInTheDocument();
  });
});
