import { FortunePage } from '@/views/fortune/ui/Page';
import { Loading } from '@/shared/ui/Loading';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "2026 신년운세 | 병오년 운세 분석 - 운명의 나침반",
    description: "2026년 병오년(붉은 말의 해)의 운세를 무료로 확인하세요. 생년월일을 통한 정밀 분석으로 당신의 한 해를 미리 준비할 수 있도록 도와드립니다.",
};

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <FortunePage />
        </Suspense>
    );
}
