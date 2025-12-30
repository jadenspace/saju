/**
 * 특수 격국 판별 모듈 (Phase 2)
 * - 일행득기격 (곡직격/염상격/가색격/종혁격/윤하격)
 * - 양신성상격
 */

import { SajuData } from '../../../../entities/saju/model/types';
import { getOhaeng, Element } from './TenGod';
import { GENERATING_MAP, CONTROLLING_MAP, ELEMENT_TO_KOREAN } from './CombinationAnalyzer';

// ========================================
// 인터페이스 정의
// ========================================

export interface IlhaengDeukgiResult {
  isIlhaeng: boolean;
  type?: '곡직격' | '염상격' | '가색격' | '종혁격' | '윤하격';
  dominantElement?: Element;
  ratio: number;
  yongshin?: Element;
  reason: string;
}

export interface YangshinResult {
  isYangshin: boolean;
  elements?: [Element, Element];
  relationship?: 'generating' | 'controlling';
  yongshin?: Element;
  reason: string;
}

// ========================================
// 유틸리티 함수
// ========================================

/**
 * 상생 역방향: 어떤 오행이 dayElement를 생하는지 찾기
 */
function invGenerating(day: Element): Element {
  const found = (Object.keys(GENERATING_MAP) as Element[]).find(e => GENERATING_MAP[e] === day);
  return found ?? 'water';
}

/**
 * 상극 관계의 두 오행 사이 통관 오행 찾기
 */
export function getMiddleElement(elem1: Element, elem2: Element): Element | null {
  for (const middle of ['wood', 'fire', 'earth', 'metal', 'water'] as Element[]) {
    if (GENERATING_MAP[elem1] === middle && GENERATING_MAP[middle] === elem2) {
      return middle;
    }
    if (GENERATING_MAP[elem2] === middle && GENERATING_MAP[middle] === elem1) {
      return middle;
    }
  }
  return null;
}

// ========================================
// 일행득기격 판별
// ========================================

/**
 * 일행득기격(一行得氣格) 판별
 * 사주의 80% 이상이 한 오행으로 편중된 특수 격국
 */
export function checkIlhaengDeukgi(
  saju: SajuData,
  dayElement: Element,
  elementScores: Record<Element, number>
): IlhaengDeukgiResult {
  const total = Object.values(elementScores).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return { isIlhaeng: false, ratio: 0, reason: '점수 계산 불가' };
  }
  
  // 각 오행별 비율 계산
  const ratios: Record<Element, number> = { 
    wood: 0, fire: 0, earth: 0, metal: 0, water: 0 
  };
  for (const elem of Object.keys(elementScores) as Element[]) {
    ratios[elem] = elementScores[elem] / total;
  }
  
  // 일간 오행의 비율이 80% 이상인지 확인
  if (ratios[dayElement] < 0.8) {
    return { 
      isIlhaeng: false, 
      ratio: ratios[dayElement], 
      reason: `일간 오행(${ELEMENT_TO_KOREAN[dayElement]}) 비율 ${(ratios[dayElement] * 100).toFixed(1)}% < 80%` 
    };
  }
  
  // 관살 존재 여부 확인 (관살이 있으면 일행득기격 불성립)
  const controllElement = CONTROLLING_MAP[dayElement];
  if (elementScores[controllElement] > 0.5) {
    return { 
      isIlhaeng: false, 
      ratio: ratios[dayElement],
      reason: `관살(${ELEMENT_TO_KOREAN[controllElement]}) 존재로 일행득기격 불성립` 
    };
  }
  
  // 방합/삼합 형성 여부 확인
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  const jijis = pillars.filter(p => p && p.jiHan !== '?').map(p => p.jiHan);
  
  const fangheGroups = [
    { branches: ['寅', '卯', '辰'], result: 'wood' as Element },
    { branches: ['巳', '午', '未'], result: 'fire' as Element },
    { branches: ['申', '酉', '戌'], result: 'metal' as Element },
    { branches: ['亥', '子', '丑'], result: 'water' as Element },
  ];
  
  let hasFanghe = false;
  for (const group of fangheGroups) {
    const found = group.branches.filter(b => jijis.includes(b));
    if (found.length >= 2 && group.result === dayElement) {
      hasFanghe = true;
      break;
    }
  }
  
  // 일행득기격 유형 결정
  const typeMap: Record<Element, '곡직격' | '염상격' | '가색격' | '종혁격' | '윤하격'> = {
    'wood': '곡직격',
    'fire': '염상격',
    'earth': '가색격',
    'metal': '종혁격',
    'water': '윤하격',
  };
  
  // 용신: 해당 오행을 생하는 오행
  const yongshin = invGenerating(dayElement);
  
  return {
    isIlhaeng: true,
    type: typeMap[dayElement],
    dominantElement: dayElement,
    ratio: ratios[dayElement],
    yongshin,
    reason: `${typeMap[dayElement]} 성립: ${ELEMENT_TO_KOREAN[dayElement]} ${(ratios[dayElement] * 100).toFixed(1)}%${hasFanghe ? ' + 방합/삼합' : ''}`,
  };
}

// ========================================
// 양신성상격 판별
// ========================================

/**
 * 양신성상격(兩神成象格) 판별
 * 사주가 두 오행으로만 구성된 특수 격국
 */
export function checkYangshin(
  elementScores: Record<Element, number>
): YangshinResult {
  const total = Object.values(elementScores).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return { isYangshin: false, reason: '점수 계산 불가' };
  }
  
  // 0이 아닌 오행 찾기 (미미한 수치는 무시)
  const nonZeroElements = (Object.keys(elementScores) as Element[])
    .filter(e => elementScores[e] > 0.5);
  
  if (nonZeroElements.length !== 2) {
    return { 
      isYangshin: false, 
      reason: `두 오행이 아닌 ${nonZeroElements.length}개 오행 존재` 
    };
  }
  
  const [elem1, elem2] = nonZeroElements;
  
  // 두 오행의 비율이 각각 30% 이상이어야 함
  const ratio1 = elementScores[elem1] / total;
  const ratio2 = elementScores[elem2] / total;
  
  if (ratio1 < 0.3 || ratio2 < 0.3) {
    return { 
      isYangshin: false, 
      reason: `한쪽 오행 비율 부족 (${ELEMENT_TO_KOREAN[elem1]}: ${(ratio1 * 100).toFixed(1)}%, ${ELEMENT_TO_KOREAN[elem2]}: ${(ratio2 * 100).toFixed(1)}%)` 
    };
  }
  
  // 두 오행의 관계 판정
  let relationship: 'generating' | 'controlling';
  let yongshin: Element;
  
  if (GENERATING_MAP[elem1] === elem2) {
    relationship = 'generating';
    yongshin = elem1;
  } else if (GENERATING_MAP[elem2] === elem1) {
    relationship = 'generating';
    yongshin = elem2;
  } else if (CONTROLLING_MAP[elem1] === elem2 || CONTROLLING_MAP[elem2] === elem1) {
    relationship = 'controlling';
    const middleElement = getMiddleElement(elem1, elem2);
    yongshin = middleElement || elem1;
  } else {
    return { 
      isYangshin: false, 
      reason: `두 오행(${ELEMENT_TO_KOREAN[elem1]}, ${ELEMENT_TO_KOREAN[elem2]})이 상생/상극 관계 아님` 
    };
  }
  
  return {
    isYangshin: true,
    elements: [elem1, elem2],
    relationship,
    yongshin,
    reason: `양신성상격 성립: ${ELEMENT_TO_KOREAN[elem1]}(${(ratio1 * 100).toFixed(1)}%) + ${ELEMENT_TO_KOREAN[elem2]}(${(ratio2 * 100).toFixed(1)}%) ${relationship === 'generating' ? '상생' : '상극'}`,
  };
}
