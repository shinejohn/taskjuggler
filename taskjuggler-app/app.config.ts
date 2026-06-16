// Dynamic EAS project ID from environment (set EXPO_PUBLIC_EAS_PROJECT_ID in CI / .env)
const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? '';

export default {
  expo: {
    name: 'Fibonacco AI',
    slug: 'fibonacco-ai',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#2563eb',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.fibonacco.ai',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#2563eb',
      },
      package: 'com.fibonacco.ai',
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [{ scheme: 'fibonacco' }],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
    scheme: 'fibonacco',
    plugins: [
      'expo-router',
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#2563eb',
        },
      ],
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://ai-tools-api-production-2c1e.up.railway.app/api',
      eas: {
        projectId: easProjectId,
      },
    },
  },
};
