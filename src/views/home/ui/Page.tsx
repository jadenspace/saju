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
          오늘의 운세는
        </h1>
        <p className={styles.description}>
          당신의 생년월일시를 입력하여<br />
          타고난 운명의 지도를 확인하세요.
        </p>
        <SajuForm />

        <div className={styles.linkButtons}>
          <Link href="/guide" className={styles.linkButton}>
            📖 사주 명리학 가이드
          </Link>
          <Link href="/search" className={styles.linkButton}>
            🔍 일주/일간으로 날짜 찾기
          </Link>
        </div>
      </div>
    </main>
  );
};
