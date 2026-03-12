'use client';

import React, { useCallback } from 'react';
import Joyride, {
    CallBackProps,
    STATUS,
    Step,
    TooltipRenderProps,
} from 'react-joyride';
import { useOnboarding } from '@/contexts/OnboardingContext';

// ─── Tour Step Definitions ───────────────────────────────────────────────────
const TOUR_STEPS: Step[] = [
    {
        // Step 1: Welcome Modal (center screen)
        target: 'body',
        placement: 'center',
        disableBeacon: true,
        content: '',
        data: {
            isWelcome: true,
            title: '🚀 Welcome to HabitArc',
            description:
                'Your personal command center for building lasting consistency. Let us show you around!',
            emoji: '✨',
        },
    },
    {
        // Step 2: Add Habit Button
        target: '#onboarding-add-habit',
        placement: 'right',
        disableBeacon: true,
        content: '',
        data: {
            title: 'Add Your First Habit',
            description:
                'Start by clicking the Add Habit button to define your first daily or weekly goal. Type a name and hit the + button!',
            emoji: '➕',
        },
    },
    {
        // Step 3: Habit List / Checkboxes
        target: '#onboarding-habit-list',
        placement: 'right',
        disableBeacon: true,
        content: '',
        data: {
            title: 'Track Your Progress',
            description:
                'Check off your habits here to instantly update your progress and keep your streaks alive.',
            emoji: '✅',
        },
    },
    {
        // Step 4: Statistics / Dashboard Charts
        target: '#onboarding-stats-section',
        placement: 'right',
        disableBeacon: true,
        content: '',
        data: {
            title: 'Visualize Your Growth',
            description:
                'Visit the Statistics tab to see your growth visualized through interactive charts and data.',
            emoji: '📊',
        },
    },
    {
        // Step 5: Categories / Views Section
        target: '#onboarding-views-section',
        placement: 'right',
        disableBeacon: true,
        content: '',
        data: {
            title: 'Organize Your Life',
            description:
                'Organize your life by grouping habits into categories like Health, Work, or Personal across different views.',
            emoji: '🗂️',
        },
    },
    {
        // Step 6: Settings / Theme Toggle
        target: '#onboarding-settings',
        placement: 'right',
        disableBeacon: true,
        content: '',
        data: {
            title: 'Customize Your Experience',
            description:
                'Head to Settings to customize your theme and notification triggers so you never miss a beat.',
            emoji: '⚙️',
        },
    },
    {
        // Step 7: Conclusion Modal (center screen)
        target: 'body',
        placement: 'center',
        disableBeacon: true,
        content: '',
        data: {
            isConclusion: true,
            title: "You're All Set! 🎉",
            description:
                "The best way to build a habit is to log your first action right now. Let's make today count!",
            emoji: '🏆',
        },
    },
];

// ─── Custom Tooltip Component ────────────────────────────────────────────────
function CustomTooltip({
    continuous,
    index,
    step,
    backProps,
    primaryProps,
    skipProps,
    tooltipProps,
    isLastStep,
}: TooltipRenderProps) {
    const stepData = (step as Step & { data?: Record<string, unknown> }).data || {};
    const isWelcome = stepData.isWelcome as boolean;
    const isConclusion = stepData.isConclusion as boolean;
    const title = stepData.title as string;
    const description = stepData.description as string;
    const emoji = stepData.emoji as string;
    const isCenterModal = isWelcome || isConclusion;

    return (
        <div
            {...tooltipProps}
            className="onboarding-tooltip"
            style={{
                maxWidth: isCenterModal ? 440 : 380,
                width: '90vw',
            }}
        >
            {/* Close / Skip Button */}
            <button
                {...skipProps}
                className="onboarding-close-btn"
                aria-label="Skip tour"
            >
                ✕
            </button>

            {/* Emoji Badge */}
            <div className="onboarding-emoji-badge">
                <span style={{ fontSize: isCenterModal ? 36 : 28 }}>{emoji}</span>
            </div>

            {/* Content */}
            <div className="onboarding-content">
                <h3 className="onboarding-title">{title}</h3>
                <p className="onboarding-description">{description}</p>
            </div>

            {/* Step Counter */}
            {!isCenterModal && (
                <div className="onboarding-step-counter">
                    {TOUR_STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`onboarding-dot ${i === index ? 'active' : ''} ${i < index ? 'completed' : ''
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Navigation */}
            <div className="onboarding-nav">
                {!isWelcome && (
                    <button
                        {...backProps}
                        className="onboarding-btn onboarding-btn-back"
                    >
                        ← Back
                    </button>
                )}
                {isWelcome && (
                    <button
                        {...skipProps}
                        className="onboarding-btn onboarding-btn-skip"
                    >
                        Skip Tour
                    </button>
                )}
                <button
                    {...primaryProps}
                    className={`onboarding-btn onboarding-btn-next ${isConclusion ? 'onboarding-btn-finish' : ''
                        }`}
                >
                    {isConclusion
                        ? '🚀 Start Tracking!'
                        : isWelcome
                            ? "Let's Go! →"
                            : 'Next →'}
                </button>
            </div>
        </div>
    );
}

// ─── Main Tour Component ─────────────────────────────────────────────────────
export default function OnboardingTour() {
    const { tourActive, stopTour } = useOnboarding();

    const handleCallback = useCallback(
        (data: CallBackProps) => {
            const { status } = data;
            const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

            if (finishedStatuses.includes(status)) {
                stopTour();
            }
        },
        [stopTour]
    );

    if (!tourActive) return null;

    return (
        <Joyride
            steps={TOUR_STEPS}
            run={tourActive}
            continuous
            showSkipButton
            showProgress={false}
            disableOverlayClose={false}
            disableCloseOnEsc={false}
            disableScrolling={false}
            spotlightClicks={false}
            callback={handleCallback}
            tooltipComponent={CustomTooltip}
            floaterProps={{
                disableAnimation: false,
            }}
            styles={{
                options: {
                    zIndex: 10000,
                    arrowColor: 'var(--bg-card, #1a1d2e)',
                    overlayColor: 'rgba(0, 0, 0, 0.75)',
                    primaryColor: '#6366f1',
                },
                spotlight: {
                    borderRadius: 12,
                },
                overlay: {
                    mixBlendMode: undefined,
                },
            }}
            locale={{
                back: 'Back',
                close: 'Close',
                last: 'Start Tracking!',
                next: 'Next',
                skip: 'Skip',
            }}
        />
    );
}
