import { SajuCalculator } from './calculators/SajuCalculator';
import { calculateNewYearFortune } from './calculators/NewYearFortune';

function printPersona(name: string, year: number, month: number, day: number, hour: number, gender: 'male' | 'female') {
  const saju = SajuCalculator.calculate(year, month, day, hour, 0, gender);
  const fortune = calculateNewYearFortune(saju);

  console.log(`\n### [페르소나: ${name}]`);
  console.log(`- 사주 원국: ${saju.day.ganHan}${saju.day.jiHan} 일주 (일간: ${saju.day.ganHan})`);
  console.log(`- 분석 태그: #${fortune.analysisTags.dominantTengod} 주도, #${fortune.analysisTags.supportTengod} 보조, ${fortune.analysisTags.event ? `#${fortune.analysisTags.palace}지 ${fortune.analysisTags.event}` : '#이벤트 없음'}`);
  console.log(`- 올해의 성격: ${fortune.yearNature}`);
  console.log(`- 핵심 요약: ${fortune.yearSummary.summaryText}`);
  console.log(`\n[영역별 한 줄 해석]`);
  console.log(`- 💰 재물운: ${fortune.fortuneAreas.money.pros.slice(0, 50)}...`);
  console.log(`- ❤️ 애정운: ${fortune.fortuneAreas.relationship.pros.slice(0, 50)}...`);
  console.log(`- 💼 직업운: ${fortune.fortuneAreas.career.pros.slice(0, 50)}...`);
  console.log(`- 📚 성장운: ${fortune.fortuneAreas.selfGrowth.pros.slice(0, 50)}...`);
}

console.log("--- 2026년 병오년(丙午年) 신년운세 페르소나 비교 분석 ---\n");

// Persona 1: 1990.05.15 12:00 Male (壬戌 일주 - 정재운)
printPersona("안정적 성취를 꿈꾸는 직장인", 1990, 5, 15, 12, 'male');

// Persona 2: 1982.10.25 04:00 Female (辛亥 일주 - 정관/편관운)
printPersona("변화의 기로에 선 전문직", 1982, 10, 25, 4, 'female');
