"use client";

import { MonthlyFortune2026 as MonthlyFortune2026Type } from "@/entities/saju/model/types";
import styles from "./MonthlyFortune2026.module.css";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Modal } from "@/shared/ui/Modal";

interface MonthlyFortune2026Props {
  monthly: MonthlyFortune2026Type[];
}

export const MonthlyFortune2026 = ({ monthly }: MonthlyFortune2026Props) => {
  const [selectedMonth, setSelectedMonth] =
    useState<MonthlyFortune2026Type | null>(null);
  // activeIndex가 유효한 범위 내에 있도록 보장
  const [activeIndex, setActiveIndex] = useState(() => {
    return monthly.length > 0 ? 0 : -1;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const monthWheelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const monthCardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // monthly 배열이 변경되거나 activeIndex가 범위를 벗어났을 때 보정
  useEffect(() => {
    if (monthly.length === 0) {
      if (activeIndex !== -1) {
        setActiveIndex(-1);
      }
      return;
    }

    // activeIndex가 유효한 범위를 벗어났을 때만 보정
    if (activeIndex < 0) {
      setActiveIndex(0);
    } else if (activeIndex >= monthly.length) {
      setActiveIndex(monthly.length - 1);
    }
  }, [monthly.length, activeIndex]);

  const gradeStars = (grade: string) => {
    const starMap: Record<string, number> = {
      상상: 5, // 5개 별
      상: 4,
      중상: 3,
      중: 2,
      중하: 1,
      하: 0,
    };
    return starMap[grade] || 0;
  };

  // 점수를 별 개수로 변환 (월운 기준)
  const scoreToStars = (score: number): number => {
    if (score >= 4.5) return 5;
    if (score >= 4.0) return 4;
    if (score >= 3.0) return 3;
    if (score >= 2.5) return 2;
    if (score >= 2.0) return 1;
    return 0;
  };

  // 지지 한글 변환
  const convertJiToKorean = (jiHan: string): string => {
    const map: Record<string, string> = {
      子: "자",
      丑: "축",
      寅: "인",
      卯: "묘",
      辰: "진",
      巳: "사",
      午: "오",
      未: "미",
      申: "신",
      酉: "유",
      戌: "술",
      亥: "해",
    };
    return map[jiHan] || jiHan;
  };

  // 간지 한글 변환 (간+지)
  const convertGanZhiToKorean = (ganZhi: string): string => {
    const ganMap: Record<string, string> = {
      甲: "갑",
      乙: "을",
      丙: "병",
      丁: "정",
      戊: "무",
      己: "기",
      庚: "경",
      辛: "신",
      壬: "임",
      癸: "계",
    };
    const jiMap: Record<string, string> = {
      子: "자",
      丑: "축",
      寅: "인",
      卯: "묘",
      辰: "진",
      巳: "사",
      午: "오",
      未: "미",
      申: "신",
      酉: "유",
      戌: "술",
      亥: "해",
    };
    if (ganZhi.length === 2) {
      const gan = ganMap[ganZhi[0]] || ganZhi[0];
      const ji = jiMap[ganZhi[1]] || ganZhi[1];
      return gan + ji;
    }
    return ganZhi;
  };

  // 점수에 따른 요약 제목 생성
  const getSummaryTitle = (score: number): string => {
    if (score >= 4.5) return "최고의 달";
    if (score >= 4.0) return "좋은 달";
    if (score >= 3.0) return "보통의 달";
    if (score >= 2.5) return "주의의 달";
    if (score >= 2.0) return "조심의 달";
    return "조심의 달";
  };

  // 선형그래프를 위한 좌표 계산 (useMemo로 메모이제이션하여 hydration 에러 방지)
  const chartData = useMemo(() => {
    const width = 800;
    const height = 200;
    const padding = { top: 20, right: 40, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    if (monthly.length === 0) {
      return { points: [], pathData: "", width, height, padding };
    }

    const points = monthly.map((month, index) => {
      const divisor = monthly.length > 1 ? monthly.length - 1 : 1;
      const x = padding.left + (index / divisor) * chartWidth;
      const y =
        padding.top + chartHeight - ((month.score - 1) / 4) * chartHeight;
      // 숫자 포맷팅을 미리 계산하여 hydration 일관성 보장
      const scoreFixed = Number(month.score.toFixed(1));
      return {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
        month,
        score: scoreFixed,
        grade: month.grade,
        ganZhi: month.ganZhi,
      };
    });

    // 선 경로 생성
    const pathData = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    return { points, pathData, width, height, padding };
  }, [monthly]);

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!detailsRef.current) return;
    setIsDragging(false);
    setStartX(e.pageX - detailsRef.current.offsetLeft);
    setScrollLeft(detailsRef.current.scrollLeft);
    dragStartRef.current = {
      x: e.pageX,
      time: Date.now(),
    };
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!detailsRef.current || !dragStartRef.current) return;
    const x = e.pageX - detailsRef.current.offsetLeft;
    const walk = Math.abs(x - startX);

    // 일정 거리 이상 움직였을 때만 드래그로 판단
    if (walk > 5) {
      if (!isDragging) {
        setIsDragging(true);
      }
      e.preventDefault();
      const scrollWalk = (x - startX) * 2; // 스크롤 속도 조절
      detailsRef.current.scrollLeft = scrollLeft - scrollWalk;
    }
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // 마우스가 영역을 벗어날 때 드래그 종료
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // 카드 클릭 처리 (드래그가 아닐 때만)
  const handleDesktopCardClick = (
    month: MonthlyFortune2026Type,
    e: React.MouseEvent,
  ) => {
    // 드래그 중이면 클릭 무시
    if (isDragging) {
      return;
    }

    // 해당 카드로 스크롤
    const cardElement = monthCardRefs.current.get(month.month);
    if (cardElement && detailsRef.current) {
      const container = detailsRef.current;
      const cardLeft = cardElement.offsetLeft;
      const cardWidth = cardElement.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollPosition = cardLeft - containerWidth / 2 + cardWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }

    setSelectedMonth(month);
  };

  // 모바일 터치 처리 (네이티브 이벤트로 passive: false 설정)
  const handleTouchStart = useCallback((e: Event) => {
    const touchEvent = e as TouchEvent;
    // preventDefault() 제거 - 클릭 이벤트가 정상 작동하도록
    startYRef.current = touchEvent.touches[0].pageY;
    isDraggingRef.current = false; // 초기에는 드래그 아님
    // setIsDragging 제거 - 리렌더링 방지로 더 부드러운 드래그
  }, []);

  const handleTouchMove = useCallback(
    (e: Event) => {
      if (monthly.length === 0) return;
      const touchEvent = e as TouchEvent;
      const currentY = touchEvent.touches[0].pageY;
      const diff = Math.abs(startYRef.current - currentY);

      // 실제로 움직였을 때만 드래그로 판단
      if (diff > 2) {
        if (!isDraggingRef.current) {
          isDraggingRef.current = true;
          // setIsDragging 제거 - 리렌더링 방지로 더 부드러운 드래그
        }
        // preventDefault() 제거 - 기본 동작 막지 않음

        // 임계값을 낮춰서 더 빠르게 반응하도록 (30 -> 5)
        if (diff > 5) {
          setActiveIndex((prev) => {
            const moveDiff = startYRef.current - currentY;
            if (moveDiff > 0 && prev < monthly.length - 1) {
              startYRef.current = currentY;
              return Math.min(prev + 1, monthly.length - 1);
            } else if (moveDiff < 0 && prev > 0) {
              startYRef.current = currentY;
              return Math.max(prev - 1, 0);
            }
            return prev;
          });
        }
      }
    },
    [monthly.length],
  );

  const handleTouchEnd = useCallback(() => {
    // 드래그가 아니었으면 클릭 이벤트가 자연스럽게 발동됨
    isDraggingRef.current = false;
    // setIsDragging 제거 - 리렌더링 방지로 더 부드러운 드래그
  }, []);

  // 네이티브 터치 이벤트 리스너 등록 (passive: false) - monthWheel에만 적용
  useEffect(() => {
    const monthWheelElement = monthWheelRef.current;

    if (monthWheelElement) {
      monthWheelElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      monthWheelElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      monthWheelElement.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });
    }

    return () => {
      if (monthWheelElement) {
        monthWheelElement.removeEventListener("touchstart", handleTouchStart);
        monthWheelElement.removeEventListener("touchmove", handleTouchMove);
        monthWheelElement.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // 휠 이벤트 처리 (모바일 시뮬레이션 및 터치패드 대응)
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 10) return;
    if (monthly.length === 0) return;

    if (e.deltaY > 0 && activeIndex < monthly.length - 1) {
      setActiveIndex((prev) => Math.min(prev + 1, monthly.length - 1));
    } else if (e.deltaY < 0 && activeIndex > 0) {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // activeMonth를 안전하게 가져오기
  const activeMonth =
    activeIndex >= 0 && activeIndex < monthly.length
      ? monthly[activeIndex]
      : null;

  return (
    <div className={styles.container}>
      {/* 데스크탑 뷰: 그래프 + 가로 스크롤 카드 */}
      <div className={styles.desktopView}>
        {/* 월별 선형 그래프 */}
        <div className={styles.graph}>
          <svg
            viewBox={`0 0 ${chartData.width} ${chartData.height}`}
            className={styles.lineChart}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 그리드 라인 */}
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity="0.3"
                />
              </linearGradient>
            </defs>

            {/* Y축 그리드 라인 */}
            {[1, 2, 3, 4, 5].map((score) => {
              const chartHeight =
                chartData.height -
                chartData.padding.top -
                chartData.padding.bottom;
              const y =
                chartData.padding.top +
                chartHeight -
                ((score - 1) / 4) * chartHeight;
              return (
                <g key={score}>
                  <line
                    x1={chartData.padding.left}
                    y1={y}
                    x2={chartData.width - chartData.padding.right}
                    y2={y}
                    stroke="var(--card-border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                  <text
                    x={chartData.padding.left - 15}
                    y={y + 4}
                    fontSize="12"
                    fill="var(--foreground-muted)"
                    textAnchor="end"
                  >
                    {score}
                  </text>
                </g>
              );
            })}

            {/* 영역 채우기 */}
            {chartData.pathData && (
              <path
                d={`${chartData.pathData} L ${chartData.width - chartData.padding.right} ${chartData.height - chartData.padding.bottom} L ${chartData.padding.left} ${chartData.height - chartData.padding.bottom} Z`}
                fill="url(#lineGradient)"
                opacity="0.2"
              />
            )}

            {/* 선 */}
            {chartData.pathData && (
              <path
                d={chartData.pathData}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* 점 */}
            {chartData.points.map((point, index) => {
              const scoreText = point.score.toFixed(1);
              return (
                <g key={`point-${point.month.month}-${index}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="var(--primary)"
                    stroke="var(--card-bg)"
                    strokeWidth="2"
                  />
                  {/* 점수 표시 */}
                  <text
                    x={point.x}
                    y={point.y - 12}
                    fontSize="11"
                    fill="var(--foreground)"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {scoreText}
                  </text>
                </g>
              );
            })}

            {/* X축 레이블 */}
            {chartData.points.map((point, index) => (
              <text
                key={`label-${point.month.month}-${index}`}
                x={point.x}
                y={chartData.height - chartData.padding.bottom + 20}
                fontSize="11"
                fill="var(--foreground-muted)"
                textAnchor="middle"
              >
                {point.month.month}월
              </text>
            ))}
          </svg>
        </div>

        {/* 월별 상세 */}
        <div
          ref={detailsRef}
          className={`${styles.details} ${isDragging ? styles.dragging : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {monthly.map((month) => {
            const stars = gradeStars(month.grade);
            const monthJiKorean = convertJiToKorean(month.jiHan);
            const summaryTitle = getSummaryTitle(month.score);

            return (
              <div
                key={month.month}
                ref={(el) => {
                  if (el) {
                    monthCardRefs.current.set(month.month, el);
                  } else {
                    monthCardRefs.current.delete(month.month);
                  }
                }}
                className={styles.monthCard}
                onClick={(e) => handleDesktopCardClick(month, e)}
              >
                {/* 헤더: 월과 월명 */}
                <div className={styles.monthHeader}>
                  <span className={styles.solarMonth}>{month.month}월</span>
                  <span className={styles.monthName}>{monthJiKorean}월</span>
                </div>

                {/* 간지 표시 */}
                <div className={styles.ganZhi}>
                  <span className={styles.hanja}>
                    {month.ganHan}
                    {month.jiHan}
                  </span>
                  <span className={styles.hangul}>
                    {convertGanZhiToKorean(month.ganZhi)}
                  </span>
                </div>

                {/* 별점과 테마 */}
                <div className={styles.scoreRow}>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.star} ${i < stars ? styles.active : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className={styles.theme}>{summaryTitle}</span>
                </div>

                {/* 설명 */}
                <p className={styles.oneLiner}>{month.analysis.total}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 모바일 뷰: 세로 드래그 휠 UI */}
      <div className={styles.mobileView} onWheel={handleWheel}>
        <div className={styles.wheelContainer}>
          {/* 왼쪽 곡선 가이드 (SVG) */}
          <svg className={styles.wheelArc} viewBox="0 0 100 400">
            <path
              d="M 120,0 Q 20,200 120,400"
              fill="none"
              stroke="var(--card-border)"
              strokeWidth="1"
              opacity="0.3"
            />
          </svg>

          {/* 월별 숫자들 */}
          <div ref={monthWheelRef} className={styles.monthWheel}>
            {monthly.map((month, idx) => {
              const offset = idx - activeIndex;
              const opacity = Math.max(0, 1 - Math.abs(offset) * 0.3);
              const scale = Math.max(0.6, 1 - Math.abs(offset) * 0.15);
              const translateY = offset * 60;
              // 곡선 효과를 위한 X축 이동
              const translateX = Math.pow(offset, 2) * 5;

              return (
                <div
                  key={month.month}
                  className={`${styles.wheelItem} ${idx === activeIndex ? styles.active : ""}`}
                  style={{
                    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    opacity,
                  }}
                  onClick={() => {
                    if (idx >= 0 && idx < monthly.length) {
                      setActiveIndex(idx);
                    }
                  }}
                >
                  {month.month < 10 ? `0${month.month}` : month.month}
                </div>
              );
            })}
          </div>

          {/* 현재 활성화된 월의 콘텐츠 */}
          {activeMonth && (
            <div
              className={styles.activeContent}
              onClick={() => setSelectedMonth(activeMonth)}
            >
              <div className={styles.mobileMonthTitle}>
                <div className={styles.mobileGanZhi}>
                  <span>{activeMonth.ganZhi}월</span>
                  <div className={styles.mobileStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.star} ${i < gradeStars(activeMonth.grade) ? styles.active : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <h4 className={styles.mobileSummaryTitle}>
                  {getSummaryTitle(activeMonth.score)}
                </h4>
              </div>
              <p className={styles.mobileDesc}>{activeMonth.analysis.total}</p>
              <div className={styles.mobileMore}>
                자세히 보기 <span>→</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {selectedMonth && (
        <Modal
          isOpen={!!selectedMonth}
          onClose={() => setSelectedMonth(null)}
          title={`${selectedMonth.month}월 운세`}
        >
          <div className={styles.monthContent}>
            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>
                총운
                <div className={styles.monthSectionStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${i < gradeStars(selectedMonth.grade) ? styles.active : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className={styles.monthSectionText}>
                {selectedMonth.analysis.total}
              </p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>
                재물운
                <div className={styles.monthSectionStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${i < scoreToStars(selectedMonth.scores?.wealth ?? selectedMonth.score) ? styles.active : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className={styles.monthSectionText}>
                {selectedMonth.analysis.wealth}
              </p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>
                애정운
                <div className={styles.monthSectionStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${i < scoreToStars(selectedMonth.scores?.love ?? selectedMonth.score) ? styles.active : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className={styles.monthSectionText}>
                {selectedMonth.analysis.love}
              </p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>
                직장운
                <div className={styles.monthSectionStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${i < scoreToStars(selectedMonth.scores?.career ?? selectedMonth.score) ? styles.active : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className={styles.monthSectionText}>
                {selectedMonth.analysis.career}
              </p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>
                건강운
                <div className={styles.monthSectionStars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${i < scoreToStars(selectedMonth.scores?.health ?? selectedMonth.score) ? styles.active : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className={styles.monthSectionText}>
                {selectedMonth.analysis.health}
              </p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>조언</div>
              <p className={styles.monthSectionText}>
                {selectedMonth.analysis.advice}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
