import { ResultPage } from '@/views/result/ui/Page';
import { SajuCalculator } from '@/shared/lib/saju/calculators/SajuCalculator';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "무료 사주 풀이 및 만세력 분석 - 운명의 나침반",
  description: "전통 명리학 기반의 심층 사주 풀이와 정확한 만세력 결과를 확인하세요. 12운성, 12신살, 공망 분석 등 상세한 운명을 분석해드립니다.",
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

  return <ResultPage sajuData={sajuData} searchParams={params} />;
}
