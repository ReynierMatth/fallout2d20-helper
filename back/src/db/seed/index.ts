import 'dotenv/config';
import { seedAllItems } from './seedItems';
import { seedAllPerks } from './seedPerks';
import { seedAllOrigins } from './seedOrigins';
import { seedAllEquipmentPacks } from './seedEquipmentPacks';

async function seed() {
  console.log('Starting database seed...\n');

  try {
    // Seed in order of dependencies
    // 1. Origins first (no dependencies)
    await seedAllOrigins();
    console.log('');

    // 2. Perks (no dependencies)
    await seedAllPerks();
    console.log('');

    // 3. Items (no dependencies, but creates itemIdMap)
    await seedAllItems();
    console.log('');

    // 4. Equipment packs (depends on items - uses itemId lookups)
    await seedAllEquipmentPacks();
    console.log('');

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
