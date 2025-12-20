import { useState, useCallback } from 'react';
import { Solar } from 'lunar-javascript';
import { ILJU_60 } from '@/shared/lib/saju/data/IljuData';

export type SearchType = 'gan' | 'ji' | 'ilju';

export interface SearchParams {
    type: SearchType;
    value: string; // '甲', '子', or '甲子'
    startYear: number;
    endYear: number;
    useTrueSolarTime: boolean;
    midnightMode: 'early' | 'late';
}

const GANS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const JIS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const useIljuSearch = () => {
    const [results, setResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const search = useCallback((params: SearchParams) => {
        setIsSearching(true);
        setResults([]);

        // Run in a timeout to avoid blocking UI immediately, though this algo is fast
        setTimeout(() => {
            try {
                const { type, value, startYear, endYear } = params;
                const matches: string[] = [];

                // 1. Determine target GanZhi indices (0-59)
                const targetIndices: number[] = [];

                if (type === 'ilju') {
                    const idx = ILJU_60.indexOf(value);
                    if (idx !== -1) targetIndices.push(idx);
                } else if (type === 'gan') {
                    const ganIdx = GANS.indexOf(value);
                    if (ganIdx !== -1) {
                        for (let i = 0; i < 60; i++) {
                            if (i % 10 === ganIdx) targetIndices.push(i);
                        }
                    }
                } else if (type === 'ji') {
                    const jiIdx = JIS.indexOf(value);
                    if (jiIdx !== -1) {
                        for (let i = 0; i < 60; i++) {
                            if (i % 12 === jiIdx) targetIndices.push(i);
                        }
                    }
                }

                if (targetIndices.length === 0) {
                    setResults([]);
                    setIsSearching(false);
                    return;
                }

                // 2. Find matches using native Date loop for safety
                const startDate = new Date(startYear, 0, 1, 12, 0, 0);
                const limitDate = new Date(endYear, 11, 31, 12, 0, 0);

                // Find offsets in the first 60 days
                const validOffsets: number[] = [];

                for (let i = 0; i < 60; i++) {
                    const d = new Date(startDate);
                    d.setDate(d.getDate() + i);

                    const sol = Solar.fromYmdHms(d.getFullYear(), d.getMonth() + 1, d.getDate(), 12, 0, 0);
                    const lunar = sol.getLunar();
                    const dayGanZhi = lunar.getDayInGanZhiExact();

                    // Check if this GanZhi matches our target
                    const idx = ILJU_60.indexOf(dayGanZhi);
                    if (targetIndices.includes(idx)) {
                        validOffsets.push(i);
                    }
                }

                // 3. Generate all dates
                // Each offset repeats every 60 days
                for (const offset of validOffsets) {
                    let current = new Date(startDate);
                    current.setDate(current.getDate() + offset);

                    while (current <= limitDate) {
                        const y = current.getFullYear();
                        const m = String(current.getMonth() + 1).padStart(2, '0');
                        const d = String(current.getDate()).padStart(2, '0');
                        matches.push(`${y}-${m}-${d}`);

                        // Advance 60 days
                        current.setDate(current.getDate() + 60);
                    }
                }

                matches.sort();
                setResults(matches);
            } catch (e) {
                console.error(e);
            } finally {
                setIsSearching(false);
            }
        }, 10);
    }, []);

    return {
        results,
        isSearching,
        search,
        GANS,
        JIS,
        ILJU_60
    };
};
