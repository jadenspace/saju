import { Lunar, Solar } from 'lunar-javascript';
import { DaeunPeriod, Pillar, SajuData } from '../../../entities/saju/model/types';

export class SajuCalculator {
  static calculate(year: number, month: number, day: number, hour: number, minute: number, gender: 'male' | 'female' = 'male', unknownTime: boolean = false, useTrueSolarTime: boolean = true, applyDST: boolean = true, midnightMode: 'early' | 'late' = 'early'): SajuData {
    // Apply midnight mode (야자시/조자시) correction first
    let adjustedDate = { year, month, day };
    let adjustedTime = { hour, minute };
    
    if (!unknownTime && midnightMode === 'early' && hour === 23) {
      // 야자시: 23:00-23:59는 다음날 00:00-00:59로 처리
      adjustedTime.hour = 0;
      // Increment date
      const date = new Date(year, month - 1, day);
      date.setDate(date.getDate() + 1);
      adjustedDate.year = date.getFullYear();
      adjustedDate.month = date.getMonth() + 1;
      adjustedDate.day = date.getDate();
    }
    
    // Apply Korea timezone correction
    let correctedTime = this.applyKoreaTimezoneCorrection(adjustedDate.year, adjustedDate.month, adjustedDate.day, adjustedTime.hour, adjustedTime.minute, applyDST);
    
    // Apply true solar time correction if enabled
    if (useTrueSolarTime && !unknownTime) {
      correctedTime = this.applyTrueSolarTimeCorrection(correctedTime.hour, correctedTime.minute);
    }
    
    const solar = Solar.fromYmdHms(adjustedDate.year, adjustedDate.month, adjustedDate.day, unknownTime ? 12 : correctedTime.hour, unknownTime ? 0 : correctedTime.minute, 0);
    const lunar = solar.getLunar();

    // For Saju, we must use the Solar Terms (Jeolgi) based methods.
    const yearGanZhi = lunar.getYearInGanZhiByLiChun();
    const monthGanZhi = lunar.getMonthInGanZhiExact();
    const dayGanZhi = lunar.getDayInGanZhiExact();
    const dayMaster = dayGanZhi.charAt(0);
    const timeGanZhi = unknownTime ? '??' : lunar.getTimeInGanZhi();

    // Calculate Daeun
    const yearGan = yearGanZhi.charAt(0);
    const daeunDirection = this.getDaeunDirection(yearGan, gender);
    const daeunStartAge = this.calculateDaeunStartAge(lunar, daeunDirection, solar);
    const daeun = this.generateDaeunSequence(monthGanZhi, daeunDirection, daeunStartAge, dayMaster);

    // Calculate Ohaeng distribution
    const pillars = [
      this.createPillar(yearGanZhi, dayMaster),
      this.createPillar(monthGanZhi, dayMaster),
      this.createPillar(dayGanZhi, dayMaster),
      unknownTime ? null : this.createPillar(timeGanZhi, dayMaster)
    ].filter(p => p !== null) as Pillar[];
    
    const ohaengDistribution = this.calculateOhaengDistribution(pillars);
    const ohaengAnalysis = this.analyzeOhaeng(ohaengDistribution);

    return {
      year: pillars[0],
      month: pillars[1],
      day: pillars[2],
      hour: unknownTime ? { gan: '?', ji: '?', ganHan: '?', jiHan: '?', ganElement: 'unknown', jiElement: 'unknown' } : pillars[3],
      birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      birthTime: unknownTime ? '시간 모름' : `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      gender,
      solar: true,
      unknownTime,
      useTrueSolarTime,
      applyDST,
      midnightMode,
      daeun,
      daeunDirection,
      ohaengDistribution,
      ohaengAnalysis,
    };
  }

  // Apply true solar time correction for Korea
  // Korea standard timezone uses 135°E longitude, but Korea's center is approximately 127.5°E
  // Difference: 7.5° × 4 min/° = 30 minutes
  // True solar time = Standard time - 30 minutes
  private static applyTrueSolarTimeCorrection(hour: number, minute: number): { hour: number; minute: number } {
    const LONGITUDE_CORRECTION_MINUTES = 30; // Korea longitude difference correction
    
    let totalMinutes = hour * 60 + minute - LONGITUDE_CORRECTION_MINUTES;
    
    // Handle negative time (previous day)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    // Handle overflow (next day)
    if (totalMinutes >= 24 * 60) {
      totalMinutes -= 24 * 60;
    }
    
    return {
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
    };
  }

  // Apply Korea timezone and DST corrections
  private static applyKoreaTimezoneCorrection(year: number, month: number, day: number, hour: number, minute: number, applyDST: boolean = true): { hour: number; minute: number } {
    const date = new Date(year, month - 1, day, hour, minute);
    let adjustment = 0; // in minutes

    // UTC+08:30 periods (subtract 30 minutes)
    if (
      (year === 1908 && month >= 4) ||
      (year > 1908 && year < 1911) ||
      (year === 1911 && month <= 12)
    ) {
      adjustment -= 30;
    } else if (
      (year === 1954 && month >= 3 && day >= 21) ||
      (year > 1954 && year < 1961) ||
      (year === 1961 && month <= 8 && day <= 9)
    ) {
      adjustment -= 30;
    }

    // Daylight Saving Time periods (subtract 60 minutes) - only if applyDST is true
    if (applyDST) {
      const dstPeriods = [
        { start: new Date(1948, 5, 1, 0, 0), end: new Date(1948, 8, 13, 0, 0) },
        { start: new Date(1949, 3, 3, 0, 0), end: new Date(1949, 8, 11, 0, 0) },
        { start: new Date(1950, 3, 1, 0, 0), end: new Date(1950, 8, 10, 0, 0) },
        { start: new Date(1951, 4, 6, 0, 0), end: new Date(1951, 8, 9, 0, 0) },
        { start: new Date(1955, 4, 5, 0, 0), end: new Date(1955, 8, 9, 0, 0) },
        { start: new Date(1956, 4, 20, 0, 0), end: new Date(1956, 8, 30, 0, 0) },
        { start: new Date(1957, 4, 5, 0, 0), end: new Date(1957, 8, 22, 0, 0) },
        { start: new Date(1958, 4, 4, 0, 0), end: new Date(1958, 8, 21, 0, 0) },
        { start: new Date(1959, 4, 3, 0, 0), end: new Date(1959, 8, 20, 0, 0) },
        { start: new Date(1960, 4, 1, 0, 0), end: new Date(1960, 8, 18, 0, 0) },
        { start: new Date(1987, 4, 10, 2, 0), end: new Date(1987, 9, 11, 3, 0) },
        { start: new Date(1988, 4, 8, 2, 0), end: new Date(1988, 9, 9, 3, 0) },
      ];

      for (const period of dstPeriods) {
        if (date >= period.start && date <= period.end) {
          adjustment -= 60;
          break;
        }
      }
    }

    // Apply adjustment
    let totalMinutes = hour * 60 + minute + adjustment;
    
    // Handle negative time (previous day)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    // Handle overflow (next day) 
    if (totalMinutes >= 24 * 60) {
      totalMinutes -= 24 * 60;
    }

    return {
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
    };
  }

  private static createPillar(ganZhi: string, dayMaster: string): Pillar {
    const ganHan = ganZhi.charAt(0);
    const jiHan = ganZhi.charAt(1);
    const jijangganHan = this.getJijanggan(jiHan);
    const jijangganKor = jijangganHan.map(h => this.convertHanToKoreanGan(h));
    
    return {
      gan: this.convertHanToKoreanGan(ganHan),
      ji: this.convertHanToKoreanJi(jiHan),
      ganHan,
      jiHan,
      ganElement: this.getOhaeng(ganHan),
      jiElement: this.getOhaeng(jiHan),
      tenGodsGan: this.getSipsin(dayMaster, ganHan),
      tenGodsJi: this.getSipsin(dayMaster, jiHan),
      jijanggan: jijangganKor,
      jijangganTenGods: jijangganHan.map(char => this.getSipsin(dayMaster, char)),
    };
  }

  private static getOhaeng(han: string): string {
    const map: Record<string, string> = {
      // Gan
      '甲': 'wood', '乙': 'wood',
      '丙': 'fire', '丁': 'fire',
      '戊': 'earth', '己': 'earth',
      '庚': 'metal', '辛': 'metal',
      '壬': 'water', '癸': 'water',
      // Ji
      '寅': 'wood', '卯': 'wood',
      '巳': 'fire', '午': 'fire',
      '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
      '申': 'metal', '酉': 'metal',
      '亥': 'water', '子': 'water',
    };
    return map[han] || '';
  }

  private static convertHanToKoreanGan(han: string): string {
    const map: Record<string, string> = {
      '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
      '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
    };
    return map[han] || han;
  }

  private static convertHanToKoreanJi(han: string): string {
    const map: Record<string, string> = {
      '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
      '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
    };
    return map[han] || han;
  }
  private static getSipsin(dayMaster: string, target: string): string {
    if (dayMaster === target) return '비견'; // Same Gan

    const dmElement = this.getOhaeng(dayMaster);
    const targetElement = this.getOhaeng(target);
    const dmPolarity = this.getPolarity(dayMaster);
    const targetPolarity = this.getPolarity(target);

    const samePolarity = dmPolarity === targetPolarity;

    if (dmElement === targetElement) {
      return samePolarity ? '비견' : '겁재';
    }

    // Generating (Seng)
    if (this.isGenerating(dmElement, targetElement)) {
      // Day Master generates Target (Output)
      return samePolarity ? '식신' : '상관';
    }
    if (this.isGenerating(targetElement, dmElement)) {
      // Target generates Day Master (Resource)
      return samePolarity ? '편인' : '정인';
    }

    // Controlling (Geuk)
    if (this.isControlling(dmElement, targetElement)) {
      // Day Master controls Target (Wealth)
      return samePolarity ? '편재' : '정재';
    }
    if (this.isControlling(targetElement, dmElement)) {
      // Target controls Day Master (Power)
      return samePolarity ? '편관' : '정관';
    }

    return '';
  }

  private static getJijanggan(ji: string): string[] {
    const map: Record<string, string[]> = {
      '子': ['壬', '癸'],
      '丑': ['癸', '辛', '己'],
      '寅': ['戊', '丙', '甲'],
      '卯': ['甲', '乙'],
      '辰': ['乙', '癸', '戊'],
      '巳': ['戊', '庚', '丙'],
      '午': ['丙', '己', '丁'],
      '未': ['丁', '乙', '己'],
      '申': ['戊', '壬', '庚'],
      '酉': ['庚', '辛'],
      '戌': ['辛', '丁', '戊'],
      '亥': ['戊', '甲', '壬'],
    };
    return map[ji] || [];
  }

  private static getPolarity(han: string): 'yang' | 'yin' {
    const yangSet = new Set(['甲', '丙', '戊', '庚', '壬', '寅', '申', '巳', '亥', '辰', '戌']);
    return yangSet.has(han) ? 'yang' : 'yin';
  }

  private static isGenerating(source: string, target: string): boolean {
    const map: Record<string, string> = {
      'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood'
    };
    return map[source] === target;
  }

  private static isControlling(source: string, target: string): boolean {
    const map: Record<string, string> = {
      'wood': 'earth', 'earth': 'water', 'water': 'fire', 'fire': 'metal', 'metal': 'wood'
    };
    return map[source] === target;
  }

  // Daeun (Grand Fortune) calculations
  private static getDaeunDirection(yearGan: string, gender: 'male' | 'female'): 'forward' | 'backward' {
    const yangGans = new Set(['甲', '丙', '戊', '庚', '壬']);
    const isYangYear = yangGans.has(yearGan);
    
    // 양남음녀(陽男陰女): forward, 음남양녀(陰男陽女): backward
    if ((isYangYear && gender === 'male') || (!isYangYear && gender === 'female')) {
      return 'forward';
    } else {
      return 'backward';
    }
  }

  private static calculateDaeunStartAge(lunar: Lunar, direction: 'forward' | 'backward', birthSolar: Solar): number {
    // Get Jieqi (solar term) table from lunar calendar
    const jieqiTable = (lunar as any).getJieQiTable();
    
    // Jie (節) terms only (not Qi/氣 terms) - these determine monthly boundaries
    // Using simplified Chinese characters as returned by lunar-javascript
    const jieTerms = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
    
    let closestJieName = '';
    let closestJieDays = Infinity;
    
    // Find closest Jie term based on direction
    for (const [name, jieqiData] of Object.entries(jieqiTable)) {
      if (!jieTerms.includes(name)) continue;
      
      const jieqiInfo = jieqiData as any;
      const jieqiDate = jieqiInfo._p;
      
      // Create Solar object for this Jieqi
      const jieqiSolar = Solar.fromYmdHms(
        jieqiDate.year,
        jieqiDate.month,
        jieqiDate.day,
        jieqiDate.hour,
        jieqiDate.minute,
        jieqiDate.second
      );
      
      // Calculate day difference
      const birthDate = new Date(
        (birthSolar as any).getYear(),
        (birthSolar as any).getMonth() - 1,
        (birthSolar as any).getDay(),
        (birthSolar as any).getHour(),
        (birthSolar as any).getMinute()
      );
      
      const jieqiDateObj = new Date(
        jieqiDate.year,
        jieqiDate.month - 1,
        jieqiDate.day,
        jieqiDate.hour,
        jieqiDate.minute
      );
      
      const daysDiff = Math.ceil((jieqiDateObj.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // For forward direction: find next Jie (daysDiff > 0)
      // For backward direction: find previous Jie (daysDiff < 0)
      if (direction === 'forward') {
        if (daysDiff > 0 && daysDiff < closestJieDays) {
          closestJieDays = daysDiff;
          closestJieName = name;
        }
      } else {
        if (daysDiff < 0 && Math.abs(daysDiff) < closestJieDays) {
          closestJieDays = Math.abs(daysDiff);
          closestJieName = name;
        }
      }
    }
    
    // If no suitable Jie found in current year (e.g., birth in early January before first Jie)
    // Need to check previous year for backward direction or next year for forward direction
    if (closestJieDays === Infinity) {
      const prevYear = (birthSolar as any).getYear() - 1;
      const nextYear = (birthSolar as any).getYear() + 1;
      const checkYear = direction === 'backward' ? prevYear : nextYear;
      
      const checkSolar = Solar.fromYmdHms(checkYear, 1, 1, 0, 0, 0);
      const checkLunar = checkSolar.getLunar();
      const checkJieqiTable = (checkLunar as any).getJieQiTable();
      
      for (const [name, jieqiData] of Object.entries(checkJieqiTable)) {
        if (!jieTerms.includes(name)) continue;
        
        const jieqiInfo = jieqiData as any;
        const jieqiDate = jieqiInfo._p;
        
        const birthDate = new Date(
          (birthSolar as any).getYear(),
          (birthSolar as any).getMonth() - 1,
          (birthSolar as any).getDay(),
          (birthSolar as any).getHour(),
          (birthSolar as any).getMinute()
        );
        
        const jieqiDateObj = new Date(
          jieqiDate.year,
          jieqiDate.month - 1,
          jieqiDate.day,
          jieqiDate.hour,
          jieqiDate.minute
        );
        
        const daysDiff = Math.ceil((jieqiDateObj.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (direction === 'forward') {
          if (daysDiff > 0 && daysDiff < closestJieDays) {
            closestJieDays = daysDiff;
            closestJieName = name;
          }
        } else {
          if (daysDiff < 0 && Math.abs(daysDiff) < closestJieDays) {
            closestJieDays = Math.abs(daysDiff);
            closestJieName = name;
          }
        }
      }
    }
    
    // Calculate Daeun start age: 3 days = 1 year
    // Round to nearest integer (minimum 1 year)
    const daeunSu = Math.max(1, Math.round(closestJieDays / 3));
    
    return daeunSu;
  }

  private static generateDaeunSequence(monthGanZhi: string, direction: 'forward' | 'backward', startAge: number, dayMaster: string): DaeunPeriod[] {
    const gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const jis = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    const currentGan = monthGanZhi.charAt(0);
    const currentJi = monthGanZhi.charAt(1);
    
    let ganIndex = gans.indexOf(currentGan);
    let jiIndex = jis.indexOf(currentJi);
    
    const daeunPeriods: DaeunPeriod[] = [];
    const increment = direction === 'forward' ? 1 : -1;
    
    for (let i = 0; i < 8; i++) {
      ganIndex = (ganIndex + increment + gans.length) % gans.length;
      jiIndex = (jiIndex + increment + jis.length) % jis.length;
      
      const ganHan = gans[ganIndex];
      const jiHan = jis[jiIndex];
      const ganZhi = ganHan + jiHan;
      
      daeunPeriods.push({
        ganZhi,
        ganHan,
        jiHan,
        gan: this.convertHanToKoreanGan(ganHan),
        ji: this.convertHanToKoreanJi(jiHan),
        ganElement: this.getOhaeng(ganHan),
        jiElement: this.getOhaeng(jiHan),
        startAge: startAge + i * 10,
        endAge: startAge + i * 10 + 9, // 10-year period: start + 9 years
      });
    }
    
    return daeunPeriods;
  }

  // Ohaeng (Five Elements) analysis
  private static calculateOhaengDistribution(pillars: Pillar[]): {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  } {
    const distribution = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0
    };

    pillars.forEach(pillar => {
      // Count Gan element
      if (pillar.ganElement && pillar.ganElement !== 'unknown') {
        distribution[pillar.ganElement as keyof typeof distribution]++;
      }
      // Count Ji element
      if (pillar.jiElement && pillar.jiElement !== 'unknown') {
        distribution[pillar.jiElement as keyof typeof distribution]++;
      }
    });

    return distribution;
  }

  private static analyzeOhaeng(distribution: Record<string, number>): {
  elements: Array<{
    element: string;
    name: string;
    count: number;
    level: string;
    description: string;
  }>;
  excess: string[];
  deficient: string[];
  missing: string[];
  interpretation: string;
} {
  const OHAENG_DATA: Record<string, Record<string, string>> = {
    "목": {
      "결핍": "목 기운이 거의 드러나지 않아 활력과 동기가 약하게 나타날 수 있습니다. 새로운 것을 시작하거나 방향을 잡는 데 어려움을 느낄 수 있습니다.",
      "부족": "목 기운이 약하여 추진력과 결단력이 떨어지고, 아이디어나 시작 에너지가 부족하게 느껴질 수 있습니다.",
      "균형": "목 기운이 적당해 창의성과 성장 에너지가 살아 있으며, 유연하게 새로운 방향을 탐색하고 발전을 이끌어 갈 수 있습니다.",
      "강함": "목 기운이 강해 진취성·비전·창의성이 두드러지며, 사람들을 이끄는 힘이 있습니다. 단, 다소 조급하거나 산만해질 수 있습니다.",
      "과다": "목 기운이 지나치게 강해 충동적이고 안정감을 찾기 어렵고, 금·토가 약해지면서 재물·현실 기반이 약해질 수 있습니다."
    },
    "화": {
      "결핍": "화 기운이 거의 없어 열정이나 생동감이 부족해지고, 감정 표현이 차갑거나 동기부여가 잘 되지 않을 수 있습니다.",
      "부족": "화 기운이 약하여 피로감을 느끼기 쉽고, 활력·사교성·리더십 등이 부족하게 나타날 수 있습니다.",
      "균형": "화 기운이 적당하여 열정과 긍정성이 살아 있고, 주변을 밝게 하며 사람들을 이끄는 따뜻한 에너지가 나타납니다.",
      "강함": "화 기운이 강해 추진력과 리더십이 강하고 활력이 넘칩니다. 다만 감정 기복이나 조급함이 나타날 수 있습니다.",
      "과다": "화 기운이 지나치게 강해 충동적이고 성급하며, 과도한 열정으로 쉽게 지치거나 감정적으로 폭발할 수 있습니다."
    },
    "토": {
      "결핍": "토 기운이 거의 없어 안정감·현실감이 약해지고, 생활·재정 기반이 불안하게 느껴질 수 있습니다.",
      "부족": "토 기운이 부족하여 집중력이 떨어지고 걱정·불안이 많아지며, 삶의 기반이 흔들리는 듯한 느낌이 들 수 있습니다.",
      "균형": "토 기운이 적당하여 안정·인내·신뢰감을 바탕으로 현실적인 판단과 꾸준함이 살아 있습니다.",
      "강함": "토 기운이 강해 책임감·성실함이 두드러지며, 현실 감각이 뛰어나고, 고집·보수성·변화 둔감함이 나타날 수 있습니다.",
      "과다": "토 기운이 지나치게 강해 걱정·집착·과도한 책임감이 생기고, 변화에 대한 두려움으로 정체가 나타날 수 있습니다."
    },
    "금": {
      "결핍": "금 기운이 거의 없어 결단력·자기 확신이 부족하고, 타인의 평가나 분위기에 쉽게 흔들릴 수 있습니다.",
      "부족": "금 기운이 약해 자신감·의지·자기 통제력 등이 약하고, 우유부단함이나 불안이 나타날 수 있습니다.",
      "균형": "금 기운이 적당하여 규율·판단력·결단력이 건강하게 나타나고, 우아하고 명확한 커뮤니케이션이 가능합니다.",
      "강함": "금 기운이 강해 규율·용기·판단력이 뛰어나며 정확한 기준을 세울 수 있습니다. 하지만 완벽주의·경직이 동반될 수 있습니다.",
      "과다": "금 기운이 지나치게 강하면 냉정·비판·경직 성향이 두드러지고, 자신과 타인에게 잣대가 과하게 엄격해질 수 있습니다."
    },
    "수": {
      "결핍": "수 기운이 거의 없어 감정 표현이 메마르거나 사고가 경직될 수 있으며, 변화 적응력이 낮아질 수 있습니다.",
      "부족": "수 기운이 부족해 상상력·직관·융통성이 떨어지고, 변화나 상황 흐름을 따르기 어려울 수 있습니다.",
      "균형": "수 기운이 적당해 지혜·직관·감수성이 살아 있으며, 감정과 사고가 깊고 유연한 상태가 유지됩니다.",
      "강함": "수 기운이 강해 통찰력과 적응력이 뛰어나며 지혜로운 판단이 가능합니다. 단, 지나친 신중함·위축이 나타날 수 있습니다.",
      "과다": "수 기운이 지나치게 많아 불안·과도한 생각·감정적 압도감이 나타나고, 현실 실행력이 분산될 수 있습니다."
    }
  };

  const elementNames: Record<string, string> = {
    wood: '목',
    fire: '화',
    earth: '토',
    metal: '금',
    water: '수'
  };

  const elementNamesWithHanja: Record<string, string> = {
    wood: '목(木)',
    fire: '화(火)',
    earth: '토(土)',
    metal: '금(金)',
    water: '수(水)'
  };

  const getOhaengLevel = (count: number): string => {
    if (count === 0) return '결핍';
    if (count === 1) return '부족';
    if (count === 2) return '균형';
    if (count === 3) return '강함';
    return '과다'; // 4개 이상
  };

  // 각 요소별 상세 분석
  const elements = Object.entries(distribution).map(([element, count]) => {
    const koreanName = elementNames[element];
    const level = getOhaengLevel(count);
    const description = OHAENG_DATA[koreanName]?.[level] || '';

    return {
      element,
      name: elementNamesWithHanja[element],
      count,
      level,
      description
    };
  });

  const excess: string[] = [];
  const deficient: string[] = [];
  const missing: string[] = [];

  Object.entries(distribution).forEach(([element, count]) => {
    if (count >= 3) {
      excess.push(elementNamesWithHanja[element]);
    } else if (count === 1) {
      deficient.push(elementNamesWithHanja[element]);
    } else if (count === 0) {
      missing.push(elementNamesWithHanja[element]);
    }
  });

  // Generate interpretation
  let interpretation = '';
  
  if (excess.length > 0) {
    interpretation += `${excess.join(', ')} 기운이 강합니다. `;
  }
  
  if (missing.length > 0) {
    interpretation += `${missing.join(', ')} 기운이 부족합니다. `;
  }
  
  if (excess.length === 0 && missing.length === 0) {
    interpretation = '오행이 비교적 균형있게 분포되어 있습니다.';
  } else if (excess.length > 0 && missing.length > 0) {
    interpretation += '불균형을 보완하는 것이 중요합니다.';
  }

  return {
    elements,
    excess,
    deficient,
    missing,
    interpretation
  };
}
}
