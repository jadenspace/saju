/**
 * 공망(空亡) 관련 데이터 및 계산 로직
 * 참조: docs/만세력.md - 공망(空亡) 섹션
 * 
 * 공망은 육갑(六甲)의 순서에서 빠진 두 지지를 말합니다.
 * 비어있어 힘을 못 쓴다는 의미입니다.
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
 * 일주 기준 공망 지지 반환
 * @param dayGanZhi 일주 간지 한자 (예: '甲子')
 * @returns [공망1, 공망2] 또는 null
 */
export function getGongmang(dayGanZhi: string): [string, string] | null {
    const sun = getSun(dayGanZhi);
    if (!sun) return null;

    return GONGMANG_TABLE[sun] || null;
}

/**
 * 특정 지지가 공망인지 확인
 * @param dayGanZhi 일주 간지 한자
 * @param targetJi 확인할 지지
 * @returns 공망 여부
 */
export function isGongmang(dayGanZhi: string, targetJi: string): boolean {
    const gongmang = getGongmang(dayGanZhi);
    if (!gongmang) return false;

    return gongmang.includes(targetJi);
}

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
 * 공망 지지를 한글로 변환
 */
export function getGongmangKorean(dayGanZhi: string): [string, string] | null {
    const gongmang = getGongmang(dayGanZhi);
    if (!gongmang) return null;

    return [JI_HAN_TO_KOR[gongmang[0]] || gongmang[0], JI_HAN_TO_KOR[gongmang[1]] || gongmang[1]];
}

/**
 * 위치별 공망 의미
 */
export const GONGMANG_MEANING: Record<string, string> = {
    '년지': '조상덕 부족, 해외 인연',
    '월지': '부모덕 부족, 청년기 방황',
    '일지': '배우자 인연 약함',
    '시지': '자녀덕 부족, 정신세계 발달'
};

/**
 * 공망 상세 설명
 */
export const GONGMANG_DESCRIPTION =
    '공망(空亡)은 \"비어 있다\"는 의미로, 해당 지지의 힘이 약해진다고 봅니다. ' +
    '다만 합(合), 충(冲), 형(刑)이 있으면 공망이 해제된다는 해석도 있습니다. ' +
    '공망은 부정적인 면도 있지만, 물질적 집착에서 벗어나 정신적 성장을 이룬다는 긍정적 해석도 가능합니다.';
