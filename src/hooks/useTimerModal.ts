import { useState, useCallback } from 'react';

interface UseTimerModalReturn {
  isOpen: boolean;
  showEndMessage: boolean;
  open: () => void;
  close: () => void;
  showMessage: () => void;
}

export default function useTimerModal(): UseTimerModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const showMessage = useCallback(() => {
    setShowEndMessage(true);
    setTimeout(() => setShowEndMessage(false), 3000);
  }, []);

  return { isOpen, showEndMessage, open, close, showMessage };
}
