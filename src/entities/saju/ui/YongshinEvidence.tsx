'use client';

import { YongshinEvidence as YongshinEvidenceType, YongshinConfidence } from '@/entities/saju/model/types';
import styles from './YongshinEvidence.module.css';
import clsx from 'clsx';

interface YongshinEvidenceProps {
  evidence: YongshinEvidenceType;
  confidence?: YongshinConfidence;
}

export const YongshinEvidence = ({ evidence, confidence }: YongshinEvidenceProps) => {
  const elementLabels: Record<string, string> = {
    wood: '목(木)',
    fire: '화(火)',
    earth: '토(土)',
    metal: '금(金)',
    water: '수(水)',
  };

  const getElementColor = (el: string) => {
    switch (el) {
      case 'wood': return 'var(--ohaeng-wood)';
      case 'fire': return 'var(--ohaeng-fire)';
      case 'earth': return 'var(--ohaeng-earth)';
      case 'metal': return 'var(--ohaeng-metal)';
      case 'water': return 'var(--ohaeng-water)';
      default: return 'var(--primary)';
    }
  };

  const maxScore = Math.max(...Object.values(evidence.elementScores), 5);

  return (
    <div className={styles.container}>
      <div className={styles.summaryBox}>
        <h4 className={styles.subTitle}>분석 요약</h4>
        <ul className={styles.summaryList}>
          <li>
            <strong>계절(월지):</strong> {evidence.season === 'spring' ? '봄' : evidence.season === 'summer' ? '여름' : evidence.season === 'autumn' ? '가을' : '겨울'} 기운이 핵심 보정 요소로 반영되었습니다.
          </li>
          <li>
            <strong>일간 강약:</strong> {evidence.ilganStrength === 'strong' ? '신강' : evidence.ilganStrength === 'weak' ? '신약' : '중화'} 사주로 판단되어 균형점을 찾았습니다.
          </li>
          <li>
            <strong>오행 불균형:</strong> {evidence.imbalance.excess.length > 0 ? `${evidence.imbalance.excess.join(', ')} 과다` : '특별한 과다 오행 없음'} 및 {evidence.imbalance.missing.length > 0 ? `${evidence.imbalance.missing.join(', ')} 결핍` : '골고루 갖춰진'} 상태입니다.
          </li>
        </ul>
      </div>

      <div className={styles.chartSection}>
        <h4 className={styles.subTitle}>원국 오행 구성 비율 (정량 분석)</h4>
        <p className={styles.chartDesc}>* 가중치 점수: 천간(1.0) + 지지(1.5) + 지장간 합산값</p>
        <div className={styles.chart}>
          {(Object.entries(evidence.elementScores) as [string, number][]).map(([el, score]) => (
            <div key={el} className={styles.barRow}>
              <span className={styles.barLabel}>{elementLabels[el]}</span>
              <div className={styles.barContainer}>
                <div 
                  className={styles.bar} 
                  style={{ 
                    width: `${(score / maxScore) * 100}%`,
                    backgroundColor: getElementColor(el)
                  }}
                />
              </div>
              <span className={styles.barValue}>{score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.candidatesSection}>
        <h4 className={styles.subTitle}>용신 후보 및 적합도 점수 (정밀 분석)</h4>
        <p className={styles.chartDesc}>* 적합도: 오행 불균형 + 일간 강약 + 계절 적합성 등을 종합한 용신 우선순위 점수</p>
        <div className={styles.candidatesGrid}>
          <div className={styles.candidateGroup}>
            <h5 className={styles.groupLabel}>억부 후보 (구조 안정)</h5>
            <div className={styles.candidateList}>
              {evidence.candidates.eokbuTop.map((cand, i) => (
                <div key={i} className={styles.candidateItem}>
                  <span className={styles.candName}>{cand.element}</span>
                  <span className={styles.candScore}>적합도 {cand.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.candidateGroup}>
            <h5 className={styles.groupLabel}>조후 후보 (계절 보정)</h5>
            <div className={styles.candidateList}>
              <div className={styles.candidateItem}>
                <span className={styles.candName}>{evidence.candidates.johu.element}</span>
                <span className={styles.candScore}>적합도 {evidence.candidates.johu.score.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <p className={styles.priorityReason}>
          <strong>판단 근거:</strong> {evidence.priorityReason}
        </p>
        {evidence.conflictReason && (
          <div className={styles.conflictBox}>
            <span className={styles.conflictIcon}>⚠️</span>
            <p className={styles.conflictText}>{evidence.conflictReason.join(', ')}</p>
          </div>
        )}
      </div>

      <div className={styles.infoFooter}>
        <p>용신은 하나로 단정하기보다 원국 구조(억부)와 계절 보정(조후)이 충돌할 때가 있습니다. 이 경우 두 후보를 함께 제시하고, 점수 차이와 근거를 모두 공개하여 분석의 투명성을 높였습니다.</p>
      </div>
    </div>
  );
};

