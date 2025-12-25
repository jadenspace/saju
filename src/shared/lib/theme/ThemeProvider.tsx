'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'saju-theme';
const THEMES: Theme[] = ['light', 'dark'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // 초기 테마 로드
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    // 기존 'modern' 테마는 'light'로 마이그레이션
    if (savedTheme === 'modern') {
      setThemeState('light');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    } else if (savedTheme && THEMES.includes(savedTheme as Theme)) {
      setThemeState(savedTheme as Theme);
    }
    setMounted(true);
  }, []);

  // 테마 변경 시 DOM에 적용
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const currentIndex = THEMES.indexOf(current);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      return THEMES[nextIndex];
    });
  }, []);

  // 하이드레이션 불일치 방지
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'light', setTheme, cycleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
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

