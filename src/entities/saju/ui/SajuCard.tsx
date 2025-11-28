import clsx from 'clsx';
import { SajuData, Pillar } from '../model/types';
import styles from './SajuCard.module.css';

interface SajuCardProps {
  data: SajuData;
  className?: string;
}

const PillarView = ({ pillar, label }: { pillar: Pillar; label: string }) => (
  <div className={styles.pillar}>
    <div className={styles.label}>{label}</div>
    <div className={styles.characterBox}>
      <div className={clsx(styles.character, styles[pillar.ganElement || ''])}>{pillar.ganHan}</div>
      <div className={styles.korean}>{pillar.gan}</div>
    </div>
    <div className={styles.characterBox}>
      <div className={clsx(styles.character, styles[pillar.jiElement || ''])}>{pillar.jiHan}</div>
      <div className={styles.korean}>{pillar.ji}</div>
    </div>
  </div>
);

export const SajuCard = ({ data, className }: SajuCardProps) => {
  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.header}>
        <h2>사주팔자 (四柱八字)</h2>
        <p>{data.birthDate} {data.birthTime} {data.gender === 'male' ? '남' : '여'}</p>
      </div>
      <div className={styles.pillarsContainer}>
        <PillarView pillar={data.hour} label="시주 (Hour)" />
        <PillarView pillar={data.day} label="일주 (Day)" />
        <PillarView pillar={data.month} label="월주 (Month)" />
        <PillarView pillar={data.year} label="년주 (Year)" />
      </div>
    </div>
  );
};
