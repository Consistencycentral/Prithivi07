'use client';

import React, { useState, useMemo } from 'react';
import { useHabits } from '@/contexts/HabitContext';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function MonthlyPage() {
    const { habits, completions, getMonthlyStats, getTopHabits, getStreaks, saveNote, getNote } = useHabits();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const monthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    const stats = getMonthlyStats(selectedYear, selectedMonth);
    const topHabits = getTopHabits(selectedYear, selectedMonth);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const [noteText, setNoteText] = useState(getNote(monthKey));

    const handleMonthChange = (delta: number) => {
        let m = selectedMonth + delta;
        let y = selectedYear;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        setSelectedMonth(m);
        setSelectedYear(y);
        setNoteText(getNote(`${y}-${String(m + 1).padStart(2, '0')}`));
    };

    // Per-habit monthly completion data
    const habitMonthlyData = useMemo(() => {
        return habits.map(h => {
            let done = 0;
            for (let d = 1; d <= daysInMonth; d++) {
                const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                if (completions[dateKey]?.[h.id]) done++;
            }
            return {
                ...h,
                completed: done,
                total: daysInMonth,
                percentage: Math.round((done / daysInMonth) * 100),
                streak: getStreaks(h.id),
            };
        });
    }, [habits, completions, selectedYear, selectedMonth, daysInMonth, getStreaks]);

    // Longest streaks
    const longestStreaks = useMemo(() => {
        return [...habitMonthlyData]
            .sort((a, b) => b.streak - a.streak)
            .slice(0, 5);
    }, [habitMonthlyData]);

    const getColor = (pct: number) => {
        if (pct >= 80) return '#10b981';
        if (pct >= 50) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    Monthly Insights 📈
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    Deep dive into your monthly performance and trends
                </p>
            </div>

            {/* Month Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <button onClick={() => handleMonthChange(-1)} className="btn-secondary" style={{ padding: '8px 12px' }}>←</button>
                <div style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    fontSize: 14,
                    fontWeight: 700,
                }}>
                    {MONTHS[selectedMonth]} {selectedYear}
                </div>
                <button onClick={() => handleMonthChange(1)} className="btn-secondary" style={{ padding: '8px 12px' }}>→</button>
            </div>

            {/* Monthly Overview Card */}
            <div className="stat-card" style={{ padding: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Monthly Completion Rate
                        </div>
                        <div style={{ fontSize: 48, fontWeight: 800, color: getColor(stats.percentage), letterSpacing: '-2px' }}>
                            {stats.percentage}%
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            {stats.completed} of {stats.total} total check-ins completed
                        </div>
                    </div>
                    <div style={{ fontSize: 64 }}>
                        {stats.percentage >= 80 ? '🏆' : stats.percentage >= 50 ? '💪' : '🌱'}
                    </div>
                </div>
                <div className="progress-bar" style={{ height: 12, marginTop: 12 }}>
                    <div className="progress-fill" style={{ width: `${stats.percentage}%` }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
                {/* Top 5 Habits */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏅 Top 5 Habits</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {topHabits.map((h, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <div style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 6,
                                        background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : 'var(--bg-tertiary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: i < 3 ? 'white' : 'var(--text-secondary)',
                                    }}>
                                        {i + 1}
                                    </div>
                                    <span style={{ fontSize: 16 }}>{h.emoji}</span>
                                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{h.name}</span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: getColor(h.percentage) }}>{h.percentage}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${h.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Longest Streaks */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🔥 Longest Streaks</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {longestStreaks.map((h, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 18 }}>{h.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{h.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{h.category}</div>
                                </div>
                                <div style={{
                                    padding: '4px 12px',
                                    borderRadius: 'var(--radius-full)',
                                    background: h.streak >= 7 ? 'var(--success-bg)' : 'var(--bg-tertiary)',
                                    color: h.streak >= 7 ? 'var(--success)' : 'var(--text-secondary)',
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}>
                                    🔥 {h.streak} days
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Habit Completion Grid */}
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Habit Completion Grid</h3>
                <div style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 600 }}>
                        {habitMonthlyData.map(h => (
                            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 140, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                    <span style={{ fontSize: 14 }}>{h.emoji}</span>
                                    <span style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 2, flex: 1 }}>
                                    {Array.from({ length: daysInMonth }, (_, i) => {
                                        const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                                        const done = completions[dateKey]?.[h.id];
                                        return (
                                            <div
                                                key={i}
                                                style={{
                                                    flex: 1,
                                                    height: 16,
                                                    borderRadius: 2,
                                                    background: done ? '#6366f1' : 'var(--bg-tertiary)',
                                                    opacity: done ? 1 : 0.3,
                                                    minWidth: 8,
                                                }}
                                                title={`Day ${i + 1}: ${done ? '✓' : '✕'}`}
                                            />
                                        );
                                    })}
                                </div>
                                <div style={{ width: 45, textAlign: 'right', fontSize: 12, fontWeight: 700, color: getColor(h.percentage), flexShrink: 0 }}>
                                    {h.percentage}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notes & Reflections */}
            <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📝 Notes & Reflections</h3>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12 }}>
                    Record your thoughts, lessons learned, and goals for {MONTHS[selectedMonth]}
                </p>
                <textarea
                    className="input"
                    rows={5}
                    placeholder="Write your monthly reflections here..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    style={{ resize: 'vertical', minHeight: 100 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button
                        className="btn-primary"
                        onClick={() => saveNote(monthKey, noteText)}
                        style={{ padding: '8px 20px', fontSize: 13 }}
                    >
                        Save Notes
                    </button>
                </div>
            </div>
        </div>
    );
}
