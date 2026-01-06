import Link from "next/link";
import styles from "./Footer.module.css";

const CURRENT_YEAR = 2026;

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.copyright}>
          © {CURRENT_YEAR} 오늘의 운세는. All rights reserved.
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
