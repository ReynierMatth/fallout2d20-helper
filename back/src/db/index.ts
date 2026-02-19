import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

const connectionString = process.env.DATABASE_URL || 'postgresql://fallout:fallout2d20@localhost:5432/fallout2d20';

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export type Database = typeof db;
