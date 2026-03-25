// ✅ CHANGE 4: Google Analytics Fix — Centralized analytics helper
// NOTE: Some users may block analytics via ad blockers — this is expected
// and cannot be fixed in code. All gtag calls are wrapped in try-catch
// to gracefully handle cases where gtag is blocked or not loaded.

/**
 * Safely call gtag if it exists (won't error if blocked by ad blocker)
 */
function safeGtag(...args: unknown[]) {
    try {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window.gtag as (...a: any[]) => void)(...args);
        }
    } catch {
        // Analytics blocked by ad blocker or not loaded — silently ignore
    }
}

/** Fire a pageview event — call ONCE per actual navigation */
export function trackPageView(path: string) {
    safeGtag('event', 'page_view', {
        page_path: path,
        page_title: document.title,
    });
}

/** Track a custom event with category/label/value */
export function trackEvent(
    eventName: string,
    opts?: { category?: string; label?: string; value?: number }
) {
    safeGtag('event', eventName, {
        event_category: opts?.category ?? 'Habits',
        event_label: opts?.label ?? '',
        value: opts?.value ?? 1,
    });
}

// ── Typed convenience helpers ──────────────────────────────────────────────

export const trackHabitCreated = (habitName: string) =>
    trackEvent('habit_created', { category: 'Habits', label: habitName });

export const trackHabitChecked = (habitName: string) =>
    trackEvent('habit_checked', { category: 'Habits', label: habitName });

export const trackHabitDeleted = (habitName: string) =>
    trackEvent('habit_deleted', { category: 'Habits', label: habitName });

export const trackCategorySelected = (categoryName: string) =>
    trackEvent('category_selected', { category: 'Habits', label: categoryName });

export const trackTutorialStarted = () =>
    trackEvent('tutorial_started', { category: 'Onboarding', label: 'tour' });

export const trackTutorialCompleted = () =>
    trackEvent('tutorial_completed', { category: 'Onboarding', label: 'tour' });
