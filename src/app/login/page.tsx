'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const PROFESSIONS = [
    'Student',
    'Software Engineer',
    'Designer',
    'Product Manager',
    'Data Scientist',
    'Teacher / Professor',
    'Healthcare Professional',
    'Entrepreneur',
    'Creative / Artist',
    'Freelancer',
    'Other Professional',
];

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('signup');
    const [name, setName] = useState('');
    const [profession, setProfession] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup, isAuthenticated, isSupabaseMode } = useAuth();
    const router = useRouter();

    if (isAuthenticated) {
        router.push('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setError('');
        setLoading(true);

        try {
            let result: { error?: string };

            if (isSupabaseMode) {
                if (mode === 'signup') {
                    if (!email || !password) {
                        setError('Email and password are required');
                        setLoading(false);
                        return;
                    }
                    if (password.length < 6) {
                        setError('Password must be at least 6 characters');
                        setLoading(false);
                        return;
                    }
                    result = await signup(name.trim(), profession || 'Student', email, password);
                } else {
                    if (!email || !password) {
                        setError('Email and password are required');
                        setLoading(false);
                        return;
                    }
                    result = await login(name.trim(), profession || 'Student', email, password);
                }
            } else {
                result = await login(name.trim(), profession || 'Student');
            }

            if (result.error) {
                setError(result.error);
                setLoading(false);
                return;
            }

            router.push('/dashboard');
        } catch {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: 600,
                height: 600,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-15%',
                left: '-5%',
                width: 500,
                height: 500,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            <div style={{
                width: '100%',
                maxWidth: 440,
                position: 'relative',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        marginBottom: 16,
                        boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
                    }}>
                        🎯
                    </div>
                    <h1 style={{
                        fontSize: 28,
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        marginBottom: 4,
                    }}>
                        <span className="gradient-text">HabitArc</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        Track your habits. Visualize your progress. Achieve your goals.
                    </p>
                </div>

                {/* Card */}
                <div className="card" style={{ padding: 32 }}>
                    {/* Tab Toggle */}
                    <div className="tab-group" style={{ marginBottom: 28 }}>
                        <button
                            className={`tab-item ${mode === 'signup' ? 'active' : ''}`}
                            onClick={() => setMode('signup')}
                            style={{ flex: 1 }}
                        >
                            Get Started
                        </button>
                        <button
                            className={`tab-item ${mode === 'login' ? 'active' : ''}`}
                            onClick={() => setMode('login')}
                            style={{ flex: 1 }}
                        >
                            Welcome Back
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Your Name
                            </label>
                            <input
                                className="input"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Email {isSupabaseMode && <span style={{ color: 'var(--danger)' }}>*</span>}
                            </label>
                            <input
                                className="input"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required={isSupabaseMode}
                            />
                        </div>

                        {/* Password (only shown when Supabase is configured) */}
                        {isSupabaseMode && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                    Password <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <input
                                    className="input"
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--danger-bg)',
                                color: 'var(--danger)',
                                fontSize: 13,
                                marginBottom: 16,
                                border: '1px solid rgba(239,68,68,0.2)',
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Profession Dropdown */}
                        {mode === 'signup' && (
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                    I am a...
                                </label>
                                <select
                                    className="input"
                                    value={profession}
                                    onChange={e => setProfession(e.target.value)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="">Select Profession</option>
                                    {PROFESSIONS.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Supabase mode indicator */}
                        {!isSupabaseMode && (
                            <div style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--info-bg)',
                                color: 'var(--info)',
                                fontSize: 11,
                                marginBottom: 16,
                                border: '1px solid rgba(59,130,246,0.2)',
                            }}>
                                💡 Running in demo mode (localStorage). Connect Supabase for real auth.
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading || !name.trim()}
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                fontSize: 15,
                                opacity: loading || !name.trim() ? 0.6 : 1,
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{
                                        width: 16,
                                        height: 16,
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                    }} />
                                    Setting up your workspace...
                                </span>
                            ) : mode === 'signup' ? (
                                'Create Account →'
                            ) : (
                                'Sign In →'
                            )}
                        </button>
                    </form>

                    {/* Social hint */}
                    <div style={{
                        marginTop: 20,
                        textAlign: 'center',
                        fontSize: 12,
                        color: 'var(--text-tertiary)',
                    }}>
                        {mode === 'signup'
                            ? 'Already have an account? '
                            : "Don't have an account? "}
                        <button
                            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-primary)',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: 12,
                            }}
                        >
                            {mode === 'signup' ? 'Sign In' : 'Get Started'}
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 12,
                    marginTop: 24,
                }}>
                    {[
                        { emoji: '📊', text: 'Rich Dashboards' },
                        { emoji: '🔥', text: 'Streak Tracking' },
                        { emoji: '📈', text: 'Visual Analytics' },
                    ].map((f, i) => (
                        <div key={i} style={{
                            textAlign: 'center',
                            padding: '12px 8px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-secondary)',
                            fontSize: 12,
                            color: 'var(--text-secondary)',
                        }}>
                            <div style={{ fontSize: 24, marginBottom: 4 }}>{f.emoji}</div>
                            {f.text}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
