# 용신 분석 가이드

## 1. 개요
- 목적: 용신 산출에 사용되는 모든 분석 단계와 계산 기준을 한눈에 정리하여 결과 해석의 근거를 명확히 제시.
- 주요 참조 코드
  - `src/shared/lib/saju/calculators/SajuCalculator.ts`
  - `src/shared/lib/saju/calculators/Yongshin.ts`
  - `src/shared/lib/saju/calculators/IlganStrength.ts`
  - `src/shared/lib/saju/calculators/TenGod.ts`
- 전체 흐름(요약)
  1) 기초 사주 산출 및 오행/십성 계산  
  2) 일간 강약 → 오행 분포 → 강약 보정  
  3) 조후 평가(극한/불량 여부)  
  4) 종격 여부 판별  
  5) 억부·병약·통관 후보 점수화 및 우선순위 결정  
  6) 합충/격국/병약/조후 결과를 종합해 용신·보조용신·희신·기신 확정

### 흐름도
```mermaid
flowchart TD
  start[입력: 사주 데이터] --> baseCalc[오행·십성 기초 계산]
  baseCalc --> ilang[일간 강약(IilganStrength)]
  ilang --> ohaeng[오행 분포/불균형]
  ohaeng --> strength[강약 보정(StrengthAnalysis)]
  strength --> johu[조후 분석(JohuAnalysis)]
  johu -->|extreme/poor| johuYongshin[조후 용신 우선]
  strength --> jong[종격 여부]
  jong -->|종격| jongYongshin[종격 용신]
  johuYongshin --> finalize[용신 결정]
  jongYongshin --> finalize
  strength --> eokbu[억부/병약/통관 점수화]
  eokbu --> comb[합충/격국/병약 통합]
  comb --> finalize
```

## 2. 전제 조건 분석
### 2.1 일간 강약 분석 (`calculateIlganStrength`)
- 월령 득령: `calculateDeukRyeong`
  - 득령 +2: 월지가 일간과 동일 오행이거나 월지가 일간을 생함.
  - 실령 -2: 월지가 일간을 극하거나 일간이 월지를 설기.
- 통근: `calculateTonggeun`
  - 일지 뿌리 +2, 년·월·시지 뿌리 각 +1.
  - 지장간 동일 오행 포함 시 +1(일지/기타 동일 가중).
- 천간 생조: `calculateCheongan`
  - 인성(편인/정인) 천간 +1, 비겁(비견/겁재) 천간 +1.
- 강약 판정
  - 총점 ≥ 3: strong / 총점 ≤ -3: weak / 그 외: neutral.

### 2.2 오행 분포 분석 (`computeElementScores`, `deriveOhaengAnalysisFromScores`)
- 가중치
  - 천간 1.0, 지지 1.5(월지는 2배), 지장간 0.9/0.5/0.3(월지는 2배).
- 불균형 기준 (평균 대비)
  - 결핍 < 35%, 부족 < 70%, 과다 > 160%.
- 결과: `missing`, `deficient`, `excess`, 해석문.

### 2.3 강약 분석 강화 (`analyzeStrength`)
- 득령: 월지 오행 = 일간 오행 여부.
- 득지: 통근 합계 > 2.0.
- 득세: 천간 생조 점수 ≥ 1.0.
- 구조 강약 구간
  - extreme-strong: 득령 & rootScore ≥ 6.0
  - strong: 득령 & rootScore ≥ 4.0
  - neutral: rootScore 3.0~5.0
  - weak: rootScore 1.5~3.0
  - extreme-weak: 그 외.
- rootScore 구성: 월/일/년/시 통근 + 천간 생조 점수.

## 3. 조후 분석 (`analyzeJohu`, `neededElementBySeason`)
- 점수 계산: 한/열/조/습 각 가중합.
  - 계절 기본점: 겨울·여름 +3, 가을 +2, 봄 +1.
  - 천간/지지/지장간 오행별 기여 포함.
  - 토 분류: 습토(丑·辰) → 습·한, 조토(未·戌) → 조·열 가중.
- 극한/불량 판정
  - 한습극: 한 ≥ 8 & 습 ≥ 6
  - 조열극: 열 ≥ 8 & 조 ≥ 6
  - poor: 한/열 ≥ 6 && 습/조 ≥ 4
  - good/satisfied: 균형 여부로 구분.
- 필요한 오행
  - 여름: 수, 겨울: 화
  - 봄/가을: 명식에 따라 화/금/수 결정(기본 로직: 봄→화/금, 가을→화/수).
- 조후 상태가 extreme/poor이면 조후 용신을 주용신으로 우선 선정.

## 4. 종격 판단 (`checkJonggyeok`, `createJonggyeokYongshin`)
- 종강격: 득령 + 통근 강함(rootScore≥6) & 억제 기운 ≤ 1.0 → 흐름을 따라 비겁/인성 계열 선택.
- 종약격: 실령 + 통근 약함(rootScore≤2) & 생조 기운 ≤ 1.5 → 재성/관성/식상 중 원국에서 가장 강한 오행 선택.
- 가종격: 종격에 근접한 경우 보정.
- 종격 시: 종격 용신이 주용신, 희신/기신은 종격 흐름 기준으로 산출.

## 5. 병약 분석 (`analyzeByungyak`)
- 과다 오행 탐지: 평균 대비 > 1.8인 최대 오행 → 병(byung)으로 설정.
  - 설기 우선: 병 오행을 설기하는 오행이 원국에 있고 더 약하면 설기 선택.
  - 극 보완: 설기 오행이 없을 때 병 오행을 극하는 오행 사용.
- 통관: 상극 충돌이 2건 이상이면 금극목→수(금생수 수생목)처럼 중개 오행을 용신으로 승격.
- 인성 과다(편인/정인 3개 이상): 재성으로 극하여 막힘 해소.
- 반환: 병/약 오행, 선택 이유 설명.

## 6. 합충 분석 (`analyzeCombinations`, `checkYongshinCombinationImpact`)
- 천간합: 甲己(土), 乙庚(金), 丙辛(水), 丁壬(木), 戊癸(火) → 변질 시 용신 약화.
- 지지합
  - 육합: 子丑(土), 寅亥(木), 卯戌(火), 辰酉(金), 巳申(水), 午未(土)
  - 삼합: 寅午戌(火), 亥卯未(木), 巳酉丑(金), 子辰申(水) → 완성 시 해당 오행 강화.
- 충: 子午, 丑未, 寅申, 卯酉, 辰戌, 巳亥 → 용신 지지 포함 시 불안정/약화.
- `checkYongshinCombinationImpact`: 용신 오행이 합으로 변질되거나 충 맞을 때 약화, 삼합 완성 시 강화.

## 7. 격국 판단 (`determineGyeokguk`)
- 월지 지장간 중 천간 투출 여부 확인.
- 투출된 십성에 따라 격국 결정: 정관/편관/정인/편인/식신/상관/정재/편재/건록 등.
- 종격 여부와 함께 구조 분석에 포함.

## 8. 억부 용신 계산
- 후보 선정: `getEokbuCandidates`
  - 강한 일간: 생하는 오행, 극하는 오행, 극당하는 오행.
  - 약한 일간: 생해주는 오행, 일간 오행.
- 점수 계산: `scoreEokbuCandidate`
  - 불균형 점수: 결핍 +4, 부족 +2, 과다 -3.
  - 강약 적합도: 강일간(생/극/극당)·약일간(생해줌/동일) +2.
  - 원국 존재 여부: 없음 -3.0, 매우 약함(<평균 30%) -1.0, 약함(<0.7배) +0.8, 과다(>1.6배) -0.8.
  - 계절 보정: 여름·겨울 -0.3, 과다 오행 보유 시 -1.5.
  - 뿌리/통근 보정: 강약 대비 뿌리 과소/과대 시 -0.5.
- 상위 2개 후보(eokbuTop2)를 보조용신 선정에 활용.

## 9. 용신 결정 우선순위
1) 조후 우선: 조후 상태 extreme/poor → `createJohuYongshin` 결과를 주용신, 보조용신은 억부 1위(상극 제외).  
2) 종격 우선: 종강/종약/가종격 → 종격 전용 용신.  
3) 보통격: 통관 > 병약(점수차 1.5 이상) > 억부 기본 순으로 주용신 결정.

## 10. 희신/기신 (`calculateHeeshinGishin`)
- 희신: 용신을 보강하거나 용신과 동일 오행, 결핍/부족 오행 위주.
- 기신: 용신을 극/설기하거나 과다 오행, 강약에 따라 비견·인성/식상·재성·관성 중 과다 항목을 포함.
- 십성 매핑은 `getSipseongForElement`로 제공.

## 11. 원국 존재 여부 표기
- `isAbsentInWonguk`: 용신 오행이 원국 점수 0이면 표시, 우선순위 근거에 “대운 보완 필요” 문구 추가.

## 12. 신뢰도 판단 (`confidenceFromGap`)
- 점수 차(gap) 기준: ≥3.0 high / ≥1.5 medium / 그 외 low.
- 종격·조후 극한 상황은 기본적으로 medium~high로 설정.

## 13. 구조 분석 결과 필드 요약 (`StructuralAnalysis`, `Yongshin`)
- `strength`: 강약 상세(득령/득지/득세, rootScore).
- `johuStatus`: 조후 상태와 필요 오행.
- `jonggyeok`: 종격 판단 결과.
- `combinations` + `combinationImpact`: 합충 결과와 용신 영향.
- `byungyak`: 병/약/통관 정보.
- `gyeokguk`: 격국.
- `evidence`: 후보 점수, 불균형, 계절, 강약, 우선순위 사유, 합충 영향 등을 포함하여 결과 근거를 일관되게 제공.
