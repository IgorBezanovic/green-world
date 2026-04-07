import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Zeleni Svet';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background:
            'linear-gradient(135deg, #1d3b2a 0%, #2f6b46 45%, #d6e8a8 100%)',
          color: '#f9f8ef'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 2
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 999,
                background: '#dce88e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#214532',
                fontSize: 26
              }}
            >
              ZS
            </div>
            Zeleni Svet
          </div>
          <div
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(249, 248, 239, 0.14)',
              border: '1px solid rgba(249, 248, 239, 0.25)',
              fontSize: 24
            }}
          >
            zelenisvet.rs
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            maxWidth: 860
          }}
        >
          <div
            style={{
              fontSize: 28,
              textTransform: 'uppercase',
              letterSpacing: 4,
              color: '#dce88e'
            }}
          >
            Online cvece i biljke
          </div>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.02,
              fontWeight: 800
            }}
          >
            Marketplace za cvecare, prodavnice i zelene price.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: 'rgba(249, 248, 239, 0.9)'
            }}
          >
            Proizvodi, usluge, dogadjaji i blog sadrzaj spremni za deljenje na
            Teams-u, WhatsApp-u, Viber-u i ostalim mrezama.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            fontSize: 24,
            color: '#eff4d2'
          }}
        >
          <div>#cvece</div>
          <div>#biljke</div>
          <div>#cvecare</div>
          <div>#zelenisvet</div>
        </div>
      </div>
    ),
    size
  );
}
