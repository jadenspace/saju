import Link from 'next/link';
import styles from './PrivacyPolicy.module.css';

export const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← 돌아가기
        </Link>
      </div>
      <h1 className={styles.title}>개인정보처리방침</h1>
      
      <p className={styles.intro}>
        ㈜오늘의운세는(이하 “회사”)는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하고 권익을 보호하기 위하여 다음과 같은 개인정보처리방침을 수립·공개합니다.
      </p>

      <section className={styles.section}>
        <h2 className={styles.heading}>1. 개인정보의 처리 목적</h2>
        <p>회사는 다음의 목적을 위해 개인정보를 처리합니다. 처리한 개인정보는 아래 목적 이외의 용도로 이용되지 않으며, 이용 목적이 변경되는 경우 관련 법령에 따라 별도 동의를 받는 등 필요한 조치를 이행합니다.</p>
        <ul className={styles.list}>
          <li><strong>문의/상담 접수 및 응대</strong>: 이용자 문의 확인, 답변 및 처리 결과 안내</li>
          <li><strong>분쟁 조정을 위한 기록 보존</strong>: 문의 처리의 자동화 운영</li>
          <li><strong>웹훅 기반으로 문의를 접수하고, 담당자 확인 및 후속 처리를 위한 이관/알림 수행</strong></li>
          <li><strong>문의 처리 현황 관리 및 업무 효율화</strong></li>
        </ul>
        <p className={styles.highlight}>
          **사주 서비스 입력 정보(이름/생년월일/출생시간 등)**는 결과 제공을 위해 이용자가 화면에서 입력할 수 있으나, 회사는 해당 정보를 저장(보관)하지 않습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>2. 처리하는 개인정보의 항목</h2>
        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>이용자가 직접 제공하는 정보(문의하기)</h3>
          <ul className={styles.list}>
            <li>필수: 이름, 이메일</li>
            <li>선택: 문의 내용(이용자가 자유롭게 기재하는 내용)</li>
          </ul>
        </div>
        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>서비스 이용 과정에서 자동으로 생성·수집될 수 있는 정보(운영 시)</h3>
          <p>접속 로그, IP주소, 기기/브라우저 정보, 쿠키(사용 시)</p>
          <p className={styles.note}>※ 실제로 수집하지 않는 항목은 삭제하거나 “수집하지 않습니다”로 수정합니다.</p>
        </div>
        <div className={styles.subSection}>
          <h3 className={styles.subHeading}>저장하지 않는 정보</h3>
          <p>사주 결과 산출을 위해 입력되는 이름/생년월일/출생시간 등: <strong>저장하지 않음</strong></p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>3. 개인정보의 처리 및 보유 기간</h2>
        <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시 동의받은 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
        <ul className={styles.list}>
          <li><strong>문의/상담 정보(이름, 이메일, 문의내용)</strong>: 1년 보관 후 파기</li>
        </ul>
        <p>보유기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>4. 개인정보의 처리 경로(자동화 흐름)</h2>
        <p>회사는 문의 처리를 위해 다음과 같은 자동화 흐름을 운영할 수 있습니다.</p>
        <ol className={styles.orderedList}>
          <li>이용자가 문의하기를 통해 이름/이메일/문의내용을 제출</li>
          <li>문의 정보가 n8n 웹훅을 통해 회사의 자동화 시스템으로 전달</li>
          <li>전달된 문의 정보는 Google Sheets에 저장</li>
          <li>문의 처리 및 내부 업무 이관을 위해 Slack 및 Notion으로 문의내용 전체가 전송/저장될 수 있음</li>
        </ol>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>5. 개인정보의 제3자 제공</h2>
        <p>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
        <ul className={styles.list}>
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령에 특별한 규정이 있거나, 수사·조사 목적으로 법령에 정해진 절차와 방법에 따라 요청이 있는 경우</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>6. 개인정보처리의 위탁</h2>
        <p>회사는 원활한 서비스 제공과 문의 처리를 위해 개인정보 처리업무의 일부를 외부에 위탁할 수 있으며, 위탁 시 관련 법령에 따라 개인정보가 안전하게 관리되도록 필요한 사항을 규정하고 관리·감독합니다.</p>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>수탁업체(서비스)</th>
                <th>위탁업무 내용</th>
                <th>처리 항목</th>
                <th>보유 및 이용기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Google Cloud Platform(GCP)</td>
                <td>n8n 서버 호스팅 및 운영 인프라 제공</td>
                <td>이름, 이메일, 문의내용</td>
                <td>1년 또는 위탁계약 종료 시까지(목적 달성 시 파기)</td>
              </tr>
              <tr>
                <td>n8n(자체 운영, GCP 상)</td>
                <td>웹훅 수신, 워크플로우 실행(저장/이관 처리)</td>
                <td>이름, 이메일, 문의내용</td>
                <td>1년 또는 처리 목적 달성 시까지</td>
              </tr>
              <tr>
                <td>Google LLC (Google Sheets)</td>
                <td>문의 정보 저장 및 관리(스프레드시트)</td>
                <td>이름, 이메일, 문의내용</td>
                <td>1년</td>
              </tr>
              <tr>
                <td>Slack Technologies, LLC</td>
                <td>문의 접수/처리 관련 알림 및 내부 커뮤니케이션</td>
                <td>이름, 이메일, 문의내용(전체)</td>
                <td>1년</td>
              </tr>
              <tr>
                <td>Notion Labs, Inc.</td>
                <td>문의/업무 이관을 위한 데이터베이스 저장(관리)</td>
                <td>이름, 이메일, 문의내용(전체)</td>
                <td>1년</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.note}>※ 회사는 수탁업체와의 계약을 통해 개인정보 보호 관련 의무를 부과하고, 이행 여부를 관리·감독합니다.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>7. 이용자 및 법정대리인의 권리·의무 및 행사방법</h2>
        <p>이용자는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
        <ul className={styles.list}>
          <li>개인정보 열람 요구</li>
          <li>개인정보 정정 요구</li>
          <li>개인정보 삭제 요구</li>
          <li>개인정보 처리정지 요구</li>
        </ul>
        <p>권리 행사는 아래 “개인정보 보호책임자”에게 서면 또는 이메일 등으로 하실 수 있으며, 회사는 지체 없이 조치합니다.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>8. 개인정보의 파기절차 및 파기방법</h2>
        <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
        <ul className={styles.list}>
          <li><strong>파기절차</strong>: 보유기간 만료 또는 목적 달성 후 내부 방침에 따라 파기</li>
          <li><strong>파기방법</strong>:
            <ul className={styles.subList}>
              <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
              <li>종이 문서: 분쇄 또는 소각</li>
            </ul>
          </li>
        </ul>
        <p>또한 회사는 보유기간(1년) 경과 시 Google Sheets 및 Notion 등 저장 매체에서도 동일 기준으로 삭제(또는 비식별화/접근 차단 후 삭제) 처리합니다.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>9. 개인정보의 안전성 확보조치</h2>
        <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취합니다.</p>
        <ul className={styles.list}>
          <li><strong>관리적 조치</strong>: 내부 관리계획 수립·시행, 개인정보 취급자 최소화 및 교육</li>
          <li><strong>기술적 조치</strong>: 접근권한 관리, 전송 구간 암호화(TLS), 접속기록 보관 및 위·변조 방지, 보안프로그램 설치</li>
          <li><strong>물리적 조치</strong>: 전산실/자료보관실 접근통제(해당 시)</li>
        </ul>
        <p className={styles.note}>※ 문의내용 전체가 Slack/Notion으로 이관될 수 있으므로, 채널/데이터베이스 권한은 최소 권한 원칙에 따라 운영합니다.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>10. 쿠키(또는 유사 기술)의 사용</h2>
        <p>회사는 이용자에게 보다 나은 서비스를 제공하기 위해 쿠키를 사용할 수 있으며, 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.</p>
        <p>쿠키 거부 방법(예시): Chrome {'>'} 설정 {'>'} 개인정보 및 보안 {'>'} 쿠키</p>
        <p className={styles.note}>※ 쿠키를 사용하지 않는 경우 본 조항은 삭제 가능합니다.</p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>11. 개인정보 보호책임자 및 문의처</h2>
        <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 관련 문의 및 불만처리 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
        <ul className={styles.list}>
          <li><strong>개인정보 보호책임자</strong>: 김연호/대표</li>
          <li><strong>연락처</strong>: <a href="mailto:yeonhokr@gmail.com">yeonhokr@gmail.com</a></li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>12. 개인정보처리방침의 변경</h2>
        <p>본 개인정보처리방침은 2025.12.05 부터 적용됩니다. 내용 추가·삭제·수정이 있을 경우 개정 최소 7일 전(중요 변경은 30일 전)부터 공지합니다.</p>
      </section>
    </div>
  );
};
