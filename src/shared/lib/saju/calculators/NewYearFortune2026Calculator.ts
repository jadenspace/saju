/**
 * 2026 병오년 신년운세 계산기
 * 
 * 문서(new_2026.md)의 알고리즘에 따라 운세를 계산합니다.
 * 각 메서드는 문서의 STEP 1~5를 명확히 주석으로 구분하여 구현합니다.
 */

import { SajuData, NewYearFortune2026, FortuneCategory2026, MonthlyFortune2026 } from '../../../../entities/saju/model/types';
import { Seun } from '../../../../entities/saju/model/types';
import { calculateSipsin, getOhaeng, Element, Sipsin } from './TenGod';
import { SeunFortuneCalculator } from './SeunFortuneCalculator';
import {
  generateTotalFortuneText,
  generateWealthFortuneText,
  generateLoveFortuneText,
  generateCareerFortuneText,
  generateHealthFortuneText,
  generateMonthlyFortuneText,
  generateTotalAdvice,
} from './NewYearFortune2026Templates';

/**
 * 2026년 병오년 세운 (고정값)
 */
const SEUN_2026: Seun = {
  year: 2026,
  ganZhi: '丙午',
  gan: '병',
  ji: '오',
  ganHan: '丙',
  jiHan: '午',
  ganElement: 'fire',
  jiElement: 'fire',
};

/**
 * 2026년 월별 간지 (문서 기준)
 * 절기 기준으로 구분된 월별 간지
 */
const MONTHLY_GANZHI_2026: Array<{ month: number; ganZhi: string; ganHan: string; jiHan: string }> = [
  { month: 1, ganZhi: '己丑', ganHan: '己', jiHan: '丑' },
  { month: 2, ganZhi: '庚寅', ganHan: '庚', jiHan: '寅' },
  { month: 3, ganZhi: '辛卯', ganHan: '辛', jiHan: '卯' },
  { month: 4, ganZhi: '壬辰', ganHan: '壬', jiHan: '辰' },
  { month: 5, ganZhi: '癸巳', ganHan: '癸', jiHan: '巳' },
  { month: 6, ganZhi: '甲午', ganHan: '甲', jiHan: '午' },
  { month: 7, ganZhi: '乙未', ganHan: '乙', jiHan: '未' },
  { month: 8, ganZhi: '丙申', ganHan: '丙', jiHan: '申' },
  { month: 9, ganZhi: '丁酉', ganHan: '丁', jiHan: '酉' },
  { month: 10, ganZhi: '戊戌', ganHan: '戊', jiHan: '戌' },
  { month: 11, ganZhi: '己亥', ganHan: '己', jiHan: '亥' },
  { month: 12, ganZhi: '庚子', ganHan: '庚', jiHan: '子' },
];

/**
 * 현재 대운 찾기 (2026년 기준)
 */
function getCurrentDaeun(sajuData: SajuData): { period: any; index: number } | null {
  const birthYear = parseInt(sajuData.birthDate.split('-')[0]);
  const currentAge = 2026 - birthYear + 1; // 한국 나이
  
  const index = sajuData.daeun.findIndex(
    period => currentAge >= period.startAge && currentAge <= period.endAge
  );
  
  if (index === -1) {
    // 가장 가까운 대운 찾기
    const closest = sajuData.daeun.reduce((prev, curr, idx) => {
      const prevDiff = Math.abs(prev.startAge - currentAge);
      const currDiff = Math.abs(curr.startAge - currentAge);
      return currDiff < prevDiff ? curr : prev;
    });
    const closestIndex = sajuData.daeun.indexOf(closest);
    return { period: closest, index: closestIndex };
  }
  
  return { period: sajuData.daeun[index], index };
}

/**
 * 점수를 등급으로 변환
 */
function scoreToGrade(score: number, isTotal: boolean = false): '상상' | '상' | '중상' | '중' | '중하' | '하' | '하하' {
  if (isTotal) {
    if (score >= 4.5) return '상상';
    if (score >= 4.0) return '상';
    if (score >= 3.5) return '중상';
    if (score >= 3.0) return '중';
    if (score >= 2.5) return '중하';
    if (score >= 2.0) return '하';
    return '하하';
  } else {
    if (score >= 4.0) return '상';
    if (score >= 3.5) return '중상';
    if (score >= 3.0) return '중';
    if (score >= 2.5) return '중하';
    return '하';
  }
}

/**
 * 십신이 희신인지 기신인지 판단 (신강/신약 기준)
 */
function isHeeshin(sipsin: Sipsin, strength: 'strong' | 'weak' | 'neutral'): boolean {
  // 신약 사주: 생/조(인성, 비겁)가 희신
  // 신강 사주: 설기/극(식상, 재성, 관성)이 희신
  
  const heeshinForWeak: Sipsin[] = ['정인', '편인', '비견', '겁재'];
  const heeshinForStrong: Sipsin[] = ['식신', '상관', '정재', '편재', '정관', '편관'];
  
  if (strength === 'weak') {
    return heeshinForWeak.includes(sipsin);
  } else if (strength === 'strong') {
    return heeshinForStrong.includes(sipsin);
  }
  
  // neutral은 중립적으로 판단
  return false;
}

/**
 * 재성 확인 (일간 기준)
 */
function getWealthStars(dayMaster: string): { jeongjae: string; pyeonjae: string } {
  const dayElement = getOhaeng(dayMaster);
  if (!dayElement) return { jeongjae: '', pyeonjae: '' };
  
  // 재성 = 일간이 극하는 오행
  const controllingMap: Record<Element, Element> = {
    'wood': 'earth',
    'fire': 'metal',
    'earth': 'water',
    'metal': 'wood',
    'water': 'fire',
  };
  
  const wealthElement = controllingMap[dayElement];
  
  // 정재/편재 구분은 음양으로
  const yangWealth: Record<Element, { jeong: string; pyeon: string }> = {
    'earth': { jeong: '己', pyeon: '戊' },
    'metal': { jeong: '辛', pyeon: '庚' },
    'water': { jeong: '癸', pyeon: '壬' },
    'wood': { jeong: '乙', pyeon: '甲' },
    'fire': { jeong: '丁', pyeon: '丙' },
  };
  
  return yangWealth[wealthElement] || { jeongjae: '', pyeonjae: '' };
}

/**
 * 관성 확인 (일간 기준)
 */
function getOfficialStars(dayMaster: string): { jeonggwan: string; pyeongwan: string } {
  const dayElement = getOhaeng(dayMaster);
  if (!dayElement) return { jeonggwan: '', pyeongwan: '' };
  
  // 관성 = 일간을 극하는 오행
  const controllingMap: Record<Element, Element> = {
    'wood': 'metal',
    'fire': 'water',
    'earth': 'wood',
    'metal': 'fire',
    'water': 'earth',
  };
  
  const officialElement = controllingMap[dayElement];
  
  const yangOfficial: Record<Element, { jeong: string; pyeon: string }> = {
    'metal': { jeong: '辛', pyeon: '庚' },
    'water': { jeong: '癸', pyeon: '壬' },
    'wood': { jeong: '乙', pyeon: '甲' },
    'fire': { jeong: '丁', pyeon: '丙' },
    'earth': { jeong: '己', pyeon: '戊' },
  };
  
  return yangOfficial[officialElement] || { jeonggwan: '', pyeongwan: '' };
}

/**
 * 도화살 확인 (일지 기준)
 */
function getDohwaSals(dayJi: string): string[] {
  // 일지 기준 도화살
  // 寅午戌 일지 → 卯가 도화
  // 申子辰 일지 → 酉가 도화
  // 亥卯未 일지 → 子가 도화
  // 巳酉丑 일지 → 午가 도화
  
  const dohwaMap: Record<string, string> = {
    '寅': '卯', '午': '卯', '戌': '卯',
    '申': '酉', '子': '酉', '辰': '酉',
    '亥': '子', '卯': '子', '未': '子',
    '巳': '午', '酉': '午', '丑': '午',
  };
  
  const dohwa = dohwaMap[dayJi];
  return dohwa ? [dohwa] : [];
}

export class NewYearFortune2026Calculator {
  /**
   * 메인 계산 함수
   */
  static calculate(sajuData: SajuData): NewYearFortune2026 {
    const dayMaster = sajuData.day.ganHan;
    
    // 세운 십신 계산
    SEUN_2026.tenGodsGan = calculateSipsin(dayMaster, SEUN_2026.ganHan);
    SEUN_2026.tenGodsJi = calculateSipsin(dayMaster, SEUN_2026.jiHan);
    
    // 총운 계산
    const total = this.calculateTotalFortune(SEUN_2026, sajuData);
    
    // 세부 운세 계산
    const wealth = this.calculateWealthFortune(SEUN_2026, sajuData);
    const love = this.calculateLoveFortune(SEUN_2026, sajuData);
    const career = this.calculateCareerFortune(SEUN_2026, sajuData);
    const health = this.calculateHealthFortune(SEUN_2026, sajuData);
    
    // 월별운 계산
    const monthly = this.calculateMonthlyFortunes(SEUN_2026, sajuData);
    
    // 총운 조언 업데이트 (월별운 계산 후)
    const totalAdvice = generateTotalAdvice(monthly, total.advice.direction, total.advice.color);
    total.advice.firstHalf = totalAdvice.firstHalf;
    total.advice.secondHalf = totalAdvice.secondHalf;
    
    return {
      year: 2026,
      ganZhi: '丙午',
      total,
      wealth,
      love,
      career,
      health,
      monthly,
    };
  }

  /**
   * 총운 분석
   * 문서 3.1.2 알고리즘
   */
  private static calculateTotalFortune(seun: Seun, sajuData: SajuData) {
    const dayMaster = sajuData.day.ganHan;
    const strength = sajuData.ilganStrength?.strength || 'neutral';
    
    // STEP 1: 세운 십신 확인
    const seunTenGodsGan = seun.tenGodsGan!;
    const seunTenGodsJi = seun.tenGodsJi!;
    
    // STEP 2: 신강/신약에 따른 해석
    const isHeeshinGan = isHeeshin(seunTenGodsGan as Sipsin, strength);
    const isHeeshinJi = isHeeshin(seunTenGodsJi as Sipsin, strength);
    
    // STEP 3: 원국과의 작용 확인
    const jiRelationships = SeunFortuneCalculator.analyzeSeun(seun, sajuData);
    
    // STEP 4: 대운과의 조합
    const currentDaeun = getCurrentDaeun(sajuData);
    
    // STEP 5: 총운 등급 산출
    let score = 3.0; // 기본 3점
    
    // 희신이면 가점, 기신이면 감점
    if (isHeeshinGan) score += 0.5;
    else score -= 0.3;
    
    if (isHeeshinJi) score += 0.5;
    else score -= 0.3;
    
    // 원국 작용
    if (jiRelationships.day?.type === '합' || jiRelationships.day?.type === '반합') {
      score += 0.5;
    }
    if (jiRelationships.day?.type === '충') {
      score -= 0.5;
    }
    if (jiRelationships.day?.type === '형') {
      score -= 0.3;
    }
    
    // 점수 범위 조정 (1-5)
    score = Math.min(5, Math.max(1, score));
    
    const grade = scoreToGrade(score, true);
    
    // 키워드 생성
    const keywords: string[] = [];
    if (seunTenGodsGan === '편인' || seunTenGodsGan === '정인') {
      keywords.push('학습', '자격증', '후원자', '내면성장');
    } else if (seunTenGodsGan === '편재' || seunTenGodsGan === '정재') {
      keywords.push('재물', '수입', '투자', '재테크');
    } else if (seunTenGodsGan === '편관' || seunTenGodsGan === '정관') {
      keywords.push('직장', '승진', '책임', '권위');
    } else if (seunTenGodsGan === '식신' || seunTenGodsGan === '상관') {
      keywords.push('표현', '능력', '성과', '창의');
    } else if (seunTenGodsGan === '비견' || seunTenGodsGan === '겁재') {
      keywords.push('협력', '경쟁', '동료', '자신감');
    }
    
    // 용신 정보로 조언 생성
    const yongshin = sajuData.yongshin;
    const direction = yongshin ? this.getDirectionFromElement(yongshin.primary) : '동';
    const color = yongshin ? this.getColorFromElement(yongshin.primary) : '빨강';
    
    // 템플릿으로 분석 텍스트 생성 (나중에 월별운 계산 후)
    const analysis = generateTotalFortuneText(
      { score, grade, keywords, analysis: '', advice: { firstHalf: '', secondHalf: '', direction, color } },
      seunTenGodsGan,
      seunTenGodsJi,
      strength,
      jiRelationships,
      sajuData
    );
    
    return {
      score,
      grade,
      keywords,
      analysis,
      advice: {
        firstHalf: '', // 월별운 계산 후 업데이트
        secondHalf: '', // 월별운 계산 후 업데이트
        direction,
        color,
      },
    };
  }

  /**
   * 재물운 분석
   * 문서 3.2.2 알고리즘
   */
  private static calculateWealthFortune(seun: Seun, sajuData: SajuData): FortuneCategory2026 {
    const dayMaster = sajuData.day.ganHan;
    const strength = sajuData.ilganStrength?.strength || 'neutral';
    
    // STEP 1: 일간 기준 재성 확인
    const wealthStars = getWealthStars(dayMaster);
    
    // STEP 2: 2026 세운이 재성인지 확인
    const isSeunWealth = 
      seun.ganHan === wealthStars.jeongjae || 
      seun.ganHan === wealthStars.pyeonjae ||
      seun.jiHan === '午' && wealthStars.jeongjae === '己'; // 午의 지장간 己
    
    // STEP 3: 원국 재성과 세운의 작용
    const hasWealthInWonguk = 
      sajuData.year.tenGodsGan === '정재' || sajuData.year.tenGodsGan === '편재' ||
      sajuData.month.tenGodsGan === '정재' || sajuData.month.tenGodsGan === '편재' ||
      sajuData.day.tenGodsGan === '정재' || sajuData.day.tenGodsGan === '편재' ||
      (sajuData.hour.tenGodsGan === '정재' || sajuData.hour.tenGodsGan === '편재');
    
    // STEP 4: 신강/신약에 따른 재성 해석
    // STEP 5: 식상생재 여부 확인
    const hasSiksin = 
      sajuData.year.tenGodsGan === '식신' || sajuData.year.tenGodsGan === '상관' ||
      sajuData.month.tenGodsGan === '식신' || sajuData.month.tenGodsGan === '상관';
    
    // 점수 계산
    let score = 3.0;
    
    if (isSeunWealth) score += 1.0;
    if (hasWealthInWonguk) score += 0.5;
    if (hasSiksin && isSeunWealth) score += 0.5; // 식상생재
    if (strength === 'strong' && isSeunWealth) score += 0.3; // 신강 + 재성
    if (strength === 'weak' && isSeunWealth) score -= 0.3; // 신약 + 재성 (부담)
    
    score = Math.min(5, Math.max(1, score));
    
    const keywords: string[] = [];
    if (isSeunWealth) {
      keywords.push('재물 기회', '수입 증가', '투자 유리');
    } else {
      keywords.push('안정적 수입', '계획적 지출');
    }
    
    const analysis = generateWealthFortuneText(
      { score, grade: scoreToGrade(score), keywords, analysis: '', details: {}, advice: [] },
      isSeunWealth,
      hasWealthInWonguk,
      hasSiksin,
      strength
    );
    
    return {
      score,
      grade: scoreToGrade(score),
      keywords,
      analysis,
      details: {
        regularIncome: '',
        extraIncome: '',
        investment: '',
        cautionMonths: [],
      },
      advice: [],
    };
  }

  /**
   * 애정운 분석
   * 문서 3.3.2 알고리즘
   */
  private static calculateLoveFortune(seun: Seun, sajuData: SajuData): FortuneCategory2026 {
    const dayMaster = sajuData.day.ganHan;
    const gender = sajuData.gender;
    const dayJi = sajuData.day.jiHan;
    
    // STEP 1: 성별에 따른 배우자성 확인
    let spouseStar: string | null = null;
    if (gender === 'male') {
      // 남성: 재성 = 배우자성
      const wealthStars = getWealthStars(dayMaster);
      spouseStar = seun.ganHan === wealthStars.jeongjae ? wealthStars.jeongjae :
                   seun.ganHan === wealthStars.pyeonjae ? wealthStars.pyeonjae : null;
    } else {
      // 여성: 관성 = 배우자성
      const officialStars = getOfficialStars(dayMaster);
      spouseStar = seun.ganHan === officialStars.jeonggwan ? officialStars.jeonggwan :
                   seun.ganHan === officialStars.pyeongwan ? officialStars.pyeongwan : null;
    }
    
    // STEP 2: 2026 세운과 배우자성 관계
    const isSeunSpouseStar = spouseStar !== null;
    
    // STEP 3: 일지(배우자궁)와 세운 작용
    const dayRelationship = SeunFortuneCalculator.analyzeJiRelationship(seun.jiHan, dayJi);
    
    // STEP 4: 도화살 체크
    const dohwaSals = getDohwaSals(dayJi);
    const hasDohwa = dohwaSals.includes(seun.jiHan);
    
    // 점수 계산
    let score = 3.0;
    
    if (isSeunSpouseStar) score += 1.0;
    if (dayRelationship.type === '합' || dayRelationship.type === '반합') score += 0.5;
    if (dayRelationship.type === '충') score -= 0.5;
    if (hasDohwa) score += 0.5;
    
    score = Math.min(5, Math.max(1, score));
    
    const keywords: string[] = [];
    if (isSeunSpouseStar) {
      keywords.push('인연 기회', '관계 발전', '결혼 가능성');
    }
    if (hasDohwa) {
      keywords.push('이성 매력', '로맨스');
    }
    
    const analysis = generateLoveFortuneText(
      { score, grade: scoreToGrade(score), keywords, analysis: '', details: {}, advice: [] },
      isSeunSpouseStar,
      dayRelationship,
      hasDohwa,
      gender
    );
    
    return {
      score,
      grade: scoreToGrade(score),
      keywords,
      analysis,
      details: {
        single: '',
        dating: '',
        married: '',
        goodMonths: [],
        cautionMonths: [],
      },
      advice: [],
    };
  }

  /**
   * 직장운 분석
   * 문서 3.4.2 알고리즘
   */
  private static calculateCareerFortune(seun: Seun, sajuData: SajuData): FortuneCategory2026 {
    const dayMaster = sajuData.day.ganHan;
    const strength = sajuData.ilganStrength?.strength || 'neutral';
    
    // STEP 1: 2026 세운의 직장 관련 십신 확인
    const isOfficialStar = seun.tenGodsGan === '정관' || seun.tenGodsGan === '편관';
    const isInStar = seun.tenGodsGan === '정인' || seun.tenGodsGan === '편인';
    const isSiksin = seun.tenGodsGan === '식신' || seun.tenGodsGan === '상관';
    
    // STEP 2: 관성 작용 상세 분석
    // STEP 3: 원국 관성과 세운 작용
    const hasOfficialInWonguk = 
      sajuData.year.tenGodsGan === '정관' || sajuData.year.tenGodsGan === '편관' ||
      sajuData.month.tenGodsGan === '정관' || sajuData.month.tenGodsGan === '편관';
    
    // STEP 4: 역마살 체크
    // 역마살 = 寅, 申, 巳, 亥
    const yukmaSals = ['寅', '申', '巳', '亥'];
    const hasYukma = yukmaSals.includes(seun.jiHan);
    
    // 점수 계산
    let score = 3.0;
    
    if (isOfficialStar) {
      score += 1.0;
      if (strength === 'strong') score += 0.3; // 신강 + 관성 = 통제 가능
      if (strength === 'weak') score -= 0.3; // 신약 + 관성 = 부담
    }
    if (isInStar) score += 0.5; // 인성 = 자격증, 학습
    if (isSiksin) score += 0.5; // 식상 = 능력 발휘
    if (hasOfficialInWonguk) score += 0.3;
    if (hasYukma) score += 0.3; // 역마 = 이동, 변화
    
    score = Math.min(5, Math.max(1, score));
    
    const keywords: string[] = [];
    if (isOfficialStar) keywords.push('승진', '직책', '책임');
    if (isInStar) keywords.push('자격증', '학습', '부서이동');
    if (isSiksin) keywords.push('능력발휘', '성과', '이직기회');
    if (hasYukma) keywords.push('출장', '이동', '변화');
    
    const analysis = generateCareerFortuneText(
      { score, grade: scoreToGrade(score), keywords, analysis: '', details: {}, advice: [] },
      isOfficialStar,
      isInStar,
      isSiksin,
      hasOfficialInWonguk,
      hasYukma,
      strength
    );
    
    return {
      score,
      grade: scoreToGrade(score),
      keywords,
      analysis,
      details: {
        employment: '',
        promotion: '',
        jobChange: '',
        business: '',
        cautionMonths: [],
      },
      advice: [],
    };
  }

  /**
   * 건강운 분석
   * 문서 3.5.3 알고리즘
   */
  private static calculateHealthFortune(seun: Seun, sajuData: SajuData): FortuneCategory2026 {
    // STEP 1: 원국 오행 과불급 체크
    const ohaeng = sajuData.ohaengAnalysis;
    const excessElements = ohaeng.excess;
    const deficientElements = ohaeng.deficient;
    const missingElements = ohaeng.missing;
    
    // STEP 2: 2026 세운의 오행 영향
    // 2026 丙午 = 火火
    const seunElement = 'fire';
    
    // STEP 3: 충/형 부위 체크
    const jiRelationships = SeunFortuneCalculator.analyzeSeun(seun, sajuData);
    const hasChung = jiRelationships.year?.type === '충' || 
                     jiRelationships.month?.type === '충' ||
                     jiRelationships.day?.type === '충';
    const hasHyung = jiRelationships.year?.type === '형' || 
                     jiRelationships.month?.type === '형' ||
                     jiRelationships.day?.type === '형';
    
    // 점수 계산
    let score = 3.0;
    
    // 화 과다 체크
    if (excessElements.includes('화(火)') && seunElement === 'fire') {
      score -= 0.8; // 화 극과다
    }
    if (missingElements.includes('수(水)') && seunElement === 'fire') {
      score -= 0.5; // 수 부족 + 화 강화
    }
    if (hasChung) score -= 0.5;
    if (hasHyung) score -= 0.3;
    
    score = Math.min(5, Math.max(1, score));
    
    const keywords: string[] = [];
    if (excessElements.includes('화(火)')) {
      keywords.push('심장', '혈압', '염증');
    }
    if (hasChung || hasHyung) {
      keywords.push('건강 주의', '정기 검진');
    }
    
    const analysis = generateHealthFortuneText(
      { score, grade: scoreToGrade(score), keywords, analysis: '', details: {}, advice: [] },
      excessElements,
      missingElements,
      hasChung,
      hasHyung
    );
    
    return {
      score,
      grade: scoreToGrade(score),
      keywords,
      analysis,
      details: {
        cautionParts: [],
        cautionMonths: [],
        foods: [],
        colors: [],
      },
      advice: [],
    };
  }

  /**
   * 월별운 분석
   * 문서 3.6.2 알고리즘
   */
  private static calculateMonthlyFortunes(seun: Seun, sajuData: SajuData): MonthlyFortune2026[] {
    const dayMaster = sajuData.day.ganHan;
    const dayJi = sajuData.day.jiHan;
    
    return MONTHLY_GANZHI_2026.map((monthData) => {
      // STEP 1: 월운 십신 확인
      const monthTenGodsGan = calculateSipsin(dayMaster, monthData.ganHan);
      const monthTenGodsJi = calculateSipsin(dayMaster, monthData.jiHan);
      
      // STEP 2: 월운과 원국 작용
      const monthRelationship = SeunFortuneCalculator.analyzeJiRelationship(monthData.jiHan, dayJi);
      
      // STEP 3: 월운과 세운 조합
      const monthSeunRelationship = SeunFortuneCalculator.analyzeJiRelationship(monthData.jiHan, seun.jiHan);
      
      // STEP 4: 월별 등급 산출
      let score = 3.0;
      
      // 희신이면 가점
      const strength = sajuData.ilganStrength?.strength || 'neutral';
      if (isHeeshin(monthTenGodsGan as Sipsin, strength)) score += 0.5;
      if (isHeeshin(monthTenGodsJi as Sipsin, strength)) score += 0.5;
      
      // 원국 작용
      if (monthRelationship.type === '합' || monthRelationship.type === '반합') score += 0.5;
      if (monthRelationship.type === '충') score -= 0.5;
      if (monthRelationship.type === '형') score -= 0.3;
      
      // 세운 조합
      if (monthSeunRelationship.type === '합' || monthSeunRelationship.type === '반합') score += 0.3;
      if (monthSeunRelationship.type === '충') score -= 0.3;
      
      // 6월 甲午는 午+午 자형
      if (monthData.month === 6 && monthData.jiHan === '午' && seun.jiHan === '午') {
        score -= 0.5; // 자형
      }
      
      score = Math.min(5, Math.max(1, score));
      
      const keywords: string[] = [];
      if (monthTenGodsGan === '편재' || monthTenGodsGan === '정재') keywords.push('재물');
      if (monthTenGodsGan === '편관' || monthTenGodsGan === '정관') keywords.push('직장');
      if (monthTenGodsGan === '편인' || monthTenGodsGan === '정인') keywords.push('학습');
      if (monthTenGodsGan === '식신' || monthTenGodsGan === '상관') keywords.push('능력');
      
      const monthAnalysis = generateMonthlyFortuneText(
        { month: monthData.month, ganZhi: monthData.ganZhi, ganHan: monthData.ganHan, jiHan: monthData.jiHan, score, grade: scoreToGrade(score), keywords, analysis: { total: '', wealth: '', love: '', career: '', health: '', advice: '' } },
        monthTenGodsGan,
        monthTenGodsJi,
        monthRelationship,
        monthSeunRelationship
      );
      
      return {
        month: monthData.month,
        ganZhi: monthData.ganZhi,
        ganHan: monthData.ganHan,
        jiHan: monthData.jiHan,
        score,
        grade: scoreToGrade(score),
        keywords,
        analysis: monthAnalysis,
      };
    });
  }

  /**
   * 용신 오행에서 방위 추출
   */
  private static getDirectionFromElement(yongshin: string): string {
    if (yongshin.includes('목')) return '동';
    if (yongshin.includes('화')) return '남';
    if (yongshin.includes('토')) return '중앙';
    if (yongshin.includes('금')) return '서';
    if (yongshin.includes('수')) return '북';
    return '동';
  }

  /**
   * 용신 오행에서 색상 추출
   */
  private static getColorFromElement(yongshin: string): string {
    if (yongshin.includes('목')) return '녹색';
    if (yongshin.includes('화')) return '빨강';
    if (yongshin.includes('토')) return '노랑';
    if (yongshin.includes('금')) return '흰색';
    if (yongshin.includes('수')) return '검정';
    return '빨강';
  }
}

