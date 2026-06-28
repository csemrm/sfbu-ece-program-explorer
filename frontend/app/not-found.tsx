import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f9fafb' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '5rem', fontWeight: 700, color: '#e5e7eb', lineHeight: 1 }}>404</p>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              margin: '1rem 0 0.5rem',
            }}
          >
            Page not found
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem', maxWidth: '28rem' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.625rem 1.5rem',
              background: '#1e293b',
              color: '#fff',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
