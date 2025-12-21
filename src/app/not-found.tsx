import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.9 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'normal' }}>
        페이지를 찾을 수 없습니다
      </h2>
      <p style={{ opacity: 0.7, marginBottom: '2rem', maxWidth: '400px', lineHeight: 1.6 }}>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        아래 링크를 통해 메인 페이지로 이동해주세요.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '0.75rem 2rem',
            background: 'var(--primary)',
            color: '#000',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          메인으로 돌아가기
        </Link>
        <Link
          href="/fortune"
          style={{
            padding: '0.75rem 2rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none'
          }}
        >
          2026 신년운세 보기
        </Link>
      </div>

      <div style={{ marginTop: '3rem', opacity: 0.5, fontSize: '0.85rem' }}>
        <p>운명의 나침반 - 무료 사주 및 운세 서비스</p>
      </div>
    </main>
  );
}
