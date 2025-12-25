'use client';

import { SajuData, NewYearFortune } from '@/entities/saju/model/types';
import styles from './Page.module.css';
import { Button } from '@/shared/ui/Button';
import { useRouter } from 'next/navigation';
import { FortuneCard } from '@/entities/saju/ui/FortuneCard';
import { MonthlyFortuneGrid } from '@/entities/saju/ui/MonthlyFortuneGrid';
import { YongshinEvidence } from '@/entities/saju/ui/YongshinEvidence';
import { KeyMonthsSection } from '@/entities/saju/ui/KeyMonthsSection';
import { LuckyInfoSection } from '@/entities/saju/ui/LuckyInfoSection';
import { useState } from 'react';
import clsx from 'clsx';

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
        </section>

        {sajuData.yongshin && (
          <section className={styles.yongshinSection}>
            <div className={styles.sectionHeader}>
              <h3>핵심 용신 분석</h3>
            </div>
            <div className={styles.yongshinMain}>
              <div className={styles.yongshinGrid}>
                <div className={styles.yongshinItem}>
                  <span className={styles.label}>주 용신 (Primary)</span>
                  <span className={clsx(styles.value, styles.primary)}>
                    {sajuData.yongshin.primary}
                  </span>
                </div>
                <div className={styles.yongshinItem}>
                  <span className={styles.label}>보조 용신 (Secondary)</span>
                  <span className={styles.value}>
                    {sajuData.yongshin.secondary || '없음'}
                  </span>
                </div>
                <div className={styles.yongshinItem}>
                  <span className={styles.label}>판단 방식</span>
                  <span className={styles.value}>
                    {sajuData.yongshin.type}
                  </span>
                </div>
                <div className={styles.yongshinItem}>
                  <span className={styles.label}>판단 신뢰도</span>
                  <span className={clsx(styles.value, styles[sajuData.yongshin.confidence || 'medium'])}>
                    {sajuData.yongshin.confidence === 'high' ? '높음' : sajuData.yongshin.confidence === 'low' ? '낮음' : '보통'}
                  </span>
                </div>
              </div>
              <div className={styles.evidenceToggle}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowEvidence(!showEvidence)}
                  fullWidth
                >
                  {showEvidence ? '분석 근거 접기' : '왜 이런 결과가 나왔나요? (분석 근거 보기)'}
                </Button>
              </div>
            </div>
            {showEvidence && sajuData.yongshin.evidence && (
              <YongshinEvidence evidence={sajuData.yongshin.evidence} confidence={sajuData.yongshin.confidence} />
            )}
          </section>
        )}

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

