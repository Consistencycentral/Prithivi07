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
    const [name, setName] = useState('');
    const [profession, setProfession] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();

    if (isAuthenticated) {
        router.push('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!profession) {
            setError('Please select your profession');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const result = await login(name.trim(), profession);

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
            minHeight: '100dvh',
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
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <h2 style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: 4,
                        }}>
                            Welcome 👋
                        </h2>
                        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                            Enter your details to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div style={{ marginBottom: 18 }}>
                            <label style={{
                                display: 'block',
                                fontSize: 13,
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: 6,
                            }}>
                                Your Name
                            </label>
                            <input
                                id="login-name"
                                className="input"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoFocus
                                autoComplete="name"
                                style={{ fontSize: 15 }}
                            />
                        </div>

                        {/* Profession Dropdown */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                display: 'block',
                                fontSize: 13,
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                                marginBottom: 6,
                            }}>
                                I am a...
                            </label>
                            <select
                                id="login-profession"
                                className="input"
                                value={profession}
                                onChange={e => setProfession(e.target.value)}
                                required
                                style={{ cursor: 'pointer', fontSize: 15 }}
                            >
                                <option value="">Select Profession</option>
                                {PROFESSIONS.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

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

                        {/* Submit */}
                        <button
                            type="submit"
                            id="login-submit"
                            className="btn-primary"
                            disabled={loading || !name.trim() || !profession}
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                fontSize: 15,
                                opacity: loading || !name.trim() || !profession ? 0.6 : 1,
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
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
                            ) : (
                                'Get Started →'
                            )}
                        </button>
                    </form>
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
