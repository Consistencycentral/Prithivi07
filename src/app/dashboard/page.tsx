'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/contexts/HabitContext';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
    BarChart, Bar,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const QUOTES = [
    "Small daily improvements are the key to staggering long-term results.",
    "We are what we repeatedly do. Excellence is not an act, but a habit.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The secret of your success is hidden in your daily routine.",
    "Motivation gets you started. Habit keeps you going.",
];

export default function DashboardPage() {
    const { user } = useAuth();
    const {
        habits,
        getDateCompletion,
        getStreaks,
        getLast30DaysTrend,
        getMonthlyStats,
        getTopHabits,
        completions,
    } = useHabits();

    const today = new Date().toISOString().split('T')[0];
    const todayCompletion = getDateCompletion(today);
    const trendData = getLast30DaysTrend();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthStats = getMonthlyStats(currentYear, currentMonth);
    const topHabits = getTopHabits(currentYear, currentMonth);

    const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

    // Calculate total streak (max of all habits)
    const bestStreak = useMemo(() => {
        return Math.max(0, ...habits.map(h => getStreaks(h.id)));
    }, [habits, getStreaks]);

    // Today's completed count
    const todayCompleted = useMemo(() => {
        const dayData = completions[today] || {};
        return habits.filter(h => dayData[h.id]).length;
    }, [habits, completions, today]);

    // Donut chart data
    const donutData = [
        { name: 'Completed', value: todayCompleted },
        { name: 'Remaining', value: Math.max(0, habits.length - todayCompleted) },
    ];

    // Weekly average
    const weekAvg = useMemo(() => {
        let total = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            total += getDateCompletion(d.toISOString().split('T')[0]);
        }
        return Math.round(total / 7);
    }, [getDateCompletion]);

    // Status emoji
    const getStatusEmoji = (pct: number) => {
        if (pct >= 90) return { emoji: '🔥', text: 'On Fire!' };
        if (pct >= 70) return { emoji: '💪', text: 'Well Done!' };
        if (pct >= 50) return { emoji: '👍', text: 'Keep Going!' };
        if (pct >= 25) return { emoji: '🌱', text: 'Growing!' };
        return { emoji: '🚀', text: 'Start Strong!' };
    };
    const status = getStatusEmoji(todayCompletion);

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>
                            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span> {status.emoji}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 500 }}>
                            &ldquo;{quote}&rdquo;
                        </p>
                    </div>
                    <div style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-tertiary)',
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                    }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Stat Cards Row */}
            <div id="onboarding-stats-section" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 24,
            }}>
                {[
                    { label: "Today's Progress", value: `${todayCompletion}%`, sub: `${todayCompleted}/${habits.length} habits`, color: '#6366f1', icon: '📊' },
                    { label: 'Best Streak', value: `${bestStreak} days`, sub: 'Keep it going!', color: '#ef4444', icon: '🔥' },
                    { label: '7-Day Average', value: `${weekAvg}%`, sub: 'Consistency score', color: '#10b981', icon: '📈' },
                    { label: 'Monthly Score', value: `${monthStats.percentage}%`, sub: `${monthStats.completed}/${monthStats.total}`, color: '#f59e0b', icon: '🏆' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {stat.label}
                            </span>
                            <span style={{ fontSize: 24 }}>{stat.icon}</span>
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', color: stat.color }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 2fr)',
                gap: 16,
                marginBottom: 24,
            }}>
                {/* Donut Chart */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Today&apos;s Habits</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>{status.text}</p>
                    <div style={{ height: 200, position: 'relative' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={donutData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    strokeWidth={0}
                                >
                                    <Cell fill="#6366f1" />
                                    <Cell fill="var(--bg-tertiary)" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1' }}>{todayCompletion}%</div>
                            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>completed</div>
                        </div>
                    </div>
                </div>

                {/* Line Chart - 30 Day Trend */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>30-Day Consistency</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>Daily completion percentage</p>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                                <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} interval={4} />
                                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} tickLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-primary)',
                                        borderRadius: 8,
                                        fontSize: 12,
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="percentage"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 5, fill: '#6366f1' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Top Habits + Monthly Bar */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 16,
            }}>
                {/* Top Habits */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Top Habits This Month</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {topHabits.map((h, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{h.emoji}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{h.percentage}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${h.percentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7-Day Bar Chart */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>This Week</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>Daily performance</p>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={trendData.slice(-7).map(d => ({
                                    ...d,
                                    fill: d.percentage >= 80 ? '#10b981' : d.percentage >= 50 ? '#f59e0b' : '#ef4444',
                                }))}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                                <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-primary)',
                                        borderRadius: 8,
                                        fontSize: 12,
                                    }}
                                />
                                <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                    {trendData.slice(-7).map((d, i) => (
                                        <Cell
                                            key={i}
                                            fill={d.percentage >= 80 ? '#10b981' : d.percentage >= 50 ? '#f59e0b' : '#ef4444'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
