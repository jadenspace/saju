'use client';

import { useRouter } from 'next/navigation';
import { SajuData } from '@/entities/saju/model/types';
import { YongshinEvidence } from '@/entities/saju/ui/YongshinEvidence';
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
        <h1 className={styles.title}>용신 찾기</h1>
        <p className={styles.subtitle}>
          용신(用神)은 사주에서 가장 필요한 오행으로, 일생의 길흉화복을 좌우하는 핵심 요소입니다. 
          합충·격국·조후·억부를 종합 분석하여 당신에게 가장 필요한 오행을 찾아드립니다. 
          용신을 알아야 운세를 개선하고, 좋은 기운을 활용하며, 불리한 시기를 피할 수 있습니다.
        </p>

        {/* 용신 분석 결과 */}
        {sajuData.yongshin ? (
          <div className={styles.analysisSection}>
            {/* 용신 결정 흐름 (분석 근거) */}
            {sajuData.yongshin.evidence && (
              <div className={styles.evidenceSection}>
                <YongshinEvidence 
                  evidence={sajuData.yongshin.evidence} 
                  confidence={sajuData.yongshin.confidence}
                  yongshin={sajuData.yongshin}
                  sajuData={sajuData}
                />
              </div>
            )}
          </div>
        ) : (
          <div className={styles.noData}>
            <p>용신 정보를 계산할 수 없습니다.</p>
            <p className={styles.hint}>일간 강약 분석이 필요합니다.</p>
          </div>
        )}

        {/* 네비게이션 버튼 */}
        <div className={styles.actions}>
          <Button onClick={() => router.push('/fortune?' + searchParamsString)}>
            2026 신년운세 보기
          </Button>
          <Button onClick={() => router.push('/result?' + searchParamsString)} className={styles.tertiaryButton}>
            종합 사주 보기
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
