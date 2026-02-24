'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/contexts/HabitContext';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊', section: 'main' },
    { href: '/daily', label: 'Daily Tracker', icon: '📋', section: 'views' },
    { href: '/weekly', label: 'Weekly Goals', icon: '🎯', section: 'views' },
    { href: '/monthly', label: 'Monthly Insights', icon: '📈', section: 'views' },
    { href: '/annual', label: 'Annual Overview', icon: '🗓️', section: 'views' },
    { href: '/calendar', label: 'Calendar', icon: '📅', section: 'tools' },
    { href: '/tutorials', label: 'Tutorials', icon: '🎓', section: 'tools' },
    { href: '/downloads', label: 'My Downloads', icon: '📥', section: 'tools' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { habits, addHabit } = useHabits();
    const [newHabitName, setNewHabitName] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            const emojis = ['⭐', '🎯', '💪', '🔥', '✨', '🚀', '💎', '🌟'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            addHabit(newHabitName.trim(), 'General', randomEmoji);
            setNewHabitName('');
        }
    };

    const sections = {
        main: NAV_ITEMS.filter(i => i.section === 'main'),
        views: NAV_ITEMS.filter(i => i.section === 'views'),
        tools: NAV_ITEMS.filter(i => i.section === 'tools'),
    };

    return (
        <>
            {/* Mobile hamburger */}
            <button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
                style={{
                    position: 'fixed',
                    top: 16,
                    left: 16,
                    zIndex: 50,
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-card)',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 20,
                    boxShadow: 'var(--shadow-md)',
                }}
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* Overlay on mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 35,
                        display: 'none',
                    }}
                    className="mobile-overlay"
                />
            )}

            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                            }}>
                                🎯
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
                                    HabitArc
                                </div>
                                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                                    Track. Improve. Achieve.
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Quick Add Habit */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <form onSubmit={handleAddHabit}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                            Quick Add Habit
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                value={newHabitName}
                                onChange={e => setNewHabitName(e.target.value)}
                                placeholder="New habit..."
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#e2e8f0',
                                    fontSize: 13,
                                    outline: 'none',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 8,
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: 16,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                +
                            </button>
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
                            {habits.length} habits tracked
                        </div>
                    </form>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
                    {/* Main */}
                    {sections.main.map(item => (
                        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 12px',
                                borderRadius: 10,
                                marginBottom: 2,
                                background: pathname === item.href ? 'rgba(99,102,241,0.15)' : 'transparent',
                                color: pathname === item.href ? '#818cf8' : '#94a3b8',
                                fontWeight: pathname === item.href ? 600 : 400,
                                fontSize: 14,
                                transition: 'all 0.15s ease',
                                cursor: 'pointer',
                            }}>
                                <span style={{ fontSize: 18 }}>{item.icon}</span>
                                {item.label}
                                {pathname === item.href && (
                                    <div style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        background: '#818cf8',
                                        marginLeft: 'auto',
                                    }} />
                                )}
                            </div>
                        </Link>
                    ))}

                    {/* Views */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '16px 12px 8px' }}>
                        Views
                    </div>
                    {sections.views.map(item => (
                        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 12px',
                                borderRadius: 10,
                                marginBottom: 2,
                                background: pathname === item.href ? 'rgba(99,102,241,0.15)' : 'transparent',
                                color: pathname === item.href ? '#818cf8' : '#94a3b8',
                                fontWeight: pathname === item.href ? 600 : 400,
                                fontSize: 14,
                                transition: 'all 0.15s ease',
                                cursor: 'pointer',
                            }}>
                                <span style={{ fontSize: 18 }}>{item.icon}</span>
                                {item.label}
                            </div>
                        </Link>
                    ))}

                    {/* Tools */}
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', padding: '16px 12px 8px' }}>
                        Tools
                    </div>
                    {sections.tools.map(item => (
                        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '10px 12px',
                                borderRadius: 10,
                                marginBottom: 2,
                                background: pathname === item.href ? 'rgba(99,102,241,0.15)' : 'transparent',
                                color: pathname === item.href ? '#818cf8' : '#94a3b8',
                                fontWeight: pathname === item.href ? 600 : 400,
                                fontSize: 14,
                                transition: 'all 0.15s ease',
                                cursor: 'pointer',
                            }}>
                                <span style={{ fontSize: 18 }}>{item.icon}</span>
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            borderRadius: 10,
                            border: 'none',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#94a3b8',
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            marginBottom: 8,
                        }}
                    >
                        <span style={{ fontSize: 18 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    {/* User Profile */}
                    {user && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            borderRadius: 10,
                            background: 'rgba(255,255,255,0.03)',
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                                color: 'white',
                                fontWeight: 700,
                            }}>
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </div>
                                <div style={{ fontSize: 11, color: '#64748b' }}>{user.profession}</div>
                            </div>
                            <button
                                onClick={logout}
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    border: 'none',
                                    background: 'rgba(239,68,68,0.15)',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                title="Logout"
                            >
                                ⏻
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .mobile-overlay { display: block !important; }
        }
      `}</style>
        </>
    );
}
