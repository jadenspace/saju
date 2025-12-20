import { SajuData } from '../model/types';
import { TWELVE_STAGES_MEANING, TWELVE_STAGES_HANJA, TWELVE_STAGES_DESCRIPTIONS, getStageEnergyLevel, TwelveStage } from '../../../shared/lib/saju/data/TwelveStages';
import styles from './TwelveStagesAnalysis.module.css';
import clsx from 'clsx';

interface Props {
    data: SajuData;
}

export const TwelveStagesAnalysis = ({ data }: Props) => {
    const pillars = [
        { name: '년주', pillar: data.year },
        { name: '월주', pillar: data.month },
        { name: '일주', pillar: data.day },
        { name: '시주', pillar: data.hour }
    ];

    const validPillars = pillars.filter(p => p.pillar.twelveStage && p.pillar.ganHan !== '?');

    if (validPillars.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>12운성 분석</h3>
            <p className={styles.subtitle}>
                일간({data.day.gan})이 각 지지를 만났을 때의 에너지 상태
            </p>

            <div className={styles.grid}>
                {validPillars.map(({ name, pillar }) => {
                    const stage = pillar.twelveStage as TwelveStage;
                    const meaning = TWELVE_STAGES_MEANING[stage];
                    const hanja = TWELVE_STAGES_HANJA[stage];
                    const description = TWELVE_STAGES_DESCRIPTIONS[stage];
                    const energyLevel = getStageEnergyLevel(stage);

                    return (
                        <div key={name} className={clsx(styles.card, styles[energyLevel])}>
                            <div className={styles.header}>
                                <span className={styles.pillarName}>{name}</span>
                                <span className={styles.branch}>{pillar.ji}({pillar.jiHan})</span>
                            </div>
                            <div className={styles.stageInfo}>
                                <span className={styles.stageName}>{stage}</span>
                                <span className={styles.stageHanja}>{hanja}</span>
                            </div>
                            <div className={styles.meaning}>
                                <span className={styles.meaningLabel}>{meaning.meaning}</span>
                                <span className={styles.stageLabel}>{meaning.stage}</span>
                            </div>
                            <div className={styles.energyBadge}>
                                에너지: {meaning.energy}
                            </div>
                            <p className={styles.description}>{description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
