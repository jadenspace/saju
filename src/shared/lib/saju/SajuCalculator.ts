import { Lunar, Solar } from 'lunar-javascript';
import { DaeunPeriod, Pillar, SajuData } from '../../../entities/saju/model/types';

export class SajuCalculator {
  static calculate(year: number, month: number, day: number, hour: number, minute: number, gender: 'male' | 'female' = 'male', unknownTime: boolean = false): SajuData {
    // Apply Korea timezone correction
    const correctedTime = this.applyKoreaTimezoneCorrection(year, month, day, hour, minute);
    
    const solar = Solar.fromYmdHms(year, month, day, unknownTime ? 12 : correctedTime.hour, unknownTime ? 0 : correctedTime.minute, 0);
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
      daeun,
      daeunDirection,
      ohaengDistribution,
      ohaengAnalysis,
    };
  }

  // Apply Korea timezone and DST corrections
  private static applyKoreaTimezoneCorrection(year: number, month: number, day: number, hour: number, minute: number): { hour: number; minute: number } {
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

    // Daylight Saving Time periods (subtract 60 minutes)
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
    excess: string[];
    deficient: string[];
    missing: string[];
    interpretation: string;
  } {
    const elementNames: Record<string, string> = {
      wood: '목(木)',
      fire: '화(火)',
      earth: '토(土)',
      metal: '금(金)',
      water: '수(水)'
    };

    const excess: string[] = [];
    const deficient: string[] = [];
    const missing: string[] = [];

    Object.entries(distribution).forEach(([element, count]) => {
      if (count >= 3) {
        excess.push(elementNames[element]);
      } else if (count === 1) {
        deficient.push(elementNames[element]);
      } else if (count === 0) {
        missing.push(elementNames[element]);
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
      excess,
      deficient,
      missing,
      interpretation
    };
  }
}
