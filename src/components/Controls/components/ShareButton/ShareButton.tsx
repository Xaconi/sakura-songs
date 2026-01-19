import {
  buildShareData,
  canUseWebShare,
  canUseClipboard,
} from '../../../../utils/shareUtils';
import './ShareButton.css';

export type ShareMethod = 'webshare' | 'clipboard';

interface ShareButtonProps {
  sceneId: string;
  sceneName: string;
  onShareSuccess?: (method: ShareMethod) => void;
  onShareError?: (error: Error) => void;
}

export default function ShareButton({
  sceneId,
  sceneName,
  onShareSuccess,
  onShareError,
}: ShareButtonProps) {
  const handleClick = async () => {
    const shareData = buildShareData(sceneId, sceneName);

    try {
      if (canUseWebShare()) {
        await navigator.share(shareData);
        onShareSuccess?.('webshare');
      } else if (canUseClipboard()) {
        await navigator.clipboard.writeText(shareData.url);
        onShareSuccess?.('clipboard');
      } else {
        throw new Error('Share not supported');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      onShareError?.(error instanceof Error ? error : new Error('Share failed'));
    }
  };

  return (
    <button
      className="controls__btn controls__btn--share"
      onClick={handleClick}
      aria-label="Compartir escena"
      data-tooltip="Compartir escena"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    </button>
  );
}
