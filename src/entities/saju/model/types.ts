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

export type YongshinEvidence = {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  ilganStrength: 'strong' | 'weak' | 'neutral';
  roots: number; // 통근 지표
  elementScores: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', number>;
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

export interface Yongshin {
  primary: string;      // 주 용신 오행 (예: '목(木)')
  secondary?: string;   // 보조 용신 오행
  heeshin?: string[];   // 희신 오행 배열
  gishin?: string[];    // 기신 오행 배열
  type: '억부' | '조후' | '통관';
  confidence?: YongshinConfidence;
  evidence?: YongshinEvidence;
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
}
