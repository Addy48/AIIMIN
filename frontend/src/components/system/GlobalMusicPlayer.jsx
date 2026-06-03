import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Minimize2, Settings, Play, Pause, SkipForward, SkipBack, Plus, Trash2, FolderMusic, Globe } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { saveTrack, getTracks, deleteTrack } from '../../utils/musicDB';

const GlobalMusicPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('internet'); // 'internet' or 'local'
  
  // Internet State
  const [internetLinks, setInternetLinks] = useState(() => {
    const saved = localStorage.getItem('aiimin_yt_playlists');
    return saved ? JSON.parse(saved) : [{ id: '1', name: 'Lofi Girl', url: '5qap5aO4i9A' }];
  });
  const [activeUrl, setActiveUrl] = useState(() => localStorage.getItem('aiimin_yt_music') || '5qap5aO4i9A');

  // Local State
  const [localTracks, setLocalTracks] = useState([]);
  const [activeLocalIndex, setActiveLocalIndex] = useState(0);
  const [isPlayingLocal, setIsPlayingLocal] = useState(false);
  const audioRef = useRef(null);

  const location = useLocation();
  const isFocus = location.pathname === '/focus';

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
    const url = prompt("Paste YouTube Video ID:");
    if (!url) return;
    const name = prompt("Name this vibe (e.g. Deep Work):") || "Untitled";
    const newLink = { id: Date.now().toString(), name, url };
    const updated = [...internetLinks, newLink];
    setInternetLinks(updated);
    localStorage.setItem('aiimin_yt_playlists', JSON.stringify(updated));
    handlePlayInternet(url);
  };

  const handleDeleteInternetLink = (id) => {
    const updated = internetLinks.filter(l => l.id !== id);
    setInternetLinks(updated);
    localStorage.setItem('aiimin_yt_playlists', JSON.stringify(updated));
  };

  const handlePlayInternet = (url) => {
    setActiveUrl(url);
    localStorage.setItem('aiimin_yt_music', url);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      if (file.type.startsWith('audio/')) {
        await saveTrack(Date.now().toString() + Math.random(), file, file.name);
      }
    }
    loadLocalTracks();
  };

  const handleDeleteLocalTrack = async (id) => {
    await deleteTrack(id);
    loadLocalTracks();
  };

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
    if (localTracks.length > 0 && audioRef.current) {
      const file = localTracks[activeLocalIndex].file;
      const objectUrl = URL.createObjectURL(file);
      audioRef.current.src = objectUrl;
      if (isPlayingLocal) {
        audioRef.current.play();
      }
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [activeLocalIndex, localTracks]);

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
          display: 'flex', flexDirection: 'column', gap: '12px',
          transformOrigin: 'bottom right'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: 'var(--color-text-1, #fff)' }}>
            <Music size={16} color="var(--color-accent, #3b82f6)" /> Focus Player
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-3, #888)', cursor: 'pointer', padding: 0 }} title="Minimize">
            <Minimize2 size={16} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', background: 'var(--color-elevated)', borderRadius: '12px', padding: '4px' }}>
          <button onClick={() => setMode('internet')} style={{ flex: 1, padding: '6px', background: mode === 'internet' ? 'var(--color-surface)' : 'transparent', border: mode === 'internet' ? '1px solid var(--color-border)' : 'none', borderRadius: '8px', color: mode === 'internet' ? 'var(--color-text-1)' : 'var(--color-text-3)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Globe size={12} /> Internet
          </button>
          <button onClick={() => setMode('local')} style={{ flex: 1, padding: '6px', background: mode === 'local' ? 'var(--color-surface)' : 'transparent', border: mode === 'local' ? '1px solid var(--color-border)' : 'none', borderRadius: '8px', color: mode === 'local' ? 'var(--color-text-1)' : 'var(--color-text-3)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <FolderMusic size={12} /> Local
          </button>
        </div>

        {mode === 'internet' ? (
          <>
            <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${activeUrl}?autoplay=0&mute=0&controls=1&playsinline=1&rel=0`}
                title="YouTube Music Player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saved Vibes</span>
                <button onClick={handleAddInternetLink} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', padding: 0 }}><Plus size={14} /></button>
              </div>
              <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {internetLinks.map(link => (
                  <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: activeUrl === link.url ? 'rgba(59,130,246,0.1)' : 'var(--color-elevated)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handlePlayInternet(link.url)}>
                    <span style={{ fontSize: '12px', color: activeUrl === link.url ? 'var(--color-accent)' : 'var(--color-text-2)', fontWeight: activeUrl === link.url ? 700 : 500 }}>{link.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteInternetLink(link.id); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', padding: 0 }}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: 'var(--color-elevated)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              {localTracks.length > 0 ? (
                <>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-1)', textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {localTracks[activeLocalIndex]?.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={playPrevLocal} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer' }}><SkipBack size={18} /></button>
                    <button onClick={toggleLocalPlay} style={{ background: 'var(--color-accent)', border: 'none', color: '#fff', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isPlayingLocal ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />}
                    </button>
                    <button onClick={playNextLocal} style={{ background: 'none', border: 'none', color: 'var(--color-text-2)', cursor: 'pointer' }}><SkipForward size={18} /></button>
                  </div>
                  <audio ref={audioRef} onEnded={playNextLocal} />
                </>
              ) : (
                <div style={{ fontSize: '12px', color: 'var(--color-text-3)', textAlign: 'center' }}>No local tracks uploaded.</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Local Library</span>
                <label style={{ color: 'var(--color-accent)', cursor: 'pointer', display: 'flex' }}>
                  <Plus size={14} />
                  <input type="file" multiple accept="audio/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
              </div>
              <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {localTracks.map((track, i) => (
                  <div key={track.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: activeLocalIndex === i ? 'rgba(59,130,246,0.1)' : 'var(--color-elevated)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => { setActiveLocalIndex(i); setIsPlayingLocal(true); }}>
                    <span style={{ fontSize: '12px', color: activeLocalIndex === i ? 'var(--color-accent)' : 'var(--color-text-2)', fontWeight: activeLocalIndex === i ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{track.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteLocalTrack(track.id); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-3)', cursor: 'pointer', padding: 0 }}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
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
