import React, { useState, useEffect, useRef } from 'react';

const TimePicker = ({ value, onChange, label, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState('12');
    const [minutes, setMinutes] = useState('00');
    const [period, setPeriod] = useState('AM');
    const containerRef = useRef(null);

    useEffect(() => {
        if (value) {
            const [valH, valM] = value.split(':');
            let h = parseInt(valH, 10);
            const m = valM;
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
            {label && <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-2)', marginBottom: '7px', display: 'block' }}>{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px',
                    padding: '10px 14px', cursor: 'pointer',
                    color: value ? 'var(--text-1)' : 'var(--text-3)',
                    fontSize: '14px', justifyContent: 'space-between',
                    transition: 'border-color 0.12s ease',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>🕐</span>
                    <span>{displayTime || placeholder}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>▾</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute', zIndex: 1000, top: 'calc(100% + 4px)', left: 0, right: 0,
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '12px',
                    padding: '16px', boxShadow: 'var(--shadow-lg)',
                }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>

                        {/* Hours */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Hour</div>
                            <div style={{ maxHeight: '180px', overflowY: 'auto' }} className="time-scroll">
                                {[...Array(12)].map((_, i) => {
                                    const h = (i + 1).toString();
                                    const isSelected = hours === h;
                                    return (
                                        <div
                                            key={h}
                                            onClick={() => setHours(h)}
                                            style={{
                                                height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: '6px', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
                                                color: isSelected ? 'var(--accent)' : 'var(--text-2)',
                                                background: isSelected ? 'var(--accent-dim)' : 'transparent',
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
                            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Min</div>
                            <div style={{ maxHeight: '180px', overflowY: 'auto' }} className="time-scroll">
                                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => {
                                    const isSelected = minutes === m;
                                    return (
                                        <div
                                            key={m}
                                            onClick={() => setMinutes(m)}
                                            style={{
                                                height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                borderRadius: '6px', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
                                                color: isSelected ? 'var(--accent)' : 'var(--text-2)',
                                                background: isSelected ? 'var(--accent-dim)' : 'transparent',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            {m}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AM/PM */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
                            {['AM', 'PM'].map(p => {
                                const isSelected = period === p;
                                return (
                                    <div
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        style={{
                                            height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderRadius: '6px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                            color: isSelected ? 'var(--accent)' : 'var(--text-2)',
                                            background: isSelected ? 'var(--accent-dim)' : 'transparent',
                                        }}
                                    >
                                        {p}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        style={{
                            width: '100%', height: '36px', background: 'var(--accent)', border: 'none', borderRadius: '8px',
                            color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                        }}
                    >
                        Set Time
                    </button>

                    <style>{`
                        .time-scroll::-webkit-scrollbar { width: 4px; }
                        .time-scroll::-webkit-scrollbar-track { background: transparent; }
                        .time-scroll::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 4px; }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
