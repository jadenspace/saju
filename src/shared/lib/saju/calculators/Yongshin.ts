import { 
  Yongshin, 
  IlganStrength, 
  SajuData, 
  JohuAnalysis, 
  JonggyeokResult, 
  ByungyakAnalysis,
  CombinationAnalysis,
  StrengthAnalysis,
  GyeokgukType,
  GyeokgukAnalysis,
  GyeokgukIssue,
  JonggyeokAnalysisV2,
  PriorityScore,
  TonggwanValidation,
  DecisionStep,
} from '../../../../entities/saju/model/types';
import { getOhaeng, Element, calculateSipsin, Sipsin } from './TenGod';

// 분리된 모듈들 import
import {
  analyzeCombinations,
  checkYongshinCombinationImpact,
  GENERATING_MAP,
  CONTROLLING_MAP,
  ELEMENT_TO_KOREAN,
  HIDDEN_STEMS,
  TIANGAN_HE_PARTNER,
} from './CombinationAnalyzer';
import {
  calculateDeukryeongWithSaryeong,
} from './SaryeongCalculator';
import {
  checkIlhaengDeukgi,
  checkYangshin,
} from './SpecialGyeokguk';

// 모듈에서 export된 상수들 re-export
export { GENERATING_MAP, CONTROLLING_MAP, ELEMENT_TO_KOREAN };

// ========================================
// PRD v4.2 기준 설정값
// ========================================
const YONGSHIN_CONFIG = {
  // 오행 불균형 임계값
  MISSING_THRESHOLD: 0.20,   // PRD: 0.35 → 0.20 (더 엄격)
  DEFICIENT_THRESHOLD: 0.70,
  EXCESS_THRESHOLD: 1.80,    // PRD: 1.60 → 1.80 (과다 기준 완화)

  // 우선순위 델타
  EXTREME_SEASON_DELTA: 1.5, // PRD: 1.2 → 1.5 (더 엄격)
  NORMAL_SEASON_DELTA: 2.0,
  CLOSE_SCORE_MARGIN: 1.0,   // PRD: 0.8 → 1.0 (여유)

  // 신뢰도(점수 차)
  CONFIDENCE_HIGH: 3.0,
  CONFIDENCE_MEDIUM: 1.5,
  
  // 원국 존재 여부 패널티
  ABSENT_PENALTY: 3.0,
  WEAK_PENALTY: 1.0,
  WEAK_THRESHOLD: 0.3,
  
  // ===== PRD v4.2 신규 설정값 =====
  
  // 종격 관련
  JONGGANG_ROOT_MIN: 6.0,        // 종강격 근점수 최소
  JONGYAK_ROOT_MAX: 2.0,         // 종약격 근점수 최대
  DRAIN_LIMIT_JONGGANG: 1.5,     // 종강격 설기 제한
  SUPPORT_LIMIT_JONGYAK: 1.5,    // 종약격 지원 제한
  RESCUE_ROOT_THRESHOLD: 1.5,    // 구응(救應) 통근 기준
  JONGYAK_SIPSEONG_MIN: 3.0,     // 종약 십성 최소 점수
  
  // 조후 관련
  JOHU_SUFFICIENT: 2.0,          // 조후 충분 기준
  JOHU_POOR_MIN: 0.5,            // 조후 부족 최소
  JOHU_RELAXED: 1.5,             // 춘추절 완화 모드
  
  // 통관 관련
  TONGGWAN_MIN_EXIST: 0.5,       // 통관 오행 원국 존재 최소
  TONGGWAN_MIN_SCORE: 1.5,       // 통관 유효 최소 점수
  TONGGWAN_CONTROL_RATIO: 1.5,   // 통관 피극 비율
  TONGGWAN_SCORE_DIFF: 1.5,      // 통관 필요 점수 차이
  
  // 합충 관련 (Phase 1 고도화)
  HAPGEO_DEFAULT_REDUCTION: 0.5,   // 합거 기본 감소율
  HAPGEO_MONTH_REDUCTION: 0.6,     // 월간 관련 합거 감소율
  HAPGEO_HOUR_REDUCTION: 0.4,      // 시간 관련 합거 감소율
  CHUNG_DEFAULT_DIFF: 2.0,         // 충파 기본 점수 차이
  CHUNG_MONTH_DIFF: 1.5,           // 월지 충파 점수 차이
  
  // 합화(合化) 판별 조건
  HAPHWA_MONTH_SUPPORT_REQUIRED: true,  // 월령 동조 필수 여부
  HAPHWA_INHUA_BONUS: 1.5,              // 인화 오행 존재 시 화신 보너스 배수
  HAPHWA_NO_ROOT_THRESHOLD: 0.5,        // 통근 없음 판정 기준
  
  // 합반(合絆) 점수 감소율
  HAPBAN_REDUCTION_ADJACENT: 0.4,       // 인접 합반 감소율 (40%)
  HAPBAN_REDUCTION_DISTANT: 0.3,        // 원거리 합반 감소율 (30%)
  
  // 충(沖) 왕쇠 차등 적용
  CHUNG_WANG_SWAE_RATIO: 2.0,           // 왕자충쇠 판정 비율 (강자가 2배 이상)
  CHUNG_SWAE_REDUCTION: 0.85,           // 쇠자 점수 감소율 (85%)
  CHUNG_WANG_REDUCTION: 0.15,           // 왕자 점수 감소율 (15%)
  CHUNG_WANG_BONUS_ON_SWAE: 0.2,        // 쇠자충왕 시 왕자 보너스 (20%)
  CHUNG_EQUAL_REDUCTION: 0.5,           // 세력비등 양측 감소율 (50%)
  
  // 충발(沖發) 관련
  CHUNGBAL_THRESHOLD: 3.0,              // 충발 발동 왕자 최소 점수
  CHUNGBAL_BONUS: 0.3,                  // 충발 보너스율 (30%)
  MOGO_CHUNGBAL_BONUS: 1.5,             // 묘고충발 지장간 발현 점수
  
  // 삼합 비율
  SAMHAP_COMPLETE: 1.0,            // 완전삼합
  SAMHAP_SAENG_WANG: 0.6,          // 생왕반합
  SAMHAP_WANG_MYO: 0.5,            // 왕묘반합
  SAMHAP_SAENG_MYO: 0.4,           // 생묘반합
  
  // 영향도 점수
  IMPACT_YONGSHIN: 3,
  IMPACT_HEESHIN: 2,
  IMPACT_HANSHIN: 0,
  IMPACT_SEOLGI_DEFAULT: -1,
  IMPACT_GUSHIN: -2,
  IMPACT_GISHIN: -3,
  
  // Priority Score 가중치
  PRIORITY_JONG_WEIGHT: 2.0,       // α
  PRIORITY_JOHU_WEIGHT: 1.5,       // β
  PRIORITY_GYEOK_WEIGHT: 1.0,      // γ
  
  // ===== 강약 분석 관련 설정값 =====
  
  // 주별 통근 가중치
  PILLAR_WEIGHT_YEAR: 1.0,         // 연주 가중치
  PILLAR_WEIGHT_MONTH: 3.0,        // 월주 가중치
  PILLAR_WEIGHT_DAY: 2.5,          // 일주 가중치
  PILLAR_WEIGHT_HOUR: 1.5,         // 시주 가중치
  
  // 지장간 통근 가중치
  HIDDEN_STEM_WEIGHT_JUGI: 0.8,    // 정기(주기) 가중치
  HIDDEN_STEM_WEIGHT_JUNGGI: 0.5,  // 중기 가중치
  HIDDEN_STEM_WEIGHT_YEOGI: 0.3,   // 여기 가중치
  
  // 천간 지원 점수
  TIANGAN_SUPPORT_SCORE: 1.0,     // 비견/겁재/편인/정인 각각 점수
  
  // 득지/득세 임계값
  DEUKJI_THRESHOLD: 2.0,           // 득지 판정 기준 (총 통근 점수)
  DEUKSE_THRESHOLD: 1.0,           // 득세 판정 기준 (천간 지원 점수)
  
  // 강약 판정 기준
  STRENGTH_EXTREME_STRONG: 6.0,    // 극강 기준 (득령 + 근점수)
  STRENGTH_STRONG: 4.0,            // 신강 기준 (득령 + 근점수)
  STRENGTH_NEUTRAL_MIN: 3.0,       // 중화 최소
  STRENGTH_NEUTRAL_MAX: 5.0,       // 중화 최대
  STRENGTH_WEAK_MIN: 1.5,          // 신약 최소
  STRENGTH_WEAK_MAX: 3.0,          // 신약 최대 (미포함)
  
  // 종격 신뢰도 판정 기준
  JONGGANG_CONFIDENCE_HIGH: 7.0,   // 종강격 high 신뢰도 기준 (근점수)
  JONGYAK_CONFIDENCE_HIGH: 1.0,    // 종약격 high 신뢰도 기준 (근점수)
  
  // 가종격 판정 기준
  GAJONG_JONGGANG_ROOT_MIN: 5.0,   // 가종격 종강격 근접 기준 (근점수)
  GAJONG_JONGYAK_ROOT_MAX: 2.5,    // 가종격 종약격 근접 기준 (근점수)
  GAJONG_OPPRESSION_MAX: 2.0,      // 가종격 관살 최대
  GAJONG_DRAIN_MAX: 2.0,           // 가종격 설기 최대
  GAJONG_SUPPORT_MAX: 2.0,         // 가종격 지원 최대
} as const;

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type OhaengAnalysis = { excess: string[]; deficient: string[]; missing: string[] };
type Scored = { element: Element; score: number; isAbsent?: boolean };

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

// HIDDEN_STEMS는 CombinationAnalyzer.ts에서 import

// 사령분일 관련 함수는 SaryeongCalculator.ts에서 import

// 토의 조후 조절 기능: 습토/조토 구분
type EarthType = 'wet' | 'dry';

function getEarthType(ji: string): EarthType | null {
  const wetEarth = ['丑', '辰'];  // 습토
  const dryEarth = ['未', '戌'];  // 조토
  
  if (wetEarth.includes(ji)) return 'wet';
  if (dryEarth.includes(ji)) return 'dry';
  return null;
}

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

/**
 * Phase 1: 합충 결과를 반영한 오행 점수 계산
 * - 기본 점수 계산 후 합충 조정값 적용
 */
function computeElementScoresWithCombinations(
  saju: SajuData, 
  combinations: CombinationAnalysis
): Record<Element, number> {
  // 기본 점수 계산
  const baseScores = computeElementScores(saju);
  
  // 합충 조정값 적용
  const adjustedScores: Record<Element, number> = { ...baseScores };
  
  for (const elem of Object.keys(combinations.totalScoreAdjustment) as Element[]) {
    adjustedScores[elem] = Math.max(0, baseScores[elem] + combinations.totalScoreAdjustment[elem]);
  }
  
  return adjustedScores;
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
    { p: saju.year,  w: YONGSHIN_CONFIG.PILLAR_WEIGHT_YEAR },
    { p: saju.month, w: YONGSHIN_CONFIG.PILLAR_WEIGHT_MONTH },
    { p: saju.day,   w: YONGSHIN_CONFIG.PILLAR_WEIGHT_DAY },
    { p: saju.hour,  w: YONGSHIN_CONFIG.PILLAR_WEIGHT_HOUR },
  ];

  for (const { p, w } of pillars) {
    if (!p || p.jiHan === '?') continue;
    if (getOhaeng(p.jiHan) === dayElement) roots += w;

    const hs = HIDDEN_STEMS[p.jiHan] ?? [];
    for (let i = 0; i < hs.length; i++) {
      if (getOhaeng(hs[i]) === dayElement) {
        const hsW = (i === 0) ? YONGSHIN_CONFIG.HIDDEN_STEM_WEIGHT_JUGI 
                 : (i === 1) ? YONGSHIN_CONFIG.HIDDEN_STEM_WEIGHT_JUNGGI 
                 : YONGSHIN_CONFIG.HIDDEN_STEM_WEIGHT_YEOGI;
        roots += hsW * (w / 2);
      }
    }
  }

  return Number(roots.toFixed(2));
}

/**
 * 강약 분석 강화: 득령/득지/득세 명시적 판단
 */
function analyzeStrength(saju: SajuData, dayElement: Element): StrengthAnalysis {
  const dayMaster = saju.day.ganHan;
  const monthJi = saju.month.jiHan;
  
  const monthElement = getOhaeng(monthJi);
  const deukryeong = monthElement === dayElement;
  
  const pillars = [
    { p: saju.year,  name: 'year',  w: YONGSHIN_CONFIG.PILLAR_WEIGHT_YEAR },
    { p: saju.month, name: 'month', w: YONGSHIN_CONFIG.PILLAR_WEIGHT_MONTH },
    { p: saju.day,   name: 'day',   w: YONGSHIN_CONFIG.PILLAR_WEIGHT_DAY },
    { p: saju.hour,  name: 'hour',  w: YONGSHIN_CONFIG.PILLAR_WEIGHT_HOUR },
  ];
  
  let monthRoot = 0;
  let dayRoot = 0;
  let yearRoot = 0;
  let hourRoot = 0;
  
  for (const { p, name, w } of pillars) {
    if (!p || p.jiHan === '?') continue;
    let root = 0;
    
    if (getOhaeng(p.jiHan) === dayElement) {
      root += w;
    }
    
    const hs = HIDDEN_STEMS[p.jiHan] ?? [];
    for (let i = 0; i < hs.length; i++) {
      if (getOhaeng(hs[i]) === dayElement) {
        const hsW = (i === 0) ? YONGSHIN_CONFIG.HIDDEN_STEM_WEIGHT_JUGI 
                 : (i === 1) ? YONGSHIN_CONFIG.HIDDEN_STEM_WEIGHT_JUNGGI 
                 : YONGSHIN_CONFIG.HIDDEN_STEM_WEIGHT_YEOGI;
        root += hsW * (w / 2);
      }
    }
    
    if (name === 'month') monthRoot = root;
    else if (name === 'day') dayRoot = root;
    else if (name === 'year') yearRoot = root;
    else if (name === 'hour') hourRoot = root;
  }
  
  const deukji = (monthRoot + dayRoot + yearRoot + hourRoot) > YONGSHIN_CONFIG.DEUKJI_THRESHOLD;
  
  let tianganSupport = 0;
  for (const pillar of pillars) {
    if (!pillar.p || pillar.p.ganHan === '?') continue;
    const sipsin = calculateSipsin(dayMaster, pillar.p.ganHan);
    if (sipsin === '비견' || sipsin === '겁재' || sipsin === '편인' || sipsin === '정인') {
      tianganSupport += YONGSHIN_CONFIG.TIANGAN_SUPPORT_SCORE;
    }
  }
  
  const deukse = tianganSupport >= YONGSHIN_CONFIG.DEUKSE_THRESHOLD;
  const tugan = deukji && deukse;
  const rootScore = monthRoot + dayRoot + yearRoot + hourRoot + tianganSupport;
  
  let structuralStrength: 'extreme-strong' | 'strong' | 'neutral' | 'weak' | 'extreme-weak';
  if (deukryeong && rootScore >= YONGSHIN_CONFIG.STRENGTH_EXTREME_STRONG) {
    structuralStrength = 'extreme-strong';
  } else if (deukryeong && rootScore >= YONGSHIN_CONFIG.STRENGTH_STRONG) {
    structuralStrength = 'strong';
  } else if (rootScore >= YONGSHIN_CONFIG.STRENGTH_NEUTRAL_MIN && rootScore <= YONGSHIN_CONFIG.STRENGTH_NEUTRAL_MAX) {
    structuralStrength = 'neutral';
  } else if (rootScore >= YONGSHIN_CONFIG.STRENGTH_WEAK_MIN && rootScore < YONGSHIN_CONFIG.STRENGTH_WEAK_MAX) {
    structuralStrength = 'weak';
  } else {
    structuralStrength = 'extreme-weak';
  }
  
  return {
    deukryeong,
    deukji,
    deukse,
    tugan,
    rootScore: Number(rootScore.toFixed(2)),
    structuralStrength,
    details: {
      monthRoot: Number(monthRoot.toFixed(2)),
      dayRoot: Number(dayRoot.toFixed(2)),
      yearRoot: Number(yearRoot.toFixed(2)),
      hourRoot: Number(hourRoot.toFixed(2)),
      tianganSupport: Number(tianganSupport.toFixed(2)),
    },
  };
}

// ========================================
// Phase 2: 특수 격국 - 일행득기격/양신성상격
// ========================================

/**
 * PRD v4.2: 종격 판단 강화
 * - 구응(救應) 체크
 * - 종약격 세분화 (종아격/종재격/종살격)
 * - 설기를 억제에서 분리
 */
function checkJonggyeokV2(
  saju: SajuData, 
  dayElement: Element, 
  strengthAnalysis: StrengthAnalysis
): JonggyeokAnalysisV2 {
  const dayMaster = saju.day.ganHan;
  const deukryeong = strengthAnalysis.deukryeong;
  
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  
  // PRD 기준 분류:
  // - 지원(totalSupport): 비겁 + 인성
  // - 설기(totalDrain): 식상 + 재성 (PRD에서 분리됨)
  // - 억제(totalOppression): 관살만
  let bigyeopCount = 0;    // 비견 + 겁재
  let inseongCount = 0;    // 편인 + 정인
  let siksangCount = 0;    // 식신 + 상관
  let jaesungCount = 0;    // 편재 + 정재
  let gwansalCount = 0;    // 편관 + 정관
  
  for (const p of pillars) {
    if (!p || p.ganHan === '?') continue;
    const sipsin = calculateSipsin(dayMaster, p.ganHan);
    
    if (sipsin === '비견' || sipsin === '겁재') bigyeopCount += 1.0;
    else if (sipsin === '편인' || sipsin === '정인') inseongCount += 1.0;
    else if (sipsin === '편관' || sipsin === '정관') gwansalCount += 1.0;
    else if (sipsin === '편재' || sipsin === '정재') jaesungCount += 1.0;
    else if (sipsin === '식신' || sipsin === '상관') siksangCount += 1.0;
    
    const jiSipsin = calculateSipsin(dayMaster, p.jiHan);
    if (jiSipsin === '비견' || jiSipsin === '겁재') bigyeopCount += 0.5;
    else if (jiSipsin === '편인' || jiSipsin === '정인') inseongCount += 0.5;
    else if (jiSipsin === '편관' || jiSipsin === '정관') gwansalCount += 0.5;
    else if (jiSipsin === '편재' || jiSipsin === '정재') jaesungCount += 0.5;
    else if (jiSipsin === '식신' || jiSipsin === '상관') siksangCount += 0.5;
    
    const hs = HIDDEN_STEMS[p.jiHan] ?? [];
    for (let i = 0; i < hs.length; i++) {
      const hsSipsin = calculateSipsin(dayMaster, hs[i]);
      const hsWeight = i === 0 ? 0.3 : i === 1 ? 0.2 : 0.1;
      
      if (hsSipsin === '비견' || hsSipsin === '겁재') bigyeopCount += hsWeight;
      else if (hsSipsin === '편인' || hsSipsin === '정인') inseongCount += hsWeight;
      else if (hsSipsin === '편관' || hsSipsin === '정관') gwansalCount += hsWeight;
      else if (hsSipsin === '편재' || hsSipsin === '정재') jaesungCount += hsWeight;
      else if (hsSipsin === '식신' || hsSipsin === '상관') siksangCount += hsWeight;
    }
  }
  
  // PRD 기준 분류
  const totalSupport = bigyeopCount + inseongCount;  // 지원
  const totalDrain = siksangCount + jaesungCount;    // 설기 (식상 + 재성)
  const totalOppression = gwansalCount;              // 억제 (관살만)
  
  const scores = {
    rootScore: strengthAnalysis.rootScore,
    support: Number(totalSupport.toFixed(2)),
    drain: Number(totalDrain.toFixed(2)),
    oppression: Number(totalOppression.toFixed(2)),
  };
  
  const structureStr = `비겁: ${bigyeopCount.toFixed(1)}, 인성: ${inseongCount.toFixed(1)}, 식상: ${siksangCount.toFixed(1)}, 재성: ${jaesungCount.toFixed(1)}, 관살: ${gwansalCount.toFixed(1)}`;
  
  // ========================================
  // 종강격 판단
  // ========================================
  if (deukryeong && 
      strengthAnalysis.rootScore >= YONGSHIN_CONFIG.JONGGANG_ROOT_MIN && 
      totalOppression <= 1.0 && 
      totalDrain <= YONGSHIN_CONFIG.DRAIN_LIMIT_JONGGANG) {
    
    // 구응(救應) 체크: 관살이 투간 + 강한 통근이면 파격
    const breakCheck = checkJonggyeokBreak('jonggang', saju, dayMaster);
    
    if (breakCheck.broken) {
      return {
        isJonggyeok: false,
        type: 'none',
        reason: `종강격 파격: ${breakCheck.reason}`,
        details: { deukryeong: true, structure: structureStr, confidence: 'low' },
        breakCheck,
        scores,
      };
    }
    
    return {
      isJonggyeok: true,
      type: 'jonggang',
      reason: '종강격: 월령 득령 + 통근 강함 + 억제/설기 약함',
      details: {
        deukryeong: true,
        structure: structureStr,
        confidence: strengthAnalysis.rootScore >= YONGSHIN_CONFIG.JONGGANG_CONFIDENCE_HIGH ? 'high' : 'medium',
      },
      breakCheck: { broken: false },
      scores,
    };
  }
  
  // ========================================
  // 종약격 판단
  // ========================================
  if (!deukryeong && 
      strengthAnalysis.rootScore <= YONGSHIN_CONFIG.JONGYAK_ROOT_MAX && 
      totalSupport <= YONGSHIN_CONFIG.SUPPORT_LIMIT_JONGYAK &&
      (siksangCount >= YONGSHIN_CONFIG.JONGYAK_SIPSEONG_MIN || 
       jaesungCount >= YONGSHIN_CONFIG.JONGYAK_SIPSEONG_MIN || 
       gwansalCount >= YONGSHIN_CONFIG.JONGYAK_SIPSEONG_MIN)) {
    
    // 구응(救應) 체크: 인성/비겁이 투간 + 강한 통근이면 파격
    const breakCheck = checkJonggyeokBreak('jongyak', saju, dayMaster);
    
    if (breakCheck.broken) {
      return {
        isJonggyeok: false,
        type: 'none',
        reason: `종약격 파격: ${breakCheck.reason}`,
        details: { deukryeong: false, structure: structureStr, confidence: 'low' },
        breakCheck,
        scores,
      };
    }
    
    // 종약격 세분화: 종아격/종재격/종살격
    const subType = determineJongyakSubType(siksangCount, jaesungCount, gwansalCount);
    
    return {
      isJonggyeok: true,
      type: 'jongyak',
      subType,
      reason: `${subType}: 월령 실령 + 통근 약함 + ${subType === '종아격' ? '식상' : subType === '종재격' ? '재성' : '관살'} 강함`,
      details: {
        deukryeong: false,
        structure: structureStr,
        confidence: strengthAnalysis.rootScore <= YONGSHIN_CONFIG.JONGYAK_CONFIDENCE_HIGH ? 'high' : 'medium',
      },
      breakCheck: { broken: false },
      scores,
    };
  }
  
  // ========================================
  // 가종격 판단
  // ========================================
  if ((deukryeong && strengthAnalysis.rootScore >= YONGSHIN_CONFIG.GAJONG_JONGGANG_ROOT_MIN && totalOppression <= YONGSHIN_CONFIG.GAJONG_OPPRESSION_MAX && totalDrain <= YONGSHIN_CONFIG.GAJONG_DRAIN_MAX) ||
      (!deukryeong && strengthAnalysis.rootScore <= YONGSHIN_CONFIG.GAJONG_JONGYAK_ROOT_MAX && totalSupport <= YONGSHIN_CONFIG.GAJONG_SUPPORT_MAX)) {
    
    // 가종격도 파격 체크 필수
    const breakCheck = checkJonggyeokBreak(
      deukryeong ? 'jonggang' : 'jongyak', 
      saju, 
      dayMaster
    );
    
    if (breakCheck.broken) {
      return {
        isJonggyeok: false,
        type: 'none',
        reason: `가종격 파격: ${breakCheck.reason} → 보통격으로 재평가`,
        details: { deukryeong, structure: structureStr, confidence: 'low' },
        breakCheck,
        scores,
      };
    }
    
    return {
      isJonggyeok: true,
      type: 'gajong',
      reason: '가종격: 종격 조건에 근접하나 완전하지 않음 (대운 주의)',
      details: {
        deukryeong,
        structure: structureStr,
        confidence: 'low',
      },
      breakCheck: { broken: false },
      scores,
    };
  }
  
  return {
    isJonggyeok: false,
    type: 'none',
    reason: '보통격: 종격 조건 불충족',
    details: {
      deukryeong,
      structure: structureStr,
      confidence: 'low',
    },
    scores,
  };
}

/**
 * PRD v4.2: 종약격 세분화 - 동률 처리 규칙 포함
 */
function determineJongyakSubType(
  siksangScore: number, 
  jaesungScore: number, 
  gwansalScore: number
): '종아격' | '종재격' | '종살격' {
  // PRD: 동률 시 근원(생하는 쪽) 우선
  // 식상 >= 재성이면 종아격 (식상이 재성을 생함)
  // 재성 > 식상이고 재성 >= 관살이면 종재격
  // 그 외 종살격
  
  if (siksangScore >= jaesungScore && siksangScore >= gwansalScore) {
    return '종아격'; // 식상 우선
  }
  if (jaesungScore > siksangScore && jaesungScore >= gwansalScore) {
    return '종재격'; // 재성 우선 (식상보다 높을 때만)
  }
  return '종살격'; // 관살
}

/**
 * Phase 2: 구응(救應) 체크 - 종격 파격 여부 (합에 의한 무력화 포함)
 * 
 * 병신(病神)이 투간 + 통근하면 파격이지만,
 * 병신이 다른 천간과 합(合)으로 묶이면 무력화되어 파격이 아님
 */
function checkJonggyeokBreak(
  jongType: 'jonggang' | 'jongyak',
  saju: SajuData,
  dayMaster: string
): { broken: boolean; reason?: string; neutralizedByHap?: boolean } {
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  const tiangan: string[] = [];
  const tianganWithPos: Array<{ gan: string; pos: number }> = [];
  const jiji: string[] = [];
  
  for (let i = 0; i < pillars.length; i++) {
    const p = pillars[i];
    if (p && p.ganHan !== '?') {
      tiangan.push(p.ganHan);
      tianganWithPos.push({ gan: p.ganHan, pos: i });
    }
    if (p && p.jiHan !== '?') jiji.push(p.jiHan);
  }
  
  // 병신(病神) 천간들 찾기
  const byungshinList: Array<{ gan: string; pos: number; sipsin: string }> = [];
  
  if (jongType === 'jongyak') {
    // 종약격: 인성/비겁이 병신
    for (const { gan, pos } of tianganWithPos) {
      const sipsin = calculateSipsin(dayMaster, gan);
      if (['편인', '정인', '비견', '겁재'].includes(sipsin)) {
        byungshinList.push({ gan, pos, sipsin });
      }
    }
  } else if (jongType === 'jonggang') {
    // 종강격: 관살이 병신
    for (const { gan, pos } of tianganWithPos) {
      const sipsin = calculateSipsin(dayMaster, gan);
      if (['편관', '정관'].includes(sipsin)) {
        byungshinList.push({ gan, pos, sipsin });
      }
    }
  }
  
  // 각 병신에 대해 파격 여부 판단
  for (const byungshin of byungshinList) {
    const ganElement = getOhaeng(byungshin.gan) as Element;
    const rootScore = calculateRootForElement(ganElement, jiji);
    
    // 통근이 강하면 일단 파격 후보
    if (rootScore >= YONGSHIN_CONFIG.RESCUE_ROOT_THRESHOLD) {
      // 합에 의한 무력화 체크
      const hapPartner = TIANGAN_HE_PARTNER[byungshin.gan];
      if (hapPartner && tiangan.includes(hapPartner)) {
        // 합 파트너가 인접해 있는지 확인
        const partnerPos = tianganWithPos.find(t => t.gan === hapPartner)?.pos;
        const isAdjacent = partnerPos !== undefined && Math.abs(byungshin.pos - partnerPos) === 1;
        
        if (isAdjacent) {
          // 인접한 합은 무력화 효과가 강함
          continue; // 이 병신은 무력화됨, 다음 병신 체크
        }
        
        // 비인접이라도 통근이 약하면 무력화
        if (rootScore < YONGSHIN_CONFIG.RESCUE_ROOT_THRESHOLD * 1.5) {
          continue; // 무력화됨
        }
      }
      
      // 합으로 무력화되지 않았으므로 파격
      return { 
        broken: true, 
        reason: `구응 존재: ${byungshin.sipsin}(${byungshin.gan}) 투간 + 통근 ${rootScore.toFixed(1)}`,
        neutralizedByHap: false
      };
    }
  }
  
  // 병신이 있지만 모두 무력화된 경우
  if (byungshinList.length > 0) {
    const neutralizedGans = byungshinList.map(b => b.gan).join(',');
    return { 
      broken: false, 
      reason: `병신(${neutralizedGans}) 존재하나 합으로 무력화됨`,
      neutralizedByHap: true
    };
  }
  
  return { broken: false };
}

/**
 * 특정 오행의 지지 통근 점수 계산
 */
function calculateRootForElement(element: Element, jiji: string[]): number {
  let rootScore = 0;
  
  for (const ji of jiji) {
    if (getOhaeng(ji) === element) {
      rootScore += 1.0;
    }
    
    const hs = HIDDEN_STEMS[ji] ?? [];
    for (let i = 0; i < hs.length; i++) {
      if (getOhaeng(hs[i]) === element) {
        rootScore += (i === 0 ? 0.5 : i === 1 ? 0.3 : 0.2);
      }
    }
  }
  
  return rootScore;
}

/**
 * 기존 종격 판단 (하위 호환성)
 */
function checkJonggyeok(
  saju: SajuData, 
  dayElement: Element, 
  strengthAnalysis: StrengthAnalysis
): JonggyeokResult {
  const v2Result = checkJonggyeokV2(saju, dayElement, strengthAnalysis);
  return {
    isJonggyeok: v2Result.isJonggyeok,
    type: v2Result.type,
    reason: v2Result.reason,
    details: v2Result.details,
  };
}

// ========================================
// PRD v4.2: 격국 판단
// ========================================

/**
 * PRD v4.2: 격국 판단 강화
 * - 지장간 우선순위 (정기 > 중기 > 여기)
 * - 격국 문제 패턴 체크
 */
function determineGyeokgukV2(saju: SajuData, dayMaster: string): GyeokgukAnalysis {
  const monthPillar = saju.month;
  if (!monthPillar || monthPillar.jiHan === '?') {
    return { type: 'none', confidence: 'low', touchulPosition: null, issues: [] };
  }
  
  const monthJi = monthPillar.jiHan;
  const jijanggan = HIDDEN_STEMS[monthJi] || [];
  
  // 순수 지기 (卯, 酉, 子)는 정기만 존재
  const isPure = ['卯', '酉', '子'].includes(monthJi);
  
  const tianganList: string[] = [];
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  for (const p of pillars) {
    if (p && p.ganHan !== '?' && p !== saju.day) { // 일간 제외
      tianganList.push(p.ganHan);
    }
  }
  
  let touchulGan: string | null = null;
  let touchulPosition: 'jeonggi' | 'junggi' | 'yeogi' | null = null;
  let confidence: 'high' | 'medium' | 'low' = 'low';
  
  // PRD: 정기 → 중기 → 여기 순서로 투출 체크
  if (isPure) {
    // 순수 지기는 정기만 체크
    if (jijanggan.length > 0 && tianganList.includes(jijanggan[0])) {
      touchulGan = jijanggan[0];
      touchulPosition = 'jeonggi';
      confidence = 'high';
    }
  } else {
    // 정기 (마지막 인덱스)
    const jeonggiIndex = jijanggan.length - 1;
    if (jeonggiIndex >= 0 && tianganList.some(gan => isSameGan(gan, jijanggan[jeonggiIndex]))) {
      touchulGan = jijanggan[jeonggiIndex];
      touchulPosition = 'jeonggi';
      confidence = 'high';
    }
    // 중기 (두 번째 인덱스, 있을 경우)
    else if (jijanggan.length >= 2 && tianganList.some(gan => isSameGan(gan, jijanggan[1]))) {
      touchulGan = jijanggan[1];
      touchulPosition = 'junggi';
      confidence = 'medium';
    }
    // 여기 (첫 번째 인덱스)
    else if (jijanggan.length >= 1 && tianganList.some(gan => isSameGan(gan, jijanggan[0]))) {
      touchulGan = jijanggan[0];
      touchulPosition = 'yeogi';
      confidence = 'low';
    }
  }
  
  if (!touchulGan) {
    return { type: 'none', confidence: 'low', touchulPosition: null, issues: [] };
  }
  
  const sipsin = calculateSipsin(dayMaster, touchulGan);
  let gyeokgukType: GyeokgukType = 'none';
  
  switch (sipsin) {
    case '정관': gyeokgukType = 'jeonggwan'; break;
    case '편관': gyeokgukType = 'pyeongwan'; break;
    case '정인': gyeokgukType = 'jeongin'; break;
    case '편인': gyeokgukType = 'pyeonin'; break;
    case '식신': gyeokgukType = 'siksin'; break;
    case '상관': gyeokgukType = 'sanggwan'; break;
    case '정재': gyeokgukType = 'jeongjae'; break;
    case '편재': gyeokgukType = 'pyeonjae'; break;
    case '비견':
    case '겁재':
      const monthElement = getOhaeng(monthPillar.jiHan);
      const dayElement = getOhaeng(dayMaster);
      if (monthElement === dayElement) {
        gyeokgukType = 'geonrok';
      }
      break;
  }
  
  // 격국 문제 패턴 체크
  const issues = checkGyeokgukIssues(gyeokgukType, saju, dayMaster);
  
  return {
    type: gyeokgukType,
    confidence,
    touchulPosition,
    touchulGan,
    issues,
  };
}

// 동일 천간 체크 (음양 구분 없이 같은 오행인지)
function isSameGan(gan1: string, gan2: string): boolean {
  return gan1 === gan2;
}

/**
 * PRD v4.2: 격국 문제 패턴 체크
 */
function checkGyeokgukIssues(
  gyeokguk: GyeokgukType, 
  saju: SajuData,
  dayMaster: string
): GyeokgukIssue[] {
  const issues: GyeokgukIssue[] = [];
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  const tiangan: string[] = [];
  
  for (const p of pillars) {
    if (p && p.ganHan !== '?') tiangan.push(p.ganHan);
  }
  
  // 십성별 천간 체크
  const hasJeonggwan = tiangan.some(gan => calculateSipsin(dayMaster, gan) === '정관');
  const hasPyeongwan = tiangan.some(gan => calculateSipsin(dayMaster, gan) === '편관');
  const hasJeongin = tiangan.some(gan => calculateSipsin(dayMaster, gan) === '정인');
  const hasPyeonin = tiangan.some(gan => calculateSipsin(dayMaster, gan) === '편인');
  const hasSiksin = tiangan.some(gan => calculateSipsin(dayMaster, gan) === '식신');
  const hasSanggwan = tiangan.some(gan => calculateSipsin(dayMaster, gan) === '상관');
  
  // 십성 점수 계산
  const dayElement = getOhaeng(dayMaster) as Element;
  const elementScores = computeElementScores(saju);
  const jaesungScore = elementScores[CONTROLLING_MAP[dayElement]];
  const avg = Object.values(elementScores).reduce((a, b) => a + b, 0) / 5;
  
  // 일간 강약
  const strengthAnalysis = analyzeStrength(saju, dayElement);
  const isWeak = strengthAnalysis.structuralStrength === 'weak' || 
                 strengthAnalysis.structuralStrength === 'extreme-weak';
  
  // 1. 관살혼잡: 정관과 편관이 함께 투출
  if (hasJeonggwan && hasPyeongwan) {
    issues.push({
      type: '관살혼잡',
      severity: 'high',
      remedy: '합살유관(合殺留官) 또는 거관유살(去官留殺)',
    });
  }
  
  // 2. 재다신약: 재성 과다 + 일간 약함
  if (jaesungScore > 3.0 && isWeak) {
    issues.push({
      type: '재다신약',
      severity: 'medium',
      remedy: '비겁(比劫)으로 재성 분탈',
    });
  }
  
  // 3. 상관견관: 상관격에서 정관 투출
  if (gyeokguk === 'sanggwan' && hasJeonggwan) {
    issues.push({
      type: '상관견관',
      severity: 'high',
      remedy: '인성(印星)으로 상관 제어',
    });
  }
  
  // 4. 식신탈인: 식신격에서 편인(효신) 강함
  const hyosinScore = countSipseongScore(saju, dayMaster, ['편인']);
  if (gyeokguk === 'siksin' && hyosinScore >= 1.5) {
    issues.push({
      type: '식신탈인',
      severity: 'medium',
      remedy: '재성(財星)으로 효신 제어',
    });
  }
  
  // 5. 재파인: 인수격에서 재성 강함
  if ((gyeokguk === 'jeongin' || gyeokguk === 'pyeonin') && jaesungScore >= 2.5) {
    issues.push({
      type: '재파인',
      severity: 'medium',
      remedy: '비겁(比劫)으로 재 분탈',
    });
  }
  
  return issues;
}

// 십성 점수 계산 헬퍼
function countSipseongScore(saju: SajuData, dayMaster: string, sipseongList: string[]): number {
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  let score = 0;
  
  for (const p of pillars) {
    if (!p || p.ganHan === '?') continue;
    const ganSipsin = calculateSipsin(dayMaster, p.ganHan);
    const jiSipsin = calculateSipsin(dayMaster, p.jiHan);
    
    if (sipseongList.includes(ganSipsin)) score += 1.0;
    if (sipseongList.includes(jiSipsin)) score += 0.5;
    
    const hs = HIDDEN_STEMS[p.jiHan] ?? [];
    for (let i = 0; i < hs.length; i++) {
      const hsSipsin = calculateSipsin(dayMaster, hs[i]);
      if (sipseongList.includes(hsSipsin)) {
        score += (i === 0 ? 0.3 : i === 1 ? 0.2 : 0.1);
      }
    }
  }
  
  return score;
}

/**
 * 기존 격국 판단 (하위 호환성)
 */
function determineGyeokguk(saju: SajuData, dayMaster: string): GyeokgukType {
  return determineGyeokgukV2(saju, dayMaster).type;
}

// ========================================
// PRD v4.2: Priority Score 기반 의사결정
// ========================================

/**
 * PRD v4.2: 우선권 점수 계산
 * 격국/종격/조후 충돌 시 동적으로 우선순위 결정
 */
function calculatePriorityScore(
  jongResult: JonggyeokAnalysisV2 | null,
  johuResult: JohuAnalysis,
  gyeokResult: GyeokgukAnalysis
): PriorityScore {
  const WEIGHTS = {
    α: YONGSHIN_CONFIG.PRIORITY_JONG_WEIGHT,
    β: YONGSHIN_CONFIG.PRIORITY_JOHU_WEIGHT,
    γ: YONGSHIN_CONFIG.PRIORITY_GYEOK_WEIGHT,
  };
  
  // 종격 점수 (confidence 기반)
  let jongScore = 0;
  if (jongResult?.isJonggyeok) {
    const conf = jongResult.details.confidence;
    jongScore = conf === 'high' ? 3 : conf === 'medium' ? 2 : 1;
  }
  
  // 조후 긴급도 점수
  let johuScore = 0;
  if (johuResult.status === 'extreme') {
    johuScore = 3; // critical
  } else if (johuResult.status === 'poor') {
    johuScore = 2; // high
  } else if (johuResult.status === 'satisfied') {
    johuScore = 1; // normal
  }
  
  // 격국 문제 심각도
  let gyeokScore = 0;
  if (gyeokResult.issues.length > 0) {
    const maxSeverity = gyeokResult.issues.reduce((max, issue) => {
      const severityScore = issue.severity === 'high' ? 3 : issue.severity === 'medium' ? 2 : 1;
      return Math.max(max, severityScore);
    }, 0);
    gyeokScore = maxSeverity;
  }
  
  const jongPriority = jongScore * WEIGHTS.α;
  const johuPriority = johuScore * WEIGHTS.β;
  const gyeokPriority = gyeokScore * WEIGHTS.γ;
  
  // 우선 결정
  let winner: 'jong' | 'johu_immediate' | 'johu_with_eokbu' | 'gyeok' = 'gyeok';
  
  if (jongPriority >= johuPriority && jongPriority >= gyeokPriority && jongPriority > 0) {
    winner = 'jong';
  } else if (johuPriority >= jongPriority && johuPriority >= gyeokPriority) {
    // 조후 점수 4.5 이상이면 즉시 확정 (critical × 1.5)
    if (johuPriority >= 4.5) {
      winner = 'johu_immediate';
    } else {
      winner = 'johu_with_eokbu';
    }
  }
  
  return {
    jong: Number(jongPriority.toFixed(2)),
    johu: Number(johuPriority.toFixed(2)),
    gyeok: Number(gyeokPriority.toFixed(2)),
    winner,
  };
}

// ========================================
// PRD v4.2: 통관 성립 조건 검증
// ========================================

/**
 * PRD v4.2: 통관 필요 여부 + 성립 조건 통합 체크
 */
function checkTonggwanNeed(
  element1: Element,
  element2: Element,
  elementScores: Record<Element, number>
): TonggwanValidation {
  const score1 = elementScores[element1];
  const score2 = elementScores[element2];
  
  // 두 오행이 비슷한 힘일 때만 통관 필요
  if (Math.abs(score1 - score2) >= YONGSHIN_CONFIG.TONGGWAN_SCORE_DIFF) {
    return { 
      needed: false, 
      valid: false,
      reason: '한쪽이 압도 → 통관 불필요' 
    };
  }
  
  // 통관 오행 찾기 (A극B 관계에서 A가 생하고 B를 생하는 오행)
  const tonggwanElement = GENERATING_MAP[element1];
  if (GENERATING_MAP[tonggwanElement] !== element2) {
    return { 
      needed: true, 
      valid: false,
      reason: '통관 오행 불명확' 
    };
  }
  
  // 통관 성립 조건 검증
  return validateTonggwan(tonggwanElement, elementScores);
}

/**
 * PRD v4.2: 통관 성립 조건 검증
 */
function validateTonggwan(
  tonggwanElement: Element,
  elementScores: Record<Element, number>
): TonggwanValidation {
  const score = elementScores[tonggwanElement];
  
  // ① 원국 존재 체크
  if (score < YONGSHIN_CONFIG.TONGGWAN_MIN_EXIST) {
    return {
      needed: true,
      element: tonggwanElement,
      valid: false,
      reason: '원국 부재 → 대운/세운에서 보완 필요',
      validationDetail: {
        existsInWonguk: false,
        score,
        minRequired: YONGSHIN_CONFIG.TONGGWAN_MIN_SCORE,
      },
    };
  }
  
  // ② 최소 힘 체크
  if (score < YONGSHIN_CONFIG.TONGGWAN_MIN_SCORE) {
    return {
      needed: true,
      element: tonggwanElement,
      valid: false,
      reason: '통관력 부족',
      validationDetail: {
        existsInWonguk: true,
        score,
        minRequired: YONGSHIN_CONFIG.TONGGWAN_MIN_SCORE,
      },
    };
  }
  
  // ③ 피극 체크 (통관 오행을 극하는 오행이 강한지)
  const controllerElement = invControlling(tonggwanElement);
  const controllerScore = elementScores[controllerElement];
  
  if (controllerScore > score * YONGSHIN_CONFIG.TONGGWAN_CONTROL_RATIO) {
    return {
      needed: true,
      element: tonggwanElement,
      valid: false,
      reason: '통관 오행이 극 당함 → 무력화',
      validationDetail: {
        existsInWonguk: true,
        score,
        minRequired: YONGSHIN_CONFIG.TONGGWAN_MIN_SCORE,
        controllerElement,
        controllerScore,
      },
    };
  }
  
  return {
    needed: true,
    element: tonggwanElement,
    valid: true,
    reason: '통관 유효',
    validationDetail: {
      existsInWonguk: true,
      score,
      minRequired: YONGSHIN_CONFIG.TONGGWAN_MIN_SCORE,
    },
  };
}

/**
 * 병약 분석 - PRD v4.2 통관 검증 포함
 */
function analyzeByungyak(
  saju: SajuData,
  dayElement: Element,
  elementScores: Record<Element, number>,
  ohaeng: OhaengAnalysis
): ByungyakAnalysis {
  const vals = Object.values(elementScores);
  const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  
  // 과다 오행 찾기
  let excessElement: Element | null = null;
  let maxExcess = 0;
  
  for (const [element, score] of Object.entries(elementScores) as [Element, number][]) {
    const rel = score / (avg || 1);
    if (rel > 1.8 && score > maxExcess) {
      maxExcess = score;
      excessElement = element;
    }
  }
  
  if (excessElement) {
    const korean = ELEMENT_TO_KOREAN[excessElement];
    const generating = GENERATING_MAP[excessElement];
    const controlling = invControlling(excessElement);
    
    const generatingScore = elementScores[generating] / (avg || 1);
    const controllingScore = elementScores[controlling] / (avg || 1);
    
    let yak: Element;
    let description: string;
    
    // [수정] 설기와 극 중 원국에 존재하면서 더 약한 것 선택
    if (elementScores[generating] > 0 && generatingScore < controllingScore) {
      yak = generating;
      description = `${korean} 과다 → ${ELEMENT_TO_KOREAN[generating]}로 설기(洩氣) 필요`;
    } else if (elementScores[controlling] > 0) {
      yak = controlling;
      description = `${korean} 과다 → ${ELEMENT_TO_KOREAN[controlling]}로 극(克) 필요`;
    } else {
      yak = generating;
      description = `${korean} 과다 → ${ELEMENT_TO_KOREAN[generating]}로 설기(洩氣) 필요 (대운에서 보완)`;
    }
    
    return {
      byung: {
        element: excessElement,
        type: 'excess',
        description: `${korean} 기운이 과다하여 명식의 균형을 깨뜨림`,
      },
      yak,
      description,
    };
  }
  
  // 통관 필요성 확인
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  const conflicts: Array<{ from: Element; to: Element }> = [];
  
  for (const p of pillars) {
    if (!p || p.ganHan === '?') continue;
    const ganElement = getOhaeng(p.ganHan);
    const jiElement = getOhaeng(p.jiHan);
    
    if (ganElement && jiElement) {
      if (CONTROLLING_MAP[ganElement] === jiElement || CONTROLLING_MAP[jiElement] === ganElement) {
        conflicts.push({ from: ganElement, to: jiElement });
      }
    }
  }
  
  // [Task 5] 통관 용신 로직 개선
  if (conflicts.length >= 2) {
    const conflictElements = new Set<Element>();
    for (const c of conflicts) {
      conflictElements.add(c.from);
      conflictElements.add(c.to);
    }
    
    // 충돌하는 두 오행 사이를 연결하는 통관 오행 찾기
    for (const c of conflicts) {
      // A극B 관계에서 통관 = A가 생하고 B를 생하는 오행
      // 예: 금극목 → 수가 통관 (금생수, 수생목)
      const tongguanElement = GENERATING_MAP[c.from];
      if (GENERATING_MAP[tongguanElement] === c.to) {
        return {
          byung: {
            element: c.from,
            type: 'conflict',
            description: `${ELEMENT_TO_KOREAN[c.from]}와 ${ELEMENT_TO_KOREAN[c.to]}의 상극 충돌`,
          },
          yak: tongguanElement,
          description: `${ELEMENT_TO_KOREAN[tongguanElement]}로 통관하여 ${ELEMENT_TO_KOREAN[c.from]} → ${ELEMENT_TO_KOREAN[tongguanElement]} → ${ELEMENT_TO_KOREAN[c.to]} 연결`,
        };
      }
    }
  }
  
  // 인성과다 확인
  const dayMaster = saju.day.ganHan;
  let inseongCount = 0;
  for (const p of pillars) {
    if (!p || p.ganHan === '?') continue;
    const sipsin = calculateSipsin(dayMaster, p.ganHan);
    if (sipsin === '편인' || sipsin === '정인') {
      inseongCount++;
    }
  }
  
  if (inseongCount >= 3) {
    const jaesung = CONTROLLING_MAP[dayElement];
    return {
      byung: {
        element: invGenerating(dayElement),
        type: 'blocking',
        description: '인성 과다로 인한 막힘',
      },
      yak: jaesung,
      description: `${ELEMENT_TO_KOREAN[jaesung]}로 인성을 극하여 막힘 해소`,
    };
  }
  
  return {
    byung: null,
    yak: null,
    description: '명확한 병약 관계 없음',
  };
}

/**
 * 십성 기반 용신 표현
 */
function getSipseongForElement(element: Element, dayMaster: string): Sipsin {
  const elementToGan: Record<Element, string[]> = {
    wood: ['甲', '乙'],
    fire: ['丙', '丁'],
    earth: ['戊', '己'],
    metal: ['庚', '辛'],
    water: ['壬', '癸'],
  };
  
  const ganCandidates = elementToGan[element] || [];
  if (ganCandidates.length === 0) return '비견';
  
  return calculateSipsin(dayMaster, ganCandidates[0]);
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

function getEokbuCandidates(day: Element, strength: IlganStrength['strength'] | 'extreme-strong' | 'extreme-weak'): Element[] {
  // 극강은 신강과 동일하게 처리
  if (strength === 'strong' || strength === 'extreme-strong') {
    return dedupe([GENERATING_MAP[day], CONTROLLING_MAP[day], invControlling(day)]);
  }
  // 극약은 신약과 동일하게 처리
  if (strength === 'weak' || strength === 'extreme-weak') {
    return dedupe([invGenerating(day), day]);
  }
  return dedupe([GENERATING_MAP[day], CONTROLLING_MAP[day], invControlling(day), invGenerating(day), day]);
}

/**
 * 억부 용신 후보 검증
 * @param cand 후보 오행
 * @param elementScores 오행 점수
 * @param ohaeng 오행 불균형 분석
 * @returns 검증 통과 여부 (원국에 있고 과다하지 않으면 true)
 */
function validateEokbuCandidate(
  cand: Element,
  elementScores: Record<Element, number>,
  ohaeng: OhaengAnalysis
): boolean {
  // 원국에 없으면 통과 실패
  if (elementScores[cand] === 0) {
    return false;
  }
  
  // excess에 포함되면 통과 실패
  const candKorean = ELEMENT_TO_KOREAN[cand];
  if (hasKorean(ohaeng.excess, candKorean)) {
    return false;
  }
  
  // 둘 다 아니면 통과 성공
  return true;
}

function pickTopTwo(scored: Scored[]): { top: Scored; second?: Scored } | null {
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  if (!sorted.length) return null;
  return { top: sorted[0], second: sorted[1] };
}

/**
 * [Task 1] 원국 존재 여부를 반영한 억부 후보 점수 계산
 */
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
  
  // [Task 1] 원국 존재 여부 패널티
  if (elementScores[cand] === 0) {
    // 원국에 완전히 없음 → 대폭 감점
    score -= YONGSHIN_CONFIG.ABSENT_PENALTY;
  } else if (rel < YONGSHIN_CONFIG.WEAK_THRESHOLD) {
    // 매우 약함 → 소폭 감점
    score -= YONGSHIN_CONFIG.WEAK_PENALTY;
  } else if (rel < 0.7) {
    score += 0.8;
  }
  
  if (rel > 1.6) score -= 0.8;

  if (season === 'summer' || season === 'winter') score -= 0.3;
  if (hasKorean(ohaeng.excess, ELEMENT_TO_KOREAN[cand])) score -= 1.5;

  return score;
}

/**
 * PRD v4.2: 조후 필요 오행 판단 - 봄/가을 세분화
 * 
 * PRD 3.5.1 기준:
 * - 夏: 水 (조열 해소)
 * - 冬: 火 (한습 해소)
 * - 春: 火 (한기 잔존 해소) - 특히 寅월, 辰월
 * - 秋: 水 (조량 윤택)
 */
function neededElementBySeason(season: Season, dayElement: Element, johuAnalysis?: JohuAnalysis, monthJi?: string): Element {
  // 하절: 水로 조열 해소
  if (season === 'summer') return 'water'; 
  
  // 동절: 火로 한습 해소
  if (season === 'winter') return 'fire';  

  // 춘절: PRD 기준 火(丙火)로 한기 잔존 해소
  // - 초춘(寅월): 한기 잔존 → 火 필요
  // - 중춘(卯월): 온화 → 조후 부담 적음
  // - 늦봄(辰월): 습기 → 火 필요
  if (season === 'spring') {
    // PRD: 봄에는 기본적으로 火가 조후 용신
    return 'fire';
  }

  // 추절: PRD 기준 水(壬水)로 조량 윤택
  // - 초추(申월): 열기 잔존 → 水 필요
  // - 중추(酉월): 조량 → 水 필요
  // - 늦가을(戌월): 조토 → 水(癸) 필요
  if (season === 'autumn') {
    return 'water';
  }

  // 기본값
  return 'fire';
}

/**
 * 조후 분석: 명식 전체의 한열조습 상태 분석
 */
function analyzeJohu(saju: SajuData, dayElement: Element): JohuAnalysis {
  const pillars = [saju.year, saju.month, saju.day, saju.hour];
  
  let hanScore = 0;
  let yeolScore = 0;
  let joScore = 0;
  let seupScore = 0;
  
  const season = getSeason(saju.month.jiHan);
  if (season === 'winter') hanScore += 3;
  if (season === 'summer') yeolScore += 3;
  if (season === 'autumn') joScore += 2;
  if (season === 'spring') seupScore += 1;
  
  for (const p of pillars) {
    if (!p || p.ganHan === '?') continue;
    const isMonth = p === saju.month;
    const weight = isMonth ? 2.0 : 1.0;
    
    const ganElement = getOhaeng(p.ganHan);
    if (ganElement === 'water') {
      hanScore += weight;
      seupScore += weight * 0.5;
    } else if (ganElement === 'fire') {
      yeolScore += weight;
      joScore += weight * 0.5;
    } else if (ganElement === 'metal') {
      hanScore += weight * 0.7;
      joScore += weight;
    } else if (ganElement === 'wood') {
      yeolScore += weight * 0.5;
    }
    
    const jiElement = getOhaeng(p.jiHan);
    if (jiElement === 'water') {
      hanScore += weight * 1.5;
      seupScore += weight;
    } else if (jiElement === 'fire') {
      yeolScore += weight * 1.5;
      joScore += weight * 0.7;
    } else if (jiElement === 'metal') {
      hanScore += weight;
      joScore += weight * 1.2;
    } else if (jiElement === 'wood') {
      yeolScore += weight * 0.7;
    } else if (jiElement === 'earth') {
      const earthType = getEarthType(p.jiHan);
      if (earthType === 'wet') {
        seupScore += weight;
        hanScore += weight * 0.3;
      } else if (earthType === 'dry') {
        joScore += weight;
        yeolScore += weight * 0.3;
      }
    }
    
    const hs = HIDDEN_STEMS[p.jiHan] ?? [];
    for (let i = 0; i < hs.length; i++) {
      const stem = hs[i];
      const hsWeight = weightHiddenStem(i) * weight * 0.5;
      const hsElement = getOhaeng(stem);
      
      if (hsElement === 'water') {
        hanScore += hsWeight;
        seupScore += hsWeight * 0.5;
      } else if (hsElement === 'fire') {
        yeolScore += hsWeight;
        joScore += hsWeight * 0.5;
      } else if (hsElement === 'metal') {
        hanScore += hsWeight * 0.7;
        joScore += hsWeight;
      } else if (hsElement === 'wood') {
        yeolScore += hsWeight * 0.5;
      }
    }
  }
  
  const isExtreme = (hanScore >= 8 && seupScore >= 6) || (yeolScore >= 8 && joScore >= 6);
  const extremeType = (hanScore >= 8 && seupScore >= 6) ? 'hanseup' : 
                      (yeolScore >= 8 && joScore >= 6) ? 'joyeol' : undefined;
  
  let status: 'extreme' | 'poor' | 'good' | 'satisfied';
  let description: string;
  let neededElement: Element;
  
  if (isExtreme) {
    status = 'extreme';
    if (extremeType === 'hanseup') {
      description = '한습극(寒濕極): 한기와 습기가 극도로 강함';
      neededElement = 'fire';
    } else {
      description = '조열극(燥熱極): 열기와 조기가 극도로 강함';
      neededElement = 'water';
    }
  } else if ((hanScore >= 6 || yeolScore >= 6) && (seupScore >= 4 || joScore >= 4)) {
    status = 'poor';
    if (hanScore > yeolScore) {
      description = '조후 불량: 한습이 과도함';
      neededElement = 'fire';
    } else {
      description = '조후 불량: 조열이 과도함';
      neededElement = 'water';
    }
  } else if (Math.abs(hanScore - yeolScore) <= 2 && Math.abs(seupScore - joScore) <= 2) {
    status = 'satisfied';
    description = '조후 양호: 한열조습이 균형적임';
    neededElement = neededElementBySeason(season, dayElement);
  } else {
    status = 'good';
    description = '조후 양호: 기본적인 조후 조건 충족';
    neededElement = neededElementBySeason(season, dayElement);
  }
  
  return {
    hanScore: Number(hanScore.toFixed(2)),
    yeolScore: Number(yeolScore.toFixed(2)),
    joScore: Number(joScore.toFixed(2)),
    seupScore: Number(seupScore.toFixed(2)),
    isExtreme,
    extremeType,
    neededElement,
    status,
    description,
  };
}

function isControlling(from: Element, to: Element): boolean {
  return CONTROLLING_MAP[from] === to;
}

function isGenerating(from: Element, to: Element): boolean {
  return GENERATING_MAP[from] === to;
}

/**
 * 조후 상태에 따른 명확한 priorityReason 생성
 */
function generatePriorityReason(
  johuStatus: 'extreme' | 'poor' | 'satisfied' | 'good',
  season: Season,
  primaryScored: Scored,
  ilganStrength: 'strong' | 'weak' | 'neutral',
  imbalance: OhaengAnalysis
): string {
  const seasonKr = season === 'spring' ? '봄' : season === 'summer' ? '여름' : season === 'autumn' ? '가을' : '겨울';
  const elementKr = ELEMENT_TO_KOREAN[primaryScored.element];
  const strengthKr = ilganStrength === 'strong' ? '신강' : ilganStrength === 'weak' ? '신약' : '중화';
  
  // 조후 상태별 근거 문구 생성
  if (johuStatus === 'satisfied' || johuStatus === 'good') {
    // 조후 필요 없음 - 억부만 고려
    let reason = `${seasonKr} 기운으로 조후 부담 낮음 → 억부 용신 ${elementKr}`;
    
    // 신강/신약에 따른 추가 설명
    if (ilganStrength === 'strong') {
      if (imbalance.excess.length > 0) {
        reason += ` (${strengthKr} 사주에서 ${imbalance.excess.join(', ')} 과다를 ${elementKr}으로 억제)`;
      } else {
        reason += ` (${strengthKr} 사주의 균형점)`;
      }
    } else if (ilganStrength === 'weak') {
      reason += ` (${strengthKr} 사주에 ${elementKr} 보강)`;
    } else {
      reason += ` (${strengthKr} 사주의 안정)`;
    }
    
    return reason;
  }
  
  // poor 상태는 상위에서 병행 고려 추가됨
  return `억부 용신: ${elementKr} (${primaryScored.score.toFixed(1)})`;
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
  
  // [Task 1] 원국 존재 여부 반영
  if (elementScores[cand] === 0) {
    score -= 2.0;
  } else if (rel < 0.7) {
    score += 1.0;
  }
  
  if (rel > 1.6) score -= 1.0;

  // [Task 2] 봄/가을은 조후 필요성 낮음
  if (season === 'summer' || season === 'winter') score += 1.0;
  else score -= 0.5; // 봄/가을 감점

  if (hasKorean(ohaeng.excess, ELEMENT_TO_KOREAN[cand])) score -= 1.5;
  return score;
}

function confidenceFromGap(gap: number): 'high' | 'medium' | 'low' {
  if (gap >= YONGSHIN_CONFIG.CONFIDENCE_HIGH) return 'high';
  if (gap >= YONGSHIN_CONFIG.CONFIDENCE_MEDIUM) return 'medium';
  return 'low';
}

// ========================================
// 희신/기신 계산 (내부 로직용) - UI에서는 미사용
// ========================================

/**
 * 희신/기신 계산 (내부 로직용)
 * 용신 결정 과정에서 참조용으로만 사용
 */
function calculateHeeshinGishin(
  yongshin: Element,
  day: Element,
  strength: IlganStrength['strength'],
  ohaeng: OhaengAnalysis
): { heeshin: string[]; gishin: string[] } {
  const heeshin: string[] = [];
  const gishin: string[] = [];

  const heeshinElement = invGenerating(yongshin);
  const gishinElement = invControlling(yongshin);
  
  heeshin.push(ELEMENT_TO_KOREAN[heeshinElement]);
  gishin.push(ELEMENT_TO_KOREAN[gishinElement]);
  
  for (const k of (ohaeng.excess ?? []).slice(0, 2)) {
    if (!gishin.includes(k) && k !== ELEMENT_TO_KOREAN[yongshin]) {
      gishin.push(k);
    }
  }

  return {
    heeshin: dedupe(heeshin),
    gishin: dedupe(gishin).filter(k => k !== ELEMENT_TO_KOREAN[yongshin]),
  };
}

/**
 * PRD v4.2: 메인 용신 계산 함수 (재구성)
 * - Priority Score 기반 의사결정
 * - 5분류 체계 (희신/기신/구신/한신/오행설기)
 * - decisionPath 추가
 */
export function calculateYongshin(sajuData: SajuData): Yongshin | null {
  if (!sajuData.ilganStrength) return null;

  const ilganStrength = sajuData.ilganStrength;
  const dayMaster = sajuData.day.ganHan;
  const monthJi = sajuData.month.jiHan;

  const dayElement = getOhaeng(dayMaster) as Element;
  if (!dayElement) return null;

  const season = getSeason(monthJi);
  const decisionPath: DecisionStep[] = [];

  // ============================================
  // Phase 1: 합충 분석 및 점수 조정
  // ============================================
  const combinations = analyzeCombinations(sajuData);
  const baseElementScores = computeElementScores(sajuData);
  const elementScores = computeElementScoresWithCombinations(sajuData, combinations);
  
  // 합충 영향 기록
  const hapChungEffects: string[] = [];
  for (const elem of Object.keys(combinations.totalScoreAdjustment) as Element[]) {
    const adj = combinations.totalScoreAdjustment[elem];
    if (Math.abs(adj) >= 0.5) {
      hapChungEffects.push(`${ELEMENT_TO_KOREAN[elem]} ${adj > 0 ? '+' : ''}${adj.toFixed(1)}`);
    }
  }
  
  // 합충 분석 조건 설명 생성
  const getHapChungCondition = () => {
    const parts: string[] = [];
    if (combinations.tianganHe.length > 0) {
      parts.push(`천간합 ${combinations.tianganHe.length}개`);
    }
    if (combinations.dizhiHe.length > 0) {
      parts.push(`지지합 ${combinations.dizhiHe.length}개`);
    }
    if (combinations.chong.length > 0) {
      parts.push(`충 ${combinations.chong.length}개`);
    }
    if (parts.length === 0) {
      return '합충 관계 없음';
    }
    return parts.join(', ');
  };
  
  // 합충 분석 목적 설명
  const hapChungPurpose = '합(合)과 충(沖)으로 인한 오행 점수 변화 분석';
  
  if (hapChungEffects.length > 0 || combinations.tianganHe.length > 0 || combinations.dizhiHe.length > 0 || combinations.chong.length > 0) {
    decisionPath.push({
      step: '합충분석',
      result: hapChungEffects.length > 0 ? hapChungEffects.join(', ') : '합충 영향 없음',
      condition: `${hapChungPurpose} | ${getHapChungCondition()}`,
      continued: true,
    });
  }

  const imbalance: OhaengAnalysis = sajuData.ohaengAnalysis
    ? { 
        excess: sajuData.ohaengAnalysis.excess, 
        deficient: sajuData.ohaengAnalysis.deficient, 
        missing: sajuData.ohaengAnalysis.missing 
      }
    : deriveOhaengAnalysisFromScores(elementScores);

  // ============================================
  // PRD 흐름: 1단계 - 격국 판단
  // ============================================
  const gyeokgukAnalysis = determineGyeokgukV2(sajuData, dayMaster);
  
  // 격국 판단 상세 조건 생성
  const getGyeokgukCondition = () => {
    if (gyeokgukAnalysis.touchulPosition) {
      const positionKr = gyeokgukAnalysis.touchulPosition === 'jeonggi' ? '정기' 
        : gyeokgukAnalysis.touchulPosition === 'junggi' ? '중기' 
        : '여기';
      return `${monthJi}월 ${positionKr} ${gyeokgukAnalysis.touchulGan || ''} 투출`;
    }
    // 투출 없을 때 상세 사유
    const jijanggan = sajuData.month.jijanggan || [];
    const jijangganStr = jijanggan.join(', ') || '없음';
    const tianganStr = [sajuData.year.ganHan, sajuData.month.ganHan, sajuData.day.ganHan, sajuData.hour.ganHan].join(', ');
    return `투출 없음 (월지 ${monthJi} 지장간: ${jijangganStr} → 천간 ${tianganStr}에 미투출)`;
  };
  
  decisionPath.push({
    step: '격국판단',
    result: `${getGyeokgukKorean(gyeokgukAnalysis.type)} (${gyeokgukAnalysis.confidence})`,
    condition: getGyeokgukCondition(),
    continued: true,
  });
  
  // ============================================
  // PRD 흐름: 2단계 - 강약 분석 (Phase 3: 사령분일 반영)
  // ============================================
  const strengthAnalysis = analyzeStrength(sajuData, dayElement);
  
  // 사령분일 정보 (dayInMonth는 현재 기본값 사용, 추후 절기 연동 시 활용)
  const saryeongResult = calculateDeukryeongWithSaryeong(dayElement, monthJi);
  if (saryeongResult.saryeongInfo.commandingStem) {
    decisionPath.push({
      step: '사령분석',
      result: saryeongResult.saryeongInfo.description,
      condition: `득령비율 ${(saryeongResult.ratio * 100).toFixed(0)}%`,
      continued: true,
    });
  }
  
  // ============================================
  // Phase 2: 특수 격국 판별 (종격 전 체크)
  // ============================================
  
  // 일행득기격 체크
  const ilhaengResult = checkIlhaengDeukgi(sajuData, dayElement, elementScores);
  if (ilhaengResult.isIlhaeng) {
    decisionPath.push({
      step: '일행득기격',
      result: ilhaengResult.type!,
      condition: `일행득기격 충족 요건: 일간 오행 비율 ≥80% + 관살 ≤0.5 | ${ilhaengResult.reason}`,
      continued: false,  // 일행득기격이면 바로 용신 결정
    });
    
    // 일행득기격 용신 반환
    const yongshinElement = ilhaengResult.yongshin!;
    return {
      primary: ELEMENT_TO_KOREAN[yongshinElement],
      type: '억부' as const,
      confidence: 'high' as const,
      evidence: { decisionPath },
    };
  } else {
    // 일행득기격 조건 불충족 시 decisionPath에 추가
    decisionPath.push({
      step: '일행득기격',
      result: '일행득기격 아님',
      condition: `일행득기격 충족 요건: 일간 오행 비율 ≥80% + 관살 ≤0.5`,
      continued: true,
      skipReason: `일행득기격 조건 불충족: ${ilhaengResult.reason}`,
    });
  }
  
  // 양신성상격 체크
  const yangshinResult = checkYangshin(elementScores);
  if (yangshinResult.isYangshin) {
    decisionPath.push({
      step: '양신성상격',
      result: `${ELEMENT_TO_KOREAN[yangshinResult.elements![0]]} + ${ELEMENT_TO_KOREAN[yangshinResult.elements![1]]}`,
      condition: `양신성상격 충족 요건: 2개 오행만 존재 + 각 ≥30% + 상생/상극 관계 | ${yangshinResult.reason}`,
      continued: false,
    });
    
    // 양신성상격 용신 반환
    const yongshinElement = yangshinResult.yongshin!;
    return {
      primary: ELEMENT_TO_KOREAN[yongshinElement],
      type: yangshinResult.relationship === 'controlling' ? '통관' as const : '억부' as const,
      confidence: 'medium' as const,
      evidence: { decisionPath },
    };
  } else {
    // 양신성상격 조건 불충족 시 decisionPath에 추가
    decisionPath.push({
      step: '양신성상격',
      result: '양신성상격 아님',
      condition: `양신성상격 충족 요건: 2개 오행만 존재 + 각 ≥30% + 상생/상극 관계`,
      continued: true,
      skipReason: `양신성상격 조건 불충족: ${yangshinResult.reason}`,
    });
  }
  
  // ============================================
  // PRD 흐름: 3단계 - 종격 판단
  // ============================================
  const jonggyeokV2 = checkJonggyeokV2(sajuData, dayElement, strengthAnalysis);
  
  // 종격 불충족 사유 상세 생성
  const getJonggyeokFailureReason = () => {
    const { rootScore, support, drain, oppression } = jonggyeokV2.scores;
    const deukryeong = strengthAnalysis.deukryeong;
    const failures: string[] = [];
    
    // 종강격 조건 체크 (득령 + 근점수≥6.0 + 관살≤1.0 + 설기≤1.5)
    const gangeokConditions = {
      deukryeong: { met: deukryeong, label: '득령', actual: deukryeong ? '○' : '✗', required: '필요' },
      rootScore: { met: rootScore >= 6.0, label: '근점수', actual: rootScore.toFixed(1), required: '≥6.0' },
      oppression: { met: oppression <= 1.0, label: '관살', actual: oppression.toFixed(1), required: '≤1.0' },
      drain: { met: drain <= 1.5, label: '설기', actual: drain.toFixed(1), required: '≤1.5' },
    };
    
    // 종약격 조건 체크 (실령 + 근점수≤2.0 + 지원≤1.5 + 식상/재/관≥3.0)
    const yakgeokConditions = {
      silryeong: { met: !deukryeong, label: '실령', actual: deukryeong ? '✗(득령)' : '○', required: '필요' },
      rootScore: { met: rootScore <= 2.0, label: '근점수', actual: rootScore.toFixed(1), required: '≤2.0' },
      support: { met: support <= 1.5, label: '지원', actual: support.toFixed(1), required: '≤1.5' },
    };
    
    // 근점수로 어느 쪽에 가까운지 판단
    if (rootScore >= 4.0) {
      // 종강격에 더 가까움
      failures.push('【종강격 기준】');
      if (!gangeokConditions.deukryeong.met) failures.push(`${gangeokConditions.deukryeong.label}: ${gangeokConditions.deukryeong.actual} (${gangeokConditions.deukryeong.required})`);
      if (!gangeokConditions.rootScore.met) failures.push(`${gangeokConditions.rootScore.label}: ${gangeokConditions.rootScore.actual} (${gangeokConditions.rootScore.required})`);
      if (!gangeokConditions.oppression.met) failures.push(`${gangeokConditions.oppression.label}: ${gangeokConditions.oppression.actual} (${gangeokConditions.oppression.required})`);
      if (!gangeokConditions.drain.met) failures.push(`${gangeokConditions.drain.label}: ${gangeokConditions.drain.actual} (${gangeokConditions.drain.required})`);
    } else {
      // 종약격에 더 가까움
      failures.push('【종약격 기준】');
      if (!yakgeokConditions.silryeong.met) failures.push(`${yakgeokConditions.silryeong.label}: ${yakgeokConditions.silryeong.actual} (${yakgeokConditions.silryeong.required})`);
      if (!yakgeokConditions.rootScore.met) failures.push(`${yakgeokConditions.rootScore.label}: ${yakgeokConditions.rootScore.actual} (${yakgeokConditions.rootScore.required})`);
      if (!yakgeokConditions.support.met) failures.push(`${yakgeokConditions.support.label}: ${yakgeokConditions.support.actual} (${yakgeokConditions.support.required})`);
    }
    
    return failures.length > 1 ? failures.join(' | ') : '종격 조건 불충족';
  };
  
  // 종격 충족 요건 설명 생성
  const getJonggyeokCriteria = () => {
    if (jonggyeokV2.isJonggyeok) {
      if (jonggyeokV2.type === 'jonggang') {
        return '종강격 충족 요건: 득령 + 근점수≥6.0 + 관살≤1.0 + 설기≤1.5';
      } else if (jonggyeokV2.type === 'jongyak') {
        return '종약격 충족 요건: 실령 + 근점수≤2.0 + 지원≤1.5 + 식상/재/관≥3.0';
      }
      return '종격 충족 요건';
    }
    return '종격 충족 요건: 종강격(득령 + 근점수≥6.0 + 관살≤1.0 + 설기≤1.5) 또는 종약격(실령 + 근점수≤2.0 + 지원≤1.5 + 식상/재/관≥3.0)';
  };

  decisionPath.push({
    step: '종격체크',
    result: jonggyeokV2.isJonggyeok 
      ? `${jonggyeokV2.type}${jonggyeokV2.subType ? ` (${jonggyeokV2.subType})` : ''}`
      : '보통격',
    condition: jonggyeokV2.isJonggyeok
      ? `${getJonggyeokCriteria()} | 근점수 ${jonggyeokV2.scores.rootScore}, 지원 ${jonggyeokV2.scores.support}, 설기 ${jonggyeokV2.scores.drain}, 관살 ${jonggyeokV2.scores.oppression}`
      : `${getJonggyeokCriteria()} | ${getJonggyeokFailureReason()}`,
    continued: !jonggyeokV2.isJonggyeok,
    skipReason: !jonggyeokV2.isJonggyeok ? `종격 조건 불충족: ${getJonggyeokFailureReason()}` : undefined,
  });
  
  // ============================================
  // PRD 흐름: 4단계 - 조후 분석
  // ============================================
  const johuAnalysis = analyzeJohu(sajuData, dayElement);
  
  // 조후 상태 한글 변환
  const getJohuStatusKorean = (status: string): string => {
    const map: Record<string, string> = {
      'extreme': '급선무(急先務)',
      'poor': '부족(不足)',
      'satisfied': '충족(充足)',
      'good': '양호(良好)',
    };
    return map[status] || status;
  };
  
  // 계절 한글 변환
  const getSeasonKorean = (s: string): string => {
    const map: Record<string, string> = {
      'spring': '춘절(春)',
      'summer': '하절(夏)',
      'autumn': '추절(秋)',
      'winter': '동절(冬)',
    };
    return map[s] || s;
  };
  
  // 조후용신 조건 불충족 이유 생성
  const getJohuSkipReason = (status: string): string | undefined => {
    if (status === 'extreme') return undefined; // extreme이면 조후용신 적용
    if (status === 'poor') return `조후 상태가 부족(不足)이지만 extreme이 아니어서 조후용신 적용 불가`;
    if (status === 'satisfied' || status === 'good') return `조후 상태가 충족/양호하여 조후용신 필요 없음`;
    return `조후 상태가 extreme이 아니어서 조후용신 적용 불가`;
  };

  decisionPath.push({
    step: '조후분석',
    result: `${getJohuStatusKorean(johuAnalysis.status)} (${getSeasonKorean(season)}, ${ELEMENT_TO_KOREAN[johuAnalysis.neededElement]} ${elementScores[johuAnalysis.neededElement].toFixed(1)})`,
    condition: `조후용신 충족 요건: 조후 상태가 extreme(급선무)일 때만 적용 | 현재: ${getSeasonKorean(season)} + ${ELEMENT_TO_KOREAN[johuAnalysis.neededElement]} ${elementScores[johuAnalysis.neededElement].toFixed(1)} ${johuAnalysis.status === 'extreme' ? '< 0.5 (extreme)' : johuAnalysis.status === 'poor' ? '0.5~2.0 (poor)' : '>= 2.0 (satisfied/good)'}`,
    continued: johuAnalysis.status !== 'extreme',
    skipReason: getJohuSkipReason(johuAnalysis.status),
  });
  
  // ============================================
  // PRD v4.2: Priority Score 기반 의사결정
  // ============================================
  const priorityScore = calculatePriorityScore(
    jonggyeokV2.isJonggyeok ? jonggyeokV2 : null,
      johuAnalysis,
    gyeokgukAnalysis
  );
  
  // ============================================
  // 종격 확정 케이스
  // ============================================
  if (priorityScore.winner === 'jong' && jonggyeokV2.isJonggyeok) {
    decisionPath.push({
      step: '최종용신',
      result: `${jonggyeokV2.type} 용신`,
      condition: `Priority Score: 종격 ${priorityScore.jong} > 조후 ${priorityScore.johu}`,
      continued: false,
    });
    
    return createJonggyeokYongshinV2(
      jonggyeokV2,
      dayElement,
      elementScores,
      decisionPath
    );
  }
  
  // ============================================
  // 조후 extreme 즉시 확정 케이스
  // ============================================
  if (priorityScore.winner === 'johu_immediate') {
    decisionPath.push({
      step: '최종용신',
      result: `${ELEMENT_TO_KOREAN[johuAnalysis.neededElement]} (조후)`,
      condition: `조후 ${johuAnalysis.status} → 즉시 확정`,
      continued: false,
    });
    
    const roots = countRootsWeighted(sajuData, dayElement);
    // structuralStrength를 사용하여 극강/극약도 올바르게 처리
    const eokbuCandidates = getEokbuCandidates(dayElement, strengthAnalysis.structuralStrength);
    // scoreEokbuCandidate는 'strong' | 'weak' | 'neutral'만 받으므로 매핑 필요
    const strengthForScoringJohu = strengthAnalysis.structuralStrength === 'extreme-strong' ? 'strong' :
                                   strengthAnalysis.structuralStrength === 'extreme-weak' ? 'weak' :
                                   strengthAnalysis.structuralStrength;
    const eokbuScored = eokbuCandidates.map(el => ({
      element: el,
      score: scoreEokbuCandidate(el, dayElement, strengthForScoringJohu, imbalance, season, roots, elementScores),
    }));
    const eokbuTop2 = pickTopTwo(eokbuScored);
    
    return createJohuYongshinV2(johuAnalysis, eokbuTop2, decisionPath);
  }
  
  // ============================================
  // PRD 흐름: 5단계 - 억부 판단 (보통격 / 조후 poor 병행)
  // ============================================
  
  // 강약 한글 변환
  const getStrengthKorean = (strength: string): string => {
    const map: Record<string, string> = {
      'extreme-strong': '극강(極强)',
      'strong': '신강(身强)',
      'neutral': '중화(中和)',
      'weak': '신약(身弱)',
      'extreme-weak': '극약(極弱)',
    };
    return map[strength] || strength;
  };
  
  // 강약 분석 상세 조건 생성
  const getStrengthCondition = () => {
    const { deukryeong, rootScore, structuralStrength } = strengthAnalysis;
    const deukryeongStr = deukryeong ? '득령 ○' : '실령 ✗';
    
    let criteriaStr = '';
    switch (structuralStrength) {
      case 'extreme-strong':
        criteriaStr = `기준: 득령 + 근점수≥6.0`;
        break;
      case 'strong':
        criteriaStr = `기준: 득령 + 근점수≥4.0`;
        break;
      case 'neutral':
        criteriaStr = `기준: 근점수 3.0~5.0`;
        break;
      case 'weak':
        criteriaStr = `기준: 근점수 1.5~3.0`;
        break;
      case 'extreme-weak':
        criteriaStr = `기준: 근점수<1.5`;
        break;
      default:
        criteriaStr = '';
    }
    
    return `${deukryeongStr} | 근점수 ${rootScore.toFixed(1)} | ${criteriaStr}`;
  };
  
  decisionPath.push({
    step: '강약분석',
    result: `${getStrengthKorean(strengthAnalysis.structuralStrength)} (근점수 ${strengthAnalysis.rootScore.toFixed(1)})`,
    condition: getStrengthCondition(),
    continued: true,
  });
  
  const roots = countRootsWeighted(sajuData, dayElement);
  // structuralStrength를 사용하여 극강/극약도 올바르게 처리
  const eokbuCandidates = getEokbuCandidates(dayElement, strengthAnalysis.structuralStrength);
  
  // 순차 검증: 후보 배열 순서대로 검증하여 통과한 첫 번째 후보 선택
  let validatedPrimary: Element | null = null;
  const validationResults: Array<{ element: Element; passed: boolean; reason?: string }> = [];
  
  for (const cand of eokbuCandidates) {
    const isValid = validateEokbuCandidate(cand, elementScores, imbalance);
    const candKorean = ELEMENT_TO_KOREAN[cand];
    let reason: string | undefined;
    
    if (!isValid) {
      if (elementScores[cand] === 0) {
        reason = '원국에 없음';
      } else if (hasKorean(imbalance.excess, candKorean)) {
        reason = '과다 오행';
      }
    }
    
    validationResults.push({ element: cand, passed: isValid, reason });
    
    if (isValid && validatedPrimary === null) {
      validatedPrimary = cand;
    }
  }
  
  // 모든 후보에 대해 점수 계산 (폴백 및 보조용신 결정용)
  // scoreEokbuCandidate는 'strong' | 'weak' | 'neutral'만 받으므로 매핑 필요
  const strengthForScoring = strengthAnalysis.structuralStrength === 'extreme-strong' ? 'strong' :
                              strengthAnalysis.structuralStrength === 'extreme-weak' ? 'weak' :
                              strengthAnalysis.structuralStrength;
  const eokbuScored = eokbuCandidates.map(el => ({
    element: el,
    score: scoreEokbuCandidate(el, dayElement, strengthForScoring, imbalance, season, roots, elementScores),
    isAbsent: elementScores[el] === 0,
  }));
  
  // 검증 통과한 후보가 있으면 그것을 선택, 없으면 점수 기반으로 폴백
  let primaryScored: { element: Element; score: number; isAbsent: boolean };
  if (validatedPrimary !== null) {
    const found = eokbuScored.find(s => s.element === validatedPrimary);
    if (!found) return null;
    primaryScored = found;
  } else {
    // 모든 후보가 검증 실패 시 점수 기반으로 폴백
    const eokbuTop2 = pickTopTwo(eokbuScored);
    if (!eokbuTop2) return null;
    primaryScored = {
      element: eokbuTop2.top.element,
      score: eokbuTop2.top.score,
      isAbsent: eokbuTop2.top.isAbsent ?? false,
    };
  }
  
  const primaryK = ELEMENT_TO_KOREAN[primaryScored.element];
  const primarySipseong = getSipseongForElement(primaryScored.element, dayMaster);
  
  // ============================================
  // PRD 흐름: 6단계 - 병약/통관 보정
  // ============================================
  const byungyak = analyzeByungyak(sajuData, dayElement, elementScores, imbalance);
  
  let finalPrimaryElement = primaryScored.element;
  let finalPrimaryType: 'eokbu' | 'byungyak' | 'tonggwan' = 'eokbu';
  let priorityReason: string;
  
  // 통관 용신 우선 검토
  if (byungyak.byung?.type === 'conflict' && byungyak.yak) {
    // 통관 성립 조건 검증
    const tonggwanValidation = validateTonggwan(byungyak.yak, elementScores);
    
    if (tonggwanValidation.valid) {
    finalPrimaryElement = byungyak.yak;
    finalPrimaryType = 'tonggwan';
    priorityReason = byungyak.description;
      
      decisionPath.push({
        step: '통관적용',
        result: `${ELEMENT_TO_KOREAN[byungyak.yak]} (통관)`,
        condition: `통관용신 충족 요건: 원국 존재≥0.5 + 점수≥1.5 + 피극 오행 ≤ 점수×1.5 | 통관 유효: 점수 ${tonggwanValidation.validationDetail?.score}`,
        continued: true,
      });
    } else {
      priorityReason = `통관 불가: ${tonggwanValidation.reason}`;
      // 통관 조건 불충족 시 decisionPath에 추가
      decisionPath.push({
        step: '통관적용',
        result: '통관 적용 불가',
        condition: `통관용신 충족 요건: 원국 존재≥0.5 + 점수≥1.5 + 피극 오행 ≤ 점수×1.5 | 통관 오행: ${ELEMENT_TO_KOREAN[byungyak.yak]}`,
        continued: true,
        skipReason: `통관 조건 불충족: ${tonggwanValidation.reason}`,
      });
    }
  } else if (byungyak.yak && byungyak.byung) {
    const byungyakScore = scoreEokbuCandidate(
      byungyak.yak,
      dayElement,
      ilganStrength.strength,
      imbalance,
      season,
      roots,
      elementScores
    );
    
    if (byungyakScore >= primaryScored.score + 1.5) {
      finalPrimaryElement = byungyak.yak;
      finalPrimaryType = 'byungyak';
      priorityReason = byungyak.description;
    } else {
      // 조후 상태에 따른 명확한 priorityReason 생성
      priorityReason = generatePriorityReason(
        johuAnalysis.status,
        season,
        primaryScored,
        ilganStrength.strength,
        imbalance
      );
    }
  } else {
    // 조후 상태에 따른 명확한 priorityReason 생성
    priorityReason = generatePriorityReason(
      johuAnalysis.status,
      season,
      primaryScored,
      ilganStrength.strength,
      imbalance
    );
  }
  
  // 조후 poor 병행 고려
  if (priorityScore.winner === 'johu_with_eokbu' && johuAnalysis.status === 'poor') {
    // 조후 오행이 억부 후보에 포함되어 있고 점수가 충분하면 조후 우선 고려
    const johuCandidateScore = eokbuScored.find(c => c.element === johuAnalysis.neededElement)?.score || 0;
    if (johuCandidateScore > primaryScored.score - 1.0) {
      priorityReason += ` + 조후(${ELEMENT_TO_KOREAN[johuAnalysis.neededElement]}) 병행 고려`;
    }
  }
  
  // 원국 존재 여부 표시
  const isAbsentInWonguk = elementScores[finalPrimaryElement] === 0;
  if (isAbsentInWonguk) {
    priorityReason += ' (⚠️ 원국에 없어 대운에서 보완 필요)';
  }
  
  // 용신 타입 한글 변환
  const getYongshinTypeKorean = (type: string): string => {
    const map: Record<string, string> = {
      'eokbu': '억부',
      'byungyak': '병약',
      'tonggwan': '통관',
    };
    return map[type] || type;
  };
  
  // 검증 과정 기록
  const validationText = validationResults
    .map(v => {
      const elemKr = ELEMENT_TO_KOREAN[v.element];
      if (v.passed) {
        return `${elemKr}(통과)`;
      } else {
        return `${elemKr}(실패: ${v.reason || '알 수 없음'})`;
      }
    })
    .join(', ');
  
  // 억부 오행별 점수 정렬 및 포맷팅
  const eokbuScoredSorted = [...eokbuScored].sort((a, b) => b.score - a.score);
  const eokbuScoresText = eokbuScoredSorted
    .map(c => `${ELEMENT_TO_KOREAN[c.element]}(${c.score.toFixed(1)})`)
    .join(', ');
  
  // 검증 방식 표시
  const selectionMethod = validatedPrimary !== null 
    ? '순차 검증 통과' 
    : '검증 실패 → 점수 기반 폴백';
  
  decisionPath.push({
    step: '억부결정',
    result: `${ELEMENT_TO_KOREAN[finalPrimaryElement]}`,
    condition: `${getYongshinTypeKorean(finalPrimaryType)} 용신: ${ELEMENT_TO_KOREAN[finalPrimaryElement]} (${primaryScored.score.toFixed(1)}) | 검증: ${validationText} | 선택 방식: ${selectionMethod} | 오행별 점수: ${eokbuScoresText}`,
    continued: false,
  });
  
  // 보조용신 결정: 검증 통과한 후보 중에서 선택
  let secondaryK: string | undefined;
  const validatedCandidates = validationResults
    .filter(v => v.passed && v.element !== finalPrimaryElement)
    .map(v => v.element);
  
  // 검증 통과한 후보 중에서 주용신과 상극이 아닌 것 선택
  for (const cand of validatedCandidates) {
    if (!isControlling(cand, finalPrimaryElement)) {
      secondaryK = ELEMENT_TO_KOREAN[cand];
      break;
    }
  }
  
  // 검증 통과한 후보가 없으면 점수 기반으로 폴백
  if (!secondaryK) {
    const eokbuTop2 = pickTopTwo(eokbuScored);
    if (eokbuTop2?.second && 
        eokbuTop2.second.element !== finalPrimaryElement && 
        !isControlling(eokbuTop2.second.element, finalPrimaryElement)) {
      secondaryK = ELEMENT_TO_KOREAN[eokbuTop2.second.element];
    }
  }
  
  decisionPath.push({
    step: '최종용신',
    result: `${ELEMENT_TO_KOREAN[finalPrimaryElement]}`,
    condition: `${getYongshinTypeKorean(finalPrimaryType)} 판단 결과`,
    continued: false,
  });
  
  // 최종 주용신 결정
  const finalPrimary = finalPrimaryType === 'byungyak' && byungyak.yak 
    ? ELEMENT_TO_KOREAN[byungyak.yak] 
    : finalPrimaryType === 'tonggwan' && byungyak.yak
    ? ELEMENT_TO_KOREAN[byungyak.yak]
    : primaryK;

  return {
    primary: finalPrimary,
    secondary: secondaryK,
    type: '억부' as const,
    confidence: 'high' as const,
    evidence: { decisionPath },
  };
}

// ========================================
// 헬퍼: 격국 한글 변환
// ========================================
function getGyeokgukKorean(type: GyeokgukType): string {
  const map: Record<GyeokgukType, string> = {
    jeonggwan: '정관격',
    pyeongwan: '편관격',
    jeongin: '정인격',
    pyeonin: '편인격',
    siksin: '식신격',
    sanggwan: '상관격',
    jeongjae: '정재격',
    pyeonjae: '편재격',
    geonrok: '건록격',
    yangin: '양인격',
    jonggang: '종강격',
    jongyak: '종약격',
    special: '특수격',
    none: '격국 없음',
  };
  return map[type] || type;
}

// ========================================
// 종격 용신 생성 (간소화)
// ========================================
function createJonggyeokYongshinV2(
  jonggyeok: JonggyeokAnalysisV2,
  dayElement: Element,
  elementScores: Record<Element, number>,
  decisionPath: DecisionStep[]
): Yongshin {
  let primaryElement: Element;
  
  if (jonggyeok.type === 'jonggang') {
    primaryElement = dayElement;
  } else if (jonggyeok.type === 'jongyak') {
    const siksang = GENERATING_MAP[dayElement];
    const jaesung = CONTROLLING_MAP[dayElement];
    const gwanseong = invControlling(dayElement);
    
    if (jonggyeok.subType === '종아격') {
      primaryElement = siksang;
    } else if (jonggyeok.subType === '종재격') {
      primaryElement = jaesung;
    } else {
      primaryElement = gwanseong;
    }
  } else {
    primaryElement = GENERATING_MAP[dayElement];
  }
  
  const primaryK = ELEMENT_TO_KOREAN[primaryElement];
  
  // 보조 용신: 종강격은 인성, 종약격은 상황에 따라
  let secondaryElement: Element | undefined;
  if (jonggyeok.type === 'jonggang') {
    secondaryElement = invGenerating(dayElement); // 인성
  }
  
  return {
    primary: primaryK,
    secondary: secondaryElement ? ELEMENT_TO_KOREAN[secondaryElement] : undefined,
    type: '억부',
    confidence: jonggyeok.details.confidence,
    evidence: { decisionPath },
  };
}

// ========================================
// 조후 용신 생성 (간소화)
// ========================================
function createJohuYongshinV2(
  johuAnalysis: JohuAnalysis,
  eokbuTop2: { top: Scored; second?: Scored } | null,
  decisionPath: DecisionStep[]
): Yongshin {
  const primaryElement = johuAnalysis.neededElement;
  const primaryK = ELEMENT_TO_KOREAN[primaryElement];
  
  let secondaryElement: Element | undefined;
  if (eokbuTop2 && eokbuTop2.top.element !== primaryElement && !isControlling(eokbuTop2.top.element, primaryElement)) {
    secondaryElement = eokbuTop2.top.element;
  }
  
  return {
    primary: primaryK,
    secondary: secondaryElement ? ELEMENT_TO_KOREAN[secondaryElement] : undefined,
    type: '조후',
    confidence: johuAnalysis.isExtreme ? 'high' : 'medium',
    evidence: { decisionPath },
  };
}
