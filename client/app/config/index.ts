// Only variables prefixed with VITE_ are available in the browser
export interface ClientConfig {
  api: {
    baseUrl: string;
  };
}

const createClientConfig = (): ClientConfig => {
  return {
    api: {
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    },
  };
};

export const clientConfig = createClientConfig();
