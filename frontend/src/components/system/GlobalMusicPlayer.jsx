import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Minimize2, Play, Pause, SkipForward, SkipBack, Plus, Trash2, Folder, Globe, Link } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { saveTrack, getTracks } from '../../utils/musicDB';

const GlobalMusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Unified State
  const [internetLinks, setInternetLinks] = useState(() => {
    const saved = localStorage.getItem('aiimin_yt_playlists');
    return saved ? JSON.parse(saved) : [{ id: '1', name: 'Lofi Girl', url: '5qap5aO4i9A' }];
  });
  
  const [localTracks, setLocalTracks] = useState([]);
  
  // Playback State
  const [playback, setPlayback] = useState(() => {
    const saved = localStorage.getItem('aiimin_active_playback');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return { type: 'youtube', url: '5qap5aO4i9A' };
  });

  // Local Playback Controls
  const [activeLocalIndex, setActiveLocalIndex] = useState(0);
  const [isPlayingLocal, setIsPlayingLocal] = useState(false);
  const audioRef = useRef(null);

  const location = useLocation();
  const isFocus = location.pathname === '/focus' || location.pathname === '/discipline';

  useEffect(() => {
    loadLocalTracks();
  }, []);

  const loadLocalTracks = async () => {
    try {
      const tracks = await getTracks();
      setLocalTracks(tracks || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddInternetLink = () => {
    const url = prompt("Paste YouTube Video ID (e.g., 5qap5aO4i9A):");
    if (!url) return;
    const name = prompt("Name this vibe/mood (e.g., Deep Work):") || "Untitled";
    const newLink = { id: Date.now().toString(), name, url };
    const updated = [...internetLinks, newLink];
    setInternetLinks(updated);
    localStorage.setItem('aiimin_yt_playlists', JSON.stringify(updated));
    handlePlay('youtube', url);
  };

  const handleDeleteInternetLink = (id) => {
    const updated = internetLinks.filter(l => l.id !== id);
    setInternetLinks(updated);
    localStorage.setItem('aiimin_yt_playlists', JSON.stringify(updated));
  };

  const handlePlay = (type, url = null) => {
    const newPlayback = { type, url };
    setPlayback(newPlayback);
    localStorage.setItem('aiimin_active_playback', JSON.stringify(newPlayback));
    if (type === 'youtube' && isPlayingLocal && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingLocal(false);
    }
    if (type === 'local') {
       setIsPlayingLocal(true);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (file.type.startsWith('audio/')) {
        await saveTrack(Date.now().toString() + Math.random(), file, file.name);
      }
    }
    await loadLocalTracks();
    if (playback.type !== 'local') {
      handlePlay('local');
    }
  };

  /* handleDeleteLocalTrack removed */

  const toggleLocalPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingLocal) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlayingLocal(!isPlayingLocal);
  };

  const playNextLocal = () => {
    setActiveLocalIndex((prev) => (prev + 1) % localTracks.length);
  };

  const playPrevLocal = () => {
    setActiveLocalIndex((prev) => (prev === 0 ? localTracks.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (playback.type === 'local' && localTracks.length > 0 && audioRef.current) {
      const file = localTracks[activeLocalIndex]?.file;
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        audioRef.current.src = objectUrl;
        if (isPlayingLocal) {
          audioRef.current.play().catch(() => setIsPlayingLocal(false));
        }
        return () => URL.revokeObjectURL(objectUrl);
      }
    }
  }, [activeLocalIndex, localTracks, playback.type, isPlayingLocal]);

  return (
    <div style={{ 
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, 
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px',
      transform: isFocus ? 'none' : 'translateX(9999px)',
      opacity: isFocus ? 1 : 0,
      pointerEvents: isFocus ? 'auto' : 'none',
      transition: 'opacity 0.3s ease'
    }}>
      
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
          display: 'flex', flexDirection: 'column', gap: '16px',
          transformOrigin: 'bottom right'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: 'var(--color-text-1, #fff)' }}>
            <Music size={16} color="var(--color-accent, #3b82f6)" /> Focus Player
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-3, #888)', cursor: 'pointer', padding: 0 }} title="Minimize">
            <Minimize2 size={16} />
          </button>
        </div>

        {/* Current Playback Section */}
        {playback.type === 'youtube' ? (
          <div style={{ width: '100%', height: '180px', borderRadius: '16px', overflow: 'hidden', background: '#000', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${playback.url}?autoplay=0&mute=0&controls=1&playsinline=1&rel=0`}
              title="YouTube Music Player" frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div style={{ background: 'var(--color-elevated)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1) inset' }}>
            {localTracks.length > 0 ? (
              <>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-1)', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {localTracks[activeLocalIndex]?.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <button onClick={playPrevLocal} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer' }}><SkipBack size={20} /></button>
                  <button onClick={toggleLocalPlay} style={{ background: 'var(--color-accent)', border: 'none', color: '#fff', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
                    {isPlayingLocal ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />}
                  </button>
                  <button onClick={playNextLocal} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer' }}><SkipForward size={20} /></button>
                </div>
                <audio ref={audioRef} onEnded={playNextLocal} />
              </>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--color-text-3)', textAlign: 'center', fontWeight: 600 }}>No local tracks uploaded.</div>
            )}
          </div>
        )}

        {/* Moods / Playlists Library */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vibes & Playlists</span>
            <div style={{ display: 'flex', gap: '8px' }}>
               <button onClick={handleAddInternetLink} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer', padding: '4px', borderRadius: '4px' }} title="Add YouTube Link"><Link size={14} /></button>
               <label style={{ color: 'var(--color-text-2)', cursor: 'pointer', display: 'flex', padding: '4px' }} title="Upload Local Tracks">
                 <Plus size={14} />
                 <input type="file" multiple accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />
               </label>
            </div>
          </div>
          
          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
            {/* Local Library Item */}
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: playback.type === 'local' ? 'rgba(59,130,246,0.1)' : 'var(--color-elevated)', borderRadius: '10px', cursor: 'pointer', border: playback.type === 'local' ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent' }} 
              onClick={() => handlePlay('local')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Folder size={14} color={playback.type === 'local' ? 'var(--color-accent)' : 'var(--color-text-3)'} />
                 <span style={{ fontSize: '13px', color: playback.type === 'local' ? 'var(--color-text-1)' : 'var(--color-text-2)', fontWeight: playback.type === 'local' ? 800 : 600 }}>Local Music Library</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-3)', fontWeight: 700 }}>{localTracks.length} tracks</span>
            </div>

            {/* YouTube Moods Items */}
            {internetLinks.map(link => (
              <div 
                key={link.id} 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: playback.type === 'youtube' && playback.url === link.url ? 'rgba(59,130,246,0.1)' : 'var(--color-elevated)', borderRadius: '10px', cursor: 'pointer', border: playback.type === 'youtube' && playback.url === link.url ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent' }} 
                onClick={() => handlePlay('youtube', link.url)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Globe size={14} color={playback.type === 'youtube' && playback.url === link.url ? 'var(--color-accent)' : 'var(--color-text-3)'} />
                   <span style={{ fontSize: '13px', color: playback.type === 'youtube' && playback.url === link.url ? 'var(--color-text-1)' : 'var(--color-text-2)', fontWeight: playback.type === 'youtube' && playback.url === link.url ? 800 : 600 }}>{link.name}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteInternetLink(link.id); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', padding: 0 }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

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
