'use client';

import React, { useState, useMemo } from 'react';
import { useHabits } from '@/contexts/HabitContext';

const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
    const { getDateCompletion, milestones, addMilestone, removeMilestone } = useHabits();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
    const [newMilestoneType, setNewMilestoneType] = useState<'milestone' | 'deadline' | 'event'>('milestone');

    const today = new Date().toISOString().split('T')[0];

    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

        const days: { date: string; day: number; isCurrentMonth: boolean }[] = [];

        // Previous month padding
        for (let i = firstDay - 1; i >= 0; i--) {
            const d = prevMonthDays - i;
            const m = currentMonth === 0 ? 12 : currentMonth;
            const y = currentMonth === 0 ? currentYear - 1 : currentYear;
            days.push({
                date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
                day: d,
                isCurrentMonth: false,
            });
        }

        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            days.push({
                date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
                day: d,
                isCurrentMonth: true,
            });
        }

        // Next month padding
        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            const m = currentMonth === 11 ? 1 : currentMonth + 2;
            const y = currentMonth === 11 ? currentYear + 1 : currentYear;
            days.push({
                date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
                day: d,
                isCurrentMonth: false,
            });
        }

        return days;
    }, [currentMonth, currentYear]);

    const handleNavigate = (delta: number) => {
        let m = currentMonth + delta;
        let y = currentYear;
        if (m < 0) { m = 11; y--; }
        if (m > 11) { m = 0; y++; }
        setCurrentMonth(m);
        setCurrentYear(y);
    };

    const getCompletionColor = (pct: number) => {
        if (pct >= 80) return { bg: '#10b98120', border: '#10b981', text: '#10b981' };
        if (pct >= 50) return { bg: '#f59e0b20', border: '#f59e0b', text: '#f59e0b' };
        if (pct > 0) return { bg: '#ef444420', border: '#ef4444', text: '#ef4444' };
        return { bg: 'transparent', border: 'transparent', text: 'var(--text-tertiary)' };
    };

    const selectedMilestones = selectedDate ? milestones.filter(m => m.date === selectedDate) : [];

    const handleAddMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDate && newMilestoneTitle.trim()) {
            addMilestone({ date: selectedDate, title: newMilestoneTitle.trim(), type: newMilestoneType });
            setNewMilestoneTitle('');
        }
    };

    const typeIcons: Record<string, string> = { milestone: '🏁', deadline: '⏰', event: '🎉' };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    Calendar 📅
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    View your habit completion history and track milestones
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
                {/* Calendar Grid */}
                <div className="card" style={{ padding: 24 }}>
                    {/* Month Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <button onClick={() => handleNavigate(-1)} className="btn-secondary" style={{ padding: '6px 12px' }}>←</button>
                        <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                            {MONTHS_FULL[currentMonth]} {currentYear}
                        </h2>
                        <button onClick={() => handleNavigate(1)} className="btn-secondary" style={{ padding: '6px 12px' }}>→</button>
                    </div>

                    {/* Day Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                        {DAYS.map(d => (
                            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', padding: 8 }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                        {calendarDays.map((dayInfo, i) => {
                            const pct = getDateCompletion(dayInfo.date);
                            const colors = getCompletionColor(pct);
                            const isToday = dayInfo.date === today;
                            const isSelected = dayInfo.date === selectedDate;
                            const hasMilestone = milestones.some(m => m.date === dayInfo.date);

                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDate(dayInfo.date)}
                                    style={{
                                        aspectRatio: '1',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 13,
                                        fontWeight: dayInfo.isCurrentMonth ? 600 : 400,
                                        cursor: 'pointer',
                                        background: isSelected ? 'var(--accent-primary)' : pct > 0 ? colors.bg : 'transparent',
                                        color: isSelected ? 'white' : dayInfo.isCurrentMonth ? (pct > 0 ? colors.text : 'var(--text-primary)') : 'var(--text-tertiary)',
                                        border: isToday ? '2px solid var(--accent-primary)' : '1px solid transparent',
                                        transition: 'all 0.15s ease',
                                        position: 'relative',
                                        minHeight: 48,
                                    }}
                                >
                                    {dayInfo.day}
                                    {pct > 0 && dayInfo.isCurrentMonth && !isSelected && (
                                        <div style={{ fontSize: 8, marginTop: 2 }}>{pct}%</div>
                                    )}
                                    {hasMilestone && (
                                        <div style={{ position: 'absolute', top: 2, right: 2, fontSize: 8 }}>📌</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 16, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {[
                            { label: '80%+', color: '#10b981' },
                            { label: '50-79%', color: '#f59e0b' },
                            { label: '1-49%', color: '#ef4444' },
                            { label: 'Today', color: 'var(--accent-primary)' },
                        ].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                                {l.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Day Details */}
                <div>
                    {selectedDate ? (
                        <div className="card" style={{ padding: 20, position: 'sticky', top: 24 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 12 }}>
                                {getDateCompletion(selectedDate)}% completed
                            </div>
                            <div className="progress-bar" style={{ marginBottom: 20 }}>
                                <div className="progress-fill" style={{ width: `${getDateCompletion(selectedDate)}%` }} />
                            </div>

                            {/* Milestones */}
                            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📌 Milestones & Events</h4>
                            {selectedMilestones.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                                    {selectedMilestones.map((m, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '8px 12px',
                                            borderRadius: 'var(--radius-md)',
                                            background: 'var(--bg-tertiary)',
                                        }}>
                                            <span>{typeIcons[m.type]}</span>
                                            <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.title}</span>
                                            <button
                                                onClick={() => removeMilestone(m.date, m.title)}
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 4,
                                                    border: 'none',
                                                    background: 'rgba(239,68,68,0.15)',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    fontSize: 10,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12 }}>No milestones for this day</p>
                            )}

                            {/* Add Milestone */}
                            <form onSubmit={handleAddMilestone}>
                                <input
                                    className="input"
                                    placeholder="Add milestone..."
                                    value={newMilestoneTitle}
                                    onChange={e => setNewMilestoneTitle(e.target.value)}
                                    style={{ marginBottom: 8, fontSize: 12 }}
                                />
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <select
                                        className="input"
                                        value={newMilestoneType}
                                        onChange={e => setNewMilestoneType(e.target.value as 'milestone' | 'deadline' | 'event')}
                                        style={{ flex: 1, fontSize: 12, cursor: 'pointer' }}
                                    >
                                        <option value="milestone">🏁 Milestone</option>
                                        <option value="deadline">⏰ Deadline</option>
                                        <option value="event">🎉 Event</option>
                                    </select>
                                    <button type="submit" className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>Add</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                            <div style={{ fontSize: 40, marginBottom: 8 }}>📅</div>
                            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                                Click on a day to view details and add milestones
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
