/**
 * 2026 병오년 신년운세 텍스트 생성 템플릿
 * 
 * 사용자 친숙한 단어로 운세 텍스트를 생성합니다.
 */

import { NewYearFortune2026, FortuneCategory2026, MonthlyFortune2026 } from '../../../../entities/saju/model/types';
import { SajuData } from '../../../../entities/saju/model/types';
import { Sipsin } from './TenGod';

/**
 * 십신을 친숙한 단어로 변환
 */
function sipsinToFriendlyWord(sipsin: string): string {
  const map: Record<string, string> = {
    '정인': '정인(도움과 보호)',
    '편인': '편인(학습과 변화)',
    '비견': '비견(자신감과 협력)',
    '겁재': '겁재(경쟁과 도전)',
    '식신': '식신(능력과 표현)',
    '상관': '상관(창의와 성과)',
    '정재': '정재(안정적 재물)',
    '편재': '편재(투자와 부수입)',
    '정관': '정관(직장과 책임)',
    '편관': '편관(변화와 도전)',
  };
  return map[sipsin] || sipsin;
}

/**
 * 총운 텍스트 생성
 */
export function generateTotalFortuneText(
  total: NewYearFortune2026['total'],
  seunTenGodsGan: string,
  seunTenGodsJi: string,
  strength: 'strong' | 'weak' | 'neutral',
  jiRelationships: any,
  sajuData: SajuData
): string {
  const friendlyGan = sipsinToFriendlyWord(seunTenGodsGan);
  const friendlyJi = sipsinToFriendlyWord(seunTenGodsJi);
  const strengthText = strength === 'strong' ? '신강' : strength === 'weak' ? '신약' : '중립';
  
  let text = `2026년 병오년은 당신에게 '${friendlyGan}'의 기운이 강하게 작용하는 해입니다. `;
  
  // 십신별 설명
  if (seunTenGodsGan === '편인' || seunTenGodsGan === '정인') {
    text += `인성은 학습, 문서, 자격증 취득에 유리한 에너지입니다. `;
  } else if (seunTenGodsGan === '편재' || seunTenGodsGan === '정재') {
    text += `재성은 수입, 투자, 재테크에 관련된 기운입니다. `;
  } else if (seunTenGodsGan === '편관' || seunTenGodsGan === '정관') {
    text += `관성은 직장, 승진, 책임과 관련된 기운입니다. `;
  } else if (seunTenGodsGan === '식신' || seunTenGodsGan === '상관') {
    text += `식상은 능력 발휘, 성과, 표현과 관련된 기운입니다. `;
  } else if (seunTenGodsGan === '비견' || seunTenGodsGan === '겁재') {
    text += `비겁은 협력, 경쟁, 동료 관계와 관련된 기운입니다. `;
  }
  
  // 신강/신약 해석
  if (strength === 'weak') {
    text += `당신의 사주가 신약한 편이므로, 올해 들어오는 ${friendlyGan}의 기운은 도움이 되는 희신으로 작용합니다. `;
    text += `후원자를 만나거나 학습에 유리한 시기입니다. `;
  } else if (strength === 'strong') {
    text += `당신의 사주가 신강한 편이므로, 올해 들어오는 ${friendlyGan}의 기운은 주의가 필요할 수 있습니다. `;
    text += `생각이 많아지거나 게으름에 빠질 수 있으니 실행력을 기르는 것이 중요합니다. `;
  }
  
  // 원국 작용
  if (jiRelationships.day?.type === '합' || jiRelationships.day?.type === '반합') {
    text += `특히 원국의 일지와 세운 오화가 합을 이루므로, 안정적이고 화합의 기운이 강합니다. `;
  } else if (jiRelationships.day?.type === '충') {
    text += `특히 원국의 일지와 세운 오화가 충을 이루므로, 변화와 이동수가 많을 수 있습니다. `;
  } else if (jiRelationships.day?.type === '형') {
    text += `특히 원국의 일지와 세운 오화가 형을 이루므로, 스트레스나 갈등에 주의하세요. `;
  }
  
  return text;
}

/**
 * 재물운 텍스트 생성
 */
export function generateWealthFortuneText(
  wealth: FortuneCategory2026,
  isSeunWealth: boolean,
  hasWealthInWonguk: boolean,
  hasSiksin: boolean,
  strength: 'strong' | 'weak' | 'neutral'
): string {
  let text = '';
  
  if (isSeunWealth) {
    text += `2026년은 당신에게 재물 기회가 많은 해입니다. `;
    if (hasSiksin) {
      text += `특히 능력과 노력으로 돈을 버는 구조(식상생재)가 형성되어 있어, `;
      text += `직업적 성과나 기술을 통한 수입이 기대됩니다. `;
    }
    if (strength === 'strong') {
      text += `당신의 사주가 강한 편이므로, 큰 재물을 감당할 힘이 있습니다. `;
      text += `투자나 사업에 도전해볼 만한 시기입니다. `;
    } else if (strength === 'weak') {
      text += `다만 당신의 사주가 약한 편이므로, 과욕은 금물입니다. `;
      text += `분수를 지키며 안정적인 수입에 집중하세요. `;
    }
  } else {
    text += `2026년은 재물 기회보다는 안정적인 수입에 집중하는 것이 좋습니다. `;
    if (hasWealthInWonguk) {
      text += `원국에 재성이 있어 기본적인 재물 복은 있지만, 올해는 큰 변화보다는 `;
      text += `기존 수입을 유지하고 저축에 힘쓰는 것이 현명합니다. `;
    }
  }
  
  return text;
}

/**
 * 애정운 텍스트 생성
 */
export function generateLoveFortuneText(
  love: FortuneCategory2026,
  isSeunSpouseStar: boolean,
  dayRelationship: any,
  hasDohwa: boolean,
  gender: 'male' | 'female'
): string {
  let text = '';
  
  if (isSeunSpouseStar) {
    if (gender === 'male') {
      text += `2026년은 남성인 당신에게 재성(배우자성)의 기운이 강한 해입니다. `;
      text += `이성 만남 기회가 많고, 좋은 인연을 만날 가능성이 높습니다. `;
    } else {
      text += `2026년은 여성인 당신에게 관성(배우자성)의 기운이 강한 해입니다. `;
      text += `이성 만남 기회가 많고, 좋은 인연을 만날 가능성이 높습니다. `;
    }
  } else {
    text += `2026년은 배우자성 기운이 직접적으로 작용하지 않지만, `;
    text += `기존 관계를 발전시키거나 안정화하는 데 유리한 해입니다. `;
  }
  
  if (hasDohwa) {
    text += `특히 도화살이 발동하여 이성 매력이 높아지고, 로맨스 기회가 늘어납니다. `;
  }
  
  if (dayRelationship.type === '합' || dayRelationship.type === '반합') {
    text += `배우자궁(일지)과 세운이 합을 이루어 관계가 안정적이고 발전적입니다. `;
  } else if (dayRelationship.type === '충') {
    text += `배우자궁(일지)과 세운이 충을 이루어 관계에 변화나 갈등이 있을 수 있습니다. `;
    text += `서로의 입장을 이해하고 대화로 해결하세요. `;
  }
  
  return text;
}

/**
 * 직장운 텍스트 생성
 */
export function generateCareerFortuneText(
  career: FortuneCategory2026,
  isOfficialStar: boolean,
  isInStar: boolean,
  isSiksin: boolean,
  hasOfficialInWonguk: boolean,
  hasYukma: boolean,
  strength: 'strong' | 'weak' | 'neutral'
): string {
  let text = '';
  
  if (isOfficialStar) {
    text += `2026년은 직장운이 상승하는 해입니다. `;
    if (strength === 'strong') {
      text += `당신의 사주가 강한 편이므로, 승진이나 직책 상승의 기회가 있습니다. `;
      text += `책임감을 보여주고 리더십을 발휘하면 좋은 결과를 얻을 수 있습니다. `;
    } else if (strength === 'weak') {
      text += `다만 당신의 사주가 약한 편이므로, 과도한 책임이나 스트레스에 주의하세요. `;
      text += `무리하지 말고 자신의 능력 범위 내에서 일하세요. `;
    }
  } else if (isInStar) {
    text += `2026년은 학습과 자격증 취득에 유리한 해입니다. `;
    text += `새로운 기술을 배우거나 전문 자격을 취득하면 직장에서 인정받을 수 있습니다. `;
    text += `부서 이동이나 업무 변화도 긍정적으로 작용할 수 있습니다. `;
  } else if (isSiksin) {
    text += `2026년은 능력을 발휘하고 성과를 내는 해입니다. `;
    text += `창의적인 아이디어나 전문 기술을 통해 인정받을 수 있습니다. `;
    text += `이직을 고려한다면 좋은 기회가 될 수 있습니다. `;
  }
  
  if (hasOfficialInWonguk) {
    text += `원국에 관성이 있어 기본적인 직장 복이 있으므로, 안정적인 직장 생활이 가능합니다. `;
  }
  
  if (hasYukma) {
    text += `역마살이 발동하여 출장이나 이동이 많을 수 있습니다. `;
    text += `새로운 환경이나 지역으로의 이동도 고려해볼 만합니다. `;
  }
  
  return text;
}

/**
 * 건강운 텍스트 생성
 */
export function generateHealthFortuneText(
  health: FortuneCategory2026,
  excessElements: string[],
  missingElements: string[],
  hasChung: boolean,
  hasHyung: boolean
): string {
  let text = '';
  
  // 화 과다 체크
  if (excessElements.includes('화(火)')) {
    text += `2026년은 화 기운이 강한 해인데, 당신의 사주에도 화가 많아 `;
    text += `심장, 혈압, 염증 관련 질환에 특히 주의가 필요합니다. `;
    text += `스트레스를 줄이고 충분한 휴식을 취하세요. `;
  }
  
  // 수 부족 체크
  if (missingElements.includes('수(水)')) {
    text += `원국에 수(水) 오행이 부족한데, 올해 화 기운이 강하므로 `;
    text += `신장이나 방광 관련 건강 관리에 신경 쓰세요. `;
  }
  
  if (hasChung) {
    text += `원국과 세운이 충을 이루어 건강에 변동이 있을 수 있습니다. `;
    text += `정기 검진을 받고 몸의 변화에 주의하세요. `;
  }
  
  if (hasHyung) {
    text += `원국과 세운이 형을 이루어 스트레스나 심리적 갈등이 건강에 영향을 줄 수 있습니다. `;
    text += `마음의 평안을 찾고 충분한 휴식을 취하세요. `;
  }
  
  if (!excessElements.includes('화(火)') && !hasChung && !hasHyung) {
    text += `2026년은 건강 관리에 큰 문제가 없을 것으로 보입니다. `;
    text += `규칙적인 생활과 적절한 운동으로 건강을 유지하세요. `;
  }
  
  return text;
}

/**
 * 월별운 텍스트 생성
 */
export function generateMonthlyFortuneText(
  monthly: MonthlyFortune2026,
  monthTenGodsGan: string,
  monthTenGodsJi: string,
  monthRelationship: any,
  seunRelationship: any
): { total: string; wealth: string; love: string; career: string; health: string; advice: string } {
  const friendlyGan = sipsinToFriendlyWord(monthTenGodsGan);
  const friendlyJi = sipsinToFriendlyWord(monthTenGodsJi);
  
  let total = `${monthly.month}월은 ${friendlyGan}의 기운이 강한 달입니다. `;
  
  // 십신별 설명
  if (monthTenGodsGan === '편재' || monthTenGodsGan === '정재') {
    total += `재물 관련 기회가 많습니다. `;
  } else if (monthTenGodsGan === '편관' || monthTenGodsGan === '정관') {
    total += `직장이나 책임 관련 일이 많습니다. `;
  } else if (monthTenGodsGan === '편인' || monthTenGodsGan === '정인') {
    total += `학습이나 문서 관련 일이 많습니다. `;
  } else if (monthTenGodsGan === '식신' || monthTenGodsGan === '상관') {
    total += `능력 발휘나 성과 창출에 유리합니다. `;
  } else if (monthTenGodsGan === '비견' || monthTenGodsGan === '겁재') {
    total += `협력이나 경쟁이 있는 달입니다. `;
  }
  
  // 원국 작용
  if (monthRelationship.type === '합' || monthRelationship.type === '반합') {
    total += `원국과 합을 이루어 안정적이고 긍정적인 흐름입니다. `;
  } else if (monthRelationship.type === '충') {
    total += `원국과 충을 이루어 변화나 변동이 있을 수 있습니다. `;
  } else if (monthRelationship.type === '형') {
    total += `원국과 형을 이루어 스트레스나 주의가 필요합니다. `;
  }
  
  // 재물
  let wealth = '';
  if (monthTenGodsGan === '편재' || monthTenGodsGan === '정재') {
    wealth = `재물 기회가 많은 달입니다. 투자나 부수입을 고려해볼 만합니다. `;
  } else {
    wealth = `안정적인 수입에 집중하세요. 큰 지출은 피하는 것이 좋습니다. `;
  }
  
  // 애정
  let love = '';
  if (monthTenGodsGan === '정재' || monthTenGodsGan === '편재') {
    love = `이성 만남 기회가 있는 달입니다. `;
  } else if (monthTenGodsGan === '정관' || monthTenGodsGan === '편관') {
    love = `관계 발전에 유리한 달입니다. `;
  } else {
    love = `기존 관계를 유지하고 발전시키는 데 집중하세요. `;
  }
  
  // 직장
  let career = '';
  if (monthTenGodsGan === '정관' || monthTenGodsGan === '편관') {
    career = `직장에서 인정받거나 승진 기회가 있을 수 있습니다. `;
  } else if (monthTenGodsGan === '편인' || monthTenGodsGan === '정인') {
    career = `학습이나 자격증 취득에 유리한 달입니다. `;
  } else if (monthTenGodsGan === '식신' || monthTenGodsGan === '상관') {
    career = `능력을 발휘하고 성과를 내는 데 집중하세요. `;
  } else {
    career = `안정적인 직장 생활을 유지하세요. `;
  }
  
  // 건강
  let health = '';
  if (monthRelationship.type === '충' || monthRelationship.type === '형') {
    health = `건강에 주의가 필요합니다. 무리하지 말고 충분한 휴식을 취하세요. `;
  } else {
    health = `건강 관리에 큰 문제가 없을 것으로 보입니다. `;
  }
  
  // 조언
  let advice = '';
  if (monthly.score >= 4.0) {
    advice = `이 달은 운세가 좋은 시기입니다. 적극적으로 도전하고 기회를 잡으세요. `;
  } else if (monthly.score >= 3.0) {
    advice = `이 달은 안정적으로 진행하세요. 무리한 도전보다는 기존 일을 잘 유지하는 것이 좋습니다. `;
  } else {
    advice = `이 달은 신중하게 행동하세요. 중요한 결정은 미루고, 건강과 안전에 특히 주의하세요. `;
  }
  
  return { total, wealth, love, career, health, advice };
}

/**
 * 총운 조언 생성
 */
export function generateTotalAdvice(
  monthly: MonthlyFortune2026[],
  direction: string,
  color: string
): { firstHalf: string; secondHalf: string } {
  const firstHalfMonths = monthly.slice(0, 6);
  const secondHalfMonths = monthly.slice(6);
  
  const firstHalfAvg = firstHalfMonths.reduce((sum, m) => sum + m.score, 0) / 6;
  const secondHalfAvg = secondHalfMonths.reduce((sum, m) => sum + m.score, 0) / 6;
  
  let firstHalf = '';
  if (firstHalfAvg >= 3.5) {
    firstHalf = `상반기는 운세가 좋은 시기입니다. 새로운 계획을 세우고 실행에 옮기세요. `;
  } else {
    firstHalf = `상반기는 신중하게 진행하세요. 기존 일을 안정적으로 유지하는 것이 좋습니다. `;
  }
  
  let secondHalf = '';
  if (secondHalfAvg >= 3.5) {
    secondHalf = `하반기는 성과를 거두는 시기입니다. 노력한 만큼 결과가 나타날 것입니다. `;
  } else {
    secondHalf = `하반기는 조심스럽게 진행하세요. 중요한 결정은 신중하게 하세요. `;
  }
  
  return { firstHalf, secondHalf };
}

