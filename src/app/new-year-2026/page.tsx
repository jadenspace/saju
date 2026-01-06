import { SajuCalculator } from '@/shared/lib/saju/calculators/SajuCalculator';
import { NewYearFortune2026Calculator } from '@/shared/lib/saju/calculators/NewYearFortune2026Calculator';
import { NewYearFortune2026View } from '@/views/new-year-2026/ui/Page';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "2026년 병오년 신년운세 - 오늘의 운세는",
  description: "2026년 병오년, 당신의 운세는 어떨까요? 전통 명리학 기반의 심층 분석으로 한 해의 흐름을 미리 확인하세요.",
  robots: 'noindex, nofollow',
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

  // 1. Base Saju Data
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

  // 2. 2026 신년운세 계산
  const fortuneData = NewYearFortune2026Calculator.calculate(sajuData);
  console.log('sajuData:', sajuData);
  console.log('fortuneData:', fortuneData);

  return <NewYearFortune2026View sajuData={sajuData} fortuneData={fortuneData} searchParams={params} />;
}

