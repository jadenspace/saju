/**
 * 2026 병오년 신년운세 텍스트 생성 템플릿
 *
 * 사용자 친숙한 단어로 운세 텍스트를 생성합니다.
 */

import {
  NewYearFortune2026,
  FortuneCategory2026,
  MonthlyFortune2026,
  SajuData,
  Seun,
} from "../../../../entities/saju/model/types";
import { Sipsin } from "./TenGod";
import { NEW_YEAR_FORTUNE_2026_DATA } from "../data/NewYearFortune2026Data";
import { SeunFortuneCalculator } from "./SeunFortuneCalculator";

/**
 * 십신을 친숙한 단어로 변환
 */
function sipsinToFriendlyWord(sipsin: string): string {
  const map: Record<string, string> = {
    정인: "정인(도움과 보호)",
    편인: "편인(학습과 변화)",
    비견: "비견(자신감과 협력)",
    겁재: "겁재(경쟁과 도전)",
    식신: "식신(능력과 표현)",
    상관: "상관(창의와 성과)",
    정재: "정재(안정적 재물)",
    편재: "편재(투자와 부수입)",
    정관: "정관(직장과 책임)",
    편관: "편관(변화와 도전)",
  };
  return map[sipsin] || sipsin;
}

/**
 * 일간별 총운 해설 텍스트
 */
function getDayMasterTotalFortune(dayMaster: string): string {
  const fortuneMap: Record<string, string> = {
    甲: `올해는 마음속에만 두었던 생각들이 하나씩 밖으로 나오기 시작하는 해입니다.
아이디어나 계획을 이야기할 기회가 늘고, 주변에서도 당신의 생각에 귀를 기울이게 됩니다.
자연스럽게 바빠지고 움직임도 많아지지만, 그만큼 성과를 체감하기 쉬운 시기이기도 합니다.
다만 속도가 빨라질수록 사람과의 호흡이 어긋날 수 있으니 조율이 중요합니다.
혼자 결정하기보다 한 번쯤 의견을 나누는 것이 결과를 더 좋게 만듭니다.
감정이 앞서면 말이 날카로워질 수 있으니 여유를 가지는 것이 필요합니다.
차분함을 유지한다면 올해의 흐름은 분명히 당신 편으로 흘러갑니다.`,
    乙: `올해는 스스로를 묶어두던 기준에서 벗어나고 싶어지는 해입니다.
그동안 참아왔던 말이나 생각이 자연스럽게 밖으로 나오기 시작합니다.
새로운 시도를 하고 싶은 마음이 커지며, 삶의 방향을 다시 고민하게 됩니다.
다만 말이나 행동이 솔직해진 만큼 오해도 생길 수 있습니다.
사소한 한마디가 관계의 흐름을 바꿀 수 있으니 표현에는 신중함이 필요합니다.
혼자만의 판단보다는 흐름을 살피는 태도가 도움이 됩니다.
변화를 받아들이되, 서두르지 않는 것이 올해를 편안하게 보내는 방법입니다.`,
    丙: `올해는 에너지가 강하게 살아나는 해입니다.
자신감이 높아지고, 하고 싶은 일을 밀어붙이고 싶은 마음이 커집니다.
주변에서도 당신의 존재감이 분명해지며 중심에 서는 일이 많아집니다.
다만 경쟁이나 충돌도 함께 생길 수 있어 조심이 필요합니다.
내가 옳다고 느끼는 방향이 모두에게 옳지는 않을 수 있습니다.
속도를 조절하고 한 발 물러서는 여유가 오히려 성과를 키워줍니다.
균형을 잡는다면 올해는 분명 기억에 남는 해가 됩니다.`,
    丁: `올해는 조용히 쌓아온 것들이 평가받는 해입니다.
선택해야 할 순간이 잦아지고, 결정 하나하나의 무게가 크게 느껴집니다.
주변의 기대와 요구가 늘어나며 책임감도 함께 커집니다.
무리하게 욕심을 내기보다는 안정적인 길이 더 잘 맞습니다.
감정 소모가 많아질 수 있으니 스스로를 돌보는 시간이 필요합니다.
속도를 늦춘 선택이 오히려 결과를 지켜줍니다.
차분함이 올해 정일간의 가장 큰 무기가 됩니다.`,
    戊: `올해는 방향을 다시 잡고 기반을 다지기 좋은 해입니다.
급하게 나아가기보다는 준비와 정리에 힘이 실립니다.
배우거나 정리한 것들이 이후 흐름에 큰 도움이 됩니다.
주변 환경의 변화로 계획을 수정해야 할 수도 있습니다.
하지만 그 변화는 오히려 더 나은 선택으로 이어질 가능성이 큽니다.
고집보다는 유연함이 운을 부드럽게 만듭니다.
천천히 가도 괜찮다는 마음가짐이 올해를 편하게 합니다.`,
    己: `올해는 혼자보다 함께할수록 일이 잘 풀리는 해입니다.
주변에서 자연스럽게 도움의 손길이 들어오고, 관계의 온기도 느껴집니다.
그동안의 성실함이 눈에 보이지 않게 쌓여 있었다는 걸 실감하게 됩니다.
다만 익숙한 안정에만 머물면 기회를 놓칠 수 있습니다.
필요한 변화는 과감히 받아들이는 것이 좋습니다.
사람과의 인연이 올해 운의 핵심 키워드입니다.
열린 마음이 더 큰 흐름을 불러옵니다.`,
    庚: `올해는 책임과 역할이 분명해지는 해입니다.
해야 할 일이 늘어나고, 기대받는 위치에 서게 됩니다.
부담은 크지만 그만큼 인정받을 기회도 함께 옵니다.
모든 것을 혼자 해결하려 하면 쉽게 지칠 수 있습니다.
도움을 요청하는 것도 능력이라는 걸 기억하세요.
강하게 버티기보다 지혜롭게 나누는 것이 중요합니다.
올해의 선택이 이후 방향을 결정짓게 됩니다.`,
    辛: `올해는 긴장과 기회가 동시에 찾아오는 해입니다.
예상치 못한 변화 속에서 중요한 선택을 하게 됩니다.
압박을 느낄 수 있지만, 그만큼 성장의 발판도 큽니다.
원칙을 지키는 태도가 상황을 안정시켜줍니다.
조급해질수록 실수가 생기기 쉬우니 차분함이 필요합니다.
위기는 곧 방향 전환의 신호가 될 수 있습니다.
올해의 경험은 이후 큰 자산으로 남게 됩니다.`,
    壬: `올해는 결과와 현실이 중요해지는 해입니다.
노력한 만큼의 성과를 기대하게 되고, 돈과 일에 대한 고민이 늘어납니다.
기회가 보이는 만큼 욕심도 함께 커질 수 있습니다.
들어오는 것과 나가는 것을 잘 관리하는 것이 중요합니다.
감정적인 결정은 후회를 남길 수 있습니다.
한 번 더 계산하고 선택하는 태도가 필요합니다.
균형을 잡으면 올해는 실속 있는 해가 됩니다.`,
    癸: `올해는 선택지가 많아지는 해입니다.
작은 기회처럼 보였던 일이 점점 커질 수 있습니다.
새로운 제안이나 유혹이 늘어나 판단이 중요해집니다.
감정에 이끌리면 흐름이 흔들릴 수 있습니다.
한 박자 늦춰 생각하는 것이 실수를 줄여줍니다.
지금의 선택이 이후 방향을 좌우하게 됩니다.
차분한 판단이 올해 운을 안정시켜줍니다.`,
  };

  return fortuneMap[dayMaster] || "";
}

/**
 * 총운 텍스트 생성
 */
export function generateTotalFortuneText(
  total: NewYearFortune2026["total"],
  seunTenGodsGan: string,
  seunTenGodsJi: string,
  strength: "strong" | "weak" | "neutral",
  jiRelationships: ReturnType<typeof SeunFortuneCalculator.analyzeSeun>,
  sajuData: SajuData,
): string {
  const dayMaster = sajuData.day.ganHan;

  // 일간별 총운 해설 반영
  const dayMasterFortune = getDayMasterTotalFortune(dayMaster);

  if (dayMasterFortune) {
    return dayMasterFortune;
  }

  // 일간별 해설이 없는 경우 기존 로직 사용
  const friendlyGan = sipsinToFriendlyWord(seunTenGodsGan);

  let text = `2026년 병오년은 당신에게 '${friendlyGan}'의 기운이 강하게 작용하는 해입니다. `;

  // 십신별 설명
  if (seunTenGodsGan === "편인" || seunTenGodsGan === "정인") {
    text += `인성은 학습, 문서, 자격증 취득에 유리한 에너지입니다. `;
  } else if (seunTenGodsGan === "편재" || seunTenGodsGan === "정재") {
    text += `재성은 수입, 투자, 재테크에 관련된 기운입니다. `;
  } else if (seunTenGodsGan === "편관" || seunTenGodsGan === "정관") {
    text += `관성은 직장, 승진, 책임과 관련된 기운입니다. `;
  } else if (seunTenGodsGan === "식신" || seunTenGodsGan === "상관") {
    text += `식상은 능력 발휘, 성과, 표현과 관련된 기운입니다. `;
  } else if (seunTenGodsGan === "비견" || seunTenGodsGan === "겁재") {
    text += `비겁은 협력, 경쟁, 동료 관계와 관련된 기운입니다. `;
  }

  // 신강/신약 해석
  if (strength === "weak") {
    text += `당신의 사주가 신약한 편이므로, 올해 들어오는 ${friendlyGan}의 기운은 도움이 되는 희신으로 작용합니다. `;
    text += `후원자를 만나거나 학습에 유리한 시기입니다. `;
  } else if (strength === "strong") {
    text += `당신의 사주가 신강한 편이므로, 올해 들어오는 ${friendlyGan}의 기운은 주의가 필요할 수 있습니다. `;
    text += `생각이 많아지거나 게으름에 빠질 수 있으니 실행력을 기르는 것이 중요합니다. `;
  }

  // 원국 작용
  if (
    jiRelationships.day?.type === "합" ||
    jiRelationships.day?.type === "반합"
  ) {
    text += `특히 원국의 일지와 세운 오화가 합을 이루므로, 안정적이고 화합의 기운이 강합니다. `;
  } else if (jiRelationships.day?.type === "충") {
    text += `특히 원국의 일지와 세운 오화가 충을 이루므로, 변화와 이동수가 많을 수 있습니다. `;
  } else if (jiRelationships.day?.type === "형") {
    text += `특히 원국의 일지와 세운 오화가 형을 이루므로, 스트레스나 갈등에 주의하세요. `;
  }

  return text;
}

/**
 * 일간을 그룹으로 변환
 */
function getDayMasterGroup(dayMaster: string): string {
  const groupMap: Record<string, string> = {
    甲: "갑목/을목",
    乙: "갑목/을목",
    丙: "병화/정화",
    丁: "병화/정화",
    戊: "무토/기토",
    己: "무토/기토",
    庚: "경금/신금",
    辛: "경금/신금",
    壬: "임수/계수",
    癸: "임수/계수",
  };
  return groupMap[dayMaster] || "갑목/을목";
}

/**
 * 문장의 긍정/부정 판단
 */
function isPositiveSentence(sentence: string): boolean {
  const positiveKeywords = [
    "좋",
    "유리",
    "기회",
    "증가",
    "상승",
    "발전",
    "성과",
    "성취",
    "안정",
    "늘어나",
    "많아",
    "기대",
    "좋아져",
  ];
  const negativeKeywords = [
    "주의",
    "경고",
    "피해야",
    "어려움",
    "변수",
    "갈등",
    "문제",
    "소진",
    "방전",
  ];

  const hasPositive = positiveKeywords.some((keyword) =>
    sentence.includes(keyword),
  );
  const hasNegative = negativeKeywords.some((keyword) =>
    sentence.includes(keyword),
  );

  if (hasNegative) return false;
  if (hasPositive) return true;

  // 기본적으로 중립적이면 긍정으로 간주
  return true;
}

/**
 * 연결어 선택 (앞 문장과 뒷 문장의 긍정/부정 차이에 따라)
 */
function getConnector(
  prevPositive: boolean,
  nextPositive: boolean,
  isEmphasis: boolean = false,
): string {
  if (prevPositive && nextPositive) {
    return isEmphasis ? "특히" : "또한";
  }
  if (prevPositive && !nextPositive) {
    return "하지만";
  }
  if (!prevPositive && nextPositive) {
    return "특히";
  }
  if (!prevPositive && !nextPositive) {
    return "다만";
  }
  return "또한";
}

/**
 * 재물운 텍스트 생성
 */
export function generateWealthFortuneText(
  wealth: FortuneCategory2026,
  isSeunWealth: boolean,
  hasWealthInWonguk: boolean,
  hasSiksin: boolean,
  strength: "strong" | "weak" | "neutral",
  sajuData: SajuData,
  seun: Seun,
): string {
  const dayMaster = sajuData.day.ganHan;
  const dayMasterGroup = getDayMasterGroup(dayMaster);
  const data = NEW_YEAR_FORTUNE_2026_DATA.luck_contents.money_luck;

  // p1: 일간 기반
  const p1Text = data.p1[dayMasterGroup as keyof typeof data.p1] || "";

  // p2: 신강/신약
  const p2Key =
    strength === "strong" ? "신강" : strength === "weak" ? "신약" : null;
  const p2Text = p2Key ? data.p2[p2Key as keyof typeof data.p2] || "" : "";

  // p3: 지지 관계
  const jiRelationships = SeunFortuneCalculator.analyzeSeun(seun, sajuData);
  let p3Key = "유지";
  if (
    jiRelationships.day?.type === "합" ||
    jiRelationships.day?.type === "반합"
  ) {
    p3Key = "합";
  } else if (jiRelationships.day?.type === "충") {
    p3Key = "충";
  } else if (jiRelationships.day?.type === "형") {
    p3Key = "원진";
  }
  const p3Text = data.p3[p3Key as keyof typeof data.p3] || "";

  // 문장 조합
  let text = p1Text;

  if (p2Text) {
    const connector = getConnector(
      isPositiveSentence(p1Text),
      isPositiveSentence(p2Text),
    );
    text += ` ${connector} ${p2Text}`;
  }

  if (p3Text) {
    const prevText = p2Text || p1Text;
    const connector = getConnector(
      isPositiveSentence(prevText),
      isPositiveSentence(p3Text),
      p3Key === "합",
    );
    text += ` ${connector} ${p3Text}`;
  }

  return text;
}

/**
 * 연애운 텍스트 생성
 */
export function generateLoveFortuneText(
  love: FortuneCategory2026,
  isSeunSpouseStar: boolean,
  dayRelationship: ReturnType<
    typeof SeunFortuneCalculator.analyzeJiRelationship
  >,
  hasDohwa: boolean,
  gender: "male" | "female",
  sajuData: SajuData,
  seun: Seun,
): string {
  const data = NEW_YEAR_FORTUNE_2026_DATA.luck_contents.romance_luck;

  // p1: 성별 기반
  const p1Key = gender === "male" ? "남성" : "여성";
  const p1Text = data.p1[p1Key as keyof typeof data.p1] || "";

  // p2: 신강/신약
  const strength = sajuData.ilganStrength?.strength || "neutral";
  const p2Key =
    strength === "strong" ? "신강" : strength === "weak" ? "신약" : null;
  const p2Text = p2Key ? data.p2[p2Key as keyof typeof data.p2] || "" : "";

  // p3: 지지 관계
  const jiRelationships = SeunFortuneCalculator.analyzeSeun(seun, sajuData);
  let p3Key = "유지";
  if (
    jiRelationships.day?.type === "합" ||
    jiRelationships.day?.type === "반합"
  ) {
    p3Key = "합";
  } else if (jiRelationships.day?.type === "충") {
    p3Key = "충";
  } else if (jiRelationships.day?.type === "형") {
    p3Key = "원진";
  }
  const p3Text = data.p3[p3Key as keyof typeof data.p3] || "";

  // 문장 조합
  let text = p1Text;

  if (p2Text) {
    const connector = getConnector(
      isPositiveSentence(p1Text),
      isPositiveSentence(p2Text),
    );
    text += ` ${connector} ${p2Text}`;
  }

  if (p3Text) {
    const prevText = p2Text || p1Text;
    const connector = getConnector(
      isPositiveSentence(prevText),
      isPositiveSentence(p3Text),
      p3Key === "합",
    );
    text += ` ${connector} ${p3Text}`;
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
  strength: "strong" | "weak" | "neutral",
  sajuData: SajuData,
  seun: Seun,
): string {
  const dayMaster = sajuData.day.ganHan;
  const dayMasterGroup = getDayMasterGroup(dayMaster);
  const data = NEW_YEAR_FORTUNE_2026_DATA.luck_contents.career_luck;

  // p1: 일간 기반
  const p1Text = data.p1[dayMasterGroup as keyof typeof data.p1] || "";

  // p2: 신강/신약
  const p2Key =
    strength === "strong" ? "신강" : strength === "weak" ? "신약" : null;
  const p2Text = p2Key ? data.p2[p2Key as keyof typeof data.p2] || "" : "";

  // p3: 길/흉 판단 (세운 십신이 희신이면 길, 기신이면 흉)
  const seunTenGodsGan = seun.tenGodsGan;
  const isHeeshinGan = isHeeshinForCareer(seunTenGodsGan as Sipsin, strength);
  const p3Key = isHeeshinGan ? "길" : "흉";
  const p3Text = data.p3[p3Key as keyof typeof data.p3] || "";

  // 문장 조합
  let text = p1Text;

  if (p2Text) {
    const connector = getConnector(
      isPositiveSentence(p1Text),
      isPositiveSentence(p2Text),
    );
    text += ` ${connector} ${p2Text}`;
  }

  if (p3Text) {
    const prevText = p2Text || p1Text;
    const connector = getConnector(
      isPositiveSentence(prevText),
      isPositiveSentence(p3Text),
      p3Key === "길",
    );
    text += ` ${connector} ${p3Text}`;
  }

  return text;
}

/**
 * 십신이 희신인지 기신인지 판단 (신강/신약 기준)
 */
function isHeeshinForCareer(
  sipsin: Sipsin,
  strength: "strong" | "weak" | "neutral",
): boolean {
  const heeshinForWeak: Sipsin[] = ["정인", "편인", "비견", "겁재"];
  const heeshinForStrong: Sipsin[] = [
    "식신",
    "상관",
    "정재",
    "편재",
    "정관",
    "편관",
  ];

  if (strength === "weak") {
    return heeshinForWeak.includes(sipsin);
  } else if (strength === "strong") {
    return heeshinForStrong.includes(sipsin);
  }

  return false;
}

/**
 * 건강운 텍스트 생성
 */
export function generateHealthFortuneText(
  health: FortuneCategory2026,
  excessElements: string[],
  missingElements: string[],
  hasChung: boolean,
  hasHyung: boolean,
  sajuData: SajuData,
  seun: Seun,
): string {
  const dayMaster = sajuData.day.ganHan;
  const dayMasterGroup = getDayMasterGroup(dayMaster);
  const data = NEW_YEAR_FORTUNE_2026_DATA.luck_contents.health_luck;

  // p1: 일간 기반
  const p1Text = data.p1[dayMasterGroup as keyof typeof data.p1] || "";

  // p2: 신강/신약
  const strength = sajuData.ilganStrength?.strength || "neutral";
  const p2Key =
    strength === "strong" ? "신강" : strength === "weak" ? "신약" : null;
  const p2Text = p2Key ? data.p2[p2Key as keyof typeof data.p2] || "" : "";

  // p3: 주의/평범 판단 (충/형이 있거나 화 과다면 주의)
  const jiRelationships = SeunFortuneCalculator.analyzeSeun(seun, sajuData);
  const hasChungOrHyung =
    hasChung ||
    hasHyung ||
    jiRelationships.day?.type === "충" ||
    jiRelationships.day?.type === "형";
  const hasFireExcess = excessElements.includes("화(火)");
  const p3Key = hasChungOrHyung || hasFireExcess ? "주의" : "평범";
  const p3Text = data.p3[p3Key as keyof typeof data.p3] || "";

  // 문장 조합
  let text = p1Text;

  if (p2Text) {
    const connector = getConnector(
      isPositiveSentence(p1Text),
      isPositiveSentence(p2Text),
    );
    text += ` ${connector} ${p2Text}`;
  }

  if (p3Text) {
    const prevText = p2Text || p1Text;
    const connector = getConnector(
      isPositiveSentence(prevText),
      isPositiveSentence(p3Text),
      p3Key === "평범",
    );
    text += ` ${connector} ${p3Text}`;
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
  monthRelationship: ReturnType<
    typeof SeunFortuneCalculator.analyzeJiRelationship
  >,
  scores?: { wealth: number; love: number; career: number; health: number },
): {
  total: string;
  wealth: string;
  love: string;
  career: string;
  health: string;
  advice: string;
} {
  const friendlyGan = sipsinToFriendlyWord(monthTenGodsGan);

  let total = `${monthly.month}월은 ${friendlyGan}의 기운이 강한 달입니다. `;

  // 십신별 설명
  if (monthTenGodsGan === "편재" || monthTenGodsGan === "정재") {
    total += `재물 관련 기회가 많습니다. `;
  } else if (monthTenGodsGan === "편관" || monthTenGodsGan === "정관") {
    total += `직장이나 책임 관련 일이 많습니다. `;
  } else if (monthTenGodsGan === "편인" || monthTenGodsGan === "정인") {
    total += `학습이나 문서 관련 일이 많습니다. `;
  } else if (monthTenGodsGan === "식신" || monthTenGodsGan === "상관") {
    total += `능력 발휘나 성과 창출에 유리합니다. `;
  } else if (monthTenGodsGan === "비견" || monthTenGodsGan === "겁재") {
    total += `협력이나 경쟁이 있는 달입니다. `;
  }

  // 원국 작용
  if (monthRelationship.type === "합" || monthRelationship.type === "반합") {
    total += `원국과 합을 이루어 안정적이고 긍정적인 흐름입니다. `;
  } else if (monthRelationship.type === "충") {
    total += `원국과 충을 이루어 변화나 변동이 있을 수 있습니다. `;
  } else if (monthRelationship.type === "형") {
    total += `원국과 형을 이루어 스트레스나 주의가 필요합니다. `;
  }

  // 재물 (점수 기반)
  let wealth = "";
  const wealthScore = scores?.wealth ?? 3.0;
  if (wealthScore >= 4.0) {
    wealth = `재물 기회가 매우 좋은 달입니다. 투자나 부수입을 적극적으로 고려해볼 만합니다. `;
  } else if (wealthScore >= 3.5) {
    wealth = `재물 기회가 있는 달입니다. 신중하게 투자나 부수입을 고려해볼 수 있습니다. `;
  } else if (wealthScore >= 2.5) {
    wealth = `안정적인 수입에 집중하세요. 큰 지출은 피하는 것이 좋습니다. `;
  } else {
    wealth = `재물 관련 변동이 있을 수 있습니다. 신중하게 지출을 관리하고 계획적으로 사용하세요. `;
  }

  // 애정 (점수 기반)
  let love = "";
  const loveScore = scores?.love ?? 3.0;
  if (loveScore >= 4.0) {
    if (monthTenGodsGan === "정재" || monthTenGodsGan === "편재") {
      love = `이성 만남 기회가 매우 좋은 달입니다. 새로운 인연을 만날 가능성이 높습니다. `;
    } else if (monthTenGodsGan === "정관" || monthTenGodsGan === "편관") {
      love = `관계 발전에 매우 유리한 달입니다. 기존 관계가 더 깊어질 수 있습니다. `;
    } else {
      love = `인연과 관계에 좋은 기운이 흐르는 달입니다. `;
    }
  } else if (loveScore >= 3.5) {
    if (monthTenGodsGan === "정재" || monthTenGodsGan === "편재") {
      love = `이성 만남 기회가 있는 달입니다. `;
    } else if (monthTenGodsGan === "정관" || monthTenGodsGan === "편관") {
      love = `관계 발전에 유리한 달입니다. `;
    } else {
      love = `기존 관계를 유지하고 발전시키는 데 집중하세요. `;
    }
  } else if (loveScore >= 2.5) {
    love = `기존 관계를 유지하고 발전시키는 데 집중하세요. `;
  } else {
    love = `관계에 변동이 있을 수 있습니다. 소통과 이해가 중요한 시기입니다. `;
  }

  // 직장 (점수 기반)
  let career = "";
  const careerScore = scores?.career ?? 3.0;
  if (careerScore >= 4.0) {
    if (monthTenGodsGan === "정관" || monthTenGodsGan === "편관") {
      career = `직장에서 인정받거나 승진 기회가 매우 좋은 달입니다. `;
    } else if (monthTenGodsGan === "편인" || monthTenGodsGan === "정인") {
      career = `학습이나 자격증 취득에 매우 유리한 달입니다. `;
    } else if (monthTenGodsGan === "식신" || monthTenGodsGan === "상관") {
      career = `능력을 발휘하고 성과를 내는 데 매우 유리한 달입니다. `;
    } else {
      career = `직장에서 좋은 기회가 있는 달입니다. `;
    }
  } else if (careerScore >= 3.5) {
    if (monthTenGodsGan === "정관" || monthTenGodsGan === "편관") {
      career = `직장에서 인정받거나 승진 기회가 있을 수 있습니다. `;
    } else if (monthTenGodsGan === "편인" || monthTenGodsGan === "정인") {
      career = `학습이나 자격증 취득에 유리한 달입니다. `;
    } else if (monthTenGodsGan === "식신" || monthTenGodsGan === "상관") {
      career = `능력을 발휘하고 성과를 내는 데 집중하세요. `;
    } else {
      career = `안정적인 직장 생활을 유지하세요. `;
    }
  } else if (careerScore >= 2.5) {
    career = `안정적인 직장 생활을 유지하세요. `;
  } else {
    career = `직장에 변동이나 주의가 필요할 수 있습니다. 신중하게 행동하세요. `;
  }

  // 건강 (점수 기반)
  let health = "";
  const healthScore = scores?.health ?? 3.0;
  if (healthScore >= 4.0) {
    health = `건강 관리에 큰 문제가 없을 것으로 보입니다. `;
  } else if (healthScore >= 3.0) {
    health = `건강 관리에 주의가 필요합니다. 규칙적인 생활을 유지하세요. `;
  } else if (healthScore >= 2.0) {
    health = `건강에 주의가 필요합니다. 무리하지 말고 충분한 휴식을 취하세요. `;
  } else {
    health = `건강에 특히 주의가 필요한 달입니다. 정기 검진을 받고 무리한 활동은 피하세요. `;
  }

  // 조언
  let advice = "";
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
export function generateTotalAdvice(monthly: MonthlyFortune2026[]): {
  firstHalf: string;
  secondHalf: string;
} {
  const firstHalfMonths = monthly.slice(0, 6);
  const secondHalfMonths = monthly.slice(6);

  const firstHalfAvg = firstHalfMonths.reduce((sum, m) => sum + m.score, 0) / 6;
  const secondHalfAvg =
    secondHalfMonths.reduce((sum, m) => sum + m.score, 0) / 6;

  let firstHalf = "";
  if (firstHalfAvg >= 3.5) {
    firstHalf = `상반기는 운세가 좋은 시기입니다. 새로운 계획을 세우고 실행에 옮기세요. `;
  } else {
    firstHalf = `상반기는 신중하게 진행하세요. 기존 일을 안정적으로 유지하는 것이 좋습니다. `;
  }

  let secondHalf = "";
  if (secondHalfAvg >= 3.5) {
    secondHalf = `하반기는 성과를 거두는 시기입니다. 노력한 만큼 결과가 나타날 것입니다. `;
  } else {
    secondHalf = `하반기는 조심스럽게 진행하세요. 중요한 결정은 신중하게 하세요. `;
  }

  return { firstHalf, secondHalf };
}
