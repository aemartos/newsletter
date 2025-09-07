export const PUBLISH_RETRY = {
  retryLimit: 5,
  retryBackoff: true, // exponential
  retryDelay: 10, // seconds (base for backoff)
};

export const SEND_WORKERS = 25;
