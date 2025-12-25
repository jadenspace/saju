import { KeyMonth, SajuData } from '../../../../entities/saju/model/types';
import { SajuCalculator } from './SajuCalculator';
import { SeunFortuneCalculator, RelationshipType } from './SeunFortuneCalculator';

interface MonthRelation {
  month: number;
  relationType: RelationshipType;
  priority: number;
}

const THEME_MAP: Record<RelationshipType, KeyMonth['theme'] | null> = {
  '충': '큰 변화의 달',
  '합': '화합의 달',
  '형': '조심의 달',
  '삼합': '화합의 달',
  '반합': '화합의 달',
  '원진': '조심의 달',
  '없음': null,
};

const ADVICE_MAP: Record<KeyMonth['theme'], string> = {
  '큰 변화의 달': '큰 결정은 신중히, 환경 변화에 유연하게 대응하세요.',
  '화합의 달': '새로운 인연과 기회가 찾아오는 시기, 적극적으로 행동하세요.',
  '조심의 달': '건강과 대인관계에 특히 신경 쓰세요.',
};

const PRIORITY_MAP: Record<RelationshipType, number> = {
  '충': 3,
  '합': 2,
  '형': 1,
  '삼합': 2,
  '반합': 2,
  '원진': 1,
  '없음': 0,
};

export class KeyMonthCalculator {
  /**
   * 주요 월운 계산
   * 일지와 각 월의 월지 관계를 분석하여 상위 3개 주요 월을 반환
   */
  static calculateKeyMonths(year: number, sajuData: SajuData): KeyMonth[] {
    const dayJi = sajuData.day.jiHan;
    
    // 각 월의 월지 정보 가져오기
    const monthlyData = SajuCalculator.calculateMonthlyFortune(year, sajuData.day.ganHan);
    
    // 각 월과 일지의 관계 분석
    const monthRelations: MonthRelation[] = monthlyData.map((data) => {
      const relation = SeunFortuneCalculator.analyzeJiRelationship(data.jiHan, dayJi);
      return {
        month: data.month,
        relationType: relation.type,
        priority: PRIORITY_MAP[relation.type],
      };
    });
    
    // 우선순위가 있는 월만 필터링 후 정렬 (우선순위 높은 순)
    const significantMonths = monthRelations
      .filter((m) => m.priority > 0)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
      .sort((a, b) => a.month - b.month); // 월 오름차순 정렬
    
    // KeyMonth 형태로 변환
    return significantMonths.map((m): KeyMonth => {
      const theme = THEME_MAP[m.relationType];
      if (!theme) {
        // fallback (shouldn't happen since we filtered priority > 0)
      return {
        month: m.month,
        theme: '조심의 달',
        advice: ADVICE_MAP['조심의 달'],
      };
      }
      return {
        month: m.month,
        theme,
        advice: ADVICE_MAP[theme],
      };
    });
  }
}

