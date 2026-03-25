'use client';

import React from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { HabitProvider } from '@/contexts/HabitContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import AppLayout from '@/components/layout/AppLayout';
import RegisterSW from '@/components/providers/RegisterSW';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
// ✅ CHANGE 4: Google Analytics — SPA route tracker
import RouteTracker from '@/components/providers/RouteTracker';

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
                        {/* ✅ CHANGE 4: fires page_view once per route change */}
                        <RouteTracker />
                    </OnboardingProvider>
                </HabitProvider>
            </AuthProvider>
            <RegisterSW />
        </ThemeProvider>
    );
}
