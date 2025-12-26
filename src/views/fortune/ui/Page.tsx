'use client';

import { SajuData, NewYearFortune } from '@/entities/saju/model/types';
import styles from './Page.module.css';
import { Button } from '@/shared/ui/Button';
import { useRouter } from 'next/navigation';
import { FortuneCard } from '@/entities/saju/ui/FortuneCard';
import { MonthlyFortuneGrid } from '@/entities/saju/ui/MonthlyFortuneGrid';
import { KeyMonthsSection } from '@/entities/saju/ui/KeyMonthsSection';
import { LuckyInfoSection } from '@/entities/saju/ui/LuckyInfoSection';
import { TotalScoreEvidenceComponent } from '@/entities/saju/ui/TotalScoreEvidence';
import { useState } from 'react';

interface FortuneViewProps {
  sajuData: SajuData;
  fortuneData: NewYearFortune;
}

export const FortuneView = ({ sajuData, fortuneData }: FortuneViewProps) => {
  const router = useRouter();
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.year}>{fortuneData.year}년 {fortuneData.ganZhi}년</span>
            <br />
            신년운세 리포트
          </h1>
          <p className={styles.subtitle}>
            {sajuData.gender === 'male' ? '남성' : '여성'} | {sajuData.birthDate} {sajuData.birthTime}
          </p>
        </header>

        <section className={styles.totalSection}>
          <div className={styles.totalCard}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreLabel}>총운 점수</span>
              <span className={styles.scoreValue}>{fortuneData.totalScore}</span>
            </div>
            <div className={styles.totalText}>
              <h2 className={styles.totalOneLiner}>{fortuneData.totalOneLiner}</h2>
              <p className={styles.totalSummary}>{fortuneData.categories.total.summary}</p>
            </div>
          </div>
          {fortuneData.totalScoreEvidence && (
            <div className={styles.evidenceToggleWrapper}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEvidence(!showEvidence)}
                fullWidth
              >
                {showEvidence ? '계산 근거 접기' : '왜 이런 점수가 나왔나요? (계산 과정 보기)'}
              </Button>
            </div>
          )}
          {showEvidence && fortuneData.totalScoreEvidence && (
            <TotalScoreEvidenceComponent evidence={fortuneData.totalScoreEvidence} />
          )}
        </section>

        <section className={styles.categoriesSection}>
          <div className={styles.sectionHeader}>
            <h3>분야별 상세 운세</h3>
          </div>
          <div className={styles.categoriesGrid}>
            <FortuneCard 
              title="재물운" 
              category="wealth" 
              data={fortuneData.categories.wealth} 
              icon="💰" 
            />
            <FortuneCard 
              title="연애운" 
              category="love" 
              data={fortuneData.categories.love} 
              icon="❤️" 
            />
            <FortuneCard 
              title="건강운" 
              category="health" 
              data={fortuneData.categories.health} 
              icon="💪" 
            />
            <FortuneCard 
              title="직장운" 
              category="career" 
              data={fortuneData.categories.career} 
              icon="💼" 
            />
          </div>
        </section>

        <section className={styles.monthlySection}>
          <div className={styles.sectionHeader}>
            <h3>월별 운세 흐름</h3>
            <p className={styles.sectionDesc}>절기(입춘 등) 기준으로 구분된 월별 기운입니다.</p>
          </div>
          <MonthlyFortuneGrid monthly={fortuneData.monthly} />
        </section>

        {fortuneData.keyMonths && fortuneData.keyMonths.length > 0 && (
          <KeyMonthsSection keyMonths={fortuneData.keyMonths} />
        )}

        {fortuneData.luckyInfo && (
          <LuckyInfoSection luckyInfo={fortuneData.luckyInfo} />
        )}

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

