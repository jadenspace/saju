import { Pillar, SajuData, Seun } from '../../../../entities/saju/model/types';
import { getOhaeng } from './TenGod';

export type RelationshipType = '충' | '합' | '삼합' | '반합' | '형' | '원진' | '없음';

export interface RelationshipResult {
  type: RelationshipType;
  name: string;
  scoreMod: number;
  description: string;
}

const CLASH_MAP: Record<string, string> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳',
};

const SIX_COMBINATION_MAP: Record<string, string> = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午',
};

const TRIPLE_COMBINATIONS: Array<{ jis: string[]; element: string; name: string }> = [
  { jis: ['申', '子', '辰'], element: 'water', name: '신자진 수국' },
  { jis: ['寅', '午', '戌'], element: 'fire', name: '인오술 화국' },
  { jis: ['巳', '酉', '丑'], element: 'metal', name: '사유축 금국' },
  { jis: ['亥', '卯', '未'], element: 'wood', name: '해묘미 목국' },
];

const PUNISHMENT_GROUPS: Array<{ jis: string[]; name: string }> = [
  { jis: ['寅', '巳', '申'], name: '인사신 삼형' },
  { jis: ['丑', '戌', '未'], name: '축술미 삼형' },
];

const SELF_PUNISHMENTS = ['辰', '午', '酉', '亥'];

export class SeunFortuneCalculator {
  /**
   * 세운 지지와 원국 지지 간의 관계 분석
   */
  static analyzeJiRelationship(seunJi: string, sajuJi: string): RelationshipResult {
    // 1. 충 (Clash)
    if (CLASH_MAP[seunJi] === sajuJi) {
      return { type: '충', name: `${seunJi}${sajuJi}충`, scoreMod: -15, description: '충돌과 변화, 이동수가 강한 기운' };
    }

    // 2. 육합 (6 Combinations)
    if (SIX_COMBINATION_MAP[seunJi] === sajuJi) {
      return { type: '합', name: `${seunJi}${sajuJi}합`, scoreMod: 10, description: '화합과 안정, 결실의 기운' };
    }

    // 3. 삼합/반합 (Triple / Half Combinations)
    for (const triple of TRIPLE_COMBINATIONS) {
      if (triple.jis.includes(seunJi) && triple.jis.includes(sajuJi)) {
        // 둘 다 포함되어 있으면 반합으로 간주 (세운과 원국 한 글자씩이므로)
        return { type: '반합', name: `${seunJi}${sajuJi}반합`, scoreMod: 8, description: `${triple.name}의 기운이 생성됨` };
      }
    }

    // 4. 형 (Punishment)
    if (seunJi === '子' && sajuJi === '卯' || seunJi === '卯' && sajuJi === '子') {
      return { type: '형', name: '자묘형', scoreMod: -10, description: '무례지형, 대인관계 갈등 주의' };
    }
    
    for (const group of PUNISHMENT_GROUPS) {
      if (group.jis.includes(seunJi) && group.jis.includes(sajuJi)) {
        return { type: '형', name: group.name, scoreMod: -10, description: '지세지형/무은지형, 관재구설 및 건강 주의' };
      }
    }

    if (seunJi === sajuJi && SELF_PUNISHMENTS.includes(seunJi)) {
      return { type: '형', name: `${seunJi}${sajuJi}자형`, scoreMod: -5, description: '자형, 스스로를 볶는 기운, 심리적 갈등' };
    }

    return { type: '없음', name: '무', scoreMod: 0, description: '특이 관계 없음' };
  }

  /**
   * 세운 분석 종합
   */
  static analyzeSeun(seun: Seun, sajuData: SajuData) {
    const results = {
      year: this.analyzeJiRelationship(seun.jiHan, sajuData.year.jiHan),
      month: this.analyzeJiRelationship(seun.jiHan, sajuData.month.jiHan),
      day: this.analyzeJiRelationship(seun.jiHan, sajuData.day.jiHan),
      hour: sajuData.hour.jiHan !== '?' ? this.analyzeJiRelationship(seun.jiHan, sajuData.hour.jiHan) : null,
    };

    // 가장 강력한 영향력을 미치는 관계 추출 (충 > 합 > 형 순)
    // 보통 일지(배우자/나)와 월지(사회/직장)의 영향력이 가장 큼
    return results;
  }
}

