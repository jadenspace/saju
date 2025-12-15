'use client';

import { IljuSearchForm } from '@/features/ilju-search/ui/IljuSearchForm';
import Link from 'next/link';

export default function SearchPage() {
    return (
        <div style={{
            minHeight: '100vh',
            padding: '4rem 1rem',
            background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
            color: 'white'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <Link href="/" style={{ opacity: 0.7, textDecoration: 'none', color: 'white', marginBottom: '1rem', display: 'inline-block' }}>
                        ← 메인으로 돌아가기
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>사주 역검색기</h1>
                    <p style={{ opacity: 0.8 }}>원하는 일주, 일간, 일지가 들어있는 날짜를 찾아보세요.</p>
                </div>

                <IljuSearchForm />
            </div>
        </div>
    );
}
