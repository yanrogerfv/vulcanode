import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0c10',
          position: 'relative',
        }}
      >
        {/* Glow decorativo */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            left: 260,
            width: 700,
            height: 500,
            background:
              'radial-gradient(circle, rgba(249,115,22,0.35) 0%, rgba(249,115,22,0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -180,
            right: -100,
            width: 600,
            height: 600,
            background:
              'radial-gradient(circle, rgba(217,119,6,0.28) 0%, rgba(217,119,6,0) 70%)',
            display: 'flex',
          }}
        />

        {/* Logo + Nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: 'linear-gradient(135deg, #f97316, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4" />
              <path d="M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z" />
              <path d="M9 12v5" />
              <path d="M15 12v5" />
              <path d="M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1" />
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, color: '#f3f4f6' }}>
            Vulca<span style={{ color: '#f97316', display: 'flex' }}>node</span>
          </div>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 32,
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: 880,
          }}
        >
          Árvores de Crafting & Grafos de Composição Modular
        </div>
      </div>
    ),
    { ...size }
  );
}
