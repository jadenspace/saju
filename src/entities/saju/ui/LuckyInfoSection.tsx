'use client';

import { LuckyInfo } from '@/entities/saju/model/types';
import styles from './LuckyInfoSection.module.css';

interface LuckyInfoSectionProps {
  luckyInfo: LuckyInfo;
}

export const LuckyInfoSection = ({ luckyInfo }: LuckyInfoSectionProps) => {
  if (!luckyInfo) {
    return null;
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>🍀</span>
        <h3 className={styles.title}>행운 정보</h3>
      </div>
      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.cardIcon}>🎨</span>
          <div className={styles.info}>
            <span className={styles.label}>행운의 색상</span>
            <span className={styles.value}>{luckyInfo.color.join(', ')}</span>
          </div>
        </div>
        <div className={styles.card}>
          <span className={styles.cardIcon}>🧭</span>
          <div className={styles.info}>
            <span className={styles.label}>행운의 방향</span>
            <span className={styles.value}>{luckyInfo.direction}</span>
          </div>
        </div>
        <div className={styles.card}>
          <span className={styles.cardIcon}>🔢</span>
          <div className={styles.info}>
            <span className={styles.label}>행운의 숫자</span>
            <span className={styles.value}>{luckyInfo.number.join(', ')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

