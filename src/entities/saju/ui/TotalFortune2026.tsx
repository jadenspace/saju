'use client';

import { NewYearFortune2026 } from '@/entities/saju/model/types';
import styles from './TotalFortune2026.module.css';

interface TotalFortune2026Props {
  total: NewYearFortune2026['total'];
}

export const TotalFortune2026 = ({ total }: TotalFortune2026Props) => {
  const gradeStars = (grade: string) => {
    const starMap: Record<string, number> = {
      '상상': 5,
      '상': 4,
      '중상': 3,
      '중': 2,
      '중하': 1,
      '하': 0,
      '하하': 0,
    };
    return starMap[grade] || 0;
  };

  const stars = gradeStars(total.grade);
  const starDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars);

  return (
    <section className={styles.totalSection}>
      <div className={styles.totalCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>📊 2026년 병오년 총운</h2>
          <div className={styles.divider} />
        </div>

        <div className={styles.gradeSection}>
          <div className={styles.gradeLabel}>운세 등급</div>
          <div className={styles.gradeValue}>
            <span className={styles.stars}>{starDisplay}</span>
            <span className={styles.gradeText}>({total.grade})</span>
          </div>
        </div>

        {total.keywords.length > 0 && (
          <div className={styles.keywordsSection}>
            <div className={styles.keywordsLabel}>올해의 키워드</div>
            <div className={styles.keywords}>
              {total.keywords.map((keyword, index) => (
                <span key={index} className={styles.keyword}>
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.analysisSection}>
          <div className={styles.analysisLabel}>총운 해설</div>
          <p className={styles.analysisText}>{total.analysis}</p>
        </div>

        <div className={styles.adviceSection}>
          <div className={styles.adviceLabel}>올해의 조언</div>
          <div className={styles.adviceList}>
            <div className={styles.adviceItem}>
              <span className={styles.adviceIcon}>🌅</span>
              <span className={styles.adviceText}>상반기: {total.advice.firstHalf}</span>
            </div>
            <div className={styles.adviceItem}>
              <span className={styles.adviceIcon}>🌇</span>
              <span className={styles.adviceText}>하반기: {total.advice.secondHalf}</span>
            </div>
            <div className={styles.adviceItem}>
              <span className={styles.adviceIcon}>🧭</span>
              <span className={styles.adviceText}>행운의 방향: {total.advice.direction}</span>
            </div>
            <div className={styles.adviceItem}>
              <span className={styles.adviceIcon}>🎨</span>
              <span className={styles.adviceText}>행운의 색상: {total.advice.color}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

