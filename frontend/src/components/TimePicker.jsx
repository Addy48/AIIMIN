import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

const TimePicker = ({ value, onChange, label, placeholder = 'Select time' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState('12');
    const [minutes, setMinutes] = useState('00');
    const [period, setPeriod] = useState('AM');
    const containerRef = useRef(null);

    useEffect(() => {
        if (value) {
            const [valH, valM] = value.split(':');
            let h = parseInt(valH, 10);
            const m = valM || '00';
            const p = h >= 12 ? 'PM' : 'AM';
            if (h === 0) h = 12;
            else if (h > 12) h -= 12;
            setHours(h.toString());
            setMinutes(m);
            setPeriod(p);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleConfirm = () => {
        let h = parseInt(hours, 10);
        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        onChange(`${h.toString().padStart(2, '0')}:${minutes}`);
        setIsOpen(false);
    };

    const displayTime = value ? `${hours}:${minutes} ${period}` : '';

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            {label && (
                <label style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--text-2, #b5b5b5)',
                    marginBottom: '6px',
                    display: 'block',
                    letterSpacing: '0.02em',
                }}>
                    {label}
                </label>
            )}

            <button
                type="button"
                aria-label={label ? `${label}: ${displayTime || 'not set'}` : 'Select time'}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    minHeight: '44px',
                    background: 'var(--bg-secondary, #242424)',
                    border: '1px solid var(--border, #3a3a3a)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    color: value ? 'var(--text-1, #f5f5f5)' : 'var(--text-3, #71717a)',
                    fontSize: '13.5px',
                    fontWeight: value ? 600 : 400,
                    transition: 'border-color 0.15s ease',
                    boxSizing: 'border-box',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color={value ? 'var(--color-accent, #ff6b35)' : 'var(--text-3, #71717a)'} />
                    <span>{displayTime || placeholder}</span>
                </div>
                <ChevronDown size={14} color="var(--text-3, #71717a)" />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    zIndex: 1000,
                    top: 'calc(100% + 6px)',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-elevated, #2a2a2a)',
                    border: '1px solid var(--border, #3d3d3d)',
                    borderRadius: '12px',
                    padding: '14px',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
                }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '12px' }}>

                        {/* Hours */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3, #888)', textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>Hour</div>
                            <div style={{ maxHeight: '160px', overflowY: 'auto' }} className="time-scroll">
                                {[...Array(12)].map((_, i) => {
                                    const h = (i + 1).toString();
                                    const isSelected = hours === h;
                                    return (
                                        <div
                                            key={h}
                                            onClick={() => setHours(h)}
                                            style={{
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                fontWeight: isSelected ? 700 : 500,
                                                cursor: 'pointer',
                                                color: isSelected ? '#ffffff' : 'var(--text-2, #b5b5b5)',
                                                background: isSelected ? 'var(--color-accent, #ff6b35)' : 'transparent',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            {h}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Minutes */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3, #888)', textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>Minute</div>
                            <div style={{ maxHeight: '160px', overflowY: 'auto' }} className="time-scroll">
                                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => {
                                    const isSelected = minutes === m;
                                    return (
                                        <div
                                            key={m}
                                            onClick={() => setMinutes(m)}
                                            style={{
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                fontWeight: isSelected ? 700 : 500,
                                                cursor: 'pointer',
                                                color: isSelected ? '#ffffff' : 'var(--text-2, #b5b5b5)',
                                                background: isSelected ? 'var(--color-accent, #ff6b35)' : 'transparent',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            {m}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AM / PM */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '20px' }}>
                            {['AM', 'PM'].map((p) => {
                                const isSelected = period === p;
                                return (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPeriod(p)}
                                        style={{
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            border: '1px solid var(--border, #3d3d3d)',
                                            background: isSelected ? 'var(--color-accent, #ff6b35)' : 'transparent',
                                            color: isSelected ? '#ffffff' : 'var(--text-2, #b5b5b5)',
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Set Time Action */}
                    <button
                        type="button"
                        onClick={handleConfirm}
                        style={{
                            width: '100%',
                            minHeight: '36px',
                            background: 'var(--color-accent, #ff6b35)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        Set Time
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
