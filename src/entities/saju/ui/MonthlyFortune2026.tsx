'use client';

import { MonthlyFortune2026 as MonthlyFortune2026Type } from '@/entities/saju/model/types';
import styles from './MonthlyFortune2026.module.css';
import { useState, useRef, useMemo } from 'react';
import { Modal } from '@/shared/ui/Modal';

interface MonthlyFortune2026Props {
  monthly: MonthlyFortune2026Type[];
}

export const MonthlyFortune2026 = ({ monthly }: MonthlyFortune2026Props) => {
  const [selectedMonth, setSelectedMonth] = useState<MonthlyFortune2026Type | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const detailsRef = useRef<HTMLDivElement>(null);

  const gradeStars = (grade: string) => {
    const starMap: Record<string, number> = {
      '상': 4,
      '중상': 3,
      '중': 2,
      '중하': 1,
      '하': 0,
    };
    return starMap[grade] || 0;
  };

  // 지지 한글 변환
  const convertJiToKorean = (jiHan: string): string => {
    const map: Record<string, string> = {
      '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
      '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
    };
    return map[jiHan] || jiHan;
  };

  // 점수에 따른 요약 제목 생성
  const getSummaryTitle = (score: number): string => {
    if (score >= 4.5) return '최고의 달';
    if (score >= 3.5) return '좋은 달';
    if (score >= 2.5) return '보통의 달';
    if (score >= 1.5) return '주의의 달';
    return '조심의 달';
  };


  // 선형그래프를 위한 좌표 계산 (useMemo로 메모이제이션하여 hydration 에러 방지)
  const chartData = useMemo(() => {
    const width = 800;
    const height = 200;
    const padding = { top: 20, right: 40, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    if (monthly.length === 0) {
      return { points: [], pathData: '', width, height, padding };
    }

    const points = monthly.map((month, index) => {
      const divisor = monthly.length > 1 ? monthly.length - 1 : 1;
      const x = padding.left + (index / divisor) * chartWidth;
      const y = padding.top + chartHeight - ((month.score - 1) / 4) * chartHeight;
      // 숫자 포맷팅을 미리 계산하여 hydration 일관성 보장
      const scoreFixed = Number(month.score.toFixed(1));
      return { 
        x: Number(x.toFixed(2)), 
        y: Number(y.toFixed(2)), 
        month, 
        score: scoreFixed, 
        grade: month.grade, 
        ganZhi: month.ganZhi 
      };
    });

    // 선 경로 생성
    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return { points, pathData, width, height, padding };
  }, [monthly]);

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!detailsRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - detailsRef.current.offsetLeft);
    setScrollLeft(detailsRef.current.scrollLeft);
  };

  // 드래그 중
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !detailsRef.current) return;
    e.preventDefault();
    const x = e.pageX - detailsRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    detailsRef.current.scrollLeft = scrollLeft - walk;
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 마우스가 영역을 벗어날 때 드래그 종료
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // 카드 클릭 시 드래그와 구분 (데스크탑 버전)
  const handleDesktopCardClick = (month: MonthlyFortune2026Type, e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    setSelectedMonth(month);
  };

  // 모바일 터치 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].pageY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].pageY;
    const diff = startY - currentY;

    if (Math.abs(diff) > 30) {
      if (diff > 0 && activeIndex < monthly.length - 1) {
        setActiveIndex(prev => prev + 1);
        setStartY(currentY);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex(prev => prev - 1);
        setStartY(currentY);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 휠 이벤트 처리 (모바일 시뮬레이션 및 터치패드 대응)
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 10) return;
    
    if (e.deltaY > 0 && activeIndex < monthly.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const activeMonth = monthly[activeIndex];

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
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Y축 그리드 라인 */}
            {[1, 2, 3, 4, 5].map((score) => {
              const chartHeight = chartData.height - chartData.padding.top - chartData.padding.bottom;
              const y = chartData.padding.top + chartHeight - ((score - 1) / 4) * chartHeight;
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
                    x={chartData.padding.left - 10}
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
          className={`${styles.details} ${isDragging ? styles.dragging : ''}`}
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
                  <span className={styles.hanja}>{month.ganHan}{month.jiHan}</span>
                  <span className={styles.hangul}>{month.ganZhi}</span>
                </div>

                {/* 별점과 테마 */}
                <div className={styles.scoreRow}>
                  <div className={styles.stars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.star} ${i < stars ? styles.active : ''}`}
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
      <div 
        className={styles.mobileView}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
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
          <div className={styles.monthWheel}>
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
                  className={`${styles.wheelItem} ${idx === activeIndex ? styles.active : ''}`}
                  style={{
                    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    opacity,
                  }}
                  onClick={() => setActiveIndex(idx)}
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
                <span className={styles.mobileGanZhi}>{activeMonth.ganZhi}월</span>
                <h4 className={styles.mobileSummaryTitle}>{getSummaryTitle(activeMonth.score)}</h4>
              </div>
              <p className={styles.mobileDesc}>{activeMonth.analysis.total}</p>
              <div className={styles.mobileMore}>자세히 보기 <span>→</span></div>
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
              <div className={styles.monthSectionLabel}>총평</div>
              <p className={styles.monthSectionText}>{selectedMonth.analysis.total}</p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>💰 재물</div>
              <p className={styles.monthSectionText}>{selectedMonth.analysis.wealth}</p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>💕 애정</div>
              <p className={styles.monthSectionText}>{selectedMonth.analysis.love}</p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>💼 직장</div>
              <p className={styles.monthSectionText}>{selectedMonth.analysis.career}</p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>🏥 건강</div>
              <p className={styles.monthSectionText}>{selectedMonth.analysis.health}</p>
            </div>

            <div className={styles.monthSection}>
              <div className={styles.monthSectionLabel}>💡 조언</div>
              <p className={styles.monthSectionText}>{selectedMonth.analysis.advice}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

