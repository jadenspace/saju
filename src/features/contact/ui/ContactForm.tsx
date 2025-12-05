'use client';

import { useRef, useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Alert } from '@/shared/ui/Alert';
import styles from './ContactForm.module.css';

export const ContactForm = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      title: titleRef.current?.value || '',
      content: contentRef.current?.value || '',
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('https://gentlemonster.duckdns.org/webhook/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      setAlertMessage(text);
      
      // 성공 시 폼 초기화
      if (response.ok) {
        if (nameRef.current) nameRef.current.value = '';
        if (emailRef.current) emailRef.current.value = '';
        if (titleRef.current) titleRef.current.value = '';
        if (contentRef.current) contentRef.current.value = '';
      }
    } catch (error) {
      setAlertMessage(`오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Input ref={nameRef} label="이름" placeholder="이름을 입력하세요" maxLength={20} required />
        </div>
        <div className={styles.field}>
          <Input ref={emailRef} label="이메일" type="email" placeholder="이메일을 입력하세요" maxLength={30} required />
        </div>
        <div className={styles.field}>
          <Input ref={titleRef} label="문의 제목" placeholder="문의 제목을 입력하세요" maxLength={50} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>문의 내용</label>
          <textarea 
            ref={contentRef}
            className={styles.textarea} 
            placeholder="문의 내용을 자세히 적어주세요 (1000자 이하)" 
            required 
            rows={5}
            maxLength={1000}
          />
        </div>
        <div className={styles.actions}>
          <Button type="submit" size="lg" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? '전송 중...' : '문의하기'}
          </Button>
        </div>
      </form>
      
      {alertMessage && (
        <Alert 
          message={alertMessage} 
          onClose={() => setAlertMessage(null)} 
        />
      )}
    </>
  );
};
