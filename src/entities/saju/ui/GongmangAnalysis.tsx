import { SajuData } from '../model/types';
import { GONGMANG_MEANING, GONGMANG_DESCRIPTION } from '../../../shared/lib/saju/data/Gongmang';
import styles from './GongmangAnalysis.module.css';

interface Props {
    data: SajuData;
}

// 지지 한자-한글 변환
const JI_HAN_TO_KOR: Record<string, string> = {
    '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
    '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

export const GongmangAnalysis = ({ data }: Props) => {
    const gongmang = data.gongmang;

    if (!gongmang) {
        return null;
    }

    const [ji1, ji2] = gongmang.dayBased;
    const ji1Kor = JI_HAN_TO_KOR[ji1] || ji1;
    const ji2Kor = JI_HAN_TO_KOR[ji2] || ji2;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>공망 분석</h3>
            <p className={styles.subtitle}>
                일주({data.day.gan}{data.day.ji}) 기준 공망 지지
            </p>

            <div className={styles.gongmangInfo}>
                <div className={styles.gongmangChars}>
                    <span className={styles.char}>{ji1Kor}({ji1})</span>
                    <span className={styles.char}>{ji2Kor}({ji2})</span>
                </div>
            </div>

            {gongmang.affectedPillars.length > 0 && (
                <div className={styles.affectedSection}>
                    <h4 className={styles.affectedTitle}>공망에 해당하는 주</h4>
                    <div className={styles.affectedList}>
                        {gongmang.affectedPillars.map((pillar, idx) => {
                            const pillarType = pillar.replace('주', '지');
                            const meaning = GONGMANG_MEANING[pillarType];
                            return (
                                <div key={idx} className={styles.affectedItem}>
                                    <span className={styles.pillarName}>{pillar}</span>
                                    {meaning && <span className={styles.pillarMeaning}>{meaning}</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {gongmang.affectedPillars.length === 0 && (
                <p className={styles.noAffected}>
                    사주 내 공망에 해당하는 지지가 없습니다.
                </p>
            )}

            <p className={styles.description}>{GONGMANG_DESCRIPTION}</p>
        </div>
    );
};
