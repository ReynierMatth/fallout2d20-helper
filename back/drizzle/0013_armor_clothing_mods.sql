-- 0013: Armor & clothing mods support
-- Adds new mod slots, effect types, perk2 columns, and renames weapon_compatible_mods table

-- 1. Add missing mod_slot values (big guns + melee from previous feature work)
ALTER TYPE mod_slot ADD VALUE IF NOT EXISTS 'carburant';--> statement-breakpoint
ALTER TYPE mod_slot ADD VALUE IF NOT EXISTS 'reservoir';--> statement-breakpoint
ALTER TYPE mod_slot ADD VALUE IF NOT EXISTS 'buse';--> statement-breakpoint
ALTER TYPE mod_slot ADD VALUE IF NOT EXISTS 'lame';--> statement-breakpoint

-- 2. Add armor-specific mod_effect_type values
ALTER TYPE mod_effect_type ADD VALUE IF NOT EXISTS 'ballisticResistance';--> statement-breakpoint
ALTER TYPE mod_effect_type ADD VALUE IF NOT EXISTS 'energyResistance';--> statement-breakpoint
ALTER TYPE mod_effect_type ADD VALUE IF NOT EXISTS 'radiationResistance';--> statement-breakpoint
ALTER TYPE mod_effect_type ADD VALUE IF NOT EXISTS 'carryCapacity';--> statement-breakpoint

-- 3. Add secondary perk requirement columns to mods table
ALTER TABLE "mods" ADD COLUMN "required_perk_2" varchar(50);--> statement-breakpoint
ALTER TABLE "mods" ADD COLUMN "required_perk_rank_2" integer;--> statement-breakpoint

-- 4. Rename weapon_compatible_mods → item_compatible_mods
ALTER TABLE "weapon_compatible_mods" RENAME TO "item_compatible_mods";--> statement-breakpoint

-- 5. Rename weapon_item_id → target_item_id
ALTER TABLE "item_compatible_mods" RENAME COLUMN "weapon_item_id" TO "target_item_id";
