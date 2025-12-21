export type OhaengLevel = '결핍' | '부족' | '균형' | '강함' | '과다';

/**
 * 오행 개수에 따라 강도 레벨을 반환합니다.
 * @param count - 오행의 개수 (0 ~ 8)
 * @returns 오행 강도 레벨
 */
export function getOhaengLevel(count: number): OhaengLevel {
  if (count === 0) return '결핍';
  if (count === 1) return '부족';
  if (count === 2) return '균형';
  if (count === 3) return '강함';
  return '과다'; // 4개 이상
}
