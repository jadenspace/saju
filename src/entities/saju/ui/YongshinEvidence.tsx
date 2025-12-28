'use client';

import { useState, useEffect } from 'react';
import { YongshinEvidence as YongshinEvidenceType, YongshinConfidence, DecisionStep, Yongshin, SajuData } from '@/entities/saju/model/types';
import { OHAENG_COLORS } from '@/shared/lib/saju/data/OhaengColors';
import { calculateSipsin, getOhaeng } from '@/shared/lib/saju/calculators/TenGod';
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

  // 툴팁이 표시될 때만 판정기준을 console.log로 출력
  useEffect(() => {
    if (isVisible && criteria) {
      console.log(`[${title}] 판정 기준:`, criteria);
    }
  }, [isVisible, criteria, title]);

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
        </div>
      )}
    </div>
  );
};

interface YongshinEvidenceProps {
  evidence: YongshinEvidenceType;
  confidence?: YongshinConfidence;
  yongshin?: Yongshin;
  sajuData?: SajuData; // 일간 정보를 얻기 위해 추가
}

// DecisionStep 한글 라벨 매핑 (사용자 친화적 제목)
const stepLabels: Record<string, string> = {
  '합충분석': '합충 분석',
  '격국판단': '격국 판단',
  '사령분석': '사령 분석',
  '일행득기격': '일행득기격',
  '양신성상격': '양신성상격',
  '종격체크': '종격 체크',
  '조후분석': '조후 분석',
  '강약분석': '강약 분석',
  '통관적용': '통관 적용',
  '억부결정': '억부 결정',
  '최종용신': '최종 용신',
};

// 단계별 용어 설명 (툴팁용 - 사용자 친화적)
const stepTooltips: Record<string, { title: string; description: string; criteria?: string }> = {
  '합충분석': {
    title: '합충 분석 (合沖 分析)',
    description: '사주에서 글자들이 서로 결합하거나 충돌할 때 오행의 힘이 어떻게 변하는지 보는 분석입니다. 합은 두 기운이 만나 새로운 힘을 만들고, 충은 두 기운이 부딪혀 힘이 약해집니다.',
    criteria: '합거(合去): 50~60% 감소 | 충파(沖破): 점수 차이만큼 약화',
  },
  '격국판단': {
    title: '당신의 사회적 역할',
    description: '당신이 태어난 달의 기운이 드러나는 방식에 따라 결정되는 당신의 기본 성향입니다. 리더형, 예술가형, 사업가형 등 8가지 유형이 있어, 각자에게 맞는 역할과 방향을 제시합니다.',
    criteria: '정기 투출: high | 중기 투출: medium | 여기 투출: low | 없음: none',
  },
  '사령분석': {
    title: '태어난 기운의 밀도',
    description: '당신이 태어난 날짜에 당직을 서고 있는 자연의 기운입니다. 한 달 동안 각 날짜마다 다른 기운이 지배하며, 그 기운을 얼마나 받았는지에 따라 당신의 기본 에너지가 결정됩니다.',
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
    title: '에너지 균형 상태',
    description: '당신의 기본 에너지가 강한지 약한지, 균형잡혀 있는지를 확인합니다. 에너지가 너무 강하면(종강격) 억제가 필요하고, 너무 약하면(종약격) 도움이 필요하며, 균형잡혀 있으면(보통격) 일반적인 방식으로 살아가면 됩니다.',
    criteria: '종강: 득령 + 근점수≥6.0 + 관살≤1.0 + 설기≤1.5\n종약: 실령 + 근점수≤2.0 + 지원≤1.5 + 식상/재/관 ≥3.0',
  },
  '조후분석': {
    title: '인생의 기상도',
    description: '당신의 사주가 마치 어떤 날씨인지 보는 분석입니다. 여름생은 물이 필요하고, 겨울생은 불이 필요한 것처럼, 계절에 따라 필요한 기운이 달라집니다. 날씨가 좋으면 능력을 펼치기 좋고, 나쁘면 조화가 필요합니다.',
    criteria: 'extreme: 한≥8+습≥6 또는 열≥8+조≥6\npoor: 필요 오행 0.5~2.0\ngood/satisfied: 필요 오행 ≥2.0',
  },
  '강약분석': {
    title: '에너지 밸런스',
    description: '당신의 기본 에너지가 주위 환경과 비교해 강한지 약한지 보는 분석입니다. 계절의 기운, 땅의 힘, 하늘의 지원을 종합하여 판단합니다. 중화(균형) 상태가 가장 이상적이며, 외부의 풍파에 강한 힘을 가집니다.',
    criteria: 'extreme-strong: 득령 + 근점수≥6.0\nstrong: 득령 + 근점수≥4.0\nweak: 근점수 1.5~3.0\nextreme-weak: 근점수<1.5',
  },
  '통관적용': {
    title: '통관 적용 (通關 適用)',
    description: '두 오행이 대립할 때 중간에서 소통시켜주는 오행을 찾습니다. 예: 금목 대립 시 수(水)가 통관 역할을 합니다.',
    criteria: '원국 존재≥0.5 + 점수≥1.5 + 피극 오행 ≤ 점수×1.5',
  },
  '억부결정': {
    title: '당신의 행운 아이템',
    description: '당신의 사주가 강하면 억제하고, 약하면 도와주는 오행을 찾는 기본 원리입니다. 이것이 바로 당신에게 가장 필요한 행운의 열쇠가 됩니다.',
    criteria: '신강: 식상/재성/관살로 억제\n신약: 인성/비겁으로 부조',
  },
  '최종용신': {
    title: '당신의 행운 아이템',
    description: '모든 분석을 종합하여 최종적으로 결정된 용신입니다. 이것이 바로 당신의 잠재력을 극대화하고 행운을 불러오는 핵심 오행입니다. 이 기운을 가까이할 때 당신의 인생이 더 밝아집니다.',
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

// 결과 텍스트를 사용자 친화적으로 변환
const formatUserFriendlyResult = (step: string, result: string): string => {
  // 기존 전문 용어는 유지하고 → 뒤에 친화적 설명 추가
  const originalResult = result;

  switch (step) {
    case '격국판단': {
      // 예: "편관격 (high)" → "편관격 (high) → 리더형(편관격)의 기질"
      const gyeokgukMatch = result.match(/(정관격|편관격|식신격|상관격|정재격|편재격|정인격|편인격|비견격|겁재격)/);
      if (gyeokgukMatch) {
        const gyeokguk = gyeokgukMatch[1];
        const gyeokgukDescriptions: Record<string, string> = {
          '정관격': '체계적이고 안정적인 관리자형의 기질',
          '편관격': '리더형의 기질로 조직을 이끌거나 어려운 일을 해결하는 성향',
          '식신격': '창의적이고 표현력이 뛰어난 예술가형의 기질',
          '상관격': '독창적이고 자유로운 영혼형의 기질',
          '정재격': '안정적이고 신중한 재테크형의 기질',
          '편재격': '활동적이고 도전적인 사업가형의 기질',
          '정인격': '배려심 많고 따뜻한 보호자형의 기질',
          '편인격': '독특하고 깊이 있는 사색가형의 기질',
          '비견격': '협력적이고 동료애가 깊은 팀워크형의 기질',
          '겁재격': '경쟁적이고 도전적인 승부사형의 기질',
        };
        return `${originalResult} → ${gyeokgukDescriptions[gyeokguk] || '특별한 기질'}`;
      }
      return originalResult;
    }

    case '사령분석': {
      // 예: "득령비율 0%" → "득령비율 0% → 일간 오행이 월령과 일치하지 않음"
      // 예: "甲(정기) 사령 15일차" → "甲(정기) 사령 15일차 → 봄의 기운이 가장 왕성한 시기"
      if (result.includes('득령비율')) {
        const ratioMatch = result.match(/득령비율\s*(\d+(?:\.\d+)?)%/);
        if (ratioMatch) {
          const ratio = parseFloat(ratioMatch[1]);
          if (ratio === 0) {
            return `${originalResult} → 일간 오행이 월령과 일치하지 않음`;
          } else if (ratio < 30) {
            return `${originalResult} → 일간 오행이 월령을 약하게 받음`;
          } else if (ratio < 70) {
            return `${originalResult} → 일간 오행이 월령을 적절히 받음`;
          } else {
            return `${originalResult} → 일간 오행이 월령을 듬뿍 받음`;
          }
        }
      }
      if (result.includes('사령')) {
        return `${originalResult} → 태어난 시기의 자연 기운을 받고 있음`;
      }
      return originalResult;
    }

    case '종격체크': {
      // 예: "보통격" → "보통격 → 에너지가 균형잡혀 있어 일반적인 방식으로 살아가면 됨"
      if (result.includes('보통격')) {
        return `${originalResult} → 에너지가 균형잡혀 있어 일반적인 방식으로 살아가면 됨`;
      }
      if (result.includes('종강격')) {
        return `${originalResult} → 에너지가 너무 강해 억제가 필요함`;
      }
      if (result.includes('종약격')) {
        return `${originalResult} → 에너지가 너무 약해 도움이 필요함`;
      }
      return originalResult;
    }

    case '조후분석': {
      // 예: "양호(良好) (춘절(春), 화(火) 1.0)" → "양호(良好) (춘절(春), 화(火) 1.0) → 따뜻한 봄날 같은 조화로운 환경"
      if (result.includes('extreme')) {
        return `${originalResult} → 극단적인 날씨로 인해 불안정한 상태`;
      }
      if (result.includes('poor')) {
        return `${originalResult} → 날씨가 좋지 않아 조화가 필요한 상태`;
      }
      if (result.includes('good') || result.includes('satisfied') || result.includes('양호')) {
        return `${originalResult} → 따뜻한 봄날 같은 조화로운 환경`;
      }
      return originalResult;
    }

    case '강약분석': {
      // 예: "중화(中和) (근점수 3.8)" → "중화(中和) (근점수 3.8) → 황금 밸런스 상태"
      if (result.includes('중화') || result.includes('neutral')) {
        return `${originalResult} → 황금 밸런스 상태로 외부 풍파에 강한 힘을 가짐`;
      }
      if (result.includes('extreme-strong') || result.includes('strong')) {
        return `${originalResult} → 강한 에너지로 자신감이 넘치는 상태`;
      }
      if (result.includes('extreme-weak') || result.includes('weak')) {
        return `${originalResult} → 약한 에너지로 도움이 필요한 상태`;
      }
      return originalResult;
    }

    case '억부결정':
    case '최종용신': {
      // 예: "화(火)" → "화(火) → 열정과 추진력을 상징하는 '불'의 기운"
      const elementMatch = result.match(/(목|화|토|금|수)\([^)]*\)/);
      if (elementMatch) {
        const element = elementMatch[1];
        const elementDescriptions: Record<string, string> = {
          '목': '성장과 발전을 상징하는 나무의 기운',
          '화': '열정과 추진력을 상징하는 불의 기운',
          '토': '안정과 균형을 상징하는 흙의 기운',
          '금': '정리와 완성을 상징하는 쇠의 기운',
          '수': '유연성과 지혜를 상징하는 물의 기운',
        };
        return `${originalResult} → ${elementDescriptions[element] || '특별한 기운'}`;
      }
      // 오행만 있는 경우
      const simpleElementMatch = result.match(/(목|화|토|금|수)/);
      if (simpleElementMatch) {
        const element = simpleElementMatch[1];
        const elementDescriptions: Record<string, string> = {
          '목': '성장과 발전을 상징하는 나무의 기운',
          '화': '열정과 추진력을 상징하는 불의 기운',
          '토': '안정과 균형을 상징하는 흙의 기운',
          '금': '정리와 완성을 상징하는 쇠의 기운',
          '수': '유연성과 지혜를 상징하는 물의 기운',
        };
        return `${originalResult} → ${elementDescriptions[element] || '특별한 기운'}`;
      }
      return originalResult;
    }

    default:
      return originalResult;
  }
};

// 조건 텍스트를 사용자 친화적으로 변환
const formatUserFriendlyCondition = (step: string, condition: string): string => {
  if (!condition) return '';

  switch (step) {
    case '격국판단': {
      // 예: "寅월 junggi 丙 투출" → "인월(봄의 시작)의 중기인 병(화) 기운이 천간에 드러남"
      if (condition.includes('투출')) {
        // 월지 한자-한글 매핑 (계절 설명 포함)
        const monthMap: Record<string, string> = {
          '子': '자월(겨울)', '丑': '축월(겨울)', 
          '寅': '인월(봄의 시작)', '卯': '묘월(봄)', '辰': '진월(봄의 끝)',
          '巳': '사월(여름의 시작)', '午': '오월(여름)', '未': '미월(여름의 끝)',
          '申': '신월(가을의 시작)', '酉': '유월(가을)', '戌': '술월(가을의 끝)',
          '亥': '해월(겨울의 시작)'
        };
        
        // 천간 한자-한글 매핑
        const ganMap: Record<string, string> = {
          '甲': '갑(목)', '乙': '을(목)', '丙': '병(화)', '丁': '정(화)', '戊': '무(토)',
          '己': '기(토)', '庚': '경(금)', '辛': '신(금)', '壬': '임(수)', '癸': '계(수)'
        };
        
        // 위치 한글 변환
        const positionMap: Record<string, string> = {
          'jeonggi': '정기',
          'junggi': '중기',
          'yeogi': '여기'
        };
        
        let formatted = condition;
        
        // 월지 변환 (예: "寅월" → "인월(봄의 시작)")
        for (const [han, kor] of Object.entries(monthMap)) {
          formatted = formatted.replace(new RegExp(`${han}월`, 'g'), kor);
        }
        
        // 위치 변환 (jeonggi, junggi, yeogi → 정기, 중기, 여기)
        for (const [eng, kor] of Object.entries(positionMap)) {
          formatted = formatted.replace(new RegExp(`\\b${eng}\\b`, 'g'), kor);
        }
        
        // 천간 변환 (예: "丙" → "병(화)")
        for (const [han, kor] of Object.entries(ganMap)) {
          formatted = formatted.replace(new RegExp(han, 'g'), kor);
        }
        
        // 패턴 매칭하여 자연스러운 문장으로 변환
        // 예: "인월(봄의 시작) 중기 병(화) 투출" → "인월(봄의 시작)의 중기인 병(화) 기운이 천간에 드러남"
        const pattern = /([^월]+월\([^)]+\))\s+(정기|중기|여기)\s+([^(]+\([^)]+\))\s+투출/;
        const match = formatted.match(pattern);
        if (match) {
          const [, month, position, gan] = match;
          return `${month}의 ${position}인 ${gan} 기운이 천간에 드러남`;
        }
        
        // 패턴이 맞지 않으면 기본 변환
        formatted = formatted.replace(/투출/g, '기운이 천간에 드러남');
        
        return formatted;
      }
      return condition;
    }

    case '사령분석': {
      // 예: "득령비율 0%" → "일간 오행이 월령과 일치하지 않음"
      const ratioMatch = condition.match(/득령비율\s*(\d+(?:\.\d+)?)%/);
      if (ratioMatch) {
        const ratio = parseFloat(ratioMatch[1]);
        if (ratio === 0) {
          return '일간 오행이 월령과 일치하지 않음';
        } else if (ratio < 30) {
          return `일간 오행이 월령을 ${ratio}%만큼 받음`;
        } else if (ratio < 70) {
          return `일간 오행이 월령을 ${ratio}%만큼 적절히 받음`;
        } else {
          return `일간 오행이 월령을 ${ratio}%만큼 듬뿍 받음`;
        }
      }
      // 예: "甲(정기) 사령 15일차" → "봄의 기운이 가장 왕성한 시기에 태어남"
      if (condition.includes('사령')) {
        return '태어난 달의 주도 기운이 가장 왕성한 시기에 태어남';
      }
      return condition;
    }

    case '종격체크': {
      // 예: "근점수: 3.8 (≤2.0) | 지원: 2.9 (≤1.5)" → "에너지 수준: 3.8 (기준: 2.0 이하) | 지원: 2.9 (기준: 1.5 이하)"
      let formatted = condition;
      formatted = formatted.replace(/근점수:\s*([\d.]+)\s*\([^)]*\)/g, (match, score) => {
        return `에너지 수준: ${score}`;
      });
      formatted = formatted.replace(/지원:\s*([\d.]+)\s*\([^)]*\)/g, (match, score) => {
        return `지원 기운: ${score}`;
      });
      formatted = formatted.replace(/실령/g, '계절 기운 없음');
      formatted = formatted.replace(/득령/g, '계절 기운 있음');
      return formatted;
    }

    case '조후분석': {
      // 예: "春月+ 화(火) 1.0 >= 2.0" → "봄의 기운 + 불의 기운 1.0 (필요: 2.0 이상)"
      let formatted = condition;
      formatted = formatted.replace(/春月|춘월/g, '봄의 기운');
      formatted = formatted.replace(/夏月|하월/g, '여름의 기운');
      formatted = formatted.replace(/秋月|추월/g, '가을의 기운');
      formatted = formatted.replace(/冬月|동월/g, '겨울의 기운');
      formatted = formatted.replace(/화\(火\)/g, '불의 기운');
      formatted = formatted.replace(/수\(水\)/g, '물의 기운');
      formatted = formatted.replace(/목\(木\)/g, '나무의 기운');
      formatted = formatted.replace(/금\(金\)/g, '쇠의 기운');
      formatted = formatted.replace(/토\(土\)/g, '흙의 기운');
      formatted = formatted.replace(/>=/g, '이상');
      formatted = formatted.replace(/<=/g, '이하');
      return formatted;
    }

    case '강약분석': {
      // 예: "실령 X | 근점수 3.8 | 기준: 근점수 3.0~5.0" → "계절 기운 없음 | 에너지 수준: 3.8 | 적정 범위: 3.0~5.0"
      let formatted = condition;
      formatted = formatted.replace(/실령\s*X/g, '계절 기운 없음');
      formatted = formatted.replace(/실령\s*O/g, '계절 기운 있음');
      formatted = formatted.replace(/득령\s*X/g, '계절 기운 없음');
      formatted = formatted.replace(/득령\s*O/g, '계절 기운 있음');
      formatted = formatted.replace(/근점수\s*([\d.]+)/g, '에너지 수준: $1');
      formatted = formatted.replace(/기준:\s*근점수\s*([\d.]+)~([\d.]+)/g, '적정 범위: $1~$2');
      formatted = formatted.replace(/\|/g, ' | ');
      return formatted;
    }

    case '억부결정': {
      // 예: "억부 용신: 화(3.5) | 오행별 점수: 화(3.5), 금(1.7), 수(1.7), 목(0.5), 토(-2.3)"
      if (condition.includes('오행별 점수')) {
        return condition; // 오행별 점수 정보를 그대로 표시
      }
      if (condition.includes('억부')) {
        return condition;
      }
      return condition;
    }
    
    case '최종용신': {
      // 예: "억부 판단 결과" → "억부 판단 결과"
      if (condition.includes('억부')) {
        return '억부 판단 결과';
      }
      return condition;
    }

    default:
      return condition;
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

// 십성을 용신 표기 형태로 변환 (예: "식신" → "식상 용신", "정인" → "인성 용신")
const formatSipseongForYongshin = (sipseong: string): string => {
  const sipseongGroupMap: Record<string, string> = {
    '식신': '식상',
    '상관': '식상',
    '편재': '재성',
    '정재': '재성',
    '편관': '관성',
    '정관': '관성',
    '편인': '인성',
    '정인': '인성',
    '비견': '비겁',
    '겁재': '비겁',
  };
  
  const group = sipseongGroupMap[sipseong] || sipseong;
  return `${group} 용신`;
};

// 용신 오행을 십성으로 변환하는 함수
const getSipseongForYongshin = (yongshinElement: string, dayMaster: string): string => {
  // 오행 한글에서 오행 추출 (예: "목(木)" → "목")
  const elementMatch = yongshinElement.match(/(목|화|토|금|수)/);
  if (!elementMatch) return '';

  const elementKorean = elementMatch[1];
  
  // 한글 오행을 Element로 변환
  const elementMap: Record<string, 'wood' | 'fire' | 'earth' | 'metal' | 'water'> = {
    '목': 'wood',
    '화': 'fire',
    '토': 'earth',
    '금': 'metal',
    '수': 'water',
  };
  
  const element = elementMap[elementKorean];
  if (!element) return '';

  // 오행에 해당하는 천간 찾기 (양간 우선)
  const elementToGan: Record<string, string[]> = {
    'wood': ['甲', '乙'],
    'fire': ['丙', '丁'],
    'earth': ['戊', '己'],
    'metal': ['庚', '辛'],
    'water': ['壬', '癸'],
  };
  
  const ganCandidates = elementToGan[element] || [];
  if (ganCandidates.length === 0) return '';

  // 일간 대비 십성 계산
  const sipseong = calculateSipsin(dayMaster, ganCandidates[0]);
  return formatSipseongForYongshin(sipseong);
};

export const YongshinEvidence = ({ evidence, confidence, yongshin, sajuData }: YongshinEvidenceProps) => {
  // decisionPath가 있으면 사용, 없으면 빈 배열
  const decisionPath: DecisionStep[] = (evidence as unknown as { decisionPath?: DecisionStep[] }).decisionPath || [];
  
  // 일간 정보
  const dayMaster = sajuData?.day?.ganHan || '';
  
  // 용신 십성 계산
  const primarySipseong = yongshin && dayMaster ? getSipseongForYongshin(yongshin.primary, dayMaster) : '';
  const secondarySipseong = yongshin?.secondary && dayMaster ? getSipseongForYongshin(yongshin.secondary, dayMaster) : '';
  
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
                        {formatUserFriendlyResult(step.step, step.result)}
                      </span>
                    </div>
                    {step.condition && (
                      <p className={styles.stepCondition}>
                        {formatUserFriendlyCondition(step.step, step.condition)}
                      </p>
                    )}
                    {step.skipReason && (
                      <p className={styles.stepSkipReason}>
                        ⚠️ {step.skipReason}
                      </p>
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
                <div className={styles.yongshinInfo}>
                  <span className={styles.elementName}>{yongshin.primary}</span>
                  {primarySipseong && (
                    <span className={styles.sipseongLabel}>({primarySipseong})</span>
                  )}
                </div>
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
                    <div className={styles.yongshinInfo}>
                      <span className={styles.elementName}>{yongshin.secondary}</span>
                      {secondarySipseong && (
                        <span className={styles.sipseongLabel}>({secondarySipseong})</span>
                      )}
                    </div>
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
