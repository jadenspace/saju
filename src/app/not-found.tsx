import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorTitle}>
        페이지를 찾을 수 없습니다
      </h2>
      <p className={styles.errorMessage}>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        아래 링크를 통해 메인 페이지로 이동해주세요.
      </p>
      <div className={styles.buttonGroup}>
        <Link href="/" className={styles.primaryButton}>
          메인으로 돌아가기
        </Link>
        <Link href="/new-year-2026" className={styles.secondaryButton}>
          2026 신년운세 보기
        </Link>
      </div>

      <div className={styles.footer}>
        <p>오늘의 운세는 - 무료 사주 및 운세 서비스</p>
      </div>
    </main>
  );
}
