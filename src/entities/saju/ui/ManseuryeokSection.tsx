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
import { getPolarity, getOhaeng, Element } from '../../../shared/lib/saju/calculators/TenGod';
import styles from './ManseuryeokSection.module.css';

// 한글 천간을 한자로 변환하는 매핑
const KOREAN_TO_HAN_GAN: Record<string, string> = {
    '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
    '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
};

// 오행별 지장간 색상 매핑
const ELEMENT_COLOR_MAP: Record<Element, { bg: string; color: string; border: string }> = {
    wood: { bg: '#4ade80', color: '#fff', border: '#22c55e' },
    fire: { bg: '#f87171', color: '#fff', border: '#ef4444' },
    earth: { bg: '#fbbf24', color: '#000', border: '#f59e0b' },
    metal: { bg: '#cbd5e1', color: '#000', border: '#94a3b8' }, // 더 밝은 회색으로 변경
    water: { bg: '#374151', color: '#fff', border: '#1f2937' },
};

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
    gongmangs = []
}: {
    pillar: Pillar;
    label: string;
    isIlju?: boolean;
    sinsals?: string[];
    gongmangs?: Array<{ type: '년' | '일'; isHaegong: boolean; reason?: string | null }>;
}) => {
    return (
        <div className={styles.column}>
            <Tooltip content={PILLAR_EXPLANATIONS[label] || ''}>
                <div className={styles.headerPill}>
                    <span className={styles.headerLabel}>{label}</span>
                    <span className={styles.headerGanZhi}>
                        ({pillar.gan}{pillar.ji})
                    </span>
                </div>
            </Tooltip>

            <Tooltip content={isIlju ? '나 자신의 일간입니다.' : (SIPSIN_EXPLANATIONS[pillar.tenGodsGan || ''] || '')}>
                <div className={clsx(styles.sipsin, isIlju && styles.ilgan)}>
                    {isIlju ? '일간(나)' : pillar.tenGodsGan}
                </div>
            </Tooltip>

            <Tooltip content={CHEONGAN_EXPLANATIONS[pillar.ganHan] || ''}>
                <div className={styles.characterWrapper}>
                    <div className={clsx(
                        styles.characterContainer, 
                        styles[pillar.ganElement || 'unknown'],
                        getPolarity(pillar.ganHan) === 'yang' ? styles.yang : styles.yin
                    )}>
                        {pillar.ganHan}
                    </div>
                    <span className={styles.koreanLabel}>{pillar.gan}</span>
                </div>
            </Tooltip>

            <Tooltip content={JIJI_EXPLANATIONS[pillar.jiHan] || ''}>
                <div className={styles.characterWrapper}>
                    <div className={clsx(
                        styles.characterContainer, 
                        styles[pillar.jiElement || 'unknown'],
                        getPolarity(pillar.jiHan) === 'yang' ? styles.yang : styles.yin
                    )}>
                        {pillar.jiHan}
                    </div>
                    <span className={styles.koreanLabel}>{pillar.ji}</span>
                </div>
            </Tooltip>

            <Tooltip content={SIPSIN_EXPLANATIONS[pillar.tenGodsJi || ''] || ''}>
                <div className={styles.sipsin}>
                    {pillar.tenGodsJi}
                </div>
            </Tooltip>

            <div className={styles.jijangganSection}>
                {pillar.jijanggan?.map((char, i) => {
                    // 한글을 한자로 변환 후 오행 및 음양 확인 (모든 지장간 글자에 적용)
                    const hanChar = KOREAN_TO_HAN_GAN[char] || char;
                    const element = getOhaeng(hanChar);
                    const polarity = getPolarity(hanChar);
                    const colorStyle = element ? ELEMENT_COLOR_MAP[element] : null;
                    // 음양에 따른 텍스트 색상 적용
                    const textColor = polarity === 'yang' ? '#fff' : '#000';
                    return (
                        <Tooltip key={i} content={pillar.jijangganTenGods?.[i] ? `${pillar.jijangganTenGods[i]} - ${SIPSIN_EXPLANATIONS[pillar.jijangganTenGods[i]] || ''}` : ''}>
                            <div className={styles.jijangganRow}>
                                <span 
                                    className={styles.jijangganChar}
                                    style={colorStyle ? {
                                        backgroundColor: colorStyle.bg,
                                        color: textColor,
                                        border: `1px solid ${colorStyle.border}`,
                                        fontWeight: '500'
                                    } : {
                                        color: 'var(--foreground)'
                                    }}
                                >{char}</span>
                                <span>{pillar.jijangganTenGods?.[i]}</span>
                            </div>
                        </Tooltip>
                    );
                })}
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
                {gongmangs.map((g, i) => {
                    const meaning = GONGMANG_MEANING[label.replace('주', '지')] || '해당 주가 비어있음을 뜻합니다.';
                    const tooltipContent = g.isHaegong
                        ? `${meaning}\n\n※ ${g.reason}으로 해공됨`
                        : meaning;
                    return (
                        <Tooltip key={i} content={tooltipContent}>
                            <div className={clsx(styles.gongmangTag, g.isHaegong && styles.haegong)}>
                                [{g.type}]공망
                            </div>
                        </Tooltip>
                    );
                })}
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

    const getGongmangs = (pillarLabel: string): Array<{ type: '년' | '일'; isHaegong: boolean; reason?: string | null }> => {
        if (!data.gongmang) return [];
        const result: Array<{ type: '년' | '일'; isHaegong: boolean; reason?: string | null }> = [];

        // 년공망 체크
        const yearBasedMatch = data.gongmang.yearBased.affectedPillars.find(p => p.pillar === pillarLabel);
        if (yearBasedMatch) {
            result.push({
                type: '년',
                isHaegong: yearBasedMatch.haegong?.isHaegong || false,
                reason: yearBasedMatch.haegong?.reason
            });
        }

        // 일공망 체크
        const dayBasedMatch = data.gongmang.dayBased.affectedPillars.find(p => p.pillar === pillarLabel);
        if (dayBasedMatch) {
            result.push({
                type: '일',
                isHaegong: dayBasedMatch.haegong?.isHaegong || false,
                reason: dayBasedMatch.haegong?.reason
            });
        }

        return result;
    };

    return (
        <div className={styles.manseuryeok}>
            <div className={styles.grid}>
                <PillarColumn
                    pillar={data.hour}
                    label="시주"
                    sinsals={getSinsal('시주')}
                    gongmangs={getGongmangs('시주')}
                />
                <PillarColumn
                    pillar={data.day}
                    label="일주"
                    isIlju
                    sinsals={getSinsal('일주')}
                    gongmangs={getGongmangs('일주')}
                />
                <PillarColumn
                    pillar={data.month}
                    label="월주"
                    sinsals={getSinsal('월주')}
                    gongmangs={getGongmangs('월주')}
                />
                <PillarColumn
                    pillar={data.year}
                    label="년주"
                    sinsals={getSinsal('년주')}
                    gongmangs={getGongmangs('년주')}
                />
            </div>
        </div>
    );
};
