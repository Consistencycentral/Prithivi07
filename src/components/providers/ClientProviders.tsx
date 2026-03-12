'use client';

import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { HabitProvider } from '@/contexts/HabitContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import AppLayout from '@/components/layout/AppLayout';
import RegisterSW from '@/components/providers/RegisterSW';
import OnboardingTour from '@/components/onboarding/OnboardingTour';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <HabitProvider>
                    <OnboardingProvider>
                        <AppLayout>
                            {children}
                        </AppLayout>
                        <OnboardingTour />
                    </OnboardingProvider>
                </HabitProvider>
            </AuthProvider>
            <RegisterSW />
        </ThemeProvider>
    );
}
