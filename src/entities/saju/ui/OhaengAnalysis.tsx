import clsx from 'clsx';
import { SajuData } from '../model/types';
import styles from './OhaengAnalysis.module.css';

interface OhaengAnalysisProps {
  data: SajuData;
}

const ELEMENT_INFO = {
  wood: { name: '목', hanja: '木', color: '#4ade80' },
  fire: { name: '화', hanja: '火', color: '#f87171' },
  earth: { name: '토', hanja: '土', color: '#fbbf24' },
  metal: { name: '금', hanja: '金', color: '#94a3b8' },
  water: { name: '수', hanja: '水', color: '#1e293b' },
};

export const OhaengAnalysis = ({ data }: OhaengAnalysisProps) => {
  const { ohaengDistribution, ohaengAnalysis } = data;
  const total = Object.values(ohaengDistribution).reduce((sum, val) => sum + val, 0);

  return (
    <div className={styles.container}>
      <h3 className={styles.mainTitle}>오행 분포 (五行分布)</h3>

      <div className={styles.horizontalGrid}>
        {(Object.entries(ohaengDistribution) as [keyof typeof ELEMENT_INFO, number][]).map(([key, count]) => {
          const info = ELEMENT_INFO[key];
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={key} className={styles.elementRow}>
              <div className={clsx(styles.elementIcon, styles[key])}>
                {info.hanja}
              </div>
              <div className={styles.elementInfo}>
                <div className={styles.elementLabel}>
                  <span className={styles.name}>{info.name}</span>
                  <span className={styles.count}>{count}개</span>
                </div>
                <div className={styles.barContainer}>
                  <div
                    className={clsx(styles.bar, styles[key])}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <div className={styles.percentageText}>{Math.round(percentage)}%</div>
            </div>
          );
        })}
      </div>

      <div className={styles.interpretation}>
        <p className={styles.summaryText}>{ohaengAnalysis.interpretation}</p>
        <div className={styles.tags}>
          {ohaengAnalysis.excess.map((tag, i) => (
            <span key={i} className={clsx(styles.tag, styles.excess)}># {tag} 과다</span>
          ))}
          {ohaengAnalysis.missing.map((tag, i) => (
            <span key={i} className={clsx(styles.tag, styles.missing)}># {tag} 부족</span>
          ))}
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className={styles.detailedAnalysis}>
        <h4 className={styles.detailedTitle}>상세 분석</h4>
        {ohaengAnalysis.elements.map(({ element, name, count, level, description }) => {
          const info = ELEMENT_INFO[element as keyof typeof ELEMENT_INFO];
          return (
            <div key={element} className={styles.elementDetail}>
              <div className={styles.elementHeader}>
                <div
                  className={clsx(styles.elementBadge, styles[element])}
                >
                  {name}
                </div>
                <div className={styles.elementStats}>
                  <span className={styles.elementCount}>{count}개</span>
                  <span className={styles.elementLevel}>({level})</span>
                </div>
              </div>
              <p className={styles.elementDescription}>{description}</p>
            </div>
          );
        })}
      </div>

      <div className={styles.disclaimer}>
        오행 분석 결과는 사주의 전반적인 경향을 파악하기 위한 조언입니다.
        개별 요소의 상호작용에 따라 실제 작용은 달라질 수 있으므로 참고용으로 활용해 주세요.
      </div>
    </div>
  );
};
