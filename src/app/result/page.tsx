import { ResultPage } from '@/views/result/ui/Page';
import { Loading } from '@/shared/ui/Loading';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "무료 사주 풀이 및 만세력 분석 - 운명의 나침반",
  description: "전통 명리학 기반의 심층 사주 풀이와 정확한 만세력 결과를 확인하세요. 12운성, 12신살, 공망 분석 등 상세한 운명을 분석해드립니다.",
};

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ResultPage />
    </Suspense>
  );
}
