## 일간 강약 판단 알고리즘 순서

### 1단계: 상수 정의

```typescript
const GENERATING_MAP: Record<Element, Element> = {
  'wood': 'fire', 'fire': 'earth', 'earth': 'metal', 'metal': 'water', 'water': 'wood'
};

const CONTROLLING_MAP: Record<Element, Element> = {
  'wood': 'earth', 'earth': 'water', 'water': 'fire', 'fire': 'metal', 'metal': 'wood'
};
```

- `GENERATING_MAP`: 상생 관계 (목→화→토→금→수→목)
- `CONTROLLING_MAP`: 상극 관계 (목→토→수→화→금→목)

### 2단계: 월령 득령 점수 계산 (`calculateDeukRyeong`)

```typescript
function calculateDeukRyeong(dayMaster: string, monthJi: string): number
```

- 입력: 일간 천간, 월지
- 로직:
  1. 일간과 월지의 오행 추출
  2. 같은 오행이면 +2
  3. 월지가 일간을 생하면 +2
  4. 월지가 일간을 극하면 -2
  5. 월지가 일간이 생하는 오행이면 설기 -2
  6. 그 외 0
- 반환: 득령 점수 (-2, 0, +2)

### 3단계: 통근 점수 계산 (`calculateTonggeun`)

```typescript
function calculateTonggeun(dayMaster: string, pillars: Pillar[]): number
```

- 입력: 일간 천간, 사주 4주 배열
- 로직:
  1. 각 주의 지지 확인
     - 일지에 일간과 같은 오행이면 +2
     - 년지/월지/시지에 일간과 같은 오행이면 각 +1
  2. 지장간 확인
     - 일지의 지장간에 일간과 같은 오행이면 +1
     - 다른 주의 지장간에 일간과 같은 오행이면 +1
- 반환: 통근 점수 (누적 합)

### 4단계: 천간 생조 점수 계산 (`calculateCheongan`)

```typescript
function calculateCheongan(dayMaster: string, pillars: Pillar[]): number
```

- 입력: 일간 천간, 사주 4주 배열
- 로직:
  1. 각 주의 천간 확인
  2. 십신 계산
     - 인성(편인, 정인)이면 +1
     - 비겁(비견, 겁재)이면 +1
- 반환: 천간 생조 점수 (누적 합)

### 5단계: 일간 강약 최종 판단 (`calculateIlganStrength`)

```typescript
export function calculateIlganStrength(dayMaster: string, pillars: Pillar[]): IlganStrength
```

- 입력: 일간 천간, 사주 4주 배열
- 실행 순서:
  1. 월주 검증
  2. 득령 점수 계산: `calculateDeukRyeong(dayMaster, monthPillar.jiHan)`
  3. 통근 점수 계산: `calculateTonggeun(dayMaster, pillars)`
  4. 천간 생조 점수 계산: `calculateCheongan(dayMaster, pillars)`
  5. 총점 계산: `totalScore = deukRyeong + tonggeun + cheongan`
  6. 강약 판정:
     - 총점 ≥ 3 → `'strong'` (신강)
     - 총점 ≤ -3 → `'weak'` (신약)
     - 그 외 → `'neutral'` (중화)
  7. 결과 반환:
     ```typescript
     {
       strength: 'strong' | 'weak' | 'neutral',
       score: totalScore,
       details: {
         deukRyeong: 득령 점수,
         tonggeun: 통근 점수,
         cheongan: 천간 생조 점수
       }
     }
     ```

## 전체 흐름 요약

```
입력: 일간(dayMaster), 사주 4주(pillars)
  ↓
1. 월령 득령 점수 계산 (-2 ~ +2)
  ↓
2. 통근 점수 계산 (0 이상, 누적)
  ↓
3. 천간 생조 점수 계산 (0 이상, 누적)
  ↓
4. 총점 = 득령 + 통근 + 천간생조
  ↓
5. 강약 판정
   - 총점 ≥ 3 → 신강
   - 총점 ≤ -3 → 신약
   - 그 외 → 중화
  ↓
출력: IlganStrength 객체
```

## 예시

예: 일간 戊土, 월지 寅(木), 일지 戌(土), 월간 丙火(편인)

```
1. 득령: 월지 木이 일간 土를 극함 → -2점
2. 통근: 일지 戌(土)에 뿌리 → +2점
3. 천간생조: 월간 丙火(편인) → +1점

총점: -2 + 2 + 1 = 1점
판정: 'neutral' (중화)
```

이 알고리즘은 3가지 요소를 합산해 일간의 강약을 판단합니다.