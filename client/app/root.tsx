import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';
import type { LinksFunction } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { Layout } from './components';
import './root.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap',
  },
  // Favicon with light/dark mode support
  { rel: 'icon', href: '/favicon/light/favicon.ico', sizes: 'any' },
  {
    rel: 'icon',
    href: '/favicon/light/favicon-16x16.png',
    sizes: '16x16',
    type: 'image/png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    href: '/favicon/light/favicon-32x32.png',
    sizes: '32x32',
    type: 'image/png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    href: '/favicon/dark/favicon-16x16.png',
    sizes: '16x16',
    type: 'image/png',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'icon',
    href: '/favicon/dark/favicon-32x32.png',
    sizes: '32x32',
    type: 'image/png',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'apple-touch-icon',
    href: '/favicon/light/apple-touch-icon.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'apple-touch-icon',
    href: '/favicon/dark/apple-touch-icon.png',
    media: '(prefers-color-scheme: dark)',
  },
];

function App() {
  const location = useLocation();

  const menuRoutes = [''];
  const showMenu = menuRoutes.includes(location.pathname);

  const centeredRoutes = ['/subscribe'];
  const centered = centeredRoutes.includes(location.pathname);

  return (
    <Layout showMenu={showMenu} centered={centered}>
      <Outlet />
    </Layout>
  );
}

export default function Root() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
          },
        },
      })
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
