'use client';

import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { HabitProvider } from '@/contexts/HabitContext';
import AppLayout from '@/components/layout/AppLayout';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <HabitProvider>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </HabitProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
