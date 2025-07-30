
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(Theme.Dark);

  useEffect(() => {
    const storedTheme = localStorage.getItem('appTheme') as Theme;
    if (storedTheme && Object.values(Theme).includes(storedTheme)) {
      setThemeState(storedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('appTheme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...Object.values(Theme).map(t => `theme-${t}`));
    if (theme !== Theme.Dark) { // Dark is default via CSS
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
