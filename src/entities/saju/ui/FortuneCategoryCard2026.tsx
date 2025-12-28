'use client';

import { FortuneCategory2026 } from '@/entities/saju/model/types';
import styles from './FortuneCategoryCard2026.module.css';

interface FortuneCategoryCard2026Props {
  title: string;
  category: 'wealth' | 'love' | 'career' | 'health';
  data: FortuneCategory2026;
}

export const FortuneCategoryCard2026 = ({ title, category, data }: FortuneCategoryCard2026Props) => {
  const gradeStars = (grade: string) => {
    const starMap: Record<string, number> = {
      '상': 4,
      '중상': 3,
      '중': 2,
      '중하': 1,
      '하': 0,
    };
    return starMap[grade] || 0;
  };

  const stars = gradeStars(data.grade);
  const starDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.grade}>
          <span className={styles.stars}>{starDisplay}</span>
          <span className={styles.gradeText}>({data.grade})</span>
        </div>
      </div>

      {data.keywords.length > 0 && (
        <div className={styles.keywords}>
          {data.keywords.map((keyword, index) => (
            <span key={index} className={styles.keyword}>
              {keyword}
            </span>
          ))}
        </div>
      )}

      <div className={styles.analysis}>
        <p className={styles.analysisText}>{data.analysis}</p>
      </div>

      {data.advice.length > 0 && (
        <div className={styles.advice}>
          <div className={styles.adviceLabel}>조언</div>
          <ul className={styles.adviceList}>
            {data.advice.map((item, index) => (
              <li key={index} className={styles.adviceItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

