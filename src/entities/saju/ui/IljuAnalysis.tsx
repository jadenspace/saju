import { getIljuAnalysis } from '../../../shared/lib/saju/data/IljuData';
import { SajuData } from '../model/types';
import styles from './IljuAnalysis.module.css';

interface IljuAnalysisProps {
  data: SajuData;
}

export const IljuAnalysis = ({ data }: IljuAnalysisProps) => {
  const iljuHan = data.day.ganHan + data.day.jiHan;
  const iljuKor = data.day.gan + data.day.ji;
  const analysis = getIljuAnalysis(iljuHan, data.gender);

  if (!analysis) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <h3>{iljuKor}({iljuHan})일주 분석</h3>
          <p>해당 일주의 상세 분석 데이터를 준비 중입니다.</p>
          <p className={styles.hint}>주요 일주 데이터부터 순차적으로 추가될 예정입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {iljuKor}({iljuHan})일주 {data.gender === 'male' ? '남자' : '여자'}
        </h3>
        <p className={styles.summary}>{analysis.summary}</p>
      </div>

      <div className={styles.content}>
        {/* Personality */}
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>성격 특징</h4>
          <ul className={styles.list}>
            {analysis.personality.map((trait, index) => (
              <li key={index}>{trait}</li>
            ))}
          </ul>
        </section>

        {/* Strengths & Weaknesses */}
        <div className={styles.grid}>
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>장점</h4>
            <ul className={styles.list}>
              {analysis.strengths.map((strength, index) => (
                <li key={index} className={styles.positive}>{strength}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>주의사항</h4>
            <ul className={styles.list}>
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className={styles.negative}>{weakness}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Career */}
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>적합한 직업</h4>
          <p className={styles.text}>{analysis.career}</p>
        </section>

        {/* Wealth */}
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>재물운</h4>
          <p className={styles.text}>{analysis.wealth}</p>
        </section>

        {/* Relationships */}
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>대인관계 & 결혼</h4>
          <p className={styles.text}>{analysis.relationships}</p>
        </section>
      </div>
    </div>
  );
};
