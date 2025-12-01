import { SajuData } from '../model/types';
import styles from './OhaengAnalysis.module.css';

interface OhaengAnalysisProps {
  data: SajuData;
}

export const OhaengAnalysis = ({ data }: OhaengAnalysisProps) => {
  const { ohaengDistribution, ohaengAnalysis } = data;
  
  const elementInfo = [
    { key: 'wood', name: '목(木)', color: '#4ade80' },
    { key: 'fire', name: '화(火)', color: '#f87171' },
    { key: 'earth', name: '토(土)', color: '#fbbf24' },
    { key: 'metal', name: '금(金)', color: '#e5e7eb' },
    { key: 'water', name: '수(水)', color: '#60a5fa' },
  ];

  const maxCount = Math.max(...Object.values(ohaengDistribution));
  const total = Object.values(ohaengDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>오행 분석</h3>
      
      {/* Distribution Chart */}
      <div className={styles.chart}>
        {elementInfo.map(({ key, name, color }) => {
          const count = ohaengDistribution[key as keyof typeof ohaengDistribution];
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const barHeight = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={key} className={styles.barContainer}>
              <div className={styles.barWrapper}>
                <div 
                  className={styles.bar}
                  style={{ 
                    height: `${barHeight}%`,
                    backgroundColor: color
                  }}
                >
                  <span className={styles.count}>{count}</span>
                </div>
              </div>
              <div className={styles.elementName}>{name}</div>
              <div className={styles.percentage}>{percentage.toFixed(0)}%</div>
            </div>
          );
        })}
      </div>

      {/* Interpretation */}
      <div className={styles.interpretation}>
        <p className={styles.summary}>{ohaengAnalysis.interpretation}</p>
        
        {ohaengAnalysis.excess.length > 0 && (
          <div className={styles.analysisItem}>
            <span className={styles.label}>강한 기운:</span>
            <span className={styles.value}>{ohaengAnalysis.excess.join(', ')}</span>
            <p className={styles.description}>
              해당 오행의 특성이 강하게 나타납니다. 장점을 발휘하되 과도함을 주의하세요.
            </p>
          </div>
        )}
        
        {ohaengAnalysis.deficient.length > 0 && (
          <div className={styles.analysisItem}>
            <span className={styles.label}>약한 기운:</span>
            <span className={styles.value}>{ohaengAnalysis.deficient.join(', ')}</span>
            <p className={styles.description}>
              해당 오행을 보완하면 균형을 이룰 수 있습니다.
            </p>
          </div>
        )}
        
        {ohaengAnalysis.missing.length > 0 && (
          <div className={styles.analysisItem}>
            <span className={styles.label}>부족한 기운:</span>
            <span className={styles.value}>{ohaengAnalysis.missing.join(', ')}</span>
            <p className={styles.description}>
              해당 오행의 특성이 부족합니다. 의식적으로 보완하는 것이 좋습니다.
            </p>
          </div>
        )}
      </div>

      {/* Detailed analysis for each element */}
      <div className={styles.detailedAnalysis}>
        <h4 className={styles.detailedTitle}>각 오행별 상세 분석</h4>
        {ohaengAnalysis.elements.map(({ element, name, count, level, description }) => {
          const elementColor = elementInfo.find(e => e.key === element)?.color || '#9ca3af';
          
          return (
            <div key={element} className={styles.elementDetail}>
              <div className={styles.elementHeader}>
                <div className={styles.elementBadge} style={{ backgroundColor: elementColor }}>
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
    </div>
  );
};

