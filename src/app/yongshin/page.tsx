import { YongshinPage } from '@/views/yongshin/ui/Page';
import { SajuCalculator } from '@/shared/lib/saju/calculators/SajuCalculator';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "용신 찾기 - 운명의 나침반",
  description: "전통 명리학 기반의 정밀 용신 분석. 합충, 격국, 조후, 억부 등 핵심 알고리즘으로 당신에게 필요한 오행을 찾아드립니다.",
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

  return <YongshinPage sajuData={sajuData} searchParams={params} />;
}
