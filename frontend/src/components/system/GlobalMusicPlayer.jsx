import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Minimize2, Maximize2, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const GlobalMusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState(() => localStorage.getItem('aiimin_yt_music') || '5qap5aO4i9A');

  const handleChange = () => {
    const newUrl = prompt("Paste a YouTube Video ID or Playlist ID (e.g., 5qap5aO4i9A):", url);
    if (newUrl) {
      setUrl(newUrl);
      localStorage.setItem('aiimin_yt_music', newUrl);
    }
  };

  const location = useLocation();
  const isFocus = location.pathname === '/focus';

  return (
    <div style={{ 
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, 
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px',
      // If not in focus room, move it offscreen so it stays mounted but invisible
      transform: isFocus ? 'none' : 'translateX(9999px)',
      opacity: isFocus ? 1 : 0,
      pointerEvents: isFocus ? 'auto' : 'none',
      transition: 'opacity 0.3s ease'
    }}>
      
      {/* Always mounted iframe wrapper to prevent reloading and stopping the music */}
      <motion.div
        animate={{
          opacity: isOpen ? 1 : 0,
          scale: isOpen ? 1 : 0.8,
          y: isOpen ? 0 : 20,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        initial={false}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          background: 'var(--color-surface, #111)',
          border: '1px solid var(--color-border, #333)',
          borderRadius: '24px',
          width: '320px',
          padding: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', gap: '12px',
          transformOrigin: 'bottom right'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1, #fff)' }}>
            <Music size={16} color="var(--color-accent, #3b82f6)" /> Focus Player
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleChange} style={{ background: 'none', border: 'none', color: 'var(--color-text-3, #888)', cursor: 'pointer', padding: 0 }} title="Change Playlist">
              <Settings size={14} />
            </button>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-3, #888)', cursor: 'pointer', padding: 0 }} title="Minimize">
              <Minimize2 size={16} />
            </button>
          </div>
        </div>
        <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
          {/* We must keep iframe mounted. We use the Youtube Embed URL. */}
          <iframe
            width="100%" height="100%"
            src={`https://www.youtube.com/embed/${url}?autoplay=0&mute=0&controls=1&playsinline=1&rel=0`}
            title="YouTube Music Player" frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            style={{
              width: '56px', height: '56px', borderRadius: '28px',
              background: 'var(--color-surface, #111)', border: '1px solid var(--color-border, #333)',
              color: 'var(--color-text-1, #fff)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              position: 'absolute', bottom: 0, right: 0
            }}
          >
            <Music size={24} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GlobalMusicPlayer;
