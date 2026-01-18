import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavButton, PlayButton, TimerButton } from './ControlButtons';

describe('ControlButtons', () => {
  describe('NavButton', () => {
    it('should render prev button with correct tooltip', () => {
      render(<NavButton direction="prev" onClick={vi.fn()} />);
      const button = screen.getByRole('button', { name: 'Escena anterior' });

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-tooltip', 'Escena anterior');
    });

    it('should render next button with correct tooltip', () => {
      render(<NavButton direction="next" onClick={vi.fn()} />);
      const button = screen.getByRole('button', { name: 'Siguiente escena' });

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('data-tooltip', 'Siguiente escena');
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(<NavButton direction="prev" onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('PlayButton', () => {
    it('should show "Reproducir" tooltip when not playing', () => {
      render(<PlayButton isPlaying={false} isLoading={false} onClick={vi.fn()} />);
      const button = screen.getByRole('button', { name: 'Reproducir' });

      expect(button).toHaveAttribute('data-tooltip', 'Reproducir');
    });

    it('should show "Pausar" tooltip when playing', () => {
      render(<PlayButton isPlaying={true} isLoading={false} onClick={vi.fn()} />);
      const button = screen.getByRole('button', { name: 'Pausar' });

      expect(button).toHaveAttribute('data-tooltip', 'Pausar');
    });

    it('should be disabled when loading', () => {
      render(<PlayButton isPlaying={false} isLoading={true} onClick={vi.fn()} />);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(<PlayButton isPlaying={false} isLoading={false} onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('TimerButton', () => {
    it('should have "Temporizador" tooltip', () => {
      render(<TimerButton isActive={false} onClick={vi.fn()} />);
      const button = screen.getByRole('button', { name: 'Temporizador' });

      expect(button).toHaveAttribute('data-tooltip', 'Temporizador');
    });

    it('should have aria-pressed false when inactive', () => {
      render(<TimerButton isActive={false} onClick={vi.fn()} />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have aria-pressed true when active', () => {
      render(<TimerButton isActive={true} onClick={vi.fn()} />);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(<TimerButton isActive={false} onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
