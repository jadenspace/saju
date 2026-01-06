import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "사주팔자란? - 사주 명리학 가이드 | 오늘의 운세는",
    description: "사주팔자(四柱八字)의 의미와 구조를 알아봅니다. 년주, 월주, 일주, 시주의 네 기둥과 천간, 지지의 여덟 글자로 운명을 읽는 방법을 설명합니다.",
};

const pillars = [
    {
        name: "년주 (年柱)",
        period: "0~15세",
        meaning: "조상, 부모님, 어린 시절의 환경",
        description: "태어난 해의 기운입니다. 나의 뿌리이자 기본 성격을 형성하는 토대예요. 가문의 배경, 조상의 덕, 유년기의 환경을 나타냅니다."
    },
    {
        name: "월주 (月柱)",
        period: "16~30세",
        meaning: "부모, 형제자매, 청년기",
        description: "태어난 달의 기운입니다. 사회생활과 직업운을 보는 가장 중요한 기둥이에요. 사회에서의 활동력, 직업적 성향을 나타냅니다."
    },
    {
        name: "일주 (日柱)",
        period: "31~45세",
        meaning: "나 자신과 배우자, 중년기",
        description: "태어난 날의 기운입니다. 사주의 중심이자 나의 핵심 본질이에요. 일간(日干)은 '나 자신'을 상징하며, 모든 해석의 기준점입니다."
    },
    {
        name: "시주 (時柱)",
        period: "46세 이후",
        meaning: "자녀, 말년의 모습",
        description: "태어난 시간의 기운입니다. 인생의 결실과 말년의 모습을 보여줘요. 자녀운, 노후의 건강과 환경을 나타냅니다."
    }
];

const cheongan = [
    { han: "甲", kor: "갑", element: "목", desc: "큰 나무처럼 곧고 당당함" },
    { han: "乙", kor: "을", element: "목", desc: "풀이나 덩굴처럼 유연하고 부드러움" },
    { han: "丙", kor: "병", element: "화", desc: "태양처럼 밝고 따뜻함" },
    { han: "丁", kor: "정", element: "화", desc: "촛불처럼 작지만 따뜻한 빛" },
    { han: "戊", kor: "무", element: "토", desc: "산이나 언덕처럼 든든함" },
    { han: "己", kor: "기", element: "토", desc: "밭의 흙처럼 부드럽고 기름짐" },
    { han: "庚", kor: "경", element: "금", desc: "쇠나 바위처럼 단단함" },
    { han: "辛", kor: "신", element: "금", desc: "보석이나 금속처럼 반짝임" },
    { han: "壬", kor: "임", element: "수", desc: "바다나 큰 강처럼 넓고 깊음" },
    { han: "癸", kor: "계", element: "수", desc: "이슬이나 비처럼 작고 부드러움" }
];

const jiji = [
    { han: "子", kor: "자", animal: "쥐", time: "23:00~01:00", season: "겨울" },
    { han: "丑", kor: "축", animal: "소", time: "01:00~03:00", season: "겨울" },
    { han: "寅", kor: "인", animal: "호랑이", time: "03:00~05:00", season: "봄" },
    { han: "卯", kor: "묘", animal: "토끼", time: "05:00~07:00", season: "봄" },
    { han: "辰", kor: "진", animal: "용", time: "07:00~09:00", season: "봄" },
    { han: "巳", kor: "사", animal: "뱀", time: "09:00~11:00", season: "여름" },
    { han: "午", kor: "오", animal: "말", time: "11:00~13:00", season: "여름" },
    { han: "未", kor: "미", animal: "양", time: "13:00~15:00", season: "여름" },
    { han: "申", kor: "신", animal: "원숭이", time: "15:00~17:00", season: "가을" },
    { han: "酉", kor: "유", animal: "닭", time: "17:00~19:00", season: "가을" },
    { han: "戌", kor: "술", animal: "개", time: "19:00~21:00", season: "가을" },
    { han: "亥", kor: "해", animal: "돼지", time: "21:00~23:00", season: "겨울" }
];

export default function SajuGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>사주팔자란?</h1>
                <p className={styles.subtitle}>四柱八字 - 네 기둥, 여덟 글자</p>

                <div className={styles.description}>
                    <p>
                        사주팔자(四柱八字)는 태어난 <strong>년, 월, 일, 시</strong>의 네 기둥(四柱)과
                        각 기둥을 이루는 <strong>천간과 지지</strong>의 여덟 글자(八字)를 말합니다.
                    </p>
                    <br />
                    <p>
                        이 8글자가 내 인생의 설계도이자 타고난 운명의 지도입니다.
                        각 기둥은 인생의 다른 시기와 영역을 나타내며,
                        글자들 간의 관계를 통해 성격, 재능, 운의 흐름을 파악합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>사주의 구조</h2>
                    <div className={styles.description} style={{ borderLeft: 'none', textAlign: 'center' }}>
                        <pre style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.8 }}>
{`        시주    일주    월주    년주
        ─────────────────────────
천간 →   ○      ○      ○      ○
지지 →   ○      ○      ○      ○
        ─────────────────────────
             ↑
          일간(나)`}
                        </pre>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>네 기둥 (四柱)</h2>
                    <div className={styles.itemList}>
                        {pillars.map((pillar) => (
                            <div key={pillar.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{pillar.name}</div>
                                        <div className={styles.itemHanja}>{pillar.period} · {pillar.meaning}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{pillar.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>천간 (天干) - 하늘의 기운</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
                        천간은 하늘의 기운을 나타내는 10개의 글자입니다. 양과 음이 번갈아 나타나며, 오행(목화토금수)의 성질을 담고 있습니다.
                    </p>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>한자</th>
                                <th>한글</th>
                                <th>오행</th>
                                <th>의미</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cheongan.map((item) => (
                                <tr key={item.han}>
                                    <td style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '1.1rem' }}>{item.han}</td>
                                    <td>{item.kor}</td>
                                    <td>{item.element}</td>
                                    <td>{item.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>지지 (地支) - 땅의 기운</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
                        지지는 땅의 기운을 나타내는 12개의 글자입니다. 12동물(띠)과 연결되며, 시간과 계절을 나타냅니다.
                    </p>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>한자</th>
                                <th>한글</th>
                                <th>동물</th>
                                <th>시간</th>
                                <th>계절</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jiji.map((item) => (
                                <tr key={item.han}>
                                    <td style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '1.1rem' }}>{item.han}</td>
                                    <td>{item.kor}</td>
                                    <td>{item.animal}</td>
                                    <td>{item.time}</td>
                                    <td>{item.season}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide" className={styles.navLink}>← 가이드 목록</Link>
                    <Link href="/guide/chungan" className={styles.navLink}>천간 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
