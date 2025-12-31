import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './guide.module.css';

export const metadata: Metadata = {
    title: "사주 명리학 가이드 - 오늘의 운세는",
    description: "사주팔자, 십신, 오행, 12운성, 12신살, 공망 등 명리학의 핵심 개념을 쉽게 설명합니다. 동양 철학의 지혜로 자신의 운명을 이해해보세요.",
};

const guides = [
    {
        href: "/guide/saju",
        title: "사주팔자란?",
        hanja: "四柱八字",
        description: "태어난 년, 월, 일, 시의 네 기둥과 여덟 글자로 운명을 읽는 동양 철학의 핵심"
    },
    {
        href: "/guide/sipsin",
        title: "십신 (十神)",
        hanja: "比肩·劫財·食神·傷官·偏財·正財·偏官·正官·偏印·正印",
        description: "일간을 기준으로 다른 글자들과의 관계를 나타내는 10가지 신(神)"
    },
    {
        href: "/guide/ohaeng",
        title: "오행 (五行)",
        hanja: "木·火·土·金·水",
        description: "우주 만물을 구성하는 다섯 가지 기본 요소와 그 상생상극 관계"
    },
    {
        href: "/guide/12unsung",
        title: "12운성 (十二運星)",
        hanja: "長生·沐浴·冠帶·建祿·帝旺·衰·病·死·墓·絶·胎·養",
        description: "천간의 에너지 상태를 인간의 생로병사에 대입한 12단계"
    },
    {
        href: "/guide/12sinsal",
        title: "12신살 (十二神殺)",
        hanja: "劫殺·災殺·天殺·地殺·年殺·月殺·亡身殺·將星殺·攀鞍殺·驛馬殺·六害殺·華蓋殺",
        description: "지지와 지지의 관계로 파악하는 12가지 운명의 신호"
    },
    {
        href: "/guide/gongmang",
        title: "공망 (空亡)",
        hanja: "空亡·解空",
        description: "60갑자에서 비어있는 지지, 비움을 통한 정신적 성장의 의미"
    }
];

export default function GuidePage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/" className={styles.backLink}>
                    ← 메인으로 돌아가기
                </Link>

                <h1 className={styles.title}>사주 명리학 가이드</h1>
                <p className={styles.subtitle}>동양 철학의 지혜로 운명을 읽다</p>

                <div className={styles.description}>
                    <p>
                        명리학(命理學)은 수천 년 동안 전해 내려온 동양의 운명학입니다.
                        태어난 순간의 천체 배치와 기운의 흐름을 분석하여
                        개인의 타고난 성격, 재능, 인생의 흐름을 파악합니다.
                    </p>
                    <br />
                    <p>
                        이 가이드에서는 사주팔자의 핵심 개념들을 쉽게 설명합니다.
                        각 개념을 이해하면 자신의 사주 분석 결과를 더 깊이 해석할 수 있습니다.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>학습 가이드</h2>
                    <div className={styles.grid}>
                        {guides.map((guide) => (
                            <Link key={guide.href} href={guide.href} className={styles.cardLink}>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}>{guide.title}</h3>
                                        <svg className={styles.cardArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <p className={styles.cardHanja}>{guide.hanja}</p>
                                    <p className={styles.cardDescription}>{guide.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>사주 분석 시작하기</h2>
                    <p style={{ opacity: 0.8, marginBottom: '1rem', lineHeight: 1.7 }}>
                        이론을 학습했다면 이제 직접 사주를 분석해보세요.
                        생년월일시를 입력하면 만세력 기반의 정확한 사주팔자와
                        상세한 분석 결과를 무료로 확인할 수 있습니다.
                    </p>
                    <Link href="/" className={styles.actionButton}>
                        무료 사주 분석하기
                        <svg className={styles.actionArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Link>
                </div>
            </div>
        </main>
    );
}
