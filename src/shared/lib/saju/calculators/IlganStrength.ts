import { IlganStrength, Pillar } from '../../../../entities/saju/model/types';
import { getOhaeng, calculateSipsin, Element } from './TenGod';

/**
 * 일간 강약 판단 로직
 * 커리큘럼 3단계: 일간 강약 판단
 */

const GENERATING_MAP: Record<Element, Element> = {
  'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood'
};

const CONTROLLING_MAP: Record<Element, Element> = {
  'wood': 'earth', 'earth': 'water', 'water': 'fire', 'fire': 'metal', 'metal': 'wood'
};

/**
 * 월령 득령 여부 계산
 * 월지가 일간을 생하거나 같은 오행이면 +2
 * 월지가 일간을 극하거나 설기하면 -2
 * 그 외는 0
 */
function calculateDeukRyeong(dayMaster: string, monthJi: string): number {
  const dayElement = getOhaeng(dayMaster);
  const monthElement = getOhaeng(monthJi);
  
  if (!dayElement || !monthElement) return 0;

  // 같은 오행이면 득령 (+2)
  if (dayElement === monthElement) {
    return 2;
  }

  // 월지가 일간을 생하면 득령 (+2)
  if (GENERATING_MAP[monthElement] === dayElement) {
    return 2;
  }

  // 월지가 일간을 극하면 실령 (-2)
  if (CONTROLLING_MAP[monthElement] === dayElement) {
    return -2;
  }

  // 월지가 일간이 생하는 오행이면 설기 (-2)
  if (GENERATING_MAP[dayElement] === monthElement) {
    return -2;
  }

  return 0;
}

/**
 * 통근 여부 계산
 * 지지에 일간과 같은 오행이 있는지 확인
 * 일지에 뿌리: +2
 * 년지/월지/시지에 뿌리: 각 +1
 */
function calculateTonggeun(dayMaster: string, pillars: Pillar[]): number {
  const dayElement = getOhaeng(dayMaster);
  if (!dayElement) return 0;

  let score = 0;

  pillars.forEach((pillar, index) => {
    if (!pillar) return;

    const jiElement = getOhaeng(pillar.jiHan);
    if (jiElement === dayElement) {
      // 일지(index 2)에 뿌리면 +2, 그 외는 +1
      if (index === 2) {
        score += 2;
      } else {
        score += 1;
      }
    }

    // 지장간도 확인
    if (pillar.jijanggan) {
      pillar.jijanggan.forEach(jijangganHan => {
        const jijangganElement = getOhaeng(jijangganHan);
        if (jijangganElement === dayElement) {
          // 일지의 지장간이면 +1, 그 외는 +0.5 (반올림하여 +1)
          if (index === 2) {
            score += 1;
          } else {
            score += 1;
          }
        }
      });
    }
  });

  return score;
}

/**
 * 천간 생조 여부 계산
 * 인성이 천간에 있으면 +1
 * 비겁이 천간에 있으면 +1
 */
function calculateCheongan(dayMaster: string, pillars: Pillar[]): number {
  let score = 0;

  pillars.forEach(pillar => {
    if (!pillar) return;

    const sipsin = calculateSipsin(dayMaster, pillar.ganHan);
    
    // 인성 (편인, 정인)
    if (sipsin === '편인' || sipsin === '정인') {
      score += 1;
    }
    
    // 비겁 (비견, 겁재)
    if (sipsin === '비견' || sipsin === '겁재') {
      score += 1;
    }
  });

  return score;
}

/**
 * 일간 강약 판단
 * @param dayMaster 일간 천간 (예: '甲')
 * @param pillars 사주 주 (년, 월, 일, 시)
 * @returns IlganStrength 객체
 */
export function calculateIlganStrength(dayMaster: string, pillars: Pillar[]): IlganStrength {
  const monthPillar = pillars[1]; // 월주
  if (!monthPillar) {
    throw new Error('월주 정보가 필요합니다.');
  }

  const deukRyeong = calculateDeukRyeong(dayMaster, monthPillar.jiHan);
  const tonggeun = calculateTonggeun(dayMaster, pillars);
  const cheongan = calculateCheongan(dayMaster, pillars);

  const totalScore = deukRyeong + tonggeun + cheongan;

  let strength: 'strong' | 'weak' | 'neutral';
  if (totalScore >= 3) {
    strength = 'strong';
  } else if (totalScore <= -3) {
    strength = 'weak';
  } else {
    strength = 'neutral';
  }

  return {
    strength,
    score: totalScore,
    details: {
      deukRyeong,
      tonggeun,
      cheongan,
    },
  };
}
