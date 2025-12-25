import { SajuData, MonthlyFortune } from '../../../../entities/saju/model/types';
import { SajuCalculator } from './SajuCalculator';
import { getMonthlyOneLiner } from './templates/FreeOneLiners';
import { SeunFortuneCalculator } from './SeunFortuneCalculator';
import { Element } from './TenGod';

export class MonthlyFortuneCalculator {
  static calculateMonthlyFortunes(year: number, sajuData: SajuData): MonthlyFortune[] {
    const dayMaster = sajuData.day.ganHan;
    const yearJi = sajuData.year.jiHan;
    const dayJi = sajuData.day.jiHan;
    
    // 1. Get base monthly data from SajuCalculator
    const baseMonthlyData = SajuCalculator.calculateMonthlyFortune(year, dayMaster, yearJi, dayJi);
    
    const yongshin = sajuData.yongshin;
    const yongshinElement = yongshin ? this.koreanToElement(yongshin.primary) : null;

    // 2. Map and calculate scores for each month
    return baseMonthlyData.map((data) => {
      let score = 3; // 기본 3점 (1-5 척도)
      
      // 용신 오행이면 가점
      if (yongshinElement && (data.ganElement === yongshinElement || data.jiElement === yongshinElement)) {
        score += 1;
      }
      
      // 원국 지지와의 관계 분석 (SeunFortuneCalculator 재활용)
      const relToDay = SeunFortuneCalculator.analyzeJiRelationship(data.jiHan, dayJi);
      if (relToDay.type === '합' || relToDay.type === '반합') score += 1;
      if (relToDay.type === '충' || relToDay.type === '형') score -= 1;

      // 점수 보정 (1-5 범위 유지)
      score = Math.min(5, Math.max(1, score));
      
      const { theme, oneLiner } = getMonthlyOneLiner(score);
      
      return {
        month: data.month,
        monthName: data.monthName,
        solarMonth: data.solarMonth,
        ganZhi: data.ganZhi,
        ganHan: data.ganHan,
        jiHan: data.jiHan,
        score,
        theme,
        oneLiner,
      };
    });
  }

  private static koreanToElement(kor: string): Element {
    const map: Record<string, Element> = { '목(木)': 'wood', '화(火)': 'fire', '토(土)': 'earth', '금(金)': 'metal', '수(水)': 'water' };
    return map[kor] || 'wood';
  }
}

