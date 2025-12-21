/**
 * 공망(空亡) 관련 데이터 및 계산 로직
 * 참조: docs/만세력.md - 공망(空亡) 섹션
 *
 * 공망은 육갑(六甲)의 순서에서 빠진 두 지지를 말합니다.
 * 비어있어 힘을 못 쓴다는 의미입니다.
 *
 * 【공망 보는 기준】
 * - 일주 기준: 원칙적인 공망 판단 기준 (100%)
 * - 년주 기준: 참고용으로만 사용 (30% 정도의 작용력)
 * - 대운 공망: 논하지 않음 (운에서 오는 공망은 공망으로 보지 않음)
 * - 세운 공망: 원국에 공망이 있을 때 해공 여부 확인용
 */

// 육갑순(六甲旬)별 공망
export const GONGMANG_TABLE: Record<string, [string, string]> = {
    '갑자순': ['戌', '亥'], // 甲子 ~ 癸酉
    '갑술순': ['申', '酉'], // 甲戌 ~ 癸未
    '갑신순': ['午', '未'], // 甲申 ~ 癸巳
    '갑오순': ['辰', '巳'], // 甲午 ~ 癸卯
    '갑진순': ['寅', '卯'], // 甲辰 ~ 癸丑
    '갑인순': ['子', '丑']  // 甲寅 ~ 癸亥
};

// 60갑자 배열
const SIXTY_JIAZI = [
    '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',  // 갑자순
    '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',  // 갑술순
    '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',  // 갑신순
    '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',  // 갑오순
    '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',  // 갑진순
    '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'   // 갑인순
];

// 순(旬) 이름
const SUN_NAMES = ['갑자순', '갑술순', '갑신순', '갑오순', '갑진순', '갑인순'];

// 육합(六合) 테이블
const YUKAP_TABLE: Record<string, string> = {
    '子': '丑', '丑': '子',
    '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯',
    '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳',
    '午': '未', '未': '午'
};

// 삼합(三合) 테이블 - 각 지지가 속한 삼합 그룹
const SAMHAP_GROUPS: Record<string, string[]> = {
    '申': ['申', '子', '辰'], '子': ['申', '子', '辰'], '辰': ['申', '子', '辰'], // 수국
    '寅': ['寅', '午', '戌'], '午': ['寅', '午', '戌'], '戌': ['寅', '午', '戌'], // 화국
    '巳': ['巳', '酉', '丑'], '酉': ['巳', '酉', '丑'], '丑': ['巳', '酉', '丑'], // 금국
    '亥': ['亥', '卯', '未'], '卯': ['亥', '卯', '未'], '未': ['亥', '卯', '未']  // 목국
};

// 육충(六冲) 테이블
const YUKCHUNG_TABLE: Record<string, string> = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳'
};

// 지지 한글-한자 변환
const JI_KOR_TO_HAN: Record<string, string> = {
    '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
    '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥'
};

const JI_HAN_TO_KOR: Record<string, string> = {
    '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
    '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

/**
 * 간지(干支)로 해당하는 순(旬) 찾기
 * @param ganZhi 간지 한자 (예: '甲子', '乙丑')
 * @returns 순 이름
 */
export function getSun(ganZhi: string): string | null {
    const index = SIXTY_JIAZI.indexOf(ganZhi);
    if (index === -1) return null;

    const sunIndex = Math.floor(index / 10);
    return SUN_NAMES[sunIndex];
}

/**
 * 간지 기준 공망 지지 반환
 * @param ganZhi 간지 한자 (예: '甲子')
 * @returns [공망1, 공망2] 또는 null
 */
export function getGongmang(ganZhi: string): [string, string] | null {
    const sun = getSun(ganZhi);
    if (!sun) return null;

    return GONGMANG_TABLE[sun] || null;
}

/**
 * 특정 지지가 공망인지 확인
 * @param baseGanZhi 기준 간지 한자 (년주 또는 일주)
 * @param targetJi 확인할 지지
 * @returns 공망 여부
 */
export function isGongmang(baseGanZhi: string, targetJi: string): boolean {
    const gongmang = getGongmang(baseGanZhi);
    if (!gongmang) return false;

    return gongmang.includes(targetJi);
}

/**
 * 공망 지지를 한글로 변환
 */
export function getGongmangKorean(ganZhi: string): [string, string] | null {
    const gongmang = getGongmang(ganZhi);
    if (!gongmang) return null;

    return [JI_HAN_TO_KOR[gongmang[0]] || gongmang[0], JI_HAN_TO_KOR[gongmang[1]] || gongmang[1]];
}

/**
 * 해공(解空) 여부 확인
 * 공망 지지가 합(육합/삼합) 또는 충(육충)을 맞으면 공망이 해제됨
 * @param gongmangJi 공망 지지
 * @param allJi 사주의 모든 지지 배열
 * @returns 해공 여부와 해공 이유
 */
export function checkHaegong(gongmangJi: string, allJi: string[]): { isHaegong: boolean; reason: string | null } {
    // 육합 체크
    const yukApPair = YUKAP_TABLE[gongmangJi];
    if (yukApPair && allJi.includes(yukApPair)) {
        return {
            isHaegong: true,
            reason: `육합(${JI_HAN_TO_KOR[gongmangJi]}${JI_HAN_TO_KOR[yukApPair]}합)`
        };
    }

    // 삼합 체크 (3개 중 2개 이상 있으면 반합 성립)
    const samhapGroup = SAMHAP_GROUPS[gongmangJi];
    if (samhapGroup) {
        const matchCount = samhapGroup.filter(ji => allJi.includes(ji)).length;
        if (matchCount >= 2) {
            return {
                isHaegong: true,
                reason: `삼합(${samhapGroup.map(ji => JI_HAN_TO_KOR[ji]).join('')})`
            };
        }
    }

    // 육충 체크
    const chungPair = YUKCHUNG_TABLE[gongmangJi];
    if (chungPair && allJi.includes(chungPair)) {
        return {
            isHaegong: true,
            reason: `육충(${JI_HAN_TO_KOR[gongmangJi]}${JI_HAN_TO_KOR[chungPair]}충)`
        };
    }

    return { isHaegong: false, reason: null };
}

/**
 * 위치별 공망 의미 (상세)
 */
export const GONGMANG_MEANING: Record<string, string> = {
    '년지': '조상덕 부족, 해외 인연, 독립심 강함',
    '월지': '부모덕 부족, 청년기 방황, 직업 변동',
    '일지': '배우자 인연 약함, 독신 경향',
    '시지': '자녀덕 부족, 정신세계 발달, 종교/철학 관심'
};

/**
 * 공망 기준 설명
 */
export const GONGMANG_BASIS_INFO = {
    dayBased: {
        title: '일공망 (日空亡)',
        description: '일주를 기준으로 산출하는 공망으로, 본인과 배우자 관점에서 해석합니다.',
        weight: '원칙적인 공망 판단 기준 (100%)'
    },
    yearBased: {
        title: '년공망 (年空亡)',
        description: '년주를 기준으로 산출하는 공망으로, 조상 관점에서 참고합니다.',
        weight: '참고용 (30% 정도의 작용력)'
    }
};

/**
 * 공망 상세 설명
 */
export const GONGMANG_DESCRIPTION =
    '공망(空亡)은 "비어 있다"는 의미로, 해당 지지의 힘이 30% 정도만 작동한다고 봅니다. ' +
    '다만 합(合), 충(冲), 형(刑)이 있으면 공망이 해제(解空)됩니다. ' +
    '공망은 물질적 집착에서 벗어나 정신적 성장을 이룬다는 긍정적 해석도 가능합니다. ' +
    '운(대운/세운)에서 오는 공망은 공망으로 보지 않습니다.';
