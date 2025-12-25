'use client';

import { MonthlyFortune } from '@/entities/saju/model/types';
import styles from './MonthlyFortuneGrid.module.css';
import clsx from 'clsx';

interface MonthlyFortuneGridProps {
  monthly: MonthlyFortune[];
}

export const MonthlyFortuneGrid = ({ monthly }: MonthlyFortuneGridProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {monthly.map((month) => (
          <div key={month.month} className={styles.monthCard}>
            <div className={styles.monthHeader}>
              <span className={styles.solarMonth}>{month.solarMonth}</span>
              <span className={styles.monthName}>{month.monthName}</span>
            </div>
            <div className={styles.ganZhi}>
              <span className={styles.hanja}>{month.ganHan}{month.jiHan}</span>
              <span className={styles.hangul}>{month.ganZhi}</span>
            </div>
            <div className={styles.scoreRow}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={clsx(styles.star, i < month.score && styles.active)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className={styles.theme}>{month.theme}</span>
            </div>
            <p className={styles.oneLiner}>{month.oneLiner}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

