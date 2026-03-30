import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Logo from '../components/Logo';

const Login = () => {
    const { signUpWithEmail, signInWithEmail } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('AU48');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const prevTheme = localStorage.getItem('aiimin-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        document.documentElement.style.backgroundColor = '#f5f0e8';
        document.body.style.backgroundColor = '#f5f0e8';
        return () => {
            // Restore user's saved theme when leaving login
            document.documentElement.setAttribute('data-theme', prevTheme);
            if (prevTheme === 'dark') document.documentElement.classList.add('dark');
            document.documentElement.style.removeProperty('background-color');
            document.body.style.removeProperty('background-color');
        };
    }, []);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === 'signup') {
                // Final validation check
                const usernameRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9@+-_]{6,}$/;
                if (!usernameRegex.test(username)) {
                    setError("Username does not meet security requirements.");
                    setLoading(false);
                    return;
                }
                await signUpWithEmail(email, password, fullName, username);
                setError("Account created! Redirecting...");
            } else {
                await signInWithEmail(email, password);
            }
        } catch (err) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        fontSize: '15px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        color: 'var(--text-1)',
        outline: 'none',
        marginBottom: '16px',
        transition: 'all 0.2s ease',
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'inherit'
        }}>

            {/* Background decoration */}
            <div style={{
                position: 'absolute', pointerEvents: 'none', zIndex: 0,
                width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(194,120,20,0.08) 0%, transparent 70%)',
                top: '-150px', right: '-150px', filter: 'blur(60px)'
            }}></div>
            <div style={{
                position: 'absolute', pointerEvents: 'none', zIndex: 0,
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(224,92,42,0.06) 0%, transparent 70%)',
                bottom: '-100px', left: '-100px', filter: 'blur(50px)'
            }}></div>

            {/* Subtle decorative circles */}
            <div style={{ position: 'absolute', borderRadius: '50%', border: '1px solid rgba(194,120,20,0.08)', pointerEvents: 'none', width: '300px', height: '300px', top: '10%', right: '5%' }}></div>
            <div style={{ position: 'absolute', borderRadius: '50%', border: '1px solid rgba(194,120,20,0.08)', pointerEvents: 'none', width: '200px', height: '200px', top: '30%', right: '15%' }}></div>
            <div style={{ position: 'absolute', borderRadius: '50%', border: '1px solid rgba(194,120,20,0.08)', pointerEvents: 'none', width: '150px', height: '150px', top: '20%', right: '20%' }}></div>

            {/* Center card */}
            <div style={{
                zIndex: 1, position: 'relative',
                maxWidth: '420px', width: 'calc(100% - 40px)',
                backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '24px', padding: '52px 44px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>

                <div style={{ marginBottom: '16px' }}>
                    <Logo size={64} />
                </div>

                <span style={{
                    display: 'inline-block', fontSize: '11px', fontWeight: 600,
                    color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: '12px', padding: '4px 10px',
                    background: 'rgba(194,120,20,0.08)', borderRadius: '99px'
                }}>
                    Personal Life OS
                </span>

                <span style={{
                    fontSize: '40px', fontWeight: 900,
                    background: 'var(--gradient-1)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', letterSpacing: '-2px',
                    display: 'block', marginBottom: '32px'
                }}>
                    AIIMIN
                </span>

                {/* Tabs */}
                <div style={{ display: 'flex', width: '100%', marginBottom: '24px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', padding: '4px' }}>
                    <button
                        onClick={() => { setMode('login'); setError(null); }}
                        style={{
                            flex: 1, padding: '10px 0', fontSize: '14px', fontWeight: 600, borderRadius: '8px',
                            background: mode === 'login' ? 'var(--bg-card)' : 'transparent',
                            color: mode === 'login' ? 'var(--text-1)' : 'var(--text-3)',
                            boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s ease', cursor: 'pointer', border: 'none'
                        }}
                    >
                        Log In
                    </button>
                    <button
                        onClick={() => { setMode('signup'); setError(null); }}
                        style={{
                            flex: 1, padding: '10px 0', fontSize: '14px', fontWeight: 600, borderRadius: '8px',
                            background: mode === 'signup' ? 'var(--bg-card)' : 'transparent',
                            color: mode === 'signup' ? 'var(--text-1)' : 'var(--text-3)',
                            boxShadow: mode === 'signup' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s ease', cursor: 'pointer', border: 'none'
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                {error && (
                    <div style={{ width: '100%', padding: '12px 14px', background: 'var(--danger-dim)', color: 'var(--danger)', borderRadius: '12px', fontSize: '13px', fontWeight: 500, marginBottom: '20px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    {mode === 'signup' && (
                        <>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                            <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setUsername(val);
                                        const regex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9@+-_]{6,}$/;
                                        if (val && !regex.test(val)) {
                                            setUsernameError("Min 6 chars, 1 uppercase, 1 number (@+-_ allowed)");
                                        } else {
                                            setUsernameError(null);
                                        }
                                    }}
                                    style={{
                                        ...inputStyle,
                                        borderColor: usernameError ? 'var(--danger)' : 'var(--border)',
                                        marginBottom: usernameError ? '4px' : '16px'
                                    }}
                                    required
                                />
                                {usernameError && (
                                    <div style={{ fontSize: '10px', color: 'var(--danger)', marginBottom: '12px', fontWeight: 600, paddingLeft: '4px' }}>
                                        {usernameError}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    <input
                        type="text"
                        placeholder="Email or Username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                    />
                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ ...inputStyle, paddingRight: '46px' }}
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            tabIndex={-1}
                            style={{
                                position: 'absolute', right: '14px', top: '50%',
                                transform: 'translateY(-62%)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-3)', fontSize: '17px', padding: '0',
                                display: 'flex', alignItems: 'center', lineHeight: 1,
                                userSelect: 'none',
                            }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? '🙈' : '👁'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', height: '52px',
                            background: 'var(--gradient-1)',
                            color: 'white', border: 'none', borderRadius: '14px',
                            fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(224,92,42,0.3)', marginBottom: '20px'
                        }}
                    >
                        {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.7 }}>
                    <div>Your data is private.</div>
                    <div>Only you have access to this dashboard.</div>
                </div>

            </div>
        </div>
    );
};

export default Login;
