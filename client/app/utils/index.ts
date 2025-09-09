import { formatISO } from 'date-fns';
import { clientConfig } from '../config/index.js';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
};

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
};

export const getUTCDate = (date: string) => {
  // TODO(Ana): try this cookie solution -> https://www.jacobparis.com/content/remix-ssr-dates
  if (!date) return null;
  if (clientConfig.isDev) return date;

  // Create a fake UTC date to get the timezone offset
  const fakeUtcTime = new Date(`${date}Z`);
  const scheduleDateString = formatISO(date, { format: 'extended' });
  const time = scheduleDateString.split('T')[1];
  const timezoneOffsetPlus = time.split('+')[1];
  const timezoneOffsetMinus = time.split('-')[1];

  let parsedOffsetMinutes = 0;
  if (timezoneOffsetPlus) {
    // Parse "+02:00" format
    const [hours] = timezoneOffsetPlus.split(':').map(Number);
    parsedOffsetMinutes = hours * 60;
  } else if (timezoneOffsetMinus) {
    // Parse "-07:00" format
    const [hours] = timezoneOffsetMinus.split(':').map(Number);
    parsedOffsetMinutes = -(hours * 60);
  }

  // If timezone offset is 0, no conversion needed
  if (parsedOffsetMinutes === 0) {
    return fakeUtcTime.toISOString();
  }

  // Convert to UTC by subtracting the timezone offset from fakeUtcTime.getTime()
  const utcDate = new Date(fakeUtcTime.getTime() - parsedOffsetMinutes * 60000);

  return utcDate.toISOString();
};
