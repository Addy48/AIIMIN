import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Pin, Trash2, Hash, Clock, Archive, LayoutGrid, Info, ArrowUpRight, BookOpen, Layers } from 'lucide-react';

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

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                style={{ width: '100%', maxWidth: '900px', background: 'var(--color-base)', border: '1px solid var(--border)', borderRadius: '40px', padding: '60px', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}
            >
                <button onClick={onClose} style={{ position: 'absolute', top: '32px', right: '32px', background: 'var(--bg-elevated)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-1)' }}>
                    <X size={20} />
                </button>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <button key={c} onClick={() => setCategory(c)} style={{ padding: '8px 20px', borderRadius: '12px', border: `1px solid ${category === c ? 'var(--color-accent)' : 'var(--border)'}`, background: category === c ? 'var(--color-accent)' : 'transparent', color: category === c ? '#fff' : 'var(--color-text-3)', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>{c}</button>
                    ))}
                </div>

                <input 
                    autoFocus value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="The North Star of this thought..."
                    style={{ display: 'block', width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '48px', fontWeight: 900, color: 'var(--color-text-1)', marginBottom: '32px', letterSpacing: '-0.04em' }}
                />

                <textarea 
                    value={body} onChange={e => setBody(e.target.value)}
                    placeholder="Collapse the entropy into wisdom..."
                    style={{ display: 'block', width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: '18px', color: 'var(--color-text-2)', lineHeight: 1.8, minHeight: '400px', resize: 'none' }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
                    <button 
                        onClick={() => onSave({ title, body, category })}
                        style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: '20px', padding: '16px 48px', fontSize: '16px', fontWeight: 900, cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 40px 100px 40px' }}>
            
            {/* ── Revolutionary Hero ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '60px 0', marginBottom: '40px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{ background: 'var(--color-accent)', color: '#fff', padding: '6px 16px', borderRadius: '99px', fontSize: '10px', fontWeight: 900, letterSpacing: '0.2em' }}>NOTES</span>
                    </div>
                    <h1 style={{ fontSize: '84px', fontWeight: 900, color: 'var(--color-text-1)', margin: 0, letterSpacing: '-0.06em', lineHeight: 0.9 }}>
                        Knowledge<br />Canvas.
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
                </div>
            </div>

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
