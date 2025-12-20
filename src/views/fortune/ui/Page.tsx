'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SajuCalculator } from '@/shared/lib/saju/calculators/SajuCalculator';
import { Button } from '@/shared/ui/Button';
import { SajuData } from '@/entities/saju/model/types';
import { Loading } from '@/shared/ui/Loading';
import { NewYearFortuneAnalysis } from '@/entities/saju/ui/NewYearFortuneAnalysis';
import styles from './Page.module.css';

export const FortunePage = () => {
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
        const useTrueSolarTime = searchParams.get('useTrueSolarTime') !== 'false';
        const applyDST = searchParams.get('applyDST') !== 'false';
        const midnightMode = (searchParams.get('midnightMode') || 'late') as 'early' | 'late';

        if (year && month && day) {
            const data = SajuCalculator.calculate(year, month, day, hour, minute, gender, unknownTime, useTrueSolarTime, applyDST, midnightMode);
            setSajuData(data);
        }
    }, [searchParams]);

    if (!sajuData) {
        return <Loading />;
    }

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
                    <Button onClick={() => router.push('/result?' + searchParams.toString())}>
                        사주 결과 보기
                    </Button>
                </div>
            </div>
        </main>
    );
};
