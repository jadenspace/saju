# 사주 결과 페이지 UI 분석 리포트

## 분석 일시
2025년 1월

## 분석 방법
- 코드 리뷰 (React 컴포넌트 및 CSS 모듈)
- 반응형 디자인 검토
- 접근성 (A11y) 분석
- 사용자 경험 (UX) 평가

---

## 1. 레이아웃 및 구조 분석

### 1.1 컨테이너 구조
**현재 상태:**
- `.main`: `min-height: 100vh`, 중앙 정렬, 패딩 2rem
- `.content`: `max-width: 800px`, flexbox 컬럼 레이아웃
- `.card`: `max-width: 600px`, 글래스모피즘 효과

**개선점:**
- ✅ 데스크톱에서 카드 너비가 600px로 제한되어 여백이 과도할 수 있음
- ✅ 모바일에서 패딩이 0.5rem로 줄어들지만, 작은 화면에서는 더 조정 필요

### 1.2 섹션 구분
**현재 상태:**
- 만세력, 대운, 세운, 월운 섹션이 명확히 구분됨
- `border-top`으로 시각적 구분

**개선점:**
- ⚠️ 섹션 간 간격이 일관되지 않음 (1.5rem ~ 2rem 혼재)
- ⚠️ 긴 콘텐츠에서 스크롤이 길어짐

---

## 2. 반응형 디자인 분석

### 2.1 그리드 레이아웃

#### 대운 컨테이너
```css
/* 데스크톱: 4열 */
grid-template-columns: repeat(4, 1fr);

/* 모바일: 2열 */
@media (max-width: 480px) {
  grid-template-columns: repeat(2, 1fr);
}
```
**문제점:**
- ⚠️ 태블릿(768px)에서 중간 단계가 없어 갑작스러운 변화
- ⚠️ 모바일에서 2열이지만 각 항목이 작아 정보 밀도 높음

#### 세운 그리드
```css
/* 데스크톱: 5열 */
grid-template-columns: repeat(5, 1fr);

/* 모바일: 2열 */
@media (max-width: 480px) {
  grid-template-columns: repeat(2, 1fr);
}
```
**문제점:**
- ⚠️ 5열 → 2열로 급격한 변화
- ⚠️ 모바일에서 세운 항목이 많아 스크롤이 길어짐

#### 월운 그리드
```css
/* 데스크톱: 6열 */
grid-template-columns: repeat(6, 1fr);

/* 모바일: 3열 */
@media (max-width: 480px) {
  grid-template-columns: repeat(3, 1fr);
}
```
**문제점:**
- ⚠️ 6열 → 3열로 변화하지만, 각 항목이 작아 가독성 저하
- ⚠️ 태블릿 중간 단계 없음

### 2.2 만세력 섹션
```css
/* 데스크톱: 4열 */
grid-template-columns: repeat(4, 1fr);

/* 모바일: gap만 조정 */
@media (max-width: 480px) {
  gap: 0.4rem;
}
```
**문제점:**
- ⚠️ 모바일에서도 4열 유지로 항목이 작아짐
- ⚠️ 한자 표시 크기 감소로 가독성 저하

### 2.3 분석 섹션 그리드
- **12운성 분석**: `repeat(auto-fit, minmax(200px, 1fr))` → 모바일 1열
- **12신살 분석**: `repeat(auto-fill, minmax(250px, 1fr))` → 모바일 1열
- **공망 분석**: `repeat(2, 1fr)` → 모바일 1열

**개선점:**
- ✅ 분석 섹션은 반응형이 잘 구현됨

---

## 3. 색상 및 시각적 계층 분석

### 3.1 오행 색상
```css
.wood { background-color: #4ade80; }    /* 녹색 */
.fire { background-color: #f87171; }    /* 빨간색 */
.earth { background-color: #fbbf24; }   /* 노란색 */
.metal { background-color: #94a3b8; }   /* 회색 */
.water { background-color: #374151; }  /* 어두운 회색 */
```

**문제점:**
- ⚠️ **water 색상 대비율 부족**: `#374151` 배경에 흰색 텍스트는 WCAG AA 기준 미달 가능성
- ⚠️ **metal 색상 대비율**: `#94a3b8` 배경도 대비율 검토 필요
- ⚠️ 다크 모드에서 일부 색상이 구분이 어려울 수 있음

### 3.2 텍스트 색상 및 투명도
```css
opacity: 0.4;  /* headerGanZhi */
opacity: 0.5;  /* 여러 보조 텍스트 */
opacity: 0.6;  /* subtitle */
opacity: 0.7;  /* 여러 설명 텍스트 */
opacity: 0.8;  /* sipsin */
```

**문제점:**
- ⚠️ **낮은 opacity로 인한 가독성 저하**: 특히 `opacity: 0.4`는 너무 낮음
- ⚠️ 작은 텍스트(`font-size: 0.6rem ~ 0.7rem`)에 낮은 opacity 적용 시 가독성 크게 저하

### 3.3 활성 상태 피드백
```css
.daeunPeriod.active {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(212, 165, 116, 0.2), var(--shadow-sm);
}
```

**개선점:**
- ✅ 활성 상태가 명확히 표시됨
- ⚠️ 키보드 포커스 스타일 부족 (접근성)

---

## 4. 타이포그래피 분석

### 4.1 폰트 크기 계층
```
제목: 2rem (32px) → 모바일 1.375rem (22px)
부제목: 1.5rem (24px) → 모바일 1.25rem (20px)
본문: 0.9rem ~ 1rem (14.4px ~ 16px)
작은 텍스트: 0.6rem ~ 0.75rem (9.6px ~ 12px)
```

**문제점:**
- ⚠️ **작은 텍스트 가독성**: `0.6rem (9.6px)`는 너무 작아 모바일에서 읽기 어려움
- ⚠️ 한자 표시: `font-size: 1.8rem` → 모바일 `1.4rem`으로 감소하지만 여전히 작을 수 있음
- ⚠️ 십신 표시: `font-size: 0.6rem`은 거의 읽기 불가능

### 4.2 한자 폰트
```css
font-family: "Noto Serif KR", serif;
```

**문제점:**
- ⚠️ Noto Serif KR 폰트가 로드되지 않을 경우 fallback이 없음
- ⚠️ 모바일에서 한자 크기 감소로 가독성 저하

### 4.3 라인 높이
```css
line-height: 1.5;  /* 대부분의 본문 */
line-height: 1.6;  /* 일부 설명 텍스트 */
```

**개선점:**
- ✅ 라인 높이가 적절함

---

## 5. 인터랙션 요소 분석

### 5.1 분석 버튼
```css
.analysisButton {
  flex: 0 0 calc(33.333% - 0.67rem);  /* 3열 그리드 */
}
```

**문제점:**
- ⚠️ 모바일에서 3열 배치로 버튼이 작아짐
- ⚠️ 버튼 텍스트가 길 경우 줄바꿈 발생 가능
- ⚠️ 키보드 포커스 스타일 부족

### 5.2 대운/세운 선택
```tsx
onClick={() => setSelectedDaeunIndex(...)}
```

**문제점:**
- ⚠️ **키보드 접근성 부족**: `onClick`만 있고 키보드 이벤트 없음
- ⚠️ **ARIA 속성 부족**: `role="button"`, `aria-pressed` 등 없음
- ⚠️ 포커스 스타일 없음

### 5.3 툴팁
```css
.tooltip {
  visibility: hidden;
  opacity: 0;
}

.tooltipContainer:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
```

**문제점:**
- ⚠️ **모바일 접근성**: 호버만으로 작동하여 터치 디바이스에서 접근 불가
- ⚠️ **키보드 접근성**: 포커스 시 툴팁 표시 안 됨
- ⚠️ **ARIA 속성 부족**: `aria-describedby` 없음

---

## 6. 정보 밀도 및 가독성

### 6.1 만세력 섹션
- 4개 주 × 여러 정보 (천간, 지지, 십신, 지장간, 12운성, 12신살, 공망)
- 정보 밀도가 매우 높음

**문제점:**
- ⚠️ 모바일에서 정보가 압축되어 가독성 저하
- ⚠️ 작은 텍스트(`.sipsinMini`, `.jijangganRow`)가 읽기 어려움

### 6.2 대운/세운/월운
- 대운: 4개 항목 (10년씩)
- 세운: 10개 항목 (1년씩)
- 월운: 12개 항목 (1개월씩)

**문제점:**
- ⚠️ 세운과 월운이 많아 스크롤이 길어짐
- ⚠️ 각 항목에 많은 정보가 포함되어 복잡함

### 6.3 태그 및 배지
```css
.twelveStageTag {
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
}

.sinsalTag {
  font-size: 0.65rem;
  padding: 0.1rem 0.3rem;
}
```

**문제점:**
- ⚠️ 태그 크기가 작아 모바일에서 읽기 어려움
- ⚠️ 배지 내 텍스트가 잘릴 수 있음

---

## 7. 접근성 (A11y) 분석

### 7.1 키보드 네비게이션
**현재 상태:**
- 대부분의 인터랙티브 요소에 키보드 이벤트 없음
- 포커스 스타일 부족

**문제점:**
- ❌ **심각**: 키보드만으로 모든 기능 사용 불가
- ❌ 포커스 트랩 없음
- ❌ Tab 순서가 논리적이지 않을 수 있음

### 7.2 ARIA 속성
**현재 상태:**
- `SajuForm.tsx`에만 `aria-label` 2개 존재
- 나머지 컴포넌트에 ARIA 속성 없음

**문제점:**
- ❌ **심각**: 버튼에 `role="button"` 없음
- ❌ 토글 상태에 `aria-pressed` 없음
- ❌ 툴팁에 `aria-describedby` 없음
- ❌ 섹션에 `aria-labelledby` 없음

### 7.3 색상 의존성
**현재 상태:**
- 오행 색상으로만 정보 전달
- 텍스트나 아이콘으로 보완 부족

**문제점:**
- ⚠️ 색맹 사용자가 오행 구분 어려움
- ⚠️ 색상 외 추가 표시 필요

### 7.4 스크린 리더
**문제점:**
- ❌ 한자와 한글 병기 표시가 스크린 리더에서 혼란스러울 수 있음
- ❌ 의미 있는 텍스트 대체 없음

---

## 8. 사용자 경험 (UX) 분석

### 8.1 정보 계층
**현재 상태:**
- 만세력 → 대운 → 세운 → 월운 순서
- 분석 버튼이 하단에 배치

**개선점:**
- ⚠️ 중요한 정보(일주 분석)가 기본적으로 표시되지만, 다른 분석은 숨겨져 있음
- ⚠️ 사용자가 모든 분석을 보려면 여러 버튼 클릭 필요

### 8.2 스크롤 경험
**문제점:**
- ⚠️ 페이지가 매우 길어 스크롤이 많음
- ⚠️ 섹션 간 이동이 어려움 (목차나 앵커 링크 없음)

### 8.3 로딩 상태
**현재 상태:**
- 로딩 상태 표시 없음 (서버 컴포넌트로 즉시 렌더링)

**개선점:**
- ⚠️ 복잡한 계산 시 로딩 표시 필요할 수 있음

---

## 9. 성능 및 최적화

### 9.1 렌더링 성능
**현재 상태:**
- 많은 데이터를 한 번에 렌더링
- 조건부 렌더링으로 일부 최적화

**개선점:**
- ⚠️ 분석 섹션이 많아 초기 렌더링 시간 증가 가능
- ✅ 조건부 렌더링으로 불필요한 렌더링 방지

### 9.2 애니메이션
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**개선점:**
- ✅ 애니메이션이 부드럽고 적절함
- ⚠️ `transform` 사용 시 GPU 가속 활용 가능

---

## 10. 우선순위별 개선 제안

### 🔴 높은 우선순위 (즉시 개선 필요)

#### 1. 접근성 개선
- **키보드 네비게이션 추가**
  - 모든 인터랙티브 요소에 `onKeyDown` 이벤트 추가
  - 포커스 스타일 추가 (`:focus-visible`)
- **ARIA 속성 추가**
  - 버튼에 `role="button"`, `aria-pressed` 추가
  - 툴팁에 `aria-describedby` 추가
  - 섹션에 `aria-labelledby` 추가

#### 2. 모바일 툴팁 접근성
- 터치 디바이스에서 툴팁 접근 방법 추가 (탭/클릭)
- 키보드 포커스 시 툴팁 표시

#### 3. 색상 대비율 개선
- water 색상 (`#374151`) 대비율 향상
- metal 색상 (`#94a3b8`) 대비율 향상
- 낮은 opacity 텍스트 대비율 검토

### 🟡 중간 우선순위 (단기 개선)

#### 4. 반응형 디자인 개선
- 태블릿 중간 단계 추가 (768px ~ 1024px)
- 모바일에서 그리드 열 수 조정
- 만세력 섹션 모바일 레이아웃 개선

#### 5. 작은 텍스트 가독성
- 최소 폰트 크기 `0.75rem (12px)` 이상으로 제한
- 십신 표시 크기 증가
- 태그 및 배지 크기 증가

#### 6. 정보 밀도 조정
- 모바일에서 정보 표시 방식 변경 (아코디언, 탭 등)
- 긴 콘텐츠 섹션 접기/펼치기 기능

### 🟢 낮은 우선순위 (장기 개선)

#### 7. 사용자 경험 개선
- 페이지 내 목차/앵커 링크 추가
- 스크롤 인디케이터 추가
- 분석 섹션 기본 표시 옵션

#### 8. 성능 최적화
- 지연 로딩 (Lazy Loading) 적용
- 가상 스크롤링 고려 (세운/월운이 많을 경우)

#### 9. 시각적 개선
- 색상 외 추가 표시 (오행 구분)
- 애니메이션 최적화
- 로딩 스켈레톤 추가

---

## 11. 구체적인 개선 제안사항

### 11.1 CSS 수정 예시

#### 반응형 그리드 개선
```css
/* 태블릿 중간 단계 추가 */
@media (max-width: 1024px) {
  .daeunContainer {
    grid-template-columns: repeat(3, 1fr);
  }
  .seunGrid {
    grid-template-columns: repeat(3, 1fr);
  }
  .wolunGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .daeunContainer {
    grid-template-columns: repeat(2, 1fr);
  }
  .seunGrid {
    grid-template-columns: repeat(2, 1fr);
  }
  .wolunGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### 최소 폰트 크기 제한
```css
.sipsinMini {
  font-size: 0.75rem; /* 0.6rem → 0.75rem */
  min-height: 1.2rem; /* 최소 높이 보장 */
}

.jijangganRow {
  font-size: 0.75rem; /* 0.65rem → 0.75rem */
}
```

#### 색상 대비율 개선
```css
.water {
  background-color: #4b5563; /* #374151 → 더 밝게 */
  border: 1px solid #6b7280;
}

.metal {
  background-color: #cbd5e1; /* #94a3b8 → 더 밝게 */
  border: 1px solid #e2e8f0;
}
```

#### 포커스 스타일 추가
```css
.daeunPeriod:focus-visible,
.seunItem:focus-visible,
.analysisButton:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 11.2 컴포넌트 수정 예시

#### 키보드 접근성 추가
```tsx
<div
  className={clsx(styles.daeunPeriod, selectedDaeunIndex === index && styles.active)}
  onClick={() => setSelectedDaeunIndex(...)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedDaeunIndex(...);
    }
  }}
  role="button"
  tabIndex={0}
  aria-pressed={selectedDaeunIndex === index}
>
  {/* 내용 */}
</div>
```

#### 툴팁 접근성 개선
```tsx
const [showTooltip, setShowTooltip] = useState(false);

<div
  className={styles.tooltipContainer}
  onMouseEnter={() => setShowTooltip(true)}
  onMouseLeave={() => setShowTooltip(false)}
  onFocus={() => setShowTooltip(true)}
  onBlur={() => setShowTooltip(false)}
  aria-describedby={`tooltip-${id}`}
>
  {children}
  {showTooltip && (
    <div
      id={`tooltip-${id}`}
      className={styles.tooltip}
      role="tooltip"
    >
      {content}
    </div>
  )}
</div>
```

---

## 12. 결론

사주 결과 페이지는 전반적으로 잘 구현되어 있으나, 다음과 같은 개선이 필요합니다:

1. **접근성**: 키보드 네비게이션과 ARIA 속성 추가가 가장 시급함
2. **모바일 UX**: 작은 텍스트와 정보 밀도 조정 필요
3. **반응형**: 태블릿 중간 단계 추가 필요
4. **색상 대비**: WCAG AA 기준 충족을 위한 색상 조정 필요

이러한 개선을 통해 더 많은 사용자가 사주 결과를 편리하게 확인할 수 있을 것입니다.
