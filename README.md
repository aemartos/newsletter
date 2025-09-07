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
- **Vite** for fast development and building

#### Server (`/server`)
- **Express.js** REST API
- **Prisma ORM** for database operations and migrations
- **SendGrid** for email notifications
- **TypeScript** for type safety
- **PostgreSQL** database with connection pooling

```
newsletter/
├── client/                    # React Router SSR client
│   ├── app/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Alert/         # Alert notifications
│   │   │   ├── Button/        # Button component
│   │   │   ├── Card/          # Post card component
│   │   │   ├── Header/        # Page header
│   │   │   ├── Input/         # Form inputs
│   │   │   ├── Layout/        # Layout wrapper
│   │   │   ├── Menu/          # Navigation menu
│   │   │   ├── Spinner/       # Loading spinner
│   │   │   └── TextEditor/    # TipTap rich text editor
│   │   ├── config/            # App configuration
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and API client
│   │   ├── routes/            # Route components
│   │   │   ├── index.tsx      # Home page with infinite scroll
│   │   │   ├── new-post.tsx   # Post creation form
│   │   │   ├── post.$slug.tsx # Individual post view
│   │   │   └── subscribe.tsx  # Newsletter subscription
│   │   ├── utils/             # Helper functions
│   │   ├── root.tsx           # Root layout component
│   │   └── root.css           # Global styles
│   ├── public/                # Static assets
│   │   ├── favicon/           # Favicon files
│   │   └── images/            # Image assets
│   ├── react-router.config.ts # React Router configuration
│   ├── vite.config.ts         # Vite build configuration
│   └── package.json
├── server/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Server configuration
│   │   ├── providers/         # External service providers (SendGrid)
│   │   ├── routes/            # API route handlers
│   │   │   ├── posts.ts       # Post CRUD operations
│   │   │   └── subscribers.ts # Subscriber management
│   │   └── index.ts           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── prisma.ts          # Prisma client setup
│   │   └── seed.ts            # Database seeding
│   └── package.json
├── Dockerfile                 # Multi-stage Docker build
├── ecosystem.config.js        # PM2 configuration for development
├── pnpm-workspace.yaml        # PNPM workspace configuration
└── package.json               # Root package.json with workspace scripts
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
   # Copy the example environment file
   cp server/.env.example server/.env
   
   # Edit the environment file with your database credentials
   nano server/.env
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   cd server && pnpm db:generate
   
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

### PM2 Commands
```bash
# View logs
pnpm logs

# Stop all processes
pnpm stop all

# Restart all processes
pnpm restart

# Delete all processes
pnpm delete
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

### Subscribers
- `POST /api/subscribers` - Create a new user (subscribe)

### Posts
- `GET /api/posts` - Get posts by filter (paginated)
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/posts` - Create post (w/ ability to schedule)

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

### Code Formatting
```bash
# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Router](https://reactrouter.com/) for the SSR framework
- [Prisma](https://www.prisma.io/) for the database ORM
- [Express.js](https://expressjs.com/) for the backend framework

## [TODO] Rationale
- What were some of the reasons you chose the technology stack that you did?
- What were some of the trade-offs you made when building this application. Why were these acceptable trade-offs?
- Given more time, what improvements or optimizations would you want to add? When would you add them?
- How would you deploy the application in a production-ready way?