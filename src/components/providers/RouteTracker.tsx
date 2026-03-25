// ✅ CHANGE 4: Google Analytics — SPA route change tracker
// Fires page_view ONCE per actual route change, not on every re-render
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export default function RouteTracker() {
    const pathname = usePathname();
    const lastTracked = useRef<string>('');

    useEffect(() => {
        // Only fire if the path actually changed
        if (pathname && pathname !== lastTracked.current) {
            lastTracked.current = pathname;
            trackPageView(pathname);
        }
    }, [pathname]);

    return null;
}
