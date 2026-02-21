#!/bin/sh
set -e

cd /app/back

# Wait for postgres to be ready
echo "Waiting for PostgreSQL..."
until node -e "
  import('postgres').then(m => {
    const sql = m.default(process.env.DATABASE_URL);
    sql\`SELECT 1\`.then(() => { sql.end(); process.exit(0); }).catch(() => process.exit(1));
  });
" 2>/dev/null; do
  sleep 1
done
echo "PostgreSQL is ready."

# Run migrations
echo "Running migrations..."
npx drizzle-kit migrate 2>&1 || echo "Migration warning (may already be applied)"

# Always run seed (idempotent upserts — safe to run on existing data)
echo "Running seed..."
npx tsx src/db/seed/index.ts || echo "WARNING: Seed failed, you may need to seed manually"

# Start nginx in background
echo "Starting nginx..."
nginx

# Start backend with tsx (handles TypeScript directly)
echo "Starting backend on port ${PORT:-3001}..."
exec npx tsx src/index.ts
