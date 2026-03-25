// ✅ CHANGE 4: Google Analytics — global type for gtag
interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
}
