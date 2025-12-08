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
  midnightMode?: 'early' | 'late'; // 'early' = 야자시 (23:00-24:00 is previous day), 'late' = 조자시 (00:00-01:00 is next day)
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
}
