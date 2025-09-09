/// <reference types="vite/client" />
// Only variables prefixed with VITE_ are available in the browser
export interface ClientConfig {
  isDev: boolean;
  api: {
    baseUrl: string;
  };
}

const createClientConfig = (): ClientConfig => {
  const isDev = import.meta.env.VITE_ENV === 'development';

  const defaultApiUrl =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3001/api'
      : '/api');

  return {
    isDev,
    api: {
      baseUrl: defaultApiUrl,
    },
  };
};

export const clientConfig = createClientConfig();
