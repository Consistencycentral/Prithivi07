import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.habitarc.app',
    appName: 'HabitArc',
    webDir: 'out',
    server: {
        // Use https scheme for proper CORS and cookie behavior
        androidScheme: 'https',
    },
    plugins: {
        StatusBar: {
            backgroundColor: '#0f172a',
            style: 'DARK',
            overlaysWebView: false,
        },
        SplashScreen: {
            launchAutoHide: true,
            launchShowDuration: 1500,
            backgroundColor: '#0f172a',
            showSpinner: false,
        },
        Keyboard: {
            resize: 'body',
            resizeOnFullScreen: true,
        },
    },
};

export default config;
