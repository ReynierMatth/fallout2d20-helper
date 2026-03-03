ALTER TABLE "characters" ADD COLUMN "creature_attributes" jsonb;
ALTER TABLE "characters" ADD COLUMN "creature_skills" jsonb;

-- Backfill existing creatures from bestiary data
UPDATE "characters" c
SET "creature_attributes" = (
  SELECT jsonb_object_agg(ba.attribute, ba.value)
  FROM "bestiary_attributes" ba
  WHERE ba.bestiary_entry_id = c.bestiary_entry_id
)
WHERE c.stat_block_type = 'creature' AND c.bestiary_entry_id IS NOT NULL;

UPDATE "characters" c
SET "creature_skills" = (
  SELECT jsonb_object_agg(bs.skill, bs.rank)
  FROM "bestiary_skills" bs
  WHERE bs.bestiary_entry_id = c.bestiary_entry_id
)
WHERE c.stat_block_type = 'creature' AND c.bestiary_entry_id IS NOT NULL;
