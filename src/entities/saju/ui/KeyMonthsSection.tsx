'use client';

import { KeyMonth } from '@/entities/saju/model/types';
import styles from './KeyMonthsSection.module.css';
import clsx from 'clsx';

interface KeyMonthsSectionProps {
  keyMonths: KeyMonth[];
}

const getThemeClass = (theme: KeyMonth['theme']) => {
  switch (theme) {
    case '큰 변화의 달':
      return styles.change;
    case '화합의 달':
      return styles.opportunity;
    case '조심의 달':
      return styles.caution;
    default:
      return '';
  }
};

export const KeyMonthsSection = ({ keyMonths }: KeyMonthsSectionProps) => {
  if (!keyMonths || keyMonths.length === 0) {
    return null;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>⭐</span>
        <h3 className={styles.title}>주요 월운</h3>
      </div>
      <div className={styles.grid}>
        {keyMonths.map((km) => (
          <div key={km.month} className={styles.card}>
            <span className={styles.month}>{km.month}월</span>
            <span className={clsx(styles.theme, getThemeClass(km.theme))}>
              {km.theme}
            </span>
            <p className={styles.advice}>{km.advice}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

