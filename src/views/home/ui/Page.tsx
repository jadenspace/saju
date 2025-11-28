import { SajuForm } from '@/features/saju-form/ui/SajuForm';
import styles from './Page.module.css';

export const HomePage = () => {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.subtitle}>운명의 나침반</span>
          <br />
          사주 만세력
        </h1>
        <p className={styles.description}>
          당신의 생년월일시를 입력하여<br />
          타고난 운명의 지도를 확인하세요.
        </p>
        <SajuForm />
      </div>
    </main>
  );
};
