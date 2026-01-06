import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "지지 (地支) - 사주 명리학 가이드 | 오늘의 운세는",
    description: "지지(地支)는 땅의 기운을 나타내는 열두 가지 글자입니다. 자축인묘진사오미신유술해의 의미와 오행별 특성을 알아봅니다.",
};

const jijiStructure = [
    { han: "子", element: "水", season: "겨울의 시작", direction: "북", animal: "쥐", symbol: "시작과 지혜" },
    { han: "丑", element: "土", season: "겨울의 끝", direction: "북북동", animal: "소", symbol: "인내와 준비" },
    { han: "寅", element: "木", season: "봄의 시작", direction: "동북", animal: "호랑이", symbol: "도전과 성장" },
    { han: "卯", element: "木", season: "봄의 절정", direction: "동", animal: "토끼", symbol: "조화와 감성" },
    { han: "辰", element: "土", season: "봄의 끝", direction: "동남", animal: "용", symbol: "융합과 변화" },
    { han: "巳", element: "火", season: "여름의 시작", direction: "남동", animal: "뱀", symbol: "직관과 표현" },
    { han: "午", element: "火", season: "여름의 정점", direction: "남", animal: "말", symbol: "열정과 추진" },
    { han: "未", element: "土", season: "여름의 끝", direction: "남남서", animal: "양", symbol: "포용과 감정" },
    { han: "申", element: "金", season: "가을의 시작", direction: "서남", animal: "원숭이", symbol: "논리와 판단" },
    { han: "酉", element: "金", season: "가을의 절정", direction: "서", animal: "닭", symbol: "결단과 완성" },
    { han: "戌", element: "土", season: "가을의 끝", direction: "서북", animal: "개", symbol: "보호와 책임" },
    { han: "亥", element: "水", season: "겨울의 한가운데", direction: "북북서", animal: "돼지", symbol: "감성와 순수" },
];

const suJiji = [
    {
        name: "子(자)",
        desc: "겨울의 시작, 새로운 순환의 출발점입니다. 머리가 빠르고 순발력이 뛰어나며, 변화에 강한 적응력을 가집니다.",
        deficiency: "감정이 메마르고 융통성 부족",
        balance: "지혜롭고 감각적인 판단",
        excess: "생각이 많고 불안정한 내면"
    },
    {
        name: "亥(해)",
        desc: "겨울의 중심, 내면의 감성과 상상력이 풍부한 자리입니다. 감수성이 깊고, 타인에 대한 이해력이 높습니다.",
        deficiency: "감정 표현이 서툴고 냉정해 보임",
        balance: "포용력과 예술적 감성이 조화",
        excess: "지나친 감정 몰입, 자기소모"
    }
];

const mokJiji = [
    {
        name: "寅(인)",
        desc: "봄의 시작, 모든 에너지가 솟구치는 자리입니다. 리더십과 결단력이 강하고, 목표를 향한 추진력이 뚜렷합니다.",
        deficiency: "자신감 부족, 실행력 저하",
        balance: "진취적이고 용감한 추진력",
        excess: "성급함, 과도한 경쟁심"
    },
    {
        name: "卯(묘)",
        desc: "봄의 절정, 조화와 예술성이 돋보이는 자리입니다. 감성적이고 유연하며, 협력과 관계 조정에 능합니다.",
        deficiency: "소극적, 자기 주장 부족",
        balance: "조화롭고 감각적인 표현력",
        excess: "예민함, 감정기복 과다"
    }
];

const hwaJiji = [
    {
        name: "巳(사)",
        desc: "여름의 시작, 내면의 열정이 점차 드러나는 시기입니다. 관찰력과 통찰력이 뛰어나며, 매력적인 표현력이 있습니다.",
        deficiency: "표현력 부족, 소극적 태도",
        balance: "직관적이고 재치 있는 사고",
        excess: "충동적, 감정적으로 예민"
    },
    {
        name: "午(오)",
        desc: "여름의 정점, 빛과 생명력이 가장 강한 자리입니다. 솔직하고 활달하며, 사회적 활동성이 매우 높습니다.",
        deficiency: "활력 저하, 의욕 상실",
        balance: "밝고 당당한 에너지",
        excess: "자존심 과다, 감정적 폭발"
    }
];

const toJiji = [
    {
        name: "丑(축)",
        desc: "겨울의 끝, 인내와 준비의 자리입니다. 성실하고 꾸준하며, 현실적인 판단력을 지닙니다.",
        deficiency: "생활 기반 약화",
        balance: "인내와 실속이 조화",
        excess: "완고하고 느린 대응"
    },
    {
        name: "辰(진)",
        desc: "봄의 끝, 변화와 융합의 자리입니다. 새로운 시도를 즐기고, 잠재력을 실현시키는 힘을 가집니다.",
        deficiency: "추진력 약화, 소극성",
        balance: "유연한 변화 대응",
        excess: "산만함, 방향성 불분명"
    },
    {
        name: "未(미)",
        desc: "여름의 끝, 감정적 교류와 포용의 시기입니다. 감성적이며 배려심이 깊고, 관계 중심적입니다.",
        deficiency: "정서적 불안, 공감력 저하",
        balance: "따뜻한 감정과 조화로운 관계",
        excess: "감정 과잉, 우유부단"
    },
    {
        name: "戌(술)",
        desc: "가을의 끝, 책임과 보호의 자리입니다. 의리와 신뢰를 중시하며, 자신의 영역을 지키는 성향이 강합니다.",
        deficiency: "책임감 부족, 무기력함",
        balance: "충실하고 신뢰받는 인품",
        excess: "고집, 보수성 강화"
    }
];

const geumJiji = [
    {
        name: "申(신)",
        desc: "가을의 시작, 분석력과 논리적 사고가 강합니다. 지적이며 실용적인 성향으로, 일 처리 능력이 뛰어납니다.",
        deficiency: "판단력 부족, 우유부단함",
        balance: "논리적, 효율적 사고",
        excess: "비판적, 냉정한 태도"
    },
    {
        name: "酉(유)",
        desc: "가을의 절정, 완성과 정리의 자리입니다. 미적 감각이 뛰어나고, 깔끔한 성격과 정확성을 중시합니다.",
        deficiency: "정리 능력 부족, 미완의 일 많음",
        balance: "완벽한 마무리, 정돈된 사고",
        excess: "예민함, 지나친 완벽주의"
    }
];

export default function JijiGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>지지(地支)</h1>
                <p className={styles.subtitle}>子 · 丑 · 寅 · 卯 · 辰 · 巳 · 午 · 未 · 申 · 酉 · 戌 · 亥</p>

                <div className={styles.description}>
                    <p>
                        지지(地支)는 땅의 기운을 나타내는 열두 가지 글자입니다.  
                        '지(地)'는 형체가 있는 물질의 세계를 뜻하고, '지(支)'는 그 에너지를 지탱하는 뿌리라는 의미를 가집니다.  
                        즉, 지지는 <strong>"내면의 기운"</strong>, 즉 감정·습관·잠재의식·인연의 뿌리를 상징합니다.
                    </p>
                    <br />
                    <p>
                        천간이 하늘의 기운으로 '표현되는 나'를 나타낸다면,  
                        지지는 땅의 기운으로 '내면의 나'를 보여줍니다.  
                        그래서 지지를 이해하면 성격의 바탕, 감정의 리듬, 그리고 인생의 주기를 읽을 수 있습니다.
                    </p>
                    <br />
                    <p>
                        지지는 12달, 12시간, 12띠(生肖)와 대응하며,  
                        계절의 흐름 속에서 인간의 에너지가 어떻게 변화하는지를 설명합니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>지지의 구성</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>지지</th>
                                <th>오행</th>
                                <th>계절</th>
                                <th>방향</th>
                                <th>띠</th>
                                <th>상징</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jijiStructure.map((item) => (
                                <tr key={item.han}>
                                    <td style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '1.1rem', fontWeight: 'bold' }}>{item.han}</td>
                                    <td>{item.element}</td>
                                    <td>{item.season}</td>
                                    <td>{item.direction}</td>
                                    <td>{item.animal}</td>
                                    <td>{item.symbol}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>水의 지지 — 子(자) · 亥(해)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        겨울 · 북쪽 · 지혜와 내면의 깊이
                    </p>
                    <div className={styles.itemList}>
                        {suJiji.map((item) => (
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
                    <h2 className={styles.sectionTitle}>木의 지지 — 寅(인) · 卯(묘)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        봄 · 동쪽 · 성장과 확장의 기운
                    </p>
                    <div className={styles.itemList}>
                        {mokJiji.map((item) => (
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
                    <h2 className={styles.sectionTitle}>火의 지지 — 巳(사) · 午(오)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        여름 · 남쪽 · 활력과 표현의 기운
                    </p>
                    <div className={styles.itemList}>
                        {hwaJiji.map((item) => (
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
                    <h2 className={styles.sectionTitle}>土의 지지 — 丑(축) · 辰(진) · 未(미) · 戌(술)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        환절기 · 중앙 · 안정과 현실의 기운
                    </p>
                    <div className={styles.itemList}>
                        {toJiji.map((item) => (
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
                    <h2 className={styles.sectionTitle}>金의 지지 — 申(신) · 酉(유)</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', fontStyle: 'italic' }}>
                        가을 · 서쪽 · 결단과 수확의 기운
                    </p>
                    <div className={styles.itemList}>
                        {geumJiji.map((item) => (
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
                        지지는 인생의 '뿌리'를 이루는 요소입니다.  
                        사람의 감정, 본능, 습관, 인연의 성향이 모두 지지에 담겨 있습니다.  
                        천간이 '하늘의 줄기'라면, 지지는 '땅의 뿌리'로서,  
                        이 두 가지의 조화가 이루어질 때 인생의 흐름이 안정되고 균형을 이룹니다.
                    </p>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/chungan" className={styles.navLink}>← 천간 알아보기</Link>
                    <Link href="/guide/ohaeng" className={styles.navLink}>오행 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
