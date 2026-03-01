import React from 'react';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const { signInWithGoogle } = useAuth();

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

                <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.06)', marginBottom: '28px' }}></div>

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
