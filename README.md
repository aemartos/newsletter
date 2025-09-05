# Newsletter App

A full-stack newsletter application built with React Router SSR, TypeScript, Express, and PostgreSQL.

## 🏗️ Architecture

### 📁 Project Structure

#### Client (`/client`)
- **React Router v7** with SSR
- **TypeScript** for type safety

#### Server (`/server`)
- **Express.js** REST API
- **Prisma ORM** for database operations
- **TypeScript** for type safety

```
newsletter/
├── client/                # React Router SSR client
│   ├── app/
│   │   ├── routes/        # Route components
│   │   ├── root.tsx       # Root layout
│   │   └── root.css       # Global styles
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Express.js API server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── lib/           # Utilities
│   │   ├── types/         # TypeScript types
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── prisma.ts         # Prisma client setup
│   │   └── seed.ts           # Database seeding
│   └── package.json
├── ecosystem.config.js    # PM2 configuration (development)
└── package.json           # Root package.json
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **PostgreSQL** (v12 or higher)
- **PM2** (installed globally)

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
- **Users**: Newsletter subscribers
- **Posts**: Blog posts and content

## 🔧 API Endpoints

### Subscribers
- `POST /api/subscribers` - Create a new user (subscribe)

### Posts
- `GET /api/posts` - Get published posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post

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

## 🚀 Deployment

### Production Deployment (Render.com)
**Deploy by pushing a tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
The GitHub Action will automatically trigger a deployment to Render.com.

### Local Docker Build & Run

1. **Build the Docker image**:
   ```bash
   docker build -t newsletter-app .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-postgresql-connection-string" \
     -e NODE_ENV=production \
     newsletter-app
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

### Manual Database Setup

Before running the application, ensure your database is set up:

```bash
# Connect to your database and run:
pnpm db:push    # Apply schema migrations
pnpm db:seed    # Optional: populate with sample data
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Router](https://reactrouter.com/) for the SSR framework
- [Prisma](https://www.prisma.io/) for the database ORM
- [Express.js](https://expressjs.com/) for the backend framework