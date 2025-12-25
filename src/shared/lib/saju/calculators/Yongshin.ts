import { Yongshin, IlganStrength, SajuData } from '../../../../entities/saju/model/types';
import { getOhaeng, Element } from './TenGod';

const GENERATING_MAP: Record<Element, Element> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood'
};
const CONTROLLING_MAP: Record<Element, Element> = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood'
};

const ELEMENT_TO_KOREAN: Record<Element, string> = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};

const YONGSHIN_CONFIG = {
  // 오행 불균형 임계값
  MISSING_THRESHOLD: 0.35,
  DEFICIENT_THRESHOLD: 0.70,
  EXCESS_THRESHOLD: 1.60,

  // 우선순위 델타
  EXTREME_SEASON_DELTA: 1.2, // 여름/겨울
  NORMAL_SEASON_DELTA: 2.0,  // 봄/가을
  CLOSE_SCORE_MARGIN: 0.8,   // “근접” 판정

  // 신뢰도(점수 차)
  CONFIDENCE_HIGH: 3.0,
  CONFIDENCE_MEDIUM: 1.5,
} as const;


type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type OhaengAnalysis = { excess: string[]; deficient: string[]; missing: string[] };
type Scored = { element: Element; score: number };

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function getSeason(monthJi: string): Season {
  const spring = ['寅', '卯', '辰'];
  const summer = ['巳', '午', '未'];
  const autumn = ['申', '酉', '戌'];
  const winter = ['亥', '子', '丑'];

  if (spring.includes(monthJi)) return 'spring';
  if (summer.includes(monthJi)) return 'summer';
  if (autumn.includes(monthJi)) return 'autumn';
  return 'winter';
}

function invGenerating(day: Element): Element {
  const found = (Object.keys(GENERATING_MAP) as Element[]).find(e => GENERATING_MAP[e] === day);
  return found ?? 'water';
}

function invControlling(day: Element): Element {
  const found = (Object.keys(CONTROLLING_MAP) as Element[]).find(e => CONTROLLING_MAP[e] === day);
  return found ?? 'metal';
}

const HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '戊', '庚'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

function weightHiddenStem(idx: number): number {
  if (idx === 0) return 0.9;
  if (idx === 1) return 0.5;
  return 0.3;
}

function computeElementScores(saju: SajuData): Record<Element, number> {
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  const scores: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  const add = (e: Element | null | undefined, w: number) => {
    if (!e) return;
    scores[e] += w;
  };

  for (const p of pillars) {
    if (!p || p.ganHan === '?') continue;
    const isMonth = p === saju.month;

    add(getOhaeng(p.ganHan) as Element, 1.0);

    const jiW = isMonth ? 1.5 * 2.0 : 1.5;
    add(getOhaeng(p.jiHan) as Element, jiW);

    const hs = HIDDEN_STEMS[p.jiHan] ?? [];
    for (let i = 0; i < hs.length; i++) {
      const stem = hs[i];
      const w = weightHiddenStem(i) * (isMonth ? 2.0 : 1.0);
      add(getOhaeng(stem) as Element, w);
    }
  }
  return scores;
}

function deriveOhaengAnalysisFromScores(scores: Record<Element, number>): OhaengAnalysis {
  const vals = Object.values(scores);
  const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);

  const missing: string[] = [];
  const deficient: string[] = [];
  const excess: string[] = [];

  (Object.keys(scores) as Element[]).forEach(e => {
    const s = scores[e];
    const k = ELEMENT_TO_KOREAN[e];

    if (s < avg * YONGSHIN_CONFIG.MISSING_THRESHOLD) missing.push(k);
    else if (s < avg * YONGSHIN_CONFIG.DEFICIENT_THRESHOLD) deficient.push(k);
    else if (s > avg * YONGSHIN_CONFIG.EXCESS_THRESHOLD) excess.push(k);

  });

  return { missing, deficient, excess };
}

function countRootsWeighted(saju: SajuData, dayElement: Element): number {
  let roots = 0;

  const pillars = [
    { p: saju.year,  w: 1.0 },
    { p: saju.month, w: 3.0 }, // 월지 최강
    { p: saju.day,   w: 2.5 }, // 일지 강함
    { p: saju.hour,  w: 1.5 },
  ];

  for (const { p, w } of pillars) {
    if (!p || p.jiHan === '?') continue;
    // 1) 지지 본기 통근
    if (getOhaeng(p.jiHan) === dayElement) roots += w;

    // 2) 지장간 통근(본기/중기/여기)
    const hs = HIDDEN_STEMS[p.jiHan] ?? [];
    for (let i = 0; i < hs.length; i++) {
      if (getOhaeng(hs[i]) === dayElement) {
        const hsW = (i === 0) ? 0.8 : (i === 1 ? 0.5 : 0.3);
        roots += hsW * (w / 2); // 지장간은 본기 대비 약하게
      }
    }
  }

  return Number(roots.toFixed(2));
}

function hasKorean(list: string[] | undefined, korean: string): boolean {
  return Array.isArray(list) && list.includes(korean);
}

function imbalanceScore(ohaeng: OhaengAnalysis, element: Element): number {
  const k = ELEMENT_TO_KOREAN[element];
  let s = 0;
  if (hasKorean(ohaeng.missing, k)) s += 4;
  if (hasKorean(ohaeng.deficient, k)) s += 2;
  if (hasKorean(ohaeng.excess, k)) s -= 3;
  return s;
}

function getEokbuCandidates(day: Element, strength: IlganStrength['strength']): Element[] {
  if (strength === 'strong') return dedupe([GENERATING_MAP[day], CONTROLLING_MAP[day], invControlling(day)]);
  if (strength === 'weak') return dedupe([invGenerating(day), day]);
  return dedupe([GENERATING_MAP[day], CONTROLLING_MAP[day], invControlling(day), invGenerating(day), day]);
}

function pickTopTwo(scored: Scored[]): { top: Scored; second?: Scored } | null {
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  if (!sorted.length) return null;
  return { top: sorted[0], second: sorted[1] };
}

function scoreEokbuCandidate(
  cand: Element,
  day: Element,
  strength: IlganStrength['strength'],
  ohaeng: OhaengAnalysis,
  season: Season,
  roots: number,
  elementScores: Record<Element, number>
): number {
  let score = 0;
  score += imbalanceScore(ohaeng, cand);

  const strongSet = new Set(getEokbuCandidates(day, 'strong'));
  const weakSet = new Set(getEokbuCandidates(day, 'weak'));
  if (strength === 'strong' && strongSet.has(cand)) score += 2;
  if (strength === 'weak' && weakSet.has(cand)) score += 2;
  if (strength === 'neutral') score += 1;

  if (strength === 'weak' && roots >= 3) score -= 0.5;
  if (strength === 'strong' && roots <= 1) score -= 0.5;

  const vals = Object.values(elementScores);
  const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  const rel = elementScores[cand] / (avg || 1);
  if (rel < 0.7) score += 0.8;
  if (rel > 1.6) score -= 0.8;

  if (season === 'summer' || season === 'winter') score -= 0.3;
  if (hasKorean(ohaeng.excess, ELEMENT_TO_KOREAN[cand])) score -= 1.5;

  return score;
}

function neededElementBySeason(season: Season, dayElement: Element): Element {
  if (season === 'summer') return 'water'; 
  if (season === 'winter') return 'fire';  

  if (season === 'spring') {
    if (dayElement === 'wood') return 'fire';
    return 'wood';
  }

  if (dayElement === 'metal') return 'water';
  if (dayElement === 'wood') return 'fire';
  return 'water';
}

function isControlling(from: Element, to: Element): boolean {
  return CONTROLLING_MAP[from] === to;
}

function isGenerating(from: Element, to: Element): boolean {
  return GENERATING_MAP[from] === to;
}

function scoreJohuCandidate(
  cand: Element,
  ohaeng: OhaengAnalysis,
  season: Season,
  elementScores: Record<Element, number>,
  dayElement: Element
): number {
  let score = 0;

  const needed = neededElementBySeason(season, dayElement);
  if (cand === needed) score += 3;

  score += imbalanceScore(ohaeng, cand) * 0.8;

  const vals = Object.values(elementScores);
  const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  const rel = elementScores[cand] / (avg || 1);
  if (rel < 0.7) score += 1.0;
  if (rel > 1.6) score -= 1.0;

  if (season === 'summer' || season === 'winter') score += 1.0;
  else score += 0.2;

  if (hasKorean(ohaeng.excess, ELEMENT_TO_KOREAN[cand])) score -= 1.5;
  return score;
}


function determinePriority(
  eokbuTop: Scored,
  johuTop: Scored,
  ohaeng: OhaengAnalysis,
  season: Season
): { primaryType: '억부' | '조후'; reason: string } {
  const extreme = (season === 'summer' || season === 'winter');
  const delta = extreme ? YONGSHIN_CONFIG.EXTREME_SEASON_DELTA : YONGSHIN_CONFIG.NORMAL_SEASON_DELTA;

  if (johuTop.score >= eokbuTop.score + delta) {
    return { primaryType: '조후', reason: '조후 점수가 억부보다 유의미하게 높음' };
  }

  const eokbuK = ELEMENT_TO_KOREAN[eokbuTop.element];
  if (hasKorean(ohaeng.excess, eokbuK) && johuTop.score >= eokbuTop.score - YONGSHIN_CONFIG.CLOSE_SCORE_MARGIN) {
    return { primaryType: '조후', reason: '억부 1순위가 과다(병) + 조후가 근접' };
  }

  return { primaryType: '억부', reason: '구조 안정(억부) 우선' };
}

function confidenceFromGap(gap: number): 'high' | 'medium' | 'low' {
  if (gap >= YONGSHIN_CONFIG.CONFIDENCE_HIGH) return 'high';
  if (gap >= YONGSHIN_CONFIG.CONFIDENCE_MEDIUM) return 'medium';
  return 'low';
}


function calculateHeeshinGishin(
  yongshin: Element,
  day: Element,
  strength: IlganStrength['strength'],
  ohaeng: OhaengAnalysis
): { heeshin: string[]; gishin: string[] } {
  const heeshin: string[] = [];
  const gishin: string[] = [];

  for (const k of (ohaeng.excess ?? []).slice(0, 2)) gishin.push(k);

  const bigyeop = day;
  const inseong = invGenerating(day);
  const siksang = GENERATING_MAP[day];
  const jaesung = CONTROLLING_MAP[day];
  const gwanseong = invControlling(day);

  const addIfExcess = (e: Element) => {
    const k = ELEMENT_TO_KOREAN[e];
    if (hasKorean(ohaeng.excess, k) && !gishin.includes(k)) gishin.push(k);
  };

  if (strength === 'strong') {
    addIfExcess(bigyeop);
    addIfExcess(inseong);
  } else if (strength === 'weak') {
    addIfExcess(siksang);
    addIfExcess(jaesung);
    addIfExcess(gwanseong);
  }

  const producer = invGenerating(yongshin);
  const same = yongshin;

  const pushIfNeed = (e: Element) => {
    const k = ELEMENT_TO_KOREAN[e];
    if ((hasKorean(ohaeng.missing, k) || hasKorean(ohaeng.deficient, k)) && !heeshin.includes(k)) {
      heeshin.push(k);
    }
  };

  pushIfNeed(producer);
  pushIfNeed(same);

  if (heeshin.length === 0) heeshin.push(ELEMENT_TO_KOREAN[producer]);

  return {
    heeshin: dedupe(heeshin),
    gishin: dedupe(gishin).filter(k => k !== ELEMENT_TO_KOREAN[yongshin]),
  };
}

export function calculateYongshin(sajuData: SajuData): Yongshin | null {
  if (!sajuData.ilganStrength) return null;

  const ilganStrength = sajuData.ilganStrength;
  const dayMaster = sajuData.day.ganHan;
  const monthJi = sajuData.month.jiHan;

  const dayElement = getOhaeng(dayMaster) as Element;
  if (!dayElement) return null;

  const season = getSeason(monthJi);

  const elementScores = computeElementScores(sajuData);

  const imbalance: OhaengAnalysis = sajuData.ohaengAnalysis
    ? { 
        excess: sajuData.ohaengAnalysis.excess, 
        deficient: sajuData.ohaengAnalysis.deficient, 
        missing: sajuData.ohaengAnalysis.missing 
      }
    : deriveOhaengAnalysisFromScores(elementScores);

  const roots = countRootsWeighted(sajuData, dayElement);

  const eokbuCandidates = getEokbuCandidates(dayElement, ilganStrength.strength);
  const eokbuScored = eokbuCandidates.map(el => ({
    element: el,
    score: scoreEokbuCandidate(el, dayElement, ilganStrength.strength, imbalance, season, roots, elementScores),
  }));
  const eokbuTop2 = pickTopTwo(eokbuScored);
  if (!eokbuTop2) return null;

  const johuEl = neededElementBySeason(season, dayElement);
  const johuTop: Scored = {
    element: johuEl,
    score: scoreJohuCandidate(johuEl, imbalance, season, elementScores, dayElement),
  };

  const pr = determinePriority(eokbuTop2.top, johuTop, imbalance, season);

  const primaryScored = pr.primaryType === '억부' ? eokbuTop2.top : johuTop;
  let secondaryScored: Scored | undefined;
  let fallbackScored: Scored | undefined;

  if (pr.primaryType === '억부') {
    // 억부가 주용신인 경우: 1순위 후보는 조후, 2순위 후보는 억부 2순위
    if (johuTop.element !== primaryScored.element && !isControlling(johuTop.element, primaryScored.element)) {
      secondaryScored = johuTop;
    }
    // 조후가 탈락할 경우를 대비해 억부 2순위를 fallback으로 준비
    if (eokbuTop2.second && eokbuTop2.second.element !== primaryScored.element && !isControlling(eokbuTop2.second.element, primaryScored.element)) {
      fallbackScored = eokbuTop2.second;
    }
  } else {
    // 조후가 주용신인 경우: 1순위 후보는 억부 1순위, 2순위 후보는 억부 2순위
    if (eokbuTop2.top.element !== primaryScored.element && !isControlling(eokbuTop2.top.element, primaryScored.element)) {
      secondaryScored = eokbuTop2.top;
    }
    // 억부 1순위가 탈락할 경우를 대비해 억부 2순위를 fallback으로 준비
    if (eokbuTop2.second && eokbuTop2.second.element !== primaryScored.element && !isControlling(eokbuTop2.second.element, primaryScored.element)) {
      fallbackScored = eokbuTop2.second;
    }
  }

  // 1순위 보조 후보 점수 검증
  let finalSecondaryScored: Scored | undefined = undefined;
  
  if (secondaryScored && (primaryScored.score - secondaryScored.score) < 4.0) {
    // 상생 관계면 추가 우대 (점수 차이 완화)
    if (isGenerating(secondaryScored.element, primaryScored.element)) {
      finalSecondaryScored = secondaryScored;
    } else {
      finalSecondaryScored = secondaryScored;
    }
  } else if (fallbackScored && (primaryScored.score - fallbackScored.score) < 4.0) {
    // 1순위가 탈락했으면 fallback(억부 2순위) 검토
    // 상생 관계면 더 우대
    if (isGenerating(fallbackScored.element, primaryScored.element)) {
      finalSecondaryScored = fallbackScored;
    } else {
      finalSecondaryScored = fallbackScored;
    }
  }

  const primaryK = ELEMENT_TO_KOREAN[primaryScored.element];
  const secondaryK = finalSecondaryScored ? ELEMENT_TO_KOREAN[finalSecondaryScored.element] : undefined;
  
  const secondary = secondaryK;

  // 신뢰도는 억부 1순위와 조후의 점수 차이로 판단 (주용신 결정의 명확성)
  const confidenceGap = Math.abs(eokbuTop2.top.score - johuTop.score);
  const confidence = confidenceFromGap(confidenceGap);

  const conflictReason =
    (ELEMENT_TO_KOREAN[eokbuTop2.top.element] !== ELEMENT_TO_KOREAN[johuTop.element] && confidence !== 'high')
      ? ['억부/조후 후보가 근접 점수로 충돌']
      : undefined;

  const { heeshin, gishin } = calculateHeeshinGishin(
    primaryScored.element,
    dayElement,
    ilganStrength.strength,
    imbalance
  );

  const eokbuTopList = [...eokbuScored]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => ({ element: ELEMENT_TO_KOREAN[x.element], score: Number(x.score.toFixed(2)) }));

  const result: Yongshin = {
    primary: primaryK,
    secondary,
    heeshin: heeshin.length ? heeshin : undefined,
    gishin: gishin.length ? gishin : undefined,
    type: pr.primaryType,
    confidence,
    evidence: {
      season,
      ilganStrength: ilganStrength.strength,
      roots,
      elementScores,
      imbalance,
      candidates: {
        eokbuTop: eokbuTopList,
        johu: { element: ELEMENT_TO_KOREAN[johuTop.element], score: Number(johuTop.score.toFixed(2)) },
      },
      priorityReason: pr.reason,
      conflictReason,
    },
  };

  return result;
}
