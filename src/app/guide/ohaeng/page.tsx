import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "오행(五行)이란? - 사주 명리학 가이드 | 오늘의 운세는",
    description: "오행(五行)의 의미와 상생상극 관계를 알아봅니다. 목, 화, 토, 금, 수의 다섯 가지 기본 요소가 어떻게 상호작용하는지 설명합니다.",
};

const ohaengData = [
    {
        name: "목 (木)",
        hanja: "木",
        color: "#4ade80",
        season: "봄",
        direction: "동쪽",
        organ: "간, 담",
        emotion: "분노",
        nature: "성장, 확장, 시작",
        description: "나무처럼 위로 뻗어나가는 에너지입니다. 새로운 시작, 창의성, 성장을 상징합니다. 봄의 기운으로 만물이 싹트는 힘을 가집니다.",
        balance: {
            "결핍": "활력과 동기가 약하고, 새로운 것을 시작하기 어려워요.",
            "균형": "창의성과 성장 에너지가 살아 있어 유연하게 발전해요.",
            "과다": "충동적이고 산만해져 우선순위가 흐트러질 수 있어요."
        }
    },
    {
        name: "화 (火)",
        hanja: "火",
        color: "#f87171",
        season: "여름",
        direction: "남쪽",
        organ: "심장, 소장",
        emotion: "기쁨",
        nature: "열정, 표현, 확산",
        description: "불처럼 활활 타오르는 에너지입니다. 열정, 표현력, 사교성을 상징합니다. 여름의 기운으로 모든 것을 밝게 비추는 힘을 가집니다.",
        balance: {
            "결핍": "열정이나 생동감이 부족하고 감정 표현이 차가워요.",
            "균형": "열정과 긍정성이 살아 있어 주변을 밝게 해요.",
            "과다": "충동적이고 감정적으로 폭발할 수 있어요."
        }
    },
    {
        name: "토 (土)",
        hanja: "土",
        color: "#fbbf24",
        season: "환절기",
        direction: "중앙",
        organ: "비장, 위",
        emotion: "걱정",
        nature: "안정, 중재, 수용",
        description: "흙처럼 모든 것을 품는 에너지입니다. 안정, 신뢰, 중재를 상징합니다. 계절의 전환기에 해당하며 모든 것의 중심입니다.",
        balance: {
            "결핍": "안정감이 약하고 생활 기반이 흔들리는 느낌이 들어요.",
            "균형": "안정, 인내, 신뢰감을 바탕으로 현실적인 판단을 해요.",
            "과다": "고집이 세고 변화를 두려워하며 정체될 수 있어요."
        }
    },
    {
        name: "금 (金)",
        hanja: "金",
        color: "#cbd5e1",
        season: "가을",
        direction: "서쪽",
        organ: "폐, 대장",
        emotion: "슬픔",
        nature: "결단, 수렴, 정리",
        description: "금속처럼 단단하고 날카로운 에너지입니다. 결단력, 판단력, 정의를 상징합니다. 가을의 기운으로 수확하고 정리하는 힘을 가집니다.",
        balance: {
            "결핍": "결단력과 자기 확신이 부족해 선택이 어려워요.",
            "균형": "규율, 판단력, 결단력이 건강하게 나타나요.",
            "과다": "냉정하고 비판적이며 잣대가 너무 엄격해요."
        }
    },
    {
        name: "수 (水)",
        hanja: "水",
        color: "#1e293b",
        season: "겨울",
        direction: "북쪽",
        organ: "신장, 방광",
        emotion: "공포",
        nature: "지혜, 유연, 저장",
        description: "물처럼 흐르고 스며드는 에너지입니다. 지혜, 직관, 유연함을 상징합니다. 겨울의 기운으로 에너지를 저장하고 깊이 사색합니다.",
        balance: {
            "결핍": "여유와 흐름 감각이 약해 변화에 적응이 어려워요.",
            "균형": "지혜, 직관, 감수성이 살아 있어 유연하게 대처해요.",
            "과다": "불안하고 생각이 너무 많아 실행력이 떨어져요."
        }
    }
];

const relations = {
    sangseng: [
        { from: "목", to: "화", desc: "나무가 불을 피운다" },
        { from: "화", to: "토", desc: "불이 재(흙)를 만든다" },
        { from: "토", to: "금", desc: "흙에서 금속이 나온다" },
        { from: "금", to: "수", desc: "금속에서 물이 맺힌다" },
        { from: "수", to: "목", desc: "물이 나무를 키운다" }
    ],
    sanggeuk: [
        { from: "목", to: "토", desc: "나무가 흙의 양분을 뺏는다" },
        { from: "토", to: "수", desc: "흙이 물을 막는다" },
        { from: "수", to: "화", desc: "물이 불을 끈다" },
        { from: "화", to: "금", desc: "불이 금속을 녹인다" },
        { from: "금", to: "목", desc: "금속이 나무를 자른다" }
    ]
};

export default function OhaengGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>오행 (五行)</h1>
                <p className={styles.subtitle}>木 · 火 · 土 · 金 · 水</p>

                <div className={styles.description}>
                    <p>
                        오행(五行)은 우주 만물을 구성하는 <strong>다섯 가지 기본 요소</strong>입니다.
                        '행(行)'은 움직인다는 뜻으로, 다섯 요소가 서로 순환하며 영향을 주고받습니다.
                    </p>
                    <br />
                    <p>
                        사주에서 오행의 균형은 매우 중요합니다. 특정 오행이 너무 많거나 부족하면
                        그에 해당하는 성격, 건강, 운세에 영향을 미칩니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>오행의 특성</h2>
                    <div className={styles.itemList}>
                        {ohaengData.map((item) => (
                            <div key={item.name} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div
                                        className={styles.itemIcon}
                                        style={{
                                            background: item.color,
                                            border: item.name === "수 (水)" ? '1px solid #334155' : 'none'
                                        }}
                                    >
                                        {item.hanja}
                                    </div>
                                    <div>
                                        <div className={styles.itemTitle}>{item.name}</div>
                                        <div className={styles.itemHanja}>{item.season} · {item.direction} · {item.organ}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.description}</p>
                                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div><span className={styles.weak}>결핍:</span> <span style={{ opacity: 0.8 }}>{item.balance["결핍"]}</span></div>
                                    <div><span className={styles.strong}>균형:</span> <span style={{ opacity: 0.8 }}>{item.balance["균형"]}</span></div>
                                    <div><span className={styles.medium}>과다:</span> <span style={{ opacity: 0.8 }}>{item.balance["과다"]}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>상생 (相生) - 서로 돕는 관계</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
                        상생은 한 오행이 다른 오행을 생(生)하는, 즉 도와주는 관계입니다.
                    </p>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>생하는 오행</th>
                                <th>→</th>
                                <th>생함받는 오행</th>
                                <th>의미</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relations.sangseng.map((rel, i) => (
                                <tr key={i}>
                                    <td>{rel.from}</td>
                                    <td>→</td>
                                    <td>{rel.to}</td>
                                    <td>{rel.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>상극 (相剋) - 서로 제어하는 관계</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem' }}>
                        상극은 한 오행이 다른 오행을 극(剋)하는, 즉 제어하는 관계입니다.
                    </p>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>극하는 오행</th>
                                <th>→</th>
                                <th>극함받는 오행</th>
                                <th>의미</th>
                            </tr>
                        </thead>
                        <tbody>
                            {relations.sanggeuk.map((rel, i) => (
                                <tr key={i}>
                                    <td>{rel.from}</td>
                                    <td>→</td>
                                    <td>{rel.to}</td>
                                    <td>{rel.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/jiji" className={styles.navLink}>← 지지 알아보기</Link>
                    <Link href="/guide/ilgan" className={styles.navLink}>일간 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
