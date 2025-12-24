'use client';

import { useRouter } from 'next/navigation';
import { SajuCard } from '@/entities/saju/ui/SajuCard';
import { Button } from '@/shared/ui/Button';
import { SajuData } from '@/entities/saju/model/types';
import styles from './Page.module.css';

interface ResultPageProps {
  sajuData: SajuData;
  searchParams: { [key: string]: string | string[] | undefined };
}

export const ResultPage = ({ sajuData, searchParams }: ResultPageProps) => {
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
        <h1 className={styles.title}>사주 분석 결과</h1>
        <SajuCard data={sajuData} />
        <div className={styles.actions}>
          <Button onClick={() => router.push('/')} variant="outline">
            다시 입력하기
          </Button>
          <Button onClick={() => router.push('/fortune?' + searchParamsString)} id="btn-saju-2026">
            2026 신년운세 보기
          </Button>
        </div>
      </div>
    </main>
  );
};
