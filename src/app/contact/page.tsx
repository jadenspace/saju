import { ContactForm } from '@/features/contact/ui/ContactForm';
import Link from 'next/link';
import styles from './page.module.css';

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← 돌아가기
          </Link>
        </div>
        <h1 className={styles.title}>문의하기</h1>
        <p className={styles.description}>
          궁금한 점이나 제안하고 싶은 내용이 있다면 언제든지 문의해주세요.<br />
          빠른 시일 내에 답변 드리겠습니다.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
