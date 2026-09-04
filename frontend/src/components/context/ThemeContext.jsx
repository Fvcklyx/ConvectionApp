import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getStorageItem, setStorageItem } from '../../lib/storage';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = getStorageItem('frndly_theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    setStorageItem('frndly_theme', theme);
  }, [theme]);

  useEffect(() => {
    const syncTheme = (event) => {
      if (event.key === 'frndly_theme' && ['light', 'dark'].includes(event.newValue)) setTheme(event.newValue);
    };
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setStorageItem('frndly_theme_explicit', '1');
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);
  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export const useTheme = () => useContext(ThemeContext);
