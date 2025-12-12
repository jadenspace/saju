import { useEffect, useState } from 'react';
import { SajuData } from '../model/types';
import { calculateNewYearFortune, NewYearFortune } from '../../../shared/lib/saju/NewYearFortune';
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
        <h3>{fortune.year}년 신년운세</h3>
        <p className={styles.subtitle}>병오년(丙午年) 붉은 말의 해</p>
      </div>

      <div className={styles.overallSection}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreLabel}>총운</span>
          <span className={styles.scoreValue}>{fortune.overall.score}</span>
        </div>
        <div className={styles.summaryBox}>
          <p className={styles.summaryText}>{fortune.overall.summary}</p>
          <ul className={styles.detailList}>
            {fortune.overall.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.gridSection}>
        <FortuneCard title="재물운" data={fortune.wealth} icon="💰" />
        <FortuneCard title="애정운" data={fortune.love} icon="❤️" />
        <FortuneCard title="직업운" data={fortune.career} icon="💼" />
        <FortuneCard title="건강운" data={fortune.health} icon="💪" />
      </div>
    </div>
  );
};

const FortuneCard = ({ title, data, icon }: { title: string, data: any, icon: string }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.cardTitle}>{title}</span>
        <span className={clsx(styles.scoreBadge, getScoreClass(data.score))}>
          {data.score}점
        </span>
      </div>
      <p className={styles.cardSummary}>{data.summary}</p>
    </div>
  );
};

const getScoreClass = (score: number) => {
  if (score >= 80) return styles.high;
  if (score >= 60) return styles.medium;
  return styles.low;
};
