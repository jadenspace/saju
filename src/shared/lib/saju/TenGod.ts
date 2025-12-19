/**
 * 십성(十神) 및 음양(陰陽) 판별 유틸리티
 */

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type Polarity = 'yang' | 'yin';
export type Sipsin = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';

const OHAENG_MAP: Record<string, Element> = {
  // 천간
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
  // 지지
  '寅': 'wood', '卯': 'wood',
  '巳': 'fire', '午': 'fire',
  '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '亥': 'water', '子': 'water',
};

/**
 * 지지의 음양 판별 (용/체 기준)
 * - 子(자), 午(오): 체는 양이나 용은 음 (음으로 판별)
 * - 巳(사), 亥(해): 체는 음이나 용은 양 (양으로 판별)
 */
export function getPolarity(char: string): Polarity {
  const yangSet = new Set(['甲', '丙', '戊', '庚', '壬', '寅', '申', '巳', '亥', '辰', '戌']);
  return yangSet.has(char) ? 'yang' : 'yin';
}

export function getOhaeng(char: string): Element | null {
  return OHAENG_MAP[char] || null;
}

const GENERATING_MAP: Record<Element, Element> = {
  'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood'
};

const CONTROLLING_MAP: Record<Element, Element> = {
  'wood': 'earth', 'earth': 'water', 'water': 'fire', 'fire': 'metal', 'metal': 'wood'
};

/**
 * 일간(dayMaster) 대비 대상(target)의 십성을 계산합니다.
 */
export function calculateSipsin(dayMaster: string, target: string): Sipsin {
  const dmElement = getOhaeng(dayMaster);
  const targetElement = getOhaeng(target);
  
  if (!dmElement || !targetElement) return '비견';

  const dmPolarity = getPolarity(dayMaster);
  const targetPolarity = getPolarity(target);
  const samePolarity = dmPolarity === targetPolarity;

  // 1. 비겁 (Same Element)
  if (dmElement === targetElement) {
    return samePolarity ? '비견' : '겁재';
  }

  // 2. 식상 (DM generates Target)
  if (GENERATING_MAP[dmElement] === targetElement) {
    return samePolarity ? '식신' : '상관';
  }

  // 3. 인성 (Target generates DM)
  if (GENERATING_MAP[targetElement] === dmElement) {
    return samePolarity ? '편인' : '정인';
  }

  // 4. 재성 (DM controls Target)
  if (CONTROLLING_MAP[dmElement] === targetElement) {
    return samePolarity ? '편재' : '정재';
  }

  // 5. 관성 (Target controls DM)
  if (CONTROLLING_MAP[targetElement] === dmElement) {
    return samePolarity ? '편관' : '정관';
  }

  return '비견';
}
