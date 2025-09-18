# Newsletter App

A full-stack newsletter application built with React Router SSR, TypeScript, Express, and PostgreSQL.

## 🏗️ Architecture

### 📁 Project Structure

#### Client (`/client`)

- **React Router v7** with Server-Side Rendering (SSR)
- **TypeScript** for type safety
- **TipTap** rich text editor for post creation
- **TanStack Query** for infinity scroll
- **CSS Modules** for component-scoped styling

#### Server (`/server`)

- **Express.js** REST API
- **Prisma ORM** for database operations and migrations
- **Rensed** for email notifications (idempotency key)
- **TypeScript** for type safety
- **PostgreSQL** database with connection pooling
- **PgBoss** job queue system for background processing

```bash
newsletter/
├── client/                     # React Router SSR client
│   ├── app/
│   │   ├── components/         # Reusable UI components
│   │   ├── config/             # App configuration
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities and API client
│   │   ├── routes/             # Route components
│   │   │   ├── index.tsx       # Home page with infinite scroll
│   │   │   ├── new-post.tsx    # Post creation form
│   │   │   ├── post.$slug.tsx  # Individual post view
│   │   │   └── subscribe.tsx   # Newsletter subscription
│   │   │   └── unsubscribe.tsx # Newsletter subscription
│   │   ├── utils/              # Helper functions
│   │   ├── root.tsx            # Root layout component
│   │   ├── root.css            # Global styles
│   │   └── routes.ts           # Route configuration
│   ├── public/                 # Static assets (favicons, images)
│   ├── react-router.config.ts  # React Router configuration
│   └── package.json
├── server/                     # Express.js API server
│   ├── src/
│   │   ├── config/             # Server configuration
│   │   ├── providers/          # External service providers
│   │   ├── routes/             # API route handlers
│   │   │   ├── posts.ts        # Post CRUD operations
│   │   │   └── subscribers.ts  # Subscriber management
│   │   ├── workers/            # Background job workers
│   │   │   ├── newsletter.ts   # Newsletter publishing and email workers
│   │   │   ├── queue.ts        # Queue management utilities
│   │   │   ├── consts.ts       # Worker configuration constants
│   │   │   └── index.ts        # Worker registration
│   │   ├── lib/
│   │   │   └── jobs/           # PgBoss job queue setup
│   │   ├── prisma.ts           # Prisma client setup
│   │   └── index.ts            # Server entry point with SSR
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── seed.ts             # Database seeding
│   │   └── migrations/         # Database migrations
│   └── package.json
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Docker Compose for local development
├── ecosystem.config.js         # PM2 configuration for development
├── render.yaml                 # Render deployment configuration (for the preDeployCommand, but it's only in paid tiers)
├── pnpm-workspace.yaml         # PNPM workspace configuration
└── package.json                # Root package.json with workspace scripts
```

## 📋 Prerequisites

- **Node.js** (v20.19.0 or higher)
- **pnpm** (v8.15.0 or higher)
- **PostgreSQL** (v12 or higher)
- **PM2** (installed globally, v5.3.0+)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:aemartos/newsletter.git
   cd newsletter
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

4. **Set up the database**

   The application includes a `docker-compose.yml` file to start a PostgreSQL database:

   ```bash
   # Start PostgreSQL database
   docker-compose up -d newsletter-db
   ```

   ```bash
   cd server

   # Generate Prisma client
   pnpm db:generate
   
   # Push the schema to your database
   pnpm db:push
   
   # Seed the database with sample data
   pnpm db:seed
   ```

## 🚀 Development

### Start both client and server with PM2

```bash
pnpm dev
```

or

```bash
pm2 start
```

### Start individual services

```bash
# Start only the client
pnpm dev:client

# Start only the server
pnpm dev:server
```

or

```bash
# Start only the client
pm2 client

# Start only the server
pm2 server
```

## 🗄️ Database

### Prisma Commands

```bash
cd server

# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Create and run migrations
pnpm db:migrate

# Seed the database
pnpm db:seed
```

### Database Schema

The application uses the following main entities:

- **Subscribers**: newsletter subscribers
- **Posts**: posts and content
- **EmailDeliveries**: history of emails sent

## 🔧 API Endpoints

### Health Check

- `GET /api/health` - Application health status and database connectivity

### Subscribers

- `POST /api/subscribers` - Create a new subscriber (subscribe)
- `POST /api/subscribers/unsubscribe` - Unsubscribe a subscriber (unsubscribe)

### Posts

- `GET /api/posts` - Get posts by filter (paginated)
  - Query parameters: `limit`, `cursor`, `status`, `sortBy`, `sortOrder`
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/posts` - Create post with optional scheduling
  - Supports `schedule` field for future publication
  - Automatically triggers background job for scheduled posts
  - Required fields: `title`, `slug`, `content`
  - Optional fields: `excerpt`, `schedule`

## 🔄 Background Job Processing

### PgBoss Job Queue System

The application uses **PgBoss** for reliable background job processing, leveraging PostgreSQL as the job queue backend.

#### Job Types

1. **Newsletter Publishing** (`newsletter.publish-post`)
   - Publishes a scheduled post
   - Updates post status to `PUBLISHED`
   - Creates email delivery records for all subscribers
   - Triggers individual email sending jobs

2. **Email Sending** (`newsletter.send-email`)
   - Sends individual emails to subscribers
   - Uses Resend for email delivery with idempotency keys
   - Updates delivery status in database
   - Handles retry logic for failed deliveries

#### Worker Configuration

- **Publish Worker**: 1 worker, processes posts sequentially
- **Email Workers**: 2 concurrent workers (respects Resend's 2 req/sec rate limit)
- **Retry Settings**: Up to 10 retries with exponential backoff
- **Singleton Keys**: Prevents duplicate email sends per subscriber

## 🧪 Code Quality

### Linting

```bash
# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Type Checking

```bash
# Check types across the project
pnpm type-check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Router](https://reactrouter.com/) for the SSR framework
- [Prisma](https://www.prisma.io/) for the database ORM
- [Express.js](https://expressjs.com/) for the backend framework
- [PgBoss](https://github.com/timgit/pg-boss) for reliable job queue processing
- [Resend](https://resend.com/) for email delivery services with idempotency keys

## 🤔 Rationale

### Why These Technologies?

#### **React Router v7 with SSR**

- **Server-side rendering** for better SEO and initial load performance
- **Built-in data loading** with loaders and actions

#### **PgBoss for Job Processing**

- **Reliability**: Jobs are persisted in PostgreSQL and won't be lost
- **Scalability**: Multiple workers can process jobs concurrently
- **Retry Logic**: Automatic retry with exponential backoff for failed jobs
- **Singleton Jobs**: Prevents duplicate job execution
- **Simple Setup**: Uses existing PostgreSQL database, no additional infrastructure

#### **Prisma ORM**

- **Type Safety**: Generated TypeScript types for database operations
- **SQL Injection Protection**: Built-in query sanitization
- **Migration Management**: Version-controlled database schema changes

#### **Resend for Email**

- **Reliability**: Enterprise-grade email delivery
- **Analytics**: Built-in delivery tracking and analytics
- **Scalability**: Handles high-volume email sending
- **Compliance**: Built-in spam and compliance features
- **Idempotency key**: to avoid sending the send email twice

### Trade-offs Made

#### **PgBoss vs. Redis-based Queues**

- **Trade-off**: Using PostgreSQL for job storage instead of Redis
- **Why acceptable**:
  - No additional infrastructure needed
  - Jobs are persisted and won't be lost on restart
  - Simpler deployment and monitoring
- **Limitation**: Database load monitoring needed for optimal performance

#### **Prisma Accelerate vs. Direct Connection**

- **Trade-off**: Couldn't use Prisma Accelerate due to PgBoss requiring direct database URL (I'll need to research more bout this)
- **Why acceptable**:
  - Direct connection provides better performance for job processing
  - Simpler configuration and debugging
  - No additional service dependencies

#### **HTML Content Storage**

- **Security Concern**: Using `dangerouslySetInnerHTML` for post content
- **Risk**: Potential XSS attacks from malicious scripts
- **Mitigation**: Content should be sanitized before storage or use a safe HTML parser

#### **React Router v7 vs. Traditional SPA**

- **Trade-off**: Using SSR framework instead of client-side only React
- **Why acceptable**:
  - Better SEO and initial load performance
  - Built-in data loading and form handling
- **Limitation**: More complex deployment and server-side rendering considerations

#### **Time Constraints - MVP Focus**

- **Trade-off**: Limited time to build a complete newsletter platform
- **Why acceptable**:
  - Focus on core functionality (posts, subscribers, email delivery)
  - Prioritize working features over perfect architecture
  - Can iterate and improve over time
- **Specific Limitations**:
  - **Express.js Performance**: Using Express instead of faster frameworks
  - **No Authentication**: Anyone can create posts, no user management
  - **Basic Error Handling**: Generic error messages, no detailed error tracking
  - **Limited Validation**: Basic form validation, no comprehensive input sanitization
  - **No Rate Limiting**: API endpoints not protected against abuse
  - **No Caching**: No Redis or CDN integration for performance
  - **No Monitoring**: No application monitoring or alerting system

### Future Improvements

#### Security

- **Content Sanitization**: Implement DOMPurify or similar for HTML content
- **XSS Protection**: Replace `dangerouslySetInnerHTML` with safe HTML rendering
- **Rate Limiting**: Add API rate limiting for public endpoints

#### Infrastructure & Performance

- **Infinite Scroll Optimization**: Hide previous posts to avoid performance issues
- **Batching**: Optimize jobs with batching strategies
- **Caching Layer**: Add Redis for caching frequently accessed posts

#### Monitoring, Observability & Reliability

- **Alerting System**: Implement comprehensive alerting for failures and performance issues
- **Application Monitoring**: Integrate monitoring tools like DataDog for application performance monitoring
- **Metrics Collection**: Custom metrics for business logic (email delivery rates, post engagement, etc.)
- **Testing**: Unit, e2e, integration, stress...

#### Database Improvements

- **Expand model**: adapt the model to new features/needs
- **Transaction Optimization**: Improve database transactions in API endpoints
- **Data Archiving**: Archive old posts and email delivery records
- **Read Replicas**: Implement read replicas for better read performance

#### User Management & Authentication

- **User System**: Implement user authentication and authorization
- **Author Posts**: Associate posts with specific authors
- **Roles & Permissions**: Role-based access control system
- **OAuth Integration**: Social login with Google, GitHub, etc.

#### New Features

- **Posts Management**: Prevent modification of scheduled posts
- **Search Functionality**: Implement search bar for posts
- **Post Creation Improvements**:
  - Image upload and management
  - Rich text editor with more formatting options
  - Post templates and reusable content blocks
- **Draft Management**: View unpublished posts and schedules
- **Autosave**: Implement automatic saving of post drafts
- **Daily Post Merging**: Merge multiple scheduled posts into single daily newsletter
- **Email Templates**: Rich HTML email templates with branding
- **Content Import/Export**: Import/export posts in various formats
- **Comment System**: Allow readers to comment on posts
- **Social Sharing**: Social media sharing integration

#### UI/UX Improvements

- **Design Overhaul**: Complete UI/UX redesign for better user experience
- **Responsive Design**: Enhanced mobile and tablet experience
- **Accessibility**: WCAG compliance and screen reader support
- **Internationalization**: Multi-language support
- **SEO**

## 🚀 Production Deployment

With Render (or similar):

- **Simple Setup**: Uses your existing Dockerfile with zero configuration
- **Managed Database**: Built-in PostgreSQL with automatic backups
- **Automatic Deployments**: Deploys on every git push or webhook trigger
- **SSL Included**: Automatic HTTPS certificates
- **Cost-Effective**: Cheap for starter plans
- **No Infrastructure Management**: Focus on code, not servers

### 1. Dockerfile Configuration

The application uses a **multi-stage Docker build** optimized for production:

- **Base Stage**: Installs pnpm and dependencies
- **Builder Stage**: Generates Prisma client and builds both client and server
- **Production Stage**: Creates a minimal production image with only necessary files

**Architecture:**

- **Development**: Two separate servers (Express API + React Router dev server)
- **Production**: Single Express server that serves everything:
  - API routes (`/api/*`)
  - Static assets (from built client)
  - React Router SSR (imports built server bundle)

### 2. Connect to Render

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository

2. **Create Web Service**
   - Choose "Web Service"
   - Select your repository
   - Render automatically detects your Dockerfile

3. **Add Database**
   - Create a new PostgreSQL database
   - Render provides the connection string

4. **Set Environment Variables**

### 3. Auto-Deploy Strategy

**Git Push Deployment:**

- **Manual**: Use git tags for production releases
- **Rollback**: Use Render dashboard to deploy any previous deployments

**Deployment Commands:**

```bash
git tag v1.0.0
git push origin v1.0.0
```

**Rollback Process:**

1. Go to Render dashboard
2. Click "Manual deploy" on any previous deployment

### 4. Monitoring & Alerting

#### **Essential Monitoring**

- **Health Checks**: `/api/health` endpoint monitoring
- **Database Monitoring**: Connection pool, query performance
- **Job Queue Monitoring**: PgBoss job status and failures
- **Application Metrics**: Response times, error rates

#### **Alerting Rules**

- Database connection failures
- High error rates (>5%)
- Job queue backlog (>100 pending jobs)
- Email delivery failures (>10% failure rate)
- Application downtime

### 5. Scaling Strategies

#### **Horizontal Scaling**

- **Application**: Stateless design allows easy horizontal scaling
- **Auto-scaling**: Scale down during low traffic periods
- **Database**: Read replicas for read-heavy workloads
- **Job Processing**: Scale PgBoss workers independently (implement batching)
- **CDN**: Global content delivery for static assets
