'use client';

import React, { useState, useMemo } from 'react';
import { useHabits } from '@/contexts/HabitContext';

export default function WeeklyPage() {
    const { habits, completions, getDateCompletion, addWeeklyGoal, weeklyGoals, updateWeeklyGoalProgress } = useHabits();
    const [weekOffset, setWeekOffset] = useState(0);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState(7);

    const weekDates = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + 1 + weekOffset * 7);
        const result: string[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            result.push(d.toISOString().split('T')[0]);
        }
        return result;
    }, [weekOffset]);

    const weekKey = weekDates[0];

    const weekGoals = weeklyGoals.filter(g => g.weekKey === weekKey);

    // Calculate habit progress for the week  
    const habitWeeklyProgress = useMemo(() => {
        return habits.map(h => {
            const completedDays = weekDates.filter(d => completions[d]?.[h.id]).length;
            return {
                ...h,
                completed: completedDays,
                total: 7,
                percentage: Math.round((completedDays / 7) * 100),
            };
        }).sort((a, b) => b.percentage - a.percentage);
    }, [habits, completions, weekDates]);

    const overallWeekAvg = useMemo(() => {
        let sum = 0;
        weekDates.forEach(d => { sum += getDateCompletion(d); });
        return Math.round(sum / 7);
    }, [weekDates, getDateCompletion]);

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGoalName.trim()) {
            addWeeklyGoal(newGoalName.trim(), newGoalTarget, weekKey);
            setNewGoalName('');
            setNewGoalTarget(7);
        }
    };

    const getBarColor = (pct: number) => {
        if (pct >= 80) return '#10b981';
        if (pct >= 50) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    Weekly Goals 🎯
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    Track your weekly habit objectives and custom goals
                </p>
            </div>

            {/* Week Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <button onClick={() => setWeekOffset(o => o - 1)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: 13 }}>←</button>
                <div style={{
                    padding: '8px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    fontSize: 13,
                    fontWeight: 600,
                }}>
                    {new Date(weekDates[0] + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(weekDates[6] + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <button onClick={() => setWeekOffset(o => o + 1)} className="btn-secondary" style={{ padding: '8px 12px', fontSize: 13 }}>→</button>
                <button onClick={() => setWeekOffset(0)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, marginLeft: 8 }}>This Week</button>
            </div>

            {/* Overall Weekly Score */}
            <div className="stat-card" style={{ marginBottom: 24, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weekly Average</div>
                        <div style={{ fontSize: 36, fontWeight: 800, color: getBarColor(overallWeekAvg), letterSpacing: '-1px' }}>{overallWeekAvg}%</div>
                    </div>
                    <div style={{ fontSize: 48 }}>{overallWeekAvg >= 80 ? '🔥' : overallWeekAvg >= 50 ? '💪' : '🌱'}</div>
                </div>
                <div className="progress-bar" style={{ height: 12, marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${overallWeekAvg}%` }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
                {/* Habit Progress */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Habit Progress (7 days)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {habitWeeklyProgress.map(h => (
                            <div key={h.id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <span style={{ fontSize: 18 }}>{h.emoji}</span>
                                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{h.name}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: getBarColor(h.percentage) }}>
                                        {h.completed}/7 days
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{
                                        width: `${h.percentage}%`,
                                        background: h.percentage >= 80 ? '#10b981' : h.percentage >= 50 ? 'var(--accent-gradient)' : '#ef4444',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Goals */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Custom Weekly Goals</h3>

                    <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        <input
                            className="input"
                            placeholder="Goal name..."
                            value={newGoalName}
                            onChange={e => setNewGoalName(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <input
                            className="input"
                            type="number"
                            min={1}
                            max={100}
                            value={newGoalTarget}
                            onChange={e => setNewGoalTarget(Number(e.target.value))}
                            style={{ width: 70 }}
                        />
                        <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>+</button>
                    </form>

                    {weekGoals.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-tertiary)', fontSize: 13 }}>
                            No custom goals for this week. Add one above! 🎯
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {weekGoals.map(g => (
                                <div key={g.id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600 }}>{g.name}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <button
                                                onClick={() => updateWeeklyGoalProgress(g.id, Math.max(0, g.current - 1))}
                                                style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
                                            >−</button>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>{g.current}/{g.target}</span>
                                            <button
                                                onClick={() => updateWeeklyGoalProgress(g.id, Math.min(g.target, g.current + 1))}
                                                style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Day-by-Day Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 24 }}>
                {weekDates.map(dateStr => {
                    const pct = getDateCompletion(dateStr);
                    const d = new Date(dateStr + 'T12:00:00');
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    return (
                        <div key={dateStr} className="card" style={{
                            padding: 12,
                            textAlign: 'center',
                            border: isToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                        }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: isToday ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>
                                {d.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: getBarColor(pct), margin: '4px 0' }}>
                                {pct}%
                            </div>
                            <div className="progress-bar" style={{ height: 4 }}>
                                <div className="progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
