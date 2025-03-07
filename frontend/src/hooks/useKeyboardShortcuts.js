import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, shiftKey } = event;
      
      for (const [shortcut, callback] of Object.entries(shortcuts)) {
        const [modifier, mainKey] = shortcut.split('+');
        
        if (
          (modifier === 'ctrl' && ctrlKey && key.toLowerCase() === mainKey.toLowerCase()) ||
          (modifier === 'shift' && shiftKey && key.toLowerCase() === mainKey.toLowerCase()) ||
          (!modifier && key.toLowerCase() === shortcut.toLowerCase())
        ) {
          event.preventDefault();
          callback();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}; 