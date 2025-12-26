# 용신(用神) 계산 로직 리팩토링 요청 프롬프트

## 🎯 역할 정의
당신은 **전통 명리학에 정통한 풀스택 개발자**입니다. 사주 명리학의 정론(正論)을 코드로 정확하게 구현하는 것이 목표입니다.

---

## 📋 작업 개요
현재 `Yongshin.ts`와 `SajuCalculator.ts` 파일의 용신 계산 로직을 **전통 명리학 원칙에 부합하도록 리팩토링**해주세요.

---

## 🔴 현재 코드의 주요 문제점

### 1. 조후(調候) 판단 로직 문제

**현재 코드 (222-234줄):**
```typescript
function neededElementBySeason(season: Season, dayElement: Element): Element {
  if (season === 'summer') return 'water'; 
  if (season === 'winter') return 'fire';  
  // ...
}
```

**문제점:**
- ❌ 계절만으로 조후를 판단 (여름=수, 겨울=화 기계적 적용)
- ❌ 명식 내 실제 한(寒)·열(熱)·조(燥)·습(濕) 상태 미분석
- ❌ 이미 조후가 충족된 명식에도 조후 용신 적용

**수정 방향:**
- 명식 전체의 한열조습 상태를 분석하는 함수 추가
- 조후 충족 여부 판단 로직 구현
- 극한 조후(한습극/조열극) 명식 별도 처리

---

### 2. 종격(從格) 판단 누락

**현재 코드:**
- 종격 판단 로직이 완전히 누락됨
- `getEokbuCandidates()`에서 강/약/중립만 판단

**문제점:**
- ❌ 종강격(從强格), 종약격(從弱格), 가종격(假從格) 미구현
- ❌ 종격 명식에 억부 용신 잘못 적용 가능

**수정 방향:**
```typescript
// 추가 필요한 로직
interface JonggyeokResult {
  isJonggyeok: boolean;
  type: 'none' | 'jonggang' | 'jongyak' | 'gajong';
  reason: string;
}

function checkJonggyeok(saju: SajuData, dayElement: Element, roots: number): JonggyeokResult {
  // 1. 월령 득령 여부 확인
  // 2. 사주 전체 구조 분석
  // 3. 종격 성립 조건 검증
  // 4. 가종격 여부 판단
}
```

---

### 3. 용신 판단 순서 오류

**현재 코드 (352-484줄):**
```typescript
export function calculateYongshin(sajuData: SajuData): Yongshin | null {
  // 1. 억부 후보 계산
  // 2. 조후 후보 계산
  // 3. 우선순위 결정
}
```

**문제점:**
- ❌ 조후 → 종격 → 억부 순서가 아님
- ❌ 조후가 선결 조건으로 처리되지 않음

**수정 방향 (정확한 순서):**
```typescript
export function calculateYongshin(sajuData: SajuData): Yongshin | null {
  // 1단계: 조후 분석 (선결 조건)
  const johuAnalysis = analyzeJohu(sajuData);
  if (johuAnalysis.isExtreme) {
    // 극한 조후 → 조후 용신이 무조건 주용신
    return createJohuYongshin(johuAnalysis);
  }
  
  // 2단계: 종격 여부 판단
  const jonggyeok = checkJonggyeok(sajuData, dayElement, roots);
  if (jonggyeok.isJonggyeok) {
    // 종격 → 억부 용신 적용 금지, 종격 전용 용신
    return createJonggyeokYongshin(jonggyeok);
  }
  
  // 3단계: 억부 판단 (보통격)
  const eokbuYongshin = calculateEokbuYongshin(sajuData);
  
  // 4단계: 통관 필요 시 추가
  // 5단계: 최종 용신 결정
}
```

---

### 4. 십성(十星) 기반 용신 표현 누락

**현재 코드:**
```typescript
primary: '목(木)',  // 오행만 반환
```

**문제점:**
- ❌ "목이 용신" 형태로만 표현
- ❌ 일간 기준 십성 관계 미표시

**수정 방향:**
```typescript
interface Yongshin {
  primary: string;           // 오행: '목(木)'
  primarySipseong: string;   // 십성: '식상' (NEW)
  secondary?: string;
  secondarySipseong?: string; // (NEW)
  // ...
}
```

---

### 5. 병약용신(病藥用神) 개념 누락

**현재 코드:**
- 단순 부족/과다만 판단
- 명식의 '병(病)'을 찾고 치료하는 '약(藥)' 개념 없음

**수정 방향:**
```typescript
interface ByungyakAnalysis {
  byung: {               // 병(病): 명식의 문제점
    element: Element;
    type: 'excess' | 'conflict' | 'blocking';
    description: string;
  } | null;
  yak: Element | null;   // 약(藥): 병을 치료하는 오행
}

function analyzeByungyak(saju: SajuData): ByungyakAnalysis {
  // 1. 과다 오행 → 설기(洩氣) 또는 극(克)하는 오행이 약
  // 2. 충돌 관계 → 통관하는 오행이 약
  // 3. 막힘(인성과다 등) → 극하는 오행이 약
}
```

---

### 6. 토(土)의 조후 조절 기능 미구현

**현재 코드:**
- 토를 일반 오행으로만 처리

**문제점:**
- ❌ 습토(丑·辰) / 조토(未·戌) 구분 없음
- ❌ 조후 판단에서 토의 역할 미반영

**수정 방향:**
```typescript
type EarthType = 'wet' | 'dry';

function getEarthType(ji: string): EarthType | null {
  const wetEarth = ['丑', '辰'];  // 습토
  const dryEarth = ['未', '戌'];  // 조토
  
  if (wetEarth.includes(ji)) return 'wet';
  if (dryEarth.includes(ji)) return 'dry';
  return null;
}

function analyzeJohu(saju: SajuData): JohuAnalysis {
  // 습토는 한(寒)을 더하고, 조토는 열(熱)을 더함
  // 이를 조후 점수에 반영
}
```

---

### 7. 월령 중심 강약 판단 강화 필요

**현재 코드 (136-162줄):**
```typescript
function countRootsWeighted(saju: SajuData, dayElement: Element): number {
  // 월지 가중치 3.0 적용
}
```

**보완점:**
- 득령(得令) 여부를 명시적으로 반환
- 단순 roots 숫자가 아닌 구조적 판단

**수정 방향:**
```typescript
interface StrengthAnalysis {
  deukryeong: boolean;      // 월령 득령 여부 (가장 중요)
  deukji: boolean;          // 지지 통근 여부
  deukse: boolean;          // 천간 투출 여부
  tugan: boolean;           // 통근+투간 연결 여부
  rootScore: number;        // 종합 점수
  structuralStrength: 'extreme-strong' | 'strong' | 'neutral' | 'weak' | 'extreme-weak';
}

function analyzeStrength(saju: SajuData, dayElement: Element): StrengthAnalysis {
  // 1. 월지 본기가 일간과 같은 오행인지 확인 (득령)
  // 2. 다른 지지의 통근 여부 확인 (득지)
  // 3. 천간에 비겁/인성 투출 여부 확인 (득세)
  // 4. 구조적 강약 판단
}
```

---

### 8. 합(合)·충(沖) 처리 로직 추가 필요

**현재 코드:**
- 합충 판단 로직 없음

**문제점:**
- ❌ 합이 성립하면 해당 오행의 작용이 변함
- ❌ 충이 있으면 위치·역할에 따라 해석 달라짐
- ❌ 용신이 합거(合去)되면 무력화

**수정 방향:**
```typescript
interface CombinationAnalysis {
  tianganHe: Array<{     // 천간합
    stems: [string, string];
    isTransformed: boolean;
    result?: Element;
  }>;
  dizhiHe: Array<{       // 지지합 (육합, 삼합, 방합)
    type: 'liuhe' | 'sanhe' | 'fanghe';
    branches: string[];
    isComplete: boolean;
    result?: Element;
  }>;
  chong: Array<{         // 충
    branches: [string, string];
    impact: 'neutralize' | 'activate' | 'damage';
  }>;
}

function analyzeCombinations(saju: SajuData): CombinationAnalysis {
  // 합충 분석 후 용신 판단에 반영
}
```

---

### 9. 격국(格局) 개념 추가 권장

**현재 코드:**
- 격국 판단 없이 바로 용신 계산

**수정 방향:**
```typescript
type GyeokgukType = 
  | 'jeonggwan' | 'pyeongwan'    // 정관격, 편관격
  | 'jeongin' | 'pyeonin'        // 정인격, 편인격
  | 'siksin' | 'sanggwan'        // 식신격, 상관격
  | 'jeongjae' | 'pyeonjae'      // 정재격, 편재격
  | 'geonrok' | 'yangin'         // 건록격, 양인격
  | 'jonggang' | 'jongyak'       // 종강격, 종약격
  | 'special';                    // 특수격

function determineGyeokguk(saju: SajuData): GyeokgukType {
  // 월지 지장간 중 투간된 것을 기준으로 격국 판단
}
```

---

### 10. 용신 출력 구조 개선

**현재 Yongshin 인터페이스 확장:**
```typescript
interface Yongshin {
  // 주용신
  primary: string;              // 오행
  primarySipseong: string;      // 십성 (NEW)
  primaryType: 'johu' | 'eokbu' | 'byungyak' | 'tonggwan';  // 용신 유형 세분화
  
  // 보조용신
  secondary?: string;
  secondarySipseong?: string;
  
  // 희신/기신
  heeshin: string[];
  heeshinSipseong: string[];    // (NEW)
  gishin: string[];
  gishinSipseong: string[];     // (NEW)
  
  // 구조 분석 결과
  structuralAnalysis: {
    gyeokguk: GyeokgukType;     // 격국 (NEW)
    jonggyeok?: JonggyeokResult; // 종격 여부 (NEW)
    johuStatus: JohuAnalysis;   // 조후 상태 (NEW)
    byungyak?: ByungyakAnalysis; // 병약 분석 (NEW)
  };
  
  // 기존 필드
  confidence: 'high' | 'medium' | 'low';
  evidence: { ... };
}
```

---

## ✅ 수정 시 준수해야 할 명리학 원칙

### 판단 순서 (절대 변경 금지)
```
1. 조후 분석 → 극한 조후면 조후 용신이 주용신
2. 종격 판단 → 종격이면 종격 전용 용신
3. 억부 판단 → 보통격의 경우 적용
4. 병약 분석 → 병이 명확하면 약이 용신
5. 통관 검토 → 상극 충돌 시 통관 용신 추가
```

### 핵심 원칙
1. **용신은 일간 중심으로만 판단** (사주 전체 평균 ❌)
2. **조후는 선결 조건** (조후 불량 → 억부 무효)
3. **종격은 별도 체계** (종격에서 억부 적용 ❌)
4. **월령이 강약 판단의 핵심** (점수·개수는 보조)
5. **십성으로 해석, 오행으로 구현**
6. **습토/조토 구분 필수** (조후 판단의 핵심)
7. **합충은 조건부 작용** (무조건 적용 ❌)

---

## 📁 수정 대상 파일

1. **Yongshin.ts** - 용신 계산 핵심 로직
2. **SajuCalculator.ts** - 사주 계산 메인 (용신 호출부)
3. **types.ts** (필요시) - Yongshin 인터페이스 확장

---

## 📤 출력 형식

각 수정 사항에 대해 다음 형식으로 제공해주세요:

```typescript
// ============================================
// [수정 #N] 수정 제목
// 위치: 파일명, 라인 번호
// 원인: 왜 수정이 필요한지
// ============================================

// 기존 코드:
// ...

// 수정 코드:
// ...

// 명리학적 근거:
// ...
```

---

## 🎯 최종 목표

**"조후 → 격국·종격 → 억부 → 병약 → 십성으로 해석 → 오행으로 구현"**

이 순서와 원칙을 코드에 정확히 반영하여, **전통 명리학의 정론에 부합하는 용신 계산 엔진**을 완성해주세요.