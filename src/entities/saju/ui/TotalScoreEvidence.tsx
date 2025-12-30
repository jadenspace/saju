import { TotalScoreEvidence } from '../model/types';
import styles from './TotalScoreEvidence.module.css';

interface TotalScoreEvidenceProps {
  evidence: TotalScoreEvidence;
}

export const TotalScoreEvidenceComponent = ({ evidence }: TotalScoreEvidenceProps) => {
  const getEvalColor = (evaluation: string) => {
    switch (evaluation) {
      case '긍정': return styles.positive;
      case '부정': return styles.negative;
      default: return styles.neutral;
    }
  };

  const getPointDisplay = (point: number) => {
    if (point > 0) return `+${point}`;
    if (point < 0) return `${point}`;
    return '±0';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>총운 점수 계산 과정</h4>
        <p className={styles.description}>
          세운의 십신, 용신 충족도, 형충회합 관계 등을 종합하여 총운 점수가 계산됩니다.
        </p>
      </div>

      <div className={styles.timeline}>
        {/* Step 1: 기본 점수 */}
        <div className={styles.timelineStep}>
          <div className={styles.stepIndicatorWrapper}>
            <div className={styles.stepIndicator}>1</div>
            <div className={styles.stepLine}></div>
          </div>
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepTitle}>기본 점수</span>
              <span className={styles.stepResult}>{evidence.basePoint}점</span>
            </div>
            <p className={styles.stepCondition}>모든 사주의 기준점</p>
          </div>
        </div>

        {/* Step 2: 세운 십신 */}
        <div className={styles.timelineStep}>
          <div className={styles.stepIndicatorWrapper}>
            <div className={styles.stepIndicator}>2</div>
            <div className={styles.stepLine}></div>
          </div>
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepTitle}>세운 십신 분석</span>
              <span className={`${styles.stepResult} ${getEvalColor(evidence.seunTenGods.evaluation)}`}>
                {evidence.seunTenGods.evaluation} ({getPointDisplay(evidence.seunTenGods.point)})
              </span>
            </div>
            <p className={styles.stepCondition}>
              천간: {evidence.seunTenGods.gan} | 지지: {evidence.seunTenGods.ji}
            </p>
            {evidence.seunTenGods.details && evidence.seunTenGods.details.length > 0 && (
              <div className={styles.detailsList}>
                {evidence.seunTenGods.details.map((detail, idx) => (
                  <p key={idx} className={styles.stepNote}>{detail}</p>
                ))}
              </div>
            )}
            {!evidence.seunTenGods.details && (
              <p className={styles.stepNote}>
                {evidence.seunTenGods.evaluation === '긍정'
                  ? '길신(吉神)으로 좋은 기운을 가져옵니다.'
                  : evidence.seunTenGods.evaluation === '부정'
                  ? '흉신(凶神)으로 주의가 필요합니다.'
                  : '보통의 십신으로 중립적입니다.'}
              </p>
            )}
          </div>
        </div>

        {/* Step 3: 용신 충족도 */}
        <div className={styles.timelineStep}>
          <div className={styles.stepIndicatorWrapper}>
            <div className={styles.stepIndicator}>3</div>
            <div className={styles.stepLine}></div>
          </div>
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepTitle}>용신 충족도</span>
              <span className={`${styles.stepResult} ${evidence.yongshinMatch.point > 0 ? styles.positive : evidence.yongshinMatch.point < 0 ? styles.negative : styles.neutral}`}>
                {getPointDisplay(evidence.yongshinMatch.point)}
              </span>
            </div>
            <p className={styles.stepCondition}>
              용신: {evidence.yongshinMatch.yongshin} |
              세운: 천간({evidence.yongshinMatch.seunGanElement}), 지지({evidence.yongshinMatch.seunJiElement})
            </p>
            {evidence.yongshinMatch.details && evidence.yongshinMatch.details.length > 0 && (
              <div className={styles.detailsList}>
                {evidence.yongshinMatch.details.map((detail, idx) => (
                  <p key={idx} className={styles.stepNote}>{detail}</p>
                ))}
              </div>
            )}
            {!evidence.yongshinMatch.details && (
              <p className={styles.stepNote}>
                {evidence.yongshinMatch.isMatch
                  ? '세운이 용신과 일치하여 매우 좋습니다.'
                  : evidence.yongshinMatch.isControlling
                  ? '세운이 용신을 극하여 주의가 필요합니다.'
                  : '세운과 용신의 관계가 중립적입니다.'}
              </p>
            )}
          </div>
        </div>

        {/* Step 4: 형충회합 */}
        <div className={styles.timelineStep}>
          <div className={styles.stepIndicatorWrapper}>
            <div className={styles.stepIndicator}>4</div>
            <div className={styles.stepLine}></div>
          </div>
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepTitle}>형충회합 관계</span>
              <span className={`${styles.stepResult} ${evidence.jiRelationships.point > 0 ? styles.positive : evidence.jiRelationships.point < 0 ? styles.negative : styles.neutral}`}>
                {getPointDisplay(evidence.jiRelationships.point)}
              </span>
            </div>
            <div className={styles.relationshipDetails}>
              {evidence.jiRelationships.details.map((detail, idx) => (
                <div key={idx} className={styles.relationshipItem}>
                  {detail.includes('합(合)') && !detail.includes('반합') && <span className={styles.badge + ' ' + styles.badgePositive}>합</span>}
                  {detail.includes('반합') && <span className={styles.badge + ' ' + styles.badgePositive}>반합</span>}
                  {detail.includes('충') && <span className={styles.badge + ' ' + styles.badgeNegative}>충</span>}
                  {detail.includes('형') && <span className={styles.badge + ' ' + styles.badgeWarning}>형</span>}
                  <span>{detail}</span>
                </div>
              ))}
            </div>
            {evidence.jiRelationships.calculationDetails && evidence.jiRelationships.calculationDetails.length > 0 && (
              <div className={styles.detailsList}>
                {evidence.jiRelationships.calculationDetails.map((detail, idx) => (
                  <p key={idx} className={styles.stepNote}>{detail}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Final Step: 최종 점수 */}
        <div className={`${styles.timelineStep} ${styles.finalStep}`}>
          <div className={styles.stepIndicatorWrapper}>
            <div className={`${styles.stepIndicator} ${styles.finalIndicator}`}>✓</div>
          </div>
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepTitle}>최종 총운 점수</span>
            </div>
            <div className={styles.finalCalculation}>
              <div className={styles.calcRow}>
                <span>기본 점수</span>
                <span>{evidence.basePoint}</span>
              </div>
              <div className={styles.calcRow}>
                <span>십신</span>
                <span>{getPointDisplay(evidence.seunTenGods.point)}</span>
              </div>
              <div className={styles.calcRow}>
                <span>용신</span>
                <span>{getPointDisplay(evidence.yongshinMatch.point)}</span>
              </div>
              <div className={styles.calcRow}>
                <span>형충회합</span>
                <span>{getPointDisplay(evidence.jiRelationships.point)}</span>
              </div>
              <div className={`${styles.calcRow} ${styles.calcTotal}`}>
                <span>합계</span>
                <span>{evidence.totalPoint.toFixed(1)}점</span>
              </div>
              <div className={`${styles.calcRow} ${styles.calcFinal}`}>
                <span>점수 환산 (×20)</span>
                <span className={styles.finalScore}>{evidence.finalScore}점</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.note}>
        점수는 1-5점 척도를 20배하여 20-100점으로 환산됩니다.
        명리학적 요소를 종합하여 객관적으로 산출한 결과입니다.
      </div>
    </div>
  );
};
