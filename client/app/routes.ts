import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { Routes } from './lib';

export default [
  index('routes/index.tsx'),
  route(Routes.SUBSCRIBE, 'routes/subscribe.tsx'),
  route(Routes.POSTS_NEW, 'routes/new-post.tsx'),
  route(Routes.POSTS_VIEW, 'routes/post.$slug.tsx'),
] satisfies RouteConfig;
