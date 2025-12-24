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
export interface YearComparison {
  previousScore: number;
  currentScore: number;
  scoreDiff: number;
  trend: 'up' | 'down' | 'same';
  changeReasons: string[]; // 주요 변화 요인 설명
}

export interface NewYearFortune {
  year: number;
  gan: string;
  ji: string;
  yearSummary: {
    score: number;
    summaryText: string; // "Core Summary"
    reason: string[];    // "Why (Bullets)"
    comparison?: YearComparison; // 작년 비교 정보
  };
  yearNature: string;    // "Nature of the Year"
  // 운의 작동 방식 (신규)
  yearMechanism?: YearMechanism;
  // 흔히 겪는 실수 패턴 (신규)
  commonMistake?: CommonMistake;
  fortuneAreas: {
    money: FortuneAreaBase;
    relationship: FortuneAreaBase;
    career: FortuneAreaBase;
    selfGrowth: FortuneAreaBase;
    health: FortuneAreaBase;  // 건강운 추가
  };
  keyMonths?: {
    month: number;
    theme: string;
    advice: string;
  }[];
  allMonths?: Array<{
    month: number;
    gan: string;
    ji: string;
    score: number;
    theme: string;
    advice: string;
  }>;
  fortuneGuide: {
    do: string[];
    dont: string[];
    keywords: string[];
  };
  expertMeta: {
    fortuneType: string;
    fortuneTypeDescription?: string;  // 신규: 사용자 친화적 설명
    warningLevel: 'low' | 'medium' | 'high';
    recommendedActivities: string[];
  };
  analysisTags: {
    dominantTengod: string;
    dominantTengodFriendly?: string;  // 신규: 사용자 친화적 표현
    supportTengod: string;
    supportTengodFriendly?: string;   // 신규: 사용자 친화적 표현
    event?: string;
    palace?: string;
    ohaengExcess?: string;
    ohaengLack?: string;
    quality: 'stable' | 'volatile' | 'mixed';
    pace: 'fast' | 'slow' | 'mixed';
    theme: string;
    guideType: 'push' | 'manage' | 'defense' | 'reset';
  };
  // 행운 정보
  luckyInfo?: {
    color: string;
    direction: string;
    number: string;
  };
}

export interface FortuneAreaBase {
  score: number;
  summary?: string;     // 신규: 한 줄 요약 (예: "들어오지만 관리가 필요한 흐름")
  focus?: string;       // 신규: 집중 포인트 (예: "지출 구조 개선")
  pros: string;
  cons: string;
  strategy: string;
}

// 운의 작동 방식 (신규)
export interface YearMechanism {
  type: 'thinking-first' | 'action-first' | 'relationship-focused' | 'wealth-focused' | 'authority-focused' | 'creative-focused' | 'competitive-focused';
  description: string;      // "감정보다 판단과 분석이 먼저 작동하는 해"
  advantage: string[];      // ["분석력", "정리력", "기획"]
  risk: string[];           // ["결정 지연", "고립"]
}

// 흔히 겪는 실수 패턴 (신규)
export interface CommonMistake {
  title: string;            // "생각만 하다 타이밍을 놓치기 쉬운 해"
  situations: string[];     // 구체적인 상황들
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

export interface Yongshin {
  primary: string;      // 주 용신 오행 (예: '목(木)')
  secondary?: string;   // 보조 용신 오행
  heeshin?: string[];   // 희신 오행 배열
  gishin?: string[];    // 기신 오행 배열
  type: '억부' | '조후' | '통관';
}
