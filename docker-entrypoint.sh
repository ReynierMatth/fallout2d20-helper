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

# Seed if database is empty (check if items table exists and has rows)
ITEM_COUNT=$(node -e "
  import('postgres').then(m => {
    const sql = m.default(process.env.DATABASE_URL);
    sql\`SELECT count(*)::int as c FROM items\`.then(r => { console.log(r[0].c); sql.end(); }).catch(() => { console.log('0'); sql.end(); });
  });
" 2>/dev/null || echo "0")

if [ "$ITEM_COUNT" = "0" ]; then
  echo "Database is empty, seeding..."
  npx tsx src/db/seed/index.ts || echo "WARNING: Seed failed, you may need to seed manually"
else
  echo "Database already has data ($ITEM_COUNT items), skipping seed."
fi

# Start nginx in background
echo "Starting nginx..."
nginx

# Start backend with tsx (handles TypeScript directly)
echo "Starting backend on port ${PORT:-3001}..."
exec npx tsx src/index.ts
