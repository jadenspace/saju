import styles from './Loading.module.css';

export const Loading = () => {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
            <p className={styles.text}>운명을 분석하고 있습니다...</p>
        </div>
    );
};
