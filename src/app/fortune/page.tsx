import { SajuCalculator } from '@/shared/lib/saju/calculators/SajuCalculator';
import { FortuneScoreCalculator } from '@/shared/lib/saju/calculators/FortuneScoreCalculator';
import { FortuneView } from '@/views/fortune/ui/Page';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "2026년 병오년 신년운세 - 운명의 나침반",
  description: "2026년 병오년, 당신의 운세는 어떨까요? 전통 명리학 기반의 심층 분석으로 한 해의 흐름을 미리 확인하세요.",
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

  // 2. New Year Fortune Data (Fixed for 2026 for now)
  const fortuneData = FortuneScoreCalculator.calculateNewYearFortune(2026, sajuData);

  return <FortuneView sajuData={sajuData} fortuneData={fortuneData} />;
}

