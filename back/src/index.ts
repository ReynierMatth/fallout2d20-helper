import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import itemsRouter from './routes/items';
import charactersRouter from './routes/characters';
import perksRouter from './routes/perks';
import equipmentPacksRouter from './routes/equipmentPacks';
import sessionsRouter from './routes/sessions';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/characters', charactersRouter);
app.use('/api/perks', perksRouter);
app.use('/api/equipment-packs', equipmentPacksRouter);
app.use('/api/sessions', sessionsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
