import Link from 'next/link';
import type { Metadata } from 'next';
import styles from '../guide.module.css';

export const metadata: Metadata = {
    title: "대운 (大運) - 사주 명리학 가이드 | 오늘의 운세는",
    description: "대운(大運)은 인생에서 약 10년 단위로 바뀌는 운의 흐름입니다. 대운의 의미와 해석 방법을 알아봅니다.",
};

const daeunMeaning = [
    {
        category: "대운의 시작",
        desc: "인생의 큰 주기가 전환되는 시점"
    },
    {
        category: "대운의 변화",
        desc: "10년 단위로 기운의 성질이 바뀜"
    },
    {
        category: "천간의 변화",
        desc: "사회적 위치, 명예, 직업적 흐름에 영향"
    },
    {
        category: "지지의 변화",
        desc: "감정, 인간관계, 가족, 건강에 영향"
    }
];

const daeunExample = [
    {
        age: "10~19세",
        cheongan: "丙火",
        jiji: "午火",
        feature: "학업과 표현의 시기, 자아 확립"
    },
    {
        age: "20~29세",
        cheongan: "戊土",
        jiji: "申金",
        feature: "사회 진출, 직업 기반 형성"
    },
    {
        age: "30~39세",
        cheongan: "庚金",
        jiji: "戌土",
        feature: "책임과 성취, 명예의 시기"
    },
    {
        age: "40~49세",
        cheongan: "壬水",
        jiji: "子水",
        feature: "내면 탐구, 관계의 확장"
    },
    {
        age: "50~59세",
        cheongan: "甲木",
        jiji: "寅木",
        feature: "재도약, 새로운 삶의 설계"
    }
];

export default function DaeunGuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/guide" className={styles.backLink}>
                    ← 가이드 목록으로
                </Link>

                <h1 className={styles.title}>대운(大運)</h1>
                <p className={styles.subtitle}>10년 주기의 운의 흐름</p>

                <div className={styles.description}>
                    <p>
                        대운(大運)은 인생에서 약 <strong>10년 단위로 바뀌는 운의 흐름</strong>을 말합니다.  
                        사람의 사주는 고정된 성격과 기운의 틀을 보여주지만, 대운은 그 틀 위에 흘러가는 '시간의 에너지'입니다.  
                        즉, 대운은 "어떤 시기에 어떤 기운이 나에게 들어오는가"를 알려주는 <strong>인생의 큰 흐름표</strong>입니다.
                    </p>
                    <br />
                    <p>
                        사람마다 대운이 시작되는 시점은 다르며, 일반적으로 출생 후 약 4~10세 무렵부터 시작됩니다.  
                        그 이후로 10년마다 새로운 기운이 들어와 삶의 환경, 인간관계, 직업, 건강, 운세 전반에 영향을 미칩니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>대운의 구성 원리</h2>
                    <div className={styles.description}>
                        <p>
                            대운은 출생 시의 음양오행 흐름을 기준으로,  
                            태어난 월주의 <strong>천간(天干)</strong>과 <strong>지지(地支)</strong>를 따라 순행(順行) 또는 역행(逆行)으로 계산됩니다.
                        </p>
                        <br />
                        <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                            <li><strong>양(陽) 남자, 음(陰) 여자:</strong> 순행 (앞으로 흐름)</li>
                            <li><strong>음(陰) 남자, 양(陽) 여자:</strong> 역행 (뒤로 흐름)</li>
                        </ul>
                        <br />
                        <p>
                            이는 우주의 시간 흐름이 사람의 기운과 음양이 맞물려 움직인다는 원리입니다.
                        </p>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>대운의 의미</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>설명</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daeunMeaning.map((item) => (
                                <tr key={item.category}>
                                    <td style={{ fontWeight: 'bold' }}>{item.category}</td>
                                    <td>{item.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p style={{ marginTop: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
                        대운은 단순히 "좋다·나쁘다"로 구분하지 않습니다.  
                        기운의 성질이 바뀌면, 인생의 초점이 자연스럽게 다른 방향으로 옮겨가는 것입니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>대운 해석의 포인트</h2>
                    <div className={styles.itemList}>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>1. 일간(日干)과의 관계</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                나를 기준으로 어떤 기운이 들어오는지 판단합니다.  
                                생(도와줌)·극(제어)·비(경쟁)·합(조화) 등을 종합합니다.
                            </p>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>2. 오행의 균형</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                부족한 오행이 대운에서 들어오면 보완이 이루어지고,  
                                과다한 오행이 또 들어오면 갈등이나 부담이 생깁니다.
                            </p>
                        </div>
                        <div className={styles.item}>
                            <div className={styles.itemHeader}>
                                <div>
                                    <div className={styles.itemTitle}>3. 인생의 전환점</div>
                                </div>
                            </div>
                            <p className={styles.itemDescription}>
                                대운이 바뀔 때는 환경·직업·인연이 새롭게 전환됩니다.  
                                이 시기에 '삶의 방향성'을 조정하는 것이 중요합니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>대운의 흐름 예시</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>나이</th>
                                <th>대운 천간</th>
                                <th>대운 지지</th>
                                <th>특징</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daeunExample.map((item) => (
                                <tr key={item.age}>
                                    <td style={{ fontWeight: 'bold' }}>{item.age}</td>
                                    <td>{item.cheongan}</td>
                                    <td>{item.jiji}</td>
                                    <td>{item.feature}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.description}>
                    <p>
                        대운은 인생의 '계절'과 같습니다.  
                        봄에는 싹이 트고, 여름에는 성장하며, 가을에는 결실을 맺고, 겨울에는 에너지를 저장합니다.  
                        자신의 대운 흐름을 이해하면, <strong>어떤 시기에 집중하고 조심해야 하는지</strong>를 명확히 알 수 있습니다.  
                        이것이 곧 '운명을 다스리는 지혜'입니다.
                    </p>
                </div>

                <div className={styles.navLinks}>
                    <Link href="/guide/sipsin" className={styles.navLink}>← 십신 알아보기</Link>
                    <Link href="/guide/seun" className={styles.navLink}>세운 알아보기 →</Link>
                </div>
            </div>
        </main>
    );
}
