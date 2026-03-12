'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface OnboardingContextValue {
    /** Whether the tour is currently running */
    tourActive: boolean;
    /** Starts the onboarding tour */
    startTour: () => void;
    /** Stops/skips the onboarding tour */
    stopTour: () => void;
    /** Whether the user has completed the tour before */
    hasCompletedTour: boolean;
    /** Reset the tour so it can be shown again */
    resetTour: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue>({} as OnboardingContextValue);

const TOUR_STORAGE_KEY = 'habitarc-onboarding-completed';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [tourActive, setTourActive] = useState(false);
    const [hasCompletedTour, setHasCompletedTour] = useState(true); // default true to prevent flash
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const completed = localStorage.getItem(TOUR_STORAGE_KEY);
        const isCompleted = completed === 'true';
        setHasCompletedTour(isCompleted);

        // Auto-start tour for first-time users after a short delay
        if (!isCompleted) {
            const timer = setTimeout(() => {
                setTourActive(true);
            }, 1500); // Wait for dashboard to fully render
            return () => clearTimeout(timer);
        }
    }, []);

    const startTour = useCallback(() => {
        setTourActive(true);
    }, []);

    const stopTour = useCallback(() => {
        setTourActive(false);
        setHasCompletedTour(true);
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }, []);

    const resetTour = useCallback(() => {
        setHasCompletedTour(false);
        localStorage.removeItem(TOUR_STORAGE_KEY);
    }, []);

    if (!mounted) return <>{children}</>;

    return (
        <OnboardingContext.Provider
            value={{
                tourActive,
                startTour,
                stopTour,
                hasCompletedTour,
                resetTour,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export const useOnboarding = () => useContext(OnboardingContext);
