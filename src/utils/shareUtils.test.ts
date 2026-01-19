import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  buildShareUrl,
  buildShareData,
  canUseWebShare,
  canUseClipboard,
  getSceneIdFromUrl,
  isValidSceneId,
  VALID_SCENE_IDS,
} from './shareUtils';

describe('shareUtils', () => {
  describe('buildShareUrl', () => {
    it('should build URL with scene query param', () => {
      expect(buildShareUrl('day')).toBe('?scene=day');
      expect(buildShareUrl('sunset')).toBe('?scene=sunset');
      expect(buildShareUrl('night')).toBe('?scene=night');
    });

    it('should encode special characters in scene ID', () => {
      expect(buildShareUrl('test scene')).toBe('?scene=test%20scene');
    });

    it('should return empty string for empty scene ID', () => {
      expect(buildShareUrl('')).toBe('');
    });
  });

  describe('buildShareData', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          origin: 'https://example.com',
          pathname: '/app/',
        },
        writable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });

    it('should build share data with correct title', () => {
      const data = buildShareData('day', 'Amanecer');
      expect(data.title).toBe('Sakura Songs - Amanecer');
    });

    it('should build share data with correct text', () => {
      const data = buildShareData('sunset', 'Atardecer');
      expect(data.text).toBe('Escucha Atardecer en Sakura Songs');
    });

    it('should build share data with full URL', () => {
      const data = buildShareData('night', 'Noche');
      expect(data.url).toBe('https://example.com/app/?scene=night');
    });
  });

  describe('canUseWebShare', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should return true when Web Share API is available', () => {
      Object.defineProperty(global, 'navigator', {
        value: { share: vi.fn() },
        writable: true,
      });
      expect(canUseWebShare()).toBe(true);
    });

    it('should return false when navigator.share is undefined', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });
      expect(canUseWebShare()).toBe(false);
    });
  });

  describe('canUseClipboard', () => {
    const originalNavigator = global.navigator;

    afterEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should return true when Clipboard API is available', () => {
      Object.defineProperty(global, 'navigator', {
        value: { clipboard: { writeText: vi.fn() } },
        writable: true,
      });
      expect(canUseClipboard()).toBe(true);
    });

    it('should return false when clipboard is undefined', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });
      expect(canUseClipboard()).toBe(false);
    });
  });

  describe('getSceneIdFromUrl', () => {
    const originalLocation = window.location;

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
      });
    });

    it('should return scene ID from URL query param', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?scene=sunset' },
        writable: true,
      });
      expect(getSceneIdFromUrl()).toBe('sunset');
    });

    it('should return null when no scene param exists', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '' },
        writable: true,
      });
      expect(getSceneIdFromUrl()).toBeNull();
    });

    it('should return null when scene param is empty', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?scene=' },
        writable: true,
      });
      expect(getSceneIdFromUrl()).toBeNull();
    });

    it('should handle multiple query params', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '?foo=bar&scene=night&baz=qux' },
        writable: true,
      });
      expect(getSceneIdFromUrl()).toBe('night');
    });
  });

  describe('isValidSceneId', () => {
    it('should return true for valid scene IDs', () => {
      expect(isValidSceneId('day')).toBe(true);
      expect(isValidSceneId('sunset')).toBe(true);
      expect(isValidSceneId('night')).toBe(true);
    });

    it('should return false for invalid scene IDs', () => {
      expect(isValidSceneId('morning')).toBe(false);
      expect(isValidSceneId('invalid')).toBe(false);
      expect(isValidSceneId('DAY')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidSceneId(null)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidSceneId('')).toBe(false);
    });
  });

  describe('VALID_SCENE_IDS', () => {
    it('should contain all valid scene IDs', () => {
      expect(VALID_SCENE_IDS).toContain('day');
      expect(VALID_SCENE_IDS).toContain('sunset');
      expect(VALID_SCENE_IDS).toContain('night');
      expect(VALID_SCENE_IDS).toHaveLength(3);
    });
  });
});
