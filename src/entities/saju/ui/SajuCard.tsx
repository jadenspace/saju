import clsx from 'clsx';
import { useState, useMemo } from 'react';
import { Solar } from 'lunar-javascript';
import { DAEUN_EXPLANATION, DAEUN_DIRECTION_EXPLANATION, SAJU_PALJA_EXPLANATION } from '../../../shared/lib/saju/data/SajuExplanations';
import { SajuData } from '../model/types';
import { SajuCalculator } from '../../../shared/lib/saju/calculators/SajuCalculator';
import { ManseuryeokSection } from './ManseuryeokSection';
import { IljuAnalysis } from './IljuAnalysis';
import { OhaengAnalysis } from './OhaengAnalysis';
import { TwelveStagesAnalysis } from './TwelveStagesAnalysis';
import { TwelveSinsalAnalysis } from './TwelveSinsalAnalysis';
import { GongmangAnalysis } from './GongmangAnalysis';
import styles from './SajuCard.module.css';

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

  // Calculate current age and default Daeun index
  const getCurrentAge = () => {
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() + 1; // Korean age
    return age;
  };

  const defaultDaeunIndex = data.daeun.findIndex(
    period => getCurrentAge() >= period.startAge && getCurrentAge() <= period.endAge
  );

  const [selectedDaeunIndex, setSelectedDaeunIndex] = useState<number | null>(
    defaultDaeunIndex !== -1 ? defaultDaeunIndex : null
  );

  // 선택된 세운 년도 (기본값: 현재 년도)
  const currentYear = new Date().getFullYear();
  const [selectedSeunYear, setSelectedSeunYear] = useState<number>(currentYear);

  // 월운 계산
  const monthlyFortune = useMemo(() => {
    return SajuCalculator.calculateMonthlyFortune(selectedSeunYear, data.day.ganHan, data.year.jiHan, data.day.jiHan);
  }, [selectedSeunYear, data.day.ganHan, data.year.jiHan, data.day.jiHan]);

  return (
    <div className={clsx(styles.card, className)}>
      <div className={styles.header}>
        <div className={styles.tooltipContainer}>
          <h2>사주팔자 (四柱八字)</h2>
          <div className={styles.tooltip}>
            {SAJU_PALJA_EXPLANATION.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
        <p>
          {data.birthDate} {data.birthTime} {data.useTrueSolarTime ? '(-30)' : ''} {data.gender === 'male' ? '남' : '여'} {data.solar ? '(양력)' : '(음력)'}
        </p>
      </div>

      {/* Section Title and Analysis Buttons */}
      <div className={styles.sectionHeader}>
        <div className={styles.analysisButtons}>
          <button
            className={clsx(styles.analysisButton, showManseuryeok && styles.active)}
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
            className={clsx(styles.analysisButton, showTwelveStages && styles.active)}
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
            className={clsx(styles.analysisButton, showTwelveSinsal && styles.active)}
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
            className={clsx(styles.analysisButton, showGongmang && styles.active)}
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
            <h3>사주원국 (四柱原局)</h3>
          </div>
          <ManseuryeokSection data={data} />

          {/* Daeun Section */}
          <div className={styles.daeunSection}>
        <div className={styles.daeunHeader}>
          <div className={styles.tooltipContainer}>
            <h3>대운 (大運)</h3>
            <div className={styles.tooltip}>
              {DAEUN_EXPLANATION.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.tooltipContainer}>
            <div className={styles.daeunInfoPill}>
              <span className={styles.daeunDirectionBadge}>
                {data.daeunDirection === 'forward' ? '순행(順行)' : '역행(逆行)'}
              </span>
              <span className={styles.daeunSuBadge}>
                대운수 <span className={styles.highlight}>{data.daeun[0].startAge}</span>
              </span>
            </div>
            <div className={styles.tooltip}>
              <div className={styles.tooltipTitle}>대운 정보</div>
              {`${DAEUN_DIRECTION_EXPLANATION} \n\n * 대운수(${data.daeun[0].startAge}): 10년마다 바뀌는 대운이 시작되는 나이입니다.`.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.daeunContainer}>
          {data.daeun.map((period, index) => (
            <div
              key={index}
              className={clsx(styles.daeunPeriod, selectedDaeunIndex === index && styles.active)}
              onClick={() => setSelectedDaeunIndex(selectedDaeunIndex === index ? null : index)}
            >
              <div className={styles.daeunAge}>{period.startAge}-{period.endAge}세</div>
              <div className={styles.daeunYears}>({period.seun[0].year} ~ {period.seun[9].year})</div>
              <div className={styles.daeunGanZhi}>
                <span className={styles.daeunHan}>
                  <span className={clsx(styles[period.ganElement || ''])}>{period.ganHan}</span>
                  <span className={clsx(styles[period.jiElement || ''])}>{period.jiHan}</span>
                </span>
                <span className={styles.daeunKor}>{period.gan}{period.ji}</span>
              </div>
              {/* 십신 */}
              <div className={styles.daeunSipsin}>
                <span className={styles.sipsinMini}>{period.tenGodsGan}</span>
                <span className={styles.sipsinMini}>{period.tenGodsJi}</span>
              </div>
              {/* 12운성 */}
              {period.twelveStage && (
                <div className={styles.daeunTwelveStage}>
                  <span className={styles.twelveStageTag}>{period.twelveStage}</span>
                </div>
              )}
              {/* 12신살 */}
              {period.sinsal && (
                <div className={styles.daeunSinsal}>
                  {period.sinsal.yearBased && <span className={styles.sinsalTag}>{period.sinsal.yearBased}</span>}
                  {period.sinsal.dayBased && period.sinsal.dayBased !== period.sinsal.yearBased && (
                    <span className={styles.sinsalTag}>{period.sinsal.dayBased}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Seun Section */}
        {selectedDaeunIndex !== null && (
          <div className={styles.seunSection}>
            <div className={styles.seunHeader}>
              <h4>세운 (歲運) - {data.daeun[selectedDaeunIndex].startAge}세 ~ {data.daeun[selectedDaeunIndex].endAge}세</h4>
            </div>
            <div className={styles.seunGrid}>
              {data.daeun[selectedDaeunIndex].seun.map((yearFortune, idx) => {
                const isSelected = yearFortune.year === selectedSeunYear;
                const birthYear = new Date(data.birthDate).getFullYear();
                const age = yearFortune.year - birthYear + 1; // Korean age

                return (
                  <div
                    key={idx}
                    className={clsx(styles.seunItem, isSelected && styles.active)}
                    onClick={() => setSelectedSeunYear(yearFortune.year)}
                  >
                    <div className={styles.seunAge}>{age}세</div>
                    <div className={styles.seunYear}>{yearFortune.year}년</div>
                    <div className={styles.seunGanZhi}>
                      <span className={styles.seunHan}>
                        <span className={clsx(styles[yearFortune.ganElement || ''])}>{yearFortune.ganHan}</span>
                        <span className={clsx(styles[yearFortune.jiElement || ''])}>{yearFortune.jiHan}</span>
                      </span>
                      <span className={styles.seunKor}>{yearFortune.gan}{yearFortune.ji}</span>
                    </div>
                    <div className={styles.seunSipsin}>
                      <span className={styles.sipsinMini}>{yearFortune.tenGodsGan}</span>
                      <span className={styles.sipsinMini}>{yearFortune.tenGodsJi}</span>
                    </div>
                    {/* 12운성 */}
                    {yearFortune.twelveStage && (
                      <div className={styles.seunTwelveStage}>
                        <span className={styles.twelveStageTagSmall}>{yearFortune.twelveStage}</span>
                      </div>
                    )}
                    {/* 12신살 */}
                    {yearFortune.sinsal && (
                      <div className={styles.seunSinsal}>
                        {yearFortune.sinsal.yearBased && <span className={styles.sinsalTagSmall}>{yearFortune.sinsal.yearBased}</span>}
                        {yearFortune.sinsal.dayBased && yearFortune.sinsal.dayBased !== yearFortune.sinsal.yearBased && (
                          <span className={styles.sinsalTagSmall}>{yearFortune.sinsal.dayBased}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wolun (Monthly Fortune) Section */}
        {selectedDaeunIndex !== null && (
          <div className={styles.wolunSection}>
            <div className={styles.wolunHeader}>
              <h4>월운 (月運) - {selectedSeunYear}년</h4>
            </div>
            <div className={styles.wolunGrid}>
              {/* 양력 순서로 표시 (만세력과 동일) */}
              {monthlyFortune.map((monthFortune) => {
                // 양력 월을 그대로 표시
                const displayMonth = monthFortune.month;
                // 현재 절기 월과 비교하여 활성화 여부 결정
                const currentJieqiJiHan = (() => {
                  const now = new Date();
                  const solar = Solar.fromYmdHms(now.getFullYear(), now.getMonth() + 1, now.getDate(), 12, 0, 0);
                  const lunar = solar.getLunar();
                  return lunar.getMonthInGanZhiExact().charAt(1);
                })();
                const isCurrentMonth = selectedSeunYear === currentYear && 
                  monthFortune.jiHan === currentJieqiJiHan;

                return (
                  <div
                    key={monthFortune.month}
                    className={clsx(styles.wolunItem, isCurrentMonth && styles.active)}
                  >
                    <div className={styles.wolunMonth}>{displayMonth}월</div>
                    <div className={styles.wolunSolar}>{monthFortune.monthName}</div>
                    <div className={styles.wolunGanZhi}>
                      <span className={styles.wolunHan}>
                        <span className={clsx(styles[monthFortune.ganElement || ''])}>{monthFortune.ganHan}</span>
                        <span className={clsx(styles[monthFortune.jiElement || ''])}>{monthFortune.jiHan}</span>
                      </span>
                      <span className={styles.wolunKor}>{monthFortune.gan}{monthFortune.ji}</span>
                    </div>
                    <div className={styles.wolunSipsin}>
                      <span className={styles.sipsinMini}>{monthFortune.tenGodsGan}</span>
                      <span className={styles.sipsinMini}>{monthFortune.tenGodsJi}</span>
                    </div>
                    {/* 12운성 */}
                    {monthFortune.twelveStage && (
                      <div className={styles.wolunTwelveStage}>
                        <span className={styles.twelveStageTagSmall}>{monthFortune.twelveStage}</span>
                      </div>
                    )}
                    {/* 12신살 */}
                    {monthFortune.sinsal && (
                      <div className={styles.wolunSinsal}>
                        {monthFortune.sinsal.yearBased && <span className={styles.sinsalTagSmall}>{monthFortune.sinsal.yearBased}</span>}
                        {monthFortune.sinsal.dayBased && monthFortune.sinsal.dayBased !== monthFortune.sinsal.yearBased && (
                          <span className={styles.sinsalTagSmall}>{monthFortune.sinsal.dayBased}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      </div>)}

      {/* Analysis Sections */}
      {showOhaeng && <OhaengAnalysis data={data} />}
      {showIlju && <IljuAnalysis data={data} />}
      {showTwelveStages && <TwelveStagesAnalysis data={data} />}
      {showTwelveSinsal && <TwelveSinsalAnalysis data={data} />}
      {showGongmang && <GongmangAnalysis data={data} />}
    </div>
  );
};
