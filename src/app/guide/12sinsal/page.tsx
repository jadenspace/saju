import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "12신살(十二神殺)이란? - 사주 명리학 가이드 | 운명의 나침반",
    description: "12신살(十二神殺)의 의미와 종류를 알아봅니다. 겁살, 재살, 천살, 지살, 연살, 월살, 망신살, 장성살, 반안살, 역마살, 육해살, 화개살을 설명합니다.",
};

const twelveSinsal = [
    {
        name: "겁살 (劫殺)",
        hanja: "劫殺",
        type: "흉",
        meaning: "강탈, 위험",
        description: "재물이나 명예를 빼앗길 수 있는 운이므로 과욕을 경계해야 합니다. 도둑, 강도의 의미가 있어 재물 관리에 신중해야 합니다.",
        advice: "욕심을 줄이고 안전에 주의하세요."
    },
    {
        name: "재살 (災殺)",
        hanja: "災殺",
        type: "흉",
        meaning: "재난, 관재수",
        description: "관재수나 재난을 만날 수 있으니 언행과 안전에 주의해야 합니다. 법적 분쟁, 사고 등을 조심해야 하는 시기입니다.",
        advice: "법적 문제를 피하고 안전 수칙을 지키세요."
    },
    {
        name: "천살 (天殺)",
        hanja: "天殺",
        type: "흉",
        meaning: "하늘의 재앙",
        description: "예상치 못한 어려움이 닥칠 수 있으니 겸손한 마음을 유지해야 합니다. 자연재해나 예측 불가능한 사건을 의미합니다.",
        advice: "겸손하게 처신하고 준비를 철저히 하세요."
    },
    {
        name: "지살 (地殺)",
        hanja: "地殺",
        type: "중",
        meaning: "땅의 재앙, 이동",
        description: "이사, 직장 이동 등 변화가 많은 시기입니다. 변화에 유연하게 대처하면 오히려 기회가 될 수 있습니다.",
        advice: "변화를 두려워하지 말고 새로운 환경에 적응하세요."
    },
    {
        name: "연살 (年殺)",
        hanja: "年殺 / 桃花殺",
        type: "길/흉",
        meaning: "도화살, 이성 인연",
        description: "이성에게 매력이 있고 인기가 좋습니다. 연애운이 활발해지며 사교성이 높아집니다. 도화살(桃花殺)이라고도 합니다.",
        advice: "인간관계에서 절제력을 유지하세요."
    },
    {
        name: "월살 (月殺)",
        hanja: "月殺",
        type: "흉",
        meaning: "고초, 곤경",
        description: "일시적인 어려움과 고초가 있을 수 있으나 인내하면 극복됩니다. 고난 속에서 성장할 수 있는 시기입니다.",
        advice: "인내심을 갖고 어려움을 견뎌내세요."
    },
    {
        name: "망신살 (亡身殺)",
        hanja: "亡身殺",
        type: "흉",
        meaning: "망신, 구설",
        description: "체면이 손상되거나 구설이 따를 수 있으니 말과 행동을 삼가야 합니다. 자신의 언행에 특히 주의가 필요합니다.",
        advice: "말을 아끼고 신중하게 행동하세요."
    },
    {
        name: "장성살 (將星殺)",
        hanja: "將星殺",
        type: "길",
        meaning: "리더십, 권위",
        description: "리더십과 권위가 생기는 시기입니다. 책임감을 갖고 행동하면 인정받을 수 있습니다. 지도자의 자질이 드러납니다.",
        advice: "리더로서 책임감 있게 행동하세요."
    },
    {
        name: "반안살 (攀鞍殺)",
        hanja: "攀鞍殺",
        type: "길",
        meaning: "안정, 신중",
        description: "안정과 여유가 있는 시기입니다. 급한 결정보다 신중함이 필요하며, 차분하게 일을 처리하면 좋은 결과를 얻습니다.",
        advice: "서두르지 말고 신중하게 판단하세요."
    },
    {
        name: "역마살 (驛馬殺)",
        hanja: "驛馬殺",
        type: "중",
        meaning: "이동, 변동",
        description: "이동, 출장, 해외 인연이 많습니다. 여행이나 무역에 좋은 운으로, 활동적인 직업에 유리합니다.",
        advice: "새로운 곳에서 기회를 찾아보세요."
    },
    {
        name: "육해살 (六害殺)",
        hanja: "六害殺",
        type: "흉",
        meaning: "육친 해로움",
        description: "가족이나 가까운 사람과 갈등이 생길 수 있으니 배려가 필요합니다. 인간관계에서 오해가 생기기 쉽습니다.",
        advice: "가족과 소통하고 배려하는 마음을 가지세요."
    },
    {
        name: "화개살 (華蓋殺)",
        hanja: "華蓋殺",
        type: "길/흉",
        meaning: "종교, 예술, 고독",
        description: "예술적 감각이 발휘되고 학문이나 종교에 관심이 깊어집니다. 고독한 가운데 깊은 정신세계를 탐구합니다.",
        advice: "예술이나 학문에 집중하면 성과가 있습니다."
    }
];

export default function TwelveSinsalGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>12신살 (十二神殺)</h1>
                <p className={styles.subtitle}>지지 간의 관계로 보는 12가지 운명의 신호</p>

                <div className={styles.description}>
                    <p>
                        12신살은 <strong>지지와 지지의 관계</strong>를 보는 신살입니다.
                        년지 또는 일지를 기준으로 다른 지지와의 관계에서 어떤 기운이 작용하는지 파악합니다.
                    </p>
                    <br />
                    <p>
                        '살(殺)'이라는 이름이 붙었지만 모두 나쁜 것은 아닙니다.
                        장성살, 반안살처럼 좋은 의미도 있고, 역마살, 화개살처럼 상황에 따라 길흉이 달라지는 것도 있습니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>12신살 길흉 분류</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardTitle} style={{ color: '#4ade80' }}>길신 (吉神)</div>
                            <p className={styles.cardDescription}>
                                장성살, 반안살<br />
                                <span style={{ opacity: 0.7 }}>긍정적인 기운을 가져오는 신살</span>
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardTitle} style={{ color: '#fbbf24' }}>중성</div>
                            <p className={styles.cardDescription}>
                                지살, 연살(도화살), 역마살, 화개살<br />
                                <span style={{ opacity: 0.7 }}>상황에 따라 길흉이 달라지는 신살</span>
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardTitle} style={{ color: '#f87171' }}>흉신 (凶神)</div>
                            <p className={styles.cardDescription}>
                                겁살, 재살, 천살, 월살, 망신살, 육해살<br />
                                <span style={{ opacity: 0.7 }}>주의가 필요한 신살</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>12신살 상세 설명</h2>
                    <div className={styles.itemList}>
                        {twelveSinsal.map((sinsal) => (
                            <div key={sinsal.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>
                                            {sinsal.name}
                                            <span className={`${styles.tag} ${
                                                sinsal.type === '길' ? styles.positive :
                                                sinsal.type === '흉' ? styles.negative : styles.neutral
                                            }`} style={{ marginLeft: '0.5rem' }}>
                                                {sinsal.type}
                                            </span>
                                        </div>
                                        <div className={styles.itemHanja}>{sinsal.hanja} · {sinsal.meaning}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{sinsal.description}</p>
                                <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
                                    <strong>조언:</strong> {sinsal.advice}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/12unsung" className={styles.navLink}>← 12운성이란?</Link>
                    <Link href="/guide/gongmang" className={styles.navLink}>공망 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
