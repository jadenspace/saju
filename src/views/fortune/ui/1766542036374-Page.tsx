'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { SajuData } from '@/entities/saju/model/types';
import { NewYearFortuneAnalysis } from '@/entities/saju/ui/NewYearFortuneAnalysis';
import styles from './Page.module.css';

interface FortunePageProps {
    sajuData: SajuData;
    searchParams: { [key: string]: string | string[] | undefined };
}

export const FortunePage = ({ sajuData, searchParams }: FortunePageProps) => {
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
                <h1 className={styles.title}>2026 신년운세</h1>
                <p className={styles.subtitle}>
                    {sajuData.birthDate} {sajuData.birthTime} {sajuData.gender === 'male' ? '남' : '여'}
                </p>
                <NewYearFortuneAnalysis data={sajuData} />
                <div className={styles.actions}>
                    <Button onClick={() => router.push('/')} variant="outline">
                        다시 입력하기
                    </Button>
                    <Button onClick={() => router.push('/result?' + searchParamsString)} id="btn-saju-all">
                        종합 사주 보기
                    </Button>
                </div>
            </div>
        </main>
    );
};
