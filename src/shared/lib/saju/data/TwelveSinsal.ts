/**
 * 12신살(十二神殺) 관련 데이터 및 계산 로직
 * 참조: docs/만세력.md - 12신살(十二神殺) 섹션
 * 
 * 12신살은 지지와 지지의 관계를 보는 신살로, 
 * 년지 또는 일지를 기준으로 판단합니다.
 */

// 12신살 종류
export const TWELVE_SINSAL = [
    '겁살', '재살', '천살', '지살', '연살', '월살',
    '망신살', '장성살', '반안살', '역마살', '육해살', '화개살'
] as const;

export type TwelveSinsal = typeof TWELVE_SINSAL[number];

// 12신살 한자
export const TWELVE_SINSAL_HANJA: Record<TwelveSinsal, string> = {
    '겁살': '劫殺', '재살': '災殺', '천살': '天殺', '지살': '地殺',
    '연살': '年殺', '월살': '月殺', '망신살': '亡身殺', '장성살': '將星殺',
    '반안살': '攀鞍殺', '역마살': '驛馬殺', '육해살': '六害殺', '화개살': '華蓋殺'
};

// 12신살 의미
export const TWELVE_SINSAL_MEANING: Record<TwelveSinsal, string> = {
    '겁살': '강탈, 위험',
    '재살': '재난, 관재수',
    '천살': '하늘의 재앙',
    '지살': '땅의 재앙, 이동',
    '연살': '도화살, 이성 인연',
    '월살': '고초, 곤경',
    '망신살': '망신, 구설',
    '장성살': '리더십, 권위',
    '반안살': '안정, 신중',
    '역마살': '이동, 변동',
    '육해살': '육친 해로움',
    '화개살': '종교, 예술, 고독'
};

// 삼합별 12신살 조견표
// 기준 지지가 속한 삼합에 따라 12신살 배치가 결정됨
const SINSAL_TABLE: Record<string, Record<TwelveSinsal, string>> = {
    // 申子辰 삼합 (수국)
    '申子辰': {
        '겁살': '巳', '재살': '午', '천살': '未', '지살': '申',
        '연살': '酉', '월살': '戌', '망신살': '亥', '장성살': '子',
        '반안살': '丑', '역마살': '寅', '육해살': '卯', '화개살': '辰'
    },
    // 寅午戌 삼합 (화국)
    '寅午戌': {
        '겁살': '亥', '재살': '子', '천살': '丑', '지살': '寅',
        '연살': '卯', '월살': '辰', '망신살': '巳', '장성살': '午',
        '반안살': '未', '역마살': '申', '육해살': '酉', '화개살': '戌'
    },
    // 巳酉丑 삼합 (금국)
    '巳酉丑': {
        '겁살': '寅', '재살': '卯', '천살': '辰', '지살': '巳',
        '연살': '午', '월살': '未', '망신살': '申', '장성살': '酉',
        '반안살': '戌', '역마살': '亥', '육해살': '子', '화개살': '丑'
    },
    // 亥卯未 삼합 (목국)
    '亥卯未': {
        '겁살': '申', '재살': '酉', '천살': '戌', '지살': '亥',
        '연살': '子', '월살': '丑', '망신살': '寅', '장성살': '卯',
        '반안살': '辰', '역마살': '巳', '육해살': '午', '화개살': '未'
    }
};

// 지지가 속하는 삼합 매핑
const JI_TO_SAMHAP: Record<string, string> = {
    '申': '申子辰', '子': '申子辰', '辰': '申子辰',
    '寅': '寅午戌', '午': '寅午戌', '戌': '寅午戌',
    '巳': '巳酉丑', '酉': '巳酉丑', '丑': '巳酉丑',
    '亥': '亥卯未', '卯': '亥卯未', '未': '亥卯未'
};

/**
 * 기준 지지에 대한 특정 대상 지지의 12신살 반환
 * @param baseJi 기준 지지 (년지 또는 일지)
 * @param targetJi 대상 지지
 * @returns 해당하는 12신살 또는 null
 */
export function getTwelveSinsal(baseJi: string, targetJi: string): TwelveSinsal | null {
    const samhap = JI_TO_SAMHAP[baseJi];
    if (!samhap) return null;

    const table = SINSAL_TABLE[samhap];
    if (!table) return null;

    for (const [sinsal, ji] of Object.entries(table)) {
        if (ji === targetJi) {
            return sinsal as TwelveSinsal;
        }
    }

    return null;
}

/**
 * 기준 지지에서 모든 12신살과 해당 지지 반환
 * @param baseJi 기준 지지
 * @returns { sinsal: 지지 } 형태의 객체
 */
export function getAllSinsalForBase(baseJi: string): Record<TwelveSinsal, string> | null {
    const samhap = JI_TO_SAMHAP[baseJi];
    if (!samhap) return null;

    return SINSAL_TABLE[samhap] || null;
}

/**
 * 주요 신살 설명
 */
export const SINSAL_DESCRIPTIONS: Record<TwelveSinsal, string> = {
    '겁살': '재물이나 명예를 빼앗길 수 있는 운이므로 과욕을 경계해야 합니다.',
    '재살': '관재수나 재난을 만날 수 있으니 언행과 안전에 주의해야 합니다.',
    '천살': '예상치 못한 어려움이 닥칠 수 있으니 겸손한 마음을 유지해야 합니다.',
    '지살': '이사, 직장 이동 등 변화가 많은 시기입니다. 변화에 유연하게 대처하세요.',
    '연살': '이성에게 매력이 있고 인기가 좋습니다. 연애운이 활발해집니다.',
    '월살': '일시적인 어려움과 고초가 있을 수 있으나 인내하면 극복됩니다.',
    '망신살': '체면이 손상되거나 구설이 따를 수 있으니 말과 행동을 삼가야 합니다.',
    '장성살': '리더십과 권위가 생기는 시기입니다. 책임감을 갖고 행동하세요.',
    '반안살': '안정과 여유가 있는 시기입니다. 급한 결정보다 신중함이 필요합니다.',
    '역마살': '이동, 출장, 해외 인연이 많습니다. 여행이나 무역에 좋은 운입니다.',
    '육해살': '가족이나 가까운 사람과 갈등이 생길 수 있으니 배려가 필요합니다.',
    '화개살': '예술적 감각이 발휘되고 학문이나 종교에 관심이 깊어집니다.'
};

/**
 * 주요 신살 (도화살, 역마살, 화개살) 여부 체크
 */
export const MAJOR_SINSAL: TwelveSinsal[] = ['연살', '역마살', '화개살'];

export function isMajorSinsal(sinsal: TwelveSinsal): boolean {
    return MAJOR_SINSAL.includes(sinsal);
}
