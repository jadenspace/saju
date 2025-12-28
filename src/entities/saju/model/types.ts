export interface Pillar {
  gan: string; // Cheongan (Heavenly Stem)
  ji: string;  // Jiji (Earthly Branch)
  ganHan: string; // Chinese character for Gan
  jiHan: string;  // Chinese character for Ji
  ganElement?: string; // wood, fire, earth, metal, water
  jiElement?: string;
  tenGodsGan?: string; // Sipsin for Heavenly Stem
  tenGodsJi?: string;  // Sipsin for Earthly Branch
  jijanggan?: string[]; // Hidden Stems
  jijangganTenGods?: string[]; // Sipsin for Hidden Stems
  twelveStage?: string; // 12운성 (장생, 목욕, 관대, 건록, 제왕, 쇠, 병, 사, 므, 절, 태, 양)
}

export interface Seun {
  year: number;
  ganZhi: string;
  gan: string;
  ji: string;
  ganHan: string;
  jiHan: string;
  ganElement?: string;
  jiElement?: string;
  tenGodsGan?: string;
  tenGodsJi?: string;
  twelveStage?: string; // 12운성 (일간 기준)
  sinsal?: {
    yearBased?: string; // 년지 기준 12신살
    dayBased?: string;  // 일지 기준 12신살
  };
}

export interface DaeunPeriod {
  ganZhi: string; // GanZhi combination (e.g., '甲子')
  gan: string; // Korean name (e.g., '갑')
  ji: string; // Korean name (e.g., '자')
  ganHan: string; // Chinese character for Gan
  jiHan: string; // Chinese character for Ji
  ganElement?: string; // wood, fire, earth, metal, water
  jiElement?: string;
  startAge: number;
  endAge: number;
  tenGodsGan?: string; // 십신 (천간)
  tenGodsJi?: string;  // 십신 (지지)
  twelveStage?: string; // 12운성 (일간 기준)
  sinsal?: {
    yearBased?: string; // 년지 기준 12신살
    dayBased?: string;  // 일지 기준 12신살
  };
  seun: Seun[];
}

export interface SajuData {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  birthDate: string; // ISO string
  birthTime: string; // HH:mm
  gender: 'male' | 'female';
  solar: boolean; // true if solar birth date
  unknownTime?: boolean;
  useTrueSolarTime?: boolean; // true if using true solar time (longitude correction)
  applyDST?: boolean; // true if applying daylight saving time correction
  midnightMode?: 'early' | 'late'; // 'early' = 야자시 적용 (23:00-24:00 is next day), 'late' = 야자시 미적용 (23:00-24:00 is current day)
  daeun: DaeunPeriod[]; // Grand Fortune periods
  daeunDirection: 'forward' | 'backward'; // Direction of Daeun
  ohaengDistribution: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  ohaengAnalysis: {
    elements: Array<{
      element: string;      // 'wood', 'fire', 'earth', 'metal', 'water'
      name: string;         // '목(木)', '화(火)' 등
      count: number;        // 개수
      level: string;        // '결핍', '부족', '균형', '강함', '과다'
      description: string;  // OhaengData의 설명
    }>;
    excess: string[]; // 많은 오행 (3개 이상)
    deficient: string[]; // 적은 오행 (1개)
    missing: string[]; // 없는 오행 (0개)
    interpretation: string; // 종합 해석
  };
  // 공망 정보
  gongmang?: {
    yearBased: {
      gongmangJi: [string, string]; // 년주 기준 공망 지지
      affectedPillars: Array<{
        pillar: string;
        haegong?: { isHaegong: boolean; reason: string | null };
      }>;
    };
    dayBased: {
      gongmangJi: [string, string]; // 일주 기준 공망 지지
      affectedPillars: Array<{
        pillar: string;
        haegong?: { isHaegong: boolean; reason: string | null };
      }>;
    };
  };
  // 12신살 분석
  twelveSinsalAnalysis?: {
    yearBased: Array<{ pillar: string; sinsal: string }>; // 년지 기준
    dayBased: Array<{ pillar: string; sinsal: string }>;  // 일지 기준
  };
  // 일간 강약 분석
  ilganStrength?: IlganStrength;
  // 용신 분석
  yongshin?: Yongshin;
}

export interface IlganStrength {
  strength: 'strong' | 'weak' | 'neutral';
  score: number;
  details: {
    deukRyeong: number;  // 월령 득령 점수
    tonggeun: number;    // 통근 점수
    cheongan: number;    // 천간 생조 점수
  };
}

export type YongshinConfidence = 'high' | 'medium' | 'low';

// 간소화된 용신 증거 (UI 타임라인용)
export type YongshinEvidence = {
  decisionPath?: DecisionStep[];
};

// 조후 분석 결과
export interface JohuAnalysis {
  hanScore: number;      // 한(寒) 점수
  yeolScore: number;     // 열(熱) 점수
  joScore: number;       // 조(燥) 점수
  seupScore: number;     // 습(濕) 점수
  isExtreme: boolean;    // 극한 조후 여부 (한습극/조열극)
  extremeType?: 'hanseup' | 'joyeol'; // 극한 유형
  neededElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water'; // 필요한 오행
  status: 'extreme' | 'poor' | 'good' | 'satisfied'; // 조후 상태
  description: string;   // 조후 상태 설명
}

// 종격 판단 결과
export interface JonggyeokResult {
  isJonggyeok: boolean;
  type: 'none' | 'jonggang' | 'jongyak' | 'gajong'; // 종강격, 종약격, 가종격
  reason: string;
  details: {
    deukryeong: boolean;  // 월령 득령 여부
    structure: string;    // 구조 설명
    confidence: 'high' | 'medium' | 'low';
  };
}

// 병약 분석 결과
export interface ByungyakAnalysis {
  byung: {               // 병(病): 명식의 문제점
    element: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    type: 'excess' | 'conflict' | 'blocking';
    description: string;
  } | null;
  yak: 'wood' | 'fire' | 'earth' | 'metal' | 'water' | null;   // 약(藥): 병을 치료하는 오행
  description: string;
}

// 합충 분석 결과 (Phase 1 고도화)
export interface CombinationAnalysis {
  tianganHe: Array<{     // 천간합
    stems: [string, string];
    positions: [number, number];  // 위치 (0:년, 1:월, 2:일, 3:시)
    isAdjacent: boolean;          // 인접 여부
    heType: 'hapHwa' | 'hapBan' | 'hapGeo';  // 합화/합반/합거
    isTransformed: boolean;
    result?: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    scoreImpact: {
      stem1Reduction: number;     // 첫번째 천간 점수 감소율
      stem2Reduction: number;     // 두번째 천간 점수 감소율
      resultBonus: number;        // 화신 오행 보너스 점수
    };
    reason: string;               // 판정 근거
  }>;
  dizhiHe: Array<{       // 지지합 (육합, 삼합, 방합)
    type: 'liuhe' | 'sanhe' | 'fanghe';
    branches: string[];
    positions: number[];          // 위치들
    heType: 'hapHwa' | 'hapBan' | 'hapGeo';  // 합화/합반/합거
    isComplete: boolean;
    result?: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    scoreImpact: {
      reductions: Record<string, number>;  // 각 지지별 감소율
      resultBonus: number;
    };
    reason: string;
  }>;
  chong: Array<{         // 충 (왕쇠 차등 적용)
    branches: [string, string];
    positions: [number, number];
    chungType: 'wangChungSwae' | 'swaeChungWang' | 'equal';  // 왕자충쇠/쇠자충왕/세력비등
    impact: 'neutralize' | 'activate' | 'damage' | 'chungBal';  // 충발 추가
    scoreImpact: {
      branch1Reduction: number;   // 첫번째 지지 점수 변화 (음수=감소, 양수=증가)
      branch2Reduction: number;   // 두번째 지지 점수 변화
      chungBalElement?: 'wood' | 'fire' | 'earth' | 'metal' | 'water';  // 충발된 오행
      chungBalBonus?: number;     // 충발 보너스 점수
    };
    reason: string;
  }>;
  // 묘고충발 (진술충/축미충)
  mogoChungBal?: Array<{
    branches: [string, string];
    releasedStems: string[];      // 발현된 지장간들
    scoreBonus: Record<string, number>;  // 각 오행별 보너스
  }>;
  // 전체 합충으로 인한 점수 조정값
  totalScoreAdjustment: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', number>;
}

// 합충이 용신에 미치는 영향
export interface CombinationImpact {
  isWeakened: boolean;      // 용신이 약화되었는가
  isStrengthened: boolean;  // 용신이 강화되었는가
  reason: string;           // 영향 설명
}

// 용신 후보 (원국 존재 여부 포함)
export interface YongshinCandidate {
  element: string;
  score: number;
  isAbsent?: boolean;  // 원국에 없음
}

// ===== PRD v4.2 신규 타입 정의 =====

// 5분류 체계: 희신/기신/구신/한신/오행설기
export interface ElementClassification {
  yongshin: { element: string; impact: 'positive-max'; score: 3 };
  heeshin: { element: string; impact: 'positive-high'; score: 2 };
  gishin: { element: string; impact: 'negative-high'; score: -3 };
  gushin: { element: string; impact: 'negative-medium'; score: -2 };
  hanshin: { element: string; impact: 'neutral'; score: 0 };
  outputElement: { element: string; impact: 'negative-low' | 'neutral'; score: number }; // -1.5 ~ 0
}

// 격국 판단 결과 (확장)
export interface GyeokgukAnalysis {
  type: GyeokgukType;
  confidence: 'high' | 'medium' | 'low';
  touchulPosition: 'jeonggi' | 'junggi' | 'yeogi' | null;
  touchulGan?: string;
  issues: GyeokgukIssue[];
}

// 격국 문제 패턴
export interface GyeokgukIssue {
  type: '관살혼잡' | '재다신약' | '상관견관' | '식신탈인' | '재파인';
  severity: 'high' | 'medium' | 'low';
  remedy: string;
}

// 종격 세분화 결과 (확장)
export interface JonggyeokAnalysisV2 extends JonggyeokResult {
  subType?: '종아격' | '종재격' | '종살격'; // 종약격 세분화
  breakCheck?: {
    broken: boolean;
    reason?: string;
  };
  scores: {
    rootScore: number;
    support: number;  // 비겁 + 인성
    drain: number;    // 식상 + 재성
    oppression: number; // 관살만
  };
}

// 우선권 점수 (Priority Score)
export interface PriorityScore {
  jong: number;
  johu: number;
  gyeok: number;
  winner: 'jong' | 'johu_immediate' | 'johu_with_eokbu' | 'gyeok';
}

// 통관 검증 결과
export interface TonggwanValidation {
  needed: boolean;
  element?: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  valid: boolean;
  reason?: string;
  validationDetail?: {
    existsInWonguk: boolean;
    score: number;
    minRequired: number;
    controllerElement?: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    controllerScore?: number;
  };
}

// 결정 경로 (Decision Path)
export interface DecisionStep {
  step: string;
  result: string;
  condition?: string;
  continued: boolean;
  skipReason?: string; // 조건 불충족으로 넘어간 경우의 이유
}

// 확장된 Evidence 타입
export interface YongshinEvidenceV2 extends YongshinEvidence {
  // 격국 근거
  gyeokguk?: GyeokgukAnalysis;
  
  // 종격 판단 근거
  jonggyeok?: JonggyeokAnalysisV2;
  
  // 조후 판단 근거 (확장)
  johuDetail?: {
    status: 'extreme' | 'poor' | 'satisfied' | 'good';
    urgency: 'critical' | 'high' | 'normal';
    neededElement?: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    currentScore?: number;
    threshold: { sufficient: number; poor: number };
  };
  
  // 강약 판단 근거 (확장)
  strengthDetail?: {
    level: 'extreme-strong' | 'strong' | 'neutral' | 'weak' | 'extreme-weak';
    deukryeong: {
      status: boolean;
      type: 'wangji' | 'saengji' | 'swaeji' | 'none';
      ratio: number;
    };
  };
  
  // 병약/통관 판단 근거
  byungyakDetail?: {
    hasByung: boolean;
    byungType?: 'ohaeng_excess' | 'gyeokguk_damage';
    tonggwan?: TonggwanValidation;
  };
  
  // 합충 영향 (확장)
  combinationDetail?: {
    hap: Array<{
      type: 'cheonganHap' | 'yukHap' | 'samHap';
      elements: [string, string];
      result: 'hapHwa' | 'hapGeo';
      hwaShin?: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
      ratio?: number; // 삼합: 1.0/0.6/0.5/0.4
    }>;
    chung: Array<{
      elements: [string, string];
      type: 'chungPa' | 'chungDong' | 'chungGae' | 'chungGeo';
      scoreDiff: number;
    }>;
  };
  
  // 5분류 결과
  classification?: ElementClassification;
  
  // 결정 경로
  decisionPath?: DecisionStep[];
  
  // 우선권 점수
  priorityScore?: PriorityScore;
}

// 강약 분석 결과
export interface StrengthAnalysis {
  deukryeong: boolean;      // 월령 득령 여부 (가장 중요)
  deukji: boolean;          // 지지 통근 여부
  deukse: boolean;          // 천간 투출 여부
  tugan: boolean;           // 통근+투간 연결 여부
  rootScore: number;        // 종합 점수
  structuralStrength: 'extreme-strong' | 'strong' | 'neutral' | 'weak' | 'extreme-weak';
  details: {
    monthRoot: number;      // 월지 통근 점수
    dayRoot: number;        // 일지 통근 점수
    yearRoot: number;       // 년지 통근 점수
    hourRoot: number;       // 시지 통근 점수
    tianganSupport: number; // 천간 생조 점수
  };
}

// 격국 유형
export type GyeokgukType = 
  | 'jeonggwan' | 'pyeongwan'    // 정관격, 편관격
  | 'jeongin' | 'pyeonin'        // 정인격, 편인격
  | 'siksin' | 'sanggwan'        // 식신격, 상관격
  | 'jeongjae' | 'pyeonjae'      // 정재격, 편재격
  | 'geonrok' | 'yangin'         // 건록격, 양인격
  | 'jonggang' | 'jongyak'       // 종강격, 종약격
  | 'special'                     // 특수격
  | 'none';                       // 격국 없음

// 구조 분석 결과
export interface StructuralAnalysis {
  gyeokguk: GyeokgukType;     // 격국
  jonggyeok?: JonggyeokResult; // 종격 여부
  johuStatus: JohuAnalysis;   // 조후 상태
  byungyak?: ByungyakAnalysis; // 병약 분석
  strength: StrengthAnalysis;  // 강약 분석
  combinations: CombinationAnalysis; // 합충 분석
  combinationImpact?: CombinationImpact; // 합충이 용신에 미치는 영향
}

// 간소화된 용신 인터페이스 (UI에서 필요한 필드만)
export interface Yongshin {
  primary: string;      // 주 용신 오행 (예: '목(木)')
  secondary?: string;   // 보조 용신 오행
  type: '억부' | '조후' | '통관';
  confidence?: YongshinConfidence;
  evidence?: YongshinEvidence;  // decisionPath만 포함
}

export interface FortuneCategory {
  score: number;
  summary: string;
  pros: string[];
  cons: string[];
  strategy: string;
}

export interface MonthlyFortune {
  month: number;
  monthName: string;
  solarMonth: string;
  ganZhi: string;
  ganHan: string;
  jiHan: string;
  score: number;
  theme: string;
  oneLiner: string;
}

export interface KeyMonth {
  month: number;
  theme: '큰 변화의 달' | '화합의 달' | '조심의 달';
  advice: string;
}

export interface LuckyInfo {
  color: string[];
  direction: string;
  number: number[];
}

export interface TotalScoreEvidence {
  seunTenGods: {
    gan: string; // 세운 천간의 십신
    ji: string; // 세운 지지의 십신
    evaluation: '긍정' | '중립' | '부정';
    point: number;
    details?: string[]; // 상세 설명
  };
  yongshinMatch: {
    yongshin: string; // 용신
    seunGanElement: string; // 세운 천간 오행
    seunJiElement: string; // 세운 지지 오행
    isMatch: boolean; // 용신과 일치 여부
    isControlling: boolean; // 용신을 극하는지
    point: number;
    details?: string[]; // 상세 설명
  };
  jiRelationships: {
    hasHap: boolean; // 합 관계
    hasChung: boolean; // 충 관계
    hasHyung: boolean; // 형 관계
    details: string[];
    point: number;
    calculationDetails?: string[]; // 계산 상세
  };
  basePoint: number;
  totalPoint: number;
  finalScore: number;
  calculationSteps?: Array<{
    step: string;
    description: string;
    formula?: string; // 콘솔에만 출력할 공식
    result: string;
  }>;
}

export interface NewYearFortune {
  year: number;
  ganZhi: string;
  totalScore: number;
  totalOneLiner: string;
  categories: {
    total: FortuneCategory;
    career: FortuneCategory;
    love: FortuneCategory;
    wealth: FortuneCategory;
    health: FortuneCategory;
  };
  monthly: MonthlyFortune[];
  keyMonths?: KeyMonth[];
  luckyInfo?: LuckyInfo;
  totalScoreEvidence?: TotalScoreEvidence;
}
