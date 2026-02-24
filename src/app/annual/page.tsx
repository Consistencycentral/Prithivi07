'use client';

import React, { useState, useMemo } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AnnualPage() {
    const { getAnnualStats, habits, getMonthlyStats } = useHabits();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const annualData = getAnnualStats(selectedYear);

    // Top Tier Months (sorted by percentage)
    const topMonths = useMemo(() => {
        return [...annualData.monthlyData]
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);
    }, [annualData]);

    // Overall annual average (only count months that have data)
    const annualAvg = useMemo(() => {
        const activeMonths = annualData.monthlyData.filter(m => m.percentage > 0);
        if (activeMonths.length === 0) return 0;
        const sum = activeMonths.reduce((acc, m) => acc + m.percentage, 0);
        return Math.round(sum / activeMonths.length);
    }, [annualData]);

    // Total completions for the year
    const totalCompletions = useMemo(() => {
        let total = 0;
        for (let m = 0; m < 12; m++) {
            total += getMonthlyStats(selectedYear, m).completed;
        }
        return total;
    }, [selectedYear, getMonthlyStats]);

    const years = Array.from({ length: 7 }, (_, i) => 2024 + i);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    Annual Overview 🗓️
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    Master dashboard aggregating all your yearly data
                </p>
            </div>

            {/* Year Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Year:</span>
                <select
                    className="input"
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    style={{ width: 120, cursor: 'pointer' }}
                >
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {/* Annual Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Annual Average', value: `${annualAvg}%`, icon: '📊', color: '#6366f1' },
                    { label: 'Total Check-ins', value: totalCompletions.toLocaleString(), icon: '✅', color: '#10b981' },
                    { label: 'Active Habits', value: habits.length.toString(), icon: '🎯', color: '#f59e0b' },
                    { label: 'Best Month', value: topMonths[0]?.month || '-', icon: '🏆', color: '#ef4444' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</span>
                            <span style={{ fontSize: 20 }}>{stat.icon}</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, letterSpacing: '-1px' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
                {/* Monthly Performance Bar Chart */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Monthly Performance</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>Completion % by month</p>
                    <div style={{ height: 260 }}>
                        <ResponsiveContainer>
                            <BarChart data={annualData.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                                <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickLine={false} />
                                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} tickLine={false} domain={[0, 100]} />
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={32}>
                                    {annualData.monthlyData.map((entry, i) => (
                                        <Cell key={i} fill={entry.percentage >= 70 ? '#10b981' : entry.percentage >= 40 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Habits by Category</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>Distribution of your habits</p>
                    <div style={{ height: 220 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={annualData.categoryBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={85}
                                    dataKey="value"
                                    label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                    strokeWidth={2}
                                    stroke="var(--bg-card)"
                                >
                                    {annualData.categoryBreakdown.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12, justifyContent: 'center' }}>
                        {annualData.categoryBreakdown.map((cat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                                {cat.name} ({cat.value})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Tier Months */}
            <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏅 Top Tier Months</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                    {topMonths.map((m, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: 16,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-tertiary)',
                            border: i === 0 ? '2px solid #fbbf24' : '1px solid var(--border-secondary)',
                        }}>
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : 'var(--bg-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 700,
                                color: 'white',
                            }}>
                                #{i + 1}
                            </div>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{m.month}</div>
                                <div style={{
                                    fontSize: 20,
                                    fontWeight: 800,
                                    color: m.percentage >= 70 ? '#10b981' : m.percentage >= 40 ? '#f59e0b' : 'var(--text-tertiary)',
                                }}>
                                    {m.percentage}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
