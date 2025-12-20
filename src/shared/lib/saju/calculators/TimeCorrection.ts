/**
 * 시간 보정 및 역사적 표준시 유틸리티
 */

export interface TimePoint {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

/**
 * 한국 역사적 표준시 오프셋 (분 단위)
 * UTC+9(KST)를 기준으로, 해당 시기의 시계가 몇 분 차이났는지 반환합니다.
 * 
 * 예: 1954년 (UTC+8:30) 인 경우, 시계가 표준(UTC+9)보다 30분 느리므로
 * 절대 시간(UTC)을 맞추기 위해 입력받은 '지방시'에 +30분을 해야 KST가 됩니다.
 */
export function getKoreaHistoricalOffset(time: TimePoint, applyDST: boolean = true): number {
  const { year, month, day, hour, minute } = time;
  const date = new Date(year, month - 1, day, hour, minute);
  let adjustment = 0;

  // UTC+08:30 Periods
  // 1908.04.01 ~ 1911.12.31
  if (
    (year === 1908 && month >= 4) ||
    (year > 1908 && year < 1911) ||
    (year === 1911 && month <= 12)
  ) {
    adjustment += 30;
  } 
  // 1954.03.21 ~ 1961.08.09
  else if (
    (year === 1954 && month >= 3 && day >= 21) ||
    (year > 1954 && year < 1961) ||
    (year === 1961 && month <= 8 && day <= 9)
  ) {
    adjustment += 30;
  }

  // DST (Daylight Saving Time) Periods
  if (applyDST) {
    const dstPeriods = [
      { start: new Date(1948, 5, 1, 0, 0), end: new Date(1948, 8, 13, 0, 0) },
      { start: new Date(1949, 3, 3, 0, 0), end: new Date(1949, 8, 11, 0, 0) },
      { start: new Date(1950, 3, 1, 0, 0), end: new Date(1950, 8, 10, 0, 0) },
      { start: new Date(1951, 4, 6, 0, 0), end: new Date(1951, 8, 9, 0, 0) },
      { start: new Date(1955, 4, 5, 0, 0), end: new Date(1955, 8, 9, 0, 0) },
      { start: new Date(1956, 4, 20, 0, 0), end: new Date(1956, 8, 30, 0, 0) },
      { start: new Date(1957, 4, 5, 0, 0), end: new Date(1957, 8, 22, 0, 0) },
      { start: new Date(1958, 4, 4, 0, 0), end: new Date(1958, 8, 21, 0, 0) },
      { start: new Date(1959, 4, 3, 0, 0), end: new Date(1959, 8, 20, 0, 0) },
      { start: new Date(1960, 4, 1, 0, 0), end: new Date(1960, 8, 18, 0, 0) },
      { start: new Date(1987, 4, 10, 2, 0), end: new Date(1987, 9, 11, 3, 0) },
      { start: new Date(1988, 4, 8, 2, 0), end: new Date(1988, 9, 9, 3, 0) },
    ];

    for (const period of dstPeriods) {
      if (date >= period.start && date <= period.end) {
        adjustment -= 60; // 서머타임은 시계를 앞당긴 것이므로 1시간을 빼줌
        break;
      }
    }
  }

  return adjustment;
}

/**
 * 경도(Longitude) 에 따른 보정 시간을 계산합니다. (Standard: 135E)
 * Formula: (longitude - 135) * 4 minutes
 * 
 * 예: 서울 (127.5E) -> (127.5 - 135) * 4 = -30분
 */
export function getLongitudeOffset(longitude: number = 127.5): number {
  return (longitude - 135) * 4;
}

/**
 * 날짜에 분을 더해 새로운 TimePoint를 반환합니다.
 */
export function addMinutes(time: TimePoint, minutes: number): TimePoint {
  const d = new Date(Date.UTC(time.year, time.month - 1, time.day, time.hour, time.minute));
  d.setUTCMinutes(d.getUTCMinutes() + minutes);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes()
  };
}
