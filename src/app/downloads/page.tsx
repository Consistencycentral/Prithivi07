'use client';

import React from 'react';

const DOWNLOADS = [
    {
        id: 1,
        title: 'Daily Habit Tracker Template',
        description: 'A comprehensive daily tracking spreadsheet with auto-calculating progress bars and conditional formatting.',
        format: 'Excel (.xlsx)',
        icon: '📊',
        color: '#10b981',
        size: '245 KB',
    },
    {
        id: 2,
        title: 'Weekly Planner Template',
        description: 'Plan your weekly goals with built-in formulas for tracking completion rates and generating reports.',
        format: 'Google Sheets',
        icon: '🎯',
        color: '#6366f1',
        size: '180 KB',
    },
    {
        id: 3,
        title: 'Monthly Review Template',
        description: 'End-of-month review template with sections for reflections, top habits, and improvement areas.',
        format: 'Excel (.xlsx)',
        icon: '📈',
        color: '#f59e0b',
        size: '312 KB',
    },
    {
        id: 4,
        title: 'Annual Goals Dashboard',
        description: 'A master dashboard template to visualize your yearly progress with pie charts and trend analysis.',
        format: 'Google Sheets',
        icon: '🗓️',
        color: '#8b5cf6',
        size: '420 KB',
    },
    {
        id: 5,
        title: 'Habit Stacking Planner',
        description: 'Build habit chains using the habit stacking technique. Includes prompts and tracking columns.',
        format: 'Excel (.xlsx)',
        icon: '🔗',
        color: '#ef4444',
        size: '156 KB',
    },
    {
        id: 6,
        title: 'Minimal Daily Tracker (Print)',
        description: 'A clean, printable daily tracker designed for bullet journal enthusiasts who prefer analog tracking.',
        format: 'PDF',
        icon: '🖨️',
        color: '#64748b',
        size: '89 KB',
    },
];

export default function DownloadsPage() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    My Downloads 📥
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    Free Excel and Google Sheets templates to complement your tracking
                </p>
            </div>

            {/* Downloads Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 16,
            }}>
                {DOWNLOADS.map(d => (
                    <div key={d.id} className="card" style={{
                        padding: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 12,
                                background: `${d.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 24,
                                flexShrink: 0,
                            }}>
                                {d.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{d.title}</h3>
                                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                                    {d.description}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 12,
                            borderTop: '1px solid var(--border-secondary)',
                        }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <span style={{
                                    padding: '3px 10px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--bg-tertiary)',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)',
                                }}>
                                    {d.format}
                                </span>
                                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: '22px' }}>
                                    {d.size}
                                </span>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ padding: '6px 16px', fontSize: 12 }}
                                onClick={() => alert(`Download "${d.title}" — In a production build, this would download the file.`)}
                            >
                                ↓ Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Call to action */}
            <div className="card" style={{
                padding: 32,
                marginTop: 24,
                textAlign: 'center',
                background: 'var(--bg-tertiary)',
            }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🎨</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Want Custom Templates?</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 400, margin: '0 auto 16px' }}>
                    We regularly add new templates. Have a specific format in mind? Let us know and we&apos;ll create it for you!
                </p>
                <button className="btn-secondary" style={{ padding: '10px 24px', fontSize: 13 }}>
                    Request a Template ✉️
                </button>
            </div>
        </div>
    );
}
