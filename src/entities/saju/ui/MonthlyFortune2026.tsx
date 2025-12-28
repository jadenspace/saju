'use client';

import { MonthlyFortune2026 as MonthlyFortune2026Type } from '@/entities/saju/model/types';
import styles from './MonthlyFortune2026.module.css';
import { useState } from 'react';

interface MonthlyFortune2026Props {
  monthly: MonthlyFortune2026Type[];
}

export const MonthlyFortune2026 = ({ monthly }: MonthlyFortune2026Props) => {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

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

  const getScoreBar = (score: number) => {
    const percentage = ((score - 1) / 4) * 100; // 1-5를 0-100%로 변환
    return percentage;
  };

  return (
    <div className={styles.container}>
      {/* 월별 그래프 */}
      <div className={styles.graph}>
        {monthly.map((month) => {
          const barWidth = getScoreBar(month.score);
          return (
            <div key={month.month} className={styles.graphItem}>
              <div className={styles.graphLabel}>{month.month}월</div>
              <div className={styles.graphBarContainer}>
                <div
                  className={styles.graphBar}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className={styles.graphValue}>
                {month.grade} ({month.ganZhi})
              </div>
            </div>
          );
        })}
      </div>

      {/* 월별 상세 */}
      <div className={styles.details}>
        {monthly.map((month) => {
          const stars = gradeStars(month.grade);
          const starDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars);
          const isExpanded = expandedMonth === month.month;

          return (
            <div key={month.month} className={styles.monthCard}>
              <div
                className={styles.monthHeader}
                onClick={() => setExpandedMonth(isExpanded ? null : month.month)}
              >
                <div className={styles.monthTitle}>
                  <span className={styles.monthNumber}>[{month.month}월 {month.ganZhi}]</span>
                  <span className={styles.monthStars}>{starDisplay}</span>
                </div>
                <div className={styles.monthToggle}>
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>

              {month.keywords.length > 0 && (
                <div className={styles.monthKeywords}>
                  {month.keywords.map((keyword, index) => (
                    <span key={index} className={styles.monthKeyword}>
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              {isExpanded && (
                <div className={styles.monthContent}>
                  <div className={styles.monthSection}>
                    <div className={styles.monthSectionLabel}>총평</div>
                    <p className={styles.monthSectionText}>{month.analysis.total}</p>
                  </div>

                  <div className={styles.monthSection}>
                    <div className={styles.monthSectionLabel}>💰 재물</div>
                    <p className={styles.monthSectionText}>{month.analysis.wealth}</p>
                  </div>

                  <div className={styles.monthSection}>
                    <div className={styles.monthSectionLabel}>💕 애정</div>
                    <p className={styles.monthSectionText}>{month.analysis.love}</p>
                  </div>

                  <div className={styles.monthSection}>
                    <div className={styles.monthSectionLabel}>💼 직장</div>
                    <p className={styles.monthSectionText}>{month.analysis.career}</p>
                  </div>

                  <div className={styles.monthSection}>
                    <div className={styles.monthSectionLabel}>🏥 건강</div>
                    <p className={styles.monthSectionText}>{month.analysis.health}</p>
                  </div>

                  <div className={styles.monthSection}>
                    <div className={styles.monthSectionLabel}>💡 조언</div>
                    <p className={styles.monthSectionText}>{month.analysis.advice}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

