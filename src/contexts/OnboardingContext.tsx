'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// ✅ CHANGE 4: Google Analytics event tracking for tutorial
import { trackTutorialStarted, trackTutorialCompleted } from '@/lib/analytics';

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

// ✅ CHANGE 3: Tutorial — localStorage flag key (also acts as tutorial_completed: true)
const TOUR_STORAGE_KEY = 'tutorial_completed';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [tourActive, setTourActive] = useState(false);
    const [hasCompletedTour, setHasCompletedTour] = useState(true); // default true to prevent flash
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const completed = localStorage.getItem(TOUR_STORAGE_KEY);
        const isCompleted = completed === 'true';
        setHasCompletedTour(isCompleted);

        // ✅ CHANGE 3: Auto-start tour for first-time users only once
        if (!isCompleted) {
            const timer = setTimeout(() => {
                setTourActive(true);
                // ✅ CHANGE 4: GA — tutorial_started event
                trackTutorialStarted();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const startTour = useCallback(() => {
        setTourActive(true);
        // ✅ CHANGE 4: GA — tutorial_started event (manual replay)
        trackTutorialStarted();
    }, []);

    const stopTour = useCallback(() => {
        setTourActive(false);
        setHasCompletedTour(true);
        // ✅ CHANGE 3: Set tutorial_completed flag so it never shows again
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        // ✅ CHANGE 4: GA — tutorial_completed event
        trackTutorialCompleted();
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
