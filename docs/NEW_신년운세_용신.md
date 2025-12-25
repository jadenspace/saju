**“용신/희신/기신 = 결과 + 근거(증거) + 애매함(솔직함)”**까지 한 세트로, 제품 관점에서 신뢰 최대로 정리해서 넣어볼게.

아래는 바로 적용 가능한 형태로:

1. **UI/데이터 설계(근거 노출 스펙)**
2. **타입 확장 제안(Yongshin 결과 포맷)**
3. **코드: calculateYongshin에 evidence/debug 포함**
4. **UI 카피(사용자 설명 템플릿)**

---

## 1) 근거 노출 스펙 (사용자에게 보여줄 것 vs 내부 디버그)

### 사용자에게 보여줄 “Evidence(설명 가능한 근거)”

* **결론**

  * 용신(Primary), 보조용신(Secondary)
  * 희신/기신
  * 판단 타입: 억부/조후
  * **신뢰도(confidence)**: high/medium/low
* **근거 요약(3줄)**

  1. 계절(월지) 요약: “여름/겨울(극단)이라 조후 비중 ↑” 같은 설명
  2. 일간 강약 요약: 신강/신약/중화
  3. 오행 불균형 요약: “수 부족, 화 과다” 같은 결핍/과다
* **근거 카드(선택 공개)**

  * 오행 점수 막대(wood/fire/earth/metal/water)
  * 통근(root): 월지/일지/시지/년지의 뿌리를 위치 가중치로 환산해 점수화(월지 본기 > 일지 본기 > 시지 > 년지, 지장간은 단계별 감쇠)
  * 억부 후보 TOP3와 점수
  * 조후 후보(필요 오행)와 점수
  * 충돌 사유(conflictReason)

### 내부 운영/QA용 “Debug(숨길 수도 있음)”

* elementScores 원본 수치
* derivedOhaengAnalysisFromScores 결과
* eokbuScored 전체 후보 점수표
* 우선순위 판단 reason 문자열
* 임계값 파라미터(0.35/0.70/1.60 등)

---

## 2) 타입 확장 제안 (Yongshin에 근거 필드 추가)

지금 `Yongshin` 타입이 간단한데, 아래처럼 확장하면 서비스가 “단정하지 않으면서도 전문적”으로 보입니다.

```ts
export type YongshinConfidence = 'high' | 'medium' | 'low';

export type YongshinEvidence = {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  ilganStrength: 'strong' | 'weak' | 'neutral';
  roots: number; // 통근 지표
  elementScores: Record<'wood'|'fire'|'earth'|'metal'|'water', number>;
  imbalance: {
    missing: string[];
    deficient: string[];
    excess: string[];
  };
  candidates: {
    eokbuTop: Array<{ element: string; score: number }>; // 목(木) 등 한글로
    johu: { element: string; score: number };
  };
  priorityReason: string;
  conflictReason?: string[];
};

export type Yongshin = {
  primary: string;
  secondary?: string;
  heeshin?: string[];
  gishin?: string[];
  type: '억부' | '조후';
  confidence?: YongshinConfidence;
  evidence?: YongshinEvidence;
};
```

> 이걸 “무료”로 보여주면:
> 사용자 입장에선 “아 얘네는 근거를 공개하네 → 그럴듯한 척 안 하네 → 신뢰” 흐름이 생깁니다.

---

## 3) 코드: calculateYongshin에 evidence/confidence/debug까지 포함 (완성형)

아래는 내가 이전에 준 개선 로직에, **근거 노출 필드까지 꽉 채워** 반환하도록 만든 버전입니다.
(핵심 로직은 유지하면서 “출력”을 강화)

```ts
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
    const isMonth = p === saju.month;

    add(getOhaeng(p.ganHan), 1.0);

    const jiW = isMonth ? 1.5 * 2.0 : 1.5;
    add(getOhaeng(p.jiHan), jiW);

    const hs = HIDDEN_STEMS[p.jiHan] ?? [];
    for (let i = 0; i < hs.length; i++) {
      const stem = hs[i];
      const w = weightHiddenStem(i) * (isMonth ? 2.0 : 1.0);
      add(getOhaeng(stem), w);
    }
  }
  return scores;
}

function deriveOhaengAnalysisFromScores(scores: Record<Element, number>): OhaengAnalysis {
  const vals = Object.values(scores);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

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
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const rel = elementScores[cand] / (avg || 1);
  if (rel < 0.7) score += 0.8;
  if (rel > 1.6) score -= 0.8;

  if (season === 'summer' || season === 'winter') score -= 0.3;
  if (hasKorean(ohaeng.excess, ELEMENT_TO_KOREAN[cand])) score -= 1.5;

  return score;
}

function neededElementBySeason(season: Season, dayElement: Element): Element {
  // 극단 한열은 우선 고정값으로 두는 편이 실무적으로 안정적
  if (season === 'summer') return 'water'; // 하절기: 조열(燥熱) → 수로 식힘
  if (season === 'winter') return 'fire';  // 동절기: 한습(寒濕) → 화로 온기

  // 봄/가을은 “일간 + 왕기”에 따라 갈림 (서비스 로직으로 최소한만 반영)
  if (season === 'spring') {
    // 봄: 목 왕성. 일간이 목이면 목을 더 주기보다 설기(火) 쪽이 안전
    if (dayElement === 'wood') return 'fire';
    // 그 외 일간은 봄의 생기를 활용(목)로 두되, 과다 체크는 scoreJohuCandidate에서 감점
    return 'wood';
  }

  // autumn
  // 가을: 금 왕성. 일간이 금이면 설기(水) 또는 제련(火) 갈리는데,
  // 서비스 기본형은 “설기(水)”로 두고, 목 일간은 금극목 완화(통관)로 화를 부여
  if (dayElement === 'metal') return 'water';
  if (dayElement === 'wood') return 'fire';
  return 'water';
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
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
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

  // 기신 1차: 과다(병)
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

  const dayMaster = sajuData.day.ganHan;
  const monthJi = sajuData.month.jiHan;

  const dayElement = getOhaeng(dayMaster);
  if (!dayElement) return null;

  const season = getSeason(monthJi);

  // ✅ 근거: 오행 점수(정량)
  const elementScores = computeElementScores(sajuData);

  // ✅ 근거: 오행 불균형(없으면 점수 기반으로 도출)
  const imbalance: OhaengAnalysis = sajuData.ohaengAnalysis
    ? sajuData.ohaengAnalysis
    : deriveOhaengAnalysisFromScores(elementScores);

  // ✅ 근거: 통근
  const roots = countRootsWeighted(sajuData, dayElement);

  // 1) 억부 후보 점수표
  const eokbuCandidates = getEokbuCandidates(dayElement, sajuData.ilganStrength.strength);
  const eokbuScored = eokbuCandidates.map(el => ({
    element: el,
    score: scoreEokbuCandidate(el, dayElement, sajuData.ilganStrength.strength, imbalance, season, roots, elementScores),
  }));
  const eokbuTop2 = pickTopTwo(eokbuScored);
  if (!eokbuTop2) return null;

  // 2) 조후 후보(필요 오행 1개)
  const johuEl = neededElementBySeason(season, dayElement);
  const johuTop: Scored = {
    element: johuEl,
    score: scoreJohuCandidate(johuEl, imbalance, season, elementScores, dayElement),
  };

  // 3) 우선순위
  const pr = determinePriority(eokbuTop2.top, johuTop, imbalance, season);

  const primaryScored = pr.primaryType === '억부' ? eokbuTop2.top : johuTop;
  const secondaryScored = pr.primaryType === '억부' ? johuTop : eokbuTop2.top;

  const primaryK = ELEMENT_TO_KOREAN[primaryScored.element];
  const secondaryK = ELEMENT_TO_KOREAN[secondaryScored.element];
  const secondary = (primaryK !== secondaryK) ? secondaryK : undefined;

  // ✅ 애매함/신뢰도
  const gap = Math.abs(primaryScored.score - secondaryScored.score);
  const confidence = confidenceFromGap(gap);

  const conflictReason =
    (ELEMENT_TO_KOREAN[eokbuTop2.top.element] !== ELEMENT_TO_KOREAN[johuTop.element] && confidence !== 'high')
      ? ['억부/조후 후보가 근접 점수로 충돌']
      : undefined;

  // 4) 희신/기신
  const { heeshin, gishin } = calculateHeeshinGishin(
    primaryScored.element,
    dayElement,
    sajuData.ilganStrength.strength,
    imbalance
  );

  // ✅ 근거 노출용 후보 TOP 리스트(사용자에겐 3개 정도만)
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

    // ✅ 추천: 타입 확장해서 쓰기
    confidence,
    evidence: {
      season,
      ilganStrength: sajuData.ilganStrength.strength,
      roots,
      elementScores,
      imbalance,
      candidates: {
        eokbuTop: eokbuTopList,
        johu: { element: ELEMENT_TO_KOREAN[johuTop.element], score: Number(johuTop.score.toFixed(2)) },
      },
      priorityReason: pr.reason,
      conflictReason,
    } as any,
  };

  return result;
}
```

> `as any`는 네 프로젝트 `Yongshin` 타입을 아직 확장 안 했다는 전제에서 넣어둔 거고,
> 타입 확장하면 바로 제거하면 됩니다.

---

## 4) UI 카피(사용자 설득 템플릿) — 이거 진짜 중요함

### (A) 결과 상단(짧게)

* **용신:** 화(火)
* **보조:** 수(水)
* **신뢰도:** 중간(조후/억부 후보가 근접)

### (B) “왜 이런 결론인가요?” 카드(3줄)

1. **계절(월지):** 겨울(亥子丑) → 한기 보정이 핵심이라 조후 가중치가 높게 반영됨(화 기운 우선 검토)
2. **일간 강약:** 신약 → 생조/부조 방향 우선
3. **오행 불균형:** 화 부족/수 과다 → 균형 보정 필요

### (C) “계산 근거 보기” 펼침(그래프 + 점수표)

* 오행 점수 막대그래프
* 억부 후보 TOP3 점수
* 조후 후보 점수
* 우선순위 이유(문장)
* 애매하면 “충돌” 뱃지 + conflictReason 출력

### (D) 애매함을 신뢰로 바꾸는 문장(필수)

* “용신은 하나로 단정하기보다 **원국 구조(억부)**와 **계절 보정(조후)**이 충돌할 때가 있습니다.
  이 경우 두 후보를 함께 제시하고, 점수 차이(신뢰도)와 근거를 같이 공개합니다.”

---

# 내가 “추가”로 더 하고 싶은 것(진짜 제품적으로 강함)

### 1) 히스토리 기반 보정(선택)

사용자가 “체감 피드백”을 남기면(예: 더 힘들었던 계절/시기), 다음 계산에서 조후 가중을 약간 조정.
→ **사주가 ‘맞춘다’는 느낌**을 기술적으로 만들 수 있음.

### 2) “용신은 상황별로 다르게 쓴다” 모드

* 건강/멘탈: 조후 우선(계절/한열)
* 커리어/돈: 억부 우선(균형/구조)
  이걸 UI에서 탭으로 보여주면 “전문가 느낌”이 훨씬 강해집니다.
