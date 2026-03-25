'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// ✅ CHANGE 4: Google Analytics event tracking
import { trackHabitCreated, trackHabitChecked, trackHabitDeleted } from '@/lib/analytics';

// ✅ CHANGE 1: Categories — default list of categories
export const HABIT_CATEGORIES = [
    'Health',
    'Productivity',
    'Fitness',
    'Learning',
    'Mindfulness',
    'Finance',
    'Social',
    'General',
] as const;

// ✅ CHANGE 1: Category color mapping for badges/labels
export const CATEGORY_COLORS: Record<string, string> = {
    Health: '#10b981',
    Productivity: '#6366f1',
    Fitness: '#ef4444',
    Learning: '#f59e0b',
    Mindfulness: '#8b5cf6',
    Finance: '#3b82f6',
    Social: '#ec4899',
    General: '#64748b',
};

/** Returns a color for any category — falls back to a hash-based color for custom categories */
export function getCategoryColor(category: string): string {
    if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
    // Generate a stable color for custom categories
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 55%)`;
}

export interface Habit {
    id: string;
    name: string;
    category: string;
    emoji: string;
    createdAt: string;
}

export interface HabitCompletion {
    [dateKey: string]: {
        [habitId: string]: boolean;
    };
}

export interface WeeklyGoal {
    id: string;
    name: string;
    target: number;
    current: number;
    weekKey: string;
}

export interface Note {
    monthKey: string;
    content: string;
}

export interface Milestone {
    date: string;
    title: string;
    type: 'milestone' | 'deadline' | 'event';
}

interface HabitContextValue {
    habits: Habit[];
    completions: HabitCompletion;
    weeklyGoals: WeeklyGoal[];
    notes: Note[];
    milestones: Milestone[];
    addHabit: (name: string, category: string, emoji: string) => void;
    removeHabit: (id: string) => void;
    toggleCompletion: (dateKey: string, habitId: string) => void;
    getDateCompletion: (dateKey: string) => number;
    getStreaks: (habitId: string) => number;
    getMonthlyStats: (year: number, month: number) => { total: number; completed: number; percentage: number };
    getAnnualStats: (year: number) => { monthlyData: { month: string; percentage: number }[]; categoryBreakdown: { name: string; value: number }[] };
    getTopHabits: (year: number, month: number) => { name: string; percentage: number; emoji: string }[];
    addWeeklyGoal: (name: string, target: number, weekKey: string) => void;
    updateWeeklyGoalProgress: (id: string, current: number) => void;
    saveNote: (monthKey: string, content: string) => void;
    getNote: (monthKey: string) => string;
    addMilestone: (milestone: Milestone) => void;
    removeMilestone: (date: string, title: string) => void;
    getLast30DaysTrend: () => { date: string; percentage: number }[];
    // ✅ CHANGE 1: expose list of all unique categories in use
    allCategories: string[];
}

const HabitContext = createContext<HabitContextValue>({} as HabitContextValue);

const DEFAULT_HABITS: Habit[] = [
    { id: 'h1', name: 'Morning Exercise', category: 'Health', emoji: '🏃', createdAt: '2025-01-01' },
    { id: 'h2', name: 'Read 30 Minutes', category: 'Learning', emoji: '📚', createdAt: '2025-01-01' },
    { id: 'h3', name: 'Drink 8 Glasses Water', category: 'Health', emoji: '💧', createdAt: '2025-01-01' },
    { id: 'h4', name: 'Meditate', category: 'Mindfulness', emoji: '🧘', createdAt: '2025-01-01' },
    { id: 'h5', name: 'No Social Media', category: 'Productivity', emoji: '📵', createdAt: '2025-01-01' },
    { id: 'h6', name: 'Journal Entry', category: 'Mindfulness', emoji: '📝', createdAt: '2025-01-01' },
    { id: 'h7', name: 'Healthy Eating', category: 'Health', emoji: '🥗', createdAt: '2025-01-01' },
    { id: 'h8', name: 'Study / Practice', category: 'Learning', emoji: '💻', createdAt: '2025-01-01' },
];

function generateDemoCompletions(): HabitCompletion {
    const completions: HabitCompletion = {};
    const today = new Date();
    const habitIds = DEFAULT_HABITS.map(h => h.id);

    // ✅ CHANGE 2: Checkbox Fix — generate demo data for past days only (NOT today)
    // Today always starts unchecked so users begin fresh each day
    for (let i = 60; i >= 1; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        completions[dateKey] = {};
        habitIds.forEach(hId => {
            completions[dateKey][hId] = Math.random() > (0.25 + (i * 0.003));
        });
    }
    // Today starts completely unchecked
    const todayKey = today.toISOString().split('T')[0];
    completions[todayKey] = {};
    habitIds.forEach(hId => {
        completions[todayKey][hId] = false;
    });

    return completions;
}

export function HabitProvider({ children }: { children: React.ReactNode }) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completions, setCompletions] = useState<HabitCompletion>({});
    const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedHabits = localStorage.getItem('habitarc-habits');
        const storedCompletions = localStorage.getItem('habitarc-completions');
        const storedGoals = localStorage.getItem('habitarc-weekly-goals');
        const storedNotes = localStorage.getItem('habitarc-notes');
        const storedMilestones = localStorage.getItem('habitarc-milestones');

        if (storedHabits) {
            setHabits(JSON.parse(storedHabits));

            // ✅ CHANGE 2: Checkbox Fix — ensure today's completions default to unchecked
            // We load stored completions but verify today's entries exist with proper date keys.
            // If no entry exists for today, all habits start unchecked.
            const parsed: HabitCompletion = storedCompletions ? JSON.parse(storedCompletions) : {};
            const todayKey = new Date().toISOString().split('T')[0];
            if (!parsed[todayKey]) {
                parsed[todayKey] = {};
                // All habits unchecked for today by default — no stale carry-over
            }
            setCompletions(parsed);
        } else {
            // First visit: set demo data
            setHabits(DEFAULT_HABITS);
            const demo = generateDemoCompletions();
            setCompletions(demo);
            localStorage.setItem('habitarc-habits', JSON.stringify(DEFAULT_HABITS));
            localStorage.setItem('habitarc-completions', JSON.stringify(demo));
        }

        if (storedGoals) setWeeklyGoals(JSON.parse(storedGoals));
        if (storedNotes) setNotes(JSON.parse(storedNotes));
        if (storedMilestones) setMilestones(JSON.parse(storedMilestones));
    }, []);

    const persist = useCallback((key: string, data: unknown) => {
        localStorage.setItem(key, JSON.stringify(data));
    }, []);

    const addHabit = (name: string, category: string, emoji: string) => {
        const newHabit: Habit = {
            id: `h${Date.now()}`,
            name,
            category,
            emoji,
            createdAt: new Date().toISOString().split('T')[0],
        };
        const updated = [...habits, newHabit];
        setHabits(updated);
        persist('habitarc-habits', updated);
        // ✅ CHANGE 4: GA event tracking
        trackHabitCreated(name);
    };

    const removeHabit = (id: string) => {
        const habitName = habits.find(h => h.id === id)?.name || id;
        const updated = habits.filter(h => h.id !== id);
        setHabits(updated);
        persist('habitarc-habits', updated);
        // ✅ CHANGE 4: GA event tracking
        trackHabitDeleted(habitName);
    };

    const toggleCompletion = (dateKey: string, habitId: string) => {
        setCompletions(prev => {
            const dayData = prev[dateKey] || {};
            const newState = !dayData[habitId];
            const updated = {
                ...prev,
                [dateKey]: {
                    ...dayData,
                    [habitId]: newState,
                },
            };
            persist('habitarc-completions', updated);
            // ✅ CHANGE 4: GA event — only track when checking (not unchecking)
            if (newState) {
                const habitName = habits.find(h => h.id === habitId)?.name || habitId;
                trackHabitChecked(habitName);
            }
            return updated;
        });
    };

    const getDateCompletion = (dateKey: string): number => {
        if (habits.length === 0) return 0;
        const dayData = completions[dateKey] || {};
        const done = habits.filter(h => dayData[h.id]).length;
        return Math.round((done / habits.length) * 100);
    };

    const getStreaks = (habitId: string): number => {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            if (completions[dateKey]?.[habitId]) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const getMonthlyStats = (year: number, month: number) => {
        let total = 0;
        let completed = 0;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayData = completions[dateKey] || {};
            habits.forEach(h => {
                total++;
                if (dayData[h.id]) completed++;
            });
        }

        return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    };

    const getAnnualStats = (year: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = months.map((name, i) => {
            const stats = getMonthlyStats(year, i);
            return { month: name, percentage: stats.percentage };
        });

        // Category breakdown
        const catMap: Record<string, number> = {};
        habits.forEach(h => {
            catMap[h.category] = (catMap[h.category] || 0) + 1;
        });
        const categoryBreakdown = Object.entries(catMap).map(([name, value]) => ({ name, value }));

        return { monthlyData, categoryBreakdown };
    };

    const getTopHabits = (year: number, month: number) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const habitScores = habits.map(h => {
            let done = 0;
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                if (completions[dateKey]?.[h.id]) done++;
            }
            return { name: h.name, emoji: h.emoji, percentage: Math.round((done / daysInMonth) * 100) };
        });
        return habitScores.sort((a, b) => b.percentage - a.percentage).slice(0, 5);
    };

    const addWeeklyGoal = (name: string, target: number, weekKey: string) => {
        const goal: WeeklyGoal = { id: `wg${Date.now()}`, name, target, current: 0, weekKey };
        const updated = [...weeklyGoals, goal];
        setWeeklyGoals(updated);
        persist('habitarc-weekly-goals', updated);
    };

    const updateWeeklyGoalProgress = (id: string, current: number) => {
        const updated = weeklyGoals.map(g => g.id === id ? { ...g, current } : g);
        setWeeklyGoals(updated);
        persist('habitarc-weekly-goals', updated);
    };

    const saveNote = (monthKey: string, content: string) => {
        const existing = notes.findIndex(n => n.monthKey === monthKey);
        let updated: Note[];
        if (existing >= 0) {
            updated = notes.map((n, i) => i === existing ? { ...n, content } : n);
        } else {
            updated = [...notes, { monthKey, content }];
        }
        setNotes(updated);
        persist('habitarc-notes', updated);
    };

    const getNote = (monthKey: string): string => {
        return notes.find(n => n.monthKey === monthKey)?.content || '';
    };

    const addMilestone = (milestone: Milestone) => {
        const updated = [...milestones, milestone];
        setMilestones(updated);
        persist('habitarc-milestones', updated);
    };

    const removeMilestone = (date: string, title: string) => {
        const updated = milestones.filter(m => !(m.date === date && m.title === title));
        setMilestones(updated);
        persist('habitarc-milestones', updated);
    };

    const getLast30DaysTrend = () => {
        const result: { date: string; percentage: number }[] = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            result.push({
                date: `${d.getMonth() + 1}/${d.getDate()}`,
                percentage: getDateCompletion(dateKey),
            });
        }
        return result;
    };

    // ✅ CHANGE 1: Compute all unique categories from habits + defaults
    const allCategories = React.useMemo(() => {
        const cats = new Set<string>(HABIT_CATEGORIES as unknown as string[]);
        habits.forEach(h => cats.add(h.category));
        return Array.from(cats);
    }, [habits]);

    if (!mounted) return null;

    return (
        <HabitContext.Provider
            value={{
                habits,
                completions,
                weeklyGoals,
                notes,
                milestones,
                addHabit,
                removeHabit,
                toggleCompletion,
                getDateCompletion,
                getStreaks,
                getMonthlyStats,
                getAnnualStats,
                getTopHabits,
                addWeeklyGoal,
                updateWeeklyGoalProgress,
                saveNote,
                getNote,
                addMilestone,
                removeMilestone,
                getLast30DaysTrend,
                allCategories,
            }}
        >
            {children}
        </HabitContext.Provider>
    );
}

export const useHabits = () => useContext(HabitContext);
