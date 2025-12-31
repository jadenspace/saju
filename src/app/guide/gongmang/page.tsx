import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "공망(空亡)이란? - 사주 명리학 가이드 | 오늘의 운세는",
    description: "공망(空亡)의 의미와 해공(解空)을 알아봅니다. 60갑자에서 비어있는 지지의 의미와 공망이 해제되는 조건을 설명합니다.",
};

const gongmangTable = [
    { sun: "갑자순 (甲子旬)", range: "甲子 ~ 癸酉", gongmang: "戌, 亥", meaning: "술, 해가 공망" },
    { sun: "갑술순 (甲戌旬)", range: "甲戌 ~ 癸未", gongmang: "申, 酉", meaning: "신, 유가 공망" },
    { sun: "갑신순 (甲申旬)", range: "甲申 ~ 癸巳", gongmang: "午, 未", meaning: "오, 미가 공망" },
    { sun: "갑오순 (甲午旬)", range: "甲午 ~ 癸卯", gongmang: "辰, 巳", meaning: "진, 사가 공망" },
    { sun: "갑진순 (甲辰旬)", range: "甲辰 ~ 癸丑", gongmang: "寅, 卯", meaning: "인, 묘가 공망" },
    { sun: "갑인순 (甲寅旬)", range: "甲寅 ~ 癸亥", gongmang: "子, 丑", meaning: "자, 축이 공망" }
];

const pillarMeaning = [
    { pillar: "년지 공망", meaning: "조상덕 부족, 해외 인연, 독립심 강함", detail: "조상이나 부모로부터 받는 덕이 약할 수 있습니다. 대신 스스로 일어서는 독립심이 강하고, 해외와 인연이 있습니다." },
    { pillar: "월지 공망", meaning: "부모덕 부족, 청년기 방황, 직업 변동", detail: "청년기에 방황하거나 직업이 자주 바뀔 수 있습니다. 부모의 도움이 적어 스스로 길을 개척해야 합니다." },
    { pillar: "일지 공망", meaning: "배우자 인연 약함, 독신 경향", detail: "배우자와의 인연이 약하거나 결혼이 늦어질 수 있습니다. 정신적인 독립성이 강합니다." },
    { pillar: "시지 공망", meaning: "자녀덕 부족, 정신세계 발달", detail: "자녀로부터 받는 덕이 약할 수 있습니다. 대신 종교, 철학 등 정신세계에 관심이 깊어집니다." }
];

const haegongConditions = [
    { type: "육합 (六合)", desc: "공망 지지가 다른 지지와 육합을 이루면 해공", example: "子-丑합, 寅-亥합, 卯-戌합, 辰-酉합, 巳-申합, 午-未합" },
    { type: "삼합 (三合)", desc: "공망 지지가 삼합의 일원이 되면 해공", example: "申子辰(수국), 寅午戌(화국), 巳酉丑(금국), 亥卯未(목국)" },
    { type: "육충 (六冲)", desc: "공망 지지가 다른 지지와 충을 이루면 해공", example: "子-午충, 丑-未충, 寅-申충, 卯-酉충, 辰-戌충, 巳-亥충" }
];

export default function GongmangGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>공망 (空亡)</h1>
                <p className={styles.subtitle}>비어있는 자리, 비움을 통한 성장</p>

                <div className={styles.description}>
                    <p>
                        공망(空亡)은 <strong>"비어 있다"</strong>는 의미로, 60갑자 순서에서 빠진 두 지지를 말합니다.
                        천간은 10개, 지지는 12개이므로 한 순(旬)에 2개의 지지가 짝을 못 찾아 비게 됩니다.
                    </p>
                    <br />
                    <p>
                        공망은 해당 지지의 힘이 약 30% 정도만 작용한다고 봅니다.
                        다만 물질적 집착에서 벗어나 <strong>정신적 성장</strong>을 이룬다는 긍정적 해석도 있습니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>공망 판단 기준</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardTitle}>일공망 (日空亡)</div>
                            <p className={styles.cardDescription}>
                                일주를 기준으로 산출하는 공망<br />
                                <span style={{ color: '#4ade80' }}>원칙적인 판단 기준 (100%)</span>
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardTitle}>년공망 (年空亡)</div>
                            <p className={styles.cardDescription}>
                                년주를 기준으로 산출하는 공망<br />
                                <span style={{ color: '#fbbf24' }}>참고용 (30% 정도의 작용력)</span>
                            </p>
                        </div>
                    </div>
                    <p style={{ marginTop: '1rem', opacity: 0.7, fontSize: '0.9rem' }}>
                        * 대운에서 오는 공망은 공망으로 보지 않습니다. 세운 공망은 원국에 공망이 있을 때 해공 여부 확인용으로만 사용합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>육갑순별 공망표</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>순 (旬)</th>
                                <th>범위</th>
                                <th>공망 지지</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gongmangTable.map((row) => (
                                <tr key={row.sun}>
                                    <td>{row.sun}</td>
                                    <td>{row.range}</td>
                                    <td style={{ fontFamily: '"Noto Serif KR", serif' }}>{row.gongmang}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>위치별 공망의 의미</h2>
                    <div className={styles.itemList}>
                        {pillarMeaning.map((item) => (
                            <div key={item.pillar} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.pillar}</div>
                                        <div className={styles.itemHanja}>{item.meaning}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>해공 (解空) - 공망이 해제되는 조건</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
                        공망 지지가 다른 지지와 합(合)이나 충(冲)을 이루면 공망이 해제됩니다.
                        이를 해공(解空)이라고 하며, 공망의 부정적 영향이 줄어듭니다.
                    </p>
                    <div className={styles.itemList}>
                        {haegongConditions.map((item) => (
                            <div key={item.type} className={styles.item}>
                                <div className={styles.itemTitle} style={{ marginBottom: '0.5rem' }}>{item.type}</div>
                                <p className={styles.itemDescription}>{item.desc}</p>
                                <p style={{ marginTop: '0.5rem', opacity: 0.6, fontSize: '0.85rem' }}>
                                    예: {item.example}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>공망의 긍정적 해석</h2>
                    <div className={styles.description} style={{ borderLeftColor: '#4ade80' }}>
                        <p>
                            공망은 단순히 "비어서 힘이 없다"는 부정적 의미만 있는 것이 아닙니다.
                        </p>
                        <br />
                        <ul style={{ marginLeft: '1.5rem', lineHeight: 1.8 }}>
                            <li><strong>물질적 욕심에서 벗어남</strong> - 세속적 집착이 적어 정신적으로 자유로움</li>
                            <li><strong>창의적이고 독창적</strong> - 기존 틀에 얽매이지 않는 새로운 시각</li>
                            <li><strong>종교, 철학, 예술적 성향</strong> - 내면세계가 풍요로움</li>
                            <li><strong>독립적인 삶</strong> - 남에게 의존하지 않고 스스로 일어섬</li>
                        </ul>
                    </div>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/12sinsal" className={styles.navLink}>← 12신살이란?</Link>
                    <Link href="/guide" className={styles.navLink}>가이드 목록으로 →</Link>
                </div>
            </div>
        </main>
    );
}
