'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import styles from './SajuForm.module.css';
import KoreanLunarCalendar from 'korean-lunar-calendar';

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
    isLunar: false,
    useTrueSolarTime: true,
    applyDST: true,
    midnightMode: 'early' as 'early' | 'late',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ 
        ...prev, 
        [name]: checked,
        // Clear hour/minute if unknown time is checked
        hour: name === 'unknownTime' && checked ? '' : prev.hour,
        minute: name === 'unknownTime' && checked ? '' : prev.minute
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user makes changes
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let finalYear = formData.year;
    let finalMonth = formData.month;
    let finalDay = formData.day;

    // Convert lunar to solar if isLunar is checked
    if (formData.isLunar) {
      try {
        const calendar = new KoreanLunarCalendar();
        calendar.setLunarDate(
          parseInt(formData.year),
          parseInt(formData.month),
          parseInt(formData.day),
          false // isLeapMonth - 윤달 여부, 기본 false
        );
        
        const solarDate = calendar.getSolarCalendar();
        finalYear = String(solarDate.year);
        finalMonth = String(solarDate.month);
        finalDay = String(solarDate.day);
      } catch (err) {
        setError('유효하지 않은 음력 날짜입니다. 날짜를 확인해주세요.');
        setLoading(false);
        return;
      }
    }
    
    // Construct query params with converted solar date
    const params = new URLSearchParams({
      year: finalYear,
      month: finalMonth,
      day: finalDay,
      hour: formData.unknownTime ? '0' : formData.hour,
      minute: formData.unknownTime ? '0' : formData.minute,
      gender: formData.gender,
      unknownTime: String(formData.unknownTime),
      useTrueSolarTime: String(formData.useTrueSolarTime),
      applyDST: String(formData.applyDST),
      midnightMode: formData.midnightMode,
    });

    router.push(`/result?${params.toString()}`);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Settings Toggle */}
      <div className={styles.settingsToggle}>
        <button
          type="button"
          className={`${styles.settingsButton} ${showSettings ? styles.active : ''}`}
          onClick={() => setShowSettings(!showSettings)}
          aria-label="설정"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10C12.5 11.3807 11.3807 12.5 10 12.5Z" />
            <path d="M17.5 10C17.5 9.65833 17.4833 9.31667 17.4417 8.98333L19.2667 7.575C19.425 7.45 19.475 7.225 19.3833 7.04167L17.6417 4.125C17.55 3.94167 17.3333 3.875 17.15 3.93333L15.0083 4.69167C14.5583 4.35833 14.075 4.075 13.55 3.85L13.2083 1.61667C13.1833 1.41667 13.0083 1.25 12.7917 1.25H9.20833C8.99167 1.25 8.81667 1.41667 8.79167 1.61667L8.45 3.85C7.925 4.075 7.44167 4.35833 6.99167 4.69167L4.85 3.93333C4.675 3.86667 4.45 3.94167 4.35833 4.125L2.61667 7.04167C2.51667 7.225 2.575 7.45 2.73333 7.575L4.55833 8.98333C4.51667 9.31667 4.5 9.65833 4.5 10C4.5 10.3417 4.51667 10.6833 4.55833 11.0167L2.73333 12.425C2.575 12.55 2.525 12.775 2.61667 12.9583L4.35833 15.875C4.45 16.0583 4.66667 16.125 4.85 16.0667L6.99167 15.3083C7.44167 15.6417 7.925 15.925 8.45 16.15L8.79167 18.3833C8.81667 18.5833 8.99167 18.75 9.20833 18.75H12.7917C13.0083 18.75 13.1833 18.5833 13.2083 18.3833L13.55 16.15C14.075 15.925 14.5583 15.6417 15.0083 15.3083L17.15 16.0667C17.325 16.1333 17.55 16.0583 17.6417 15.875L19.3833 12.9583C19.475 12.775 19.425 12.55 19.2667 12.425L17.4417 11.0167C17.4833 10.6833 17.5 10.3417 17.5 10Z" />
          </svg>
          <span>설정</span>
        </button>
      </div>

      {/* Collapsible Settings Panel */}
      {showSettings && (
        <div className={styles.settingsPanel}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setShowSettings(false)}
            aria-label="닫기"
          >
            ×
          </button>
          
          {/* 썸머타임 - 필수 적용 안내 */}
          <div className={styles.field}>
            <div className={styles.labelWithTooltip}>
              <label className={styles.label}>썸머타임 (일광절약시간)</label>
              <div className={styles.tooltip}>
                <span className={styles.infoIcon}>ⓘ</span>
                <div className={styles.tooltipContent}>
                  <strong>본 사이트에서는 썸머타임 적용이 필수입니다.</strong><br/>
                  1948-1960, 1987-1988년 한국에서 시행된 일광절약시간을 자동으로 반영합니다.
                </div>
              </div>
            </div>
            <p className={styles.helperText}>
              ✓ 1948-1960, 1987-1988년 출생자에게 자동 적용
            </p>
          </div>

          {/* 시간 기준 */}
          <div className={styles.field}>
            <div className={styles.labelWithTooltip}>
              <label className={styles.label}>시간 기준</label>
              <div className={styles.tooltip}>
                <span className={styles.infoIcon}>ⓘ</span>
                <div className={styles.tooltipContent}>
                  <strong>기본값: 진태양시</strong><br/>
                  한국 중심 경도(127.5°)와 표준 경도(135°) 차이를 보정합니다. 대부분의 사주명리학자들이 권장합니다.
                </div>
              </div>
            </div>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="useTrueSolarTime"
                  value="true"
                  checked={formData.useTrueSolarTime === true}
                  onChange={(e) => setFormData(prev => ({ ...prev, useTrueSolarTime: true }))}
                  disabled={formData.unknownTime}
                />
                진태양시 (경도보정)
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="useTrueSolarTime"
                  value="false"
                  checked={formData.useTrueSolarTime === false}
                  onChange={(e) => setFormData(prev => ({ ...prev, useTrueSolarTime: false }))}
                  disabled={formData.unknownTime}
                />
                표준시 (KST)
              </label>
            </div>
          </div>

          {/* 자시구분 */}
          <div className={styles.field}>
            <div className={styles.labelWithTooltip}>
              <label className={styles.label}>자시구분 (子時區分)</label>
              <div className={styles.tooltip}>
                <span className={styles.infoIcon}>ⓘ</span>
                <div className={styles.tooltipContent}>
                  <strong>기본값: 야자시</strong><br/>
                  23:00-24:00 출생 시 적용됩니다.<br/>
                  • 야자시: 23시를 다음날 자시(00시)로 처리<br/>
                  • 조자시: 23시를 당일 자시로 처리<br/>
                  전통 사주명리학에서는 야자시를 주로 사용합니다.
                </div>
              </div>
            </div>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="midnightMode"
                  value="early"
                  checked={formData.midnightMode === 'early'}
                  onChange={(e) => setFormData(prev => ({ ...prev, midnightMode: 'early' as 'early' | 'late' }))}
                  disabled={formData.unknownTime}
                />
                야자시 (夜子時)
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="midnightMode"
                  value="late"
                  checked={formData.midnightMode === 'late'}
                  onChange={(e) => setFormData(prev => ({ ...prev, midnightMode: 'late' as 'early' | 'late' }))}
                  disabled={formData.unknownTime}
                />
                조자시 (朝子時)
              </label>
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.grid} ${styles.dateGrid}`}>
        <Input
          label="년"
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
          label="월"
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
          label="일"
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

      <div className={styles.checkboxField}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="isLunar"
            checked={formData.isLunar}
            onChange={handleChange}
          />
          음력
        </label>
      </div>
      
      <div className={`${styles.grid} ${styles.timeGrid}`}>
        <Input
          label="시"
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
          label="분"
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
          시간 모름
        </label>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>성별</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={handleChange}
            />
            남성
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={handleChange}
            />
            여성
          </label>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? '분석 중...' : '만세력 확인하기'}
      </Button>
    </form>
  );
};
