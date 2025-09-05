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
