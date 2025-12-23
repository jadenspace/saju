import { useEffect, useState } from 'react';
import { SajuData, NewYearFortune } from '../model/types';
import { calculateNewYearFortune } from '../../../shared/lib/saju/calculators/NewYearFortune';
import styles from './NewYearFortuneAnalysis.module.css';
import clsx from 'clsx';

interface Props {
  data: SajuData;
}

export const NewYearFortuneAnalysis = ({ data }: Props) => {
  const [fortune, setFortune] = useState<NewYearFortune | null>(null);

  useEffect(() => {
    if (data) {
      const result = calculateNewYearFortune(data);
      setFortune(result);
    }
  }, [data]);

  if (!fortune) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.subtitle}>병오년(丙午年) 붉은 말의 해</p>
      </div>

      <div className={styles.overallSection}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreLabel}>총운</span>
          <span className={styles.scoreValue}>{fortune.yearSummary.score}</span>
        </div>
        <div className={styles.summaryBox}>
          <p className={styles.summaryText}>"{fortune.yearSummary.summaryText}"</p>
          <div className={styles.natureBadge}>
            운의 성격: {fortune.yearNature}
          </div>
          <div className={styles.tagSection}>
            <span className={styles.tag}># {fortune.analysisTags.dominantTengod} 주도</span>
            {fortune.analysisTags.event && (
              <span className={styles.tag}># {fortune.analysisTags.palace}지 {fortune.analysisTags.event}</span>
            )}
            <span className={styles.tag}># {fortune.analysisTags.theme}</span>
            {fortune.analysisTags.ohaengLack && (
              <span className={styles.tag}># {fortune.analysisTags.ohaengLack} 보완</span>
            )}
          </div>
          <ul className={styles.reasonList}>
            {fortune.yearSummary.reason.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 용신 분석 섹션 */}
      {data.yongshin && (
        <div className={styles.yongshinSection}>
          <h4 className={styles.sectionTitle}>🔮 용신 분석</h4>
          <div className={styles.yongshinBox}>
            <div className={styles.yongshinItem}>
              <span className={styles.yongshinLabel}>주 용신</span>
              <span className={styles.yongshinValue}>{data.yongshin.primary}</span>
              <span className={styles.yongshinType}>({data.yongshin.type})</span>
            </div>
            {data.yongshin.secondary && (
              <div className={styles.yongshinItem}>
                <span className={styles.yongshinLabel}>보조 용신</span>
                <span className={styles.yongshinValue}>{data.yongshin.secondary}</span>
              </div>
            )}
            {data.yongshin.heeshin && data.yongshin.heeshin.length > 0 && (
              <div className={styles.yongshinItem}>
                <span className={styles.yongshinLabel}>희신</span>
                <span className={styles.yongshinValue}>{data.yongshin.heeshin.join(', ')}</span>
              </div>
            )}
            {data.yongshin.gishin && data.yongshin.gishin.length > 0 && (
              <div className={styles.yongshinItem}>
                <span className={styles.yongshinLabel}>기신</span>
                <span className={styles.yongshinValue}>{data.yongshin.gishin.join(', ')}</span>
              </div>
            )}
          </div>
          <p className={styles.yongshinDescription}>
            용신은 사주 균형에 가장 필요한 오행입니다. 올해 용신 {data.yongshin.primary}이 들어오면 운세가 상승하고,
            {data.yongshin.gishin && data.yongshin.gishin.length > 0 && ` 기신 ${data.yongshin.gishin[0]}이 강하면 주의가 필요합니다.`}
          </p>
        </div>
      )}

      <div className={styles.areaGrid}>
        <ExpertAreaCard title="재물운" data={fortune.fortuneAreas.money} icon="💰" />
        <ExpertAreaCard title="애정·관계운" data={fortune.fortuneAreas.relationship} icon="❤️" />
        <ExpertAreaCard title="직업·사회운" data={fortune.fortuneAreas.career} icon="💼" />
        <ExpertAreaCard title="자기계발·내적 성찰" data={fortune.fortuneAreas.selfGrowth} icon="📚" />
      </div>

      {/* 전체 월운 */}
      {fortune.allMonths && fortune.allMonths.length > 0 && (
        <div className={styles.allMonthsSection}>
          <h4 className={styles.sectionTitle}>📅 전체 월운 (12개월)</h4>
          <div className={styles.allMonthsGrid}>
            {fortune.allMonths.map((m, idx) => (
              <div key={idx} className={clsx(styles.monthCard, getMonthScoreClass(m.score))}>
                <div className={styles.monthHeader}>
                  <span className={styles.monthNumber}>{m.month}월</span>
                  <span className={styles.monthGanji}>{m.gan}{m.ji}</span>
                  <span className={styles.monthScore}>{'★'.repeat(m.score)}{'☆'.repeat(5 - m.score)}</span>
                </div>
                <span className={styles.monthTheme}>{m.theme}</span>
                <p className={styles.monthAdvice}>{m.advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 주요 월운 */}
      {fortune.keyMonths && fortune.keyMonths.length > 0 && (
        <div className={styles.keyMonthsSection}>
          <h4 className={styles.sectionTitle}>⭐ 주요 월운</h4>
          <div className={styles.monthsGrid}>
            {fortune.keyMonths.map((m, idx) => (
              <div key={idx} className={styles.monthCard}>
                <span className={styles.monthNumber}>{m.month}월</span>
                <span className={styles.monthTheme}>{m.theme}</span>
                <p className={styles.monthAdvice}>{m.advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 행운 정보 */}
      {fortune.luckyInfo && (
        <div className={styles.luckySection}>
          <h4 className={styles.sectionTitle}>🍀 행운 정보</h4>
          <div className={styles.luckyGrid}>
            <div className={styles.luckyItem}>
              <span className={styles.luckyIcon}>🎨</span>
              <span className={styles.luckyLabel}>행운의 색상</span>
              <span className={styles.luckyValue}>{fortune.luckyInfo.color}</span>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyIcon}>🧭</span>
              <span className={styles.luckyLabel}>행운의 방향</span>
              <span className={styles.luckyValue}>{fortune.luckyInfo.direction}</span>
            </div>
            <div className={styles.luckyItem}>
              <span className={styles.luckyIcon}>🔢</span>
              <span className={styles.luckyLabel}>행운의 숫자</span>
              <span className={styles.luckyValue}>{fortune.luckyInfo.number}</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.actionGuide}>
        <div className={styles.guideBox}>
          <h4 className={styles.doTitle}>✅ 올해 운을 잘 쓰는 행동 (Do)</h4>
          <ul>{fortune.fortuneGuide.do.map((v: string, i: number) => <li key={i}>{v}</li>)}</ul>
        </div>
        <div className={styles.guideBox}>
          <h4 className={styles.dontTitle}>⚠️ 올해 특히 조심해야 할 행동 (Don't)</h4>
          <ul>{fortune.fortuneGuide.dont.map((v: string, i: number) => <li key={i}>{v}</li>)}</ul>
        </div>
      </div>
    </div>
  );
};

const ExpertAreaCard = ({ title, data, icon }: { title: string, data: any, icon: string }) => {
  return (
    <div className={styles.expertCard}>
      <div className={styles.cardHeader}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.cardTitle}>{title}</span>
        <span className={clsx(styles.scoreBadge, getScoreClass(data.score))}>
          {data.score}점
        </span>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.prosText}><strong>좋은 점:</strong> {data.pros}</p>
        <p className={styles.consText}><strong>주의점:</strong> {data.cons}</p>
        <div className={styles.strategyBox}>
          <strong>이렇게 쓰면 좋다:</strong> {data.strategy}
        </div>
      </div>
    </div>
  );
};

const getScoreClass = (score: number) => {
  if (score >= 80) return styles.high;
  if (score >= 60) return styles.medium;
  return styles.low;
};

const getMonthScoreClass = (score: number) => {
  if (score >= 4) return styles.monthHigh;
  if (score >= 3) return styles.monthMedium;
  if (score >= 2) return styles.monthLow;
  return styles.monthVeryLow;
};
