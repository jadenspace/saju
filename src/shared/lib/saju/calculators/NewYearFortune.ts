import { NewYearFortune, SajuData, FortuneAreaBase, YearMechanism, CommonMistake } from '../../../../entities/saju/model/types';
import { calculateSipsin, getOhaeng, Element } from './TenGod';
import { josa } from 'es-hangul';
import { SajuCalculator } from './SajuCalculator';

// Local Constants for 2026 (Bing-Wu Year)
const CURRENT_YEAR = 2026;
const YEAR_GAN = '丙';
const YEAR_JI = '午';

// Local Constants for 2025 (Yi-Si Year)
const PREVIOUS_YEAR = 2025;
const PREVIOUS_YEAR_GAN = '乙';
const PREVIOUS_YEAR_JI = '巳';

/**
 * 십성 → 사용자 친화적 표현 맵핑
 */
const TENGOD_FRIENDLY_MAP: Record<string, { description: string; type: YearMechanism['type'] }> = {
  '비견': { description: '자기 주도적 에너지가 강한', type: 'competitive-focused' },
  '겁재': { description: '변화와 경쟁 의식이 활발한', type: 'competitive-focused' },
  '식신': { description: '재능과 표현력이 빛나는', type: 'creative-focused' },
  '상관': { description: '창의적 혁신이 강조되는', type: 'creative-focused' },
  '편재': { description: '사업적 확장이 유리한', type: 'wealth-focused' },
  '정재': { description: '안정적 재물 흐름의', type: 'wealth-focused' },
  '편관': { description: '도전과 책임이 커지는', type: 'authority-focused' },
  '정관': { description: '명예와 위상이 높아지는', type: 'authority-focused' },
  '편인': { description: '분석과 통찰이 깊어지는', type: 'thinking-first' },
  '정인': { description: '학습과 지원이 활성화되는', type: 'thinking-first' },
};

/**
 * 운의 작동 방식 상세 데이터
 */
const YEAR_MECHANISM_DATA: Record<YearMechanism['type'], Omit<YearMechanism, 'type'>> = {
  'thinking-first': {
    description: '감정보다 판단과 분석이 먼저 작동하는 해',
    advantage: ['분석력 향상', '기획력 강화', '지식 축적'],
    risk: ['결정 지연', '과도한 고민', '실행력 부족']
  },
  'action-first': {
    description: '생각보다 몸이 먼저 움직이는 해',
    advantage: ['실행력 향상', '순발력 강화', '새로운 경험'],
    risk: ['성급한 판단', '준비 부족', '충동적 행동']
  },
  'relationship-focused': {
    description: '인간관계가 운의 핵심이 되는 해',
    advantage: ['인맥 확장', '협력 기회', '소통 능력 향상'],
    risk: ['타인 의존', '관계 피로', '경계 흐림']
  },
  'wealth-focused': {
    description: '재물과 사업이 중심이 되는 해',
    advantage: ['수익 기회', '사업 확장', '재테크 안목'],
    risk: ['과도한 욕심', '리스크 증가', '균형 상실']
  },
  'authority-focused': {
    description: '책임과 권한이 커지는 해',
    advantage: ['리더십 발휘', '승진 기회', '사회적 인정'],
    risk: ['업무 과중', '스트레스 증가', '완벽주의']
  },
  'creative-focused': {
    description: '창의성과 표현력이 빛나는 해',
    advantage: ['아이디어 폭발', '재능 발휘', '예술적 감각'],
    risk: ['현실 괴리', '수익 연결 어려움', '에너지 분산']
  },
  'competitive-focused': {
    description: '경쟁과 자기주장이 강해지는 해',
    advantage: ['추진력 향상', '자신감 상승', '독립심 강화'],
    risk: ['충돌 증가', '고립 위험', '과도한 경쟁심']
  }
};

/**
 * 흔히 겪는 실수 패턴 데이터
 */
const COMMON_MISTAKE_DATA: Record<YearMechanism['type'], CommonMistake> = {
  'thinking-first': {
    title: '생각만 하다 타이밍을 놓치기 쉬운 해',
    situations: [
      '중요한 결정을 계속 뒤로 미룸',
      '완벽한 조건이 갖춰질 때까지 기다림',
      '주변 피드백 없이 혼자 고민만 반복',
      '정보 수집에만 몰두하고 실행은 미룸'
    ]
  },
  'action-first': {
    title: '충동적으로 움직이다 후회하기 쉬운 해',
    situations: [
      '충분한 검토 없이 계약이나 투자 결정',
      '감정적으로 관계를 끊거나 시작함',
      '장기적 계획 없이 단기 성과만 추구',
      '주변 조언을 무시하고 독단적으로 행동'
    ]
  },
  'relationship-focused': {
    title: '타인에게 휘둘리기 쉬운 해',
    situations: [
      '상대방 눈치를 보다 내 의견을 잃어버림',
      '불필요한 모임과 약속으로 에너지 소진',
      '인간관계에 매몰되어 본업을 소홀히 함',
      '거절하지 못해 부담을 떠안음'
    ]
  },
  'wealth-focused': {
    title: '욕심에 눈이 멀어 균형을 잃기 쉬운 해',
    situations: [
      '과도한 투자로 원금까지 위험에 빠뜨림',
      '돈 앞에서 중요한 관계를 소홀히 함',
      '일확천금을 노리다 사기 피해를 봄',
      '건강과 가족을 뒷전에 두고 돈만 좇음'
    ]
  },
  'authority-focused': {
    title: '완벽주의에 빠져 지치기 쉬운 해',
    situations: [
      '모든 일을 혼자 처리하려다 번아웃',
      '작은 실수에도 자책하며 자신감 저하',
      '부하나 동료에게 너무 높은 기준 요구',
      '휴식 없이 일만 하다 건강 악화'
    ]
  },
  'creative-focused': {
    title: '현실과 동떨어진 이상만 좇기 쉬운 해',
    situations: [
      '수익 모델 없이 창작에만 몰두',
      '여러 프로젝트를 동시에 벌려 완성 못함',
      '비판에 예민하게 반응하며 상처받음',
      '자유로움을 빌미로 책임을 회피함'
    ]
  },
  'competitive-focused': {
    title: '불필요한 경쟁으로 적을 만들기 쉬운 해',
    situations: [
      '이기려는 마음에 불필요한 갈등 유발',
      '협력이 필요한 상황에서도 혼자 가려 함',
      '남과 비교하며 열등감이나 우월감에 휩쓸림',
      '승부욕에 집착해 본질을 놓침'
    ]
  }
};

/**
 * 오행별 건강 정보
 */
const HEALTH_BY_ELEMENT: Record<string, { organ: string; bodyPart: string; warning: string; advice: string }> = {
  'wood': { organ: '간, 담', bodyPart: '눈, 근육, 손발톱', warning: '간 질환, 근육통, 눈 피로', advice: '충분한 수면과 눈 휴식이 필요합니다. 간에 무리가 가지 않도록 음주를 줄이세요.' },
  'fire': { organ: '심장, 소장', bodyPart: '혀, 혈관, 얼굴', warning: '심장 질환, 혈압, 불면증', advice: '과도한 흥분과 스트레스를 피하고, 규칙적인 유산소 운동으로 심폐 기능을 관리하세요.' },
  'earth': { organ: '비장, 위장', bodyPart: '입술, 소화기', warning: '소화 장애, 체중 변화', advice: '규칙적인 식사와 소화가 잘 되는 음식 위주로 섭취하세요. 과식을 피하세요.' },
  'metal': { organ: '폐, 대장', bodyPart: '코, 피부, 호흡기', warning: '호흡기 질환, 피부 트러블', advice: '실내 환기를 자주 하고, 피부 보습에 신경 쓰세요. 깊은 호흡 연습이 도움됩니다.' },
  'water': { organ: '신장, 방광', bodyPart: '귀, 뼈, 생식기', warning: '신장 질환, 관절 통증, 냉증', advice: '수분 섭취를 충분히 하고, 하체를 따뜻하게 유지하세요. 과로를 피하세요.' }
};

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
 * 받침 유무 확인
 */
function hasBatchim(str: string): boolean {
  if (!str || str.length === 0) return false;
  const lastChar = str[str.length - 1];
  const code = lastChar.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return false; // 한글이 아닌 경우
  return (code - 0xAC00) % 28 !== 0;
}

/**
 * '로/으로' 조사 처리
 */
function josaRo(word: string): string {
  return hasBatchim(word) ? '으로' : '로';
}

/**
 * '에서' 조사 처리 (받침 유무와 관계없이 동일)
 */
function josaEseo(_word: string): string {
  return '에서';
}

/**
 * 형용사형 어미로 끝나는지 확인하고 적절한 명사 추가
 */
function addNounIfNeeded(text: string): string {
  // "~는", "~은", "~는" 등으로 끝나는 경우 "것" 또는 "시기" 추가
  if (text.endsWith('는') || text.endsWith('은') || text.endsWith('는')) {
    return `${text} 시기`;
  }
  return text;
}

/**
 * 운의 작동 방식 계산
 */
function calculateYearMechanism(dominantTengod: string): YearMechanism {
  const mapping = TENGOD_FRIENDLY_MAP[dominantTengod];
  const type = mapping?.type || 'thinking-first';
  const data = YEAR_MECHANISM_DATA[type];
  
  return {
    type,
    description: data.description,
    advantage: data.advantage,
    risk: data.risk
  };
}

/**
 * 흔히 겪는 실수 패턴 계산
 */
function calculateCommonMistake(dominantTengod: string, event: EventType): CommonMistake {
  const mapping = TENGOD_FRIENDLY_MAP[dominantTengod];
  const type = mapping?.type || 'thinking-first';
  const baseMistake = COMMON_MISTAKE_DATA[type];
  
  // 이벤트에 따른 추가 상황
  let additionalSituation = '';
  switch (event) {
    case '충':
      additionalSituation = '주변 환경의 급격한 변화에 휘둘려 판단력을 잃음';
      break;
    case '형':
      additionalSituation = '자기 파괴적인 패턴을 반복하며 스스로를 지치게 함';
      break;
    case '합':
      additionalSituation = '좋은 기회를 앞에 두고도 망설이다 놓침';
      break;
    case '파':
    case '해':
    case '없음':
    default:
      additionalSituation = '';
      break;
  }
  
  return {
    title: baseMistake.title,
    situations: additionalSituation 
      ? [...baseMistake.situations.slice(0, 3), additionalSituation]
      : baseMistake.situations
  };
}

/**
 * 건강운 계산
 */
function calculateHealthFortune(
  saju: SajuData,
  event: EventType,
  isYongshinYear: boolean,
  isGishinYear: boolean
): FortuneAreaBase {
  // 부족하거나 과다한 오행 확인
  const lackElement = saju.ohaengAnalysis.missing[0] || saju.ohaengAnalysis.deficient[0];
  const excessElement = saju.ohaengAnalysis.excess[0];
  
  // 기본 점수 계산
  let score = 3;
  switch (true) {
    case isYongshinYear:
      score += 1;
      break;
    case isGishinYear:
      score -= 1;
      break;
  }
  
  switch (event) {
    case '충':
    case '형':
      score -= 1;
      break;
    case '합':
      score += 1;
      break;
    default:
      break;
  }
  
  if (saju.ohaengAnalysis.missing.length === 0) {
    score += 1;
  }
  
  // 점수 정규화 (1-5)
  const normalizedScore = Math.min(5, Math.max(1, score));
  const percentScore = normalizedScore * 20;
  
  // 부족/과다 오행에 따른 건강 정보
  const lackOhaeng = lackElement ? getOhaengFromKorean(lackElement) : null;
  const excessOhaeng = excessElement ? getOhaengFromKorean(excessElement) : null;
  
  const lackHealth = lackOhaeng ? HEALTH_BY_ELEMENT[lackOhaeng] : null;
  const excessHealth = excessOhaeng ? HEALTH_BY_ELEMENT[excessOhaeng] : null;
  
  // 세운 오행 (화기)에 따른 추가 주의사항
  const yearElement = getOhaeng(YEAR_JI); // 午 = fire
  const yearHealth = yearElement ? HEALTH_BY_ELEMENT[yearElement] : null;
  
  let pros = '2026년 병오년은 화기(火氣)가 강한 해로, 활력과 에너지가 상승합니다.';
  let cons = '';
  let strategy = '';
  let summary = '';
  let focus = '';
  
  switch (true) {
    case normalizedScore >= 4:
      summary = '전반적으로 건강한 한 해';
      focus = '꾸준한 관리';
      pros = '신체 에너지가 충만하고 활동적인 한 해입니다. 새로운 운동이나 건강 습관을 시작하기에 좋습니다.';
      break;
    case normalizedScore >= 3:
      summary = '관리가 필요한 한 해';
      focus = '균형 유지';
      pros = '기본적인 건강은 유지되나, 과로하지 않도록 주의가 필요합니다.';
      break;
    default:
      summary = '건강에 특히 신경 써야 할 해';
      focus = '휴식과 회복';
      pros = '몸이 보내는 신호에 귀 기울이세요. 작은 증상도 무시하지 마세요.';
      break;
  }
  
  // 주의사항 조합
  const warnings: string[] = [];
  if (yearHealth) warnings.push(yearHealth.warning);
  if (excessHealth && excessOhaeng !== yearElement) warnings.push(excessHealth.warning);
  if (lackHealth) warnings.push(`${lackElement} 부족으로 인한 ${lackHealth.warning}`);
  
  cons = warnings.length > 0 
    ? `특히 주의할 부분: ${warnings.slice(0, 2).join(', ')}`
    : '특별히 주의할 질환은 없으나, 무리하지 않는 것이 좋습니다.';
  
  // 조언
  const advices: string[] = [];
  if (yearHealth) advices.push(yearHealth.advice);
  if (lackHealth) advices.push(lackHealth.advice);
  
  strategy = advices.length > 0 
    ? advices[0] 
    : '규칙적인 생활 습관과 적절한 운동으로 건강을 유지하세요.';
  
  return {
    score: percentScore,
    summary,
    focus,
    pros,
    cons,
    strategy
  };
}

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
  const isYongshinYear = Boolean(yongshinElement && (yearGanElement === yongshinElement || yearJiElement === yongshinElement));
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
    let found = false;
    switch (b.ji) {
      case '子':
        event = '충';
        palace = b.type;
        found = true;
        break; // 자오충
      case '戌':
      case '寅':
        event = '합';
        palace = b.type;
        found = true;
        break; // 인오술 합
      case '午':
        event = '형';
        palace = b.type;
        found = true;
        break; // 오오형
      case '卯':
        event = '파';
        palace = b.type;
        found = true;
        break; // 오묘파
      case '丑':
        event = '해';
        palace = b.type;
        found = true;
        break; // 축오해
      default:
        break;
    }
    if (found) break;
  }

  // 3. Ohaeng Excess/Lack
  const ohaengExcess = sajuData.ohaengAnalysis.excess[0];
  const ohaengLack = sajuData.ohaengAnalysis.missing[0] || sajuData.ohaengAnalysis.deficient[0];

  // 4. Quality & Pace
  let quality: 'stable' | 'volatile' | 'mixed' = 'mixed';
  switch (event) {
    case '충':
    case '형':
      quality = 'volatile';
      break;
    case '합':
      quality = 'stable';
      break;
    default:
      quality = 'mixed';
      break;
  }

  let pace: 'fast' | 'slow' = 'slow';
  switch (true) {
    case event === '충':
    case dominantTengod === '상관':
    case dominantTengod === '겁재':
      pace = 'fast';
      break;
    default:
      pace = 'slow';
      break;
  }

  // 5. Theme & Guide Type
  const themeMap: Record<string, string> = {
    '비견': '독립', '겁재': '변화', '식신': '생산', '상관': '혁신',
    '편재': '확장', '정재': '안정', '편관': '도전', '정관': '명예',
    '편인': '통찰', '정인': '수렴'
  };
  const theme = themeMap[dominantTengod] || '균형';
  
  let guideType: 'push' | 'manage' | 'defense' | 'reset' = 'manage';
  switch (event) {
    case '충':
      guideType = 'reset';
      break;
    default:
      switch (dominantTengod) {
        case '편재':
        case '상관':
        case '겁재':
          guideType = 'push';
          break;
        default:
          guideType = 'manage';
          break;
      }
      break;
  }

  // 6. Detailed Interpretation Logic (용신/기신 정보 포함)
  const interpretation = getExpertInterpretation(dominantTengod, supportTengod, event, palace, ohaengExcess, ohaengLack, sajuData, isYongshinYear, isGishinYear, yongshin);

  // 6-1. 운의 작동 방식 (신규)
  const yearMechanism = calculateYearMechanism(dominantTengod);
  
  // 6-2. 흔히 겪는 실수 패턴 (신규)
  const commonMistake = calculateCommonMistake(dominantTengod, event);
  
  // 6-3. 건강운 (신규)
  const healthFortune = calculateHealthFortune(sajuData, event, isYongshinYear, isGishinYear);

  // 7. Key Months (주요 월) - 사용자 피드백에 따라 주요 월만 표시
  const keyMonths = calculateKeyMonths(sajuData, dominantTengod, event);
  
  // 7-1. All Months (전체 12개월 월운 분석)
  const allMonths = calculateAllMonths(sajuData, isYongshinYear, isGishinYear, yongshin);

  // 8. Lucky Info (행운 정보) - 용신 오행 기반
  const luckyInfo = calculateLuckyInfo(sajuData, yongshin);

  // 9. 사용자 친화적 표현 생성
  const dominantFriendly = TENGOD_FRIENDLY_MAP[dominantTengod]?.description || dominantTengod;
  const supportFriendly = TENGOD_FRIENDLY_MAP[supportTengod]?.description || supportTengod;

  // 10. 작년 점수 계산 및 비교 분석
  const currentScore = calculateDynamicScore(dominantTengod, event, sajuData, isYongshinYear, isGishinYear);
  const previousYearData = calculatePreviousYearScore(sajuData);
  const currentYearData = {
    score: currentScore,
    dominantTengod,
    supportTengod,
    event,
    isYongshinYear,
    isGishinYear
  };
  const comparison = analyzeYearComparison(previousYearData, currentYearData);

  return {
    year: CURRENT_YEAR,
    gan: YEAR_GAN,
    ji: YEAR_JI,
    yearSummary: {
      score: currentScore,
      summaryText: interpretation.summary,
      reason: interpretation.reasons,
      comparison
    },
    yearNature: (() => {
      const paceText = pace === 'fast' ? '빠르고 ' : '차분하고 ';
      const qualityText = quality === 'volatile' ? '변동성이 큰 ' : '안정적인 ';
      return `${paceText}${qualityText}해`;
    })(),
    yearMechanism,
    commonMistake,
    fortuneAreas: {
      ...interpretation.areas,
      health: healthFortune
    },
    keyMonths,
    allMonths,
    fortuneGuide: interpretation.guide,
    expertMeta: {
      fortuneType: `${dominantTengod} 주도의 ${theme} 테마`,
      fortuneTypeDescription: `${dominantFriendly} 해`,
      warningLevel: (() => {
        switch (event) {
          case '충':
          case '형':
            return 'high';
          case '합':
          case '파':
          case '해':
            return 'medium';
          case '없음':
          default:
            return 'low';
        }
      })(),
      recommendedActivities: interpretation.guide.do
    },
    analysisTags: {
      dominantTengod,
      dominantTengodFriendly: dominantFriendly,
      supportTengod,
      supportTengodFriendly: supportFriendly,
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
  switch (true) {
    case isYongshinYear && !!yongshin:
      summary = `${CURRENT_YEAR}년은 용신 ${yongshin.primary}이 들어오는 해로, 전반적으로 운세가 상승합니다. <br />${josa(dominant, '이/가')} 주도하는 해로, 내면에 잠들어 있던 목표의식이 현실화되는 역동적인 해입니다.`;
      break;
    case isGishinYear && !!yongshin:
      summary = `${CURRENT_YEAR}년은 기신 ${yongshin.gishin?.[0] || ''}이 강한 해로, 신중한 처신이 필요합니다. <br />${josa(dominant, '이/가')} 주도하는 해로, 변화에 대비하며 신중하게 나아가야 합니다.`;
      break;
    default:
      summary = `${josa(dominant, '이/가')} 주도하는 해로, 내면에 잠들어 있던 목표의식이 현실화되는 역동적인 해입니다.`;
      break;
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
  
  // 점수에 따른 summary/focus 결정
  const moneyNormalized = Math.min(5, Math.max(1, Math.round(moneyScore / 20)));
  let moneySummary = '';
  let moneyFocus = '';
  switch (true) {
    case moneyNormalized >= 4:
      moneySummary = '재물 흐름이 좋은 해';
      moneyFocus = '적극적인 투자';
      break;
    case moneyNormalized >= 3:
      moneySummary = '들어오지만 관리가 필요한 흐름';
      moneyFocus = '지출 구조 개선';
      break;
    default:
      moneySummary = '지출 관리에 신경 써야 할 해';
      moneyFocus = '안정적인 자산 관리';
      break;
  }
  
  let moneyPros = '';
  switch (dominant) {
    case '식신':
    case '상관':
      moneyPros = "나의 전문 기술이나 창의적인 아이디어가 시장에서 인정받으며 실질적인 수익으로 연결될 가능성이 매우 높습니다.";
      break;
    default:
      moneyPros = `${TENGOD_FRIENDLY_MAP[dominant]?.description || dominant} 시기로, 활동 범위가 넓어지며 새로운 수익원 창출에 유리한 흐름입니다.`;
      break;
  }

  let moneyCons = '';
  switch (event) {
    case '충':
    case '형':
      moneyCons = "운의 기복이 심해지는 시기이므로, 벌어들이는 것만큼 나가는 지출(경쟁 비용, 충동 소비) 관리에 특별히 신경 써야 합니다.";
      break;
    default:
      moneyCons = "지엽적인 성과에 만족하여 큰 자산의 흐름을 놓치지 않도록 주의가 필요합니다.";
      break;
  }

  let moneyStrategy = '';
  switch (true) {
    case dominant.includes('재'):
      moneyStrategy = "단기적인 시세 차익보다는 나의 '몸값'을 높이거나 장기적인 자산 가치에 집중하는 전략이 유효합니다.";
      break;
    default:
      moneyStrategy = "수익의 일정 부분을 반드시 안전 자산으로 묶어두어 운의 변동성에 대비하세요.";
      break;
  }

  const money: FortuneAreaBase = {
    score: moneyScore,
    summary: moneySummary,
    focus: moneyFocus,
    pros: moneyPros,
    cons: moneyCons,
    strategy: moneyStrategy
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
  
  const relationshipNormalized = Math.min(5, Math.max(1, Math.round(relationshipScore / 20)));
  let relationshipSummary = '';
  let relationshipFocus = '';
  switch (true) {
    case relationshipNormalized >= 4:
      relationshipSummary = '인연이 열리는 해';
      relationshipFocus = '새로운 만남';
      break;
    case relationshipNormalized >= 3:
      relationshipSummary = '관계는 유지되나 표현이 줄어듦';
      relationshipFocus = '능동적인 감정 전달';
      break;
    default:
      relationshipSummary = '관계에 신경 써야 할 해';
      relationshipFocus = '소통 강화';
      break;
  }
  
  let relationshipPros = '';
  switch (event) {
    case '합':
      relationshipPros = "주변 사람들과의 깊은 유대감이 형성되며, 나를 지지해주는 든든한 아군이나 귀한 인연을 만날 수 있는 운입니다.";
      break;
    default:
      relationshipPros = "자신감이 고취되면서 호감 있는 상대에게 본인의 매력을 자연스럽게 어필하기 좋은 시기입니다.";
      break;
  }

  let relationshipCons = '';
  switch (true) {
    case event === '충' && (palace === '일' || palace === '월'):
      relationshipCons = "가까운 지인이나 배우자와의 소통 과정에서 예기치 못한 오해가 발생하거나 날카로운 언쟁이 생길 수 있으니 주의하세요.";
      break;
    default:
      relationshipCons = "내 주장이 강해지는 해인 만큼, 타인의 조언을 간과하여 고립될 수 있는 점은 경계해야 합니다.";
      break;
  }

  const relationship: FortuneAreaBase = {
    score: relationshipScore,
    summary: relationshipSummary,
    focus: relationshipFocus,
    pros: relationshipPros,
    cons: relationshipCons,
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
  
  const careerNormalized = Math.min(5, Math.max(1, Math.round(careerScore / 20)));
  let careerSummary = '';
  let careerFocus = '';
  switch (true) {
    case careerNormalized >= 4:
      careerSummary = '평가와 결과가 따라오는 해';
      careerFocus = '새로운 기회 선택';
      break;
    case careerNormalized >= 3:
      careerSummary = '안정적인 성장의 해';
      careerFocus = '내실 다지기';
      break;
    default:
      careerSummary = '신중한 처신이 필요한 해';
      careerFocus = '현상 유지';
      break;
  }
  
  let careerPros = '';
  switch (true) {
    case support.includes('관'):
    case support.includes('인'):
      careerPros = "윗사람의 원조나 조직의 인정을 바탕으로 본인의 입지가 탄탄해지며 승진이나 합격의 기운이 강하게 따릅니다.";
      break;
    default:
      careerPros = "실행력이 뛰어난 한 해로, 추진하던 프로젝트가 구체적인 성과물로 나타나 대중의 이목을 끌게 됩니다.";
      break;
  }

  let careerCons = '';
  switch (event) {
    case '형':
    case '파':
      careerCons = "조직 내의 복잡한 권력 관계나 시스템상의 문제로 인해 업무적 피로도가 급격히 상승할 수 있습니다.";
      break;
    default:
      careerCons = "의욕이 앞서 본인의 역량을 초과한 업무를 떠맡아 번아웃이 올 수 있으니 완급 조절이 필수입니다.";
      break;
  }

  const career: FortuneAreaBase = {
    score: careerScore,
    summary: careerSummary,
    focus: careerFocus,
    pros: careerPros,
    cons: careerCons,
    strategy: "말로 싸우기보다 압도적인 결과물로 본인의 가치를 증명하는 전략이 가장 효과적입니다."
  };

  // 4. Self-Growth
  let selfGrowthScore = 80;
  switch (true) {
    case isYongshinYear:
      selfGrowthScore = 90;
      break;
    case isGishinYear:
      selfGrowthScore = 60;
      break;
    default:
      selfGrowthScore = 80;
      break;
  }

  const selfGrowthNormalized = Math.min(5, Math.max(1, Math.round(selfGrowthScore / 20)));
  let selfGrowthSummary = '';
  let selfGrowthFocus = '';
  switch (true) {
    case selfGrowthNormalized >= 4:
      selfGrowthSummary = '공부와 정리에 최적화된 해';
      selfGrowthFocus = '지식 축적 및 자격 취득';
      break;
    case selfGrowthNormalized >= 3:
      selfGrowthSummary = '꾸준한 성장이 가능한 해';
      selfGrowthFocus = '습관 개선';
      break;
    default:
      selfGrowthSummary = '내면 정비가 필요한 해';
      selfGrowthFocus = '자기 이해';
      break;
  }
  
  let selfGrowthCons = '';
  switch (lack) {
    case '수':
    case '금':
      selfGrowthCons = "열정이 과하여 정서적인 고갈이나 예민함이 커질 수 있으니 명상이나 정적인 취미로 열기를 식히는 노력이 필요합니다.";
      break;
    default:
      selfGrowthCons = "생각은 원대하나 실행이 지연될 수 있으므로, 결과물이 남는 작은 실천부터 시작하는 습관을 가져야 합니다.";
      break;
  }

  const selfGrowth: FortuneAreaBase = {
    score: selfGrowthScore,
    summary: selfGrowthSummary,
    focus: selfGrowthFocus,
    pros: "무언가에 미친 듯이 몰입할 수 있는 강한 집중력이 생기며, 새로운 전문 분야를 배우거나 자격증을 따기에 최적의 타이밍입니다.",
    cons: selfGrowthCons,
    strategy: "분출되는 아이디어가 흩어지지 않도록 매일의 성취를 '기록'하여 내면의 힘을 단단하게 구축하세요."
  };

  // 사용자 친화적 표현으로 변환
  const dominantFriendly = TENGOD_FRIENDLY_MAP[dominant]?.description || dominant;
  
  return {
    summary,
    reasons,
    areas: { money, relationship, career, selfGrowth },
    guide: {
      do: [
        `${dominantFriendly} 시기의 긍정적인 추진력 활용하기`,
        (() => {
          switch (event) {
            case '충':
              return "과감하게 주변 환경 정리하고 비우기";
            default:
              return "현재의 좋은 질서를 유지하며 내실 다지기";
          }
        })(),
        "자신감을 바탕으로 능동적으로 제안하기"
      ],
      dont: [
        `${dominantFriendly} 시기에 나타나는 부정적 고집 경계하기`,
        "결과가 보이지 않는 일에 무리하게 집착하기",
        (() => {
          switch (lack) {
            case '수':
              return "충분한 휴식 없이 자신을 몰아붙이기";
            default:
              return "타인의 시선을 지나치게 의식하여 위축되기";
          }
        })()
      ],
      keywords: [
        dominantFriendly,
        TENGOD_FRIENDLY_MAP[support]?.description || support,
        (() => {
          switch (event) {
            case '없음':
              return '안정';
            default:
              return event;
          }
        })()
      ]
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
  
  // 십성 길흉도 반영
  switch (dominant) {
    case '식신':
    case '정재':
    case '정관':
    case '정인':
      score += 10;
      break;
    default:
      break;
  }
  
  // 이벤트 반영
  switch (event) {
    case '충':
      score -= 5;
      break;
    default:
      break;
  }
  
  // 오행 균형도 반영
  if (saju.ohaengAnalysis.missing.length === 0) {
    score += 5; // Balanced chart
  }
  
  // 용신/기신 반영
  switch (true) {
    case isYongshinYear:
      score += 10; // 용신 해는 운세 상승
      break;
    case isGishinYear:
      score -= 10; // 기신 해는 주의 필요
      break;
    default:
      break;
  }
  
  return Math.min(95, Math.max(45, score));
}

/**
 * 작년(2025년) 총운 점수 계산
 */
function calculatePreviousYearScore(sajuData: SajuData): {
  score: number;
  dominantTengod: string;
  supportTengod: string;
  event: EventType;
  isYongshinYear: boolean;
  isGishinYear: boolean;
} {
  const dayMaster = sajuData.day.ganHan;
  const yongshin = sajuData.yongshin;
  const yongshinElement = yongshin ? getOhaengFromKorean(yongshin.primary) : null;
  const gishinElements = yongshin?.gishin?.map(g => getOhaengFromKorean(g)) || [];

  // 작년 세운 오행 확인
  const prevYearGanElement = getOhaeng(PREVIOUS_YEAR_GAN);
  const prevYearJiElement = getOhaeng(PREVIOUS_YEAR_JI);
  const isYongshinYear = Boolean(yongshinElement && (prevYearGanElement === yongshinElement || prevYearJiElement === yongshinElement));
  const isGishinYear = gishinElements.some(g => g === prevYearGanElement || g === prevYearJiElement);

  // 작년 십성 계산
  const dominantTengod = calculateSipsin(dayMaster, PREVIOUS_YEAR_JI);
  const supportTengod = calculateSipsin(dayMaster, PREVIOUS_YEAR_GAN);

  // 작년 이벤트 감지 (사(巳)와 원국 지지의 관계)
  const branches = [
    { type: '년' as PalaceType, ji: sajuData.year.jiHan },
    { type: '월' as PalaceType, ji: sajuData.month.jiHan },
    { type: '일' as PalaceType, ji: sajuData.day.jiHan },
    { type: '시' as PalaceType, ji: sajuData.hour.jiHan }
  ];

  let event: EventType = '없음';
  for (const b of branches) {
    let found = false;
    switch (b.ji) {
      case '亥':
        event = '충'; // 사해충
        found = true;
        break;
      case '申':
        event = '형'; // 사신형
        found = true;
        break;
      case '酉':
      case '丑':
        event = '합'; // 사유축 합
        found = true;
        break;
      case '寅':
        event = '해'; // 사인해
        found = true;
        break;
      default:
        break;
    }
    if (found) break;
  }

  const score = calculateDynamicScore(dominantTengod, event, sajuData, isYongshinYear, isGishinYear);

  return {
    score,
    dominantTengod,
    supportTengod,
    event,
    isYongshinYear,
    isGishinYear
  };
}

/**
 * 작년과 올해 비교 분석
 */
function analyzeYearComparison(
  prevData: {
    score: number;
    dominantTengod: string;
    supportTengod: string;
    event: EventType;
    isYongshinYear: boolean;
    isGishinYear: boolean;
  },
  currentData: {
    score: number;
    dominantTengod: string;
    supportTengod: string;
    event: EventType;
    isYongshinYear: boolean;
    isGishinYear: boolean;
  }
): { previousScore: number; currentScore: number; scoreDiff: number; trend: 'up' | 'down' | 'same'; changeReasons: string[] } {
  const scoreDiff = currentData.score - prevData.score;
  const trend = scoreDiff > 0 ? 'up' : scoreDiff < 0 ? 'down' : 'same';

  const changeReasons: string[] = [];

  // 용신/기신 변화
  if (prevData.isYongshinYear && currentData.isGishinYear) {
    changeReasons.push('용신 해에서 기신 해로 전환');
  } else if (prevData.isGishinYear && currentData.isYongshinYear) {
    changeReasons.push('기신 해에서 용신 해로 전환');
  } else if (!prevData.isYongshinYear && currentData.isYongshinYear) {
    changeReasons.push('용신 해로 전환');
  } else if (!prevData.isGishinYear && currentData.isGishinYear) {
    changeReasons.push('기신 해로 전환');
  }

  // 십성 변화
  if (prevData.dominantTengod !== currentData.dominantTengod) {
    const prevFriendly = TENGOD_FRIENDLY_MAP[prevData.dominantTengod]?.description || prevData.dominantTengod;
    const currentFriendly = TENGOD_FRIENDLY_MAP[currentData.dominantTengod]?.description || currentData.dominantTengod;
    const prevText = addNounIfNeeded(prevFriendly);
    const currentText = addNounIfNeeded(currentFriendly);
    changeReasons.push(`${prevText}${josaEseo(prevText)} ${currentText}${josaRo(currentText)} 변화`);
  }

  // 이벤트 변화
  if (prevData.event !== currentData.event) {
    if (prevData.event === '없음' && currentData.event !== '없음') {
      changeReasons.push(`${currentData.event}${josa(currentData.event, '이/가')} 작용 추가`);
    } else if (prevData.event !== '없음' && currentData.event === '없음') {
      changeReasons.push(`${prevData.event}${josa(prevData.event, '이/가')} 작용 해소`);
    } else {
      changeReasons.push(`${prevData.event}${josaEseo(prevData.event)} ${currentData.event}${josaRo(currentData.event)} 변화`);
    }
  }

  // 점수 변화가 크지만 명확한 이유가 없는 경우
  if (changeReasons.length === 0 && Math.abs(scoreDiff) >= 5) {
    if (scoreDiff > 0) {
      changeReasons.push('전반적인 운세 상승');
    } else {
      changeReasons.push('전반적인 운세 하락');
    }
  }

  return {
    previousScore: prevData.score,
    currentScore: currentData.score,
    scoreDiff,
    trend,
    changeReasons
  };
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

  // 십성을 육친으로 변환하는 매핑
  const sipsinToYukchin: Record<string, '재성' | '관성' | '인성' | '식상' | '비겁'> = {
    '비견': '비겁',
    '겁재': '비겁',
    '식신': '식상',
    '상관': '식상',
    '편재': '재성',
    '정재': '재성',
    '편관': '관성',
    '정관': '관성',
    '편인': '인성',
    '정인': '인성',
  };

  // 세운 십성이 해당 육친에 해당하면 (+1)
  const yearGanYukchin = sipsinToYukchin[yearGanSipsin];
  const yearJiYukchin = sipsinToYukchin[yearJiSipsin];
  if (yearGanYukchin === targetYukchin || yearJiYukchin === targetYukchin) {
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

    switch (true) {
      case normalizedScore >= 4:
        theme = '좋은 달';
        advice = '운세가 상승하는 시기입니다. 중요한 결정이나 새로운 시작에 좋습니다.';
        break;
      case normalizedScore >= 3:
        theme = '보통 달';
        advice = '안정적인 시기입니다. 꾸준한 노력으로 발전할 수 있습니다.';
        break;
      case normalizedScore >= 2:
        theme = '주의 달';
        advice = '신중한 처신이 필요한 시기입니다. 큰 결정은 피하는 것이 좋습니다.';
        break;
      default:
        theme = '어려운 달';
        advice = '운세가 불리한 시기입니다. 인내심을 갖고 조심스럽게 나아가세요.';
        break;
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
