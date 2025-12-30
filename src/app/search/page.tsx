'use client';

import { IljuSearchForm } from '@/features/ilju-search/ui/IljuSearchForm';
import Link from 'next/link';
import styles from './page.module.css';

export default function SearchPage() {
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Link href="/" className={styles.backLink}>
                        ← 메인으로 돌아가기
                    </Link>
                    <h1 className={styles.title}>사주 역검색기</h1>
                    <p className={styles.subtitle}>원하는 일주, 일간, 일지가 들어있는 날짜를 찾아보세요.</p>
                </div>

                <IljuSearchForm />
            </div>
        </div>
    );
}
