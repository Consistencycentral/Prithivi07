'use client';

import React, { useState, useMemo } from 'react';
import { useHabits, getCategoryColor } from '@/contexts/HabitContext';
// ✅ CHANGE 4: Google Analytics event tracking
import { trackCategorySelected } from '@/lib/analytics';

export default function DailyPage() {
    const { habits, completions, toggleCompletion, getDateCompletion, removeHabit, allCategories } = useHabits();
    const [dateOffset, setDateOffset] = useState(0);
    // ✅ CHANGE 1: Category filter state
    const [activeCategory, setActiveCategory] = useState<string>('All');

    // Generate 7 dates centered around today + offset
    const dates = useMemo(() => {
        const result: string[] = [];
        const base = new Date();
        base.setDate(base.getDate() + dateOffset);
        for (let i = -3; i <= 3; i++) {
            const d = new Date(base);
            d.setDate(d.getDate() + i);
            result.push(d.toISOString().split('T')[0]);
        }
        return result;
    }, [dateOffset]);

    const today = new Date().toISOString().split('T')[0];

    const getStatusEmoji = (pct: number) => {
        if (pct >= 90) return '🔥 On Fire!';
        if (pct >= 70) return '💪 Well Done!';
        if (pct >= 50) return '👍 Keep Going!';
        if (pct >= 25) return '🌱 Growing!';
        return '🚀 Start Strong!';
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T12:00:00');
        return {
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' }),
            isToday: dateStr === today,
        };
    };

    const [lastChecked, setLastChecked] = useState<string | null>(null);

    const handleToggle = (dateKey: string, habitId: string) => {
        toggleCompletion(dateKey, habitId);
        setLastChecked(`${dateKey}-${habitId}`);
        setTimeout(() => setLastChecked(null), 600);
    };

    // ✅ CHANGE 1: Filter habits by active category
    const filteredHabits = useMemo(() => {
        if (activeCategory === 'All') return habits;
        return habits.filter(h => h.category === activeCategory);
    }, [habits, activeCategory]);

    // ✅ CHANGE 1: Group habits by category for display
    const groupedHabits = useMemo(() => {
        const groups: Record<string, typeof habits> = {};
        filteredHabits.forEach(h => {
            if (!groups[h.category]) groups[h.category] = [];
            groups[h.category].push(h);
        });
        return groups;
    }, [filteredHabits]);

    // ✅ CHANGE 1: Handle category filter click with GA tracking
    const handleCategoryFilter = (cat: string) => {
        setActiveCategory(cat);
        if (cat !== 'All') {
            trackCategorySelected(cat);
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    Daily Tracker 📋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    Check off your habits for each day. Stay consistent!
                </p>
            </div>

            {/* ✅ CHANGE 1: Category Filter Bar */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 20,
                padding: '12px 16px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)',
            }}>
                <button
                    onClick={() => handleCategoryFilter('All')}
                    className="category-filter-btn"
                    style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: activeCategory === 'All' ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                        background: activeCategory === 'All' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: activeCategory === 'All' ? 'white' : 'var(--text-secondary)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    All ({habits.length})
                </button>
                {allCategories.map(cat => {
                    const count = habits.filter(h => h.category === cat).length;
                    if (count === 0) return null;
                    const isActive = activeCategory === cat;
                    const catColor = getCategoryColor(cat);
                    return (
                        <button
                            key={cat}
                            onClick={() => handleCategoryFilter(cat)}
                            className="category-filter-btn"
                            style={{
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-full)',
                                border: isActive ? `2px solid ${catColor}` : '1px solid var(--border-primary)',
                                background: isActive ? catColor : 'var(--bg-secondary)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            <span style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: isActive ? 'rgba(255,255,255,0.6)' : catColor,
                                display: 'inline-block',
                            }} />
                            {cat} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Date Navigation */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 24,
            }}>
                <button
                    onClick={() => setDateOffset(o => o - 7)}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                >
                    ← Prev Week
                </button>
                <button
                    onClick={() => setDateOffset(0)}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: 13 }}
                >
                    Today
                </button>
                <button
                    onClick={() => setDateOffset(o => o + 7)}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: 13 }}
                >
                    Next Week →
                </button>
            </div>

            {/* ✅ CHANGE 1: Display habits grouped by category */}
            {Object.entries(groupedHabits).map(([category, categoryHabits]) => (
                <div key={category} style={{ marginBottom: 24 }}>
                    {/* ✅ CHANGE 1: Category group header with color badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                    }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            background: getCategoryColor(category),
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: '0.3px',
                        }}>
                            {category}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                            {categoryHabits.length} habit{categoryHabits.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="card" style={{ overflow: 'auto', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                            <thead>
                                <tr>
                                    <th style={{
                                        position: 'sticky',
                                        left: 0,
                                        background: 'var(--bg-card)',
                                        zIndex: 5,
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: 'var(--text-tertiary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        borderBottom: '1px solid var(--border-primary)',
                                        minWidth: 180,
                                    }}>
                                        Habit
                                    </th>
                                    {dates.map(dateStr => {
                                        const f = formatDate(dateStr);
                                        return (
                                            <th key={dateStr} style={{
                                                padding: '12px 8px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid var(--border-primary)',
                                                background: f.isToday ? 'var(--accent-primary)' : 'transparent',
                                                color: f.isToday ? 'white' : 'var(--text-secondary)',
                                                borderRadius: f.isToday ? '8px 8px 0 0' : 0,
                                                minWidth: 60,
                                            }}>
                                                <div style={{ fontSize: 11, fontWeight: 500 }}>{f.day}</div>
                                                <div style={{ fontSize: 18, fontWeight: 700 }}>{f.date}</div>
                                                <div style={{ fontSize: 10 }}>{f.month}</div>
                                            </th>
                                        );
                                    })}
                                    <th style={{
                                        padding: '12px 16px',
                                        textAlign: 'center',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: 'var(--text-tertiary)',
                                        borderBottom: '1px solid var(--border-primary)',
                                        minWidth: 80,
                                    }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryHabits.map((habit) => (
                                    <tr key={habit.id} style={{
                                        borderBottom: '1px solid var(--border-secondary)',
                                        transition: 'background 0.15s ease',
                                    }}>
                                        <td style={{
                                            position: 'sticky',
                                            left: 0,
                                            background: 'var(--bg-card)',
                                            zIndex: 3,
                                            padding: '10px 16px',
                                            borderRight: '1px solid var(--border-secondary)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{ fontSize: 18 }}>{habit.emoji}</span>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{habit.name}</div>
                                                    {/* ✅ CHANGE 1: Category badge in table row */}
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                        marginTop: 2,
                                                    }}>
                                                        <span style={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: '50%',
                                                            background: getCategoryColor(habit.category),
                                                            display: 'inline-block',
                                                        }} />
                                                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{habit.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {dates.map(dateStr => {
                                            // ✅ CHANGE 2: Checkbox defaults to unchecked — explicitly check for true
                                            const isChecked = completions[dateStr]?.[habit.id] === true;
                                            const key = `${dateStr}-${habit.id}`;
                                            const isToday = dateStr === today;
                                            return (
                                                <td key={dateStr} style={{
                                                    padding: '8px',
                                                    textAlign: 'center',
                                                    background: isToday ? 'rgba(99,102,241,0.04)' : 'transparent',
                                                }}>
                                                    <div
                                                        className={`habit-checkbox ${isChecked ? 'checked' : ''}`}
                                                        onClick={() => handleToggle(dateStr, habit.id)}
                                                        style={{
                                                            margin: '0 auto',
                                                            transform: lastChecked === key ? 'scale(1.2)' : 'scale(1)',
                                                            transition: 'transform 0.2s ease',
                                                        }}
                                                    >
                                                        {isChecked && (
                                                            <span style={{ color: 'white', fontSize: 14, fontWeight: 700 }}>✓</span>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td style={{ padding: '8px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => removeHabit(habit.id)}
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 6,
                                                    border: '1px solid var(--border-primary)',
                                                    background: 'var(--bg-secondary)',
                                                    color: 'var(--text-tertiary)',
                                                    cursor: 'pointer',
                                                    fontSize: 12,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                title="Remove habit"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* Empty state when no habits match filter */}
            {Object.keys(groupedHabits).length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No habits in this category</div>
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                        Try selecting a different category or add a new habit.
                    </div>
                </div>
            )}

            {/* Daily Progress */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
                marginTop: 24,
            }}>
                {dates.map(dateStr => {
                    const pct = getDateCompletion(dateStr);
                    const f = formatDate(dateStr);
                    return (
                        <div key={dateStr} className="card" style={{
                            padding: '16px',
                            textAlign: 'center',
                            border: f.isToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: f.isToday ? 'var(--accent-primary)' : 'var(--text-tertiary)', marginBottom: 4 }}>
                                {f.day} {f.date}
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: pct >= 70 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--text-tertiary)' }}>
                                {pct}%
                            </div>
                            <div className="progress-bar" style={{ marginBottom: 4 }}>
                                <div className="progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <div style={{ fontSize: 11 }}>{getStatusEmoji(pct)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
