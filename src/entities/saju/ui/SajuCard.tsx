import clsx from 'clsx';
import { CHEONGAN_EXPLANATIONS, JIJI_EXPLANATIONS, SIPSIN_EXPLANATIONS } from '../../../shared/lib/saju/SajuExplanations';
import { Pillar, SajuData } from '../model/types';
import styles from './SajuCard.module.css';

interface SajuCardProps {
  data: SajuData;
  className?: string;
}

const PillarView = ({ pillar, label }: { pillar: Pillar; label: string }) => (
  <div className={styles.pillar}>
    <div className={styles.label}>{label}</div>
    <div className={styles.characterBox}>
      {pillar.tenGodsGan && (
        <div className={styles.tooltipContainer}>
          <div className={styles.sipsin}>{pillar.tenGodsGan}</div>
          <div className={styles.tooltip}>{SIPSIN_EXPLANATIONS[pillar.tenGodsGan] || ''}</div>
        </div>
      )}
      <div className={styles.tooltipContainer}>
        <div className={clsx(styles.character, styles[pillar.ganElement || ''])}>{pillar.ganHan}</div>
        <div className={styles.tooltip}>{CHEONGAN_EXPLANATIONS[pillar.ganHan] || ''}</div>
      </div>
      <div className={styles.korean}>{pillar.gan}</div>
    </div>
    <div className={styles.characterBox}>
      {pillar.tenGodsJi && (
        <div className={styles.tooltipContainer}>
          <div className={styles.sipsin}>{pillar.tenGodsJi}</div>
          <div className={styles.tooltip}>{SIPSIN_EXPLANATIONS[pillar.tenGodsJi] || ''}</div>
        </div>
      )}
      <div className={styles.tooltipContainer}>
        <div className={clsx(styles.character, styles[pillar.jiElement || ''])}>{pillar.jiHan}</div>
        <div className={styles.tooltip}>{JIJI_EXPLANATIONS[pillar.jiHan] || ''}</div>
      </div>
      <div className={styles.korean}>{pillar.ji}</div>
      {pillar.jijanggan && pillar.jijanggan.length > 0 && (
        <div className={styles.jijanggan}>
          {pillar.jijanggan.map((char, i) => (
            <div key={i} className={styles.tooltipContainer}>
              <span className={styles.jijangganChar}>{char}</span>
              <div className={styles.tooltip}>
                {pillar.jijangganTenGods?.[i] && SIPSIN_EXPLANATIONS[pillar.jijangganTenGods[i]] 
                  ? `${pillar.jijangganTenGods[i]} - ${SIPSIN_EXPLANATIONS[pillar.jijangganTenGods[i]]}`
                  : pillar.jijangganTenGods?.[i] || ''}
              </div>
            </div>
          ))}
        </div>
      )}
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
