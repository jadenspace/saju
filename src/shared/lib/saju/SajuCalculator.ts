import { Solar } from 'lunar-javascript';
import { Pillar, SajuData } from '../../../entities/saju/model/types';

export class SajuCalculator {
  static calculate(year: number, month: number, day: number, hour: number, minute: number, gender: 'male' | 'female' = 'male', unknownTime: boolean = false): SajuData {
    const solar = Solar.fromYmdHms(year, month, day, unknownTime ? 12 : hour, unknownTime ? 0 : minute, 0);
    const lunar = solar.getLunar();

    // For Saju, we must use the Solar Terms (Jeolgi) based methods.
    const yearGanZhi = lunar.getYearInGanZhiByLiChun();
    const monthGanZhi = lunar.getMonthInGanZhiExact();
    const dayGanZhi = lunar.getDayInGanZhiExact();
    const dayMaster = dayGanZhi.charAt(0);
    const timeGanZhi = unknownTime ? '??' : lunar.getTimeInGanZhi();

    return {
      year: this.createPillar(yearGanZhi, dayMaster),
      month: this.createPillar(monthGanZhi, dayMaster),
      day: this.createPillar(dayGanZhi, dayMaster),
      hour: unknownTime ? { gan: '?', ji: '?', ganHan: '?', jiHan: '?', ganElement: 'unknown', jiElement: 'unknown' } : this.createPillar(timeGanZhi, dayMaster),
      birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      birthTime: unknownTime ? '시간 모름' : `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      gender,
      solar: true,
      unknownTime,
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
}
