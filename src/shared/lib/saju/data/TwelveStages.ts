/**
 * 12운성(十二運星) 관련 데이터 및 계산 로직
 * 참조: docs/만세력.md - 12운성(十二運星) 섹션
 * 
 * 12운성은 천간이 지지를 만났을 때 천간의 에너지 상태(강약)를 
 * 인간의 생로병사에 대입한 것입니다. 포태법(胞胎法)이라고도 합니다.
 */

// 12운성 종류
export const TWELVE_STAGES = [
    '장생', '목욕', '관대', '건록', '제왕', '쇠',
    '병', '사', '묘', '절', '태', '양'
] as const;

export type TwelveStage = typeof TWELVE_STAGES[number];

// 12운성 한자
export const TWELVE_STAGES_HANJA: Record<TwelveStage, string> = {
    '장생': '長生', '목욕': '沐浴', '관대': '冠帶', '건록': '建祿',
    '제왕': '帝旺', '쇠': '衰', '병': '病', '사': '死',
    '묘': '墓', '절': '絶', '태': '胎', '양': '養'
};

// 12운성 의미
export const TWELVE_STAGES_MEANING: Record<TwelveStage, { meaning: string; stage: string; energy: string }> = {
    '장생': { meaning: '탄생', stage: '태어남', energy: '강' },
    '목욕': { meaning: '목욕', stage: '사춘기', energy: '중' },
    '관대': { meaning: '성인식', stage: '청년기, 결혼', energy: '강' },
    '건록': { meaning: '녹봉', stage: '취직, 자립', energy: '강' },
    '제왕': { meaning: '절정', stage: '전성기', energy: '최강' },
    '쇠': { meaning: '쇠퇴', stage: '은퇴', energy: '중' },
    '병': { meaning: '병듦', stage: '노환', energy: '약' },
    '사': { meaning: '죽음', stage: '임종', energy: '약' },
    '묘': { meaning: '무덤', stage: '입관', energy: '약' },
    '절': { meaning: '소멸', stage: '영혼 분리', energy: '약' },
    '태': { meaning: '잉태', stage: '임신', energy: '중' },
    '양': { meaning: '양육', stage: '태아기', energy: '중' }
};

// 지지 순서
const JI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/**
 * 12운성표 (화토동법 기준)
 * 화토동법(火土同法): 丙·戊(양화·양토)와 丁·己(음화·음토)를 각각 같은 12운성 흐름으로 적용
 * 
 * 표 구조: [천간][지지 인덱스] = 운성
 */
const TWELVE_STAGES_TABLE: Record<string, TwelveStage[]> = {
    '甲': ['목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양', '장생'],
    '乙': ['병', '쇠', '제왕', '건록', '관대', '목욕', '장생', '양', '태', '절', '묘', '사'],
    '丙': ['태', '양', '장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절'],
    '戊': ['태', '양', '장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절'], // 화토동법
    '丁': ['절', '묘', '사', '병', '쇠', '제왕', '건록', '관대', '목욕', '장생', '양', '태'],
    '己': ['절', '묘', '사', '병', '쇠', '제왕', '건록', '관대', '목욕', '장생', '양', '태'], // 화토동법
    '庚': ['사', '묘', '절', '태', '양', '장생', '목욕', '관대', '건록', '제왕', '쇠', '병'],
    '辛': ['장생', '양', '태', '절', '묘', '사', '병', '쇠', '제왕', '건록', '관대', '목욕'],
    '壬': ['제왕', '쇠', '병', '사', '묘', '절', '태', '양', '장생', '목욕', '관대', '건록'],
    '癸': ['건록', '관대', '목욕', '장생', '양', '태', '절', '묘', '사', '병', '쇠', '제왕']
};

/**
 * 천간과 지지로 12운성 계산
 * @param gan 천간 한자 (甲乙丙丁戊己庚辛壬癸)
 * @param ji 지지 한자 (子丑寅卯辰巳午未申酉戌亥)
 * @returns 12운성
 */
export function getTwelveStage(gan: string, ji: string): TwelveStage | null {
    const table = TWELVE_STAGES_TABLE[gan];
    if (!table) return null;

    const jiIndex = JI_ORDER.indexOf(ji);
    if (jiIndex === -1) return null;

    return table[jiIndex];
}

/**
 * 12운성의 에너지 분류
 */
export function getStageEnergyLevel(stage: TwelveStage): 'strong' | 'medium' | 'weak' {
    const meaning = TWELVE_STAGES_MEANING[stage];
    if (meaning.energy === '강' || meaning.energy === '최강') return 'strong';
    if (meaning.energy === '중') return 'medium';
    return 'weak';
}

/**
 * 12운성 상세 설명
 */
export const TWELVE_STAGES_DESCRIPTIONS: Record<TwelveStage, string> = {
    '장생': '새로운 시작과 희망의 기운. 성장과 발전의 에너지가 넘치는 시기입니다.',
    '목욕': '정화와 변화의 과정. 다소 불안정할 수 있으나 성장통을 겪는 시기입니다.',
    '관대': '성숙함을 갖추는 때. 사회적 인정과 성취를 향해 나아가는 시기입니다.',
    '건록': '자립과 안정의 기운. 직업과 재물이 안정되며 자신감이 넘치는 시기입니다.',
    '제왕': '최고조의 에너지. 권력과 영향력이 정점에 달하나 내려갈 준비도 필요합니다.',
    '쇠': '쇠퇴의 시작. 무리하지 않고 지혜롭게 물러나는 것이 좋은 시기입니다.',
    '병': '힘이 빠지는 시기. 건강과 마음의 안정을 최우선으로 해야 합니다.',
    '사': '정지와 마무리. 과거를 정리하고 새 출발을 준비하는 때입니다.',
    '묘': '잠재력의 저장. 표면적 활동보다 내면의 힘을 기르는 시기입니다.',
    '절': '단절과 전환. 완전한 변화를 통해 새로운 씨앗이 심어지는 때입니다.',
    '태': '잉태의 기운. 새로운 것이 구상되고 계획이 세워지는 시기입니다.',
    '양': '양육과 성장. 조용히 힘을 기르며 때를 기다리는 시기입니다.'
};
