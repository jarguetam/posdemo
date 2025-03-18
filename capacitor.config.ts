import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.posdiproal.app',
    appName: 'Pos Diproal',
    webDir: 'dist/pos',
    server: {
        androidScheme: 'https',
        allowNavigation: ['localhost', '190.92.95.84:9095'],
        cleartext: true,
    },
    android: {
        allowMixedContent: true,
    },
    ios: {
        limitsNavigationsToAppBoundDomains: false,
    },
    
};

export default config;
