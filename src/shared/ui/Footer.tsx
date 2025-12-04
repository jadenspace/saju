import Link from 'next/link';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.copyright}>
          © {new Date().getFullYear()} 운명의 나침반. All rights reserved.
        </div>
        <div className={styles.links}>
          <Link href="/privacy" className={styles.link}>
            개인정보처리방침
          </Link>
          <span className={styles.divider}>|</span>
          <Link href="/contact" className={styles.link}>
            문의하기
          </Link>
        </div>
      </div>
    </footer>
  );
};
