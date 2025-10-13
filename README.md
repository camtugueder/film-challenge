# Movie Search + Favorites Application

A full-stack movie search application built with Next.js and NestJS, allowing users to search for movies using the OMDb API and manage their favorites.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Production Deployment Considerations](#production-deployment-considerations)
- [API Documentation](#api-documentation)

## Features

- ✅ **Search Movies**: Search for movies by title with pagination support
- ✅ **Manage Favorites**: Add and remove movies from your favorites list
- ✅ **Persistent Storage**: Favorites stored in SQLite with TypeORM migrations
- ✅ **Responsive Design**: Mobile-first, responsive UI built with Tailwind CSS
- ✅ **Optimistic Updates**: Instant UI feedback using TanStack Query
- ✅ **Smart Image Handling**: Fallback placeholders for broken or missing movie posters
- ✅ **Enhanced Search UX**: Clear button resets search state to initial view
- ✅ **Comprehensive Testing**: 70%+ test coverage with unit and integration tests
- ✅ **Type Safety**: Full TypeScript strict mode across frontend and backend
- ✅ **API Documentation**: Interactive Swagger/OpenAPI documentation
- ✅ **Error Monitoring**: Sentry integration for production error tracking
- ✅ **Production Ready**: Proper CORS, timeouts, retry logic, and migrations

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript with strict mode
- **TypeORM** - ORM with migrations for database management
- **SQLite** - Lightweight SQL database
- **Swagger** - OpenAPI documentation
- **Axios** - HTTP client for OMDb API
- **class-validator** - Request validation
- **Jest** - Testing framework

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript with strict mode
- **TanStack Query** - Data fetching and cache management
- **Sentry** - Error tracking and monitoring
- **Tailwind CSS** - Utility-first CSS framework
- **Next.js Image** - Optimized image loading
- **Axios** - HTTP client with timeout and retry
- **Jest + React Testing Library** - Testing framework

## Project Structure

```
film-challenge/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── common/dto/     # Data Transfer Objects
│   │   ├── favorites/      # Favorites module
│   │   │   ├── favorite.entity.ts
│   │   │   ├── favorites.service.ts
│   │   │   ├── favorites.controller.ts
│   │   │   └── *.spec.ts
│   │   ├── movies/         # Movies search module
│   │   │   ├── movies.controller.ts
│   │   │   └── *.spec.ts
│   │   ├── omdb/           # OMDb API integration
│   │   │   ├── omdb.service.ts
│   │   │   └── *.spec.ts
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # Application entry point
│   ├── test/               # E2E tests
│   ├── .env.example        # Environment variables template
│   └── package.json
│
└── frontend/               # Next.js frontend application
    ├── app/
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Search page (home)
    │   ├── favorites/      # Favorites page
    │   └── providers.tsx   # React Query provider
    ├── components/         # Reusable React components
    │   ├── MovieCard.tsx
    │   ├── SearchBar.tsx
    │   ├── Pagination.tsx
    │   ├── Navigation.tsx
    │   └── ...
    ├── lib/
    │   ├── api.ts          # API client
    │   ├── hooks.ts        # TanStack Query hooks
    │   └── types.ts        # TypeScript types
    ├── __tests__/          # Component tests
    ├── .env.local.example  # Environment variables template
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OMDb API Key (get one free at https://www.omdbapi.com/apikey.aspx)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (includes @nestjs/swagger for API documentation):
```bash
npm install
```
   **Note**: This step is required to install Swagger and other new dependencies.

3. Create `.env` file from the example:
```bash
cp .env.example .env
```

4. Add your OMDb API key to `.env`:
```
OMDB_API_KEY=your_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run start:dev
```

The backend will be running at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (includes @sentry/nextjs for error tracking):
```bash
npm install
```
   **Note**: This step is required to install Sentry and other new dependencies.

3. Create `.env.local` file from the example:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Add Sentry DSN for error tracking (only needed in production)
# NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

## Testing

### Backend Tests

Run all tests with coverage:
```bash
cd backend
npm test                  # Run all tests
npm run test:cov          # Run with coverage report
npm run test:watch        # Run in watch mode
npm run test:e2e          # Run E2E tests
```

**Test Coverage:** 70.86% (39 tests passing)
- ✅ OMDb Service: 96% coverage
- ✅ Favorites Service: 100% coverage
- ✅ All Controllers: 100% coverage

### Frontend Tests

Run all tests:
```bash
cd frontend
npm test                  # Run all tests
npm run test:watch        # Run in watch mode
npm run test:coverage     # Run with coverage report
```

**Test Coverage:** 15 tests passing
- ✅ MovieCard component tests
- ✅ SearchBar component tests with debouncing

### Test-Driven Development Approach

This project was built using TDD methodology:
1. **Write tests first** - All services and controllers have tests written before implementation
2. **Implement to pass tests** - Code was written to satisfy test requirements
3. **Refactor** - Code was refined while maintaining test coverage
4. **Continuous testing** - Tests run throughout development to catch regressions

## Architecture & Design Decisions

### Backend Architecture

**Clean Architecture Pattern:**
- **Controllers**: Handle HTTP requests/responses, validation
- **Services**: Contain business logic, reusable across controllers
- **DTOs**: Ensure type safety and validation for API contracts
- **Entities**: TypeORM entities representing database tables

**Key Decisions:**
1. **NestJS Framework**: Chosen for its enterprise-grade architecture, dependency injection, and TypeScript support
2. **TypeORM + SQLite**: Lightweight database solution perfect for the challenge requirements, easily upgradeable to PostgreSQL
3. **Validation Pipes**: Global validation using class-validator for robust input validation
4. **Module-based Structure**: Each feature (favorites, movies, omdb) is self-contained with its own module

### Frontend Architecture

**Component-Based Design:**
- **App Router**: Next.js 15 App Router for improved performance and DX
- **Client Components**: Interactive components use 'use client' directive
- **Separation of Concerns**: API logic, hooks, and UI components are separated

**Key Decisions:**
1. **TanStack Query**: Chosen for its powerful caching, optimistic updates, and automatic refetching
2. **Optimistic UI Updates**: Favorites update immediately in UI before server confirmation
3. **Debounced Search**: 300ms debounce on search input to reduce API calls
4. **Mobile-First Design**: Responsive grid layouts using Tailwind CSS
5. **Type Safety**: Shared TypeScript interfaces between API client and components

### State Management

**TanStack Query** handles all server state:
- **Queries**: Fetch and cache movie searches and favorites
- **Mutations**: Handle add/remove favorites with optimistic updates
- **Cache Invalidation**: Automatic refetching after mutations
- **Error Handling**: Built-in error states and retry logic

## Production Deployment Considerations

### Security

**Implemented:**
- ✅ **Rate Limiting**: `@nestjs/throttler` configured (100 req/min per IP)
- ✅ **CORS Configuration**: Origin restricted with explicit HTTP methods
- ✅ **Environment Validation**: API keys validated at startup
- ✅ **Input Validation**: `class-validator` with whitelist and transformation
- ✅ **TypeScript Strict Mode**: Full strict type checking enabled

**Additional Recommendations:**
- [ ] **Helmet.js**: Add security headers (CSP, XSS protection, etc.)
- [ ] **Environment Variables**: Use secret management (AWS Secrets Manager, Azure Key Vault)
- [ ] **HTTPS Only**: Enforce HTTPS in production
- [ ] **API Key Rotation**: Implement regular OMDb API key rotation

### Performance & Scalability

**Implemented:**
- ✅ **HTTP Timeouts**: 5s timeout for OMDb, 10s for frontend API
- ✅ **Retry Logic**: Exponential backoff with 3 retries on failures
- ✅ **Image Optimization**: Next.js Image component with responsive sizes
- ✅ **Query Caching**: TanStack Query with 1-minute stale time
- ✅ **Optimistic Updates**: Instant UI feedback for favorites

**Recommended Additions:**
- [ ] **Redis Caching**: Cache OMDb API responses to reduce external API calls
- [ ] **CDN**: Serve static assets via CDN (CloudFlare, AWS CloudFront)
- [ ] **Database**: Migrate to PostgreSQL with connection pooling for production
- [ ] **Load Balancing**: Use nginx or cloud load balancers for horizontal scaling

### Monitoring & Observability

**Implemented:**
- ✅ **Error Tracking**: Sentry integration for frontend error monitoring
- ✅ **Error Boundaries**: React error boundaries with Sentry reporting
- ✅ **API Error Logging**: All API errors captured and reported

**Recommended Additions:**
- [ ] **Backend Error Tracking**: Add Sentry to NestJS backend
- [ ] **Structured Logging**: Implement Winston or Pino with log aggregation
- [ ] **Health Checks**: Implement `/health` and `/metrics` endpoints
- [ ] **APM**: Application Performance Monitoring for bottleneck identification

### CI/CD Pipeline

**Recommended Setup:**
- [ ] **GitHub Actions** or GitLab CI for automated workflows
  - Run tests on every PR
  - Build and deploy on merge to main
  - Generate coverage reports
- [ ] **Automated Testing**: Require tests to pass before deployment
- [ ] **Code Quality**: Integrate ESLint, Prettier, SonarQube
- [ ] **Dependency Scanning**: Automated vulnerability scanning (Snyk, Dependabot)

### Database

**Implemented:**
- ✅ **TypeORM Migrations**: Schema changes managed through migrations
- ✅ **Migration Scripts**: `npm run migration:generate/run/revert` commands
- ✅ **Automatic Migrations**: Run on application startup

**Production Database Strategy:**
- [ ] **PostgreSQL**: Replace SQLite with PostgreSQL for production
- [ ] **Backups**: Automated daily backups with point-in-time recovery
- [ ] **Connection Pooling**: Configure appropriate pool size
- [ ] **Monitoring**: Track query performance and connection pool usage

### Infrastructure

**Containerization & Orchestration:**
- [ ] **Docker**: Containerize both frontend and backend
  - Multi-stage builds for optimized image size
  - Non-root user for security
- [ ] **Kubernetes**: For auto-scaling and high availability (if needed)
- [ ] **Environment Separation**: dev, staging, production environments

**Hosting Options:**
- **Frontend**: Vercel, Netlify, AWS Amplify (Next.js optimized)
- **Backend**: AWS ECS/Fargate, Google Cloud Run, Railway, Render
- **Database**: AWS RDS, Google Cloud SQL, Supabase

### Documentation

**Implemented:**
- ✅ **Swagger/OpenAPI**: Interactive API documentation at `/api`
- ✅ **API Decorators**: All endpoints documented with examples
- ✅ **DTO Documentation**: Complete request/response schemas

### Additional Production Features

**Nice-to-Have:**
- [ ] **User Authentication**: JWT-based auth if multi-user support needed
- [ ] **Request ID Tracking**: Add correlation IDs for request tracing
- [ ] **Feature Flags**: Use LaunchDarkly or similar for gradual rollouts
- [ ] **WebSockets**: Real-time updates for collaborative features
- [ ] **GraphQL**: Consider GraphQL for complex data fetching needs
- [ ] **Internationalization**: i18n support for multiple languages

## API Documentation

**Interactive Documentation**: Once the backend is running, visit `http://localhost:3001/api` for the full Swagger/OpenAPI documentation with interactive API testing.

### Backend Endpoints

#### Search Movies
```
GET /movies/search?query={query}&page={page}
```
- **Query Parameters**:
  - `query` (required): Movie title to search
  - `page` (optional): Page number for pagination (default: 1)
- **Response**:
```json
{
  "movies": [
    {
      "imdbID": "tt0372784",
      "title": "Batman Begins",
      "year": "2005",
      "poster": "https://..."
    }
  ],
  "totalResults": 100
}
```

#### Get All Favorites
```
GET /favorites
```
- **Response**: Array of favorite movies (with camelCase properties)

#### Add to Favorites
```
POST /favorites
Content-Type: application/json

{
  "imdbID": "tt0372784",
  "title": "Batman Begins",
  "year": "2005",
  "poster": "https://..."
}
```
- **Response**: Created favorite movie object

#### Remove from Favorites
```
DELETE /favorites/:imdbID
```
- **Response**: 204 No Content (idempotent - succeeds whether movie existed or not)

---

## Key Highlights

1. **Production-Ready Architecture**: Enterprise-grade code with proper error handling, monitoring, and documentation
2. **Test-Driven Development**: Comprehensive test suite with 70%+ coverage
3. **Modern Stack**: Latest versions of Next.js 15, NestJS, TanStack Query v5
4. **Type Safety**: Full TypeScript strict mode with definite assignment assertions
5. **Best Practices**: SOLID principles, Clean Architecture, separation of concerns
6. **API Documentation**: Interactive Swagger/OpenAPI docs for easy integration
7. **Error Monitoring**: Sentry integration for production error tracking
8. **Database Migrations**: TypeORM migrations for safe schema evolution

### Design Trade-offs

**Current Implementation:**
- **SQLite**: Perfect for development and single-server deployment; migrate to PostgreSQL for distributed systems
- **No Authentication**: Stateless API design; easily extensible with JWT or OAuth
- **Optimistic UI**: Instant feedback with automatic rollback on errors

### Future Enhancements

**High Priority - Production Scale:**
- **E2E Testing**: Full integration tests between frontend/backend and Playwright/Cypress for user flows
- **Redis Caching Layer**: Cache OMDb API responses to reduce costs and improve response times (10-100x faster)
- **Health Checks & Metrics**: `/health` and `/metrics` endpoints for production monitoring and alerting
- **Structured Logging**: Winston or Pino with JSON format for log aggregation (ELK stack, DataDog, etc.)
- **Request Correlation IDs**: Trace requests across services for easier debugging in distributed systems
- **Docker Compose**: Local development environment with all services (frontend, backend, PostgreSQL, Redis)
- **CI/CD Pipeline**: GitHub Actions for automated testing, building, and deployment on every PR/merge
- **Backend Error Monitoring**: Add Sentry to backend (currently only frontend has Sentry integration)

**Medium Priority - API Maturity:**
- **API Versioning**: URI-based versioning (`/v1/movies`) for backward-compatible API evolution
- **Pre-commit Hooks**: Husky + lint-staged for automated linting and testing before commits
- **Expanded Test Coverage**: Additional frontend component tests and integration tests for hooks

**Nice-to-Have - Feature Expansion:**
- User accounts and authentication (JWT/OAuth)
- Movie details page with ratings, reviews, and cast information
- Advanced search filters (year, genre, rating, runtime)
- Social sharing and collaborative favorites lists
- Movie recommendations based on favorites (ML integration)
- Real-time updates via WebSockets for collaborative features
- PWA support with offline capabilities

---

**Built with production-grade practices and modern best practices**
