import Link from 'next/link';
import { SajuForm } from '@/features/saju-form/ui/SajuForm';
import styles from './Page.module.css';

export const HomePage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.subtitle}>무료 사주와 오늘의 운세</span>
          <br />
          운명의 나침반
        </h1>
        <p className={styles.description}>
          당신의 생년월일시를 입력하여<br />
          타고난 운명의 지도를 확인하세요.
        </p>
        <SajuForm />

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link
            href="/search"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
              color: 'white',
              textDecoration: 'none',
              fontSize: '0.9rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            🔍 일주/일간으로 날짜 찾기
          </Link>
        </div>
      </div>
    </main>
  );
};
