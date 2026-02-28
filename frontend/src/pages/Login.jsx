import React from 'react';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-10 max-w-md w-full text-center shadow-[var(--shadow)]">
                <h1 className="text-4xl font-bold text-[var(--accent)] mb-2 tracking-tight">AIIMIN</h1>
                <p className="text-[var(--text-2)] mb-8">Personal Life Operating System</p>

                <button
                    onClick={signInWithGoogle}
                    className="w-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-1)] font-medium py-3 px-4 rounded-[var(--radius-md)] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                    </svg>
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
