import { SajuData } from '../model/types';
import { TWELVE_SINSAL_MEANING, TWELVE_SINSAL_HANJA, SINSAL_DESCRIPTIONS, isMajorSinsal, TwelveSinsal } from '../../../shared/lib/saju/data/TwelveSinsal';
import styles from './TwelveSinsalAnalysis.module.css';
import clsx from 'clsx';

interface Props {
    data: SajuData;
}

export const TwelveSinsalAnalysis = ({ data }: Props) => {
    const analysis = data.twelveSinsalAnalysis;

    if (!analysis || (analysis.yearBased.length === 0 && analysis.dayBased.length === 0)) {
        return null;
    }

    const renderSinsalList = (items: Array<{ pillar: string; sinsal: string }>, basis: string) => {
        if (items.length === 0) return null;

        return (
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>{basis} 기준</h4>
                <div className={styles.sinsalList}>
                    {items.map(({ pillar, sinsal }, idx) => {
                        const sinsalTyped = sinsal as TwelveSinsal;
                        const hanja = TWELVE_SINSAL_HANJA[sinsalTyped];
                        const meaning = TWELVE_SINSAL_MEANING[sinsalTyped];
                        const description = SINSAL_DESCRIPTIONS[sinsalTyped];
                        const isMajor = isMajorSinsal(sinsalTyped);

                        return (
                            <div key={idx} className={clsx(styles.sinsalItem, isMajor && styles.major)}>
                                <div className={styles.itemHeader}>
                                    <span className={styles.pillarName}>{pillar}</span>
                                    {isMajor && <span className={styles.majorBadge}>주요</span>}
                                </div>
                                <div className={styles.sinsalInfo}>
                                    <span className={styles.sinsalName}>{sinsal}</span>
                                    <span className={styles.sinsalHanja}>{hanja}</span>
                                </div>
                                <p className={styles.meaning}>{meaning}</p>
                                <p className={styles.description}>{description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>12신살 분석</h3>
            <p className={styles.subtitle}>
                사주 내 지지들 간의 신살 관계
            </p>

            {renderSinsalList(analysis.yearBased, '년지')}
            {renderSinsalList(analysis.dayBased, '일지')}
        </div>
    );
};
