import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, BookOpen, Heart, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ACTIONS = [
  { id: 'family', label: 'Go to Family Vault', route: '/family', icon: Heart, category: 'Navigation' },
  { id: 'overview', label: 'Go to Today Overview', route: '/overview', icon: Compass, category: 'Navigation' },
  { id: 'journal', label: 'Write Journal Entry', route: '/journal', icon: BookOpen, category: 'Actions' },
  { id: 'finance', label: 'Go to Wealth', route: '/finance', icon: TrendingUp, category: 'Navigation' },
  { id: 'add_reminder', label: 'Add Emergency Contact', route: '/family', icon: AlertTriangle, category: 'Actions' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
        setSearch('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredActions = ACTIONS.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [isOpen]);

  const executeAction = (action) => {
    setIsOpen(false);
    navigate(action.route);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter' && filteredActions.length > 0) {
      e.preventDefault();
      executeAction(filteredActions[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
    }}>
      <div 
        style={{ position: 'absolute', inset: 0 }} 
        onClick={() => setIsOpen(false)} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '600px', background: 'var(--color-surface)',
          border: '1px solid var(--color-border)', borderRadius: '16px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.3)', overflow: 'hidden',
          position: 'relative', zIndex: 1
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
          <Search size={20} style={{ color: 'var(--color-text-3)', marginRight: '12px' }} />
          <input
            ref={inputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="What do you want to do? (Cmd+K)"
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontSize: '16px', color: 'var(--color-text-1)', fontFamily: 'var(--font-sans)'
            }}
          />
        </div>

        <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
          {filteredActions.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-3)', fontSize: '14px' }}>
              No commands found.
            </div>
          ) : (
            filteredActions.map((action, i) => {
              const Icon = action.icon;
              const isSelected = i === selectedIndex;
              return (
                <div
                  key={action.id}
                  onClick={() => executeAction(action)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '12px 16px',
                    background: isSelected ? 'var(--color-elevated)' : 'transparent',
                    borderRadius: '8px', cursor: 'pointer', gap: '12px',
                    transition: 'background 0.1s'
                  }}
                >
                  <div style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-3)' }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-1)' }}>{action.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-3)' }}>{action.category}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
