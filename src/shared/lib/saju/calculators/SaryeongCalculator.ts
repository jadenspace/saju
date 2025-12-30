/**
 * 사령분일(司令分日) 계산 모듈 (Phase 3)
 * - 월지 지장간 사령 기간 데이터
 * - 절입일 기준 득령 점수 계산
 */

import { getOhaeng, Element } from './TenGod';

// ========================================
// 사령 기간 데이터
// ========================================

interface SaryeongPeriod {
  stem: string;      // 지장간 천간
  days: number;      // 사령 기간 (일)
  type: 'yeogi' | 'junggi' | 'jeonggi';  // 여기/중기/정기
}

export const SARYEONG_DATA: Record<string, SaryeongPeriod[]> = {
  // 인월(寅) - 입춘 후
  '寅': [
    { stem: '戊', days: 7, type: 'yeogi' },
    { stem: '丙', days: 7, type: 'junggi' },
    { stem: '甲', days: 16, type: 'jeonggi' },
  ],
  // 묘월(卯) - 경칩 후
  '卯': [
    { stem: '甲', days: 10, type: 'yeogi' },
    { stem: '乙', days: 20, type: 'jeonggi' },
  ],
  // 진월(辰) - 청명 후
  '辰': [
    { stem: '乙', days: 9, type: 'yeogi' },
    { stem: '癸', days: 3, type: 'junggi' },
    { stem: '戊', days: 18, type: 'jeonggi' },
  ],
  // 사월(巳) - 입하 후
  '巳': [
    { stem: '戊', days: 5, type: 'yeogi' },
    { stem: '庚', days: 9, type: 'junggi' },
    { stem: '丙', days: 16, type: 'jeonggi' },
  ],
  // 오월(午) - 망종 후
  '午': [
    { stem: '丙', days: 10, type: 'yeogi' },
    { stem: '己', days: 9, type: 'junggi' },
    { stem: '丁', days: 11, type: 'jeonggi' },
  ],
  // 미월(未) - 소서 후
  '未': [
    { stem: '丁', days: 9, type: 'yeogi' },
    { stem: '乙', days: 3, type: 'junggi' },
    { stem: '己', days: 18, type: 'jeonggi' },
  ],
  // 신월(申) - 입추 후
  '申': [
    { stem: '戊', days: 10, type: 'yeogi' },
    { stem: '壬', days: 3, type: 'junggi' },
    { stem: '庚', days: 17, type: 'jeonggi' },
  ],
  // 유월(酉) - 백로 후
  '酉': [
    { stem: '庚', days: 10, type: 'yeogi' },
    { stem: '辛', days: 20, type: 'jeonggi' },
  ],
  // 술월(戌) - 한로 후
  '戌': [
    { stem: '辛', days: 9, type: 'yeogi' },
    { stem: '丁', days: 3, type: 'junggi' },
    { stem: '戊', days: 18, type: 'jeonggi' },
  ],
  // 해월(亥) - 입동 후
  '亥': [
    { stem: '戊', days: 7, type: 'yeogi' },
    { stem: '甲', days: 5, type: 'junggi' },
    { stem: '壬', days: 18, type: 'jeonggi' },
  ],
  // 자월(子) - 대설 후
  '子': [
    { stem: '壬', days: 10, type: 'yeogi' },
    { stem: '癸', days: 20, type: 'jeonggi' },
  ],
  // 축월(丑) - 소한 후
  '丑': [
    { stem: '癸', days: 9, type: 'yeogi' },
    { stem: '辛', days: 3, type: 'junggi' },
    { stem: '己', days: 18, type: 'jeonggi' },
  ],
};

// 사령 유형별 득령 비율
export const SARYEONG_RATIO: Record<string, number> = {
  'jeonggi': 1.0,   // 정기 사령: 100%
  'junggi': 0.7,    // 중기 사령: 70%
  'yeogi': 0.6,     // 여기 사령: 60%
};

// ========================================
// 인터페이스 정의
// ========================================

export interface SaryeongInfo {
  commandingStem: string;  // 사령 중인 지장간
  type: 'yeogi' | 'junggi' | 'jeonggi';  // 사령 유형
  ratio: number;  // 득령 점수 비율
  description: string;
}

export interface DeukryeongWithSaryeong {
  deukryeong: boolean;  // 득령 여부
  ratio: number;        // 득령 비율
  saryeongInfo: SaryeongInfo;
}

// ========================================
// 함수 정의
// ========================================

/**
 * 사령분일 계산: 생일이 어느 지장간 사령 기간에 속하는지 확인
 * 
 * @param monthJi - 월지
 * @param dayInMonth - 절입일부터 며칠째인지 (1~30)
 * @returns 사령 정보
 */
export function getSaryeongInfo(monthJi: string, dayInMonth: number): SaryeongInfo {
  const periods = SARYEONG_DATA[monthJi];
  
  if (!periods || periods.length === 0) {
    return {
      commandingStem: '',
      type: 'jeonggi',
      ratio: 0.5,
      description: '사령 정보 없음',
    };
  }
  
  // 절입일부터 며칠째인지에 따라 사령 구간 결정
  let accumDays = 0;
  for (const period of periods) {
    accumDays += period.days;
    if (dayInMonth <= accumDays) {
      const ratio = SARYEONG_RATIO[period.type] || 0.5;
      const typeKr = period.type === 'jeonggi' ? '정기' : period.type === 'junggi' ? '중기' : '여기';
      
      return {
        commandingStem: period.stem,
        type: period.type,
        ratio,
        description: `${period.stem}(${typeKr}) 사령 ${dayInMonth}일차`,
      };
    }
  }
  
  // 월말: 정기 사령
  const lastPeriod = periods[periods.length - 1];
  return {
    commandingStem: lastPeriod.stem,
    type: 'jeonggi',
    ratio: 1.0,
    description: `${lastPeriod.stem}(정기) 사령 (월말)`,
  };
}

/**
 * 사령분일을 반영한 득령 점수 계산
 * 
 * @param dayElement - 일간 오행
 * @param monthJi - 월지
 * @param dayInMonth - 절입일부터 며칠째 (기본값: 15)
 */
export function calculateDeukryeongWithSaryeong(
  dayElement: Element,
  monthJi: string,
  dayInMonth: number = 15
): DeukryeongWithSaryeong {
  const monthElement = getOhaeng(monthJi) as Element;
  const basicDeukryeong = monthElement === dayElement;
  
  const saryeongInfo = getSaryeongInfo(monthJi, dayInMonth);
  
  // 사령 지장간의 오행이 일간 오행과 같은지 확인
  const saryeongElement = saryeongInfo.commandingStem ? 
    getOhaeng(saryeongInfo.commandingStem) as Element : null;
  
  const saryeongDeukryeong = saryeongElement === dayElement;
  
  // 최종 득령 판단
  const deukryeong = basicDeukryeong || saryeongDeukryeong;
  
  // 득령 비율 계산
  let ratio: number;
  if (basicDeukryeong && saryeongDeukryeong) {
    // 월지 본기 + 사령 동시 득령: 최고
    ratio = 1.0 * saryeongInfo.ratio + 0.2;
  } else if (saryeongDeukryeong) {
    // 사령 득령만
    ratio = saryeongInfo.ratio;
  } else if (basicDeukryeong) {
    // 월지 본기 득령만 (사령은 다른 오행)
    ratio = 0.8;
  } else {
    // 득령 실패
    ratio = 0;
  }
  
  return { 
    deukryeong, 
    ratio: Math.min(ratio, 1.2), 
    saryeongInfo 
  };
}

/**
 * 특정 월지의 지장간 목록 반환
 */
export function getJijanggan(monthJi: string): string[] {
  const periods = SARYEONG_DATA[monthJi];
  if (!periods) return [];
  return periods.map(p => p.stem);
}

/**
 * 특정 월지의 정기(正氣) 반환
 */
export function getJeonggi(monthJi: string): string | null {
  const periods = SARYEONG_DATA[monthJi];
  if (!periods) return null;
  const jeonggi = periods.find(p => p.type === 'jeonggi');
  return jeonggi?.stem || null;
}

/**
 * 특정 월지의 중기(中氣) 반환
 */
export function getJunggi(monthJi: string): string | null {
  const periods = SARYEONG_DATA[monthJi];
  if (!periods) return null;
  const junggi = periods.find(p => p.type === 'junggi');
  return junggi?.stem || null;
}

/**
 * 특정 월지의 여기(餘氣) 반환
 */
export function getYeogi(monthJi: string): string | null {
  const periods = SARYEONG_DATA[monthJi];
  if (!periods) return null;
  const yeogi = periods.find(p => p.type === 'yeogi');
  return yeogi?.stem || null;
}
