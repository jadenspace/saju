import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "12운성(十二運星)이란? - 사주 명리학 가이드 | 운명의 나침반",
    description: "12운성(十二運星)의 의미와 종류를 알아봅니다. 장생, 목욕, 관대, 건록, 제왕, 쇠, 병, 사, 묘, 절, 태, 양의 12단계 에너지를 설명합니다.",
};

const twelveStages = [
    {
        name: "장생 (長生)",
        hanja: "長生",
        meaning: "탄생",
        stage: "태어남",
        energy: "강",
        description: "새로운 시작과 희망의 기운입니다. 성장과 발전의 에너지가 넘치는 시기로, 모든 것이 새롭게 시작되는 때입니다.",
        keywords: ["시작", "희망", "성장", "탄생"]
    },
    {
        name: "목욕 (沐浴)",
        hanja: "沐浴",
        meaning: "목욕",
        stage: "사춘기",
        energy: "중",
        description: "정화와 변화의 과정입니다. 다소 불안정할 수 있으나 성장통을 겪는 시기로, 새로운 것을 배우고 변화하는 때입니다.",
        keywords: ["변화", "정화", "사춘기", "도화"]
    },
    {
        name: "관대 (冠帶)",
        hanja: "冠帶",
        meaning: "성인식",
        stage: "청년기, 결혼",
        energy: "강",
        description: "성숙함을 갖추는 때입니다. 사회적 인정과 성취를 향해 나아가며, 자신의 위치를 확립하는 시기입니다.",
        keywords: ["성숙", "인정", "결혼", "성인"]
    },
    {
        name: "건록 (建祿)",
        hanja: "建祿",
        meaning: "녹봉",
        stage: "취직, 자립",
        energy: "강",
        description: "자립과 안정의 기운입니다. 직업과 재물이 안정되며 자신감이 넘치는 시기로, 사회적으로 인정받습니다.",
        keywords: ["자립", "직업", "안정", "녹봉"]
    },
    {
        name: "제왕 (帝旺)",
        hanja: "帝旺",
        meaning: "절정",
        stage: "전성기",
        energy: "최강",
        description: "최고조의 에너지입니다. 권력과 영향력이 정점에 달하지만, 정상에서 내려올 준비도 필요한 시기입니다.",
        keywords: ["전성기", "권력", "정점", "카리스마"]
    },
    {
        name: "쇠 (衰)",
        hanja: "衰",
        meaning: "쇠퇴",
        stage: "은퇴",
        energy: "중",
        description: "쇠퇴의 시작입니다. 무리하지 않고 지혜롭게 물러나는 것이 좋은 시기로, 다음 세대에게 바톤을 넘기는 때입니다.",
        keywords: ["쇠퇴", "은퇴", "양보", "지혜"]
    },
    {
        name: "병 (病)",
        hanja: "病",
        meaning: "병듦",
        stage: "노환",
        energy: "약",
        description: "힘이 빠지는 시기입니다. 건강과 마음의 안정을 최우선으로 해야 하며, 내면의 성찰이 필요한 때입니다.",
        keywords: ["건강", "휴식", "성찰", "내면"]
    },
    {
        name: "사 (死)",
        hanja: "死",
        meaning: "죽음",
        stage: "임종",
        energy: "약",
        description: "정지와 마무리의 시기입니다. 과거를 정리하고 새 출발을 준비하는 때로, 끝이 새로운 시작이 됩니다.",
        keywords: ["마무리", "정리", "종결", "전환"]
    },
    {
        name: "묘 (墓)",
        hanja: "墓",
        meaning: "무덤",
        stage: "입관",
        energy: "약",
        description: "잠재력의 저장 시기입니다. 표면적 활동보다 내면의 힘을 기르는 때로, 숨겨진 재능이 발현될 수 있습니다.",
        keywords: ["저장", "잠재력", "숨김", "보관"]
    },
    {
        name: "절 (絶)",
        hanja: "絶",
        meaning: "소멸",
        stage: "영혼 분리",
        energy: "약",
        description: "단절과 전환의 시기입니다. 완전한 변화를 통해 새로운 씨앗이 심어지는 때로, 기존 것과의 결별입니다.",
        keywords: ["단절", "전환", "새출발", "결별"]
    },
    {
        name: "태 (胎)",
        hanja: "胎",
        meaning: "잉태",
        stage: "임신",
        energy: "중",
        description: "잉태의 기운입니다. 새로운 것이 구상되고 계획이 세워지는 시기로, 희망의 씨앗이 자라납니다.",
        keywords: ["잉태", "계획", "구상", "가능성"]
    },
    {
        name: "양 (養)",
        hanja: "養",
        meaning: "양육",
        stage: "태아기",
        energy: "중",
        description: "양육과 성장의 시기입니다. 조용히 힘을 기르며 때를 기다리는 때로, 충분한 준비가 필요합니다.",
        keywords: ["양육", "준비", "성장", "기다림"]
    }
];

const energyGroups = {
    strong: ["장생", "관대", "건록", "제왕"],
    medium: ["목욕", "쇠", "태", "양"],
    weak: ["병", "사", "묘", "절"]
};

export default function TwelveStagesGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>12운성 (十二運星)</h1>
                <p className={styles.subtitle}>포태법(胞胎法) - 생로병사의 12단계</p>

                <div className={styles.description}>
                    <p>
                        12운성은 <strong>천간의 에너지 상태</strong>를 인간의 생로병사에 대입한 것입니다.
                        일간(나)이 각 지지를 만났을 때 어떤 에너지 상태인지를 나타냅니다.
                    </p>
                    <br />
                    <p>
                        태어나서(장생) → 성장하고(목욕, 관대) → 전성기를 맞이하고(건록, 제왕) →
                        쇠퇴하여(쇠, 병) → 죽음을 맞이하고(사, 묘) → 다시 태어나는(절, 태, 양) 순환입니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>에너지 강약에 따른 분류</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardTitle} style={{ color: '#4ade80' }}>강한 에너지</div>
                            <p className={styles.cardDescription}>
                                {energyGroups.strong.join(', ')}<br />
                                <span style={{ opacity: 0.7 }}>활동적이고 에너지가 넘치는 상태</span>
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardTitle} style={{ color: '#fbbf24' }}>중간 에너지</div>
                            <p className={styles.cardDescription}>
                                {energyGroups.medium.join(', ')}<br />
                                <span style={{ opacity: 0.7 }}>변화와 전환의 과도기 상태</span>
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardTitle} style={{ color: '#f87171' }}>약한 에너지</div>
                            <p className={styles.cardDescription}>
                                {energyGroups.weak.join(', ')}<br />
                                <span style={{ opacity: 0.7 }}>내면의 힘을 기르는 상태</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>12운성 상세 설명</h2>
                    <div className={styles.itemList}>
                        {twelveStages.map((stage) => (
                            <div key={stage.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{stage.name}</div>
                                        <div className={styles.itemHanja}>
                                            {stage.hanja} · {stage.stage} ·
                                            <span className={
                                                stage.energy === '강' || stage.energy === '최강' ? styles.strong :
                                                stage.energy === '중' ? styles.medium : styles.weak
                                            }> {stage.energy}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{stage.description}</p>
                                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {stage.keywords.map((kw) => (
                                        <span key={kw} className={`${styles.tag} ${styles.neutral}`}>{kw}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/ohaeng" className={styles.navLink}>← 오행이란?</Link>
                    <Link href="/guide/12sinsal" className={styles.navLink}>12신살 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
