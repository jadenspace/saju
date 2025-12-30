import { SajuData, Seun, FortuneCategory, NewYearFortune, TotalScoreEvidence } from '../../../../entities/saju/model/types';
import { SeunFortuneCalculator } from './SeunFortuneCalculator';
import { getDetailedOneLiner, getYearOneLiner } from './templates/FreeOneLiners';
import { getOhaeng, Element, calculateSipsin } from './TenGod';
import { MonthlyFortuneCalculator } from './MonthlyFortuneCalculator';
import { KeyMonthCalculator } from './KeyMonthCalculator';
import { LuckyInfoCalculator } from './LuckyInfoCalculator';

export class FortuneScoreCalculator {
  static calculateNewYearFortune(year: number, sajuData: SajuData): NewYearFortune {
    // 2026년 병오년 (丙午)
    const seun: Seun = {
      year: 2026,
      ganZhi: '丙午',
      gan: '병',
      ji: '오',
      ganHan: '丙',
      jiHan: '午',
      ganElement: 'fire',
      jiElement: 'fire',
      tenGodsGan: calculateSipsin(sajuData.day.ganHan, '丙'),
      tenGodsJi: calculateSipsin(sajuData.day.ganHan, '午'),
    };

    const jiRelationships = SeunFortuneCalculator.analyzeSeun(seun, sajuData);
    const yongshin = sajuData.yongshin;

    const total = this.calculateTotalFortune(seun, sajuData, jiRelationships, yongshin);
    const career = this.calculateCareerFortune(seun, sajuData, jiRelationships, yongshin);
    const love = this.calculateLoveFortune(seun, sajuData, jiRelationships, yongshin);
    const wealth = this.calculateWealthFortune(seun, sajuData, jiRelationships, yongshin);
    const health = this.calculateHealthFortune(seun, sajuData, jiRelationships, yongshin);
    const monthly = MonthlyFortuneCalculator.calculateMonthlyFortunes(seun.year, sajuData);
    const keyMonths = KeyMonthCalculator.calculateKeyMonths(seun.year, sajuData);
    const luckyInfo = LuckyInfoCalculator.calculateLuckyInfo(sajuData);

    // 총운 점수 계산 근거 생성
    const totalScoreEvidence = this.buildTotalScoreEvidence(seun, sajuData, jiRelationships, yongshin, total.score);

    return {
      year: seun.year,
      ganZhi: seun.ganZhi,
      totalScore: total.score,
      totalOneLiner: getYearOneLiner(total.score),
      categories: {
        total,
        career,
        love,
        wealth,
        health,
      },
      monthly,
      keyMonths,
      luckyInfo,
      totalScoreEvidence,
    };
  }

  private static calculateTotalFortune(seun: Seun, saju: SajuData, jiRel: any, yongshin: any): FortuneCategory {
    let point = 3; // 기본 3점 (1-5 척도)

    // 1. 세운 십신의 성격 판단
    const positiveGods = ['정관', '정인', '정재', '식신'];
    const negativeGods = ['편관', '겁재', '상관'];

    if (seun.tenGodsGan && positiveGods.includes(seun.tenGodsGan)) {
      point += 1;
    } else if (seun.tenGodsGan && negativeGods.includes(seun.tenGodsGan)) {
      point -= 1;
    }

    // 2. 용신 충족도 (세운 오행이 용신과 같은 오행인가?)
    if (yongshin) {
      const yongshinElement = this.koreanToElement(yongshin.primary);

      // 세운 천간/지지가 용신과 같은 오행이면 긍정
      if (seun.ganElement === yongshinElement || seun.jiElement === yongshinElement) {
        point += 1.5;
      }

      // 세운이 용신을 극하면 부정
      if (this.isControlling(seun.ganElement as Element, yongshinElement as Element)) {
        point -= 1;
      }
    }

    // 3. 형충회합 작용
    // 긍정: 합(合) 관계
    if (jiRel.year?.type === '합' || jiRel.month?.type === '합' || jiRel.day?.type === '합' || jiRel.hour?.type === '합') {
      point += 0.5;
    }
    if (jiRel.year?.type === '반합' || jiRel.month?.type === '반합' || jiRel.day?.type === '반합' || jiRel.hour?.type === '반합') {
      point += 0.5;
    }

    // 부정: 충(沖), 형(刑) 관계
    if (jiRel.year?.type === '충' || jiRel.month?.type === '충' || jiRel.day?.type === '충' || jiRel.hour?.type === '충') {
      point -= 1;
    }
    if (jiRel.year?.type === '형' || jiRel.month?.type === '형' || jiRel.day?.type === '형' || jiRel.hour?.type === '형') {
      point -= 0.5;
    }

    const score = Math.min(100, Math.max(20, Math.round(point * 20)));

    return {
      score,
      summary: score >= 80 ? '만사형통의 해' : score >= 60 ? '안정적인 성장의 해' : '신중한 처신이 필요한 해',
      pros: [
        score >= 80 ? '전반적으로 에너지의 흐름이 긍정적이고 좋은 기회가 많습니다.' :
        score >= 60 ? '안정적인 흐름 속에서 꾸준히 성장할 수 있습니다.' :
        '차분하게 내실을 다지는 시기입니다.'
      ],
      cons: [
        score < 60 ? '무리한 확장보다는 신중한 처신이 필요합니다.' :
        '에너지가 좋더라도 과욕은 금물입니다.'
      ],
      strategy: score >= 70 ? '적극적으로 기회를 잡되 균형을 유지하세요.' : '보수적으로 접근하며 기본에 충실하세요.',
    };
  }

  private static calculateCareerFortune(seun: Seun, saju: SajuData, jiRel: any, yongshin: any): FortuneCategory {
    let point = 3; // 기본 3점 (1-5 척도)
    
    const seunOhaeng = seun.ganElement as Element;
    const dayGan = saju.day.ganHan;
    
    // 관성(Gwanseong) 찾기: 나를 극하는 오행
    const gwanseongOhaeng = this.getControllingElement(getOhaeng(dayGan) as Element);
    
    if (seunOhaeng === gwanseongOhaeng) point += 1; // 세운 오행이 관성이면
    if (this.isGenerating(seunOhaeng, gwanseongOhaeng)) point += 1; // 세운 오행이 관성을 생하면
    if (this.isControlling(seunOhaeng, gwanseongOhaeng)) point -= 1; // 세운 오행이 관성을 극하면
    
    if (yongshin && (seun.ganElement === this.koreanToElement(yongshin.primary) || seun.jiElement === this.koreanToElement(yongshin.primary))) {
      point += 1;
    }
    
    if (jiRel.month.type === '합' || jiRel.month.type === '반합') point += 1;
    if (jiRel.month.type === '충') point -= 1;

    const score = Math.min(100, Math.max(20, point * 20));
    
    return {
      score,
      summary: score >= 80 ? '평가와 결과가 따라오는 해' : score >= 60 ? '안정적인 성장의 해' : '신중한 처신이 필요한 해',
      pros: [score >= 70 ? '조직 내에서 입지가 탄탄해지고 인정을 받습니다.' : '맡은 바 책임을 다하여 내실을 기할 수 있습니다.'],
      cons: [jiRel.month.type === '충' ? '직장 내 환경 변화나 이동수가 있어 스트레스가 예상됩니다.' : '의욕이 앞서 번아웃이 올 수 있으니 완급 조절이 필요합니다.'],
      strategy: '결과물로 본인의 가치를 증명하는 전략이 효과적입니다.',
    };
  }

  private static calculateLoveFortune(seun: Seun, saju: SajuData, jiRel: any, yongshin: any): FortuneCategory {
    let point = 3;
    const gender = saju.gender;
    const dayGan = saju.day.ganHan;
    const seunOhaeng = seun.ganElement as Element;

    // 남성: 재성(Jaeseong), 여성: 관성(Gwanseong)
    const targetOhaeng = gender === 'male' 
      ? this.getControlledElement(getOhaeng(dayGan) as Element)
      : this.getControllingElement(getOhaeng(dayGan) as Element);

    if (seunOhaeng === targetOhaeng) point += 1;
    if (jiRel.day.type === '합' || jiRel.day.type === '반합') point += 1;
    if (jiRel.day.type === '충' || jiRel.day.type === '형') point -= 1;

    // 도화살 (2026년 오화(午)는 인오술 삼합의 도화)
    const yearJi = saju.year.jiHan;
    if (['寅', '午', '戌'].includes(yearJi) && seun.jiHan === '午') {
      point += 1;
    }

    const score = Math.min(100, Math.max(20, point * 20));

    return {
      score,
      summary: score >= 80 ? '인연의 기운이 강한 해' : score >= 60 ? '평온하고 안정적인 관계의 해' : '소통과 배려가 필요한 해',
      pros: [score >= 70 ? '매력이 돋보여 주변의 시선을 끄는 해입니다.' : '기존 관계가 더욱 깊어지고 돈독해집니다.'],
      cons: [jiRel.day.type === '충' ? '사소한 오해로 관계에 균열이 생길 수 있으니 주의하세요.' : '본인의 주장이 강해져 상대가 부담을 느낄 수 있습니다.'],
      strategy: '상대방의 입장에서 한 번 더 생각하는 여유가 필요합니다.',
    };
  }

  private static calculateWealthFortune(seun: Seun, saju: SajuData, jiRel: any, yongshin: any): FortuneCategory {
    let point = 3;
    const dayGan = saju.day.ganHan;
    const seunOhaeng = seun.ganElement as Element;
    
    // 재성(Jaeseong): 내가 극하는 오행
    const jaeseongOhaeng = this.getControlledElement(getOhaeng(dayGan) as Element);

    if (seunOhaeng === jaeseongOhaeng) point += 1;
    // 식상생재: 식상이 재성을 생함
    const siksangOhaeng = this.getGeneratingElement(getOhaeng(dayGan) as Element);
    if (seunOhaeng === siksangOhaeng) point += 0.5;

    // 비겁이 강해지면 재물을 나눔 (손재수)
    if (seunOhaeng === getOhaeng(dayGan)) point -= 1;

    if (yongshin && yongshin.primary === '토(土)' && seun.ganZhi === '丙午') {
      // 2026년 오화는 토를 생함
      if (this.koreanToElement(yongshin.primary) === 'earth') point += 1;
    }

    const score = Math.min(100, Math.max(20, Math.round(point * 20)));

    return {
      score,
      summary: score >= 80 ? '재물이 쌓이는 풍요로운 해' : score >= 60 ? '안정적인 수입과 관리가 이어지는 해' : '지출 관리에 집중해야 하는 해',
      pros: [score >= 75 ? '생각지 못한 곳에서 수익이 발생하거나 자산이 늘어납니다.' : '노력한 만큼의 정직한 대가가 따르는 시기입니다.'],
      cons: [seun.ganZhi === '丙午' ? '2026년은 화기가 강해 충동적인 소비가 발생하기 쉽습니다.' : '지엽적인 이득에 매달려 큰 흐름을 놓칠 수 있습니다.'],
      strategy: '단기적인 이익보다 장기적인 자산 가치에 투자하세요.',
    };
  }

  private static calculateHealthFortune(seun: Seun, saju: SajuData, jiRel: any, yongshin: any): FortuneCategory {
    let point = 4; // 건강은 보통 좋다고 가정하고 감점
    
    if (jiRel.day.type === '충' || jiRel.day.type === '형') point -= 1;
    
    // 2026 병오년 특수성: 화극금(火剋金) - 폐, 대장 주의
    const metalCount = saju.ohaengDistribution.metal;
    if (metalCount <= 1) point -= 1;

    if (yongshin && this.isControlling(seun.ganElement as Element, this.koreanToElement(yongshin.primary) as Element)) {
      point -= 1;
    }

    const score = Math.min(100, Math.max(20, point * 20));

    return {
      score,
      summary: score >= 80 ? '활기차고 건강한 해' : score >= 60 ? '무난한 건강 상태를 유지하는 해' : '체력 관리와 휴식이 필수인 해',
      pros: [score >= 80 ? '에너지가 넘치고 컨디션 회복이 빠릅니다.' : '규칙적인 생활로 건강을 유지할 수 있습니다.'],
      cons: [seun.ganZhi === '丙午' ? '강한 화기로 인해 심혈관계나 호흡기 질환에 유의해야 합니다.' : '스트레스로 인한 면역력 저하를 조심하세요.'],
      strategy: '정기적인 검진과 충분한 수분 섭취로 열기를 다스리세요.',
    };
  }

  private static getGeneratingElement(e: Element): Element {
    const map: Record<Element, Element> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
    return map[e];
  }

  private static getControlledElement(e: Element): Element {
    const map: Record<Element, Element> = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };
    return map[e];
  }

  private static getControllingElement(e: Element): Element {
    const map: Record<Element, Element> = { wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth' };
    return map[e];
  }

  private static isGenerating(from: Element, to: Element): boolean {
    return this.getGeneratingElement(from) === to;
  }

  private static isControlling(from: Element, to: Element): boolean {
    return this.getControlledElement(from) === to;
  }

  private static koreanToElement(kor: string): Element {
    const map: Record<string, Element> = { '목(木)': 'wood', '화(火)': 'fire', '토(土)': 'earth', '금(金)': 'metal', '수(水)': 'water' };
    return map[kor] || 'wood';
  }

  private static elementToKorean(element: Element): string {
    const map: Record<Element, string> = {
      wood: '목(木)',
      fire: '화(火)',
      earth: '토(土)',
      metal: '금(金)',
      water: '수(水)'
    };
    return map[element];
  }

  private static buildTotalScoreEvidence(seun: Seun, saju: SajuData, jiRel: any, yongshin: any, finalScore: number): TotalScoreEvidence {
    const calculationSteps: Array<{ step: string; description: string; formula?: string; result: string }> = [];
    
    // 1. 세운 십신 분석
    const positiveGods = ['정관', '정인', '정재', '식신'];
    const negativeGods = ['편관', '겁재', '상관'];

    let tenGodsEval: '긍정' | '중립' | '부정' = '중립';
    let tenGodsPoint = 0;
    const tenGodsDetails: string[] = [];

    if (seun.tenGodsGan && positiveGods.includes(seun.tenGodsGan)) {
      tenGodsEval = '긍정';
      tenGodsPoint = 1;
      tenGodsDetails.push(`세운 천간의 십신이 "${seun.tenGodsGan}"로 길신(吉神)입니다.`);
      calculationSteps.push({
        step: '세운 십신 분석',
        description: `세운 천간 십신: ${seun.tenGodsGan} (길신)`,
        formula: `길신(정관/정인/정재/식신) → +1점`,
        result: `+${tenGodsPoint}점`
      });
      console.log(`[총운 점수 계산] 세운 십신 분석 공식: 길신(정관/정인/정재/식신) → +1점`);
    } else if (seun.tenGodsGan && negativeGods.includes(seun.tenGodsGan)) {
      tenGodsEval = '부정';
      tenGodsPoint = -1;
      tenGodsDetails.push(`세운 천간의 십신이 "${seun.tenGodsGan}"로 흉신(凶神)입니다.`);
      calculationSteps.push({
        step: '세운 십신 분석',
        description: `세운 천간 십신: ${seun.tenGodsGan} (흉신)`,
        formula: `흉신(편관/겁재/상관) → -1점`,
        result: `${tenGodsPoint}점`
      });
      console.log(`[총운 점수 계산] 세운 십신 분석 공식: 흉신(편관/겁재/상관) → -1점`);
    } else {
      tenGodsDetails.push(`세운 천간의 십신이 "${seun.tenGodsGan || '없음'}"로 중립적입니다.`);
      calculationSteps.push({
        step: '세운 십신 분석',
        description: `세운 천간 십신: ${seun.tenGodsGan || '없음'} (중립)`,
        formula: `중립 십신 → 0점`,
        result: `${tenGodsPoint}점`
      });
      console.log(`[총운 점수 계산] 세운 십신 분석 공식: 중립 십신 → 0점`);
    }

    // 2. 용신 매칭 분석
    let yongshinPoint = 0;
    let isMatch = false;
    let isControlling = false;
    let yongshinName = '없음';
    const yongshinDetails: string[] = [];

    if (yongshin) {
      yongshinName = yongshin.primary;
      const yongshinElement = this.koreanToElement(yongshin.primary);
      const seunGanElement = seun.ganElement as Element;
      const seunJiElement = seun.jiElement as Element;

      if (seunGanElement === yongshinElement || seunJiElement === yongshinElement) {
        isMatch = true;
        yongshinPoint += 1.5;
        const matchedPillar = seunGanElement === yongshinElement ? '천간' : '지지';
        yongshinDetails.push(`세운 ${matchedPillar}의 오행이 용신(${yongshinName})과 일치합니다.`);
        calculationSteps.push({
          step: '용신 충족도',
          description: `세운 ${matchedPillar}(${this.elementToKorean(seunGanElement === yongshinElement ? seunGanElement : seunJiElement)}) = 용신(${yongshinName})`,
          formula: `세운 오행 = 용신 오행 → +1.5점`,
          result: `+${yongshinPoint}점`
        });
        console.log(`[총운 점수 계산] 용신 충족도 공식: 세운 오행 = 용신 오행 → +1.5점`);
      }

      if (this.isControlling(seunGanElement, yongshinElement as Element)) {
        isControlling = true;
        yongshinPoint -= 1;
        yongshinDetails.push(`세운 천간(${this.elementToKorean(seunGanElement)})이 용신(${yongshinName})을 극합니다.`);
        calculationSteps.push({
          step: '용신 충족도',
          description: `세운 천간(${this.elementToKorean(seunGanElement)})이 용신(${yongshinName})을 극함`,
          formula: `세운 오행이 용신을 극함 → -1점`,
          result: `${yongshinPoint}점`
        });
        console.log(`[총운 점수 계산] 용신 충족도 공식: 세운 오행이 용신을 극함 → -1점`);
      }

      if (!isMatch && !isControlling) {
        yongshinDetails.push(`세운과 용신의 관계가 중립적입니다.`);
        calculationSteps.push({
          step: '용신 충족도',
          description: `세운과 용신의 관계 중립`,
          formula: `용신과 일치/극 관계 없음 → 0점`,
          result: `${yongshinPoint}점`
        });
        console.log(`[총운 점수 계산] 용신 충족도 공식: 용신과 일치/극 관계 없음 → 0점`);
      }
    } else {
      yongshinDetails.push('용신이 없어 분석하지 않습니다.');
      calculationSteps.push({
        step: '용신 충족도',
        description: '용신 없음',
        formula: '용신 없음 → 0점',
        result: '0점'
      });
      console.log(`[총운 점수 계산] 용신 충족도 공식: 용신 없음 → 0점`);
    }

    // 3. 지지 관계 분석
    const hapRelations: string[] = [];
    const banHapRelations: string[] = [];
    const chungRelations: string[] = [];
    const hyungRelations: string[] = [];
    let jiRelPoint = 0;
    const jiRelCalculationDetails: string[] = [];

    const pillars = ['year', 'month', 'day', 'hour'];
    const pillarNames: Record<string, string> = {
      year: '년주',
      month: '월주',
      day: '일주',
      hour: '시주'
    };

    pillars.forEach(pillar => {
      const rel = jiRel[pillar];
      if (!rel) return; // null 체크

      if (rel.type === '합') {
        hapRelations.push(`${pillarNames[pillar]}와 합(合)`);
      } else if (rel.type === '반합') {
        banHapRelations.push(`${pillarNames[pillar]}와 반합(半合)`);
      } else if (rel.type === '충') {
        chungRelations.push(`${pillarNames[pillar]}와 충(沖)`);
      } else if (rel.type === '형') {
        hyungRelations.push(`${pillarNames[pillar]}와 형(刑)`);
      }
    });

    // calculateTotalFortune과 동일한 로직
    if (hapRelations.length > 0) {
      jiRelPoint += 0.5;
      jiRelCalculationDetails.push(`합(合) 관계 ${hapRelations.length}개 발견`);
      console.log(`[총운 점수 계산] 형충회합 공식: 합(合) 관계 → +0.5점`);
    }
    if (banHapRelations.length > 0) {
      jiRelPoint += 0.5;
      jiRelCalculationDetails.push(`반합(半合) 관계 ${banHapRelations.length}개 발견`);
      console.log(`[총운 점수 계산] 형충회합 공식: 반합(半合) 관계 → +0.5점`);
    }
    if (chungRelations.length > 0) {
      jiRelPoint -= 1;
      jiRelCalculationDetails.push(`충(沖) 관계 ${chungRelations.length}개 발견`);
      console.log(`[총운 점수 계산] 형충회합 공식: 충(沖) 관계 → -1점`);
    }
    if (hyungRelations.length > 0) {
      jiRelPoint -= 0.5;
      jiRelCalculationDetails.push(`형(刑) 관계 ${hyungRelations.length}개 발견`);
      console.log(`[총운 점수 계산] 형충회합 공식: 형(刑) 관계 → -0.5점`);
    }

    if (hapRelations.length === 0 && banHapRelations.length === 0 && chungRelations.length === 0 && hyungRelations.length === 0) {
      jiRelCalculationDetails.push('특별한 형충회합 관계 없음');
      console.log(`[총운 점수 계산] 형충회합 공식: 형충회합 없음 → 0점`);
    }

    calculationSteps.push({
      step: '형충회합 관계',
      description: jiRelCalculationDetails.length > 0 ? jiRelCalculationDetails.join(', ') : '형충회합 없음',
      formula: `합/반합: +0.5점씩 | 충: -1점 | 형: -0.5점`,
      result: jiRelPoint > 0 ? `+${jiRelPoint}점` : `${jiRelPoint}점`
    });

    const hasHap = hapRelations.length > 0 || banHapRelations.length > 0;
    const hasChung = chungRelations.length > 0;
    const hasHyung = hyungRelations.length > 0;
    const details = [...hapRelations, ...banHapRelations, ...chungRelations, ...hyungRelations];
    if (details.length === 0) {
      details.push('특별한 형충회합 없음');
    }

    const basePoint = 3;
    const totalPoint = basePoint + tenGodsPoint + yongshinPoint + jiRelPoint;

    // 최종 계산 공식 콘솔 출력
    console.log(`[총운 점수 계산] 최종 계산 공식:`);
    console.log(`  기본 점수: ${basePoint}점`);
    console.log(`  세운 십신: ${tenGodsPoint > 0 ? '+' : ''}${tenGodsPoint}점`);
    console.log(`  용신 충족도: ${yongshinPoint > 0 ? '+' : ''}${yongshinPoint}점`);
    console.log(`  형충회합: ${jiRelPoint > 0 ? '+' : ''}${jiRelPoint}점`);
    console.log(`  합계: ${basePoint} + ${tenGodsPoint > 0 ? '+' : ''}${tenGodsPoint} + ${yongshinPoint > 0 ? '+' : ''}${yongshinPoint} + ${jiRelPoint > 0 ? '+' : ''}${jiRelPoint} = ${totalPoint.toFixed(1)}점`);
    console.log(`  최종 점수 환산: ${totalPoint.toFixed(1)} × 20 = ${finalScore}점`);

    calculationSteps.push({
      step: '최종 계산',
      description: '모든 요소를 합산하여 최종 점수를 계산합니다.',
      formula: `기본점수(${basePoint}) + 십신(${tenGodsPoint > 0 ? '+' : ''}${tenGodsPoint}) + 용신(${yongshinPoint > 0 ? '+' : ''}${yongshinPoint}) + 형충회합(${jiRelPoint > 0 ? '+' : ''}${jiRelPoint}) = ${totalPoint.toFixed(1)}점`,
      result: `${finalScore}점 (${totalPoint.toFixed(1)} × 20)`
    });

    return {
      seunTenGods: {
        gan: seun.tenGodsGan || '',
        ji: seun.tenGodsJi || '',
        evaluation: tenGodsEval,
        point: tenGodsPoint,
        details: tenGodsDetails,
      },
      yongshinMatch: {
        yongshin: yongshinName,
        seunGanElement: this.elementToKorean(seun.ganElement as Element),
        seunJiElement: this.elementToKorean(seun.jiElement as Element),
        isMatch,
        isControlling,
        point: yongshinPoint,
        details: yongshinDetails,
      },
      jiRelationships: {
        hasHap,
        hasChung,
        hasHyung,
        details,
        point: jiRelPoint,
        calculationDetails: jiRelCalculationDetails,
      },
      basePoint,
      totalPoint,
      finalScore,
      calculationSteps,
    };
  }
}

