import clsx from 'clsx';
import { useState } from 'react';
import { CHEONGAN_EXPLANATIONS, JIJI_EXPLANATIONS, SIPSIN_EXPLANATIONS, PILLAR_EXPLANATIONS, DAEUN_EXPLANATION, DAEUN_DIRECTION_EXPLANATION, SAJU_PALJA_EXPLANATION } from '../../../shared/lib/saju/data/SajuExplanations';
import { Pillar, SajuData } from '../model/types';
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

const PillarView = ({ pillar, label }: { pillar: Pillar; label: string }) => {
  // Check if pillar has meaningful values (not just placeholder "?")
  const hasValue = pillar.ganHan !== '?' && pillar.jiHan !== '?';

  return (
    <div className={styles.pillar}>
      <div className={styles.tooltipContainer}>
        <div className={styles.label}>{label}</div>
        <div className={styles.tooltip}>
          {(PILLAR_EXPLANATIONS[label] || '').split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.characterBox}>
        {/* Always render sipsin area for consistent spacing */}
        {pillar.tenGodsGan && (
          <div className={styles.tooltipContainer}>
            <div className={styles.sipsin}>
              {pillar.tenGodsGan}
            </div>
            <div className={styles.tooltip}>
              {`${pillar.tenGodsGan} - ${SIPSIN_EXPLANATIONS[pillar.tenGodsGan] || ''}`.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        )}
        {!pillar.tenGodsGan && (
          <div className={styles.sipsin}></div>
        )}
        <div className={hasValue ? styles.tooltipContainer : ''}>
          <div className={clsx(styles.characterContainer, styles[pillar.ganElement || 'unknown'])}>
            <div className={styles.character}>{pillar.ganHan}</div>
          </div>
          {hasValue && <div className={styles.tooltip}>{CHEONGAN_EXPLANATIONS[pillar.ganHan] || ''}</div>}
        </div>
        <div className={styles.korean}>{pillar.gan}</div>
      </div>
      <div className={styles.characterBox}>
        {/* Always render sipsin area for consistent spacing */}
        {pillar.tenGodsJi && (
          <div className={styles.tooltipContainer}>
            <div className={styles.sipsin}>
              {pillar.tenGodsJi}
            </div>
            <div className={styles.tooltip}>
              {`${pillar.tenGodsJi} - ${SIPSIN_EXPLANATIONS[pillar.tenGodsJi] || ''}`.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        )}
        {!pillar.tenGodsJi && (
          <div className={styles.sipsin}></div>
        )}
        <div className={hasValue ? styles.tooltipContainer : ''}>
          <div className={clsx(styles.characterContainer, styles[pillar.jiElement || 'unknown'])}>
            <div className={styles.character}>{pillar.jiHan}</div>
          </div>
          {hasValue && <div className={styles.tooltip}>{JIJI_EXPLANATIONS[pillar.jiHan] || ''}</div>}
        </div>
        <div className={styles.korean}>{pillar.ji}</div>
        {pillar.jijanggan && pillar.jijanggan.length > 0 && (
          <div className={styles.jijanggan}>
            {pillar.jijanggan.map((char, i) => (
              <div key={i} className={styles.tooltipContainer}>
                <span className={styles.jijangganChar}>{char}</span>
                <div className={styles.tooltip}>
                  {(pillar.jijangganTenGods?.[i] && SIPSIN_EXPLANATIONS[pillar.jijangganTenGods[i]]
                    ? `${pillar.jijangganTenGods[i]} - ${SIPSIN_EXPLANATIONS[pillar.jijangganTenGods[i]]}`
                    : pillar.jijangganTenGods?.[i] || '').split('\n').map((line, j, arr) => (
                      <span key={j}>
                        {line}
                        {j < arr.length - 1 && <br />}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const SajuCard = ({ data, className }: SajuCardProps) => {
  const [showOhaeng, setShowOhaeng] = useState(false);
  const [showIlju, setShowIlju] = useState(false);

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
      <div className={styles.pillarsContainer}>
        <PillarView pillar={data.hour} label="시주" />
        <PillarView pillar={data.day} label="일주" />
        <PillarView pillar={data.month} label="월주" />
        <PillarView pillar={data.year} label="년주" />
      </div>

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
            <span className={styles.daeunDirection}>
              {data.daeunDirection === 'forward' ? '순행 ▶' : '역행 ◀'}
            </span>
            <div className={styles.tooltip}>
              {DAEUN_DIRECTION_EXPLANATION.split('\n').map((line, i, arr) => (
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
          onClick={() => {
            setShowIlju(!showIlju);
            setShowOhaeng(false);
          }}
        >
          일주 분석
        </button>
        <button
          className={clsx(styles.analysisButton, showOhaeng && styles.active)}
          onClick={() => {
            setShowOhaeng(!showOhaeng);
            setShowIlju(false);
          }}
        >
          오행 분석
        </button>
      </div>

      {/* Analysis Sections */}
      {showOhaeng && <OhaengAnalysis data={data} />}
      {showIlju && <IljuAnalysis data={data} />}

      {/* 추가 분석 섹션 - 토정비결 전용 */}
      <TwelveStagesAnalysis data={data} />
      <TwelveSinsalAnalysis data={data} />
      <GongmangAnalysis data={data} />
    </div>
  );
};
