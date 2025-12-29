import React from 'react';
import { SajuData } from '../model/types';
import { DitianSuiYongshinCalculator, DitianSuiAnalysis as AnalysisType } from '../../../shared/lib/saju/calculators/DitianSuiYongshin';
import styles from './DitianSuiAnalysis.module.css';
import { clsx } from 'clsx';

interface DitianSuiAnalysisProps {
  sajuData: SajuData;
}

export const DitianSuiAnalysis: React.FC<DitianSuiAnalysisProps> = ({ sajuData }) => {
  const analysis: AnalysisType = DitianSuiYongshinCalculator.analyze(sajuData);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>적천수(滴天髓) 7단계 용신 분석</h2>
        <p>고전 명리학의 정수인 적천수 원론에 따른 정밀 분석 시스템</p>
      </header>

      <div className={styles.stepList}>
        {analysis.steps.map((step: any, index: number) => (
          <div 
            key={step.step} 
            className={clsx(styles.stepCard, step.step === 7 && styles.activeStep)}
          >
            <div className={styles.stepNumber}>{step.step}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            
            <div className={styles.originalTextContent}>
              {step.originalText.map((text: string, i: number) => (
                <p key={i} className={styles.originalText}>「{text}」</p>
              ))}
            </div>

            <div className={styles.interpretation}>
              {step.interpretation}
            </div>

            <div className={styles.application}>
              <div className={styles.applicationTitle}>분석 적용</div>
              <div className={styles.applicationText}>{step.application}</div>
            </div>

            <div className={styles.resultSection}>
              <span className={styles.resultTag}>결론</span>
              <span className={styles.resultValue}>{step.result}</span>
            </div>

            <div className={styles.conclusion}>
              {step.conclusion}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.finalResult}>
        <h3 className={styles.finalTitle}>최종 분석 결과</h3>
        
        <div className={styles.yongshinBox}>
          <span className={styles.yongshinLabel}>핵심 용신(用神)</span>
          <span className={styles.yongshinValue}>{analysis.finalYongshin}</span>
        </div>

        <div className={styles.elementsGrid}>
          <div className={styles.elementGroup}>
            <span className={styles.elementLabel}>희신 (喜神)</span>
            <span className={clsx(styles.elementValue, styles.heeshin)}>
              {analysis.heeshin.join(', ') || '분석 중'}
            </span>
          </div>
          <div className={styles.elementGroup}>
            <span className={styles.elementLabel}>기신 (忌神)</span>
            <span className={clsx(styles.elementValue, styles.gishin)}>
              {analysis.gishin.join(', ') || '분석 중'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
