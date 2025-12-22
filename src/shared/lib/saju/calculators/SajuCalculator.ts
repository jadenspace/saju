import { Lunar, Solar } from 'lunar-javascript';
import { DaeunPeriod, Pillar, SajuData, Seun } from '../../../../entities/saju/model/types';
import { JIJANGGAN_MAP, JIJANGGAN_WEIGHTS } from '../data/JijangganData';
import { calculateSipsin, getOhaeng, getPolarity } from './TenGod';
import { addMinutes, getKoreaHistoricalOffset, getLongitudeOffset } from './TimeCorrection';
import { getTwelveStage } from '../data/TwelveStages';
import { getTwelveSinsal } from '../data/TwelveSinsal';
import { getGongmang, isGongmang, checkHaegong } from '../data/Gongmang';

export class SajuCalculator {
  static calculate(year: number, month: number, day: number, hour: number, minute: number, gender: 'male' | 'female' = 'male', unknownTime: boolean = false, useTrueSolarTime: boolean = true, applyDST: boolean = true, midnightMode: 'early' | 'late' = 'late'): SajuData {
    // 1. Base Time (User Input)
    const baseTime = { year, month, day, hour, minute };

    // 2. Korea Timezone & DST Correction (Standardization)
    // This adjusts for historical timezone changes (127.5 vs 135) and DST periods
    // Returns the "Standard KST" time effectively, or more accurately, ensures we have a continuous timeline.
    // However, lunar-javascript expects the "Local Time" as input for the timeline it knows.
    // The previous implementation tried to adjust "Local Time" to "Standard Time".
    // But actually, we just need to get the "True Solar Time" for accurate Saju.

    // Let's perform corrections step-by-step using a helper that handles date rollovers.
    // Start with input time.
    let current = { ...baseTime };

    if (!unknownTime) {
      // 2a. Apply Korea Historical Timezone/DST Adjustments
      const timezoneOffset = getKoreaHistoricalOffset(current, applyDST);
      current = addMinutes(current, timezoneOffset);

      // 2b. Apply True Solar Time (Longitude) Correction
      // Default: Seoul (127.5E) -> -30 mins
      if (useTrueSolarTime) {
        const longitudeOffset = getLongitudeOffset(127.5);
        current = addMinutes(current, longitudeOffset);
      }
    }

    // Now 'current' represents the Effective Solar Time (True Solar Time).
    // This is the time we check against 23:00 / 00:00 boundaries.

    // 3. Create Solar Object
    // We use the adjusted date/time.
    const solar = Solar.fromYmdHms(current.year, current.month, current.day, unknownTime ? 12 : current.hour, unknownTime ? 0 : current.minute, 0);
    const lunar = solar.getLunar();

    // 4. Calculate Pillars
    let yearGanZhi = lunar.getYearInGanZhiByLiChun();
    let monthGanZhi = lunar.getMonthInGanZhiExact();
    let dayGanZhi = lunar.getDayInGanZhiExact();
    let timeGanZhi = unknownTime ? '??' : lunar.getTimeInGanZhi();

    // 5. Apply Yajasi (Midnight Mode) Logic
    // If we are in the "Evening Rat" period (23:00 <= hour < 24:00) of the calculated Solar Time.
    if (!unknownTime && current.hour === 23) {
      if (midnightMode === 'early') {
        // Mode: Apply Yajasi (야자시 적용)
        // Rule: 23:00 ~ 23:59 should belong to the Current Day (Day N).
        // However, standard lunar-javascript behavior switches to Day N+1 at 23:00.
        // We must rollback the Day Pillar to Day N.

        // Strategy: Get Day Pillar from 12:00 (Noon) of the same solar day.
        const noonSolar = Solar.fromYmdHms(current.year, current.month, current.day, 12, 0, 0);
        const noonLunar = noonSolar.getLunar();
        dayGanZhi = noonLunar.getDayInGanZhiExact();

        // Recalculate Time Pillar based on the forced Day Stem.
        // Evening Rat (23:00) of Day N has the same stem as Early Rat (00:00) of Day N.
        // NOTE: Standard Saju tables show Rat hour implies Next Day's Stem usually?
        // NO. "Apply Yajasi" theory specifically says:
        // "Using Day N's Stem to calculate Rat Hour Stem".
        // Rat Hour Formula:
        // Day甲/己 -> Hour甲子
        // Day乙/庚 -> Hour丙子
        // Day丙/辛 -> Hour戊子
        // Day丁/壬 -> Hour庚子
        // Day戊/癸 -> Hour壬子
        const dayStem = dayGanZhi.charAt(0);
        timeGanZhi = this.calculateRatHourGanZhi(dayStem);

      } else {
        // Mode: Not Apply Yajasi (Standard / 야자시 미적용)
        // Rule: 23:00 ~ 23:59 belongs to Next Day (Day N+1).
        // This makes 23:00 effective start of Day N+1.
        // lunar-javascript ALREADY does this by default (switching day at 23:00).
        // So we keep the values from `lunar` as is.
      }
    }

    const dayMaster = dayGanZhi.charAt(0);

    // Calculate Daeun
    const yearGan = yearGanZhi.charAt(0);
    const yearJiHan = yearGanZhi.charAt(1);
    const dayJiHan = dayGanZhi.charAt(1);
    const daeunDirection = this.getDaeunDirection(yearGan, gender);
    const daeunStartAge = this.calculateDaeunStartAge(lunar, daeunDirection, solar);
    const birthYear = baseTime.year;
    const daeun = this.generateDaeunSequence(monthGanZhi, daeunDirection, daeunStartAge, dayMaster, birthYear, yearJiHan, dayJiHan);

    // Calculate Ohaeng distribution
    const pillars = [
      this.createPillar(yearGanZhi, dayMaster),
      this.createPillar(monthGanZhi, dayMaster),
      this.createPillar(dayGanZhi, dayMaster),
      unknownTime ? null : this.createPillar(timeGanZhi, dayMaster)
    ].filter(p => p !== null) as Pillar[];

    const ohaengDistribution = this.calculateOhaengDistribution(pillars);
    const ohaengAnalysis = this.analyzeOhaeng(ohaengDistribution);

    // Calculate Gongmang (Empty/Void)
    // 모든 지지 수집 (해공 체크용)
    const allJi = [pillars[0].jiHan, pillars[1].jiHan, pillars[2].jiHan];
    if (!unknownTime) allJi.push(pillars[3].jiHan);

    // 년공망: 년주 기준으로 월지/일지/시지 확인 (년지 자체는 제외)
    const yearGongmangJi = getGongmang(yearGanZhi);
    const yearBasedAffected: Array<{ pillar: string; haegong?: { isHaegong: boolean; reason: string | null } }> = [];
    if (yearGongmangJi) {
      if (isGongmang(yearGanZhi, pillars[1].jiHan)) {
        yearBasedAffected.push({ pillar: '월주', haegong: checkHaegong(pillars[1].jiHan, allJi) });
      }
      if (isGongmang(yearGanZhi, pillars[2].jiHan)) {
        yearBasedAffected.push({ pillar: '일주', haegong: checkHaegong(pillars[2].jiHan, allJi) });
      }
      if (!unknownTime && isGongmang(yearGanZhi, pillars[3].jiHan)) {
        yearBasedAffected.push({ pillar: '시주', haegong: checkHaegong(pillars[3].jiHan, allJi) });
      }
    }

    // 일공망: 일주 기준으로 년지/월지/시지 확인 (일지 자체는 제외)
    const dayGongmangJi = getGongmang(dayGanZhi);
    const dayBasedAffected: Array<{ pillar: string; haegong?: { isHaegong: boolean; reason: string | null } }> = [];
    if (dayGongmangJi) {
      if (isGongmang(dayGanZhi, pillars[0].jiHan)) {
        dayBasedAffected.push({ pillar: '년주', haegong: checkHaegong(pillars[0].jiHan, allJi) });
      }
      if (isGongmang(dayGanZhi, pillars[1].jiHan)) {
        dayBasedAffected.push({ pillar: '월주', haegong: checkHaegong(pillars[1].jiHan, allJi) });
      }
      if (!unknownTime && isGongmang(dayGanZhi, pillars[3].jiHan)) {
        dayBasedAffected.push({ pillar: '시주', haegong: checkHaegong(pillars[3].jiHan, allJi) });
      }
    }

    // Calculate 12신살 Analysis
    const yearJi = pillars[0].jiHan;
    const dayJi = pillars[2].jiHan;
    const pillarNames = ['년주', '월주', '일주', '시주'];

    const yearBasedSinsal: Array<{ pillar: string; sinsal: string }> = [];
    const dayBasedSinsal: Array<{ pillar: string; sinsal: string }> = [];

    pillars.forEach((pillar, idx) => {
      // 년지 기준 12신살 (년주 자체도 포함)
      const yearSinsal = getTwelveSinsal(yearJi, pillar.jiHan);
      if (yearSinsal) {
        yearBasedSinsal.push({ pillar: pillarNames[idx], sinsal: yearSinsal });
      }
      // 일지 기준 12신살 (일주 자체도 포함)
      const daySinsal = getTwelveSinsal(dayJi, pillar.jiHan);
      if (daySinsal) {
        dayBasedSinsal.push({ pillar: pillarNames[idx], sinsal: daySinsal });
      }
    });

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
      gongmang: (yearGongmangJi || dayGongmangJi) ? {
        yearBased: {
          gongmangJi: yearGongmangJi || ['', ''],
          affectedPillars: yearBasedAffected,
        },
        dayBased: {
          gongmangJi: dayGongmangJi || ['', ''],
          affectedPillars: dayBasedAffected,
        },
      } : undefined,
      twelveSinsalAnalysis: {
        yearBased: yearBasedSinsal,
        dayBased: dayBasedSinsal,
      },
    };
  }


  private static calculateRatHourGanZhi(dayStem: string): string {
    const map: Record<string, string> = {
      '甲': '甲子', '己': '甲子',
      '乙': '丙子', '庚': '丙子',
      '丙': '戊子', '辛': '戊子',
      '丁': '庚子', '壬': '庚자',
      '戊': '壬子', '癸': '壬子'
    };
    return map[dayStem] || '??';
  }


  private static createPillar(ganZhi: string, dayMaster: string): Pillar {
    const ganHan = ganZhi.charAt(0);
    const jiHan = ganZhi.charAt(1);
    const jijangganHan = JIJANGGAN_MAP[jiHan] || [];
    const jijangganKor = jijangganHan.map(h => this.convertHanToKoreanGan(h));

    return {
      gan: this.convertHanToKoreanGan(ganHan),
      ji: this.convertHanToKoreanJi(jiHan),
      ganHan,
      jiHan,
      ganElement: getOhaeng(ganHan) || '',
      jiElement: getOhaeng(jiHan) || '',
      tenGodsGan: calculateSipsin(dayMaster, ganHan),
      tenGodsJi: calculateSipsin(dayMaster, jiHan),
      jijanggan: jijangganKor,
      jijangganTenGods: jijangganHan.map(char => calculateSipsin(dayMaster, char)),
      twelveStage: getTwelveStage(dayMaster, jiHan) || undefined,
    };
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
    const jieqiTable = (lunar as any).getJieQiTable();
    const jieTerms = ['立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪', '小寒'];
    // Normalize terminology (some libs use simplified/traditional)
    const jieTermsMap: Record<string, string> = {
      '立春': '立春', '惊蛰': '惊蛰', '清明': '清明', '立夏': '立夏', '芒종': '芒종', '小暑': '小暑',
      '立秋': '立秋', '白露': '白露', '寒露': '寒露', '立冬': '立冬', '大雪': '大雪', '小寒': '小寒'
    };

    let closestJieDays = Infinity;
    const birthTime = new Date((birthSolar as any).getYear(), (birthSolar as any).getMonth() - 1, (birthSolar as any).getDay(), (birthSolar as any).getHour(), (birthSolar as any).getMinute()).getTime();

    const findInTable = (table: any) => {
      for (const [name, jieqiData] of Object.entries(table)) {
        if (!jieTerms.includes(name)) continue;
        const jieqiDate = (jieqiData as any)._p;
        const jieqiTime = new Date(jieqiDate.year, jieqiDate.month - 1, jieqiDate.day, jieqiDate.hour, jieqiDate.minute).getTime();
        const diffDays = (jieqiTime - birthTime) / (1000 * 60 * 60 * 24);

        if (direction === 'forward') {
          if (diffDays > 0 && diffDays < closestJieDays) closestJieDays = diffDays;
        } else {
          if (diffDays < 0 && Math.abs(diffDays) < closestJieDays) closestJieDays = Math.abs(diffDays);
        }
      }
    };

    findInTable(jieqiTable);

    if (closestJieDays === Infinity) {
      const checkYear = direction === 'backward' ? (birthSolar as any).getYear() - 1 : (birthSolar as any).getYear() + 1;
      const checkSolar = Solar.fromYmdHms(checkYear, 1, 1, 0, 0, 0);
      findInTable((checkSolar.getLunar() as any).getJieQiTable());
    }

    // Official Formula: floor(abs(days) / 3)
    return Math.max(1, Math.floor(closestJieDays / 3));
  }

  private static generateDaeunSequence(monthGanZhi: string, direction: 'forward' | 'backward', startAge: number, dayMaster: string, birthYear: number, yearJi: string, dayJi: string): DaeunPeriod[] {
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

      // 12운성 계산 (일간 기준)
      const twelveStage = getTwelveStage(dayMaster, jiHan) || undefined;

      // 12신살 계산 (년지/일지 기준)
      const yearBasedSinsal = getTwelveSinsal(yearJi, jiHan);
      const dayBasedSinsal = getTwelveSinsal(dayJi, jiHan);

      daeunPeriods.push({
        ganZhi,
        ganHan,
        jiHan,
        gan: this.convertHanToKoreanGan(ganHan),
        ji: this.convertHanToKoreanJi(jiHan),
        ganElement: getOhaeng(ganHan) || '',
        jiElement: getOhaeng(jiHan) || '',
        startAge: startAge + i * 10,
        endAge: startAge + i * 10 + 9, // 10-year period: start + 9 years
        tenGodsGan: calculateSipsin(dayMaster, ganHan),
        tenGodsJi: calculateSipsin(dayMaster, jiHan),
        twelveStage,
        sinsal: (yearBasedSinsal || dayBasedSinsal) ? {
          yearBased: yearBasedSinsal || undefined,
          dayBased: dayBasedSinsal || undefined,
        } : undefined,
        // 한국 나이 기준: N세가 되는 해 = birthYear + N - 1
        seun: this.generateSeunSequence(birthYear + startAge - 1 + i * 10, dayMaster, yearJi, dayJi),
      });
    }

    return daeunPeriods;
  }

  private static generateSeunSequence(startYear: number, dayMaster: string, yearJi: string, dayJi: string): Seun[] {
    const seunSequence: Seun[] = [];

    for (let i = 0; i < 10; i++) {
      const year = startYear + i;

      // 정확한 입춘 날짜를 찾아 그 해의 간지를 계산 (기존 코드 패턴 유지)
      const yearLunar = Solar.fromYmdHms(year, 1, 1, 12, 0, 0).getLunar();
      const jieqiTable = (yearLunar as any).getJieQiTable();
      const ipchunData = jieqiTable['立春'];

      if (!ipchunData) {
        // Fallback or error handling if 입춘 is not found
        console.error(`Could not find Ipchun for year ${year}`);
        // If Ipchun not found, use March 1st as a last resort fallback,
        // although this case should ideally not happen for valid years.
        const solar = Solar.fromYmdHms(year, 3, 1, 12, 0, 0);
        const lunar = solar.getLunar();
        const ganZhi = lunar.getYearInGanZhiByLiChun();
        const ganHan = ganZhi.charAt(0);
        const jiHan = ganZhi.charAt(1);

        // 12운성 계산
        const twelveStage = getTwelveStage(dayMaster, jiHan) || undefined;
        // 12신살 계산
        const yearBasedSinsal = getTwelveSinsal(yearJi, jiHan);
        const dayBasedSinsal = getTwelveSinsal(dayJi, jiHan);

        seunSequence.push({
          year,
          ganZhi,
          ganHan,
          jiHan,
          gan: this.convertHanToKoreanGan(ganHan),
          ji: this.convertHanToKoreanJi(jiHan),
          ganElement: getOhaeng(ganHan) || '',
          jiElement: getOhaeng(jiHan) || '',
          tenGodsGan: calculateSipsin(dayMaster, ganHan),
          tenGodsJi: calculateSipsin(dayMaster, jiHan),
          twelveStage,
          sinsal: (yearBasedSinsal || dayBasedSinsal) ? {
            yearBased: yearBasedSinsal || undefined,
            dayBased: dayBasedSinsal || undefined,
          } : undefined,
        });
        continue;
      }

      // Access date parts using the internal _p property, consistent with calculateDaeunStartAge
      const ipchunDateParts = (ipchunData as any)._p;

      // 입춘 당일의 정오를 기준으로 Solar 객체 생성
      const solar = Solar.fromYmdHms(ipchunDateParts.year, ipchunDateParts.month, ipchunDateParts.day, 12, 0, 0);
      const lunar = solar.getLunar();
      const ganZhi = lunar.getYearInGanZhiByLiChun();

      const ganHan = ganZhi.charAt(0);
      const jiHan = ganZhi.charAt(1);

      // 12운성 계산 (일간 기준)
      const twelveStage = getTwelveStage(dayMaster, jiHan) || undefined;

      // 12신살 계산 (년지/일지 기준)
      const yearBasedSinsal = getTwelveSinsal(yearJi, jiHan);
      const dayBasedSinsal = getTwelveSinsal(dayJi, jiHan);

      seunSequence.push({
        year,
        ganZhi,
        ganHan,
        jiHan,
        gan: this.convertHanToKoreanGan(ganHan),
        ji: this.convertHanToKoreanJi(jiHan),
        ganElement: getOhaeng(ganHan) || '',
        jiElement: getOhaeng(jiHan) || '',
        tenGodsGan: calculateSipsin(dayMaster, ganHan),
        tenGodsJi: calculateSipsin(dayMaster, jiHan),
        twelveStage,
        sinsal: (yearBasedSinsal || dayBasedSinsal) ? {
          yearBased: yearBasedSinsal || undefined,
          dayBased: dayBasedSinsal || undefined,
        } : undefined,
      });
    }

    return seunSequence;
  }

  // Ohaeng (Five Elements) analysis
  private static calculateOhaengDistribution(pillars: Pillar[], options: { includeHiddenStems?: boolean } = {}): {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  } {
    const distribution = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

    pillars.forEach(pillar => {
      // 1. Gan/Ji (Surface characters)
      if (pillar.ganElement && pillar.ganElement !== 'unknown') {
        const key = pillar.ganElement as keyof typeof distribution;
        distribution[key] += 1;
      }
      if (pillar.jiElement && pillar.jiElement !== 'unknown') {
        const key = pillar.jiElement as keyof typeof distribution;
        distribution[key] += 1;
      }

      // 2. Hidden Stems (Jijanggan) factor if enabled
      if (options.includeHiddenStems) {
        const weights = JIJANGGAN_WEIGHTS[pillar.jiHan] || [];
        const hiddenGans = JIJANGGAN_MAP[pillar.jiHan] || [];
        hiddenGans.forEach((gan, idx) => {
          const element = getOhaeng(gan);
          if (element) {
            const weight = weights[idx] || 0;
            distribution[element as keyof typeof distribution] += weight;
          }
        });
      }
    });

    // Round values for display if they became decimals
    Object.keys(distribution).forEach(key => {
      const k = key as keyof typeof distribution;
      distribution[k] = Math.round(distribution[k] * 100) / 100;
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
      wood: '목', fire: '화', earth: '토', metal: '금', water: '수'
    };

    const elementNamesWithHanja: Record<string, string> = {
      wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)'
    };

    const getOhaengLevel = (count: number): string => {
      if (count === 0) return '결핍';
      if (count === 1) return '부족';
      if (count === 2) return '균형';
      if (count === 3) return '강함';
      return '과다';
    };

    const elements = Object.entries(distribution).map(([element, count]) => {
      const koreanName = elementNames[element];
      const level = getOhaengLevel(Math.floor(count)); // Use floor for level mapping if weights are used
      const description = OHAENG_DATA[koreanName]?.[level] || '';
      return { element, name: elementNamesWithHanja[element], count, level, description };
    });

    const excess: string[] = [];
    const deficient: string[] = [];
    const missing: string[] = [];

    Object.entries(distribution).forEach(([element, count]) => {
      if (count >= 3) excess.push(elementNamesWithHanja[element]);
      else if (count === 1) deficient.push(elementNamesWithHanja[element]);
      else if (count === 0) missing.push(elementNamesWithHanja[element]);
    });

    let interpretation = '';
    if (excess.length > 0) interpretation += `${excess.join(', ')} 기운이 강합니다. `;
    if (missing.length > 0) interpretation += `${missing.join(', ')} 기운이 부족합니다. `;
    if (excess.length === 0 && missing.length === 0) interpretation = '오행이 비교적 균형있게 분포되어 있습니다.';
    else if (excess.length > 0 && missing.length > 0) interpretation += '불균형을 보완하는 것이 중요합니다.';

    return { elements, excess, deficient, missing, interpretation };
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

  /**
   * 월운 계산 (년상기월법)
   * @param year 년도
   * @param dayMaster 일간 (십신 계산용)
   * @param yearJi 년지 (12신살 계산용)
   * @param dayJi 일지 (12신살 계산용)
   * @returns 12개월의 월운 배열 (절기 기준)
   */
  static calculateMonthlyFortune(year: number, dayMaster: string, yearJi?: string, dayJi?: string): Array<{
    month: number;
    monthName: string;
    solarMonth: string;
    ganZhi: string;
    gan: string;
    ji: string;
    ganHan: string;
    jiHan: string;
    ganElement: string;
    jiElement: string;
    tenGodsGan: string;
    tenGodsJi: string;
    twelveStage?: string;
    sinsal?: {
      yearBased?: string;
      dayBased?: string;
    };
  }> {
    // 년간에 따른 월간 시작 (년상기월법)
    // 갑기년: 병인월, 을경년: 무인월, 병신년: 경인월, 정임년: 임인월, 무계년: 갑인월
    const YEAR_GAN_TO_MONTH_START: Record<string, number> = {
      '甲': 2, '己': 2,  // 병(丙)부터 시작 (천간 인덱스 2)
      '乙': 4, '庚': 4,  // 무(戊)부터 시작 (천간 인덱스 4)
      '丙': 6, '辛': 6,  // 경(庚)부터 시작 (천간 인덱스 6)
      '丁': 8, '壬': 8,  // 임(壬)부터 시작 (천간 인덱스 8)
      '戊': 0, '癸': 0   // 갑(甲)부터 시작 (천간 인덱스 0)
    };

    const CHEONGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    // 월지: 인월(1월)부터 시작하여 12달
    const MONTH_JIJI = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    // 월 이름 (절기 기준)
    const MONTH_NAMES = ['인월', '묘월', '진월', '사월', '오월', '미월', '신월', '유월', '술월', '해월', '자월', '축월'];
    // 대략적인 양력 월 (절기 기준)
    const SOLAR_MONTHS = ['2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', '1월'];

    // 해당 년도의 년간 가져오기 (입춘 이후 기준)
    const solar = Solar.fromYmdHms(year, 3, 1, 12, 0, 0);
    const lunar = solar.getLunar();
    const yearGanZhi = lunar.getYearInGanZhiByLiChun();
    const yearGan = yearGanZhi.charAt(0);

    const monthStartIndex = YEAR_GAN_TO_MONTH_START[yearGan] || 0;
    const result: Array<{
      month: number;
      monthName: string;
      solarMonth: string;
      ganZhi: string;
      gan: string;
      ji: string;
      ganHan: string;
      jiHan: string;
      ganElement: string;
      jiElement: string;
      tenGodsGan: string;
      tenGodsJi: string;
      twelveStage?: string;
      sinsal?: {
        yearBased?: string;
        dayBased?: string;
      };
    }> = [];

    for (let i = 0; i < 12; i++) {
      const month = i + 1;
      const ganIndex = (monthStartIndex + i) % 10;
      const ganHan = CHEONGAN[ganIndex];
      const jiHan = MONTH_JIJI[i];

      // 12운성 계산 (일간 기준)
      const twelveStage = getTwelveStage(dayMaster, jiHan) || undefined;

      // 12신살 계산 (년지/일지 기준)
      const yearBasedSinsal = yearJi ? getTwelveSinsal(yearJi, jiHan) : null;
      const dayBasedSinsal = dayJi ? getTwelveSinsal(dayJi, jiHan) : null;

      result.push({
        month,
        monthName: MONTH_NAMES[i],
        solarMonth: SOLAR_MONTHS[i],
        ganZhi: ganHan + jiHan,
        gan: this.convertHanToKoreanGan(ganHan),
        ji: this.convertHanToKoreanJi(jiHan),
        ganHan,
        jiHan,
        ganElement: getOhaeng(ganHan) || '',
        jiElement: getOhaeng(jiHan) || '',
        tenGodsGan: calculateSipsin(dayMaster, ganHan),
        tenGodsJi: calculateSipsin(dayMaster, jiHan),
        twelveStage,
        sinsal: (yearBasedSinsal || dayBasedSinsal) ? {
          yearBased: yearBasedSinsal || undefined,
          dayBased: dayBasedSinsal || undefined,
        } : undefined,
      });
    }

    return result;
  }

  /**
   * 현재 절기 월 계산
   * @returns 현재 절기 월 (1=인월, 2=묘월, ... 12=축월)
   */
  static getCurrentJieqiMonth(): number {
    const now = new Date();
    const solar = Solar.fromYmdHms(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12, 0, 0);
    const lunar = solar.getLunar();
    const monthZhi = lunar.getMonthInGanZhiExact().charAt(1);

    const JIJI_TO_MONTH: Record<string, number> = {
      '寅': 1, '卯': 2, '辰': 3, '巳': 4, '午': 5, '未': 6,
      '申': 7, '酉': 8, '戌': 9, '亥': 10, '子': 11, '丑': 12
    };

    return JIJI_TO_MONTH[monthZhi] || 1;
  }
}
