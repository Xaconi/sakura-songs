// Share utilities for building URLs and feature detection

const VALID_SCENE_IDS = ['day', 'sunset', 'night'] as const;
type ValidSceneId = (typeof VALID_SCENE_IDS)[number];

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export function buildShareUrl(sceneId: string): string {
  if (!sceneId) return '';
  return `?scene=${encodeURIComponent(sceneId)}`;
}

export function buildShareData(sceneId: string, sceneName: string): ShareData {
  const url = `${window.location.origin}${window.location.pathname}${buildShareUrl(sceneId)}`;
  return {
    title: `Sakura Songs - ${sceneName}`,
    text: `Escucha ${sceneName} en Sakura Songs`,
    url,
  };
}

export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export function canUseClipboard(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined' &&
    typeof navigator.clipboard.writeText === 'function'
  );
}

export function getSceneIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const sceneId = params.get('scene');
  return sceneId || null;
}

export function isValidSceneId(id: string | null): id is ValidSceneId {
  if (!id) return false;
  return VALID_SCENE_IDS.includes(id as ValidSceneId);
}

export { VALID_SCENE_IDS };
export type { ValidSceneId };
