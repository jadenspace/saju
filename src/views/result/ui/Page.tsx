'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SajuCalculator } from '@/shared/lib/saju/SajuCalculator';
import { SajuCard } from '@/entities/saju/ui/SajuCard';
import { Button } from '@/shared/ui/Button';
import { SajuData } from '@/entities/saju/model/types';
import { Loading } from '@/shared/ui/Loading';
import styles from './Page.module.css';

export const ResultPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sajuData, setSajuData] = useState<SajuData | null>(null);

  useEffect(() => {
    const year = Number(searchParams.get('year'));
    const month = Number(searchParams.get('month'));
    const day = Number(searchParams.get('day'));
    const hour = Number(searchParams.get('hour'));
    const minute = Number(searchParams.get('minute'));
    const gender = searchParams.get('gender') as 'male' | 'female';
    const unknownTime = searchParams.get('unknownTime') === 'true';

    if (year && month && day) {
      const data = SajuCalculator.calculate(year, month, day, hour, minute, gender, unknownTime);
      setSajuData(data);
    }
  }, [searchParams]);

  if (!sajuData) {
    return <Loading />;
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>사주 분석 결과</h1>
        <SajuCard data={sajuData} />
        <div className={styles.actions}>
          <Button onClick={() => router.push('/')} variant="outline">
            다시 입력하기
          </Button>
        </div>
      </div>
    </main>
  );
};
