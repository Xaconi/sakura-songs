import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('should render app title', () => {
    render(<App />);

    expect(screen.getByText('Sakura Songs')).toBeInTheDocument();
    expect(screen.getByText('Encuentra tu paz interior')).toBeInTheDocument();
  });

  it('should render scene indicators', () => {
    render(<App />);

    const indicators = screen.getAllByRole('button', { name: /Ir a escena/i });
    expect(indicators).toHaveLength(3); // 3 scenes: Amanecer, Atardecer, Noche
  });

  it('should render play button', () => {
    render(<App />);

    const playButton = screen.getByRole('button', { name: /reproducir/i });
    expect(playButton).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    render(<App />);

    const prevButton = screen.getByRole('button', { name: /anterior/i });
    const nextButton = screen.getByRole('button', { name: /siguiente/i });

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('should change active indicator when clicking next', async () => {
    const user = userEvent.setup();
    render(<App />);

    const indicators = screen.getAllByRole('button', { name: /Ir a escena/i });
    const nextButton = screen.getByRole('button', { name: /siguiente/i });

    // Initially first indicator is active
    expect(indicators[0]).toHaveClass('scene-indicator__dot--active');
    expect(indicators[1]).not.toHaveClass('scene-indicator__dot--active');

    // Click next
    await user.click(nextButton);

    // Now second indicator should be active
    expect(indicators[0]).not.toHaveClass('scene-indicator__dot--active');
    expect(indicators[1]).toHaveClass('scene-indicator__dot--active');
  });

  it('should navigate to specific scene when clicking indicator', async () => {
    const user = userEvent.setup();
    render(<App />);

    const indicators = screen.getAllByRole('button', { name: /Ir a escena/i });

    // Click third indicator (Noche)
    await user.click(indicators[2]);

    // Third indicator should be active
    expect(indicators[2]).toHaveClass('scene-indicator__dot--active');
    expect(indicators[0]).not.toHaveClass('scene-indicator__dot--active');
  });
});
