import React, { useState, useEffect } from 'react';
import YouTubePlayer from './YouTubePlayer';

const YouTubePanel = ({ user }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [activePlaylist, setActivePlaylist] = useState('');
    const [loading, setLoading] = useState(false);

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [playerStateCode, setPlayerStateCode] = useState(-1);

    // Normally this comes from our backend (e.g. localhost:5000/youtube/playlists)
    // For MVP, we simulate the flow if we can't truly do OAuth right now.
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const handleConnectGoogle = async () => {
        setLoading(true);
        // Step 1: Initialize Google Accounts Services for OAuth
        // The script src="https://accounts.google.com/gsi/client" must be in index.html
        if (window.google) {
            const client = window.google.accounts.oauth2.initCodeClient({
                client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/youtube.readonly',
                ux_mode: 'popup',
                callback: async (response) => {
                    if (response.error) {
                        console.error('OAuth Error:', response);
                        setLoading(false);
                        return;
                    }

                    // Send auth code to backend
                    try {
                        const res = await fetch(`${API_URL}/youtube/auth`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-user-id': user.id
                            },
                            body: JSON.stringify({ code: response.code })
                        });

                        if (res.ok) {
                            setIsConnected(true);
                            fetchPlaylists();
                        }
                    } catch (error) {
                        console.error('Token exchange failed', error);
                    } finally {
                        setLoading(false);
                    }
                },
            });
            client.requestCode();
        } else {
            console.error('Google Identity Services not loaded');
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

                // If they have saved preference in localstorage (MVP version of DB save)
                const saved = localStorage.getItem('aiimin_yt_playlist');
                if (saved) setActivePlaylist(saved);
            }
        } catch (error) {
            console.error('Failed to fetch playlists', error);
        }
    };

    // On mount check if we are presumably connected (mock check via localStorage for now)
    useEffect(() => {
        const saved = localStorage.getItem('aiimin_yt_playlist');
        if (saved) {
            // Assume connected to demonstrate UI
            setIsConnected(true);
            setActivePlaylist(saved);
        }
    }, []);

    const handleSelectPlaylist = (id) => {
        setActivePlaylist(id);
        localStorage.setItem('aiimin_yt_playlist', id);
        setIsPlaying(true); // Autoplay when selected
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const handleNext = () => window.ytNextVideo?.();
    const handlePrev = () => window.ytPrevVideo?.();

    const isBuffering = playerStateCode === 3;

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                        <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    Focus Music
                </h3>

                {!isConnected && (
                    <button
                        onClick={handleConnectGoogle}
                        disabled={loading}
                        style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        {loading ? 'Connecting...' : 'Connect YouTube'}
                    </button>
                )}
            </div>

            {/* If connected, show playlist selector and controls */}
            {isConnected ? (
                <div>
                    {!activePlaylist ? (
                        <div>
                            {playlists.length === 0 ? (
                                <div style={{ fontSize: '13px', color: 'var(--text-3)', fontStyle: 'italic' }}>
                                    <button onClick={fetchPlaylists} style={{ padding: '8px', background: 'var(--accent)', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>Fetch My Playlists</button>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {playlists.map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => handleSelectPlaylist(p.id)}
                                            style={{ background: 'var(--bg-elevated)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)' }}
                                            className="hover:border-[var(--accent)] transition-all"
                                        >
                                            <img src={p.thumbnail} alt={p.title} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                                            <div style={{ padding: '8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {p.title}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* Hidden actual YT Player */}
                            <YouTubePlayer
                                playlistId={activePlaylist}
                                isPlaying={isPlaying}
                                volume={volume}
                                onStateChange={(code) => setPlayerStateCode(code)}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
                                    {isBuffering ? 'Buffering...' : (isPlaying ? 'Now Playing' : 'Paused')}
                                </div>
                                <button onClick={() => setActivePlaylist('')} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--text-3)', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Change Playlist
                                </button>
                            </div>

                            {/* Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                                <button onClick={handlePrev} style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                                </button>

                                <button
                                    onClick={togglePlay}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
                                    className="hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    )}
                                </button>

                                <button onClick={handleNext} style={{ background: 'none', border: 'none', color: 'var(--text-1)', cursor: 'pointer' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                                </button>
                            </div>

                            {/* Volume Slider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={volume}
                                    onChange={e => setVolume(Number(e.target.value))}
                                    style={{ flex: 1, height: '4px', accentColor: 'var(--accent)' }}
                                />
                            </div>

                        </div>
                    )}
                </div>
            ) : (
                <div style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.5 }}>
                    Connect your YouTube account to play your personal focus playlists directly from the dashboard.
                </div>
            )}

        </div>
    );
};

export default YouTubePanel;
