import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Toast.css';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({
  message,
  type = 'success',
  duration = 2500,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 200);

    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  if (!isVisible) return null;

  const toastElement = (
    <div
      className={`toast toast--${type} ${isExiting ? 'toast--exiting' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="toast__icon">
        {type === 'success' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </span>
      <span className="toast__message">{message}</span>
    </div>
  );

  return createPortal(toastElement, document.body);
}
