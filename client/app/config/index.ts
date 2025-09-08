// Only variables prefixed with VITE_ are available in the browser
export interface ClientConfig {
  api: {
    baseUrl: string;
  };
}

const createClientConfig = (): ClientConfig => {
  const defaultApiUrl =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3001/api'
      : '/api');

  return {
    api: {
      baseUrl: defaultApiUrl,
    },
  };
};

export const clientConfig = createClientConfig();
