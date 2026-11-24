export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  appName: import.meta.env.VITE_APP_NAME || 'Enterprise Frontend Architecture',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
