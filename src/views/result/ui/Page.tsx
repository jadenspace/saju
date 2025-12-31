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
        
        {/* 유료 전환 CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>💡 내 운을 바꿀 수는 없을까?</h3>
            <p className={styles.ctaText}>
              당신의 사주에서 가장 필요한 기운(용신)을 알면, 운을 극대화하는 방법을 찾을 수 있습니다.
            </p>
            <Button
              onClick={() => alert('준비중입니다')}
              variant="primary"
              fullWidth
            >
              🔮 용신 분석하기 (<span style={{ textDecoration: 'line-through' }}>4,900원</span> → <span style={{ fontWeight: 'bold' }}>무료</span>)
            </Button>
          </div>
        </section>

        <div className={styles.secondaryActions}>
          <Button onClick={() => router.push('/new-year-2026?' + searchParamsString)} id="btn-saju-2026" variant="outline" fullWidth>
            2026 신년운세 보기
          </Button>
          <Button onClick={() => router.push('/')} variant="outline" fullWidth>
            다시 입력하기
          </Button>
        </div>
      </div>
    </main>
  );
};
