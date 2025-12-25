'use client';

import { useTheme, Theme } from '@/shared/lib/theme';
import { useState, useRef, useEffect } from 'react';
import styles from './ThemeToggle.module.css';

const THEME_INFO: Record<Theme, { icon: string; label: string }> = {
  light: { icon: '☀️', label: '라이트' },
  dark: { icon: '🌙', label: '다크' },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="테마 변경"
        aria-expanded={isOpen}
      >
        <span className={styles.icon}>{THEME_INFO[theme].icon}</span>
        <span className={styles.label}>{THEME_INFO[theme].label}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {(Object.keys(THEME_INFO) as Theme[]).map((themeOption) => (
            <button
              key={themeOption}
              className={`${styles.option} ${theme === themeOption ? styles.active : ''}`}
              onClick={() => handleThemeSelect(themeOption)}
            >
              <span className={styles.optionIcon}>{THEME_INFO[themeOption].icon}</span>
              <span className={styles.optionLabel}>{THEME_INFO[themeOption].label}</span>
              {theme === themeOption && <span className={styles.checkmark}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

