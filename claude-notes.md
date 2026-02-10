# Claude Notes - vridge

## Deferred Decisions

### .env.example (to create alongside Prisma setup)

Required env vars:

- DATABASE_URL - Supabase PostgreSQL connection string (with pooler)
- DIRECT_URL - Supabase direct connection (for migrations)
- BETTER_AUTH_SECRET - secret for auth token signing
- BETTER_AUTH_URL - base URL of the app
- NEXT_PUBLIC_GA_MEASUREMENT_ID - GA4 measurement ID (G-XXXXXXXX)
- AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET (when S3 needed)

### Prisma Schema Setup

- Need to decide: Should Better-Auth tables live in schema.prisma (recommended) or be managed separately?
- Option B (in schema.prisma) is generally better - single source of truth
- Once decided: create prisma/schema.prisma with datasource (Supabase PostgreSQL), generator, Better-Auth tables, and initial app models
- Also need: .env.example documenting DATABASE_URL, DIRECT_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, etc.

### Better-Auth Config

- After schema is decided: create auth config file + route handler (app/api/auth/[...all]/route.ts)
