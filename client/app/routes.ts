import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),
  route('/subscribe', 'routes/subscribe.tsx'),
  route('/post/new', 'routes/new-post.tsx'),
  route('/post/:slug', 'routes/post.$slug.tsx'),
] satisfies RouteConfig;
