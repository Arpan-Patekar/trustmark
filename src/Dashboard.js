import React, { useState, useRef } from 'react';
import { auth } from './firebase';

const ACCENT = '#4361ee';

export default function Dashboard({ user }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifyFile, setVerifyFile] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const fileInputRef = useRef();
  const verifyInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRegister = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await fetch('http://127.0.0.1:8000/register', { method: 'POST', body: formData });
      const assetId = res.headers.get('X-Asset-ID');
      const filename = res.headers.get('X-Filename');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked_${filename.split('.')[0]}.png`;
      a.click();
      setAssets(prev => [...prev, { asset_id: assetId, filename }]);
      setSelectedFile(null);
      setPreview(null);
    } catch {
      alert('Error connecting to backend!');
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!verifyFile) return;
    setVerifying(true);
    setVerifyResult(null);
    const formData = new FormData();
    formData.append('file', verifyFile);
    try {
      const res = await fetch('http://127.0.0.1:8000/verify', { method: 'POST', body: formData });
      const data = await res.json();
      setVerifyResult(data);
    } catch {
      alert('Error verifying!');
    }
    setVerifying(false);
  };

  const s = {
    page: { background: '#0a0a0f', minHeight: '100vh', fontFamily: "'Barlow Condensed', sans-serif", position: 'relative', overflow: 'hidden' },
    bgSvg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 },
    inner: { position: 'relative', zIndex: 1 },
    nav: { background: 'rgba(10,10,15,0.97)', borderBottom: '1px solid #1a1a2e', padding: '16px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { color: '#fff', fontSize: '24px', fontWeight: 800, letterSpacing: '1px' },
    logoAccent: { color: ACCENT },
    logoIcon: { width: 34, height: 34, background: ACCENT, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    navRight: { display: 'flex', alignItems: 'center', gap: 14 },
    email: { color: '#555', fontSize: 14, letterSpacing: '0.5px' },
    logoutBtn: { padding: '6px 16px', border: '1px solid #2a2a3e', borderRadius: 6, color: '#aaa', fontSize: 13, letterSpacing: '1px', cursor: 'pointer', background: 'transparent' },
    body: { padding: '32px 36px' },
    eyebrow: { color: ACCENT, fontSize: 11, letterSpacing: '3px', fontWeight: 700, marginBottom: 6 },
    headline: { color: '#fff', fontSize: 32, fontWeight: 800, letterSpacing: '1px', marginBottom: 28, lineHeight: 1 },
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 },
    statCard: (accent) => ({ background: '#10101a', border: '1px solid #1a1a2e', borderLeft: `3px solid ${accent}`, borderRadius: 10, padding: 16 }),
    statLabel: { color: '#555', fontSize: 11, letterSpacing: '2px', marginBottom: 6 },
    statNum: (color) => ({ color, fontSize: 34, fontWeight: 800, lineHeight: 1 }),
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
    card: { background: '#10101a', border: '1px solid #1a1a2e', borderRadius: 12, padding: 20 },
    cardTitle: (color) => ({ color, fontSize: 12, letterSpacing: '2px', fontWeight: 700, marginBottom: 14 }),
    dropzone: (clickable) => ({ border: '2px dashed #1e1e35', borderRadius: 10, padding: '28px 20px', textAlign: 'center', cursor: clickable ? 'pointer' : 'default' }),
    dropText: { color: '#444', fontSize: 14, letterSpacing: '1px', marginBottom: 12 },
    btnPrimary: { padding: '10px 24px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 800, letterSpacing: '1.5px', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif" },
    btnSecondary: { padding: '10px 24px', background: '#1a1a2e', border: '1px solid #2a2a4e', color: '#fff', borderRadius: 6, fontSize: 14, fontWeight: 800, letterSpacing: '1.5px', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif" },
    resultBox: (ok) => ({ padding: 16, borderRadius: 8, marginTop: 14, background: ok ? '#0a0f2e' : '#1a0a0a', border: `1px solid ${ok ? ACCENT : '#ff4444'}` }),
    resultTitle: (ok) => ({ color: ok ? ACCENT : '#ff4444', fontWeight: 800, fontSize: 16, letterSpacing: '1px', margin: 0 }),
    resultSub: { color: '#888', fontSize: 13, margin: '4px 0 0' },
    assetsCard: { background: '#10101a', border: '1px solid #1a1a2e', borderRadius: 12, padding: 20 },
    assetsTitle: { color: '#555', fontSize: 11, letterSpacing: '2px', marginBottom: 14 },
    assetRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1a1a2e' },
    assetRowLast: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' },
    assetIcon: { width: 38, height: 38, background: '#1a1a2e', borderRadius: 6, border: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    assetName: { color: '#fff', fontSize: 15, fontWeight: 700, letterSpacing: '0.5px' },
    assetId: { color: '#444', fontSize: 11, letterSpacing: '1px' },
    badge: { padding: '5px 12px', background: '#0d0d2e', border: `1px solid ${ACCENT}`, borderRadius: 4, color: ACCENT, fontSize: 11, fontWeight: 800, letterSpacing: '1.5px' },
    empty: { color: '#444', fontSize: 14, letterSpacing: '1px', padding: '20px 0' },
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={s.page}>
        <div style={s.bgSvg}>
          <svg viewBox="0 0 400 400" style={{ position: 'absolute', top: -60, right: -80, width: 420, opacity: 0.045 }}>
            <circle cx="200" cy="200" r="180" fill="none" stroke="white" strokeWidth="6" />
            <circle cx="200" cy="200" r="50" fill="none" stroke="white" strokeWidth="4" />
            <line x1="200" y1="20" x2="200" y2="380" stroke="white" strokeWidth="3" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="white" strokeWidth="3" />
            <rect x="110" y="130" width="180" height="140" fill="none" stroke="white" strokeWidth="4" />
            <rect x="150" y="160" width="100" height="80" fill="none" stroke="white" strokeWidth="3" />
          </svg>
          <svg viewBox="0 0 200 200" style={{ position: 'absolute', bottom: 0, left: -20, width: 200, opacity: 0.03 }}>
            <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="5" />
            <circle cx="100" cy="100" r="30" fill="white" opacity="0.4" />
            <path d="M100 10 L115 55 L85 55 Z" fill="white" />
            <path d="M100 190 L115 145 L85 145 Z" fill="white" />
            <path d="M10 100 L55 85 L55 115 Z" fill="white" />
            <path d="M190 100 L145 85 L145 115 Z" fill="white" />
          </svg>
        </div>

        <div style={s.inner}>
          <nav style={s.nav}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={s.logoIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" fill="#fff" /></svg>
              </div>
              <span style={s.logo}>TRUST<span style={s.logoAccent}>MARK</span></span>
            </div>
            <div style={s.navRight}>
              <span style={s.email}>{user.email}</span>
              <button style={s.logoutBtn} onClick={() => auth.signOut()}>LOGOUT</button>
            </div>
          </nav>

          <div style={s.body}>
            <div style={s.eyebrow}>DIGITAL ASSET PROTECTION</div>
            <div style={s.headline}>SECURE YOUR SPORTS MEDIA</div>

            <div style={s.statsGrid}>
              <div style={s.statCard(ACCENT)}>
                <div style={s.statLabel}>ASSETS PROTECTED</div>
                <div style={s.statNum(ACCENT)}>{assets.length}</div>
              </div>
              <div style={s.statCard('#ffffff')}>
                <div style={s.statLabel}>VERIFIED TODAY</div>
                <div style={s.statNum('#fff')}>{verifyResult?.verified ? 1 : 0}</div>
              </div>
              <div style={s.statCard('#ff4444')}>
                <div style={s.statLabel}>THREATS BLOCKED</div>
                <div style={s.statNum('#ff4444')}>{verifyResult && !verifyResult.verified ? 1 : 0}</div>
              </div>
            </div>

            <div style={s.grid2}>
              <div style={s.card}>
                <div style={s.cardTitle(ACCENT)}>REGISTER ASSET</div>
                <div style={s.dropzone(true)} onClick={() => fileInputRef.current.click()}>
                  {preview
                    ? <img src={preview} alt="preview" style={{ maxHeight: 140, borderRadius: 8 }} />
                    : <><div style={s.dropText}>CLICK TO SELECT MEDIA</div><button style={s.btnPrimary}>+ UPLOAD</button></>
                  }
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                </div>
                {selectedFile && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>{selectedFile.name}</div>
                    <button style={s.btnPrimary} onClick={handleRegister} disabled={loading}>
                      {loading ? 'REGISTERING...' : 'REGISTER & WATERMARK'}
                    </button>
                  </div>
                )}
              </div>

              <div style={s.card}>
                <div style={s.cardTitle('#ffffff')}>VERIFY ASSET</div>
                <div style={s.dropzone(true)} onClick={() => verifyInputRef.current.click()}>
                  <div style={s.dropText}>{verifyFile ? verifyFile.name : 'CLICK TO SELECT SUSPECTED COPY'}</div>
                  {!verifyFile && <button style={s.btnSecondary}>SELECT FILE</button>}
                  <input type="file" accept="image/*" ref={verifyInputRef} onChange={e => { setVerifyFile(e.target.files[0]); setVerifyResult(null); }} style={{ display: 'none' }} />
                </div>
                {verifyFile && (
                  <div style={{ marginTop: 14 }}>
                    <button style={s.btnSecondary} onClick={handleVerify} disabled={verifying}>
                      {verifying ? 'VERIFYING...' : 'VERIFY OWNERSHIP'}
                    </button>
                  </div>
                )}
                {verifyResult && (
                  <div style={s.resultBox(verifyResult.verified)}>
                    <div style={s.resultTitle(verifyResult.verified)}>
                      {verifyResult.verified ? '✓ VERIFIED — AUTHENTIC ASSET' : '✗ NOT VERIFIED — NO WATERMARK'}
                    </div>
                    {verifyResult.verified && (
                      <>
                        <div style={s.resultSub}>File: {verifyResult.asset?.filename}</div>
                        <div style={s.resultSub}>ID: {verifyResult.asset?.asset_id}</div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={s.assetsCard}>
              <div style={s.assetsTitle}>REGISTERED ASSETS</div>
              {assets.length === 0
                ? <div style={s.empty}>NO ASSETS REGISTERED YET</div>
                : assets.map((a, i) => (
                  <div key={a.asset_id} style={i === assets.length - 1 ? s.assetRowLast : s.assetRow}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={s.assetIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={ACCENT} strokeWidth="2" /><path d="M3 9l4-4 4 4 4-4 4 4" stroke={ACCENT} strokeWidth="2" /><circle cx="8" cy="14" r="2" fill={ACCENT} /></svg>
                      </div>
                      <div>
                        <div style={s.assetName}>{a.filename}</div>
                        <div style={s.assetId}>ID: {a.asset_id}</div>
                      </div>
                    </div>
                    <div style={s.badge}>PROTECTED</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}