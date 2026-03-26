import React, { useState } from 'react';

const PLAYLISTS = [
    {
        id: '37i9dQZF1DWZeKCadgRdKQ',
        name: 'Deep Focus',
        desc: 'Zero-distraction flow state',
        emoji: '🧠',
        grad: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        accent: '#4fc3f7',
    },
    {
        id: '37i9dQZF1DWXLeA8Omikj7',
        name: 'Brain Food',
        desc: 'Accelerate cognition',
        emoji: '⚡',
        grad: 'linear-gradient(135deg, #1e2a0e 0%, #2d4a1a 100%)',
        accent: '#a5d6a7',
    },
    {
        id: '37i9dQZF1DX4sWSpwq3LiO',
        name: 'Peaceful Piano',
        desc: 'Calm clarity',
        emoji: '🎹',
        grad: 'linear-gradient(135deg, #1a1228 0%, #271840 100%)',
        accent: '#ce93d8',
    },
    {
        id: '37i9dQZF1DWWQRwui0ExPn',
        name: 'Lofi Beats',
        desc: 'Chill productive work',
        emoji: '🎧',
        grad: 'linear-gradient(135deg, #1c1008 0%, #2e1a06 100%)',
        accent: '#ffcc80',
    },
];

const STORAGE_KEY = 'aiimin_spotify_playlist';

const SpotifyPlayer = () => {
    const [activeId, setActiveId] = useState(
        () => localStorage.getItem(STORAGE_KEY) || PLAYLISTS[0].id
    );
    const [customInput, setCustomInput] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    const active = PLAYLISTS.find(p => p.id === activeId) || PLAYLISTS[0];

    const select = (id) => {
        setActiveId(id);
        localStorage.setItem(STORAGE_KEY, id);
    };

    const handleCustom = (e) => {
        e.preventDefault();
        if (!customInput.trim()) return;
        const match = customInput.match(/playlist\/([A-Za-z0-9]+)/);
        const id = match ? match[1] : customInput.trim();
        if (id.length > 10) select(id);
        setCustomInput('');
        setShowCustom(false);
    };

    const embedSrc = `https://open.spotify.com/embed/playlist/${activeId}?utm_source=generator&theme=0`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🎵</span>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-1)' }}>
                            {active.emoji} {active.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{active.desc}</div>
                    </div>
                </div>
                <button
                    onClick={() => setShowCustom(v => !v)}
                    style={{
                        fontSize: '10px', fontWeight: 600, color: 'var(--text-3)',
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        padding: '4px 10px', borderRadius: '99px', cursor: 'pointer',
                    }}
                >
                    {showCustom ? 'Cancel' : '+ Custom URL'}
                </button>
            </div>

            {/* Playlist grid — 2×2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {PLAYLISTS.map(p => {
                    const isActive = p.id === activeId;
                    return (
                        <button
                            key={p.id}
                            onClick={() => select(p.id)}
                            style={{
                                padding: '12px 14px',
                                borderRadius: '12px',
                                border: isActive ? `1.5px solid ${p.accent}` : '1px solid var(--border)',
                                background: isActive ? p.grad : 'var(--bg-elevated)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {isActive && (
                                <span style={{
                                    position: 'absolute', top: '8px', right: '8px',
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: p.accent,
                                    boxShadow: `0 0 8px ${p.accent}`,
                                    animation: 'pulse 2s ease-in-out infinite',
                                }} />
                            )}
                            <div style={{ fontSize: '20px', marginBottom: '5px' }}>{p.emoji}</div>
                            <div style={{
                                fontSize: '12px', fontWeight: 700,
                                color: isActive ? p.accent : 'var(--text-1)',
                            }}>
                                {p.name}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
                                {p.desc}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Custom URL input */}
            {showCustom && (
                <form onSubmit={handleCustom} style={{ display: 'flex', gap: '6px' }}>
                    <input
                        type="text"
                        value={customInput}
                        onChange={e => setCustomInput(e.target.value)}
                        placeholder="Paste any Spotify playlist URL…"
                        autoFocus
                        style={{
                            flex: 1, padding: '8px 12px', borderRadius: '8px',
                            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                            color: 'var(--text-1)', fontSize: '12px', outline: 'none',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '8px 14px', borderRadius: '8px', border: 'none',
                            background: 'var(--accent)', color: '#fff',
                            fontSize: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                        }}
                    >
                        Load
                    </button>
                </form>
            )}

            {/* Spotify embed — full compact player */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', background: '#121212', lineHeight: 0 }}>
                <iframe
                    key={activeId}
                    src={embedSrc}
                    width="100%"
                    height="352"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify focus playlist"
                    style={{ display: 'block', border: 'none', margin: '-1px' }}
                />
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.3); }
                }
            `}</style>

        </div>
    );
};

export default SpotifyPlayer;

