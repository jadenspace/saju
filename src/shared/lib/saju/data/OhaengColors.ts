/**
 * 오행별 색상 정보
 * 오방색 기준과 실사용 색감을 포함
 */

export interface OhaengColorInfo {
  obangColor: string; // 오방색 (대표 색)
  practicalColors: string[]; // 실사용 색감
}

export const OHAENG_COLORS: Record<string, OhaengColorInfo> = {
  '목(木)': {
    obangColor: '청(靑) / 녹(綠)',
    practicalColors: ['초록', '청록', '블루그린', '연두', '민트']
  },
  '화(火)': {
    obangColor: '적(赤)',
    practicalColors: ['빨강', '주홍', '버건디', '분홍', '코랄']
  },
  '토(土)': {
    obangColor: '황(黃)',
    practicalColors: ['노랑', '머스터드', '베이지', '황토(오커)', '황금']
  },
  '금(金)': {
    obangColor: '백(白)',
    practicalColors: ['흰색', '실버', '메탈릭(은색)', '회색', '금색']
  },
  '수(水)': {
    obangColor: '흑(黑)',
    practicalColors: ['검정', '네이비', '딥블루', '남색', '파랑']
  }
};

// 영어 키로도 접근 가능하도록 매핑
export const OHAENG_COLORS_BY_KEY: Record<string, OhaengColorInfo> = {
  wood: OHAENG_COLORS['목(木)'],
  fire: OHAENG_COLORS['화(火)'],
  earth: OHAENG_COLORS['토(土)'],
  metal: OHAENG_COLORS['금(金)'],
  water: OHAENG_COLORS['수(水)']
};
