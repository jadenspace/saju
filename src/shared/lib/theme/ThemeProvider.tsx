'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'saju-theme';
const DEFAULT_THEME: Theme = 'dark';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // 테마를 다크 모드로 고정
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', DEFAULT_THEME);
    localStorage.setItem(THEME_STORAGE_KEY, DEFAULT_THEME);
    setMounted(true);
  }, []);

  const setTheme = useCallback(() => {
    // 테마 변경 비활성화
  }, []);

  const cycleTheme = useCallback(() => {
    // 테마 변경 비활성화
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: DEFAULT_THEME, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext };

