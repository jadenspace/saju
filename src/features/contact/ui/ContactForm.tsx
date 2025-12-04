'use client';

import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import styles from './ContactForm.module.css';

export const ContactForm = () => {
  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.field}>
        <Input label="이름" placeholder="이름을 입력하세요" maxLength={20} required />
      </div>
      <div className={styles.field}>
        <Input label="이메일" type="email" placeholder="이메일을 입력하세요" maxLength={30} required />
      </div>
      <div className={styles.field}>
        <Input label="문의 제목" placeholder="문의 제목을 입력하세요" maxLength={50} required />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>문의 내용</label>
        <textarea 
          className={styles.textarea} 
          placeholder="문의 내용을 자세히 적어주세요 (1000자 이하)" 
          required 
          rows={5}
          maxLength={1000}
        />
      </div>
      <div className={styles.actions}>
        <Button type="submit" size="lg" className={styles.submitButton}>
          문의하기
        </Button>
      </div>
    </form>
  );
};
