import { NewYearFortune, SajuData, FortuneAreaBase } from '../../../../entities/saju/model/types';
import { calculateSipsin, getOhaeng, Element } from './TenGod';
import { josa } from 'es-hangul';
import { SajuCalculator } from './SajuCalculator';

// Local Constants for 2026 (Bing-Wu Year)
const CURRENT_YEAR = 2026;
const YEAR_GAN = '丙';
const YEAR_JI = '午';

// 오행 상생상극 맵
const GENERATING_MAP: Record<Element, Element> = {
  'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood'
};

const CONTROLLING_MAP: Record<Element, Element> = {
  'wood': 'earth', 'earth': 'water', 'water': 'fire', 'fire': 'metal', 'metal': 'wood'
};

/**
 * Event Detection Types
 */
type EventType = '충' | '합' | '형' | '파' | '해' | '없음';
type PalaceType = '년' | '월' | '일' | '시';

/**
 * Advanced Classification Logic for New Year Fortune
 */
export const calculateNewYearFortune = (sajuData: SajuData): NewYearFortune => {
  const dayMaster = sajuData.day.ganHan;

  // 0. 용신/기신 확인
  const yongshin = sajuData.yongshin;
  const yongshinElement = yongshin ? getOhaengFromKorean(yongshin.primary) : null;
  const gishinElements = yongshin?.gishin?.map(g => getOhaengFromKorean(g)) || [];

  // 세운 오행 확인
  const yearGanElement = getOhaeng(YEAR_GAN);
  const yearJiElement = getOhaeng(YEAR_JI);
  const isYongshinYear = yongshinElement && (yearGanElement === yongshinElement || yearJiElement === yongshinElement);
  const isGishinYear = gishinElements.some(g => g === yearGanElement || g === yearJiElement);

  // 1. Dominant & Support Sipsin
  const dominantTengod = calculateSipsin(dayMaster, YEAR_JI); // Year Ji base
  const supportTengod = calculateSipsin(dayMaster, YEAR_GAN);  // Year Gan base

  // 2. Event Detection (Interaction between Year Ji '午' and user's branches)
  const branches = [
    { type: '년' as PalaceType, ji: sajuData.year.jiHan },
    { type: '월' as PalaceType, ji: sajuData.month.jiHan },
    { type: '일' as PalaceType, ji: sajuData.day.jiHan },
    { type: '시' as PalaceType, ji: sajuData.hour.jiHan }
  ];

  let event: EventType = '없음';
  let palace: PalaceType | undefined;

  for (const b of branches) {
    if (b.ji === '子') { event = '충'; palace = b.type; break; } // 자오충
    if (b.ji === '戌' || b.ji === '寅') { event = '합'; palace = b.type; break; } // 인오술 합
    if (b.ji === '午') { event = '형'; palace = b.type; break; } // 오오형
    if (b.ji === '卯') { event = '파'; palace = b.type; break; } // 오묘파
    if (b.ji === '丑') { event = '해'; palace = b.type; break; } // 축오해
  }

  // 3. Ohaeng Excess/Lack
  const ohaengExcess = sajuData.ohaengAnalysis.excess[0];
  const ohaengLack = sajuData.ohaengAnalysis.missing[0] || sajuData.ohaengAnalysis.deficient[0];

  // 4. Quality & Pace
  const quality = event === '충' || event === '형' ? 'volatile' : (event === '합' ? 'stable' : 'mixed');
  const pace = event === '충' || (dominantTengod === '상관' || dominantTengod === '겁재') ? 'fast' : 'slow';

  // 5. Theme & Guide Type
  const themeMap: Record<string, string> = {
    '비견': '독립', '겁재': '변화', '식신': '생산', '상관': '혁신',
    '편재': '확장', '정재': '안정', '편관': '도전', '정관': '명예',
    '편인': '통찰', '정인': '수렴'
  };
  const theme = themeMap[dominantTengod] || '균형';
  const guideType: 'push' | 'manage' | 'defense' | 'reset' =
    event === '충' ? 'reset' : (['편재', '상관', '겁재'].includes(dominantTengod) ? 'push' : 'manage');

  // 6. Detailed Interpretation Logic (용신/기신 정보 포함)
  const interpretation = getExpertInterpretation(dominantTengod, supportTengod, event, palace, ohaengExcess, ohaengLack, sajuData, isYongshinYear, isGishinYear, yongshin);

  // 7. Key Months (주요 월) - 사용자 피드백에 따라 주요 월만 표시
  const keyMonths = calculateKeyMonths(sajuData, dominantTengod, event);
  
  // 7-1. All Months (전체 12개월 월운 분석)
  const allMonths = calculateAllMonths(sajuData, isYongshinYear, isGishinYear, yongshin);

  // 8. Lucky Info (행운 정보) - 용신 오행 기반
  const luckyInfo = calculateLuckyInfo(sajuData, yongshin);

  return {
    year: CURRENT_YEAR,
    gan: YEAR_GAN,
    ji: YEAR_JI,
    yearSummary: {
      score: calculateDynamicScore(dominantTengod, event, sajuData, isYongshinYear, isGishinYear),
      summaryText: interpretation.summary,
      reason: interpretation.reasons
    },
    yearNature: `${pace === 'fast' ? '빠르고 ' : '차분하고 '}${quality === 'volatile' ? '변동성이 큰 ' : '안정적인 '}해`,
    fortuneAreas: interpretation.areas,
    keyMonths,
    allMonths,
    fortuneGuide: interpretation.guide,
    expertMeta: {
      fortuneType: `${dominantTengod} 주도의 ${theme} 테마`,
      warningLevel: event === '충' || event === '형' ? 'high' : (event !== '없음' ? 'medium' : 'low'),
      recommendedActivities: interpretation.guide.do
    },
    analysisTags: {
      dominantTengod,
      supportTengod,
      event: event !== '없음' ? event : undefined,
      palace,
      ohaengExcess,
      ohaengLack,
      quality,
      pace,
      theme,
      guideType
    },
    luckyInfo,
  };
};

/**
 * Detailed Interpretation Generator
 */
function getExpertInterpretation(
  dominant: string,
  support: string,
  event: EventType,
  palace: PalaceType | undefined,
  excess: string | undefined,
  lack: string | undefined,
  saju: SajuData,
  isYongshinYear: boolean,
  isGishinYear: boolean,
  yongshin?: SajuData['yongshin']
) {
  // --- Summary & Reasons ---
  let summary = '';
  if (isYongshinYear && yongshin) {
    summary = `${CURRENT_YEAR}년은 용신 ${yongshin.primary}이 들어오는 해로, 전반적으로 운세가 상승합니다. ${josa(dominant, '이/가')} 주도하는 해로, 내면에 잠들어 있던 목표의식이 현실화되는 역동적인 해입니다.`;
  } else if (isGishinYear && yongshin) {
    summary = `${CURRENT_YEAR}년은 기신 ${yongshin.gishin?.[0] || ''}이 강한 해로, 신중한 처신이 필요합니다. ${josa(dominant, '이/가')} 주도하는 해로, 변화에 대비하며 신중하게 나아가야 합니다.`;
  } else {
    summary = `${josa(dominant, '이/가')} 주도하는 해로, 내면에 잠들어 있던 목표의식이 현실화되는 역동적인 해입니다.`;
  }

  const reasons = [
    `올해의 중심 기운인 ${josa(dominant, '이/가')} 사회적 활동의 방향성을 결정합니다.`,
    `천간의 ${josa(support, '은/는')} 당신의 생각과 의논되어 실질적인 행동을 이끌어내는 힘이 됩니다.`,
  ];
  if (isYongshinYear && yongshin) {
    reasons.push(`용신 ${yongshin.primary}이 들어와 사주 균형이 좋아지며 전반적인 운세가 상승합니다.`);
  } else if (isGishinYear && yongshin) {
    reasons.push(`기신이 강하게 작용하여 주의가 필요한 해입니다.`);
  }
  if (event !== '없음') reasons.push(`${palace}궁에서 발생하는 ${event}의 작용이 환경적인 큰 변화를 불러옵니다.`);
  if (excess) reasons.push(`원국에 많은 ${josa(excess, '을/를')} 어떻게 다루느냐가 성패를 가르는 열쇠가 될 것입니다.`);

  // --- Area Interpretations (Smooth Sentences) ---

  // 1. Money (커리큘럼 6.2 공식 적용)
  const moneyScore = calculateFortuneAreaScore(
    dominant,
    support,
    '재성',
    saju,
    isYongshinYear,
    isGishinYear,
    yongshin
  );
  const money = {
    score: moneyScore,
    pros: dominant === '식신' || dominant === '상관'
      ? "나의 전문 기술이나 창의적인 아이디어가 시장에서 인정받으며 실질적인 수익으로 연결될 가능성이 매우 높습니다."
      : `${dominant}의 영향으로 활동 범위가 넓어지며 새로운 수익원 창출에 유리한 흐름입니다.`,
    cons: event === '충' || event === '형'
      ? "운의 기복이 심해지는 시기이므로, 벌어들이는 것만큼 나가는 지출(경쟁 비용, 충동 소비) 관리에 특별히 신경 써야 합니다."
      : "지엽적인 성과에 만족하여 큰 자산의 흐름을 놓치지 않도록 주의가 필요합니다.",
    strategy: dominant.includes('재')
      ? "단기적인 시세 차익보다는 나의 '몸값'을 높이거나 장기적인 자산 가치에 집중하는 전략이 유효합니다."
      : "수익의 일정 부분을 반드시 안전 자산으로 묶어두어 운의 변동성에 대비하세요."
  };

  // 2. Relationship (커리큘럼 6.2 공식 적용)
  const relationshipScore = calculateFortuneAreaScore(
    dominant,
    support,
    saju.gender === 'male' ? '재성' : '관성',
    saju,
    isYongshinYear,
    isGishinYear,
    yongshin
  );
  const relationship = {
    score: relationshipScore,
    pros: event === '합'
      ? "주변 사람들과의 깊은 유대감이 형성되며, 나를 지지해주는 든든한 아군이나 귀한 인연을 만날 수 있는 운입니다."
      : "자신감이 고취되면서 호감 있는 상대에게 본인의 매력을 자연스럽게 어필하기 좋은 시기입니다.",
    cons: event === '충' && (palace === '일' || palace === '월')
      ? "가까운 지인이나 배우자와의 소통 과정에서 예기치 못한 오해가 발생하거나 날카로운 언쟁이 생길 수 있으니 주의하세요."
      : "내 주장이 강해지는 해인 만큼, 타인의 조언을 간과하여 고립될 수 있는 점은 경계해야 합니다.",
    strategy: "상대방의 입장을 먼저 헤아리는 다정함이 곧 나의 복으로 돌아오는 해임을 잊지 마세요."
  };

  // 3. Career (커리큘럼 6.2 공식 적용)
  const careerScore = calculateFortuneAreaScore(
    dominant,
    support,
    '관성',
    saju,
    isYongshinYear,
    isGishinYear,
    yongshin
  );
  const career = {
    score: careerScore,
    pros: support.includes('관') || support.includes('인')
      ? "윗사람의 원조나 조직의 인정을 바탕으로 본인의 입지가 탄탄해지며 승진이나 합격의 기운이 강하게 따릅니다."
      : "실행력이 뛰어난 한 해로, 추진하던 프로젝트가 구체적인 성과물로 나타나 대중의 이목을 끌게 됩니다.",
    cons: event === '형' || event === '파'
      ? "조직 내의 복잡한 권력 관계나 시스템상의 문제로 인해 업무적 피로도가 급격히 상승할 수 있습니다."
      : "의욕이 앞서 본인의 역량을 초과한 업무를 떠맡아 번아웃이 올 수 있으니 완급 조절이 필수입니다.",
    strategy: "말로 싸우기보다 압도적인 결과물로 본인의 가치를 증명하는 전략이 가장 효과적입니다."
  };

  // 4. Self-Growth
  const selfGrowth = {
    score: 80,
    pros: "무언가에 미친 듯이 몰입할 수 있는 강한 집중력이 생기며, 새로운 전문 분야를 배우거나 자격증을 따기에 최적의 타이밍입니다.",
    cons: lack === '수' || lack === '금'
      ? "열정이 과하여 정서적인 고갈이나 예민함이 커질 수 있으니 명상이나 정적인 취미로 열기를 식히는 노력이 필요합니다."
      : "생각은 원대하나 실행이 지연될 수 있으므로, 결과물이 남는 작은 실천부터 시작하는 습관을 가져야 합니다.",
    strategy: "분출되는 아이디어가 흩어지지 않도록 매일의 성취를 '기록'하여 내면의 힘을 단단하게 구축하세요."
  };

  return {
    summary,
    reasons,
    areas: { money, relationship, career, selfGrowth },
    guide: {
      do: [
        `${dominant}의 긍정적인 추진력 활용하기`,
        event === '충' ? "과감하게 주변 환경 정리하고 비우기" : "현재의 좋은 질서를 유지하며 내실 다지기",
        "자신감을 바탕으로 능동적으로 제안하기"
      ],
      dont: [
        `${josa(dominant, '이/가')} 주는 부정적 고집 경계하기`,
        "결과가 보이지 않는 일에 무리하게 집착하기",
        lack === '수' ? "충분한 휴식 없이 자신을 몰아붙이기" : "타인의 시선을 지나치게 의식하여 위축되기"
      ],
      keywords: [dominant, support, event !== '없음' ? event : '안정']
    }
  };
}


function calculateDynamicScore(
  dominant: string,
  event: string,
  saju: SajuData,
  isYongshinYear: boolean,
  isGishinYear: boolean
): number {
  let score = 75;
  if (['식신', '정재', '정관', '정인'].includes(dominant)) score += 10;
  if (event === '충') score -= 5;
  if (saju.ohaengAnalysis.missing.length === 0) score += 5; // Balanced chart
  
  // 용신/기신 반영
  if (isYongshinYear) score += 10; // 용신 해는 운세 상승
  if (isGishinYear) score -= 10; // 기신 해는 주의 필요
  
  return Math.min(95, Math.max(45, score));
}

/**
 * 세부 운세 점수 계산 (커리큘럼 6.2 공식)
 * 세부운세 점수 = 기본점수(3점)
 *              + 세운 오행이 해당 육친을 생하면 (+1)
 *              + 세운 오행이 해당 육친이면 (+1)
 *              + 세운 오행이 해당 육친을 극하면 (-1)
 *              + 용신과 일치하면 (+1)
 *              + 기신과 일치하면 (-1)
 */
function calculateFortuneAreaScore(
  dominant: string,
  support: string,
  targetYukchin: '재성' | '관성' | '인성' | '식상' | '비겁',
  saju: SajuData,
  isYongshinYear: boolean,
  isGishinYear: boolean,
  yongshin?: SajuData['yongshin']
): number {
  const dayMaster = saju.day.ganHan;
  let score = 3; // 기본 점수

  // 세운 천간과 지지의 십성 확인
  const yearGanSipsin = calculateSipsin(dayMaster, YEAR_GAN);
  const yearJiSipsin = calculateSipsin(dayMaster, YEAR_JI);

  // 세운 오행이 해당 육친을 생하는지 확인
  const yearGanElement = getOhaeng(YEAR_GAN);
  const yearJiElement = getOhaeng(YEAR_JI);

  // 육친 오행 매핑
  const yukchinToElement: Record<string, Element> = {
    '비겁': getOhaeng(dayMaster) || 'wood',
    '식상': GENERATING_MAP[getOhaeng(dayMaster) || 'wood'] || 'fire',
    '재성': CONTROLLING_MAP[getOhaeng(dayMaster) || 'wood'] || 'earth',
    '관성': Object.keys(CONTROLLING_MAP).find(
      key => CONTROLLING_MAP[key as Element] === getOhaeng(dayMaster)
    ) as Element || 'metal',
    '인성': Object.keys(GENERATING_MAP).find(
      key => GENERATING_MAP[key as Element] === getOhaeng(dayMaster)
    ) as Element || 'water',
  };

  const targetElement = yukchinToElement[targetYukchin];
  if (!targetElement) return score;

  // 세운 오행이 해당 육친이면 (+1)
  if (yearGanSipsin === targetYukchin || yearJiSipsin === targetYukchin) {
    score += 1;
  }

  // 세운 오행이 해당 육친을 생하면 (+1)
  if (yearGanElement && GENERATING_MAP[yearGanElement] === targetElement) {
    score += 1;
  }
  if (yearJiElement && GENERATING_MAP[yearJiElement] === targetElement) {
    score += 1;
  }

  // 세운 오행이 해당 육친을 극하면 (-1)
  if (yearGanElement && CONTROLLING_MAP[yearGanElement] === targetElement) {
    score -= 1;
  }
  if (yearJiElement && CONTROLLING_MAP[yearJiElement] === targetElement) {
    score -= 1;
  }

  // 용신과 일치하면 (+1)
  if (isYongshinYear && yongshin) {
    const yongshinElement = getOhaengFromKorean(yongshin.primary);
    if (yongshinElement === targetElement) {
      score += 1;
    }
  }

  // 기신과 일치하면 (-1)
  if (isGishinYear && yongshin?.gishin) {
    const gishinElements = yongshin.gishin.map(g => getOhaengFromKorean(g));
    if (gishinElements.some(g => g === targetElement)) {
      score -= 1;
    }
  }

  // 점수를 1-5 스케일로 변환 (커리큘럼 8.2)
  // 점수 범위를 1-5로 매핑 (대략적으로)
  const normalizedScore = Math.min(5, Math.max(1, Math.round(score / 2) + 1));
  
  // 점수를 100점 만점으로 변환 (기존 코드와 호환)
  return normalizedScore * 20;
}

/**
 * 한글 오행명에서 Element로 변환
 */
function getOhaengFromKorean(korean: string): Element | null {
  const map: Record<string, Element> = {
    '목(木)': 'wood',
    '화(火)': 'fire',
    '토(土)': 'earth',
    '금(金)': 'metal',
    '수(水)': 'water',
  };
  return map[korean] || null;
}

/**
 * 주요 월 계산 - 3개의 핵심 월만 반환
 */
function calculateKeyMonths(saju: SajuData, dominant: string, event: string): Array<{ month: number; theme: string; advice: string }> {
  // 2026년 월별 천간지지 (인월 = 경인, 묘월 = 신묘, ...)
  const monthBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const dayJi = saju.day.jiHan;

  const months: Array<{ month: number; theme: string; advice: string; priority: number }> = [];

  monthBranches.forEach((ji, idx) => {
    const month = idx + 1;
    let theme = '';
    let advice = '';
    let priority = 0;

    // 일지와 충 관계
    if ((dayJi === '子' && ji === '午') || (dayJi === '午' && ji === '子') ||
      (dayJi === '卯' && ji === '酉') || (dayJi === '酉' && ji === '卯') ||
      (dayJi === '寅' && ji === '申') || (dayJi === '申' && ji === '寅') ||
      (dayJi === '巳' && ji === '亥') || (dayJi === '亥' && ji === '巳') ||
      (dayJi === '辰' && ji === '戌') || (dayJi === '戌' && ji === '辰') ||
      (dayJi === '丑' && ji === '未') || (dayJi === '未' && ji === '丑')) {
      theme = '변화의 달';
      advice = '큰 결정은 신중히, 환경 변화에 유연하게 대응하세요.';
      priority = 3;
    }
    // 삼합 또는 육합 관계
    else if (isHarmony(dayJi, ji)) {
      theme = '기회의 달';
      advice = '새로운 인연과 기회가 찾아오는 시기, 적극적으로 행동하세요.';
      priority = 2;
    }
    // 형 관계
    else if (dayJi === ji) {
      theme = '주의의 달';
      advice = '건강과 대인관계에 특히 신경 쓰세요.';
      priority = 1;
    }

    if (priority > 0) {
      months.push({ month, theme, advice, priority });
    }
  });

  // 우선순위 높은 순으로 정렬 후 상위 3개 반환
  return months
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
    .map(({ month, theme, advice }) => ({ month, theme, advice }));
}

function isHarmony(ji1: string, ji2: string): boolean {
  const sixHarmony: Record<string, string> = {
    '子': '丑', '丑': '子',
    '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯',
    '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳',
    '午': '未', '未': '午'
  };
  return sixHarmony[ji1] === ji2;
}

/**
 * 전체 12개월 월운 분석 (커리큘럼 7단계)
 * 월운 점수 = 기본 3점
 *          + 월간지가 용신이면 (+1~2)
 *          + 월간지가 기신이면 (-1~2)
 *          + 원국/세운과 좋은 합이면 (+1)
 *          + 원국/세운과 충이면 (-1)
 */
function calculateAllMonths(
  saju: SajuData,
  isYongshinYear: boolean,
  isGishinYear: boolean,
  yongshin?: SajuData['yongshin']
): Array<{
  month: number;
  gan: string;
  ji: string;
  score: number;
  theme: string;
  advice: string;
}> {
  const dayMaster = saju.day.ganHan;
  const yearJi = saju.year.jiHan;
  const dayJi = saju.day.jiHan;

  // 월별 간지 조회
  const monthlyData = SajuCalculator.calculateMonthlyFortune(CURRENT_YEAR, dayMaster, yearJi, dayJi);

  const yongshinElement = yongshin ? getOhaengFromKorean(yongshin.primary) : null;
  const gishinElements = yongshin?.gishin?.map(g => getOhaengFromKorean(g)) || [];

  return monthlyData.map(monthData => {
    let score = 3; // 기본 점수

    const monthGanElement = getOhaeng(monthData.ganHan);
    const monthJiElement = getOhaeng(monthData.jiHan);

    // 월간지가 용신이면 (+1~2)
    if (yongshinElement) {
      if (monthGanElement === yongshinElement) score += 2;
      if (monthJiElement === yongshinElement) score += 2;
    }

    // 월간지가 기신이면 (-1~2)
    if (gishinElements.length > 0) {
      if (monthGanElement && gishinElements.includes(monthGanElement)) score -= 2;
      if (monthJiElement && gishinElements.includes(monthJiElement)) score -= 2;
    }

    // 원국/세운과 좋은 합이면 (+1)
    // 세운 지지(午)와 월지의 합 관계 확인
    if (isHarmony(YEAR_JI, monthData.jiHan)) {
      score += 1;
    }
    // 일지와 월지의 합 관계 확인
    if (isHarmony(dayJi, monthData.jiHan)) {
      score += 1;
    }

    // 원국/세운과 충이면 (-1)
    // 세운 지지(午)와 월지의 충 관계 확인
    const chungPairs: Array<[string, string]> = [
      ['子', '午'], ['午', '子'],
      ['丑', '未'], ['未', '丑'],
      ['寅', '申'], ['申', '寅'],
      ['卯', '酉'], ['酉', '卯'],
      ['辰', '戌'], ['戌', '辰'],
      ['巳', '亥'], ['亥', '巳']
    ];
    if (chungPairs.some(([a, b]) => (a === YEAR_JI && b === monthData.jiHan) || (a === monthData.jiHan && b === YEAR_JI))) {
      score -= 1;
    }
    // 일지와 월지의 충 관계 확인
    if (chungPairs.some(([a, b]) => (a === dayJi && b === monthData.jiHan) || (a === monthData.jiHan && b === dayJi))) {
      score -= 1;
    }

    // 점수를 1-5 스케일로 변환
    const normalizedScore = Math.min(5, Math.max(1, Math.round(score / 2) + 1));

    // 테마와 조언 결정
    let theme = '';
    let advice = '';

    if (normalizedScore >= 4) {
      theme = '좋은 달';
      advice = '운세가 상승하는 시기입니다. 중요한 결정이나 새로운 시작에 좋습니다.';
    } else if (normalizedScore >= 3) {
      theme = '보통 달';
      advice = '안정적인 시기입니다. 꾸준한 노력으로 발전할 수 있습니다.';
    } else if (normalizedScore >= 2) {
      theme = '주의 달';
      advice = '신중한 처신이 필요한 시기입니다. 큰 결정은 피하는 것이 좋습니다.';
    } else {
      theme = '어려운 달';
      advice = '운세가 불리한 시기입니다. 인내심을 갖고 조심스럽게 나아가세요.';
    }

    return {
      month: monthData.month,
      gan: monthData.ganHan,
      ji: monthData.jiHan,
      score: normalizedScore,
      theme,
      advice,
    };
  });
}

/**
 * 행운 정보 계산 - 용신 오행 기반 (커리큘럼 개선)
 */
function calculateLuckyInfo(saju: SajuData, yongshin?: SajuData['yongshin']): { color: string; direction: string; number: string } {
  const elementInfo: Record<string, { color: string; direction: string; number: string }> = {
    '목(木)': { color: '청색, 녹색', direction: '동쪽', number: '3, 8' },
    '화(火)': { color: '적색, 분홍색', direction: '남쪽', number: '2, 7' },
    '토(土)': { color: '황색, 갈색', direction: '중앙', number: '5, 10' },
    '금(金)': { color: '백색, 금색', direction: '서쪽', number: '4, 9' },
    '수(水)': { color: '흑색, 감색', direction: '북쪽', number: '1, 6' },
  };

  // 용신이 있으면 용신 기반, 없으면 부족한 오행 기반
  if (yongshin && yongshin.primary) {
    return elementInfo[yongshin.primary] || { color: '적색, 오렌지색', direction: '남쪽', number: '2, 7' };
  }

  // 부족한 오행을 보완하는 색상/방향/숫자
  const lackElement = saju.ohaengAnalysis.missing[0] || saju.ohaengAnalysis.deficient[0] || '';
  const info = elementInfo[lackElement] || { color: '적색, 오렌지색', direction: '남쪽', number: '2, 7' };

  return info;
}
