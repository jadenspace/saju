import { Yongshin, IlganStrength, Pillar, SajuData } from '../../../../entities/saju/model/types';
import { getOhaeng, calculateSipsin, Element } from './TenGod';

/**
 * 용신 선정 로직
 * 커리큘럼 4단계: 용신(用神) 선정
 */

const GENERATING_MAP: Record<Element, Element> = {
  'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood'
};

const CONTROLLING_MAP: Record<Element, Element> = {
  'wood': 'earth', 'earth': 'water', 'water': 'fire', 'fire': 'metal', 'metal': 'wood'
};

// 오행 한글명 매핑
const ELEMENT_TO_KOREAN: Record<Element, string> = {
  'wood': '목(木)',
  'fire': '화(火)',
  'earth': '토(土)',
  'metal': '금(金)',
  'water': '수(水)',
};

// 오행 한글명에서 Element로 변환
const KOREAN_TO_ELEMENT: Record<string, Element> = {
  '목(木)': 'wood',
  '화(火)': 'fire',
  '토(土)': 'earth',
  '금(金)': 'metal',
  '수(水)': 'water',
};

/**
 * 계절 판단 (월지 기준)
 */
function getSeason(monthJi: string): 'spring' | 'summer' | 'autumn' | 'winter' {
  const spring = ['寅', '卯', '辰'];
  const summer = ['巳', '午', '未'];
  const autumn = ['申', '酉', '戌'];
  const winter = ['亥', '子', '丑'];

  if (spring.includes(monthJi)) return 'spring';
  if (summer.includes(monthJi)) return 'summer';
  if (autumn.includes(monthJi)) return 'autumn';
  return 'winter';
}

/**
 * 억부용신 선정
 * 신강: 식상/재성/관성 중에서 용신 선택 (억제)
 * 신약: 인성/비겁 중에서 용신 선택 (부조)
 */
function calculateEokbuYongshin(
  dayMaster: string,
  ilganStrength: IlganStrength,
  pillars: Pillar[]
): { primary: string; type: '억부' } | null {
  const dayElement = getOhaeng(dayMaster);
  if (!dayElement) return null;

  if (ilganStrength.strength === 'strong') {
    // 신강: 식상(화생), 재성(토극), 관성(금극) 중 선택
    // 원국에 부족한 오행 우선
    const candidates: Element[] = [];
    
    // 식상 (일간이 생하는 오행)
    const siksang = GENERATING_MAP[dayElement];
    candidates.push(siksang);
    
    // 재성 (일간이 극하는 오행)
    const jaesung = CONTROLLING_MAP[dayElement];
    candidates.push(jaesung);
    
    // 관성 (일간을 극하는 오행)
    const gwanseong = Object.keys(CONTROLLING_MAP).find(
      key => CONTROLLING_MAP[key as Element] === dayElement
    ) as Element;
    if (gwanseong) candidates.push(gwanseong);

    // 원국에서 가장 부족한 오행을 용신으로 선택
    // 실제로는 원국 분석 결과를 받아야 하지만, 여기서는 후보 중 첫 번째 선택
    return {
      primary: ELEMENT_TO_KOREAN[candidates[0]],
      type: '억부',
    };
  } else if (ilganStrength.strength === 'weak') {
    // 신약: 인성(수생), 비겁(목동) 중 선택
    const candidates: Element[] = [];
    
    // 인성 (일간을 생하는 오행)
    const inseong = Object.keys(GENERATING_MAP).find(
      key => GENERATING_MAP[key as Element] === dayElement
    ) as Element;
    if (inseong) candidates.push(inseong);
    
    // 비겁 (일간과 같은 오행)
    candidates.push(dayElement);

    return {
      primary: ELEMENT_TO_KOREAN[candidates[0]],
      type: '억부',
    };
  }

  return null;
}

/**
 * 조후용신 선정
 * 계절에 따라 필요한 오행 선정
 */
function calculateJohuYongshin(
  dayMaster: string,
  monthJi: string
): { primary: string; type: '조후' } | null {
  const dayElement = getOhaeng(dayMaster);
  if (!dayElement) return null;

  const season = getSeason(monthJi);

  // 커리큘럼 4.2 조후 용신 표 참고
  let neededElement: Element | null = null;

  if (dayElement === 'fire') {
    // 화 일간
    if (season === 'summer') neededElement = 'water'; // 식히기
    else if (season === 'winter') neededElement = 'wood'; // 살리기
  } else if (dayElement === 'water') {
    // 수 일간
    if (season === 'summer') neededElement = 'metal'; // 근원
    else if (season === 'winter') neededElement = 'fire'; // 온기
  } else if (dayElement === 'earth') {
    // 토 일간
    if (season === 'summer') neededElement = 'water'; // 윤택
    else if (season === 'winter') neededElement = 'fire'; // 온기
  } else if (dayElement === 'metal') {
    // 금 일간
    if (season === 'summer') neededElement = 'water'; // 씻기
    else if (season === 'winter') neededElement = 'fire'; // 제련
  } else if (dayElement === 'wood') {
    // 목 일간
    if (season === 'summer') neededElement = 'water'; // 수분
    else if (season === 'winter') neededElement = 'fire'; // 온기
  }

  if (neededElement) {
    return {
      primary: ELEMENT_TO_KOREAN[neededElement],
      type: '조후',
    };
  }

  return null;
}

/**
 * 용신 우선순위 판단
 * 억부용신과 조후용신 중 원국 형국을 분석하여 더 중요한 용신을 선택
 */
function determineYongshinPriority(
  eokbu: { primary: string; type: '억부' } | null,
  johu: { primary: string; type: '조후' } | null,
  dayElement: Element,
  ohaengAnalysis: { excess: string[]; deficient: string[]; missing: string[] },
  ilganStrength: IlganStrength
): { primary: { primary: string; type: '억부' | '조후' }; secondary: { primary: string; type: '억부' | '조후' } | null } | null {
  // 둘 다 없으면 null 반환
  if (!eokbu && !johu) {
    return null;
  }

  // 조후만 있으면 조후 우선
  if (!eokbu && johu) {
    return { primary: johu, secondary: null };
  }

  // 억부만 있으면 억부 우선
  if (eokbu && !johu) {
    return { primary: eokbu, secondary: null };
  }

  // 둘 다 있을 때 우선순위 판단
  if (eokbu && johu) {
    const eokbuElement = KOREAN_TO_ELEMENT[eokbu.primary];
    
    // 억부용신의 오행이 원국에 과다하면 조후 우선
    if (eokbuElement && ohaengAnalysis.excess.includes(eokbu.primary)) {
      return { primary: johu, secondary: eokbu };
    }

    // 억부용신이 인성(일간을 생하는 오행)이고, 그 오행이 원국에 과다하면 조후 우선
    if (ilganStrength.strength === 'weak' && eokbuElement) {
      // 인성 확인: 일간을 생하는 오행
      const inseongElement = Object.keys(GENERATING_MAP).find(
        key => GENERATING_MAP[key as Element] === dayElement
      ) as Element | undefined;
      
      if (inseongElement === eokbuElement && ohaengAnalysis.excess.includes(eokbu.primary)) {
        return { primary: johu, secondary: eokbu };
      }
    }

    // 그 외는 억부 우선
    return { primary: eokbu, secondary: johu };
  }

  return null;
}

/**
 * 희신/기신/구신 선정
 * 용신을 돕는 오행 = 희신
 * 용신을 극하거나 방해하는 오행 = 기신
 * 기신을 돕는 오행 = 구신
 */
function calculateHeeshinGishin(
  yongshinElement: Element
): { heeshin: string[]; gishin: string[] } {
  const heeshin: string[] = [];
  const gishin: string[] = [];

  // 희신: 용신을 생하는 오행
  const heeshinElement = Object.keys(GENERATING_MAP).find(
    key => GENERATING_MAP[key as Element] === yongshinElement
  ) as Element;
  if (heeshinElement) {
    heeshin.push(ELEMENT_TO_KOREAN[heeshinElement]);
  }

  // 기신: 용신을 극하는 오행
  const gishinElement = CONTROLLING_MAP[yongshinElement];
  if (gishinElement) {
    gishin.push(ELEMENT_TO_KOREAN[gishinElement]);
  }

  // 기신: 용신이 극하는 오행 (용신이 약해지는 경우)
  const gishinElement2 = Object.keys(CONTROLLING_MAP).find(
    key => CONTROLLING_MAP[key as Element] === yongshinElement
  ) as Element;
  if (gishinElement2 && !gishin.includes(ELEMENT_TO_KOREAN[gishinElement2])) {
    gishin.push(ELEMENT_TO_KOREAN[gishinElement2]);
  }

  return { heeshin, gishin };
}

/**
 * 용신 선정
 * 억부용신과 조후용신 중 우선순위 결정
 */
export function calculateYongshin(sajuData: SajuData): Yongshin | null {
  if (!sajuData.ilganStrength || !sajuData.ohaengAnalysis) {
    return null;
  }

  const dayMaster = sajuData.day.ganHan;
  const monthJi = sajuData.month.jiHan;
  const pillars = [sajuData.year, sajuData.month, sajuData.day, sajuData.hour];
  const dayElement = getOhaeng(dayMaster);
  if (!dayElement) {
    return null;
  }

  // 억부용신 계산
  const eokbu = calculateEokbuYongshin(dayMaster, sajuData.ilganStrength, pillars);
  
  // 조후용신 계산
  const johu = calculateJohuYongshin(dayMaster, monthJi);

  // 우선순위 판단
  const priority = determineYongshinPriority(
    eokbu,
    johu,
    dayElement,
    sajuData.ohaengAnalysis,
    sajuData.ilganStrength
  );

  if (!priority) {
    return null;
  }

  const yongshinElement = KOREAN_TO_ELEMENT[priority.primary.primary];
  if (!yongshinElement) {
    return null;
  }

  const { heeshin, gishin } = calculateHeeshinGishin(yongshinElement);

  return {
    primary: priority.primary.primary,
    secondary: priority.secondary ? priority.secondary.primary : undefined,
    heeshin: heeshin.length > 0 ? heeshin : undefined,
    gishin: gishin.length > 0 ? gishin : undefined,
    type: priority.primary.type,
  };
}
