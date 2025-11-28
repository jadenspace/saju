'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import styles from './SajuForm.module.css';

export const SajuForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    gender: 'male',
    unknownTime: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ 
        ...prev, 
        [name]: checked,
        // Clear hour/minute if unknown time is checked
        hour: checked ? '' : prev.hour,
        minute: checked ? '' : prev.minute
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Construct query params
    const params = new URLSearchParams({
      year: formData.year,
      month: formData.month,
      day: formData.day,
      hour: formData.unknownTime ? '0' : formData.hour,
      minute: formData.unknownTime ? '0' : formData.minute,
      gender: formData.gender,
      unknownTime: String(formData.unknownTime),
    });

    router.push(`/result?${params.toString()}`);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <Input
          label="년 (Year)"
          name="year"
          type="number"
          placeholder="YYYY"
          value={formData.year}
          onChange={handleChange}
          required
          min="1900"
          max="2100"
        />
        <Input
          label="월 (Month)"
          name="month"
          type="number"
          placeholder="MM"
          value={formData.month}
          onChange={handleChange}
          required
          min="1"
          max="12"
        />
        <Input
          label="일 (Day)"
          name="day"
          type="number"
          placeholder="DD"
          value={formData.day}
          onChange={handleChange}
          required
          min="1"
          max="31"
        />
      </div>
      
      <div className={styles.grid}>
        <Input
          label="시 (Hour)"
          name="hour"
          type="number"
          placeholder="HH (0-23)"
          value={formData.hour}
          onChange={handleChange}
          required={!formData.unknownTime}
          disabled={formData.unknownTime}
          min="0"
          max="23"
        />
        <Input
          label="분 (Minute)"
          name="minute"
          type="number"
          placeholder="MM"
          value={formData.minute}
          onChange={handleChange}
          required={!formData.unknownTime}
          disabled={formData.unknownTime}
          min="0"
          max="59"
        />
      </div>

      <div className={styles.checkboxField}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="unknownTime"
            checked={formData.unknownTime}
            onChange={handleChange}
          />
          시간 모름 (Time Unknown)
        </label>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>성별 (Gender)</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
            />
            남성 (Male)
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
            />
            여성 (Female)
          </label>
        </div>
      </div>

      <Button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? '분석 중...' : '만세력 확인하기'}
      </Button>
    </form>
  );
};
