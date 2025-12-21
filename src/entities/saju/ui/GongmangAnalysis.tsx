import clsx from 'clsx';
import { SajuData } from '../model/types';
import { GONGMANG_MEANING, GONGMANG_DESCRIPTION, GONGMANG_BASIS_INFO } from '../../../shared/lib/saju/data/Gongmang';
import styles from './GongmangAnalysis.module.css';

interface Props {
    data: SajuData;
}

// 지지 한자-한글 변환
const JI_HAN_TO_KOR: Record<string, string> = {
    '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
    '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

const GongmangSection = ({
    type,
    basePillar,
    gongmangJi,
    affectedPillars,
}: {
    type: 'yearBased' | 'dayBased';
    basePillar: string;
    gongmangJi: [string, string];
    affectedPillars: Array<{
        pillar: string;
        haegong?: { isHaegong: boolean; reason: string | null };
    }>;
}) => {
    const info = GONGMANG_BASIS_INFO[type];
    const ji1Kor = JI_HAN_TO_KOR[gongmangJi[0]] || gongmangJi[0];
    const ji2Kor = JI_HAN_TO_KOR[gongmangJi[1]] || gongmangJi[1];

    return (
        <div className={clsx(styles.gongmangSection, type === 'dayBased' && styles.primary)}>
            <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>{info.title}</h4>
                <span className={styles.basePillar}>{basePillar} 기준</span>
            </div>

            <p className={styles.weightInfo}>{info.weight}</p>

            <div className={styles.gongmangChars}>
                <span className={styles.char}>{ji1Kor}({gongmangJi[0]})</span>
                <span className={styles.char}>{ji2Kor}({gongmangJi[1]})</span>
            </div>

            {affectedPillars.length > 0 ? (
                <div className={styles.affectedList}>
                    {affectedPillars.map((item, idx) => {
                        const pillarType = item.pillar.replace('주', '지');
                        const meaning = GONGMANG_MEANING[pillarType];
                        const isHaegong = item.haegong?.isHaegong;

                        return (
                            <div key={idx} className={clsx(styles.affectedItem, isHaegong && styles.haegong)}>
                                <div className={styles.pillarInfo}>
                                    <span className={styles.pillarName}>{item.pillar}</span>
                                    {isHaegong && (
                                        <span className={styles.haegongBadge}>해공</span>
                                    )}
                                </div>
                                <div className={styles.pillarDetails}>
                                    {meaning && <span className={styles.pillarMeaning}>{meaning}</span>}
                                    {isHaegong && item.haegong?.reason && (
                                        <span className={styles.haegongReason}>{item.haegong.reason}으로 해소</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className={styles.noAffected}>해당 공망에 걸린 주가 없습니다.</p>
            )}
        </div>
    );
};

export const GongmangAnalysis = ({ data }: Props) => {
    const gongmang = data.gongmang;

    if (!gongmang) {
        return null;
    }

    const { yearBased, dayBased } = gongmang;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>공망 분석 (空亡分析)</h3>

            <div className={styles.gongmangGrid}>
                <GongmangSection
                    type="dayBased"
                    basePillar={`${data.day.gan}${data.day.ji}`}
                    gongmangJi={dayBased.gongmangJi}
                    affectedPillars={dayBased.affectedPillars}
                />
                <GongmangSection
                    type="yearBased"
                    basePillar={`${data.year.gan}${data.year.ji}`}
                    gongmangJi={yearBased.gongmangJi}
                    affectedPillars={yearBased.affectedPillars}
                />
            </div>

            <p className={styles.description}>{GONGMANG_DESCRIPTION}</p>
        </div>
    );
};
