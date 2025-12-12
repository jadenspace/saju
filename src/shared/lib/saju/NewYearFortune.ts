import { SajuData } from '../../../entities/saju/model/types';
import { josa } from 'es-hangul';

// Local Type Definitions
export type Cheongan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type Jiji = '子' | '丑' | '寅' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type Ohaeng = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type Sipsin = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';

// Types for New Year's Fortune
export interface FortuneResult {
  score: number;
  summary: string;
  details: string[];
}

export interface MonthlyFortune {
  month: number;
  gan: Cheongan;
  ji: Jiji;
  tenGod: Sipsin;
  score: number;
  description: string;
}

export interface NewYearFortune {
  year: number;
  gan: Cheongan;
  ji: Jiji;
  overall: FortuneResult;
  wealth: FortuneResult;
  love: FortuneResult;
  career: FortuneResult;
  health: FortuneResult;
  monthly: MonthlyFortune[];
}

// Constants for 2026 (Bing-Wu Year)
const CURRENT_YEAR = 2026;
const YEAR_GAN: Cheongan = '丙'; // Bing
const YEAR_JI: Jiji = '午';     // Wu

// Helper: Get Ohaeng for a character
const getOhaeng = (char: string): Ohaeng | null => {
  if (['甲', '乙', '寅', '卯'].includes(char)) return 'wood';
  if (['丙', '丁', '巳', '午'].includes(char)) return 'fire';
  if (['戊', '己', '辰', '戌', '丑', '未'].includes(char)) return 'earth';
  if (['庚', '辛', '申', '酉'].includes(char)) return 'metal';
  if (['壬', '癸', '亥', '子'].includes(char)) return 'water';
  return null;
};

// Helper: Calculate relation (Ten Gods)
const calculateTenGod = (dayMaster: Cheongan, target: Cheongan | Jiji): Sipsin => {
  const dmOhaeng = getOhaeng(dayMaster);
  const targetOhaeng = getOhaeng(target);
  
  if (!dmOhaeng || !targetOhaeng) return '비견'; // Fallback

  // Same Ohaeng
  if (dmOhaeng === targetOhaeng) return '비견'; 
  
  // DM generates Target (Wood -> Fire)
  if (
    (dmOhaeng === 'wood' && targetOhaeng === 'fire') ||
    (dmOhaeng === 'fire' && targetOhaeng === 'earth') ||
    (dmOhaeng === 'earth' && targetOhaeng === 'metal') ||
    (dmOhaeng === 'metal' && targetOhaeng === 'water') ||
    (dmOhaeng === 'water' && targetOhaeng === 'wood')
  ) return '식신';

  // Target generates DM (Water -> Wood)
  if (
    (targetOhaeng === 'wood' && dmOhaeng === 'fire') ||
    (targetOhaeng === 'fire' && dmOhaeng === 'earth') ||
    (targetOhaeng === 'earth' && dmOhaeng === 'metal') ||
    (targetOhaeng === 'metal' && dmOhaeng === 'water') ||
    (targetOhaeng === 'water' && dmOhaeng === 'wood')
  ) return '편인';

  // DM controls Target (Wood -> Earth)
  if (
    (dmOhaeng === 'wood' && targetOhaeng === 'earth') ||
    (dmOhaeng === 'fire' && targetOhaeng === 'metal') ||
    (dmOhaeng === 'earth' && targetOhaeng === 'water') ||
    (dmOhaeng === 'metal' && targetOhaeng === 'wood') ||
    (dmOhaeng === 'water' && targetOhaeng === 'fire')
  ) return '편재';

  // Target controls DM (Metal -> Wood)
  if (
    (targetOhaeng === 'wood' && dmOhaeng === 'earth') ||
    (targetOhaeng === 'fire' && dmOhaeng === 'metal') ||
    (targetOhaeng === 'earth' && dmOhaeng === 'water') ||
    (targetOhaeng === 'metal' && dmOhaeng === 'wood') ||
    (targetOhaeng === 'water' && dmOhaeng === 'fire')
  ) return '편관';

  return '비견';
};

export const calculateNewYearFortune = (sajuData: SajuData): NewYearFortune => {
  const dayMaster = sajuData.day.ganHan as Cheongan;
  
  // 1. Analyze Year Gan/Ji relation to Day Master
  const yearGanTenGod = calculateTenGod(dayMaster, YEAR_GAN);
  const yearJiTenGod = calculateTenGod(dayMaster, YEAR_JI);

  // 2. Generate Overall Fortune
  const overallScore = 75; // Placeholder calculation
  const overallSummary = `${CURRENT_YEAR}년 병오년(丙午年)은 당신에게 ${josa(yearGanTenGod, '와/과')} ${yearJiTenGod}의 기운이 들어오는 해입니다.`;
  
  // 3. Generate Specific Fortunes
  // Wealth: Related to '재성' (Wealth Star)
  const wealthScore = ['편재', '정재'].includes(yearGanTenGod) || ['편재', '정재'].includes(yearJiTenGod) ? 85 : 60;
  
  // Love: Related to '관성' (Official Star for women) or '재성' (Wealth Star for men)
  const isMale = sajuData.gender === 'male';
  const loveStar = isMale ? ['편재', '정재'] : ['편관', '정관'];
  const loveScore = loveStar.includes(yearGanTenGod) || loveStar.includes(yearJiTenGod) ? 80 : 55;

  // Career: Related to '관성' and '인성'
  const careerScore = ['편관', '정관', '편인', '정인'].includes(yearGanTenGod) || ['편관', '정관', '편인', '정인'].includes(yearJiTenGod) ? 80 : 65;

  // Health: Check for clashes (Chung)
  // Simple check: Wu (Horse) clashes with Ja (Rat)
  const hasJa = [sajuData.year.jiHan, sajuData.month.jiHan, sajuData.day.jiHan, sajuData.hour.jiHan].includes('子');
  const healthScore = hasJa ? 40 : 80;

  return {
    year: CURRENT_YEAR,
    gan: YEAR_GAN,
    ji: YEAR_JI,
    overall: {
      score: overallScore,
      summary: overallSummary,
      details: [
        `천간 ${josa(YEAR_GAN + '(화)', '이/가')} 당신의 일간 ${dayMaster}에게 미치는 영향: ${yearGanTenGod}`,
        `지지 ${josa(YEAR_JI + '(화)', '이/가')} 당신의 일간 ${dayMaster}에게 미치는 영향: ${yearJiTenGod}`,
        hasJa ? '자오충(子午沖)이 발생하여 변화와 이동수가 있을 수 있습니다.' : '지지와의 특별한 충돌 없이 무난한 흐름입니다.'
      ]
    },
    wealth: {
      score: wealthScore,
      summary: wealthScore > 70 ? '재물운이 따르는 해입니다.' : '지출 관리에 유의해야 합니다.',
      details: ['재성과의 관계를 분석한 결과입니다.']
    },
    love: {
      score: loveScore,
      summary: loveScore > 70 ? '새로운 인연이 찾아올 수 있습니다.' : '기존 관계를 돈독히 하는 것이 좋습니다.',
      details: ['관성/재성과의 관계를 분석한 결과입니다.']
    },
    career: {
      score: careerScore,
      summary: careerScore > 70 ? '승진이나 합격의 기운이 있습니다.' : '현재 위치에서 내실을 다지는 것이 좋습니다.',
      details: ['관성/인성과의 관계를 분석한 결과입니다.']
    },
    health: {
      score: healthScore,
      summary: healthScore > 60 ? '건강한 한 해가 될 것입니다.' : '건강 관리에 각별히 유의하세요.',
      details: [hasJa ? '충의 영향으로 심혈관 계통이나 스트레스에 주의하세요.' : '규칙적인 생활로 건강을 유지하세요.']
    },
    monthly: [] // To be implemented with detailed monthly logic
  };
};
