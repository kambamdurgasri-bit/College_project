import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'learntrack-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  // No stored preference yet — fall back to system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Keep <html> class and localStorage in sync with theme state
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Follow system changes only if the user hasn't explicitly chosen a theme
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const hasExplicitChoice = window.localStorage.getItem(STORAGE_KEY + '-explicit');
      if (!hasExplicitChoice) setTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const setExplicitTheme = useCallback((next) => {
    window.localStorage.setItem(STORAGE_KEY + '-explicit', 'true');
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setExplicitTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setExplicitTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setExplicitTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
