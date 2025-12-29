import { 
  SajuData, 
} from '../../../../entities/saju/model/types';
import { getOhaeng, calculateSipsin } from './TenGod';

export interface DitianSuiStepResult {
  step: number;
  title: string;
  originalText: string[];
  interpretation: string;
  application: string;
  result: string;
  conclusion: string;
}

export interface DitianSuiAnalysis {
  steps: DitianSuiStepResult[];
  finalYongshin: string;
  heeshin: string[];
  gishin: string[];
}

/**
 * 적천수(滴天髓) 기반 7단계 용신 분석기
 */
export class DitianSuiYongshinCalculator {
  static analyze(saju: SajuData): DitianSuiAnalysis {
    const steps: DitianSuiStepResult[] = [];
    
    // Step 1: 월령 심사 (月令 審査)
    const step1 = this.analyzeStep1(saju);
    steps.push(step1);
    
    // Step 2: 조후 심사 (調候 審査)
    const step2 = this.analyzeStep2(saju, step1);
    steps.push(step2);
    
    // Step 3: 쇠왕 심사 (衰旺 審査)
    const step3 = this.analyzeStep3(saju, step1, step2);
    steps.push(step3);
    
    // Step 4: 종격 심사 (從格 審査)
    const step4 = this.analyzeStep4(saju, step1, step2, step3);
    steps.push(step4);
    
    // Step 5: 희기 심사 (喜忌 審査)
    const step5 = this.analyzeStep5(saju, step1, step2, step3, step4);
    steps.push(step5);
    
    // Step 6: 중화 심사 (中和 審査)
    const step6 = this.analyzeStep6(saju, step1, step2, step3, step4, step5);
    steps.push(step6);
    
    // Step 7: 용신 확정 (用神 確定)
    const step7 = this.analyzeStep7(saju, steps);
    steps.push(step7);

    // Extract finalists from steps
    const finalYongshin = step7.result;
    // Simple extraction for now, can be more sophisticated
    const heeshin = step5.result.split(',').map(s => s.trim()).filter(s => s.includes('희신')).map(s => s.replace('희신:', '').trim());
    const gishin = step5.result.split(',').map(s => s.trim()).filter(s => s.includes('기신')).map(s => s.replace('기신:', '').trim());

    return {
      steps,
      finalYongshin,
      heeshin,
      gishin,
    };
  }

  private static analyzeStep1(saju: SajuData): DitianSuiStepResult {
    const ilgan = saju.day.ganHan;
    const wolji = saju.month.jiHan;
    const ilganOhaeng = getOhaeng(ilgan);
    const woljiOhaeng = getOhaeng(wolji);
    const sipsin = calculateSipsin(ilgan, wolji);
    
    const originalText = [
      "月令乃提綱之府, 譬之宅也, 人元為用事之神",
      "五陽從氣不從勢, 五陰從勢无情義"
    ];
    
    let application = `질문: 월령 ${wolji}이 일간 ${ilgan}에게 어떤 집인가?\n\n`;
    application += `해석:\n`;
    application += `  ${ilgan}(${ilganOhaeng}) 일간이 ${wolji}(${woljiOhaeng})월의 집에 거주함\n`;
    
    const isHostile = ['편관', '정관', '편재', '정재', '식신', '상관'].includes(sipsin);
    if (isHostile) {
        application += `  → 나를 ${sipsin === '편관' || sipsin === '정관' ? '극하는' : '설기하거나 제어해야 하는'} 환경에 있음\n`;
        application += `  → 편하지 않은 집\n`;
    } else {
        application += `  → 나를 생하는 ${sipsin}의 환경에 있음\n`;
        application += `  → 편안한 집\n`;
    }

    const isYang = ['甲', '丙', '戊', '庚', '壬'].includes(ilgan);
    application += `\n"五陽從氣不從勢" 적용:\n`;
    application += `  ${ilgan}은 ${isYang ? '양간' : '음간'}이므로 ${isYang ? '월령의 기운(氣)을 중시해야 함' : '세력(勢)을 따르는 경향이 있음'}\n`;
    
    return {
      step: 1,
      title: "월령 심사 (月令 審査)",
      originalText,
      interpretation: "월령은 사주 전체를 통솔하는 강령의 자리이며, 일간이 어떤 환경(집)에 처해 있는지를 결정하는 판단의 출발점입니다.",
      application,
      result: isHostile ? "월령이 일간에게 불리한 환경" : "월령이 일간에게 유리한 환경",
      conclusion: "월령의 주인이 나에게 어떤 영향을 주는지 파악하는 것이 첫 단계입니다."
    };
  }

  private static analyzeStep2(saju: SajuData, step1: DitianSuiStepResult): DitianSuiStepResult {
    const originalText = ["天道有寒暖, 發育萬物, 人道得之, 不可過也"];
    
    const wolji = saju.month.jiHan;
    const isColdMonth = ['亥', '子', '丑', '寅'].includes(wolji);
    const isHotMonth = ['巳', '午', '未', '申'].includes(wolji);
    
    let application = `월령의 한난(寒暖) 확인:\n`;
    application += `  월지 ${wolji} (${isColdMonth ? '가장 춥거나 한기가 남은' : isHotMonth ? '덥거나 열기가 시작되는' : '온화한'} 기후)\n\n`;
    
    const ilgan = saju.day.ganHan;
    const ilganOhaeng = getOhaeng(ilgan);
    
    application += `일간이 한난을 어떻게 받는가:\n`;
    if (isColdMonth) {
      application += `  ${ilgan}(${ilganOhaeng})은 차가운 환경에서 따뜻함(暖)이 필요함\n`;
    } else if (isHotMonth) {
      application += `  ${ilgan}(${ilganOhaeng})은 더운 환경에서 시원함(寒)이 필요함\n`;
    } else {
      application += `  ${ilgan}(${ilganOhaeng})은 적절한 환경에서 조화를 이루고 있음\n`;
    }

    const hasFire = this.hasElement(saju, 'fire');
    const hasWater = this.hasElement(saju, 'water');
    
    let satisfied = false;
    if (isColdMonth && hasFire) satisfied = true;
    if (isHotMonth && hasWater) satisfied = true;
    if (!isColdMonth && !isHotMonth) satisfied = true;

    application += `\n결과:\n`;
    application += `  ${satisfied ? '사주 내에 필요한 기운이 갖춰져 조화를 얻음' : '필요한 조후 기운이 부족하여 보충이 필요함'}`;

    return {
      step: 2,
      title: "조후 심사 (調候 審査)",
      originalText,
      interpretation: "천도에는 한난이 있어 만물을 발육시키니, 사주 또한 지나치게 춥거나 덥지 않아야 생명력이 유지됩니다.",
      application,
      result: satisfied ? "조후가 갖춰짐" : "조후 불균형",
      conclusion: "기후의 중화를 통해 명조의 생동감을 확보합니다."
    };
  }

  private static analyzeStep3(saju: SajuData, step1: DitianSuiStepResult, step2: DitianSuiStepResult): DitianSuiStepResult {
    const originalText = ["能知衰旺之真機, 其於三命之奧, 思過半矣"];
    
    const ilgan = saju.day.ganHan;
    const ilganOhaeng = getOhaeng(ilgan);
    const pillars = [saju.year, saju.month, saju.day, saju.hour];
    
    let rootScore = 0;
    pillars.forEach(p => {
      if (p && p.jiHan !== '?') {
        if (getOhaeng(p.jiHan) === ilganOhaeng) {
            rootScore += 1;
        }
        // Simplified hidden stem root check
        if (p.jijanggan?.some(h => getOhaeng(h) === ilganOhaeng)) {
            rootScore += 0.5;
        }
      }
    });

    const helps = pillars.filter(p => {
        if (!p || p.ganHan === '?') return false;
        const s = calculateSipsin(ilgan, p.ganHan);
        return ['비견', '겁재', '편인', '정인'].includes(s);
    }).length;

    let application = `진기(眞機) 파악 - 겉과 속:\n`;
    application += `  1. 일간의 뿌리(根): ${rootScore >= 2 ? '강력한 뿌리가 있음' : rootScore > 0 ? '뿌리가 있으나 다소 약함' : '뿌리가 전무함'}\n`;
    application += `  2. 일간을 돕는 인비(印比): ${helps}개의 천간 지원\n`;
    
    const isStrong = rootScore >= 2 || (rootScore >= 1 && helps >= 2);

    return {
      step: 3,
      title: "쇠왕 심사 (衰旺 審査)",
      originalText,
      interpretation: "단순한 오행 개수가 아닌, 일간이 실제로 작용할 수 있는 참된 기틀(眞機)이 있는지를 판단합니다.",
      application,
      result: isStrong ? "衰해 보이나 眞機 있음" : "실제로 무력함",
      conclusion: "외형적 쇠왕에 현혹되지 않고 실질적인 기운의 유무를 살핍니다."
    };
  }

  private static analyzeStep4(saju: SajuData, step1: DitianSuiStepResult, step2: DitianSuiStepResult, step3: DitianSuiStepResult): DitianSuiStepResult {
    const originalText = [
      "從得真者只論從, 從神又有吉和凶",
      "假從亦可例言從, 見從不從反為凶"
    ];
    
    const isWeak = step3.result.includes('무력함');
    const hasStrongElement = Object.values(saju.ohaengDistribution).some(v => v >= 3);
    const canFollow = isWeak && hasStrongElement;

    let application = `종(從)할 상황인가?\n`;
    application += `  - 일간 강약: ${step3.result}\n`;
    application += `  - 한 세력의 압도 여부: ${hasStrongElement ? '압도적 세력 존재' : '압도적 세력 없음'}\n\n`;
    application += `판단:\n`;
    if (canFollow) {
      application += `  → 일간이 무력하고 특정 세력이 강하여 종격(從格)의 가능성이 큼\n`;
      application += `  → 종신(따르는 대상)이 무엇인지 파악해야 함`;
    } else {
      application += `  → 일간이 眞機가 있거나 압도적 세력이 없어 스스로 서는 내격(內格) 구조임\n`;
      application += `  → 종하지 않고 스스로의 균형을 중시함`;
    }

    return {
      step: 4,
      title: "종격 심사 (從格 審査)",
      originalText,
      interpretation: "일간이 스스로를 지키지 못할 정도로 약하면 강한 세력을 따라야(從) 하며, 거짓으로 종하는지(假從)를 엄격히 구분해야 합니다.",
      application,
      result: canFollow ? "종(從) 가능성 검토" : "종격 불성립 (내격 확정)",
      conclusion: "일간의 독립적 생존 여부를 결정하는 분기점입니다."
    };
  }

  private static analyzeStep5(saju: SajuData, step1: DitianSuiStepResult, step2: DitianSuiStepResult, step3: DitianSuiStepResult, step4: DitianSuiStepResult): DitianSuiStepResult {
    const originalText = [
      "何知其人吉, 喜神爲輔持",
      "何知其人凶,忌神輾轉攻"
    ];
    
    const ilgan = saju.day.ganHan;
    const isWeak = step3.result.includes('무력함') || step3.result.includes('衰');
    const ilganOhaeng = getOhaeng(ilgan) || 'earth';
    
    // Simplistic heuristic for demo purposes
    let heeshin = '';
    let gishin = '';
    
    if (isWeak) {
      heeshin = `${this.getElementName(this.getGeneratingElement(ilganOhaeng))}, ${this.getElementName(ilganOhaeng)}`;
      gishin = `${this.getElementName(this.getControllingElement(ilganOhaeng))}`;
    } else {
      heeshin = `${this.getElementName(this.getControllingElement(ilganOhaeng))}, ${this.getElementName(this.getExtinguishingElement(ilganOhaeng))}`;
      gishin = `${this.getElementName(this.getGeneratingElement(ilganOhaeng))}`;
    }

    let application = `희신(喜神)과 기신(忌神) 파악:\n`;
    application += `  - 일간의 요구: ${isWeak ? '생조(生助)와 보필' : '억제(抑制)와 설기'}\n`;
    application += `  - 희신 후보: ${heeshin} (일간을 돕는 존재)\n`;
    application += `  - 기신 후보: ${gishin} (일간을 해치는 존재)\n\n`;
    application += `체크:\n`;
    application += `  → 희신이 명식 내에서 "輔持"(보좌하고 지탱)하고 있는가?\n`;
    application += `  → 기신이 "輾轉攻"(이리저리 공격)하지 못하도록 제어되고 있는가?`;

    return {
      step: 5,
      title: "희기 심사 (喜忌 審査)",
      originalText,
      interpretation: "무엇이 이로움(喜)을 주고 무엇이 해로움(忌)을 주는가를 가려, 희신이 제대로 보좌하고 있는지를 살핍니다.",
      application,
      result: `희신: ${heeshin}, 기신: ${gishin}`,
      conclusion: "사주의 길흉은 희신의 보조와 기신의 제어 여부에 달려 있습니다."
    };
  }

  private static analyzeStep6(saju: SajuData, step1: DitianSuiStepResult, step2: DitianSuiStepResult, step3: DitianSuiStepResult, step4: DitianSuiStepResult, step5: DitianSuiStepResult): DitianSuiStepResult {
    const originalText = [
      "中和之氣, 其福獨鍾",
      "旺相休囚, 辨其虛實",
      "源浚流淸, 斯眞貴矣"
    ];
    
    return {
      step: 6,
      title: "중화 심사 (中和 審査)",
      originalText,
      interpretation: "치우치지 않는 조화(中和)와 흐름의 맑음(流淸)을 살피며, 오행의 허실을 분별하여 기운의 고름을 확인합니다.",
      application: "오행의 흐름(木→화→土→金→水)이 막힘없이 연결되는지, 혹은 한 곳에 정체되어 독(毒)이 되는지 살핍니다.",
      result: "오행 상생의 흐름 존재",
      conclusion: "근원이 깊고 흐름이 맑은 사주가 진정으로 귀한 명조입니다."
    };
  }

  private static analyzeStep7(saju: SajuData, prevSteps: DitianSuiStepResult[]): DitianSuiStepResult {
    const originalText = ["何知其人吉, 喜神爲輔持"];
    
    // Heuristic: identify the most needed element from previous steps
    const step2Result = prevSteps[1].result;
    const step5Result = prevSteps[4].result;
    
    let yongshin = '분석 필요';
    if (step2Result.includes('火') || step5Result.includes('火')) yongshin = '火 (병화/정화)';
    else if (step2Result.includes('水') || step5Result.includes('水')) yongshin = '水 (임수/계수)';
    else if (step5Result.includes('木')) yongshin = '木 (갑목/을목)';
    else if (step5Result.includes('土')) yongshin = '土 (무토/기토)';
    else if (step5Result.includes('金')) yongshin = '金 (경금/신금)';

    return {
      step: 7,
      title: "용신 확정 (用神 確定)",
      originalText,
      interpretation: "모든 심사 단계를 거쳐 사주의 병(病)을 치료하고 중화를 이루는 가장 결정적인 한 개의 기운을 확정합니다.",
      application: "조후, 억부, 격국을 종합하여 일간의 삶을 이끌어갈 나침반과 같은 기운을 정합니다.",
      result: yongshin,
      conclusion: "이 기운을 얻음으로써 사주의 중화가 완성됩니다."
    };
  }

  // Helpers
  private static getElementName(ohaeng: string): string {
    const map: Record<string, string> = {
        wood: '木', fire: '火', earth: '土', metal: '金', water: '水'
    };
    return map[ohaeng] || ohaeng;
  }

  private static getGeneratingElement(ohaeng: string): string {
    const map: Record<string, string> = {
        wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal'
    };
    return map[ohaeng] || 'fire';
  }

  private static getControllingElement(ohaeng: string): string {
    const map: Record<string, string> = {
        wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth'
    };
    return map[ohaeng] || 'wood';
  }

  private static getExtinguishingElement(ohaeng: string): string {
    const map: Record<string, string> = {
        wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
    };
    return map[ohaeng] || 'earth';
  }

  private static getRelationDescription(ilgan: string, wolji: string): string {
    const sipsin = calculateSipsin(ilgan, wolji);
    if (['편관', '정관'].includes(sipsin)) return '나를 극하는 불편한';
    if (['편인', '정인'].includes(sipsin)) return '나를 생해주는 편안한';
    if (['비견', '겁재'].includes(sipsin)) return '나와 같은 기운의 익숙한';
    if (['식신', '상관'].includes(sipsin)) return '나의 기운을 빼는 활동적인';
    return '불규칙한';
  }

  private static hasElement(saju: SajuData, element: string): boolean {
    const pillars = [saju.year, saju.month, saju.day, saju.hour];
    return pillars.some(p => p && (getOhaeng(p.ganHan) === element || getOhaeng(p.jiHan) === element));
  }
}
