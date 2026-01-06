import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "일간 (日干) - 사주 명리학 가이드 | 오늘의 운세는",
    description: "일간(日干)은 사주팔자에서 나 자신을 나타내는 중심 글자입니다. 일간의 의미와 오행별 특성을 알아봅니다.",
};

const ilganStructure = [
    { element: "木", yang: "甲(갑목)", yin: "乙(을목)", keyword: "성장, 창조, 의지" },
    { element: "火", yang: "丙(병화)", yin: "丁(정화)", keyword: "열정, 표현, 따뜻함" },
    { element: "土", yang: "戊(무토)", yin: "己(기토)", keyword: "안정, 신뢰, 실용성" },
    { element: "金", yang: "庚(경금)", yin: "辛(신금)", keyword: "결단, 정의, 판단" },
    { element: "水", yang: "壬(임수)", yin: "癸(계수)", keyword: "지혜, 감성, 순응" },
];

const mokIlgan = [
    {
        name: "甲日主 (갑목일간)",
        desc: "큰 나무처럼 곧고 강한 의지를 지닌 사람입니다. 리더십이 강하고, 목표를 향해 직선적으로 나아갑니다. 정직하고 주관이 뚜렷하며, 한 번 정한 일은 끝까지 밀어붙이는 추진력이 있습니다.",
        deficiency: "융통성 부족, 지나친 직선적 태도",
        balance: "원칙과 리더십이 조화된 성향",
        excess: "완고함, 타인의 의견을 무시하기 쉬움"
    },
    {
        name: "乙日主 (을목일간)",
        desc: "덩굴과 꽃처럼 유연하고 감각적인 사람입니다. 상황에 따라 부드럽게 대처하며, 감성적이고 사교적입니다. 세심함과 미적 감각이 뛰어나지만, 결정은 신중하게 내리는 편입니다.",
        deficiency: "주도성 약함, 타인의 영향 과다",
        balance: "부드럽고 조화로운 관계 유지",
        excess: "감정기복, 의존 성향 강화"
    }
];

const hwaIlgan = [
    {
        name: "丙日主 (병화일간)",
        desc: "태양처럼 밝고 당당한 성향입니다. 솔직하고 표현이 명확하며, 자신의 가치관이 분명합니다. 리더십이 뛰어나며, 사람들에게 긍정적인 에너지를 전파합니다.",
        deficiency: "활력 부족, 자신감 결여",
        balance: "따뜻하고 솔직한 리더형",
        excess: "자존심 과도, 감정 폭발"
    },
    {
        name: "丁日主 (정화일간)",
        desc: "촛불처럼 섬세하고 따뜻한 성향입니다. 감정의 결이 세밀하고, 타인을 배려하며, 예술적 감수성이 풍부합니다. 분석력과 감성의 균형이 좋아 감정 표현이 자연스럽습니다.",
        deficiency: "소극적, 감정 표현의 억제",
        balance: "따뜻함과 지혜가 공존",
        excess: "예민함, 불안정한 감정 흐름"
    }
];

const toIlgan = [
    {
        name: "戊日主 (무토일간)",
        desc: "산처럼 크고 든든한 성격으로, 책임감과 신뢰성이 높습니다. 상황을 안정시키고 중재하는 능력이 탁월하며, 믿음직한 성향으로 사람들에게 신뢰를 줍니다.",
        deficiency: "추진력 부족, 결단의 지연",
        balance: "안정과 포용이 조화된 성격",
        excess: "고집과 완고함으로 인한 고립"
    },
    {
        name: "己日主 (기토일간)",
        desc: "논밭의 흙처럼 세밀하고 실용적인 성향입니다. 세부적인 계획에 강하며, 현실적인 판단을 중요시합니다. 꼼꼼하고 성실하지만, 과하면 지나친 걱정이나 잔소리로 이어질 수 있습니다.",
        deficiency: "현실감 약화, 불안정한 기반",
        balance: "신중하고 실속 있는 사고",
        excess: "걱정 과다, 변화에 둔감"
    }
];

const geumIlgan = [
    {
        name: "庚日主 (경금일간)",
        desc: "강철처럼 단단하고 직선적인 성향입니다. 결단력, 추진력, 정의감이 강하며, 명확한 기준으로 세상을 판단합니다. 논리적이지만 감정 표현이 서툴 수 있습니다.",
        deficiency: "결단력 약화, 우유부단함",
        balance: "단호함과 공정성이 조화",
        excess: "완고함, 냉정한 태도"
    },
    {
        name: "辛日主 (신금일간)",
        desc: "보석처럼 섬세하고 정제된 성격입니다. 미적 감각과 판단력이 뛰어나며, 깔끔하고 예리한 사고를 가집니다. 완벽을 추구하지만, 때로는 지나친 비판으로 흐르기 쉽습니다.",
        deficiency: "자신감 부족, 결단력 저하",
        balance: "예리하고 세련된 판단력",
        excess: "비판적, 까다로운 태도"
    }
];

const suIlgan = [
    {
        name: "壬日主 (임수일간)",
        desc: "대양의 물처럼 깊고 포용력이 큽니다. 상황에 따라 유연하게 대처하며, 인생을 넓은 시야로 바라봅니다. 지적이고 탐구심이 강하지만, 방향이 분산되면 중심을 잃기 쉽습니다.",
        deficiency: "목표의식 약화, 집중력 부족",
        balance: "포용력과 통찰력이 조화",
        excess: "산만함, 감정의 불안정"
    },
    {
        name: "癸日主 (계수일간)",
        desc: "비와 이슬처럼 섬세하고 감성적인 성향입니다. 감정의 깊이가 있으며, 타인의 마음을 잘 이해합니다. 사색과 예술적 표현에 강하지만, 불안이나 우울감이 쉽게 찾아올 수 있습니다.",
        deficiency: "감수성 부족, 무감각한 태도",
        balance: "지혜롭고 감성적인 조화",
        excess: "예민함, 내면 피로감 증가"
    }
];

export default function IlganGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>일간(日干)</h1>
                <p className={styles.subtitle}>나를 나타내는 글자</p>

                <div className={styles.description}>
                    <p>
                        일간(日干)은 사주팔자에서 <strong>'나 자신'을 나타내는 중심 글자</strong>입니다.  
                        사주의 네 기둥(연주·월주·일주·시주) 가운데, <strong>'일주(日柱)'의 천간</strong>이 바로 일간입니다.  
                        이 글자가 사주의 주인공이며, 모든 해석의 기준점이 됩니다.
                    </p>
                    <br />
                    <p>
                        하늘의 기운을 담은 열 가지 천간(甲·乙·丙·丁·戊·己·庚·辛·壬·癸) 중  
                        내가 태어난 날의 천간이 무엇인가에 따라 성격, 행동 패턴, 사고방식, 대인관계가 결정됩니다.  
                        즉, 일간은 <strong>나의 본질, 성향, 삶의 방향성</strong>을 가장 직접적으로 보여줍니다.
                    </p>
                    <br />
                    <p>
                        사주를 해석할 때는 다른 기둥(연, 월, 시)보다 일간이 중심이며,  
                        다른 요소들은 이 일간을 '도와주는가(생, 합)' 또는 '제어하는가(극, 충)'로 판단합니다.  
                        따라서 일간을 이해하는 것은 명리학의 출발점이자 핵심이라 할 수 있습니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>일간의 기본 구조</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>오행</th>
                                <th>양간</th>
                                <th>음간</th>
                                <th>핵심 키워드</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ilganStructure.map((item) => (
                                <tr key={item.element}>
                                    <td style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '1.1rem', fontWeight: 'bold' }}>{item.element}</td>
                                    <td>{item.yang}</td>
                                    <td>{item.yin}</td>
                                    <td>{item.keyword}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>木 일간 — 甲(갑목) · 乙(을목)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        봄의 기운 · 성장과 생명력의 에너지
                    </p>
                    <div className={styles.itemList}>
                        {mokIlgan.map((item) => (
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
                    <h2 className={styles.sectionTitle}>火 일간 — 丙(병화) · 丁(정화)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        여름의 기운 · 열정과 생명력의 에너지
                    </p>
                    <div className={styles.itemList}>
                        {hwaIlgan.map((item) => (
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
                    <h2 className={styles.sectionTitle}>土 일간 — 戊(무토) · 己(기토)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        환절기의 기운 · 안정과 현실감의 에너지
                    </p>
                    <div className={styles.itemList}>
                        {toIlgan.map((item) => (
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
                    <h2 className={styles.sectionTitle}>金 일간 — 庚(경금) · 辛(신금)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        가을의 기운 · 결단과 판단의 에너지
                    </p>
                    <div className={styles.itemList}>
                        {geumIlgan.map((item) => (
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
                    <h2 className={styles.sectionTitle}>水 일간 — 壬(임수) · 癸(계수)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        겨울의 기운 · 지혜와 순환의 에너지
                    </p>
                    <div className={styles.itemList}>
                        {suIlgan.map((item) => (
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
                        일간은 사주의 '중심축'이자 '나의 본질'입니다.  
                        천간과 지지, 대운과 세운의 모든 변화는 일간을 기준으로 해석됩니다.  
                        즉, 일간이 튼튼해야 인생의 기반이 안정되고, 외부의 운도 그 힘을 제대로 발휘할 수 있습니다.  
                        내 일간의 기운을 이해하는 것이 곧 <strong>나 자신을 아는 첫걸음</strong>입니다.
                    </p>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/ohaeng" className={styles.navLink}>← 오행 알아보기</Link>
                    <Link href="/guide/sipsin" className={styles.navLink}>십신 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
