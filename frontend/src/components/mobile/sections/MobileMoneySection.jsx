import React, { useState } from 'react';
import { SectionCard } from './Shared';
import { numInput } from "../MobileUI";

const MobileMoneySection = ({ user, accounts }) => {
    const [txType, setTxType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');
    const [descFocused, setDescFocused] = useState(false);
    const [accountId, setAccountId] = useState('');
    const [recent, setRecent] = useState([]);
    const [saving, setSaving] = useState(false);

    const CATS = [
        { name: 'Food', icon: '🍜', color: 'var(--accent)' },
        { name: 'Drinks', icon: '☕', color: 'var(--gold)' },
        { name: 'Snacks', icon: '🍪', color: 'var(--color-warning)' },
        { name: 'Shopping', icon: '🛒', color: 'var(--color-info)' },
        { name: 'Outfit', icon: '🧥', color: 'var(--color-info)' },
        { name: 'Household', icon: '🪑', color: 'var(--text-3)' },
        { name: 'Body Care', icon: '☃️', color: 'var(--accent)' },
        { name: 'Education', icon: '📙', color: 'var(--success)' },
        { name: 'Subscriptions', icon: '🎥', color: 'var(--gold)' },
        { name: 'Transport', icon: '🚖', color: 'var(--color-info)' },
        { name: 'Health', icon: '🧘🏼', color: 'var(--success)' },
        { name: 'Misc', icon: '🌐', color: 'var(--text-3)' },
        { name: 'Earning', icon: '🏅', color: 'var(--gold)' },
    ];

    const KEYWORDS = {
        'Food': ['pizza', 'burger', 'roll', 'chowmein', 'noodles', 'maggi', 'momos', 'sandwich', 'sub', 'puff', 'vada pav', 'samosa', 'kachori', 'shawarma', 'manchurian', 'wings', 'chilly potato', 'fries', 'french fries', 'fried rice', 'omlette', 'bread pakoda', 'dahi', 'chole', 'lunch', 'dinner', 'breakfast', 'party', 'food', 'mcdonalds', 'mcd', 'swiggy', 'zomato', 'train food'],
        'Drinks': ['tea', 'chai', 'lassi', 'pepsi', 'coke', 'dew', 'juice', 'shake', 'coffee', '7up', 'slice', 'fizz', 'sting', 'mirinda', 'monster', 'lemonata', 'sugarcane', 'litchi', 'lemon water', 'milk', 'oreo shake', 'mango shake', 'ice tea', 'hot chocolate', 'cold coffee', 'cold drink', 'sprite', 'bisleri', 'nimbu', 'buttermilk', 'thums up'],
        'Snacks': ['chips', 'chocolate', 'ice cream', 'biscuit', 'oreo', 'kitkat', 'dairy milk', 'popcorn', 'chewing gum', 'protein bar', 'proteinbar', 'cookie', 'rumbles', 'hide&seek', 'hide and seek', 'marie', 'snack', 'mathri', 'namkeen', 'food supplies'],
        'Shopping': ['blinkit', 'zepto', 'instamart', 'insta mart', 'amazon', 'flipkart', 'myntra', 'meesho'],
        'Outfit': ['jersey', 'hoodie', 'tshirt', 'shirt', 'trousers', 'jeans', 'shorts', 'gym shirt', 'gym trousers', 'clothes', 'shoes', 'sneakers', 'slippers', 'af1', 'footwear', 'shoe bag', 'watch', 'g-shock', 'h&m', 'outfit', 'dress', 'jacket', 'kurta'],
        'Household': ['earphones', 'headphones', 'speaker', 'jbl', 'sennheiser', 'charger', 'cable', 'pillow', 'hanger', 'wiper', 'bat', 'posters', 'handwash', 'toiletries', 'frame', 'water bottle', 'bottle'],
        'Body Care': ['serum', 'sunscreen', 'moisturizer', 'face wash', 'facewash', 'shampoo', 'haircut', 'hair cut', 'perfume', 'deodorant', 'rollon', 'scrubber', 'hairband', 'toothbrush', 'brush', 'tongue cleaner', 'skincare', 'lip balm', 'lotion', 'conditioner', 'hair oil', 'face mask'],
        'Education': ['print', 'pen', 'pencil', 'copy', 'cutter', 'sheets', 'file', 'lab', 'aws', 'course', 'study', 'book', 'notebook', 'pages', 'pbl', 'os lab'],
        'Subscriptions': ['netflix', 'spotify', 'youtube', 'yt premium', 'amazon prime', 'apple one', 'hotstar', 'prime video', 'subscription'],
        'Transport': ['auto', 'bus', 'train', 'bike', 'taxi', 'cab', 'rickshaw', 'rapido', 'uber', 'ola', 'petrol', 'fuel', 'toll', 'metro', 'ticket', 'nptel'],
        'Health': ['medicine', 'medicines', 'ors', '1mg', 'hospital', 'doctor', 'pharmacy', 'apollo', 'tablet', 'clinic', 'azithromycin', 'cofsils', 'strip'],
        'Misc': ['recharge', 'screen guard', 'ipad cover', 'cleaning kit', 'table clock', 'tumbler', 'fevikwik', 'dream cricket', 'paytm gold', 'trip', 'tennis ball', 'dust cleaner', 'apple pencil', 'keyboard', 'mouse'],
        'Earning': ['dscout', 'attapoll', 'neevo', 'testerwork', 'pulse lab', 'pulselab', 'user interview', 'userq', 'cashkaro', 'freelance', 'payment received', 'bounty', 'income'],
    };

    const ITEM_PRIORITY = [
        'Food', 'Drinks', 'Snacks', 'Outfit', 'Household', 'Body Care',
        'Education', 'Subscriptions', 'Transport', 'Health', 'Misc', 'Earning',
    ];

    const PLATFORM_PRIORITY = ['Shopping'];

    const matchCategory = (text) => {
        const lower = text.toLowerCase();
        // Item-level signals always win; platform names are a fallback.
        for (const cat of ITEM_PRIORITY) {
            const words = KEYWORDS[cat] || [];
            if (words.some(w => lower.includes(w))) return cat;
        }
        for (const cat of PLATFORM_PRIORITY) {
            const words = KEYWORDS[cat] || [];
            if (words.some(w => lower.includes(w))) return cat;
        }
        return '';
    };

    const handleDescChange = (val) => {
        setDesc(val);
        if (val.length < 2) {
            if (!val.trim()) setCategory('');
            return;
        }
        if (!category) {
            const matched = matchCategory(val);
            if (matched) setCategory(matched);
        }
    };

    const handleLog = async () => {
        if (!amount || isNaN(amount)) return;
        setSaving(true);
        try {
            const { insertRow } = await import('../../../services/dbService');
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-CA');
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            let finalAmount = parseFloat(amount);
            if (txType === 'expense') finalAmount = -Math.abs(finalAmount);
            else finalAmount = Math.abs(finalAmount);

            const catName = txType === 'income' ? 'Earning' : (category || 'Misc');

            const data = await insertRow('money_transactions', {
                user_id: user.id, date: dateStr, category: catName,
                description: desc.trim() || null, amount: finalAmount,
                source: 'mobile', currency: 'INR',
                type: txType, account_id: accountId || null,
                time_of_day: timeStr,
            });

            if (data?.[0]) {
                setRecent(prev => [data[0], ...prev].slice(0, 5));
                const { default: toast } = await import('../../../utils/toast');
                toast.success('Logged ✓');
            }
            setAmount(''); setDesc(''); setCategory(''); setDescFocused(false);
        } catch (err) {
            const { default: toast } = await import('../../../utils/toast');
            toast.error('Failed: ' + err.message);
        }
        setSaving(false);
    };

    // Fetch today's recent on mount
    React.useEffect(() => {
        if (!user) return;
        const fetchRecent = async () => {
            const { default: supabase } = await import('../../../utils/supabase');
            const today = new Date().toLocaleDateString('en-CA');
            const { data } = await supabase.from('money_transactions')
                .select('*').eq('user_id', user.id).eq('date', today)
                .order('created_at', { ascending: false }).limit(5);
            if (data) setRecent(data);
        };
        fetchRecent();
    }, [user]);

    const fmtINR = (v) => '₹' + Math.abs(v).toLocaleString('en-IN', { maximumFractionDigits: 0 });

    const relTime = (ts) => {
        const diff = (Date.now() - new Date(ts).getTime()) / 60000;
        if (diff < 60) return `${Math.round(diff)}m`;
        return `${Math.round(diff / 60)}h`;
    };

    return (
        <SectionCard icon="💸" title="MONEY">
            {/* IN / OUT toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <button type="button" onClick={() => setTxType('income')}
                    style={{
                        padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '14px',
                        cursor: 'pointer', minHeight: '48px',
                        background: txType === 'income' ? 'var(--color-success-dim)' : 'var(--bg-elevated)',
                        color: txType === 'income' ? 'var(--color-success)' : 'var(--text-3)',
                    }}>💰 IN</button>
                <button type="button" onClick={() => setTxType('expense')}
                    style={{
                        padding: '12px', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '14px',
                        cursor: 'pointer', minHeight: '48px',
                        background: txType === 'expense' ? 'var(--color-danger-dim)' : 'var(--bg-elevated)',
                        color: txType === 'expense' ? 'var(--color-danger)' : 'var(--text-3)',
                    }}>💸 OUT</button>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'block' }}>Amount</label>
                <input type="number" inputMode="decimal" value={amount} placeholder="₹ 0"
                    onChange={e => setAmount(e.target.value)}
                    style={{ ...numInput, fontSize: '22px', fontWeight: 800, width: '100%', padding: '12px' }} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'block' }}>What for?</label>
                <input type="text" value={desc} placeholder="e.g. chai, fried rice, blinkit chips"
                    onChange={e => handleDescChange(e.target.value)}
                    onFocus={() => setDescFocused(true)}
                    onBlur={() => setTimeout(() => setDescFocused(false), 100)}
                    style={{ ...numInput, width: '100%', fontSize: '14px' }} />
                {(descFocused || desc.length > 0 || category) && (
                    <div style={{ marginTop: '6px', display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'nowrap', paddingBottom: '4px' }}>
                        {CATS.map(c => (
                            <button key={c.name} type="button" onClick={() => setCategory(c.name)}
                                style={{
                                    padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                                    border: `1.5px solid ${category === c.name ? c.color : 'var(--border)'}`,
                                    background: category === c.name ? `var(--color-${c.name === 'Food' || c.name === 'Body Care' ? 'accent' : c.name === 'Drinks' || c.name === 'Outfit' || c.name === 'Subscriptions' || c.name === 'Earning' ? 'gold' : c.name === 'Education' || c.name === 'Health' ? 'success' : 'text-3'}-dim)` : 'var(--bg-elevated)',
                                    color: category === c.name ? c.color : 'var(--text-3)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px',
                                    whiteSpace: 'nowrap', flex: '0 0 auto',
                                }}>
                                {c.icon} {c.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Account */}
            {accounts.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px', display: 'block' }}>Account</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {accounts.map(a => (
                            <button key={a.id} type="button" onClick={() => setAccountId(accountId === a.id ? '' : a.id)}
                                style={{
                                    padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                                    border: `1.5px solid ${accountId === a.id ? 'var(--accent)' : 'var(--border)'}`,
                                    background: accountId === a.id ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                                    color: accountId === a.id ? 'var(--accent)' : 'var(--text-3)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                    minHeight: '44px',
                                }}>
                                {a.icon} {a.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Timestamp */}
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '10px' }}>
                ⏱ {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>

            {/* Log button */}
            <button onClick={handleLog} disabled={saving || !amount}
                style={{
                    width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                    background: amount ? 'var(--accent)' : 'var(--bg-elevated)',
                    color: amount ? '#fff' : 'var(--text-3)',
                    fontWeight: 700, fontSize: '14px', minHeight: '48px',
                    cursor: amount ? 'pointer' : 'default', opacity: saving ? 0.6 : 1,
                }}>
                {saving ? 'Logging...' : 'Log ✓'}
            </button>

            {/* Recent */}
            {recent.length > 0 && (
                <div style={{ marginTop: '14px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '6px' }}>Today's Log</div>
                    {recent.map((tx, i) => {
                        const isIn = Number(tx.amount) > 0;
                        const cat = CATS.find(c => c.name === tx.category);
                        return (
                            <div key={tx.id || i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '12px' }}>
                                <span style={{ color: isIn ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{isIn ? '↑' : '↓'}</span>
                                <span style={{ fontWeight: 700, color: 'var(--text-1)', minWidth: '55px' }}>{fmtINR(tx.amount)}</span>
                                <span style={{ color: 'var(--text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description || tx.category}</span>
                                {cat && <span style={{ fontSize: '10px' }}>{cat.icon}</span>}
                                <span style={{ color: 'var(--text-3)', fontSize: '10px' }}>{relTime(tx.created_at)}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </SectionCard>
    );
};

export default MobileMoneySection;
