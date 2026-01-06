import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "용신 (用神) - 사주 명리학 가이드 | 오늘의 운세는",
    description: "용신(用神)은 사주의 다섯 기운 중 가장 필요한 에너지로, 균형을 맞추는 핵심 요소입니다. 용신의 의미와 찾는 방법을 알아봅니다.",
};

const yongsinConcept = [
    {
        name: "희신(喜神)",
        desc: "용신을 도와주는 보조 기운"
    },
    {
        name: "기신(忌神)",
        desc: "용신을 방해하거나 균형을 깨뜨리는 기운"
    },
    {
        name: "구신(仇神)",
        desc: "용신과 대립하여 갈등을 만드는 요소"
    }
];

const yongsinRole = [
    {
        title: "기운의 균형 조절",
        desc: "오행 중 과다하거나 결핍된 기운을 조화시킵니다. 예: 목(木)이 너무 강하면 금(金)으로 제어하고, 너무 약하면 수(水)로 보완합니다."
    },
    {
        title: "인생의 방향 제시",
        desc: "용신은 사람의 진로·성격·인연 방향까지 연결됩니다. 예: 화(火)가 용신이면 '표현·창의·열정' 분야에서 성공 가능성이 높습니다."
    },
    {
        title: "운의 흐름 판단 기준",
        desc: "대운이나 세운에서 용신이 들어오면 좋은 시기, 기신이 들어오면 조심해야 할 시기로 해석합니다."
    }
];

const yongsinTable = [
    {
        element: "木",
        meaning: "성장, 창조, 개척",
        fields: "교육, 계획, 성장산업"
    },
    {
        element: "火",
        meaning: "열정, 명예, 표현",
        fields: "예술, 홍보, 리더십"
    },
    {
        element: "土",
        meaning: "안정, 중심, 현실",
        fields: "부동산, 조직, 중재"
    },
    {
        element: "金",
        meaning: "결단, 판단, 정의",
        fields: "경영, 기술, 법률"
    },
    {
        element: "水",
        meaning: "지혜, 감성, 순환",
        fields: "언론, 인문, 상담"
    }
];

const yongsinMethod = [
    {
        step: "1",
        title: "일간(日干)의 강약을 파악한다.",
        desc: "내가 속한 오행이 계절적으로 강한지, 약한지 판단."
    },
    {
        step: "2",
        title: "상생·상극의 흐름을 본다.",
        desc: "부족한 오행을 생(生)해주는 기운이 용신."
    },
    {
        step: "3",
        title: "사주의 균형과 환경을 본다.",
        desc: "같은 오행이라도 과하면 기신, 적당하면 용신이 된다."
    }
];

export default function YongsinGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>용신(用神)</h1>
                <p className={styles.subtitle}>사주의 균형을 맞추는 핵심</p>

                <div className={styles.description}>
                    <p>
                        용신(用神)은 사주의 다섯 기운(오행) 중에서 <strong>가장 필요한 에너지</strong>, 즉 균형을 맞추는 '핵심 요소'를 의미합니다.  
                        사주에는 사람마다 태어난 계절, 시간, 기운의 강약에 따라 <strong>강한 오행</strong>과 <strong>약한 오행</strong>이 존재합니다.  
                        이때 부족한 부분을 보완하거나, 과한 부분을 제어해주는 기운이 바로 용신입니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>용신의 개념</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>설명</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yongsinConcept.map((item) => (
                                <tr key={item.name}>
                                    <td style={{ fontWeight: 'bold' }}>{item.name}</td>
                                    <td>{item.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
                        용신은 단순히 '좋은 글자'가 아니라, <strong>사주의 조화를 이끌어내는 중심축</strong>입니다.  
                        즉, 나의 일간이 어떤 환경에서 태어났는지, 어떤 기운이 과하거나 약한지에 따라 달라집니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>용신의 역할</h2>
                    <div className={styles.itemList}>
                        {yongsinRole.map((item) => (
                            <div key={item.title} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.title}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>오행별 용신 해석</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>오행</th>
                                <th>대표 용신의 의미</th>
                                <th>관련 분야</th>
                            </tr>
                        </thead>
                        <tbody>
                            {yongsinTable.map((item) => (
                                <tr key={item.element}>
                                    <td style={{ fontFamily: '"Noto Serif KR", serif', fontSize: '1.1rem', fontWeight: 'bold' }}>{item.element}</td>
                                    <td>{item.meaning}</td>
                                    <td>{item.fields}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>용신을 찾는 방법</h2>
                    <div className={styles.itemList}>
                        {yongsinMethod.map((item) => (
                            <div key={item.step} className={styles.item}>
                                <div className={styles.itemHeader}>
                                    <div>
                                        <div className={styles.itemTitle}>{item.step}. {item.title}</div>
                                    </div>
                                </div>
                                <p className={styles.itemDescription}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.description}>
                    <p>
                        용신은 운세 해석의 '핵심 열쇠'입니다.  
                        자신의 용신을 알고 나면, 어떤 선택이 유리한지, 어떤 환경에서 잠재력이 발휘되는지를 정확히 알 수 있습니다.  
                        사주의 균형을 이해하고 용신을 중심으로 삶을 조율하면,  
                        운세의 흐름이 한결 부드럽고 안정적으로 흘러갑니다.
                    </p>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/seun" className={styles.navLink}>← 세운 알아보기</Link>
                    <Link href="/guide/12unsung" className={styles.navLink}>12운성 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
