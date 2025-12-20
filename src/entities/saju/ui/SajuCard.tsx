import clsx from 'clsx';
import { useState } from 'react';
import { DAEUN_EXPLANATION, DAEUN_DIRECTION_EXPLANATION, SAJU_PALJA_EXPLANATION } from '../../../shared/lib/saju/data/SajuExplanations';
import { Pillar, SajuData } from '../model/types';
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
  const [showOhaeng, setShowOhaeng] = useState(false);
  const [showIlju, setShowIlju] = useState(false);
  const [showTwelveStages, setShowTwelveStages] = useState(false);
  const [showTwelveSinsal, setShowTwelveSinsal] = useState(false);
  const [showGongmang, setShowGongmang] = useState(false);

  // Calculate current age and default Daeun index
  const getCurrentAge = () => {
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear() + 1; // Korean age
    return age;
  };

  const defaultDaeunIndex = data.daeun.findIndex(
    period => getCurrentAge() >= period.startAge && getCurrentAge() <= period.endAge
  );

  const [selectedDaeunIndex, setSelectedDaeunIndex] = useState<number | null>(
    defaultDaeunIndex !== -1 ? defaultDaeunIndex : null
  );

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
          {data.birthDate} {data.birthTime} {data.useTrueSolarTime ? '(-30)' : ''} {data.gender === 'male' ? '남' : '여'}
        </p>
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
                const isCurrentYear = yearFortune.year === new Date().getFullYear();
                const birthYear = new Date(data.birthDate).getFullYear();
                const age = yearFortune.year - birthYear + 1; // Korean age

                return (
                  <div key={idx} className={clsx(styles.seunItem, isCurrentYear && styles.active)}>
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
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Buttons */}
      <div className={styles.analysisButtons}>
        <button
          className={clsx(styles.analysisButton, showIlju && styles.active)}
          onClick={() => { setShowIlju(!showIlju); setShowOhaeng(false); setShowTwelveStages(false); setShowTwelveSinsal(false); setShowGongmang(false); }}
        >
          일주 분석
        </button>
        <button
          className={clsx(styles.analysisButton, showOhaeng && styles.active)}
          onClick={() => { setShowOhaeng(!showOhaeng); setShowIlju(false); setShowTwelveStages(false); setShowTwelveSinsal(false); setShowGongmang(false); }}
        >
          오행 분석
        </button>
        <button
          className={clsx(styles.analysisButton, showTwelveStages && styles.active)}
          onClick={() => { setShowTwelveStages(!showTwelveStages); setShowIlju(false); setShowOhaeng(false); setShowTwelveSinsal(false); setShowGongmang(false); }}
        >
          12운성
        </button>
        <button
          className={clsx(styles.analysisButton, showTwelveSinsal && styles.active)}
          onClick={() => { setShowTwelveSinsal(!showTwelveSinsal); setShowIlju(false); setShowOhaeng(false); setShowTwelveStages(false); setShowGongmang(false); }}
        >
          12신살
        </button>
        <button
          className={clsx(styles.analysisButton, showGongmang && styles.active)}
          onClick={() => { setShowGongmang(!showGongmang); setShowIlju(false); setShowOhaeng(false); setShowTwelveStages(false); setShowTwelveSinsal(false); }}
        >
          공망
        </button>
      </div>

      {/* Analysis Sections */}
      {showOhaeng && <OhaengAnalysis data={data} />}
      {showIlju && <IljuAnalysis data={data} />}
      {showTwelveStages && <TwelveStagesAnalysis data={data} />}
      {showTwelveSinsal && <TwelveSinsalAnalysis data={data} />}
      {showGongmang && <GongmangAnalysis data={data} />}
    </div>
  );
};
