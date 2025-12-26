'use client';

import { useState } from 'react';
import { YongshinEvidence as YongshinEvidenceType, YongshinConfidence, DecisionStep, Yongshin } from '@/entities/saju/model/types';
import { OHAENG_COLORS } from '@/shared/lib/saju/data/OhaengColors';
import styles from './YongshinEvidence.module.css';
import clsx from 'clsx';

// 툴팁 컴포넌트
interface TooltipProps {
  title: string;
  description: string;
  criteria?: string;
  children: React.ReactNode;
}

const Tooltip = ({ title, description, criteria, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={styles.tooltipWrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children}
      <span className={styles.tooltipTrigger}>?</span>
      {isVisible && (
        <div className={styles.tooltipContent}>
          <div className={styles.tooltipTitle}>{title}</div>
          <p className={styles.tooltipDesc}>{description}</p>
          {criteria && (
            <div className={styles.tooltipCriteria}>
              <span className={styles.criteriaLabel}>판정 기준</span>
              <pre className={styles.criteriaText}>{criteria}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface YongshinEvidenceProps {
  evidence: YongshinEvidenceType;
  confidence?: YongshinConfidence;
  yongshin?: Yongshin;
}

// DecisionStep 한글 라벨 매핑
const stepLabels: Record<string, string> = {
  '합충분석': '합충 분석',
  '격국판단': '격국 판단',
  '사령분석': '사령분일',
  '일행득기격': '일행득기격',
  '양신성상격': '양신성상격',
  '종격체크': '종격 판단',
  '조후분석': '조후 분석',
  '강약분석': '강약 분석',
  '통관적용': '통관 적용',
  '억부결정': '억부 판단',
  '최종용신': '최종 용신',
};

// 단계별 용어 설명 (툴팁용)
const stepTooltips: Record<string, { title: string; description: string; criteria?: string }> = {
  '합충분석': {
    title: '합충 분석 (合沖 分析)',
    description: '천간합, 지지합(육합/삼합), 충(沖)으로 인한 오행 점수 변화를 계산합니다. 합은 두 글자가 결합하여 힘이 변하고, 충은 두 글자가 충돌하여 힘이 약해집니다.',
    criteria: '합거(合去): 50~60% 감소 | 충파(沖破): 점수 차이만큼 약화',
  },
  '격국판단': {
    title: '격국 판단 (格局 判斷)',
    description: '월지 지장간이 천간에 드러났는지(투출)를 보고 사주의 유형을 결정합니다. 정관격, 식신격, 재격 등 8가지 기본 격국이 있습니다.',
    criteria: '주기 투출: high | 중기 투출: medium | 여기 투출: low | 없음: none',
  },
  '사령분석': {
    title: '사령분일 (司令分日)',
    description: '월령(월지)을 지배하는 기운이 누구인지 날짜별로 계산합니다. 한 달 동안 지장간이 순서대로 사령(지배)하며, 일간이 사령 기운을 얻으면 득령입니다.',
    criteria: '득령비율 = 사령 기간 중 일간과 동일 오행 비율',
  },
  '일행득기격': {
    title: '일행득기격 (一行得氣格)',
    description: '사주 전체가 하나의 오행으로 극도로 편중된 특수 격국입니다. 곡직격(木), 염상격(火), 가색격(土), 종혁격(金), 윤하격(水)이 있습니다.',
    criteria: '일간=월지 오행 + 방합/삼합 + 80% 이상 + 관살 없음',
  },
  '양신성상격': {
    title: '양신성상격 (兩神成象格)',
    description: '사주가 정확히 두 개의 오행으로만 비슷한 세력을 이룬 특수 격국입니다. 두 오행이 상생 또는 상극 관계여야 합니다.',
    criteria: '2개 오행만 존재 + 각 30% 이상 + 상생/상극 관계',
  },
  '종격체크': {
    title: '종격 판단 (從格 判斷)',
    description: '일간이 극도로 강하거나 약해서 그 흐름을 따라가야 하는지 판단합니다. 종강격(너무 강함), 종약격(너무 약함)이 있습니다.',
    criteria: '종강: 득령 + 근점수≥6.0 + 관살≤1.0 + 설기≤1.5\n종약: 실령 + 근점수≤2.0 + 지원≤1.5 + 식상/재/관 ≥3.0',
  },
  '조후분석': {
    title: '조후 분석 (調候 分析)',
    description: '사주의 한열조습(寒熱燥濕) 균형을 분석합니다. 여름생은 水가 필요하고, 겨울생은 火가 필요한 것처럼 계절에 따른 필요 오행을 찾습니다.',
    criteria: 'extreme: 한≥8+습≥6 또는 열≥8+조≥6\npoor: 필요 오행 0.5~2.0\ngood/satisfied: 필요 오행 ≥2.0',
  },
  '강약분석': {
    title: '강약 분석 (强弱 分析)',
    description: '일간(나)의 힘이 강한지 약한지 판단합니다. 득령(월지 기운), 득지(지지 통근), 득세(천간 지원)를 종합하여 근점수를 산출합니다.',
    criteria: 'extreme-strong: 득령 + 근점수≥6.0\nstrong: 득령 + 근점수≥4.0\nweak: 근점수 1.5~3.0\nextreme-weak: 근점수<1.5',
  },
  '통관적용': {
    title: '통관 적용 (通關 適用)',
    description: '두 오행이 대립할 때 중간에서 소통시켜주는 오행을 찾습니다. 예: 금목 대립 시 수(水)가 통관 역할을 합니다.',
    criteria: '원국 존재≥0.5 + 점수≥1.5 + 피극 오행 ≤ 점수×1.5',
  },
  '억부결정': {
    title: '억부 판단 (抑扶 判斷)',
    description: '일간이 강하면 억제하고(설기/극), 약하면 도와주는(인성/비겁) 용신을 결정하는 기본 원리입니다.',
    criteria: '신강: 식상/재성/관살로 억제\n신약: 인성/비겁으로 부조',
  },
  '최종용신': {
    title: '최종 용신',
    description: '모든 분석을 종합하여 최종적으로 결정된 용신입니다. 용신은 사주의 균형을 맞추고 운을 좋게 하는 핵심 오행입니다.',
  },
};

// 단계별 아이콘 매핑
const stepIcons: Record<string, string> = {
  '합충분석': '⚡',
  '격국판단': '📋',
  '사령분석': '📅',
  '일행득기격': '✨',
  '양신성상격': '✨',
  '종격체크': '🔍',
  '조후분석': '🌡️',
  '강약분석': '⚖️',
  '통관적용': '🔗',
  '억부결정': '🎯',
  '최종용신': '✅',
};

const getStepIcon = (step: string, continued: boolean) => {
  if (!continued) return '◆';
  return stepIcons[step] || '●';
};

// 단계별 결과 하이라이트 스타일 결정
const getResultStyle = (step: string, result: string) => {
  if (step === '최종용신' || step === '억부결정') return 'final';
  if (result.includes('종강격') || result.includes('종약격')) return 'special';
  if (result.includes('extreme') || result.includes('급선무')) return 'warning';
  if (result.includes('poor')) return 'caution';
  return 'normal';
};

// 오행 한자 매핑
const getElementHanja = (element: string): string => {
  if (element.includes('목')) return '木';
  if (element.includes('화')) return '火';
  if (element.includes('토')) return '土';
  if (element.includes('금')) return '金';
  if (element.includes('수')) return '水';
  return '';
};

// 오행 CSS 클래스
const getElementClass = (element: string): string => {
  if (element.includes('목')) return 'wood';
  if (element.includes('화')) return 'fire';
  if (element.includes('토')) return 'earth';
  if (element.includes('금')) return 'metal';
  if (element.includes('수')) return 'water';
  return '';
};

// 신뢰도 한글
const getConfidenceLabel = (confidence: YongshinConfidence | undefined): string => {
  if (!confidence) return '보통';
  switch (confidence) {
    case 'high': return '높음';
    case 'medium': return '보통';
    case 'low': return '낮음';
    default: return '보통';
  }
};

// 오행별 활용 조언
const getElementAdvice = (element: string): { tips: string[]; directions: string; items: string } => {
  if (element.includes('목')) {
    return {
      tips: [
        '나무와 식물이 있는 공간에서 에너지를 얻습니다.',
        '동쪽 방향이 길방위입니다.',
        '목재 가구나 소품을 활용하면 좋습니다.',
      ],
      directions: '동쪽',
      items: '나무, 식물, 목재 가구, 종이, 책',
    };
  }
  if (element.includes('화')) {
    return {
      tips: [
        '따뜻하고 밝은 환경에서 활력을 얻습니다.',
        '남쪽 방향이 길방위입니다.',
        '조명을 밝게 하고 햇빛을 많이 받으세요.',
      ],
      directions: '남쪽',
      items: '조명, 캔들, 전자기기, 빨간 소품',
    };
  }
  if (element.includes('토')) {
    return {
      tips: [
        '안정적이고 균형 잡힌 환경이 중요합니다.',
        '중앙 또는 서남/동북 방향이 좋습니다.',
        '도자기, 흙, 돌 소재를 활용하세요.',
      ],
      directions: '중앙, 서남, 동북',
      items: '도자기, 세라믹, 흙화분, 대리석, 크리스탈',
    };
  }
  if (element.includes('금')) {
    return {
      tips: [
        '깔끔하고 정돈된 환경에서 집중력이 올라갑니다.',
        '서쪽 방향이 길방위입니다.',
        '금속 소재 액세서리나 소품을 활용하세요.',
      ],
      directions: '서쪽',
      items: '금속 액세서리, 시계, 동전, 금속 프레임',
    };
  }
  if (element.includes('수')) {
    return {
      tips: [
        '물과 관련된 환경에서 영감을 얻습니다.',
        '북쪽 방향이 길방위입니다.',
        '어항, 분수, 물 그림 등을 배치하면 좋습니다.',
      ],
      directions: '북쪽',
      items: '어항, 분수, 유리 소품, 거울, 물 관련 그림',
    };
  }
  return { tips: [], directions: '', items: '' };
};

export const YongshinEvidence = ({ evidence, confidence, yongshin }: YongshinEvidenceProps) => {
  // decisionPath가 있으면 사용, 없으면 빈 배열
  const decisionPath: DecisionStep[] = (evidence as unknown as { decisionPath?: DecisionStep[] }).decisionPath || [];
  
  // 용신 색상 정보
  const primaryColors = yongshin ? OHAENG_COLORS[yongshin.primary] : null;
  const primaryAdvice = yongshin ? getElementAdvice(yongshin.primary) : null;

  return (
    <div className={styles.container}>
      {/* 알고리즘 흐름 타임라인 */}
      {decisionPath.length > 0 && (
        <div className={styles.timelineSection}>
          <h4 className={styles.subTitle}>용신 결정 흐름</h4>
          <p className={styles.chartDesc}>
            * 사주 원국을 분석하여 용신을 도출하는 단계별 과정입니다
          </p>
          <div className={styles.timeline}>
            {decisionPath.map((step, index) => {
              const isLast = index === decisionPath.length - 1;
              const isFinal = !step.continued;
              const resultStyle = getResultStyle(step.step, step.result);
              
              return (
                <div 
                  key={index} 
                  className={clsx(
                    styles.timelineStep,
                    isFinal && styles.finalStep,
                    isLast && styles.lastStep
                  )}
                >
                  <div className={styles.stepIndicatorWrapper}>
                    <span className={clsx(
                      styles.stepIndicator,
                      isFinal && styles.finalIndicator
                    )}>
                      {getStepIcon(step.step, step.continued)}
                    </span>
                    {!isLast && <div className={styles.stepLine} />}
                  </div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepHeader}>
                      {stepTooltips[step.step] ? (
                        <Tooltip
                          title={stepTooltips[step.step].title}
                          description={stepTooltips[step.step].description}
                          criteria={stepTooltips[step.step].criteria}
                        >
                          <span className={styles.stepTitle}>
                            {stepLabels[step.step] || step.step}
                          </span>
                        </Tooltip>
                      ) : (
                        <span className={styles.stepTitle}>
                          {stepLabels[step.step] || step.step}
                        </span>
                      )}
                      <span className={clsx(
                        styles.stepResult,
                        styles[`result_${resultStyle}`]
                      )}>
                        {step.result}
                      </span>
                    </div>
                    {step.condition && (
                      <p className={styles.stepCondition}>{step.condition}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 용신 결과 요약 */}
      {yongshin && (
        <div className={styles.resultSection}>
          <h4 className={styles.subTitle}>분석 결과</h4>
          <div className={styles.resultGrid}>
            {/* 주 용신 */}
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>주 용신</span>
              <div className={styles.resultValue}>
                <span className={clsx(styles.elementBadge, styles[getElementClass(yongshin.primary)])}>
                  {getElementHanja(yongshin.primary)}
                </span>
                <span className={styles.elementName}>{yongshin.primary}</span>
              </div>
            </div>

            {/* 보조 용신 */}
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>보조 용신</span>
              <div className={styles.resultValue}>
                {yongshin.secondary ? (
                  <>
                    <span className={clsx(styles.elementBadge, styles[getElementClass(yongshin.secondary)])}>
                      {getElementHanja(yongshin.secondary)}
                    </span>
                    <span className={styles.elementName}>{yongshin.secondary}</span>
                  </>
                ) : (
                  <span className={styles.noValue}>없음</span>
                )}
              </div>
            </div>

            {/* 용신 타입 */}
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>용신 타입</span>
              <div className={styles.resultValue}>
                <span className={styles.typeBadge}>{yongshin.type}용신</span>
              </div>
            </div>

            {/* 정확도 */}
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>정확도</span>
              <div className={styles.resultValue}>
                <span className={clsx(
                  styles.confidenceBadge,
                  styles[`confidence_${confidence || 'medium'}`]
                )}>
                  {getConfidenceLabel(confidence)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 주 용신 활용법 */}
      {yongshin && primaryColors && primaryAdvice && (
        <div className={styles.usageSection}>
          <h4 className={styles.subTitle}>주 용신 활용법</h4>
          
          {/* 추천 색상 */}
          <div className={styles.usageBlock}>
            <div className={styles.usageHeader}>
              <span className={styles.usageIcon}>🎨</span>
              <span className={styles.usageLabel}>추천 색상</span>
            </div>
            <div className={styles.colorInfo}>
              <div className={styles.obangColor}>
                <span className={styles.colorCategory}>오방색:</span>
                <span className={styles.colorValue}>{primaryColors.obangColor}</span>
              </div>
              <div className={styles.practicalColors}>
                <span className={styles.colorCategory}>실사용 색감:</span>
                <div className={styles.colorTags}>
                  {primaryColors.practicalColors.map((color, idx) => (
                    <span key={idx} className={clsx(styles.colorTag, styles[getElementClass(yongshin.primary)])}>
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 길방위 & 추천 아이템 */}
          <div className={styles.usageGrid}>
            <div className={styles.usageBlock}>
              <div className={styles.usageHeader}>
                <span className={styles.usageIcon}>🧭</span>
                <span className={styles.usageLabel}>길방위</span>
              </div>
              <p className={styles.usageText}>{primaryAdvice.directions}</p>
            </div>
            <div className={styles.usageBlock}>
              <div className={styles.usageHeader}>
                <span className={styles.usageIcon}>✨</span>
                <span className={styles.usageLabel}>추천 아이템</span>
              </div>
              <p className={styles.usageText}>{primaryAdvice.items}</p>
            </div>
          </div>

          {/* 안내 문구 */}
          <p className={styles.usageNote}>
            포인트 아이템(소품, 액세서리, 폰케이스 등)에 용신 색상을 먼저 활용해보세요. 
            부담이 적고 효과적입니다.
          </p>
        </div>
      )}
    </div>
  );
};
