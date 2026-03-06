'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && pathname !== '/login') {
            router.push('/login');
        }
    }, [isAuthenticated, pathname, router]);

    // Login page has no sidebar
    if (pathname === '/login') {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-primary, #0f172a)',
            }}>
                <div style={{
                    width: 28,
                    height: 28,
                    border: '3px solid rgba(99,102,241,0.3)',
                    borderTopColor: '#6366f1',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
