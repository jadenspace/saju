import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "세운 (歲運) - 사주 명리학 가이드 | 오늘의 운세는",
    description: "세운(歲運)은 해마다 바뀌는 운의 흐름으로, 신년운세의 근본이 되는 개념입니다. 세운의 의미와 해석 방법을 알아봅니다.",
};

const seunStructure = [
    {
        element: "연간(天干)",
        meaning: "사회적 분위기, 외부 환경, 대외적 기운"
    },
    {
        element: "연지(地支)",
        meaning: "감정, 인간관계, 내면의 변화"
    },
    {
        element: "대운과의 관계",
        meaning: "큰 흐름과의 조화 또는 충돌"
    },
    {
        element: "일간과의 관계",
        meaning: "개인의 운세 기복, 건강, 심리적 영향"
    }
];

export default function SeunGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>세운(歲運)</h1>
                <p className={styles.subtitle}>매년 찾아오는 운의 변화</p>

                <div className={styles.description}>
                    <p>
                        세운(歲運)은 <strong>해마다 바뀌는 운의 흐름</strong>, 즉 '신년운세'의 근본이 되는 개념입니다.  
                        대운이 10년 단위의 큰 흐름이라면, 세운은 그 속에서 미세하게 움직이는 <strong>매년의 에너지 변화</strong>입니다.
                    </p>
                    <br />
                    <p>
                        한 해의 기운은 '그 해의 천간과 지지'로 결정되며,  
                        예를 들어 2026년 병오년(丙午年)의 경우, 하늘의 기운은 병화(丙火), 땅의 기운은 오화(午火)입니다.  
                        즉, 불의 에너지가 강한 해로, 열정과 변화가 강조됩니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>세운의 구성</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>요소</th>
                                <th>의미</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seunStructure.map((item) => (
                                <tr key={item.element}>
                                    <td style={{ fontWeight: 'bold' }}>{item.element}</td>
                                    <td>{item.meaning}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>세운 해석의 핵심</h2>
                    <div className={styles.itemList}>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>1. 대운 + 세운의 조합</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                대운은 기초 방향, 세운은 그 위의 세부 흐름입니다.  
                                같은 오행이 겹치면 기운이 강화되고, 상극 관계면 변화와 갈등이 생깁니다.
                            </p>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>2. 일간 중심의 판단</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                올해 들어오는 천간·지지가 나에게 어떤 작용을 하는지 봅니다.  
                                예를 들어, 일간이 목(木)인데 세운이 화(火)라면, 성장과 성취의 시기입니다.  
                                반면 세운이 금(金)이라면 제약과 도전의 시기일 수 있습니다.
                            </p>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>3. 세운의 의미는 '기회와 조정'</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                좋은 운이 들어와도 준비되지 않으면 흘러가고,  
                                다소 불리한 운이라도 조심스럽게 대응하면 문제없이 넘어갑니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>세운 활용법</h2>
                    <div className={styles.itemList}>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>목표 설정</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                세운의 흐름을 기반으로 한 해의 계획을 세웁니다.
                            </p>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>인간관계</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                충(衝)이나 형(刑)이 강한 해에는 말과 행동에 신중해야 합니다.
                            </p>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>건강 관리</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                자신의 오행 중 약한 부분과 관련된 장기나 생활습관을 보완합니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.description}>
                    <p>
                        세운은 인생의 '날씨'와 같습니다.  
                        날씨가 흐리다고 나쁜 해가 아니고, 맑다고 무조건 좋은 해도 아닙니다.  
                        자신의 대운과 세운을 함께 읽어내면, 한 해의 흐름을 조화롭게 만들어갈 수 있습니다.
                    </p>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/daeun" className={styles.navLink}>← 대운 알아보기</Link>
                    <Link href="/guide/yongsin" className={styles.navLink}>용신 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
