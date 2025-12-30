'use client';

import { FortuneCategory } from '@/entities/saju/model/types';
import styles from './FortuneCard.module.css';
import clsx from 'clsx';

interface FortuneCardProps {
  title: string;
  category: 'total' | 'career' | 'love' | 'wealth' | 'health';
  data: FortuneCategory;
  icon?: string;
}

export const FortuneCard = ({ title, category, data, icon }: FortuneCardProps) => {
  return (
    <div className={clsx(styles.card, styles[category])}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.scoreBadge}>
          {data.score}점
        </div>
      </div>
      <div className={styles.content}>
        <p className={styles.summary}>{data.summary}</p>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>장점</span>
            <ul className={styles.list}>
              {data.pros.map((pro, i) => (
                <li key={i} className={styles.pro}>{pro}</li>
              ))}
            </ul>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>주의</span>
            <ul className={styles.list}>
              {data.cons.map((con, i) => (
                <li key={i} className={styles.con}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className={styles.strategy}>
          <span className={styles.strategyLabel}>핵심 전략</span>
          <p className={styles.strategyText}>{data.strategy}</p>
        </div>
      </div>
    </div>
  );
};

