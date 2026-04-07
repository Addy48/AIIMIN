import React from 'react';

const SpotifyPlayer = () => (
    <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: '20px',
        textAlign: 'center',
        color: 'var(--text-3)',
        fontSize: '13px',
    }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎵</div>
        <div style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: '4px' }}>Spotify Integration</div>
        <div>Connect Spotify in Settings to see now playing.</div>
    </div>
);

export default SpotifyPlayer;
