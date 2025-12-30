import { LuckyInfo, SajuData } from '../../../../entities/saju/model/types';

type OhaengKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

interface OhaengLuckyData {
  color: string[];
  direction: string;
  number: number[];
}

const OHAENG_LUCKY_MAP: Record<OhaengKey, OhaengLuckyData> = {
  wood: {
    color: ['청색', '녹색'],
    direction: '동쪽',
    number: [3, 8],
  },
  fire: {
    color: ['적색', '분홍색'],
    direction: '남쪽',
    number: [2, 7],
  },
  earth: {
    color: ['황색', '갈색'],
    direction: '중앙',
    number: [5, 10],
  },
  metal: {
    color: ['백색', '금색'],
    direction: '서쪽',
    number: [4, 9],
  },
  water: {
    color: ['흑색', '감색'],
    direction: '북쪽',
    number: [1, 6],
  },
};

// 한글 오행명을 영문 키로 변환
const KOREAN_TO_KEY: Record<string, OhaengKey> = {
  '목(木)': 'wood',
  '화(火)': 'fire',
  '토(土)': 'earth',
  '금(金)': 'metal',
  '수(水)': 'water',
  '목': 'wood',
  '화': 'fire',
  '토': 'earth',
  '금': 'metal',
  '수': 'water',
};

export class LuckyInfoCalculator {
  /**
   * 행운 정보 계산
   * 부족한 오행 기반
   */
  static calculateLuckyInfo(sajuData: SajuData): LuckyInfo {
    // 1. 부족한 오행 확인
    let targetOhaeng: OhaengKey | null = null;
    
    // 2. 부족한 오행 사용
    if (!targetOhaeng && sajuData.ohaengAnalysis?.deficient?.length > 0) {
      const deficientName = sajuData.ohaengAnalysis.deficient[0];
      targetOhaeng = KOREAN_TO_KEY[deficientName] || null;
    }
    
    // 3. 부족한 오행도 없으면 missing 오행 사용
    if (!targetOhaeng && sajuData.ohaengAnalysis?.missing?.length > 0) {
      const missingName = sajuData.ohaengAnalysis.missing[0];
      targetOhaeng = KOREAN_TO_KEY[missingName] || null;
    }
    
    // 4. 최종 fallback: 목(木)
    if (!targetOhaeng) {
      targetOhaeng = 'wood';
    }
    
    const luckyData = OHAENG_LUCKY_MAP[targetOhaeng];
    
    return {
      color: luckyData.color,
      direction: luckyData.direction,
      number: luckyData.number,
    };
  }
}

