import { useEffect } from 'react';

const enableOutline = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    document.body?.classList.add('enable-outline');
  }
};

const disableOutline = () => {
  document.body?.classList.remove('enable-outline');
};

export const useOutline = () => {
  useEffect(() => {
    window.addEventListener('keydown', enableOutline);
    return () => {
      window.removeEventListener('keydown', enableOutline);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('click', disableOutline);
    return () => {
      window.removeEventListener('click', disableOutline);
    };
  }, []);

  return null;
};