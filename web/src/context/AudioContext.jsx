import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioIdx, setAudioIdx] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && audioFiles.length > 0) {
      audioRef.current.play().catch(() => {});
    }
  }, [audioIdx, audioFiles.length]);

  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const urls = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
    setAudioFiles(urls);
    setAudioIdx(0);
  };

  const nextAudio = () => setAudioIdx(i => (i + 1) % audioFiles.length);

  return (
    <AudioContext.Provider value={{ audioFiles, audioIdx, audioRef, handleAudioUpload, nextAudio }}>
      {children}
      {/* Hidden audio element that plays globally */}
      {audioFiles.length > 0 && (
        <audio
          ref={audioRef}
          src={audioFiles[audioIdx].url}
          onEnded={nextAudio}
          style={{ display: 'none' }}
        />
      )}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
