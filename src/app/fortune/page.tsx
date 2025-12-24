import { FortunePage } from '@/views/fortune/ui/Page';
import { SajuCalculator } from '@/shared/lib/saju/calculators/SajuCalculator';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "2026 신년운세 | 병오년 운세 분석 - 운명의 나침반",
    description: "2026년 병오년(붉은 말의 해)의 운세를 무료로 확인하세요. 생년월일을 통한 정밀 분석으로 당신의 한 해를 미리 준비할 수 있도록 도와드립니다.",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams;
    
    const year = Number(params.year);
    const month = Number(params.month);
    const day = Number(params.day);
    const hour = Number(params.hour) || 0;
    const minute = Number(params.minute) || 0;
    const gender = (params.gender as 'male' | 'female') || 'male';
    const unknownTime = params.unknownTime === 'true';
    const useTrueSolarTime = params.useTrueSolarTime !== 'false';
    const applyDST = params.applyDST !== 'false';
    const midnightMode = (params.midnightMode as 'early' | 'late') || 'late';

    if (!year || !month || !day) {
        redirect('/');
    }

    const sajuData = SajuCalculator.calculate(
        year,
        month,
        day,
        hour,
        minute,
        gender,
        unknownTime,
        useTrueSolarTime,
        applyDST,
        midnightMode
    );

    return <FortunePage sajuData={sajuData} searchParams={params} />;
}
