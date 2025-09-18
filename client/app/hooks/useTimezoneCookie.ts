import { useEffect } from 'react';

export const useSetTimezoneCookie = () => {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.cookie = `timezone=${tz};path=/`;
  }, []);
};

export const getTimezoneCookie = (request: Request) => {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => c.split('='))
  );
  const userTz = cookies.timezone || '';
  return { userTz };
};
