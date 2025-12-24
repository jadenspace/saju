import styles from './Loading.module.css';

export const Loading = () => {
    return (
        <div className={styles.container}>
            <div className={styles.spinnerWrapper}>
                <div className={styles.spinner}></div>
                <div className={styles.spinnerInner}></div>
                <div className={styles.spinnerCore}></div>
            </div>
            <p className={styles.text}>운명을 분석하고 있습니다...</p>
            <p className={styles.subtext}>잠시만 기다려주세요</p>
        </div>
    );
};
