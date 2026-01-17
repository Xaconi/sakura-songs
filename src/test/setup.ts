import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

// Mock Howler.js (audio no funciona en tests)
vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    unload: vi.fn(),
    volume: vi.fn(),
    on: vi.fn(),
    once: vi.fn(),
    state: vi.fn().mockReturnValue('loaded'),
  })),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock AudioContext para ambientGenerator
class MockAudioContext {
  createOscillator = vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
    frequency: { value: 0 },
    detune: { value: 0 },
    type: 'sine',
  });
  createGain = vi.fn().mockReturnValue({
    connect: vi.fn(),
    gain: {
      value: 0,
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      cancelScheduledValues: vi.fn(),
    },
  });
  createBiquadFilter = vi.fn().mockReturnValue({
    connect: vi.fn(),
    frequency: { value: 0 },
    Q: { value: 0 },
    type: 'lowpass',
  });
  destination = {};
  currentTime = 0;
  state = 'running';
  resume = vi.fn().mockResolvedValue(undefined);
}

global.AudioContext = MockAudioContext as unknown as typeof AudioContext;
(global as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext = MockAudioContext as unknown as typeof AudioContext;

// Mock scrollTo para CSS Scroll Snap carousel
Element.prototype.scrollTo = vi.fn();
