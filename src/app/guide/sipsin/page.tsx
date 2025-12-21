import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "십신(十神)이란? - 사주 명리학 가이드 | 운명의 나침반",
    description: "십신(十神)의 의미와 종류를 알아봅니다. 비견, 겁재, 식신, 상관, 편재, 정재, 편관, 정관, 편인, 정인의 10가지 관계를 설명합니다.",
};

const sipsinData = [
    {
        name: "비견 (比肩)",
        hanja: "比肩",
        category: "비겁",
        type: "동료",
        description: "나와 똑같은 힘을 가진 쌍둥이 형제예요. 함께 힘을 합치기도 하고, 같은 걸 원해서 나눠야 할 때도 있어요.",
        keywords: ["동료", "경쟁", "독립심", "자존심"]
    },
    {
        name: "겁재 (劫財)",
        hanja: "劫財",
        category: "비겁",
        type: "라이벌",
        description: "나와 닮았지만 성격이 달라서 경쟁하는 라이벌이에요. 서로 자극이 되지만 때로는 내 몫을 가져가기도 해요.",
        keywords: ["경쟁", "도전", "야망", "승부욕"]
    },
    {
        name: "식신 (食神)",
        hanja: "食神",
        category: "식상",
        type: "표현",
        description: "내가 편하게 만들어낸 작품이에요. 맛있는 음식, 즐거운 놀이처럼 자연스럽게 나오는 재능과 여유를 뜻해요.",
        keywords: ["재능", "여유", "식복", "창작"]
    },
    {
        name: "상관 (傷官)",
        hanja: "傷官",
        category: "식상",
        type: "표현",
        description: "내가 적극적으로 표현하는 개성이에요. 예술적 재능, 말솜씨처럼 튀고 싶은 마음이지만, 너무 세면 규칙과 부딪혀요.",
        keywords: ["표현력", "창의성", "반항", "예술"]
    },
    {
        name: "편재 (偏財)",
        hanja: "偏財",
        category: "재성",
        type: "재물",
        description: "우연히 생긴 용돈, 복권 당첨 같은 거예요. 쉽게 들어오지만 쉽게 나가기도 해요. 아버지를 뜻하기도 해요.",
        keywords: ["횡재", "투자", "사업", "아버지"]
    },
    {
        name: "정재 (正財)",
        hanja: "正財",
        category: "재성",
        type: "재물",
        description: "꾸준히 모은 저금통이에요. 열심히 일해서 차곡차곡 쌓은 안정적인 재물이에요. 아내를 뜻하기도 해요.",
        keywords: ["저축", "안정", "성실", "아내"]
    },
    {
        name: "편관 (偏官)",
        hanja: "偏官 / 七殺",
        category: "관성",
        type: "통제",
        description: "엄격한 체육 선생님 같아요. 나를 강하게 훈련시키고 단련시켜요. 칠살(七殺)이라고도 불러요. 압박감을 주지만 강해지게 해요.",
        keywords: ["권위", "도전", "극복", "무관"]
    },
    {
        name: "정관 (正官)",
        hanja: "正官",
        category: "관성",
        type: "통제",
        description: "자상한 담임 선생님 같아요. 규칙을 알려주고 바른 길로 이끌어줘요. 명예, 직장, 남편을 뜻하기도 해요.",
        keywords: ["명예", "직장", "책임", "남편"]
    },
    {
        name: "편인 (偏印)",
        hanja: "偏印 / 梟神",
        category: "인성",
        type: "지원",
        description: "독특한 방식으로 가르쳐주는 삼촌이나 이모 같아요. 특별한 지식, 창의적인 생각을 주지만 때로는 엉뚱해요. 효신(梟神)이라고도 해요.",
        keywords: ["창의", "학문", "비정통", "고독"]
    },
    {
        name: "정인 (正印)",
        hanja: "正印",
        category: "인성",
        type: "지원",
        description: "따뜻하게 보살펴주는 엄마 같아요. 사랑, 보호, 학문, 자격증을 뜻해요. 든든한 후원자예요.",
        keywords: ["어머니", "학문", "자격증", "후원"]
    }
];

const categories = [
    { name: "비겁 (比劫)", desc: "나와 같은 오행 - 동료, 경쟁자" },
    { name: "식상 (食傷)", desc: "내가 생하는 오행 - 표현, 창작" },
    { name: "재성 (財星)", desc: "내가 극하는 오행 - 재물, 이성" },
    { name: "관성 (官星)", desc: "나를 극하는 오행 - 직장, 명예" },
    { name: "인성 (印星)", desc: "나를 생하는 오행 - 학문, 후원" }
];

export default function SipsinGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>십신 (十神)</h1>
                <p className={styles.subtitle}>나를 중심으로 한 10가지 관계</p>

                <div className={styles.description}>
                    <p>
                        십신(十神)은 <strong>일간(나)</strong>을 기준으로 다른 글자들과의 관계를 나타내는 10가지 신(神)입니다.
                        같은 글자라도 누구의 사주에 있느냐에 따라 다른 십신이 됩니다.
                    </p>
                    <br />
                    <p>
                        십신을 통해 그 사람의 성격, 재능, 인간관계, 직업 적성 등을 파악할 수 있습니다.
                        사주에 어떤 십신이 많고 적은지가 인생의 방향에 큰 영향을 미칩니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>십신의 5가지 분류</h2>
                    <div className={styles.grid}>
                        {categories.map((cat) => (
                            <div key={cat.name} className={styles.card}>
                                <div className={styles.cardTitle}>{cat.name}</div>
                                <p className={styles.cardDescription}>{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>십신 상세 설명</h2>
                    <div className={styles.itemList}>
                        {sipsinData.map((item) => (
                            <div key={item.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.name}</div>
                                        <div className={styles.itemHanja}>{item.hanja} · {item.category}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.description}</p>
                                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {item.keywords.map((kw) => (
                                        <span key={kw} className={`${styles.tag} ${styles.neutral}`}>{kw}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/saju" className={styles.navLink}>← 사주팔자란?</Link>
                    <Link href="/guide/ohaeng" className={styles.navLink}>오행 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
