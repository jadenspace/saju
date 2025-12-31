import clsx from "clsx";
import { useState, useMemo, useEffect, useRef } from "react";
import { Solar } from "lunar-javascript";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import {
  DAEUN_EXPLANATION,
  DAEUN_DIRECTION_EXPLANATION,
  SEUN_EXPLANATION,
  WOLUN_EXPLANATION,
  SAJU_PALJA_EXPLANATION,
  SAJU_WONGUK_EXPLANATION,
} from "../../../shared/lib/saju/data/SajuExplanations";
import { SajuData } from "../model/types";
import { SajuCalculator } from "../../../shared/lib/saju/calculators/SajuCalculator";
import { ManseuryeokSection } from "./ManseuryeokSection";
import { IljuAnalysis } from "./IljuAnalysis";
import { OhaengAnalysis } from "./OhaengAnalysis";
import { TwelveStagesAnalysis } from "./TwelveStagesAnalysis";
import { TwelveSinsalAnalysis } from "./TwelveSinsalAnalysis";
import { GongmangAnalysis } from "./GongmangAnalysis";
import { Modal } from "../../../shared/ui/Modal";
import styles from "./SajuCard.module.css";

interface SajuCardProps {
  data: SajuData;
  className?: string;
}

// PillarView is now replaced by ManseuryeokSection for the primary view,
// but we keep it simplified if we want to use it elsewhere.
// For this overhaul, we will focus on the main grid.

export const SajuCard = ({ data, className }: SajuCardProps) => {
  const [showManseuryeok, setShowManseuryeok] = useState(true); // 기본 활성화
  const [showOhaeng, setShowOhaeng] = useState(false);
  const [showIlju, setShowIlju] = useState(false); // 기본 비활성화
  const [showTwelveStages, setShowTwelveStages] = useState(false);
  const [showTwelveSinsal, setShowTwelveSinsal] = useState(false);
  const [showGongmang, setShowGongmang] = useState(false);
  const SWIPER_SLIDES_PER_VIEW = {
    desktop: 4.5,
    mobile: 2.5,
  };

  // 모달 상태 관리
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  } | null>(null);

  // Calculate current age and default Daeun index
  const getCurrentAge = () => {
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() + 1; // Korean age
    return age;
  };

  const defaultDaeunIndex = data.daeun.findIndex(
    (period) =>
      getCurrentAge() >= period.startAge && getCurrentAge() <= period.endAge,
  );

  const [selectedDaeunIndex, setSelectedDaeunIndex] = useState<number | null>(
    defaultDaeunIndex !== -1 ? defaultDaeunIndex : null,
  );

  // 선택된 세운 년도 (기본값: 현재 년도)
  const currentYear = new Date().getFullYear();
  const [selectedSeunYear, setSelectedSeunYear] = useState<number>(currentYear);
  const isInitialMount = useRef(true);
  const prevDaeunIndex = useRef<number | null>(selectedDaeunIndex);

  // 대운이 변경되면 세운을 첫 번째로 초기화 (초기 렌더링 제외)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevDaeunIndex.current = selectedDaeunIndex;
      return;
    }

    // 대운이 실제로 변경되었을 때만 세운을 첫 번째로 초기화
    if (
      selectedDaeunIndex !== null &&
      prevDaeunIndex.current !== selectedDaeunIndex
    ) {
      const firstSeunYear = data.daeun[selectedDaeunIndex].seun[0].year;
      setSelectedSeunYear(firstSeunYear);
      prevDaeunIndex.current = selectedDaeunIndex;
    }
  }, [selectedDaeunIndex, data.daeun]);

  // 초기 렌더링 시 세운의 initialSlide 계산
  const getInitialSeunSlide = () => {
    if (selectedDaeunIndex === null) return 0;
    const seunIndex = data.daeun[selectedDaeunIndex].seun.findIndex(
      (yf) => yf.year === selectedSeunYear,
    );
    return seunIndex !== -1 ? seunIndex : 0;
  };

  // Swiper 인스턴스 ref
  const daeunSwiperRef = useRef<SwiperType | null>(null);
  const seunSwiperRef = useRef<SwiperType | null>(null);
  const seunSwiperReadyRef = useRef(false);

  // 월운 계산
  const monthlyFortune = useMemo(() => {
    return SajuCalculator.calculateMonthlyFortune(
      selectedSeunYear,
      data.day.ganHan,
      data.year.jiHan,
      data.day.jiHan,
    );
  }, [selectedSeunYear, data.day.ganHan, data.year.jiHan, data.day.jiHan]);

  // 툴팁 클릭 시 모달 표시 (모든 디바이스)
  const handleTooltipClick =
    (title: string, content: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setModalContent({ title, content });
    };

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.header}>
        <div
          className={styles.tooltipContainer}
          onClick={handleTooltipClick(
            "사주팔자 (四柱八字)",
            SAJU_PALJA_EXPLANATION,
          )}
        >
          <h2>사주팔자 (四柱八字)</h2>
        </div>
        <p>
          {data.birthDate} {data.birthTime}{" "}
          {data.useTrueSolarTime ? "(-30)" : ""}{" "}
          {data.gender === "male" ? "남" : "여"}{" "}
          {data.solar ? "(양력)" : "(음력)"}
        </p>
      </div>

      {/* Section Title and Analysis Buttons */}
      <div className={styles.sectionHeader}>
        <div className={styles.analysisButtons}>
          <button
            className={clsx(
              styles.analysisButton,
              showManseuryeok && styles.active,
            )}
            onClick={() => {
              if (!showManseuryeok) {
                setShowManseuryeok(true);
                setShowIlju(false);
                setShowOhaeng(false);
                setShowTwelveStages(false);
                setShowTwelveSinsal(false);
                setShowGongmang(false);
              }
            }}
          >
            만세력
          </button>
          <button
            className={clsx(styles.analysisButton, showIlju && styles.active)}
            onClick={() => {
              if (!showIlju) {
                setShowIlju(true);
                setShowManseuryeok(false);
                setShowOhaeng(false);
                setShowTwelveStages(false);
                setShowTwelveSinsal(false);
                setShowGongmang(false);
              }
            }}
          >
            일주 분석
          </button>
          <button
            className={clsx(styles.analysisButton, showOhaeng && styles.active)}
            onClick={() => {
              if (!showOhaeng) {
                setShowOhaeng(true);
                setShowManseuryeok(false);
                setShowIlju(false);
                setShowTwelveStages(false);
                setShowTwelveSinsal(false);
                setShowGongmang(false);
              }
            }}
          >
            오행 분석
          </button>
          <button
            className={clsx(
              styles.analysisButton,
              showTwelveStages && styles.active,
            )}
            onClick={() => {
              if (!showTwelveStages) {
                setShowTwelveStages(true);
                setShowManseuryeok(false);
                setShowIlju(false);
                setShowOhaeng(false);
                setShowTwelveSinsal(false);
                setShowGongmang(false);
              }
            }}
          >
            12운성 분석
          </button>
          <button
            className={clsx(
              styles.analysisButton,
              showTwelveSinsal && styles.active,
            )}
            onClick={() => {
              if (!showTwelveSinsal) {
                setShowTwelveSinsal(true);
                setShowManseuryeok(false);
                setShowIlju(false);
                setShowOhaeng(false);
                setShowTwelveStages(false);
                setShowGongmang(false);
              }
            }}
          >
            12신살 분석
          </button>
          <button
            className={clsx(
              styles.analysisButton,
              showGongmang && styles.active,
            )}
            onClick={() => {
              if (!showGongmang) {
                setShowGongmang(true);
                setShowManseuryeok(false);
                setShowIlju(false);
                setShowOhaeng(false);
                setShowTwelveStages(false);
                setShowTwelveSinsal(false);
              }
            }}
          >
            공망 분석
          </button>
        </div>
      </div>

      {/* Manseuryeok Section (만세력 + 대운 + 세운 + 월운) */}
      {showManseuryeok && (
        <div className={styles.manseuryeokSection}>
          {/* 사주원국 타이틀 */}
          <div className={styles.wongukHeader}>
            <div
              className={styles.tooltipContainer}
              onClick={handleTooltipClick(
                "사주원국 (四柱原局)",
                SAJU_WONGUK_EXPLANATION,
              )}
            >
              <h3>사주원국 (四柱原局)</h3>
            </div>
          </div>
          <ManseuryeokSection data={data} />

          {/* Daeun Section */}
          <div className={styles.daeunSection}>
            <div className={styles.daeunHeader}>
              <div
                className={styles.tooltipContainer}
                onClick={handleTooltipClick("대운 (大運)", DAEUN_EXPLANATION)}
              >
                <h3>대운 (大運)</h3>
              </div>
              <div
                className={styles.tooltipContainer}
                onClick={handleTooltipClick(
                  "대운 정보",
                  `${DAEUN_DIRECTION_EXPLANATION} \n\n * 대운수(${data.daeun[0].startAge}): 10년마다 바뀌는 대운이 시작되는 나이입니다.`,
                )}
              >
                <div className={styles.daeunInfoPill}>
                  <span className={styles.daeunDirectionBadge}>
                    {data.daeunDirection === "forward"
                      ? "순행(順行)"
                      : "역행(逆行)"}
                  </span>
                  <span className={styles.daeunSuBadge}>
                    대운수{" "}
                    <span className={styles.highlight}>
                      {data.daeun[0].startAge}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <Swiper
              modules={[]}
              spaceBetween={16}
              slidesPerView={SWIPER_SLIDES_PER_VIEW.mobile}
              centeredSlides={true}
              centeredSlidesBounds={false}
              centerInsufficientSlides={false}
              speed={300}
              initialSlide={
                selectedDaeunIndex !== null ? selectedDaeunIndex : 0
              }
              breakpoints={{
                640: {
                  slidesPerView: SWIPER_SLIDES_PER_VIEW.desktop,
                },
              }}
              className={styles.daeunSwiper}
              onSwiper={(swiper) => {
                daeunSwiperRef.current = swiper;
              }}
            >
              {data.daeun.map((period, index) => (
                <SwiperSlide key={index} className={styles.daeunSlide}>
                  <div
                    className={clsx(
                      styles.daeunPeriod,
                      selectedDaeunIndex === index && styles.active,
                    )}
                    onClick={() => {
                      const newIndex =
                        selectedDaeunIndex === index ? null : index;
                      setSelectedDaeunIndex(newIndex);
                      // 클릭한 슬라이드를 가운데로 이동
                      if (daeunSwiperRef.current) {
                        daeunSwiperRef.current.slideTo(index, 300);
                      }
                      // 대운 변경 시 세운을 첫 번째로 초기화
                      if (newIndex !== null) {
                        const firstSeunYear = data.daeun[newIndex].seun[0].year;
                        setSelectedSeunYear(firstSeunYear);
                      }
                    }}
                  >
                    <div className={styles.daeunAge}>
                      {period.startAge}-{period.endAge}세
                    </div>
                    <div className={styles.daeunYears}>
                      ({period.seun[0].year} ~ {period.seun[9].year})
                    </div>
                    <div className={styles.daeunGanZhi}>
                      <span className={styles.daeunHan}>
                        <span className={clsx(styles[period.ganElement || ""])}>
                          {period.ganHan}
                        </span>
                        <span className={clsx(styles[period.jiElement || ""])}>
                          {period.jiHan}
                        </span>
                      </span>
                      <span className={styles.daeunKor}>
                        {period.gan}
                        {period.ji}
                      </span>
                    </div>
                    {/* 십신 */}
                    <div className={styles.daeunSipsin}>
                      <span className={styles.sipsinMini}>
                        {period.tenGodsGan}
                      </span>
                      <span className={styles.sipsinMini}>
                        {period.tenGodsJi}
                      </span>
                    </div>
                    {/* 12운성 */}
                    {period.twelveStage && (
                      <div className={styles.daeunTwelveStage}>
                        <span className={styles.twelveStageTag}>
                          {period.twelveStage}
                        </span>
                      </div>
                    )}
                    {/* 12신살 */}
                    {period.sinsal && (
                      <div className={styles.daeunSinsal}>
                        {period.sinsal.yearBased && (
                          <span className={styles.sinsalTag}>
                            {period.sinsal.yearBased}
                          </span>
                        )}
                        {period.sinsal.dayBased &&
                          period.sinsal.dayBased !==
                            period.sinsal.yearBased && (
                            <span className={styles.sinsalTag}>
                              {period.sinsal.dayBased}
                            </span>
                          )}
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Seun Section */}
            {selectedDaeunIndex !== null && (
              <div className={styles.seunSection}>
                <div className={styles.seunHeader}>
                  <div
                    className={styles.tooltipContainer}
                    onClick={handleTooltipClick(
                      "세운 (歲運)",
                      SEUN_EXPLANATION,
                    )}
                  >
                    <h3>세운 (歲運)</h3>
                  </div>
                  <div className={styles.seunInfoPill}>
                    <span className={styles.seunAgeRange}>
                      {data.daeun[selectedDaeunIndex].startAge}세 ~{" "}
                      {data.daeun[selectedDaeunIndex].endAge}세
                    </span>
                  </div>
                </div>
                <Swiper
                  key={`seun-${selectedDaeunIndex}-${isInitialMount.current ? selectedSeunYear : "reset"}`}
                  modules={[]}
                  spaceBetween={12}
                  slidesPerView={SWIPER_SLIDES_PER_VIEW.mobile}
                  centeredSlides={true}
                  centeredSlidesBounds={false}
                  centerInsufficientSlides={false}
                  speed={300}
                  initialSlide={getInitialSeunSlide()}
                  breakpoints={{
                    640: {
                      slidesPerView: SWIPER_SLIDES_PER_VIEW.desktop,
                    },
                  }}
                  className={styles.seunSwiper}
                  onSwiper={(swiper) => {
                    seunSwiperRef.current = swiper;
                    seunSwiperReadyRef.current = false;
                  }}
                  onAfterInit={(swiper) => {
                    seunSwiperReadyRef.current = true;
                    // 초기화 후 현재 선택된 년도로 이동 (애니메이션 없이)
                    const initialIndex = getInitialSeunSlide();
                    if (swiper.activeIndex !== initialIndex) {
                      swiper.slideTo(initialIndex, 0);
                    }
                  }}
                >
                  {data.daeun[selectedDaeunIndex].seun.map(
                    (yearFortune, idx) => {
                      const isSelected = yearFortune.year === selectedSeunYear;
                      const birthYear = new Date(data.birthDate).getFullYear();
                      const age = yearFortune.year - birthYear + 1; // Korean age

                      return (
                        <SwiperSlide key={idx} className={styles.seunSlide}>
                          <div
                            className={clsx(
                              styles.seunItem,
                              isSelected && styles.active,
                            )}
                            onClick={() => {
                              setSelectedSeunYear(yearFortune.year);
                              // 클릭한 슬라이드를 가운데로 이동
                              if (seunSwiperRef.current) {
                                const currentIndex =
                                  seunSwiperRef.current.activeIndex;
                                // 현재 슬라이드와 다른 경우에만 애니메이션 실행
                                if (currentIndex !== idx) {
                                  // Swiper가 완전히 초기화된 후에만 애니메이션 실행
                                  if (seunSwiperReadyRef.current) {
                                    seunSwiperRef.current.slideTo(idx, 300);
                                  } else {
                                    // 아직 초기화 중이면 약간의 지연 후 실행
                                    setTimeout(() => {
                                      if (seunSwiperRef.current) {
                                        seunSwiperRef.current.slideTo(idx, 300);
                                      }
                                    }, 100);
                                  }
                                }
                              }
                            }}
                          >
                            <div className={styles.seunAge}>{age}세</div>
                            <div className={styles.seunYear}>
                              {yearFortune.year}년
                            </div>
                            <div className={styles.seunGanZhi}>
                              <span className={styles.seunHan}>
                                <span
                                  className={clsx(
                                    styles[yearFortune.ganElement || ""],
                                  )}
                                >
                                  {yearFortune.ganHan}
                                </span>
                                <span
                                  className={clsx(
                                    styles[yearFortune.jiElement || ""],
                                  )}
                                >
                                  {yearFortune.jiHan}
                                </span>
                              </span>
                              <span className={styles.seunKor}>
                                {yearFortune.gan}
                                {yearFortune.ji}
                              </span>
                            </div>
                            <div className={styles.seunSipsin}>
                              <span className={styles.sipsinMini}>
                                {yearFortune.tenGodsGan}
                              </span>
                              <span className={styles.sipsinMini}>
                                {yearFortune.tenGodsJi}
                              </span>
                            </div>
                            {/* 12운성 */}
                            {yearFortune.twelveStage && (
                              <div className={styles.seunTwelveStage}>
                                <span className={styles.twelveStageTagSmall}>
                                  {yearFortune.twelveStage}
                                </span>
                              </div>
                            )}
                            {/* 12신살 */}
                            {yearFortune.sinsal && (
                              <div className={styles.seunSinsal}>
                                {yearFortune.sinsal.yearBased && (
                                  <span className={styles.sinsalTagSmall}>
                                    {yearFortune.sinsal.yearBased}
                                  </span>
                                )}
                                {yearFortune.sinsal.dayBased &&
                                  yearFortune.sinsal.dayBased !==
                                    yearFortune.sinsal.yearBased && (
                                    <span className={styles.sinsalTagSmall}>
                                      {yearFortune.sinsal.dayBased}
                                    </span>
                                  )}
                              </div>
                            )}
                          </div>
                        </SwiperSlide>
                      );
                    },
                  )}
                </Swiper>
              </div>
            )}

            {/* Wolun (Monthly Fortune) Section */}
            {selectedDaeunIndex !== null && (
              <div className={styles.wolunSection}>
                <div className={styles.wolunHeader}>
                  <div
                    className={styles.tooltipContainer}
                    onClick={handleTooltipClick(
                      "월운 (月運)",
                      WOLUN_EXPLANATION,
                    )}
                  >
                    <h3>월운 (月運)</h3>
                  </div>
                  <div className={styles.wolunInfoPill}>
                    <span className={styles.wolunYear}>
                      {selectedSeunYear}년
                    </span>
                  </div>
                </div>
                <Swiper
                  key={`wolun-${selectedSeunYear}`}
                  modules={[]}
                  spaceBetween={8}
                  slidesPerView={SWIPER_SLIDES_PER_VIEW.mobile}
                  centeredSlides={false}
                  initialSlide={(() => {
                    const currentJieqiJiHan = (() => {
                      const now = new Date();
                      const solar = Solar.fromYmdHms(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        now.getDate(),
                        12,
                        0,
                        0,
                      );
                      const lunar = solar.getLunar();
                      return lunar.getMonthInGanZhiExact().charAt(1);
                    })();
                    const currentMonthIndex = monthlyFortune.findIndex(
                      (mf) =>
                        selectedSeunYear === currentYear &&
                        mf.jiHan === currentJieqiJiHan,
                    );
                    return currentMonthIndex !== -1 ? currentMonthIndex : 0;
                  })()}
                  breakpoints={{
                    640: {
                      slidesPerView: SWIPER_SLIDES_PER_VIEW.desktop,
                    },
                  }}
                  className={styles.wolunSwiper}
                >
                  {/* 양력 순서로 표시 (만세력과 동일) */}
                  {monthlyFortune.map((monthFortune) => {
                    // 양력 월을 그대로 표시
                    const displayMonth = monthFortune.month;
                    // 현재 절기 월과 비교하여 활성화 여부 결정
                    const currentJieqiJiHan = (() => {
                      const now = new Date();
                      const solar = Solar.fromYmdHms(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        now.getDate(),
                        12,
                        0,
                        0,
                      );
                      const lunar = solar.getLunar();
                      return lunar.getMonthInGanZhiExact().charAt(1);
                    })();
                    const isCurrentMonth =
                      selectedSeunYear === currentYear &&
                      monthFortune.jiHan === currentJieqiJiHan;

                    return (
                      <SwiperSlide
                        key={monthFortune.month}
                        className={styles.wolunSlide}
                      >
                        <div
                          className={clsx(
                            styles.wolunItem,
                            isCurrentMonth && styles.active,
                          )}
                        >
                          <div className={styles.wolunMonth}>
                            {displayMonth}월
                          </div>
                          <div className={styles.wolunSolar}>
                            {monthFortune.monthName}
                          </div>
                          <div className={styles.wolunGanZhi}>
                            <span className={styles.wolunHan}>
                              <span
                                className={clsx(
                                  styles[monthFortune.ganElement || ""],
                                )}
                              >
                                {monthFortune.ganHan}
                              </span>
                              <span
                                className={clsx(
                                  styles[monthFortune.jiElement || ""],
                                )}
                              >
                                {monthFortune.jiHan}
                              </span>
                            </span>
                            <span className={styles.wolunKor}>
                              {monthFortune.gan}
                              {monthFortune.ji}
                            </span>
                          </div>
                          <div className={styles.wolunSipsin}>
                            <span className={styles.sipsinMini}>
                              {monthFortune.tenGodsGan}
                            </span>
                            <span className={styles.sipsinMini}>
                              {monthFortune.tenGodsJi}
                            </span>
                          </div>
                          {/* 12운성 */}
                          {monthFortune.twelveStage && (
                            <div className={styles.wolunTwelveStage}>
                              <span className={styles.twelveStageTagSmall}>
                                {monthFortune.twelveStage}
                              </span>
                            </div>
                          )}
                          {/* 12신살 */}
                          {monthFortune.sinsal && (
                            <div className={styles.wolunSinsal}>
                              {monthFortune.sinsal.yearBased && (
                                <span className={styles.sinsalTagSmall}>
                                  {monthFortune.sinsal.yearBased}
                                </span>
                              )}
                              {monthFortune.sinsal.dayBased &&
                                monthFortune.sinsal.dayBased !==
                                  monthFortune.sinsal.yearBased && (
                                  <span className={styles.sinsalTagSmall}>
                                    {monthFortune.sinsal.dayBased}
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Sections */}
      {showOhaeng && <OhaengAnalysis data={data} />}
      {showIlju && <IljuAnalysis data={data} />}
      {showTwelveStages && <TwelveStagesAnalysis data={data} />}
      {showTwelveSinsal && <TwelveSinsalAnalysis data={data} />}
      {showGongmang && <GongmangAnalysis data={data} />}

      {/* 모달 */}
      {modalContent && (
        <Modal
          isOpen={!!modalContent}
          onClose={() => setModalContent(null)}
          title={modalContent.title}
        >
          <div className={styles.modalContent}>
            {modalContent.content.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};
