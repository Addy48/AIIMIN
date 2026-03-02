import React, { useState, useEffect } from 'react';
import YouTubePlayer from './YouTubePlayer';

/* ─── Status badge ─── */
const IntegrationBadge = ({ connected, error }) => {
    if (error) return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '99px', background: 'rgba(235,140,140,0.08)', border: '1px solid rgba(235,140,140,0.2)', fontSize: '10px', fontWeight: 700, color: 'var(--danger)', flexShrink: 0 }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--danger)' }} />
            Auth error
        </div>
    );
    if (connected) return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '99px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', fontSize: '10px', fontWeight: 700, color: '#22c55e', flexShrink: 0 }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
            Connected
        </div>
    );
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '99px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', flexShrink: 0 }}>
            Not connected
        </div>
    );
};

const YouTubePanel = ({ user }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(60);
    const [playerStateCode, setPlayerStateCode] = useState(-1);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleConnectGoogle = async () => {
        setLoading(true);
        setHasError(false);
        if (window.google) {
            const client = window.google.accounts.oauth2.initCodeClient({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/calendar.readonly',
                ux_mode: 'popup',
                callback: async (response) => {
                    if (response.error) {
                        setHasError(true);
                        setLoading(false);
                        return;
                    }
                    try {
                        const res = await fetch(`${API_URL}/google/auth`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
                            body: JSON.stringify({ code: response.code })
                        });
                        if (res.ok) {
                            setIsConnected(true);
                            fetchPlaylists();
                        } else {
                            setHasError(true);
                        }
                    } catch {
                        setHasError(true);
                    } finally {
                        setLoading(false);
                    }
                },
            });
            client.requestCode();
        } else {
            setHasError(true);
            setLoading(false);
        }
    };

    const fetchPlaylists = async () => {
        try {
            const res = await fetch(`${API_URL}/youtube/playlists`, {
                headers: { 'x-user-id': user.id }
            });
            if (res.ok) {
                const data = await res.json();
                setPlaylists(data);
                setIsConnected(true);
                setHasError(false);
                const saved = localStorage.getItem('aiimin_yt_playlist');
                if (saved) setActivePlaylist(saved);
            } else {
                setHasError(true);
            }
        } catch {
            setHasError(true);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('aiimin_yt_playlist');
        if (saved) { setIsConnected(true); setActivePlaylist(saved); }
    }, []);

    const handleSelectPlaylist = (id) => {
        setActivePlaylist(id);
        localStorage.setItem('aiimin_yt_playlist', id);
        setIsPlaying(true);
    };

    const handleDisconnect = () => {
        if (window.confirm('Disconnect YouTube? Your playlist preference will be cleared.')) {
            setIsConnected(false);
            setActivePlaylist('');
            setPlaylists([]);
            setHasError(false);
            localStorage.removeItem('aiimin_yt_playlist');
        }
    };

    const isBuffering = playerStateCode === 3;

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                        <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-1)' }}>Focus Music</span>
                </div>
                <IntegrationBadge connected={isConnected} error={hasError} />
            </div>

            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Error fallback */}
                {hasError && (
                    <div style={{ padding: '10px 12px', background: 'rgba(235,140,140,0.08)', border: '1px solid rgba(235,140,140,0.18)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: 'var(--danger)', flexShrink: 0 }}>⚠</span>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--danger)', marginBottom: '6px' }}>
                                Authentication failed. Token may have expired.
                            </div>
                            <button onClick={handleConnectGoogle} style={{ padding: '5px 12px', background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                                Reconnect Google
                            </button>
                        </div>
                    </div>
                )}

                {/* Not connected */}
                {!isConnected && !hasError && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.55, margin: 0 }}>
                            Connect your Google account to play personal focus playlists during sessions.
                        </p>
                        <button
                            onClick={handleConnectGoogle}
                            disabled={loading}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '10px 16px', background: 'var(--bg-elevated)',
                                border: '1px solid var(--border)', borderRadius: '10px',
                                fontSize: '13px', fontWeight: 600, color: 'var(--text-1)',
                                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                                opacity: loading ? 0.7 : 1,
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                        >
                            <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {loading ? 'Connecting…' : 'Connect Google Account'}
                        </button>
                        {/* Privacy note */}
                        <div style={{ fontSize: '10px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            Read-only access. Your watch history is never accessed or stored.
                        </div>
                    </div>
                )}

                {/* Connected — Playlist selector */}
                {isConnected && !activePlaylist && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {playlists.length === 0 ? (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <button onClick={fetchPlaylists} style={{ padding: '8px 14px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                    Load My Playlists
                                </button>
                                <button onClick={handleDisconnect} style={{ padding: '8px 14px', background: 'none', color: 'var(--text-3)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                                {playlists.map(p => (
                                    <div key={p.id} onClick={() => handleSelectPlaylist(p.id)}
                                        style={{ background: 'var(--bg-elevated)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)', transition: 'border-color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                                    >
                                        <img src={p.thumbnail} alt={p.title} style={{ width: '100%', height: '60px', objectFit: 'cover', display: 'block' }} />
                                        <div style={{ padding: '6px 8px', fontSize: '10px', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {p.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Active player */}
                {isConnected && activePlaylist && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <YouTubePlayer
                            playlistId={activePlaylist}
                            isPlaying={isPlaying}
                            volume={volume}
                            onStateChange={(code) => setPlayerStateCode(code)}
                        />

                        {/* Status + change */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: isBuffering ? 'var(--text-3)' : isPlaying ? 'var(--accent)' : 'var(--text-2)' }}>
                                {isBuffering ? 'Buffering…' : isPlaying ? '▶ Playing' : '⏸ Paused'}
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => setActivePlaylist('')} style={{ padding: '4px 10px', background: 'none', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', cursor: 'pointer' }}>
                                    Change
                                </button>
                                <button onClick={handleDisconnect} style={{ padding: '4px 10px', background: 'none', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', cursor: 'pointer' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                                >
                                    Disconnect
                                </button>
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                            <button onClick={() => window.ytPrevVideo?.()} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
                            </button>
                            <button onClick={() => setIsPlaying(!isPlaying)} style={{
                                width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent)',
                                border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'transform 0.15s ease',
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {isPlaying ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '3px' }}><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                )}
                            </button>
                            <button onClick={() => window.ytNextVideo?.()} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
                            </button>
                        </div>

                        {/* Volume */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                            <input type="range" min="0" max="100" value={volume}
                                onChange={e => setVolume(Number(e.target.value))}
                                style={{ flex: 1, height: '3px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, minWidth: '24px', textAlign: 'right' }}>{volume}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YouTubePanel;
