import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Pin, Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';


const STORAGE_KEY = 'aiimin_notes_v3';
const CATEGORIES = ['All', 'Ideas', 'Tasks', 'Learning', 'Archive'];

const loadNotes = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
};
const saveNotes = (n) => localStorage.setItem(STORAGE_KEY, JSON.stringify(n));

const NoteCard = ({ note, onPin, onDelete, onArchive, onClick }) => {
    return (
        <motion.div
            layout
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={onClick}
            style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '32px',
                padding: '32px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 900, 
                    color: 'var(--color-accent)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.15em',
                    border: '1px solid var(--color-accent)',
                    padding: '4px 12px',
                    borderRadius: '8px'
                }}>{note.category || 'Thought'}</span>
                {note.pinned && <Pin size={12} fill="var(--color-accent)" color="var(--color-accent)" />}
            </div>
            
            <h3 style={{ 
                fontSize: '22px', 
                fontWeight: 800, 
                color: 'var(--color-text-1)', 
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
            }}>{note.title || 'Untitled Insight'}</h3>
            
            <p style={{ 
                color: 'var(--color-text-3)', 
                fontSize: '14px', 
                lineHeight: 1.7, 
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                opacity: 0.8
            }}>{note.body}</p>

            <div style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-3)', opacity: 0.6 }}>
                    <Clock size={12} />
                    {new Date(note.updatedAt).toLocaleDateString()}
                </div>
                <div style={{ color: 'var(--color-accent)', opacity: 0.4 }}><ArrowUpRight size={16} /></div>
            </div>

            {/* Decorative glass highlight */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        </motion.div>
    );
};

const NoteEditor = ({ note, onSave, onClose }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [body, setBody] = useState(note?.body || '');
    const [category, setCategory] = useState(note?.category || 'Ideas');

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <motion.div 
                initial={{ scale: 0.97, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 16 }}
                style={{ width: '100%', maxWidth: '640px', maxHeight: '88vh', background: 'var(--color-base)', border: '1px solid var(--color-border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', overflow: 'hidden' }}
            >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {CATEGORIES.filter(c => c !== 'All').map(c => (
                            <button key={c} onClick={() => setCategory(c)} style={{ padding: '5px 12px', borderRadius: '8px', border: `1px solid ${category === c ? 'var(--color-accent)' : 'var(--color-border)'}`, background: category === c ? 'var(--color-accent)' : 'var(--color-elevated)', color: category === c ? '#fff' : 'var(--color-text-3)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>{c}</button>
                        ))}
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-elevated)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-3)', transition: 'all 0.15s', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-elevated)'; e.currentTarget.style.color = 'var(--color-text-3)'; }}
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 20px' }}>
                    <input 
                        autoFocus value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="The North Star of this thought..."
                        style={{ display: 'block', width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '26px', fontWeight: 800, color: 'var(--color-text-1)', marginBottom: '16px', letterSpacing: '-0.03em', fontFamily: 'var(--font-serif, serif)' }}
                    />

                    <textarea 
                        value={body} onChange={e => setBody(e.target.value)}
                        placeholder="Collapse the entropy into wisdom..."
                        style={{ display: 'block', width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: 'var(--color-text-2)', lineHeight: 1.75, minHeight: '260px', resize: 'none' }}
                    />
                </div>

                {/* Footer */}
                <div style={{ padding: '14px 28px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                    <button 
                        onClick={() => onSave({ title, body, category })}
                        style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 28px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}
                    >
                        Archive Insight
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [editorNote, setEditorNote] = useState(null);
    const [showEditor, setShowEditor] = useState(false);

    useEffect(() => { setNotes(loadNotes()); }, []);
    useEffect(() => { saveNotes(notes); }, [notes]);

    const handleSave = (data) => {
        if (editorNote) {
            setNotes(prev => prev.map(n => n.id === editorNote.id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n));
        } else {
            setNotes(prev => [{ id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), pinned: false, archived: false }, ...prev]);
        }
        setShowEditor(false);
        setEditorNote(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Erase this insight forever?')) {
            setNotes(prev => prev.filter(n => n.id !== id));
        }
    };

    const filtered = notes.filter(n => {
        const matchesCat = category === 'All' || n.category === category;
        const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="page-container">
            
            {/* ── Revolutionary Hero ── */}
            <PageHeader 
                title={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        Knowledge Canvas<span style={{ color: 'var(--color-accent)', opacity: 0.5 }}>.</span>
                    </span>
                }
                subtitle="NOTES"
                rightContent={
                    <>
                        <div style={{ position: 'relative', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '24px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', width: '360px' }}>
                            <Search size={20} color="var(--color-text-3)" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Query your mind..." style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--color-text-1)', fontSize: '16px', width: '100%' }} />
                        </div>
                        <button 
                            onClick={() => { setEditorNote(null); setShowEditor(true); }}
                            style={{ background: 'var(--color-text-1)', color: 'var(--color-base)', border: 'none', borderRadius: '24px', padding: '20px 40px', fontSize: '18px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-md)' }}
                        >
                            <Plus size={24} strokeWidth={3} /> Capture Thought
                        </button>
                    </>
                }
            />

            {/* ── Categories ── */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '60px', overflowX: 'auto', paddingBottom: '16px' }}>
                {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategory(c)} style={{ padding: '12px 32px', borderRadius: '18px', background: category === c ? 'var(--color-accent)' : 'var(--bg-elevated)', border: `1px solid ${category === c ? 'var(--color-accent)' : 'var(--border)'}`, color: category === c ? '#fff' : 'var(--color-text-3)', fontSize: '14px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}>
                        {c}
                    </button>
                ))}
            </div>

            {/* ── Grid ── */}
            {filtered.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
                    <AnimatePresence>
                        {filtered.map(note => (
                            <NoteCard 
                                key={note.id} 
                                note={note} 
                                onClick={() => { setEditorNote(note); setShowEditor(true); }}
                                onDelete={handleDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '120px 0', textAlign: 'center', background: 'transparent', border: '1px dashed var(--border)', borderRadius: '60px' }}>
                    <BookOpen size={64} style={{ color: 'var(--color-text-3)', opacity: 0.3, marginBottom: '32px' }} />
                    <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-text-1)', marginBottom: '16px' }}>No insights mapped.</h2>
                    <p style={{ color: 'var(--color-text-3)', fontSize: '18px', maxWidth: '400px', margin: '0 auto' }}>Start your notes by capturing high-impact thoughts and system architecture notes.</p>
                </motion.div>
            )}

            <AnimatePresence>
                {showEditor && (
                    <NoteEditor 
                        note={editorNote} 
                        onSave={handleSave} 
                        onClose={() => { setShowEditor(false); setEditorNote(null); }} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notes;
