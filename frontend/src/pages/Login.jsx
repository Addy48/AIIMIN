import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Logo from '../components/Logo'; // Added this import

const Login = () => {
    const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.remove('dark');
        document.documentElement.style.backgroundColor = '#f5f0e8';
        document.body.style.backgroundColor = '#f5f0e8';
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
        backgroundColor: '#faf7f2',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '12px',
        color: '#1a1408',
        outline: 'none',
        marginBottom: '16px',
        transition: 'all 0.2s ease',
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f0e8',
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
                backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.07)',
                borderRadius: '24px', padding: '52px 44px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>

                <Logo size={64} style={{ marginBottom: '16px' }} />

                <span style={{
                    display: 'inline-block', fontSize: '11px', fontWeight: 600,
                    color: '#a89878', textTransform: 'uppercase', letterSpacing: '0.1em',
                    marginBottom: '12px', padding: '4px 10px',
                    background: 'rgba(194,120,20,0.08)', borderRadius: '99px'
                }}>
                    Personal Life OS
                </span>

                <span style={{
                    fontSize: '40px', fontWeight: 900,
                    background: 'linear-gradient(135deg, #c27814, #e05c2a)',
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
                            background: mode === 'login' ? '#ffffff' : 'transparent',
                            color: mode === 'login' ? '#1a1408' : '#a89878',
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
                            background: mode === 'signup' ? '#ffffff' : 'transparent',
                            color: mode === 'signup' ? '#1a1408' : '#a89878',
                            boxShadow: mode === 'signup' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.2s ease', cursor: 'pointer', border: 'none'
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                {error && (
                    <div style={{ width: '100%', padding: '12px 14px', background: 'rgba(224,92,42,0.1)', color: '#e05c2a', borderRadius: '12px', fontSize: '13px', fontWeight: 500, marginBottom: '20px', textAlign: 'center' }}>
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
                                        borderColor: usernameError ? '#e05c2a' : 'rgba(0,0,0,0.08)',
                                        marginBottom: usernameError ? '4px' : '16px'
                                    }}
                                    required
                                />
                                {usernameError && (
                                    <div style={{ fontSize: '10px', color: '#e05c2a', marginBottom: '12px', fontWeight: 600, paddingLeft: '4px' }}>
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
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                        minLength={6}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', height: '52px',
                            background: 'linear-gradient(135deg, #c27814, #e05c2a)',
                            color: '#ffffff', border: 'none', borderRadius: '14px',
                            fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(224,92,42,0.3)', marginBottom: '20px'
                        }}
                    >
                        {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: '#a89878', fontSize: '12px', fontWeight: 500 }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }}></div>
                    OR
                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }}></div>
                </div>

                <button
                    onClick={signInWithGoogle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#faf7f2';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
                        e.currentTarget.style.transform = 'none';
                    }}
                    style={{
                        width: '100%', height: '52px', backgroundColor: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.12)', borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                        fontSize: '15px', fontWeight: 500, color: '#1a1408',
                        cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s'
                    }}
                >
                    <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div style={{ marginTop: '24px', fontSize: '12px', color: '#a89878', textAlign: 'center', lineHeight: 1.7 }}>
                    <div>Your data is private.</div>
                    <div>Only you have access to this dashboard.</div>
                </div>

            </div>
        </div>
    );
};

export default Login;
