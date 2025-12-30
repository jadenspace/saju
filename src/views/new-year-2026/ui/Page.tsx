'use client';

import { SajuData, NewYearFortune2026 } from '@/entities/saju/model/types';
import styles from './Page.module.css';
import { Button } from '@/shared/ui/Button';
import { useRouter } from 'next/navigation';
import { TotalFortune2026 } from '@/entities/saju/ui/TotalFortune2026';
import { MonthlyFortune2026 } from '@/entities/saju/ui/MonthlyFortune2026';

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

        {/* 총운 섹션 */}
        <TotalFortune2026 
          total={fortuneData.total}
          wealth={fortuneData.wealth}
          love={fortuneData.love}
          career={fortuneData.career}
          health={fortuneData.health}
        />

        {/* 월별운 섹션 */}
        <section className={styles.monthlySection}>
          <div className={styles.sectionHeader}>
            <h3>월별 운세 흐름</h3>
            <p className={styles.sectionDesc}>절기(입춘 등) 기준으로 구분된 월별 기운입니다.</p>
          </div>
          <MonthlyFortune2026 monthly={fortuneData.monthly} />
        </section>

        {/* 유료 전환 CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>💡 내 운을 바꿀 수는 없을까?</h3>
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
              🔮 적천수 용신 분석하기 (<span style={{ textDecoration: 'line-through' }}>4,900원</span> → <span style={{ fontWeight: 'bold' }}>무료</span>)
            </Button>
          </div>
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

