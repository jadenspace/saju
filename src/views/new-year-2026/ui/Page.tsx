'use client';

import { SajuData, NewYearFortune2026 } from '@/entities/saju/model/types';
import styles from './Page.module.css';
import { Button } from '@/shared/ui/Button';
import { useRouter } from 'next/navigation';
import { TotalFortune2026 } from '@/entities/saju/ui/TotalFortune2026';
import { FortuneCategoryCard2026 } from '@/entities/saju/ui/FortuneCategoryCard2026';
import { MonthlyFortune2026 } from '@/entities/saju/ui/MonthlyFortune2026';
import { calculateSipsin } from '@/shared/lib/saju/calculators/TenGod';

function calculateSipsinForDisplay(dayMaster: string, target: string): string {
  return calculateSipsin(dayMaster, target);
}

function getSeunDescription(dayMaster: string, seunGan: string): string {
  const sipsin = calculateSipsin(dayMaster, seunGan);
  const descriptions: Record<string, string> = {
    '정인': '학습과 도움',
    '편인': '학습과 변화',
    '비견': '협력과 자신감',
    '겁재': '경쟁과 도전',
    '식신': '능력과 표현',
    '상관': '창의와 성과',
    '정재': '안정적 재물',
    '편재': '투자와 부수입',
    '정관': '직장과 책임',
    '편관': '변화와 도전',
  };
  return descriptions[sipsin] || sipsin;
}

interface NewYearFortune2026ViewProps {
  sajuData: SajuData;
  fortuneData: NewYearFortune2026;
}

export const NewYearFortune2026View = ({ sajuData, fortuneData }: NewYearFortune2026ViewProps) => {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.year}>🐴 {fortuneData.year}년 {fortuneData.ganZhi}년</span>
            <br />
            신년운세 리포트
          </h1>
          <p className={styles.subtitle}>
            {sajuData.gender === 'male' ? '남성' : '여성'} | {sajuData.birthDate} {sajuData.birthTime}
            {sajuData.useTrueSolarTime && ' (-30)'}
            {sajuData.solar ? ' (양력)' : ' (음력)'}
          </p>
        </header>

        {/* 사주 정보 카드 */}
        <section className={styles.sajuInfoSection}>
          <div className={styles.sajuCard}>
            <h3 className={styles.sajuTitle}>👤 당신의 사주</h3>
            <div className={styles.pillars}>
              <div className={styles.pillar}>
                <div className={styles.pillarLabel}>시주</div>
                <div className={styles.pillarValue}>
                  {sajuData.hour.ganHan}{sajuData.hour.jiHan}
                </div>
              </div>
              <div className={styles.pillar}>
                <div className={styles.pillarLabel}>일주</div>
                <div className={styles.pillarValue}>
                  {sajuData.day.ganHan}{sajuData.day.jiHan}
                </div>
              </div>
              <div className={styles.pillar}>
                <div className={styles.pillarLabel}>월주</div>
                <div className={styles.pillarValue}>
                  {sajuData.month.ganHan}{sajuData.month.jiHan}
                </div>
              </div>
              <div className={styles.pillar}>
                <div className={styles.pillarLabel}>년주</div>
                <div className={styles.pillarValue}>
                  {sajuData.year.ganHan}{sajuData.year.jiHan}
                </div>
              </div>
            </div>
            <div className={styles.sajuDetails}>
              <span>일간: {sajuData.day.ganHan}</span>
              <span>오행: 목{sajuData.ohaengDistribution.wood} 화{sajuData.ohaengDistribution.fire} 토{sajuData.ohaengDistribution.earth} 금{sajuData.ohaengDistribution.metal} 수{sajuData.ohaengDistribution.water}</span>
            </div>
          </div>
        </section>

        {/* 2026년 세운 정보 */}
        <section className={styles.seunInfoSection}>
          <div className={styles.seunCard}>
            <h3 className={styles.seunTitle}>2026년 {fortuneData.ganZhi}와 당신의 관계</h3>
            <div className={styles.seunDetails}>
              <div className={styles.seunItem}>
                <span className={styles.seunLabel}>丙火</span>
                <span className={styles.seunArrow}>→</span>
                <span className={styles.seunValue}>{sajuData.day.ganHan}의 [{calculateSipsinForDisplay(sajuData.day.ganHan, '丙')}]</span>
              </div>
              <div className={styles.seunItem}>
                <span className={styles.seunLabel}>午火</span>
                <span className={styles.seunArrow}>→</span>
                <span className={styles.seunValue}>{sajuData.day.ganHan}의 [{calculateSipsinForDisplay(sajuData.day.ganHan, '午')}] 통근</span>
              </div>
            </div>
            <p className={styles.seunDescription}>
              "2026년은 {getSeunDescription(sajuData.day.ganHan, '丙')}의 해입니다"
            </p>
          </div>
        </section>

        {/* 총운 섹션 */}
        <TotalFortune2026 total={fortuneData.total} />

        {/* 유료 전환 CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>💡 왜 이런 운세가 나왔을까요?</h3>
            <p className={styles.ctaText}>
              당신의 사주에서 가장 필요한 기운(용신)을 알면, 운을 극대화하는 방법을 찾을 수 있습니다.
            </p>
            <Button
              onClick={() => router.push(`/yongshin?${new URLSearchParams({
                year: sajuData.birthDate.split('-')[0],
                month: sajuData.birthDate.split('-')[1],
                day: sajuData.birthDate.split('-')[2],
                hour: sajuData.birthTime.split(':')[0] || '0',
                minute: sajuData.birthTime.split(':')[1] || '0',
                gender: sajuData.gender,
                unknownTime: String(sajuData.unknownTime || false),
                useTrueSolarTime: String(sajuData.useTrueSolarTime || true),
                applyDST: String(sajuData.applyDST || true),
                midnightMode: sajuData.midnightMode || 'late',
              }).toString()}`)}
              variant="primary"
              fullWidth
            >
              🔮 적천수 용신 분석하기 (4,900원)
            </Button>
          </div>
        </section>

        {/* 세부 운세 섹션 */}
        <section className={styles.categoriesSection}>
          <div className={styles.sectionHeader}>
            <h3>분야별 상세 운세</h3>
          </div>
          <div className={styles.categoriesGrid}>
            <FortuneCategoryCard2026
              title="💰 재물운"
              category="wealth"
              data={fortuneData.wealth}
            />
            <FortuneCategoryCard2026
              title="💕 애정운"
              category="love"
              data={fortuneData.love}
            />
            <FortuneCategoryCard2026
              title="💼 직장운"
              category="career"
              data={fortuneData.career}
            />
            <FortuneCategoryCard2026
              title="🏥 건강운"
              category="health"
              data={fortuneData.health}
            />
          </div>
        </section>

        {/* 월별운 섹션 */}
        <section className={styles.monthlySection}>
          <div className={styles.sectionHeader}>
            <h3>📅 월별 운세 흐름</h3>
            <p className={styles.sectionDesc}>절기(입춘 등) 기준으로 구분된 월별 기운입니다.</p>
          </div>
          <MonthlyFortune2026 monthly={fortuneData.monthly} />
        </section>

        <footer className={styles.footer}>
          <Button onClick={() => router.push('/')} variant="outline" fullWidth>
            다시 입력하기
          </Button>
          <p className={styles.disclaimer}>
            본 운세 결과는 명리학적 규칙에 기반한 분석이며, <br />
            삶의 참고 자료로만 활용하시기 바랍니다.
          </p>
        </footer>
      </div>
    </main>
  );
};

