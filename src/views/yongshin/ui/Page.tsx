'use client';

import { useRouter } from 'next/navigation';
import { SajuData } from '@/entities/saju/model/types';
import { DitianSuiAnalysis } from '@/entities/saju/ui/DitianSuiAnalysis';
import { Button } from '@/shared/ui/Button';
import styles from './Page.module.css';

interface YongshinPageProps {
  sajuData: SajuData;
  searchParams: { [key: string]: string | string[] | undefined };
}

export const YongshinPage = ({ sajuData, searchParams }: YongshinPageProps) => {
  const router = useRouter();

  const searchParamsString = new URLSearchParams(
    Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Array.isArray(value) ? value[0] : value;
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>용신 분석</h1>
          <p className={styles.subtitle}>
            용신(用神)은 사주에서 가장 필요한 오행으로, 일생의 길흉화복을 좌우하는 핵심 요소입니다. 
            합충·격국·조후·억부를 종합 분석하여 당신에게 가장 필요한 오행을 찾아드립니다. 
            용신을 알아야 운세를 개선하고, 좋은 기운을 활용하며, 불리한 시기를 피할 수 있습니다.
          </p>
        </header>

        {/* 용신 분석 결과 */}
        <section className={styles.analysisSection}>
          <DitianSuiAnalysis sajuData={sajuData} />
        </section>

        {/* 네비게이션 버튼 */}
        <div className={styles.actions}>
          <Button onClick={() => router.push('/new-year-2026?' + searchParamsString)}>
            2026 신년운세 보기
          </Button>
          <Button onClick={() => router.push('/result?' + searchParamsString)} className={styles.tertiaryButton}>
            정통 사주 보기
          </Button>
        </div>
        <div className={styles.secondaryActions}>
          <Button onClick={() => router.push('/')} variant="outline">
            다시 입력하기
          </Button>
        </div>
      </div>
    </main>
  );
};
