import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareButton from './ShareButton';

describe('ShareButton', () => {
  const defaultProps = {
    sceneId: 'day',
    sceneName: 'Amanecer',
    onShareSuccess: vi.fn(),
    onShareError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render with correct aria-label', () => {
    render(<ShareButton {...defaultProps} />);
    const button = screen.getByRole('button', { name: 'Compartir escena' });
    expect(button).toBeInTheDocument();
  });

  it('should have tooltip attribute', () => {
    render(<ShareButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-tooltip', 'Compartir escena');
  });

  it('should call Web Share API when available', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true,
    });

    render(<ShareButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Sakura Songs - Amanecer',
          text: 'Escucha Amanecer en Sakura Songs',
        })
      );
    });

    expect(defaultProps.onShareSuccess).toHaveBeenCalledWith('webshare');
  });

  it('should fallback to Clipboard API when Web Share not available', async () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    render(<ShareButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(
        expect.stringContaining('?scene=day')
      );
    });

    expect(defaultProps.onShareSuccess).toHaveBeenCalledWith('clipboard');
  });

  it('should not call onShareError when user cancels share (AbortError)', async () => {
    const abortError = new Error('User cancelled');
    abortError.name = 'AbortError';

    const mockShare = vi.fn().mockRejectedValue(abortError);
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true,
    });

    render(<ShareButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalled();
    });

    expect(defaultProps.onShareError).not.toHaveBeenCalled();
  });

  it('should call onShareError for non-AbortError errors', async () => {
    const genericError = new Error('Share failed');

    const mockShare = vi.fn().mockRejectedValue(genericError);
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      writable: true,
      configurable: true,
    });

    render(<ShareButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(defaultProps.onShareError).toHaveBeenCalledWith(genericError);
    });
  });

  it('should call onShareError when no share method is available', async () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    render(<ShareButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(defaultProps.onShareError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Share not supported' })
      );
    });
  });
});
