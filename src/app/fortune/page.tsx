import { FortunePage } from '@/views/fortune/ui/Page';
import { Loading } from '@/shared/ui/Loading';
import { Suspense } from 'react';

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <FortunePage />
        </Suspense>
    );
}
