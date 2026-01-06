import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "천간 (天干) - 사주 명리학 가이드 | 오늘의 운세는",
    description: "천간(天干)은 하늘의 기운을 상징하는 열 가지 기본 요소입니다. 갑을병정무기경신임계의 의미와 오행별 특성을 알아봅니다.",
};

const cheonganStructure = [
    { element: "木", yang: "甲(갑목)", yin: "乙(을목)", symbol: "생명력, 성장, 확장" },
    { element: "火", yang: "丙(병화)", yin: "丁(정화)", symbol: "열정, 표현, 변화" },
    { element: "土", yang: "戊(무토)", yin: "己(기토)", symbol: "안정, 조화, 현실감" },
    { element: "金", yang: "庚(경금)", yin: "辛(신금)", symbol: "결단, 정리, 통제" },
    { element: "水", yang: "壬(임수)", yin: "癸(계수)", symbol: "지혜, 유연성, 순환" },
];

const mokDetails = [
    {
        name: "甲(갑목)",
        desc: "큰 나무처럼 곧고 강한 추진력을 지닙니다. 정의감이 강하고 목표 지향적이며, 스스로 개척하려는 리더형 성향이 있습니다.",
        deficiency: "추진력 부족, 방향을 잡기 어려움",
        balance: "리더십과 성장 에너지가 조화로움",
        excess: "완고하고 타인의 의견을 받아들이기 어려움"
    },
    {
        name: "乙(을목)",
        desc: "덩굴이나 화초처럼 유연하고 감각적인 에너지를 가집니다. 타인과의 조화를 중시하며, 감성·예술적 표현이 풍부합니다.",
        deficiency: "주도성이 약하고 우유부단함",
        balance: "유연한 사고와 섬세한 감성 발휘",
        excess: "예민하고 감정 기복이 커짐"
    }
];

const hwaDetails = [
    {
        name: "丙(병화)",
        desc: "태양의 빛처럼 밝고 명확한 성질을 지닙니다. 솔직하고 외향적이며, 리더십과 추진력이 강합니다.",
        deficiency: "활력과 자신감 부족",
        balance: "밝고 명확한 에너지로 주변을 비춤",
        excess: "과도한 자존심과 직설로 인한 마찰"
    },
    {
        name: "丁(정화)",
        desc: "등불이나 촛불처럼 따뜻하고 세심한 에너지입니다. 섬세한 감성, 배려, 표현력이 특징이며, 예술적 재능이 두드러집니다.",
        deficiency: "감정 표현이 서툴고 소극적",
        balance: "따뜻한 마음과 안정된 감정",
        excess: "감정 기복이 심하고 예민함"
    }
];

const toDetails = [
    {
        name: "戊(무토)",
        desc: "산처럼 크고 단단한 땅의 기운입니다. 포용력, 책임감, 현실감각이 강하며, 신뢰받는 중심 역할을 합니다.",
        deficiency: "생활 기반 불안정, 자신감 부족",
        balance: "든든한 추진력과 인내력 발휘",
        excess: "고집이 세고 융통성이 부족"
    },
    {
        name: "己(기토)",
        desc: "논밭의 흙처럼 부드럽고 세밀한 기운을 지닙니다. 계획적이고 실용적이며, 세부적인 일 처리에 강점이 있습니다.",
        deficiency: "현실 감각 부족, 계획이 흐트러짐",
        balance: "안정적이고 꼼꼼한 현실 대응",
        excess: "걱정이 많고 변화에 둔감함"
    }
];

const geumDetails = [
    {
        name: "庚(경금)",
        desc: "날이 선 강철의 기운입니다. 결단력, 판단력, 추진력이 강하며, 공정함과 직설적인 성격을 지닙니다.",
        deficiency: "우유부단하고 결정이 느림",
        balance: "단호함과 공정성이 조화됨",
        excess: "완고하고 공격적 태도"
    },
    {
        name: "辛(신금)",
        desc: "다듬어진 보석의 기운입니다. 세련되고 정제된 감각, 예리한 통찰력, 미적 감수성이 강합니다.",
        deficiency: "판단력 부족, 우유부단함",
        balance: "깔끔하고 예리한 판단",
        excess: "비판적이고 예민함"
    }
];

const suDetails = [
    {
        name: "壬(임수)",
        desc: "바다의 넓은 물과 같습니다. 포용력과 적응력이 강하며, 지혜롭고 큰 비전을 품습니다.",
        deficiency: "목표의식 약하고 불안정함",
        balance: "유연한 사고와 통찰력 발휘",
        excess: "방향이 분산되고 감정 기복이 큼"
    },
    {
        name: "癸(계수)",
        desc: "비나 이슬처럼 세밀하고 감성적인 기운입니다. 직관, 감정의 섬세함, 사색적 성향이 강합니다.",
        deficiency: "감수성이 둔하고 무기력함",
        balance: "섬세하고 지혜로운 감정 표현",
        excess: "내면에 과도한 불안과 피로"
    }
];

export default function ChunganGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>천간(天干)</h1>
                <p className={styles.subtitle}>甲 · 乙 · 丙 · 丁 · 戊 · 己 · 庚 · 辛 · 壬 · 癸</p>

                <div className={styles.description}>
                    <p>
                        천간(天干)은 하늘의 기운을 상징하는 열 가지 기본 요소입니다.  
                        '천(天)'은 보이지 않는 하늘의 에너지, '간(干)'은 그 기운이 밖으로 드러나는 줄기라는 뜻을 가집니다.  
                        이 열 가지 천간은 음양오행(陰陽五行)의 원리에 따라 다섯 쌍으로 나뉘며, 각각 고유한 성질과 방향, 계절의 의미를 지닙니다.
                    </p>
                    <br />
                    <p>
                        사주에서 천간은 <strong>'겉으로 드러나는 성향과 표현 방식'</strong>을 나타냅니다.  
                        즉, 내가 세상과 소통하는 방식, 사고하는 패턴, 사회적 이미지 등이 천간을 통해 드러납니다.  
                        같은 오행이라도 '양(陽)'과 '음(陰)'의 차이에 따라 활동성과 섬세함이 달라집니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>천간의 구조</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>오행</th>
                                <th>양간</th>
                                <th>음간</th>
                                <th>상징</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cheonganStructure.map((item) => (
                                <tr key={item.element}>
                                    <td style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '1.1rem', fontWeight: 'bold' }}>{item.element}</td>
                                    <td>{item.yang}</td>
                                    <td>{item.yin}</td>
                                    <td>{item.symbol}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>木 — 甲(갑목) · 乙(을목)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        봄 · 동쪽 · 성장과 창조의 기운
                    </p>
                    <div className={styles.itemList}>
                        {mokDetails.map((item) => (
                            <div key={item.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.name}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.desc}</p>
                                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                                    <p><strong>결핍:</strong> {item.deficiency}</p>
                                    <p><strong>균형:</strong> {item.balance}</p>
                                    <p><strong>과다:</strong> {item.excess}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>火 — 丙(병화) · 丁(정화)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        여름 · 남쪽 · 열정과 생명력의 기운
                    </p>
                    <div className={styles.itemList}>
                        {hwaDetails.map((item) => (
                            <div key={item.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.name}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.desc}</p>
                                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                                    <p><strong>결핍:</strong> {item.deficiency}</p>
                                    <p><strong>균형:</strong> {item.balance}</p>
                                    <p><strong>과다:</strong> {item.excess}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>土 — 戊(무토) · 己(기토)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        환절기 · 중앙 · 안정과 신뢰의 기운
                    </p>
                    <div className={styles.itemList}>
                        {toDetails.map((item) => (
                            <div key={item.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.name}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.desc}</p>
                                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                                    <p><strong>결핍:</strong> {item.deficiency}</p>
                                    <p><strong>균형:</strong> {item.balance}</p>
                                    <p><strong>과다:</strong> {item.excess}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>金 — 庚(경금) · 辛(신금)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        가을 · 서쪽 · 결단과 정리의 기운
                    </p>
                    <div className={styles.itemList}>
                        {geumDetails.map((item) => (
                            <div key={item.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.name}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.desc}</p>
                                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                                    <p><strong>결핍:</strong> {item.deficiency}</p>
                                    <p><strong>균형:</strong> {item.balance}</p>
                                    <p><strong>과다:</strong> {item.excess}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>水 — 壬(임수) · 癸(계수)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        겨울 · 북쪽 · 지혜와 흐름의 기운
                    </p>
                    <div className={styles.itemList}>
                        {suDetails.map((item) => (
                            <div key={item.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.name}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.desc}</p>
                                <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                                    <p><strong>결핍:</strong> {item.deficiency}</p>
                                    <p><strong>균형:</strong> {item.balance}</p>
                                    <p><strong>과다:</strong> {item.excess}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.description}>
                    <p>
                        천간은 인간의 성격과 표현을 결정짓는 '하늘의 코드'입니다.  
                        어떤 천간이 일간(나 자신)을 이루는가에 따라 사고방식, 행동 패턴, 사회적 이미지가 달라집니다.  
                        천간의 균형이 잡히면 외부 세계와 조화롭게 교류할 수 있으며, 불균형할 경우 감정·인간관계·결정력에서 편차가 생기기도 합니다.
                    </p>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/saju" className={styles.navLink}>← 사주팔자란?</Link>
                    <Link href="/guide/jiji" className={styles.navLink}>지지 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
