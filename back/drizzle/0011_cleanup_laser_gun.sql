-- Remove old 'Laser Gun' item (renamed to 'Laser Pistol' in seed)
-- ON DELETE CASCADE handles dependent rows in weapons, weapon_qualities, etc.
DELETE FROM "items" WHERE "name" = 'Laser Gun' AND "item_type" = 'weapon';
