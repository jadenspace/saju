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
    dayBased: [string, string]; // 일주 기준 공망 지지
    affectedPillars: string[]; // 공망에 해당하는 주 (년주/월주/일주/시주)
  };
  // 12신살 분석
  twelveSinsalAnalysis?: {
    yearBased: Array<{ pillar: string; sinsal: string }>; // 년지 기준
    dayBased: Array<{ pillar: string; sinsal: string }>;  // 일지 기준
  };
}
export interface NewYearFortune {
  year: number;
  gan: string;
  ji: string;
  yearSummary: {
    score: number;
    summaryText: string; // "Core Summary"
    reason: string[];    // "Why (Bullets)"
  };
  yearNature: string;    // "Nature of the Year"
  fortuneAreas: {
    money: FortuneAreaBase;
    relationship: FortuneAreaBase;
    career: FortuneAreaBase;
    selfGrowth: FortuneAreaBase;
  };
  keyMonths?: {
    month: number;
    theme: string;
    advice: string;
  }[];
  fortuneGuide: {
    do: string[];
    dont: string[];
    keywords: string[];
  };
  expertMeta: {
    fortuneType: string;
    warningLevel: 'low' | 'medium' | 'high';
    recommendedActivities: string[];
  };
  analysisTags: {
    dominantTengod: string;
    supportTengod: string;
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
  pros: string;
  cons: string;
  strategy: string;
}
