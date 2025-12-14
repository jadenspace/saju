'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import styles from './SajuForm.module.css';
import KoreanLunarCalendar from 'korean-lunar-calendar';

// 로컬스토리지 키
const STORAGE_KEY_TRUE_SOLAR_TIME = 'saju_useTrueSolarTime';
const STORAGE_KEY_MIDNIGHT_MODE = 'saju_midnightMode';

export const SajuForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    birthDate: '', // YYYYMMDD
    birthTime: '', // HHMM
    gender: 'male',
    unknownTime: false,
    isLunar: false,
    isLeapMonth: false,
    useTrueSolarTime: true,
    applyDST: true,
    midnightMode: 'late' as 'early' | 'late',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  // 초기 마운트 여부 추적
  const isInitialMount = useRef(true);

  // 로컬스토리지에서 설정 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUseTrueSolarTime = localStorage.getItem(STORAGE_KEY_TRUE_SOLAR_TIME);
      const savedMidnightMode = localStorage.getItem(STORAGE_KEY_MIDNIGHT_MODE);

      setFormData(prev => ({
        ...prev,
        useTrueSolarTime: savedUseTrueSolarTime !== null ? savedUseTrueSolarTime === 'true' : true,
        midnightMode: (savedMidnightMode as 'early' | 'late') || 'late',
      }));
    }
  }, []);

  // 설정 변경 시 로컬스토리지에 저장 (초기 마운트 시 제외)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_TRUE_SOLAR_TIME, String(formData.useTrueSolarTime));
      localStorage.setItem(STORAGE_KEY_MIDNIGHT_MODE, formData.midnightMode);
    }
  }, [formData.useTrueSolarTime, formData.midnightMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => {
        const next = { ...prev, [name]: checked };

        // Clear birthTime if unknown time is checked
        if (name === 'unknownTime' && checked) {
          next.birthTime = '';
        }

        // Reset leap month if lunar is unchecked
        if (name === 'isLunar' && !checked) {
          next.isLeapMonth = false;
        }

        return next;
      });
    } else {
      // Validate numeric input for date and time
      if (name === 'birthDate' || name === 'birthTime') {
        if (!/^\d*$/.test(value)) return;
      }
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear error when user makes changes
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check Date format (YYYYMMDD)
    if (formData.birthDate.length !== 8) {
      setError('생년월일 8자리를 정확히 입력해주세요. (예: 19901225)');
      setLoading(false);
      return;
    }

    const year = parseInt(formData.birthDate.substring(0, 4));
    const month = parseInt(formData.birthDate.substring(4, 6));
    const day = parseInt(formData.birthDate.substring(6, 8));

    if (month < 1 || month > 12 || day < 1 || day > 31) {
      setError('유효하지 않은 날짜입니다.');
      setLoading(false);
      return;
    }

    // Check Time format (HHMM) if time is known
    let hour = '0';
    let minute = '0';

    if (!formData.unknownTime) {
      if (formData.birthTime.length !== 4) {
        setError('출생시간 4자리를 정확히 입력해주세요. (예: 1430)');
        setLoading(false);
        return;
      }
      hour = String(parseInt(formData.birthTime.substring(0, 2)));
      minute = String(parseInt(formData.birthTime.substring(2, 4)));

      if (parseInt(hour) < 0 || parseInt(hour) > 23 || parseInt(minute) < 0 || parseInt(minute) > 59) {
        setError('유효하지 않은 시간입니다.');
        setLoading(false);
        return;
      }
    }

    let finalYear = String(year);
    let finalMonth = String(month);
    let finalDay = String(day);

    // Convert lunar to solar if isLunar is checked
    if (formData.isLunar) {
      try {
        const calendar = new KoreanLunarCalendar();

        // 1. Attempt to set the date
        calendar.setLunarDate(
          year,
          month,
          day,
          formData.isLeapMonth // 윤달 여부 반영
        );

        // 2. Initial Conversion
        const solarDate = calendar.getSolarCalendar();

        // 3. Reverse Check: Convert back to Lunar to verify validity
        // If the library accepted a non-existent leap month, it might silently convert it to a normal month or a different date.
        // We must verify if the result actually matches what we asked for.
        calendar.setSolarDate(solarDate.year, solarDate.month, solarDate.day);
        const resultLunar = calendar.getLunarCalendar();

        if (formData.isLeapMonth && !resultLunar.intercalation) {
          setError(`${year}년 ${month}월에는 윤달이 없습니다.`);
          setLoading(false);
          return;
        }

        // Additional check: Ensure dates match exactly (catches invalid days like Feb 30)
        if (resultLunar.year !== year || resultLunar.month !== month || resultLunar.day !== day) {
          setError('유효하지 않은 음력 날짜입니다.');
          setLoading(false);
          return;
        }

        finalYear = String(solarDate.year);
        finalMonth = String(solarDate.month);
        finalDay = String(solarDate.day);
      } catch (err) {
        setError('유효하지 않은 음력 날짜입니다. 윤달 여부와 날짜를 확인해주세요.');
        setLoading(false);
        return;
      }
    }

    // Construct query params with converted solar date
    const params = new URLSearchParams({
      year: finalYear,
      month: finalMonth,
      day: finalDay,
      hour: hour,
      minute: minute,
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
                  <strong>본 사이트에서는 썸머타임 적용이 필수입니다.</strong><br />
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
                  <strong>기본값: 진태양시</strong><br />
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
                진태양시 <br className={styles.mobileBr} />(경도보정)
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
                표준시 <br className={styles.mobileBr} />(KST)
              </label>
            </div>
          </div>

          {/* 자시구분 */}
          <div className={styles.field}>
            <div className={styles.labelWithTooltip}>
              <label className={styles.label}>야자시 (夜子時) 설정</label>
              <div className={styles.tooltip}>
                <span className={styles.infoIcon}>ⓘ</span>
                <div className={styles.tooltipContent}>
                  <div className={styles.tooltipContent}>
                    <strong>기본값: 야자시 미적용</strong><br />
                    {formData.useTrueSolarTime ? '진태양시 기준 (23:30 ~ 00:30)' : '표준시 기준 (23:00 ~ 00:00)'} 사이 출생 시 처리 방식입니다.<br />
                    • 적용: 자시 시작(23:xx)을 내일의 시작으로 보아 일주가 바뀝니다.<br />
                    • 미적용: 자시 시작(23:xx)을 당일의 밤(야자시)으로 보아 일주가 유지됩니다.<br />
                  </div>
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
                야자시 적용
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
                야자시 미적용
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Date Input */}
      <div className={styles.inputGroup}>
        <div className={styles.inputHeader}>
          <label className={styles.inputLabel}>생년월일</label>
          <div className={styles.dateOptions}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isLunar"
                checked={formData.isLunar}
                onChange={handleChange}
              />
              음력
            </label>
            {formData.isLunar && (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isLeapMonth"
                  checked={formData.isLeapMonth}
                  onChange={handleChange}
                />
                윤달
              </label>
            )}
          </div>
        </div>
        <Input
          name="birthDate"
          type="text"
          inputMode="numeric"
          placeholder="19901225"
          value={formData.birthDate}
          onChange={handleChange}
          required
          maxLength={8}
          className={styles.mainInput}
        />
      </div>

      {/* Time Input */}
      <div className={styles.inputGroup}>
        <div className={styles.inputHeader}>
          <label className={styles.inputLabel}>출생시간</label>
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
        <Input
          name="birthTime"
          type="text"
          inputMode="numeric"
          placeholder="2200"
          value={formData.birthTime}
          onChange={handleChange}
          required={!formData.unknownTime}
          disabled={formData.unknownTime}
          maxLength={4}
          className={styles.mainInput}
        />
      </div>

      {/* Gender Selection */}
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
