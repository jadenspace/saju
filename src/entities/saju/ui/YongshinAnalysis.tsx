import clsx from 'clsx';
import { SajuData } from '../model/types';
import { OHAENG_COLORS } from '../../../shared/lib/saju/data/OhaengColors';
import styles from './YongshinAnalysis.module.css';

interface YongshinAnalysisProps {
  data: SajuData;
}

const ELEMENT_INFO = {
  '목(木)': { name: '목', hanja: '木', color: '#4ade80' },
  '화(火)': { name: '화', hanja: '火', color: '#f87171' },
  '토(土)': { name: '토', hanja: '土', color: '#fbbf24' },
  '금(金)': { name: '금', hanja: '金', color: '#94a3b8' },
  '수(水)': { name: '수', hanja: '水', color: '#374151' },
};

const TYPE_EXPLANATION: Record<string, string> = {
  '억부': '억부용신은 일간의 강약을 조절하여 균형을 맞추는 용신입니다. 신강(身強)일 때는 억제하고, 신약(身弱)일 때는 부조하는 역할을 합니다.',
  '조후': '조후용신은 계절의 기후에 따라 필요한 오행을 선정한 용신입니다. 계절의 특성에 맞춰 사주를 조화롭게 만드는 역할을 합니다.',
  '통관': '통관용신은 관성(官星)을 통하게 하는 용신입니다.',
};

export const YongshinAnalysis = ({ data }: YongshinAnalysisProps) => {
  const { yongshin } = data;

  if (!yongshin) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <h3>용신 분석</h3>
          <p>용신 정보를 계산할 수 없습니다.</p>
          <p className={styles.hint}>일간 강약 분석이 필요합니다.</p>
        </div>
      </div>
    );
  }

  const primaryInfo = ELEMENT_INFO[yongshin.primary as keyof typeof ELEMENT_INFO];
  const secondaryInfo = yongshin.secondary 
    ? ELEMENT_INFO[yongshin.secondary as keyof typeof ELEMENT_INFO]
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>용신 분석 (用神分析)</h3>
        <p className={styles.summary}>
          용신은 사주에서 가장 중요한 오행으로, 일간의 균형을 맞추고 운세를 개선하는 데 핵심적인 역할을 합니다.
        </p>
      </div>

      <div className={styles.content}>
        {/* Primary Yongshin */}
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>주 용신 (主用神)</h4>
          <div className={styles.yongshinCard}>
            <div className={clsx(styles.elementBadge, styles[getElementKey(yongshin.primary)])}>
              {primaryInfo.hanja}
            </div>
            <div className={styles.yongshinInfo}>
              <div className={styles.yongshinName}>{yongshin.primary}</div>
              <div className={styles.yongshinType}>
                <span className={styles.typeBadge}>{yongshin.type}용신</span>
              </div>
            </div>
          </div>
          <p className={styles.typeExplanation}>{TYPE_EXPLANATION[yongshin.type] || ''}</p>
          {/* Color Info */}
          <div className={styles.colorInfo}>
            <div className={styles.colorSection}>
              <span className={styles.colorLabel}>오방색:</span>
              <span className={styles.obangColor}>{OHAENG_COLORS[yongshin.primary]?.obangColor || ''}</span>
            </div>
            <div className={styles.colorSection}>
              <span className={styles.colorLabel}>실사용 색감:</span>
              <div className={styles.colorTags}>
                {OHAENG_COLORS[yongshin.primary]?.practicalColors.map((color, index) => (
                  <span key={index} className={styles.colorTag}>
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Yongshin */}
        {yongshin.secondary && secondaryInfo && (
          <section className={styles.section}>
            <h4 className={styles.sectionTitle}>보조 용신 (輔助用神)</h4>
            <div className={styles.yongshinCard}>
              <div className={clsx(styles.elementBadge, styles[getElementKey(yongshin.secondary)])}>
                {secondaryInfo.hanja}
              </div>
              <div className={styles.yongshinInfo}>
                <div className={styles.yongshinName}>{yongshin.secondary}</div>
                <p className={styles.secondaryDescription}>
                  주 용신을 보조하여 사주의 균형을 더욱 돕는 역할을 합니다.
                </p>
              </div>
            </div>
            {/* Secondary Color Info */}
            <div className={styles.colorInfo}>
              <div className={styles.colorSection}>
                <span className={styles.colorLabel}>오방색:</span>
                <span className={styles.obangColor}>{OHAENG_COLORS[yongshin.secondary]?.obangColor || ''}</span>
              </div>
              <div className={styles.colorSection}>
                <span className={styles.colorLabel}>실사용 색감:</span>
                <div className={styles.colorTags}>
                  {OHAENG_COLORS[yongshin.secondary]?.practicalColors.map((color, index) => (
                    <span key={index} className={styles.colorTag}>
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Heeshin & Gishin */}
        <div className={styles.grid}>
          {/* Heeshin */}
          {yongshin.heeshin && yongshin.heeshin.length > 0 && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>희신 (喜神)</h4>
              <p className={styles.description}>
                용신을 돕고 생조(生助)하는 오행으로, 용신의 힘을 강화시킵니다.
              </p>
              <div className={styles.elementList}>
                {yongshin.heeshin.map((element, index) => {
                  const info = ELEMENT_INFO[element as keyof typeof ELEMENT_INFO];
                  return (
                    <div key={index} className={clsx(styles.elementTag, styles.positive)}>
                      <span className={clsx(styles.elementIcon, styles[getElementKey(element)])}>
                        {info.hanja}
                      </span>
                      <span>{element}</span>
                    </div>
                  );
                })}
              </div>
              {/* Heeshin Colors */}
              <div className={styles.colorInfo}>
                <div className={styles.colorSection}>
                  <span className={styles.colorLabel}>추천 색상:</span>
                  <div className={styles.colorTags}>
                    {yongshin.heeshin.flatMap((element) => 
                      OHAENG_COLORS[element]?.practicalColors.map((color, idx) => (
                        <span key={`${element}-${idx}`} className={styles.colorTag}>
                          {color}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Gishin */}
          {yongshin.gishin && yongshin.gishin.length > 0 && (
            <section className={styles.section}>
              <h4 className={styles.sectionTitle}>기신 (忌神)</h4>
              <p className={styles.description}>
                용신을 극하거나 방해하는 오행으로, 용신의 작용을 약화시킵니다.
              </p>
              <div className={styles.elementList}>
                {yongshin.gishin.map((element, index) => {
                  const info = ELEMENT_INFO[element as keyof typeof ELEMENT_INFO];
                  return (
                    <div key={index} className={clsx(styles.elementTag, styles.negative)}>
                      <span className={clsx(styles.elementIcon, styles[getElementKey(element)])}>
                        {info.hanja}
                      </span>
                      <span>{element}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Color Usage Tips */}
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>색상 활용 팁</h4>
          <div className={styles.tipsList}>
            <div className={styles.tipItem}>
              <span className={styles.tipIcon}>💡</span>
              <div className={styles.tipContent}>
                <strong className={styles.tipTitle}>포인트 아이템 활용</strong>
                <p className={styles.tipText}>
                  전체 의상을 바꾸기보다 소품, 액세서리, 폰케이스, 키링, 넥타이, 가방 등 포인트 아이템에 용신 색상을 먼저 활용해보세요. 부담이 적고 효과적입니다.
                </p>
              </div>
            </div>
            <div className={styles.tipItem}>
              <span className={styles.tipIcon}>🎨</span>
              <div className={styles.tipContent}>
                <strong className={styles.tipTitle}>명도·채도 조절</strong>
                <p className={styles.tipText}>
                  한 가지 색상만 고집하기보다 파스텔 톤, 딥 톤, 뉴트럴 톤 등으로 명도와 채도를 조절하여 본인의 톤에 맞게 활용하세요.
                </p>
              </div>
            </div>
            {yongshin.primary.includes('수') && (
              <div className={styles.tipItem}>
                <span className={styles.tipIcon}>💧</span>
                <div className={styles.tipContent}>
                  <strong className={styles.tipTitle}>수(水) 색상의 확장 해석</strong>
                  <p className={styles.tipText}>
                    수(水)가 필요하다고 해서 검정색만 고집하기보다 네이비, 딥블루 등 파란색 계열로도 활용할 수 있습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Usage Guide */}
        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>활용 가이드</h4>
          <div className={styles.guideList}>
            <div className={styles.guideItem}>
              <span className={styles.guideIcon}>✓</span>
              <div className={styles.guideContent}>
                <strong className={styles.guideLabel}>추천:</strong>
                <span className={styles.guideText}>용신과 희신 오행을 활용한 색상, 방향, 직업, 생활 습관을 선택하세요.</span>
              </div>
            </div>
            <div className={styles.guideItem}>
              <span className={styles.guideIcon}>⚠</span>
              <div className={styles.guideContent}>
                <strong className={styles.guideLabel}>주의:</strong>
                <span className={styles.guideText}>기신 오행과 관련된 요소는 피하거나 신중하게 접근하세요.</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.disclaimer}>
        용신 분석은 사주의 전반적인 경향을 파악하기 위한 조언입니다.
        개별 요소의 상호작용에 따라 실제 작용은 달라질 수 있으므로 참고용으로 활용해 주세요.
      </div>
    </div>
  );
};

// Helper function to get element key for CSS classes
function getElementKey(element: string): string {
  if (element.includes('목')) return 'wood';
  if (element.includes('화')) return 'fire';
  if (element.includes('토')) return 'earth';
  if (element.includes('금')) return 'metal';
  if (element.includes('수')) return 'water';
  return 'wood'; // default
}
