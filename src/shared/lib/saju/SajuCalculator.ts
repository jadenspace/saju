import { Solar, Lunar } from 'lunar-javascript';
import { SajuData, Pillar } from '../../../entities/saju/model/types';

export class SajuCalculator {
  static calculate(year: number, month: number, day: number, hour: number, minute: number, gender: 'male' | 'female' = 'male', unknownTime: boolean = false): SajuData {
    const solar = Solar.fromYmdHms(year, month, day, unknownTime ? 12 : hour, unknownTime ? 0 : minute, 0);
    const lunar = solar.getLunar();

    // For Saju, we must use the Solar Terms (Jeolgi) based methods.
    const yearGanZhi = lunar.getYearInGanZhiByLiChun();
    const monthGanZhi = lunar.getMonthInGanZhiExact();
    const dayGanZhi = lunar.getDayInGanZhiExact();
    const timeGanZhi = unknownTime ? '??' : lunar.getTimeInGanZhi();

    return {
      year: this.createPillar(yearGanZhi),
      month: this.createPillar(monthGanZhi),
      day: this.createPillar(dayGanZhi),
      hour: unknownTime ? { gan: '?', ji: '?', ganHan: '?', jiHan: '?', ganElement: 'unknown', jiElement: 'unknown' } : this.createPillar(timeGanZhi),
      birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      birthTime: unknownTime ? '시간 모름' : `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      gender,
      solar: true,
      unknownTime,
    };
  }

  private static createPillar(ganZhi: string): Pillar {
    const ganHan = ganZhi.charAt(0);
    const jiHan = ganZhi.charAt(1);
    
    return {
      gan: this.convertHanToKoreanGan(ganHan),
      ji: this.convertHanToKoreanJi(jiHan),
      ganHan,
      jiHan,
      ganElement: this.getOhaeng(ganHan),
      jiElement: this.getOhaeng(jiHan),
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
}
