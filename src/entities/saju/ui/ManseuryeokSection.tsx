import clsx from 'clsx';
import { SajuData, Pillar } from '../model/types';
import {
    CHEONGAN_EXPLANATIONS,
    JIJI_EXPLANATIONS,
    SIPSIN_EXPLANATIONS,
    PILLAR_EXPLANATIONS
} from '../../../shared/lib/saju/data/SajuExplanations';
import { TWELVE_STAGES_DESCRIPTIONS } from '../../../shared/lib/saju/data/TwelveStages';
import { SINSAL_DESCRIPTIONS, TwelveSinsal } from '../../../shared/lib/saju/data/TwelveSinsal';
import { GONGMANG_MEANING } from '../../../shared/lib/saju/data/Gongmang';
import styles from './ManseuryeokSection.module.css';

interface ManseuryeokSectionProps {
    data: SajuData;
}

const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
    return (
        <div className={styles.tooltipContainer}>
            {children}
            <div className={styles.tooltip}>
                {content.split('\n').map((line, i, arr) => (
                    <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                    </span>
                ))}
            </div>
        </div>
    );
};

const PillarColumn = ({
    pillar,
    label,
    isIlju = false,
    sinsals = [],
    isGongmang = false
}: {
    pillar: Pillar;
    label: string;
    isIlju?: boolean;
    sinsals?: string[];
    isGongmang?: boolean;
}) => {
    return (
        <div className={styles.column}>
            <Tooltip content={PILLAR_EXPLANATIONS[label] || ''}>
                <div className={styles.headerPill}>
                    <span className={styles.headerLabel}>{label}</span>
                    <span className={styles.headerGanZhi}>({pillar.ganHan}{pillar.jiHan})</span>
                </div>
            </Tooltip>

            <Tooltip content={isIlju ? '나 자신의 일간입니다.' : (SIPSIN_EXPLANATIONS[pillar.tenGodsGan || ''] || '')}>
                <div className={clsx(styles.sipsin, isIlju && styles.ilgan)}>
                    {isIlju ? '일간(나)' : pillar.tenGodsGan}
                </div>
            </Tooltip>

            <Tooltip content={CHEONGAN_EXPLANATIONS[pillar.ganHan] || ''}>
                <div className={clsx(styles.characterContainer, styles[pillar.ganElement || 'unknown'])}>
                    {pillar.ganHan}
                </div>
            </Tooltip>

            <Tooltip content={JIJI_EXPLANATIONS[pillar.jiHan] || ''}>
                <div className={clsx(styles.characterContainer, styles[pillar.jiElement || 'unknown'])}>
                    {pillar.jiHan}
                </div>
            </Tooltip>

            <Tooltip content={SIPSIN_EXPLANATIONS[pillar.tenGodsJi || ''] || ''}>
                <div className={styles.sipsin}>
                    {pillar.tenGodsJi}
                </div>
            </Tooltip>

            <div className={styles.jijangganSection}>
                {pillar.jijanggan?.map((char, i) => (
                    <Tooltip key={i} content={pillar.jijangganTenGods?.[i] ? `${pillar.jijangganTenGods[i]} - ${SIPSIN_EXPLANATIONS[pillar.jijangganTenGods[i]] || ''}` : ''}>
                        <div className={styles.jijangganRow}>
                            <span className={styles.jijangganChar}>{char}</span>
                            <span>{pillar.jijangganTenGods?.[i]}</span>
                        </div>
                    </Tooltip>
                ))}
            </div>

            <Tooltip content={pillar.twelveStage ? (TWELVE_STAGES_DESCRIPTIONS[pillar.twelveStage as keyof typeof TWELVE_STAGES_DESCRIPTIONS] || '') : ''}>
                <div className={styles.twelveStage}>
                    {pillar.twelveStage}
                </div>
            </Tooltip>

            <div className={styles.sinsalContainer}>
                {sinsals.map((s, i) => (
                    <Tooltip key={i} content={SINSAL_DESCRIPTIONS[s as TwelveSinsal] || ''}>
                        <span className={styles.sinsalItem}>{s}</span>
                    </Tooltip>
                ))}
            </div>

            <div className={styles.gongmangContainer}>
                {isGongmang && (
                    <Tooltip content={GONGMANG_MEANING[label.replace('주', '지')] || '해당 주가 비어있음을 뜻합니다.'}>
                        <div className={styles.gongmangTag}>공망</div>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export const ManseuryeokSection = ({ data }: ManseuryeokSectionProps) => {
    const getSinsal = (pillarLabel: string) => {
        const sinsals: string[] = [];
        data.twelveSinsalAnalysis?.yearBased.forEach(s => {
            if (s.pillar === pillarLabel) sinsals.push(s.sinsal);
        });
        data.twelveSinsalAnalysis?.dayBased.forEach(s => {
            if (s.pillar === pillarLabel) sinsals.push(s.sinsal);
        });
        return Array.from(new Set(sinsals));
    };

    const checkGongmang = (pillarLabel: string) => {
        return data.gongmang?.affectedPillars.includes(pillarLabel) || false;
    };

    return (
        <div className={styles.manseuryeok}>
            <div className={styles.grid}>
                <PillarColumn
                    pillar={data.hour}
                    label="시주"
                    sinsals={getSinsal('시주')}
                    isGongmang={checkGongmang('시주')}
                />
                <PillarColumn
                    pillar={data.day}
                    label="일주"
                    isIlju
                    sinsals={getSinsal('일주')}
                    isGongmang={checkGongmang('일주')}
                />
                <PillarColumn
                    pillar={data.month}
                    label="월주"
                    sinsals={getSinsal('월주')}
                    isGongmang={checkGongmang('월주')}
                />
                <PillarColumn
                    pillar={data.year}
                    label="년주"
                    sinsals={getSinsal('년주')}
                    isGongmang={checkGongmang('년주')}
                />
            </div>
        </div>
    );
};
