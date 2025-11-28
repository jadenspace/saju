export interface Pillar {
  gan: string; // Cheongan (Heavenly Stem)
  ji: string;  // Jiji (Earthly Branch)
  ganHan: string; // Chinese character for Gan
  jiHan: string;  // Chinese character for Ji
  ganElement?: string; // wood, fire, earth, metal, water
  jiElement?: string;
  tenGods?: string; // Sip-shin (optional for now)
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
}
