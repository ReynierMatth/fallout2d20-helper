-- 0014: Power armor mod support
-- Adds new applicable type, slots, and effect type for power armor mods

-- 1. Add powerArmor to mod_applicable_to enum
ALTER TYPE mod_applicable_to ADD VALUE IF NOT EXISTS 'powerArmor';--> statement-breakpoint

-- 2. Add power armor mod slots
ALTER TYPE mod_slot ADD VALUE IF NOT EXISTS 'amelioration';--> statement-breakpoint
ALTER TYPE mod_slot ADD VALUE IF NOT EXISTS 'systeme';--> statement-breakpoint
ALTER TYPE mod_slot ADD VALUE IF NOT EXISTS 'blindage';--> statement-breakpoint

-- 3. Add hpBonus effect type (for power armor piece HP)
ALTER TYPE mod_effect_type ADD VALUE IF NOT EXISTS 'hpBonus';
