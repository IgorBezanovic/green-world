import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <html lang="sr">
      <body
        style={{
          margin: 0,
          fontFamily: 'sans-serif',
          textAlign: 'center',
          paddingTop: '20vh',
          backgroundColor: '#fff'
        }}
      >
        <h1 style={{ fontSize: '4rem', color: '#16a34a', margin: '0 0 1rem' }}>
          404
        </h1>
        <p
          style={{ fontSize: '1.25rem', color: '#374151', margin: '0 0 2rem' }}
        >
          Stranica nije pronađena
        </p>
        <Link href="/" style={{ color: '#16a34a', fontSize: '1rem' }}>
          ← Početna
        </Link>
      </body>
    </html>
  );
}
