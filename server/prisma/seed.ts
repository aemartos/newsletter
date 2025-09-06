import { prismaClient } from './prisma';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const users = await Promise.all([
    prismaClient.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        email: 'john@example.com',
        name: 'John Doe',
        subscribed: true,
      },
    }),
    prismaClient.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        email: 'jane@example.com',
        name: 'Jane Smith',
        subscribed: true,
      },
    }),
    prismaClient.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        name: 'Bob Johnson',
        subscribed: false,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample posts
  const posts = await Promise.all([
    prismaClient.post.upsert({
      where: { slug: 'welcome-to-our-newsletter' },
      update: {},
      create: {
        title: 'Welcome to Our Newsletter!',
        slug: 'welcome-to-our-newsletter',
        excerpt: "We're excited to have you join our community of readers.",
        content: `
          <h1>Welcome to Our Newsletter!</h1>
          <p>We're thrilled to have you as part of our community. This newsletter will bring you the latest insights, tips, and stories from our team.</p>
          <p>In this first edition, we want to share our vision and what you can expect from us going forward.</p>
          <h2>What to Expect</h2>
          <ul>
            <li>Weekly insights and analysis</li>
            <li>Exclusive content and early access</li>
            <li>Community highlights and success stories</li>
            <li>Behind-the-scenes content</li>
          </ul>
          <p>Thank you for subscribing, and we look forward to sharing this journey with you!</p>
        `,
        published: true,
        publishedAt: new Date('2024-01-15'),
        readTime: 3,
        category: 'Announcements',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'getting-started-with-react-router' },
      update: {},
      create: {
        title: 'Getting Started with React Router v7',
        slug: 'getting-started-with-react-router',
        excerpt:
          'Learn how to build modern web applications with React Router v7 and its powerful new features.',
        content: `
          <h1>Getting Started with React Router v7</h1>
          <p>React Router v7 brings exciting new features and improvements to the table. Let's explore what makes it special.</p>
          <h2>Key Features</h2>
          <ul>
            <li>Server-Side Rendering (SSR) out of the box</li>
            <li>File-based routing</li>
            <li>Built-in data loading</li>
            <li>Optimized performance</li>
          </ul>
          <h2>Getting Started</h2>
          <p>To get started with React Router v7, you'll need to install the necessary packages and set up your project structure.</p>
          <pre><code>npm create react-router@latest my-app</code></pre>
          <p>This command will create a new React Router v7 project with all the necessary dependencies and configuration.</p>
        `,
        published: true,
        publishedAt: new Date('2024-01-20'),
        readTime: 5,
        category: 'Tutorial',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'building-a-newsletter-platform' },
      update: {},
      create: {
        title: 'Building a Newsletter Platform with Modern Tools',
        slug: 'building-a-newsletter-platform',
        excerpt:
          'A deep dive into creating a full-stack newsletter platform using React Router v7, Express, and Prisma.',
        content: `
          <h1>Building a Newsletter Platform with Modern Tools</h1>
          <p>In this comprehensive guide, we'll walk through building a complete newsletter platform from scratch.</p>
          <h2>Tech Stack</h2>
          <ul>
            <li><strong>Frontend:</strong> React Router v7 with TypeScript</li>
            <li><strong>Backend:</strong> Express.js with TypeScript</li>
            <li><strong>Database:</strong> PostgreSQL with Prisma ORM</li>
            <li><strong>Deployment:</strong> Docker with Render.com</li>
          </ul>
          <h2>Key Features</h2>
          <p>Our newsletter platform includes:</p>
          <ul>
            <li>User subscription management</li>
            <li>Post creation and editing</li>
            <li>Email subscription handling</li>
            <li>Responsive design</li>
            <li>SEO optimization</li>
          </ul>
          <h2>Architecture Overview</h2>
          <p>The application follows a modern full-stack architecture with clear separation of concerns between the frontend and backend.</p>
        `,
        published: true,
        publishedAt: new Date('2024-01-25'),
        readTime: 8,
        category: 'Technical',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'draft-post-example' },
      update: {},
      create: {
        title: 'Draft Post Example',
        slug: 'draft-post-example',
        excerpt: "This is a draft post that hasn't been published yet.",
        content: `
          <h1>Draft Post Example</h1>
          <p>This is an example of a draft post. It won't be visible to the public until it's published.</p>
          <p>Draft posts are useful for:</p>
          <ul>
            <li>Working on content before publishing</li>
            <li>Collaborating with team members</li>
            <li>Scheduling content for future release</li>
          </ul>
        `,
        published: false,
        readTime: 2,
        category: 'Draft',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'the-future-of-web-development' },
      update: {},
      create: {
        title: 'The Future of Web Development',
        slug: 'the-future-of-web-development',
        excerpt:
          'Exploring emerging trends and technologies that will shape the future of web development.',
        content: `
          <h1>The Future of Web Development</h1>
          <p>Web development is evolving at an unprecedented pace. Let's explore what's coming next.</p>
          <h2>Key Trends</h2>
          <ul>
            <li>WebAssembly for high-performance applications</li>
            <li>Edge computing and CDN evolution</li>
            <li>Progressive Web Apps (PWAs) becoming mainstream</li>
            <li>AI integration in development tools</li>
          </ul>
          <p>The future is bright for web developers who stay adaptable and keep learning.</p>
        `,
        published: true,
        publishedAt: new Date('2024-02-01'),
        readTime: 4,
        category: 'Technology',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'css-grid-vs-flexbox' },
      update: {},
      create: {
        title: 'CSS Grid vs Flexbox: When to Use What',
        slug: 'css-grid-vs-flexbox',
        excerpt:
          'A comprehensive comparison of CSS Grid and Flexbox to help you choose the right layout method.',
        content: `
          <h1>CSS Grid vs Flexbox: When to Use What</h1>
          <p>Both CSS Grid and Flexbox are powerful layout tools, but they serve different purposes.</p>
          <h2>CSS Grid</h2>
          <p>Perfect for two-dimensional layouts where you need control over both rows and columns.</p>
          <h2>Flexbox</h2>
          <p>Ideal for one-dimensional layouts and component-level styling.</p>
          <h2>Best Practices</h2>
          <ul>
            <li>Use Grid for page layouts</li>
            <li>Use Flexbox for components</li>
            <li>Combine both for complex designs</li>
          </ul>
        `,
        published: true,
        publishedAt: new Date('2024-02-05'),
        readTime: 6,
        category: 'CSS',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'typescript-best-practices' },
      update: {},
      create: {
        title: 'TypeScript Best Practices for Large Applications',
        slug: 'typescript-best-practices',
        excerpt:
          'Essential TypeScript patterns and practices for building maintainable large-scale applications.',
        content: `
          <h1>TypeScript Best Practices for Large Applications</h1>
          <p>TypeScript can be a game-changer for large applications when used correctly.</p>
          <h2>Type Organization</h2>
          <ul>
            <li>Use interfaces for object shapes</li>
            <li>Prefer type unions over enums</li>
            <li>Create utility types for common patterns</li>
          </ul>
          <h2>Code Organization</h2>
          <p>Keep your types close to your code and use barrel exports for clean imports.</p>
        `,
        published: true,
        publishedAt: new Date('2024-02-10'),
        readTime: 7,
        category: 'TypeScript',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'database-optimization-tips' },
      update: {},
      create: {
        title: 'Database Optimization Tips for Better Performance',
        slug: 'database-optimization-tips',
        excerpt:
          'Learn essential database optimization techniques to improve your application performance.',
        content: `
          <h1>Database Optimization Tips for Better Performance</h1>
          <p>Database performance is crucial for user experience. Here are proven optimization strategies.</p>
          <h2>Indexing Strategies</h2>
          <ul>
            <li>Create indexes on frequently queried columns</li>
            <li>Use composite indexes for multi-column queries</li>
            <li>Monitor and remove unused indexes</li>
          </ul>
          <h2>Query Optimization</h2>
          <p>Always analyze your query execution plans and optimize accordingly.</p>
        `,
        published: true,
        publishedAt: new Date('2024-02-15'),
        readTime: 5,
        category: 'Database',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'react-performance-optimization' },
      update: {},
      create: {
        title: 'React Performance Optimization Techniques',
        slug: 'react-performance-optimization',
        excerpt:
          'Master React performance optimization with these proven techniques and patterns.',
        content: `
          <h1>React Performance Optimization Techniques</h1>
          <p>React applications can become slow without proper optimization. Here's how to keep them fast.</p>
          <h2>Key Techniques</h2>
          <ul>
            <li>Use React.memo for component memoization</li>
            <li>Implement useMemo and useCallback hooks</li>
            <li>Code splitting with React.lazy</li>
            <li>Virtual scrolling for large lists</li>
          </ul>
          <h2>Profiling Tools</h2>
          <p>Use React DevTools Profiler to identify performance bottlenecks.</p>
        `,
        published: true,
        publishedAt: new Date('2024-02-20'),
        readTime: 8,
        category: 'React',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'api-design-principles' },
      update: {},
      create: {
        title: 'RESTful API Design Principles',
        slug: 'api-design-principles',
        excerpt:
          'Learn the fundamental principles of designing clean, maintainable RESTful APIs.',
        content: `
          <h1>RESTful API Design Principles</h1>
          <p>Good API design is crucial for developer experience and maintainability.</p>
          <h2>Core Principles</h2>
          <ul>
            <li>Use HTTP methods correctly (GET, POST, PUT, DELETE)</li>
            <li>Design intuitive resource URLs</li>
            <li>Implement proper status codes</li>
            <li>Version your APIs</li>
          </ul>
          <h2>Best Practices</h2>
          <p>Always include comprehensive documentation and error handling.</p>
        `,
        published: true,
        publishedAt: new Date('2024-02-25'),
        readTime: 6,
        category: 'API',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'docker-containerization-guide' },
      update: {},
      create: {
        title: 'Docker Containerization: A Complete Guide',
        slug: 'docker-containerization-guide',
        excerpt:
          'Everything you need to know about containerizing your applications with Docker.',
        content: `
          <h1>Docker Containerization: A Complete Guide</h1>
          <p>Docker has revolutionized how we deploy and manage applications.</p>
          <h2>Getting Started</h2>
          <ul>
            <li>Understanding containers vs virtual machines</li>
            <li>Creating your first Dockerfile</li>
            <li>Building and running containers</li>
            <li>Docker Compose for multi-container apps</li>
          </ul>
          <h2>Production Considerations</h2>
          <p>Security, resource management, and monitoring are key for production deployments.</p>
        `,
        published: true,
        publishedAt: new Date('2024-03-01'),
        readTime: 9,
        category: 'DevOps',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'javascript-es2024-features' },
      update: {},
      create: {
        title: 'JavaScript ES2024: New Features to Watch',
        slug: 'javascript-es2024-features',
        excerpt:
          'Explore the latest JavaScript features and improvements in ES2024.',
        content: `
          <h1>JavaScript ES2024: New Features to Watch</h1>
          <p>JavaScript continues to evolve with exciting new features in ES2024.</p>
          <h2>New Features</h2>
          <ul>
            <li>Array grouping methods</li>
            <li>Improved error handling</li>
            <li>Enhanced async/await patterns</li>
            <li>New string methods</li>
          </ul>
          <h2>Browser Support</h2>
          <p>Check browser compatibility before using new features in production.</p>
        `,
        published: true,
        publishedAt: new Date('2024-03-05'),
        readTime: 5,
        category: 'JavaScript',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'testing-strategies-frontend' },
      update: {},
      create: {
        title: 'Frontend Testing Strategies That Actually Work',
        slug: 'testing-strategies-frontend',
        excerpt:
          'Comprehensive testing strategies for frontend applications using modern tools and techniques.',
        content: `
          <h1>Frontend Testing Strategies That Actually Work</h1>
          <p>Testing frontend applications can be challenging, but with the right strategy, it becomes manageable.</p>
          <h2>Testing Pyramid</h2>
          <ul>
            <li>Unit tests for individual functions</li>
            <li>Integration tests for component interactions</li>
            <li>E2E tests for critical user flows</li>
          </ul>
          <h2>Tools and Frameworks</h2>
          <p>Choose the right tools: Jest, React Testing Library, Cypress, or Playwright.</p>
        `,
        published: true,
        publishedAt: new Date('2024-03-10'),
        readTime: 7,
        category: 'Testing',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'web-security-fundamentals' },
      update: {},
      create: {
        title: 'Web Security Fundamentals Every Developer Should Know',
        slug: 'web-security-fundamentals',
        excerpt:
          'Essential web security concepts and practices to protect your applications and users.',
        content: `
          <h1>Web Security Fundamentals Every Developer Should Know</h1>
          <p>Security should be a priority from day one, not an afterthought.</p>
          <h2>Common Vulnerabilities</h2>
          <ul>
            <li>Cross-Site Scripting (XSS)</li>
            <li>SQL Injection</li>
            <li>Cross-Site Request Forgery (CSRF)</li>
            <li>Insecure Direct Object References</li>
          </ul>
          <h2>Best Practices</h2>
          <p>Always validate input, use HTTPS, and keep dependencies updated.</p>
        `,
        published: true,
        publishedAt: new Date('2024-03-15'),
        readTime: 6,
        category: 'Security',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'microservices-architecture' },
      update: {},
      create: {
        title: 'Microservices Architecture: Benefits and Challenges',
        slug: 'microservices-architecture',
        excerpt:
          'Understanding when and how to implement microservices architecture in your applications.',
        content: `
          <h1>Microservices Architecture: Benefits and Challenges</h1>
          <p>Microservices can provide flexibility and scalability, but they're not always the right choice.</p>
          <h2>Benefits</h2>
          <ul>
            <li>Independent deployment</li>
            <li>Technology diversity</li>
            <li>Scalability</li>
            <li>Team autonomy</li>
          </ul>
          <h2>Challenges</h2>
          <p>Complexity, data consistency, and network latency are common challenges.</p>
        `,
        published: true,
        publishedAt: new Date('2024-03-20'),
        readTime: 8,
        category: 'Architecture',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'graphql-vs-rest' },
      update: {},
      create: {
        title: 'GraphQL vs REST: Choosing the Right API Style',
        slug: 'graphql-vs-rest',
        excerpt:
          'A detailed comparison of GraphQL and REST to help you make informed API decisions.',
        content: `
          <h1>GraphQL vs REST: Choosing the Right API Style</h1>
          <p>Both GraphQL and REST have their place in modern application development.</p>
          <h2>GraphQL Advantages</h2>
          <ul>
            <li>Single endpoint</li>
            <li>Client-specified queries</li>
            <li>Strong typing</li>
            <li>Real-time subscriptions</li>
          </ul>
          <h2>REST Advantages</h2>
          <p>Simplicity, caching, and wide adoption make REST a solid choice for many applications.</p>
        `,
        published: true,
        publishedAt: new Date('2024-03-25'),
        readTime: 7,
        category: 'API',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'css-custom-properties' },
      update: {},
      create: {
        title: 'Mastering CSS Custom Properties (CSS Variables)',
        slug: 'css-custom-properties',
        excerpt:
          'Learn how to leverage CSS custom properties for dynamic and maintainable stylesheets.',
        content: `
          <h1>Mastering CSS Custom Properties (CSS Variables)</h1>
          <p>CSS custom properties bring the power of variables to CSS, enabling dynamic theming and better maintainability.</p>
          <h2>Basic Usage</h2>
          <ul>
            <li>Defining custom properties</li>
            <li>Using var() function</li>
            <li>Fallback values</li>
            <li>Inheritance and scope</li>
          </ul>
          <h2>Advanced Techniques</h2>
          <p>Use custom properties for theming, animations, and responsive design.</p>
        `,
        published: true,
        publishedAt: new Date('2024-03-30'),
        readTime: 6,
        category: 'CSS',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'nodejs-performance-tips' },
      update: {},
      create: {
        title: 'Node.js Performance Optimization Tips',
        slug: 'nodejs-performance-tips',
        excerpt:
          'Essential performance optimization techniques for Node.js applications.',
        content: `
          <h1>Node.js Performance Optimization Tips</h1>
          <p>Node.js applications can be highly performant with the right optimizations.</p>
          <h2>Key Areas</h2>
          <ul>
            <li>Memory management</li>
            <li>Asynchronous operations</li>
            <li>Database query optimization</li>
            <li>Caching strategies</li>
          </ul>
          <h2>Monitoring</h2>
          <p>Use profiling tools to identify bottlenecks and measure improvements.</p>
        `,
        published: true,
        publishedAt: new Date('2024-04-01'),
        readTime: 5,
        category: 'Node.js',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'accessibility-web-development' },
      update: {},
      create: {
        title: 'Web Accessibility: Building Inclusive Applications',
        slug: 'accessibility-web-development',
        excerpt:
          'Learn how to create accessible web applications that work for everyone.',
        content: `
          <h1>Web Accessibility: Building Inclusive Applications</h1>
          <p>Accessibility isn't just a nice-to-have; it's essential for creating inclusive web experiences.</p>
          <h2>Key Principles</h2>
          <ul>
            <li>Perceivable content</li>
            <li>Operable interfaces</li>
            <li>Understandable information</li>
            <li>Robust implementation</li>
          </ul>
          <h2>Implementation</h2>
          <p>Use semantic HTML, proper ARIA labels, and test with screen readers.</p>
        `,
        published: true,
        publishedAt: new Date('2024-04-05'),
        readTime: 6,
        category: 'Accessibility',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'draft-advanced-react-patterns' },
      update: {},
      create: {
        title: 'Advanced React Patterns for Complex Applications',
        slug: 'draft-advanced-react-patterns',
        excerpt:
          'Exploring advanced React patterns like render props, higher-order components, and custom hooks.',
        content: `
          <h1>Advanced React Patterns for Complex Applications</h1>
          <p>As React applications grow in complexity, advanced patterns become essential for maintainability.</p>
          <h2>Patterns Covered</h2>
          <ul>
            <li>Render Props pattern</li>
            <li>Higher-Order Components (HOCs)</li>
            <li>Custom hooks composition</li>
            <li>Compound components</li>
          </ul>
          <p>This is a work in progress and will be published soon.</p>
        `,
        published: false,
        readTime: 10,
        category: 'Draft',
      },
    }),
    prismaClient.post.upsert({
      where: { slug: 'draft-serverless-architecture' },
      update: {},
      create: {
        title: 'Serverless Architecture: The Future of Cloud Computing',
        slug: 'draft-serverless-architecture',
        excerpt:
          'Understanding serverless computing and its implications for modern application development.',
        content: `
          <h1>Serverless Architecture: The Future of Cloud Computing</h1>
          <p>Serverless computing is changing how we think about application deployment and scaling.</p>
          <h2>Benefits</h2>
          <ul>
            <li>No server management</li>
            <li>Automatic scaling</li>
            <li>Pay-per-execution pricing</li>
            <li>Faster development cycles</li>
          </ul>
          <p>This comprehensive guide is still being written and will be published soon.</p>
        `,
        published: false,
        readTime: 12,
        category: 'Draft',
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
