ALTER TABLE "characters" ADD COLUMN "creature_attacks" jsonb;

-- Backfill existing creatures from bestiary data
UPDATE "characters" c
SET "creature_attacks" = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', COALESCE(i.name, ba.name_key),
      'nameKey', COALESCE(i.name_key, ba.name_key),
      'skill', ba.skill,
      'damage', ba.damage,
      'damageType', ba.damage_type,
      'damageBonus', ba.damage_bonus,
      'fireRate', ba.fire_rate,
      'range', ba.range,
      'qualities', COALESCE(
        (SELECT jsonb_agg(jsonb_build_object('quality', baq.quality, 'value', baq.value))
         FROM bestiary_attack_qualities baq WHERE baq.attack_id = ba.id),
        '[]'::jsonb
      )
    )
  )
  FROM bestiary_attacks ba
  LEFT JOIN items i ON ba.item_id = i.id
  WHERE ba.bestiary_entry_id = c.bestiary_entry_id
)
WHERE c.stat_block_type = 'creature' AND c.bestiary_entry_id IS NOT NULL;
