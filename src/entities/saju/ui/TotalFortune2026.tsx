'use client';

import { useMemo } from 'react';
import { NewYearFortune2026 } from '@/entities/saju/model/types';
import styles from './TotalFortune2026.module.css';

interface TotalFortune2026Props {
  total: NewYearFortune2026['total'];
  wealth: NewYearFortune2026['wealth'];
  love: NewYearFortune2026['love'];
  career: NewYearFortune2026['career'];
  health: NewYearFortune2026['health'];
}

export const TotalFortune2026 = ({ total, wealth, love, career, health }: TotalFortune2026Props) => {
  const categories = useMemo(() => [
    { id: 'wealth', title: '재물운', data: wealth },
    { id: 'love', title: '애정운', data: love },
    { id: 'career', title: '직장운', data: career },
    { id: 'health', title: '건강운', data: health },
  ], [wealth, love, career, health]);

  return (
    <section className={styles.totalSection}>
      <div className={styles.totalCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>2026년 병오년 총운</h2>
          <div className={styles.divider} />
        </div>

        <div className={styles.analysisSection}>
          <div className={styles.analysisLabel}>총운</div>
          <p className={styles.analysisText}>{total.analysis}</p>
        </div>

        {categories.map((category) => (
          <div key={category.id} className={styles.analysisSection}>
            <div className={styles.analysisLabel}>{category.title}</div>
            <p className={styles.analysisText}>{category.data.analysis}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

