'use client';

import React, { useState } from 'react';

const TUTORIALS = [
    {
        id: 1,
        title: 'Getting Started with HabitArc',
        description: 'Learn the basics of setting up your habits and navigating the dashboard.',
        duration: '5 min',
        category: 'Basics',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '🚀',
    },
    {
        id: 2,
        title: 'Mastering the Daily Tracker',
        description: 'How to use the checkbox grid effectively and understand your daily progress.',
        duration: '8 min',
        category: 'Features',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '📋',
    },
    {
        id: 3,
        title: 'Weekly & Monthly Analytics',
        description: 'Deep dive into weekly goals, monthly insights, and how to leverage data.',
        duration: '10 min',
        category: 'Analytics',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '📊',
    },
    {
        id: 4,
        title: 'Setting Up Annual Goals',
        description: 'Plan your year with the annual overview and dynamic year selection.',
        duration: '7 min',
        category: 'Planning',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '🗓️',
    },
    {
        id: 5,
        title: 'Using the Spreadsheet Templates',
        description: 'Download and customize Excel/Google Sheets templates for offline tracking.',
        duration: '12 min',
        category: 'Templates',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '📥',
    },
    {
        id: 6,
        title: 'Building Lasting Habits',
        description: 'Science-backed strategies for making habits stick using HabitArc.',
        duration: '15 min',
        category: 'Tips',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: '🧠',
    },
];

const CATEGORIES = ['All', 'Basics', 'Features', 'Analytics', 'Planning', 'Templates', 'Tips'];

export default function TutorialsPage() {
    const [selectedTutorial, setSelectedTutorial] = useState(TUTORIALS[0]);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const filteredTutorials = TUTORIALS.filter(t => {
        const matchCategory = filter === 'All' || t.category === filter;
        const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
                    Tutorials 🎓
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    Step-by-step guides on how to use HabitArc and the downloadable templates
                </p>
            </div>

            {/* Video Player */}
            <div className="card" style={{ marginBottom: 24, overflow: 'hidden' }}>
                <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%',
                    background: '#000',
                }}>
                    <iframe
                        src={selectedTutorial.videoUrl}
                        title={selectedTutorial.title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
                <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{
                            padding: '2px 10px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            fontSize: 11,
                            fontWeight: 600,
                        }}>
                            {selectedTutorial.category}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                            ⏱️ {selectedTutorial.duration}
                        </span>
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{selectedTutorial.title}</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedTutorial.description}</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    className="input"
                    placeholder="Search tutorials..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ maxWidth: 280 }}
                />
                <div className="tab-group">
                    {CATEGORIES.map(c => (
                        <button
                            key={c}
                            className={`tab-item ${filter === c ? 'active' : ''}`}
                            onClick={() => setFilter(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tutorial Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
            }}>
                {filteredTutorials.map(t => (
                    <div
                        key={t.id}
                        className="card"
                        onClick={() => setSelectedTutorial(t)}
                        style={{
                            padding: 20,
                            cursor: 'pointer',
                            border: selectedTutorial.id === t.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <div style={{ fontSize: 36, marginBottom: 12 }}>{t.thumbnail}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--bg-tertiary)',
                                fontSize: 10,
                                fontWeight: 600,
                                color: 'var(--text-secondary)',
                            }}>
                                {t.category}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>⏱️ {t.duration}</span>
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{t.title}</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{t.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
