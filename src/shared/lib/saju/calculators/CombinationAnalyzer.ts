/**
 * 합충 분석 모듈 (Phase 1)
 * - 합화/합반/합거 판별
 * - 충 왕쇠 차등 적용
 * - 충발/묘고충발 판별
 */

import { SajuData, CombinationAnalysis } from '../../../../entities/saju/model/types';
import { getOhaeng, Element } from './TenGod';

// ========================================
// 상수 정의
// ========================================

export const GENERATING_MAP: Record<Element, Element> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
};

export const CONTROLLING_MAP: Record<Element, Element> = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
};

export const ELEMENT_TO_KOREAN: Record<Element, string> = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};

// 지장간 데이터
export const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '戊', '庚'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

// 합충 관련 설정값
export const COMBINATION_CONFIG = {
  // 합화 판별 조건
  HAPHWA_MONTH_SUPPORT_REQUIRED: true,
  HAPHWA_INHUA_BONUS: 1.5,
  HAPHWA_NO_ROOT_THRESHOLD: 0.5,
  
  // 합반 점수 감소율
  HAPBAN_REDUCTION_ADJACENT: 0.4,
  HAPBAN_REDUCTION_DISTANT: 0.3,
  
  // 충 왕쇠 차등 적용
  CHUNG_WANG_SWAE_RATIO: 2.0,
  CHUNG_SWAE_REDUCTION: 0.85,
  CHUNG_WANG_REDUCTION: 0.15,
  CHUNG_WANG_BONUS_ON_SWAE: 0.2,
  CHUNG_EQUAL_REDUCTION: 0.5,
  
  // 충발 관련
  CHUNGBAL_THRESHOLD: 3.0,
  CHUNGBAL_BONUS: 0.3,
  MOGO_CHUNGBAL_BONUS: 1.5,
};

// 천간합 화신 정의
const TIANGAN_HE_RESULT: Record<string, Element> = {
  '甲己': 'earth', '己甲': 'earth',
  '乙庚': 'metal', '庚乙': 'metal',
  '丙辛': 'water', '辛丙': 'water',
  '丁壬': 'wood',  '壬丁': 'wood',
  '戊癸': 'fire',  '癸戊': 'fire',
};

// 천간합 파트너 매핑
export const TIANGAN_HE_PARTNER: Record<string, string> = {
  '甲': '己', '己': '甲',
  '乙': '庚', '庚': '乙',
  '丙': '辛', '辛': '丙',
  '丁': '壬', '壬': '丁',
  '戊': '癸', '癸': '戊',
};

// 육합 화신 정의
const LIUHE_RESULT: Record<string, Element> = {
  '子丑': 'earth', '丑子': 'earth',
  '寅亥': 'wood',  '亥寅': 'wood',
  '卯戌': 'fire',  '戌卯': 'fire',
  '辰酉': 'metal', '酉辰': 'metal',
  '巳申': 'water', '申巳': 'water',
  '午未': 'earth', '未午': 'earth',
};

// 육합 파트너 매핑
const LIUHE_PARTNER: Record<string, string> = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午',
};

// 충 파트너 매핑
const CHONG_PARTNER: Record<string, string> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
};

// 묘고 지지
const MOGO_BRANCHES = ['辰', '戌', '丑', '未'];

// 지지별 기본 강도
const BRANCH_BASE_STRENGTH: Record<string, number> = {
  '子': 2.0, '午': 2.0, '卯': 2.0, '酉': 2.0,
  '寅': 1.5, '申': 1.5, '巳': 1.5, '亥': 1.5,
  '辰': 1.2, '戌': 1.2, '丑': 1.2, '未': 1.2,
};

// ========================================
// 유틸리티 함수
// ========================================

function weightHiddenStem(idx: number): number {
  if (idx === 0) return 0.9;
  if (idx === 1) return 0.5;
  return 0.3;
}

/**
 * 월지에 따른 지지 강도 배수 계산
 */
function getBranchStrengthMultiplier(branch: string, monthJi: string): number {
  const branchElement = getOhaeng(branch);
  const monthElement = getOhaeng(monthJi);
  
  if (branchElement === monthElement) return 2.5;
  
  const generating = GENERATING_MAP[monthElement as Element];
  if (branchElement === generating) return 1.5;
  
  const controlling = CONTROLLING_MAP[monthElement as Element];
  if (branchElement === controlling) return 0.5;
  
  return 1.0;
}

/**
 * 지지 강도 계산
 */
function calculateBranchStrength(branch: string, monthJi: string): number {
  const base = BRANCH_BASE_STRENGTH[branch] || 1.0;
  const multiplier = getBranchStrengthMultiplier(branch, monthJi);
  return base * multiplier;
}

/**
 * 천간의 지지 통근 점수 계산
 */
function calculateStemRoot(stem: string, jijis: string[]): number {
  const stemElement = getOhaeng(stem);
  let rootScore = 0;
  
  for (const ji of jijis) {
    if (getOhaeng(ji) === stemElement) {
      rootScore += 1.0;
    }
    
    const hiddens = HIDDEN_STEMS[ji] || [];
    for (let i = 0; i < hiddens.length; i++) {
      if (getOhaeng(hiddens[i]) === stemElement) {
        rootScore += weightHiddenStem(i);
      }
    }
  }
  
  return rootScore;
}

// ========================================
// 합화/합반 판별 함수
// ========================================

/**
 * 천간합 합화 조건 판별
 */
export function checkTianganHapHwa(
  stem1: string,
  stem2: string,
  pos1: number,
  pos2: number,
  monthJi: string,
  allStems: string[],
  allJijis: string[]
): { isHapHwa: boolean; reason: string } {
  const pairKey = stem1 + stem2;
  const huashen = TIANGAN_HE_RESULT[pairKey];
  
  if (!huashen) {
    return { isHapHwa: false, reason: '합 관계 아님' };
  }
  
  const isAdjacent = Math.abs(pos1 - pos2) === 1;
  if (!isAdjacent) {
    return { isHapHwa: false, reason: '인접하지 않음 → 합반' };
  }
  
  const monthElement = getOhaeng(monthJi) as Element;
  const monthSupports = monthElement === huashen || GENERATING_MAP[monthElement] === huashen;
  
  if (COMBINATION_CONFIG.HAPHWA_MONTH_SUPPORT_REQUIRED && !monthSupports) {
    return { isHapHwa: false, reason: `월령(${monthJi}) 동조 없음 → 합반` };
  }
  
  const huashenStems = allStems.filter(s => getOhaeng(s) === huashen && s !== stem1 && s !== stem2);
  const hasInhua = huashenStems.length > 0;
  
  const root1 = calculateStemRoot(stem1, allJijis);
  const root2 = calculateStemRoot(stem2, allJijis);
  const bothWeakRoot = root1 < COMBINATION_CONFIG.HAPHWA_NO_ROOT_THRESHOLD && 
                       root2 < COMBINATION_CONFIG.HAPHWA_NO_ROOT_THRESHOLD;
  
  if (monthSupports && (hasInhua || bothWeakRoot)) {
    const reasons: string[] = [];
    if (monthSupports) reasons.push(`월령(${monthJi}) 동조`);
    if (hasInhua) reasons.push(`인화(${huashenStems.join(',')}) 투출`);
    if (bothWeakRoot) reasons.push('양측 통근 약함');
    return { isHapHwa: true, reason: `합화 성공: ${reasons.join(' + ')} → ${ELEMENT_TO_KOREAN[huashen]}` };
  }
  
  return { isHapHwa: false, reason: `합화 조건 미충족 → 합반` };
}

/**
 * 지지 육합 합화 조건 판별
 */
export function checkDizhiHapHwa(
  branch1: string,
  branch2: string,
  monthJi: string,
  allStems: string[]
): { isHapHwa: boolean; reason: string } {
  const pairKey = branch1 + branch2;
  const huashen = LIUHE_RESULT[pairKey];
  
  if (!huashen) {
    return { isHapHwa: false, reason: '육합 관계 아님' };
  }
  
  const monthElement = getOhaeng(monthJi) as Element;
  const monthSupports = monthElement === huashen || GENERATING_MAP[monthElement] === huashen;
  
  const huashenStems = allStems.filter(s => getOhaeng(s) === huashen);
  const hasInhua = huashenStems.length > 0;
  
  if (monthSupports && hasInhua) {
    return { isHapHwa: true, reason: `육합 합화: 월령(${monthJi}) + 인화 → ${ELEMENT_TO_KOREAN[huashen]}` };
  }
  
  return { isHapHwa: false, reason: '육합 합반: 합화조건 미충족' };
}

// ========================================
// 충 관련 함수
// ========================================

/**
 * 충 유형 판별 - 왕자충쇠/쇠자충왕/세력비등
 */
export function determineChungType(
  branch1: string,
  branch2: string,
  pos1: number,
  pos2: number,
  monthJi: string
): { 
  chungType: 'wangChungSwae' | 'swaeChungWang' | 'equal';
  wang: string;
  swae: string;
  strength1: number;
  strength2: number;
} {
  const str1 = calculateBranchStrength(branch1, monthJi);
  const str2 = calculateBranchStrength(branch2, monthJi);
  
  const posBonus1 = pos1 === 1 ? 1.5 : pos1 === 2 ? 1.2 : 1.0;
  const posBonus2 = pos2 === 1 ? 1.5 : pos2 === 2 ? 1.2 : 1.0;
  
  const finalStr1 = str1 * posBonus1;
  const finalStr2 = str2 * posBonus2;
  
  const ratio = Math.max(finalStr1, finalStr2) / Math.min(finalStr1, finalStr2);
  
  if (ratio >= COMBINATION_CONFIG.CHUNG_WANG_SWAE_RATIO) {
    if (finalStr1 > finalStr2) {
      return { chungType: 'wangChungSwae', wang: branch1, swae: branch2, strength1: finalStr1, strength2: finalStr2 };
    } else {
      return { chungType: 'swaeChungWang', wang: branch2, swae: branch1, strength1: finalStr1, strength2: finalStr2 };
    }
  }
  
  return { chungType: 'equal', wang: '', swae: '', strength1: finalStr1, strength2: finalStr2 };
}

/**
 * 왕신충발 판별
 */
export function checkWangsinChungBal(
  wangStrength: number
): { isChungBal: boolean; bonus: number } {
  if (wangStrength >= COMBINATION_CONFIG.CHUNGBAL_THRESHOLD) {
    return { 
      isChungBal: true, 
      bonus: wangStrength * COMBINATION_CONFIG.CHUNGBAL_BONUS 
    };
  }
  return { isChungBal: false, bonus: 0 };
}

/**
 * 묘고충발 판별
 */
export function checkMogoChungBal(
  branch1: string,
  branch2: string
): { isMogoChungBal: boolean; releasedStems: string[]; bonusScores: Record<Element, number> } {
  if (!MOGO_BRANCHES.includes(branch1) || !MOGO_BRANCHES.includes(branch2)) {
    return { isMogoChungBal: false, releasedStems: [], bonusScores: {} as Record<Element, number> };
  }
  
  const validPairs = [['辰', '戌'], ['丑', '未']];
  const isValidPair = validPairs.some(pair => 
    (pair[0] === branch1 && pair[1] === branch2) ||
    (pair[1] === branch1 && pair[0] === branch2)
  );
  
  if (!isValidPair) {
    return { isMogoChungBal: false, releasedStems: [], bonusScores: {} as Record<Element, number> };
  }
  
  const stems1 = HIDDEN_STEMS[branch1] || [];
  const stems2 = HIDDEN_STEMS[branch2] || [];
  const releasedStems = [...stems1, ...stems2];
  
  const bonusScores: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  for (const stem of releasedStems) {
    const element = getOhaeng(stem) as Element;
    bonusScores[element] += COMBINATION_CONFIG.MOGO_CHUNGBAL_BONUS;
  }
  
  return { isMogoChungBal: true, releasedStems, bonusScores };
}

// ========================================
// 메인 분석 함수
// ========================================

/**
 * 합충 분석 (Phase 1 고도화)
 */
export function analyzeCombinations(saju: SajuData): CombinationAnalysis {
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  const monthJi = saju.month?.jiHan || '子';
  
  const ganList: Array<{ gan: string; pos: number }> = [];
  const jiList: Array<{ ji: string; pos: number }> = [];
  
  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    if (p && p.ganHan !== '?') ganList.push({ gan: p.ganHan, pos: i });
    if (p && p.jiHan !== '?') jiList.push({ ji: p.jiHan, pos: i });
  }
  
  const allStems = ganList.map(g => g.gan);
  const allJijis = jiList.map(j => j.ji);
  
  const tianganHe: CombinationAnalysis['tianganHe'] = [];
  const dizhiHe: CombinationAnalysis['dizhiHe'] = [];
  const chong: CombinationAnalysis['chong'] = [];
  const mogoChungBal: CombinationAnalysis['mogoChungBal'] = [];
  
  const totalScoreAdjustment: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  // 천간합 분석
  const processedGan = new Set<number>();
  for (let i = 0; i < ganList.length; i++) {
    if (processedGan.has(i)) continue;
    const { gan: stem1, pos: pos1 } = ganList[i];
    const partner = TIANGAN_HE_PARTNER[stem1];
    
    if (!partner) continue;
    
    for (let j = i + 1; j < ganList.length; j++) {
      if (processedGan.has(j)) continue;
      const { gan: stem2, pos: pos2 } = ganList[j];
      
      if (stem2 === partner) {
        const pairKey = stem1 + stem2;
        const huashen = TIANGAN_HE_RESULT[pairKey];
        const isAdjacent = Math.abs(pos1 - pos2) === 1;
        
        const hapHwaCheck = checkTianganHapHwa(stem1, stem2, pos1, pos2, monthJi, allStems, allJijis);
        
        let heType: 'hapHwa' | 'hapBan' | 'hapGeo' = 'hapBan';
        let stem1Reduction: number = COMBINATION_CONFIG.HAPBAN_REDUCTION_ADJACENT;
        let stem2Reduction: number = COMBINATION_CONFIG.HAPBAN_REDUCTION_ADJACENT;
        let resultBonus: number = 0;
        
        if (hapHwaCheck.isHapHwa && huashen) {
          heType = 'hapHwa';
          stem1Reduction = 1.0;
          stem2Reduction = 1.0;
          resultBonus = 2.0 * COMBINATION_CONFIG.HAPHWA_INHUA_BONUS;
        } else if (!isAdjacent) {
          heType = 'hapBan';
          stem1Reduction = COMBINATION_CONFIG.HAPBAN_REDUCTION_DISTANT;
          stem2Reduction = COMBINATION_CONFIG.HAPBAN_REDUCTION_DISTANT;
        }
        
        tianganHe.push({
          stems: [stem1, stem2] as [string, string],
          positions: [pos1, pos2] as [number, number],
          isAdjacent,
          heType,
          isTransformed: heType === 'hapHwa',
          result: heType === 'hapHwa' ? huashen : undefined,
          scoreImpact: { stem1Reduction, stem2Reduction, resultBonus },
          reason: hapHwaCheck.reason,
        });
        
        const elem1 = getOhaeng(stem1) as Element;
        const elem2 = getOhaeng(stem2) as Element;
        totalScoreAdjustment[elem1] -= stem1Reduction;
        totalScoreAdjustment[elem2] -= stem2Reduction;
        if (heType === 'hapHwa' && huashen) {
          totalScoreAdjustment[huashen] += resultBonus;
        }
        
        processedGan.add(i);
        processedGan.add(j);
        break;
      }
    }
  }
  
  // 지지 육합 분석
  const processedJi = new Set<number>();
  for (let i = 0; i < jiList.length; i++) {
    if (processedJi.has(i)) continue;
    const { ji: branch1, pos: pos1 } = jiList[i];
    const partner = LIUHE_PARTNER[branch1];
    
    if (!partner) continue;
    
    for (let j = i + 1; j < jiList.length; j++) {
      if (processedJi.has(j)) continue;
      const { ji: branch2, pos: pos2 } = jiList[j];
      
      if (branch2 === partner) {
        const pairKey = branch1 + branch2;
        const huashen = LIUHE_RESULT[pairKey];
        
        const hapHwaCheck = checkDizhiHapHwa(branch1, branch2, monthJi, allStems);
        
        let heType: 'hapHwa' | 'hapBan' | 'hapGeo' = 'hapBan';
        const reductions: Record<string, number> = {};
        let resultBonus = 0;
        
        if (hapHwaCheck.isHapHwa && huashen) {
          heType = 'hapHwa';
          reductions[branch1] = 0.8;
          reductions[branch2] = 0.8;
          resultBonus = 3.0;
        } else {
          reductions[branch1] = 0.4;
          reductions[branch2] = 0.4;
        }
        
        dizhiHe.push({
          type: 'liuhe',
          branches: [branch1, branch2],
          positions: [pos1, pos2],
          heType,
          isComplete: true,
          result: heType === 'hapHwa' ? huashen : undefined,
          scoreImpact: { reductions, resultBonus },
          reason: hapHwaCheck.reason,
        });
        
        const elem1 = getOhaeng(branch1) as Element;
        const elem2 = getOhaeng(branch2) as Element;
        totalScoreAdjustment[elem1] -= reductions[branch1] || 0;
        totalScoreAdjustment[elem2] -= reductions[branch2] || 0;
        if (heType === 'hapHwa' && huashen) {
          totalScoreAdjustment[huashen] += resultBonus;
        }
        
        processedJi.add(i);
        processedJi.add(j);
        break;
      }
    }
  }
  
  // 삼합 분석
  const sanheGroups = [
    { branches: ['寅', '午', '戌'], result: 'fire' as Element, center: '午' },
    { branches: ['亥', '卯', '未'], result: 'wood' as Element, center: '卯' },
    { branches: ['巳', '酉', '丑'], result: 'metal' as Element, center: '酉' },
    { branches: ['申', '子', '辰'], result: 'water' as Element, center: '子' },
  ];
  
  for (const group of sanheGroups) {
    const foundBranches: string[] = [];
    const foundPositions: number[] = [];
    
    for (const { ji, pos } of jiList) {
      if (group.branches.includes(ji) && !processedJi.has(jiList.findIndex(j => j.ji === ji && j.pos === pos))) {
        foundBranches.push(ji);
        foundPositions.push(pos);
      }
    }
    
    if (foundBranches.length >= 2) {
      const isComplete = foundBranches.length === 3;
      const hasCenter = foundBranches.includes(group.center);
      
      const monthElement = getOhaeng(monthJi) as Element;
      const monthSupports = monthElement === group.result || GENERATING_MAP[monthElement] === group.result;
      
      let heType: 'hapHwa' | 'hapBan' | 'hapGeo' = 'hapBan';
      const reductions: Record<string, number> = {};
      let resultBonus = 0;
      let reason = '';
      
      if (isComplete && monthSupports) {
        heType = 'hapHwa';
        resultBonus = 5.0;
        reason = `완전삼합 합화 → ${ELEMENT_TO_KOREAN[group.result]}`;
        for (const b of foundBranches) reductions[b] = 0.7;
      } else if (hasCenter && monthSupports) {
        heType = 'hapHwa';
        resultBonus = 3.0;
        reason = `반합 합화 (왕지 포함) → ${ELEMENT_TO_KOREAN[group.result]}`;
        for (const b of foundBranches) reductions[b] = 0.5;
      } else {
        reason = '삼합 합반: 합화조건 미충족';
        for (const b of foundBranches) reductions[b] = 0.3;
      }
      
      dizhiHe.push({
        type: 'sanhe',
        branches: foundBranches,
        positions: foundPositions,
        heType,
        isComplete,
        result: heType === 'hapHwa' ? group.result : undefined,
        scoreImpact: { reductions, resultBonus },
        reason,
      });
      
      for (const b of foundBranches) {
        const elem = getOhaeng(b) as Element;
        totalScoreAdjustment[elem] -= reductions[b] || 0;
      }
      if (heType === 'hapHwa') {
        totalScoreAdjustment[group.result] += resultBonus;
      }
    }
  }
  
  // 충 분석
  const chongProcessed = new Set<number>();
  for (let i = 0; i < jiList.length; i++) {
    if (chongProcessed.has(i)) continue;
    const { ji: branch1, pos: pos1 } = jiList[i];
    const partner = CHONG_PARTNER[branch1];
    
    if (!partner) continue;
    
    for (let j = i + 1; j < jiList.length; j++) {
      if (chongProcessed.has(j)) continue;
      const { ji: branch2, pos: pos2 } = jiList[j];
      
      if (branch2 === partner) {
        const chungInfo = determineChungType(branch1, branch2, pos1, pos2, monthJi);
        
        let branch1Reduction = 0;
        let branch2Reduction = 0;
        let impact: 'neutralize' | 'activate' | 'damage' | 'chungBal' = 'neutralize';
        let chungBalElement: Element | undefined;
        let chungBalBonus: number | undefined;
        let reason = '';
        
        switch (chungInfo.chungType) {
          case 'wangChungSwae':
            if (branch1 === chungInfo.wang) {
              branch1Reduction = -COMBINATION_CONFIG.CHUNG_WANG_REDUCTION;
              branch2Reduction = -COMBINATION_CONFIG.CHUNG_SWAE_REDUCTION;
            } else {
              branch1Reduction = -COMBINATION_CONFIG.CHUNG_SWAE_REDUCTION;
              branch2Reduction = -COMBINATION_CONFIG.CHUNG_WANG_REDUCTION;
            }
            impact = 'damage';
            reason = `왕자충쇠: ${chungInfo.wang}(왕)이 ${chungInfo.swae}(쇠) 충파`;
            break;
            
          case 'swaeChungWang':
            const chungBal = checkWangsinChungBal(
              branch1 === chungInfo.wang ? chungInfo.strength1 : chungInfo.strength2);
            
            if (branch1 === chungInfo.wang) {
              branch1Reduction = chungBal.isChungBal ? COMBINATION_CONFIG.CHUNG_WANG_BONUS_ON_SWAE : 0;
              branch2Reduction = -1.0;
            } else {
              branch1Reduction = -1.0;
              branch2Reduction = chungBal.isChungBal ? COMBINATION_CONFIG.CHUNG_WANG_BONUS_ON_SWAE : 0;
            }
            
            if (chungBal.isChungBal) {
              impact = 'chungBal';
              chungBalElement = getOhaeng(chungInfo.wang) as Element;
              chungBalBonus = chungBal.bonus;
              reason = `충발: ${chungInfo.swae}(쇠)가 ${chungInfo.wang}(왕) 자극`;
            } else {
              impact = 'damage';
              reason = `쇠자충왕: ${chungInfo.swae}(쇠) 파멸`;
            }
            break;
            
          case 'equal':
            branch1Reduction = -COMBINATION_CONFIG.CHUNG_EQUAL_REDUCTION;
            branch2Reduction = -COMBINATION_CONFIG.CHUNG_EQUAL_REDUCTION;
            impact = 'neutralize';
            reason = `세력비등 충: ${branch1}↔${branch2} 양측 손상`;
            break;
        }
        
        const mogoCheck = checkMogoChungBal(branch1, branch2);
        if (mogoCheck.isMogoChungBal) {
          mogoChungBal.push({
            branches: [branch1, branch2] as [string, string],
            releasedStems: mogoCheck.releasedStems,
            scoreBonus: mogoCheck.bonusScores,
          });
          
          for (const elem of Object.keys(mogoCheck.bonusScores) as Element[]) {
            totalScoreAdjustment[elem] += mogoCheck.bonusScores[elem];
          }
          
          reason += ` + 묘고충발(${mogoCheck.releasedStems.join(',')})`;
        }
        
        chong.push({
          branches: [branch1, branch2] as [string, string],
          positions: [pos1, pos2] as [number, number],
          chungType: chungInfo.chungType,
          impact,
          scoreImpact: {
            branch1Reduction,
            branch2Reduction,
            chungBalElement,
            chungBalBonus,
          },
          reason,
        });
        
        const elem1 = getOhaeng(branch1) as Element;
        const elem2 = getOhaeng(branch2) as Element;
        totalScoreAdjustment[elem1] += branch1Reduction;
        totalScoreAdjustment[elem2] += branch2Reduction;
        if (chungBalElement && chungBalBonus) {
          totalScoreAdjustment[chungBalElement] += chungBalBonus;
        }
        
        chongProcessed.add(i);
        chongProcessed.add(j);
        break;
      }
    }
  }
  
  return { 
    tianganHe, 
    dizhiHe, 
    chong, 
    mogoChungBal: mogoChungBal.length > 0 ? mogoChungBal : undefined,
    totalScoreAdjustment 
  };
}

/**
 * 용신이 합충의 영향을 받는지 확인
 */
export function checkYongshinCombinationImpact(
  yongshinElement: Element,
  combinations: CombinationAnalysis,
  saju: SajuData
): { isWeakened: boolean; isStrengthened: boolean; reason: string } {
  let isWeakened = false;
  let isStrengthened = false;
  const reasons: string[] = [];
  
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  const yongshinGans: string[] = [];
  const yongshinJis: string[] = [];
  
  for (const p of pillars) {
    if (!p || p.ganHan === '?') continue;
    if (getOhaeng(p.ganHan) === yongshinElement) yongshinGans.push(p.ganHan);
    if (getOhaeng(p.jiHan) === yongshinElement) yongshinJis.push(p.jiHan);
  }
  
  // 천간합 영향 분석
  for (const he of combinations.tianganHe) {
    if (yongshinGans.some(g => he.stems.includes(g))) {
      if (he.heType === 'hapHwa') {
        if (he.result === yongshinElement) {
          isStrengthened = true;
          reasons.push(`천간합화로 용신 강화`);
        } else {
          isWeakened = true;
          reasons.push(`천간합화로 용신 변질`);
        }
      } else if (he.heType === 'hapBan') {
        isWeakened = true;
        reasons.push(`천간합반으로 용신 기능 저하`);
      }
    }
  }
  
  // 지지합 영향 분석
  for (const he of combinations.dizhiHe) {
    if (yongshinJis.some(j => he.branches.includes(j))) {
      if (he.heType === 'hapHwa') {
        if (he.result === yongshinElement) {
          isStrengthened = true;
          reasons.push(`지지합화로 용신 강화`);
        } else if (he.result) {
          isWeakened = true;
          reasons.push(`지지합화로 용신 변질`);
        }
      } else if (he.heType === 'hapBan') {
        isWeakened = true;
        reasons.push(`지지합반으로 용신 기능 저하`);
      }
    }
  }
  
  // 충 영향 분석
  for (const c of combinations.chong) {
    if (yongshinJis.some(j => c.branches.includes(j))) {
      if (c.impact === 'chungBal' && c.scoreImpact.chungBalElement === yongshinElement) {
        isStrengthened = true;
        reasons.push(`충발로 용신 강화`);
      } else if (c.chungType === 'wangChungSwae' || c.chungType === 'equal') {
        isWeakened = true;
        reasons.push(`충으로 용신 약화`);
      }
    }
  }
  
  // 묘고충발 보너스
  if (combinations.mogoChungBal) {
    for (const mogo of combinations.mogoChungBal) {
      if (mogo.scoreBonus[yongshinElement] && mogo.scoreBonus[yongshinElement] > 0) {
        isStrengthened = true;
        reasons.push(`묘고충발로 용신 발현`);
      }
    }
  }
  
  const reason = reasons.length > 0 ? reasons.join(' / ') : '합충 영향 없음';
  
  return { isWeakened, isStrengthened, reason };
}
