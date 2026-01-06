'use client';

import { useState } from 'react';
import { SearchType, useIljuSearch } from '../model/useIljuSearch';
import styles from './IljuSearchForm.module.css';

export const IljuSearchForm = () => {
    const { results, isSearching, search, GANS, JIS, ILJU_60 } = useIljuSearch();

    // Helper maps for display
    const GAN_MAP: Record<string, string> = {
        '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
        '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
    };
    const JI_MAP: Record<string, string> = {
        '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
        '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
    };

    const getDisplayValue = (val: string, type: SearchType) => {
        if (type === 'gan') return `${val}(${GAN_MAP[val] || ''})`;
        if (type === 'ji') return `${val}(${JI_MAP[val] || ''})`;
        if (type === 'ilju') {
            const gan = val[0];
            const ji = val[1];
            return `${val}(${GAN_MAP[gan] || ''}${JI_MAP[ji] || ''})`;
        }
        return val;
    };

    const [type, setType] = useState<SearchType>('ilju');
    const [value, setValue] = useState<string>(ILJU_60[0]);
    const [startYear, setStartYear] = useState(1950);
    const [endYear, setEndYear] = useState(2030);

    // Settings (Visual/Passthrough only for now, as search is date-based)
    const [useTrueSolarTime, setUseTrueSolarTime] = useState(true);
    const [midnightMode, setMidnightMode] = useState<'early' | 'late'>('late');

    const handleSearch = () => {
        search({
            type,
            value,
            startYear,
            endYear,
            useTrueSolarTime,
            midnightMode,
        });
    };

    const handleTypeChange = (newType: SearchType) => {
        setType(newType);
        // Reset value to first available of that type
        if (newType === 'gan') setValue(GANS[0]);
        else if (newType === 'ji') setValue(JIS[0]);
        else setValue(ILJU_60[0]);
    };

    return (
        <div className={styles.form}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>일주/일간/일지 검색기</h2>

            <div className={styles.inputGroup}>
                <div className={styles.searchTypeGroup}>
                    <button
                        className={`${styles.searchTypeBtn} ${type === 'ilju' ? styles.active : ''}`}
                        onClick={() => handleTypeChange('ilju')}
                    >
                        일주(기둥)
                    </button>
                    <button
                        className={`${styles.searchTypeBtn} ${type === 'gan' ? styles.active : ''}`}
                        onClick={() => handleTypeChange('gan')}
                    >
                        일간(천간)
                    </button>
                    <button
                        className={`${styles.searchTypeBtn} ${type === 'ji' ? styles.active : ''}`}
                        onClick={() => handleTypeChange('ji')}
                    >
                        일지(지지)
                    </button>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>검색 대상 선택</label>
                <select
                    className={styles.select}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                >
                    {type === 'ilju' && ILJU_60.map(v => (
                        <option key={v} value={v}>{getDisplayValue(v, 'ilju')}</option>
                    ))}
                    {type === 'gan' && GANS.map(v => (
                        <option key={v} value={v}>{getDisplayValue(v, 'gan')}</option>
                    ))}
                    {type === 'ji' && JIS.map(v => (
                        <option key={v} value={v}>{getDisplayValue(v, 'ji')}</option>
                    ))}
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>검색 기간 (년도)</label>
                <div className={styles.row}>
                    <input
                        type="number"
                        className={styles.yearInput}
                        value={startYear}
                        onChange={(e) => setStartYear(Number(e.target.value))}
                        min={1900}
                        max={2100}
                    />
                    <span style={{ alignSelf: 'center' }}>~</span>
                    <input
                        type="number"
                        className={styles.yearInput}
                        value={endYear}
                        onChange={(e) => setEndYear(Number(e.target.value))}
                        min={1900}
                        max={2100}
                    />
                </div>
            </div>

            {/* Settings Section - Per User Request */}
            <div className={styles.settingsSection}>
                <label className={styles.checkboxLabel} title="진태양시를 적용하여 시간을 계산합니다 (검색 결과는 표준 정오 기준 일주)">
                    <input
                        type="checkbox"
                        checked={useTrueSolarTime}
                        onChange={(e) => setUseTrueSolarTime(e.target.checked)}
                    />
                    진태양시 적용
                </label>

                <label className={styles.checkboxLabel} title={`야자시 설정. 체크 시 자시 시작(${useTrueSolarTime ? '23:30' : '23:00'})을 다음날로 처리합니다.`}>
                    <input
                        type="checkbox"
                        checked={midnightMode === 'early'}
                        onChange={(e) => setMidnightMode(e.target.checked ? 'early' : 'late')}
                    />
                    야자시 적용 (자시 시작 {useTrueSolarTime ? '23:30' : '23:00'} 이후 다음날 적용)
                </label>
                <p className={styles.helperText}>
                    * 검색 결과는 해당 날짜의 대표 일주(정오 기준)를 표시합니다.
                </p>
            </div>

            <button
                className={styles.submitButton}
                onClick={handleSearch}
                disabled={isSearching}
            >
                {isSearching ? '검색 중...' : '검색하기'}
            </button>

            {results.length > 0 && (
                <div className={styles.resultsArea}>
                    <div className={styles.resultsHeader}>
                        <span>총 {results.length}개의 날짜가 발견되었습니다.</span>
                    </div>
                    <div className={styles.resultsList}>
                        {results.map((date) => (
                            <div key={date} className={styles.resultItem}>
                                {date}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {results.length === 0 && !isSearching && (
                <div style={{ textAlign: 'center', opacity: 0.6, marginTop: '1rem' }}>
                    결과가 없습니다.
                </div>
            )}
        </div>
    );
};
