-- Add 'mod' to item_type enum
ALTER TYPE "public"."item_type" ADD VALUE IF NOT EXISTS 'mod';--> statement-breakpoint

-- New enums for mods
CREATE TYPE "public"."mod_slot" AS ENUM('culasse', 'canon', 'chargeur', 'poignee', 'crosse', 'viseur', 'bouche', 'condensateur', 'material', 'functionality', 'improvement', 'modification', 'internal');--> statement-breakpoint
CREATE TYPE "public"."mod_applicable_to" AS ENUM('smallGuns', 'energyWeapons', 'bigGuns', 'meleeWeapons', 'unarmed', 'armor', 'clothing', 'robot');--> statement-breakpoint
CREATE TYPE "public"."mod_effect_type" AS ENUM('damageBonus', 'fireRateBonus', 'rangeChange', 'gainQuality', 'loseQuality', 'setDamage', 'setAmmo', 'setFireRate', 'special');--> statement-breakpoint

-- Mods table
CREATE TABLE "mods" (
  "id" serial PRIMARY KEY,
  "item_id" integer NOT NULL UNIQUE REFERENCES "items"("id") ON DELETE CASCADE,
  "slot" "public"."mod_slot" NOT NULL,
  "applicable_to" "public"."mod_applicable_to" NOT NULL,
  "name_add_key" varchar(100),
  "required_perk" varchar(50),
  "required_perk_rank" integer,
  "weight_change" real NOT NULL DEFAULT 0
);--> statement-breakpoint

-- Mod effects table
CREATE TABLE "mod_effects" (
  "id" serial PRIMARY KEY,
  "mod_id" integer NOT NULL REFERENCES "mods"("id") ON DELETE CASCADE,
  "effect_type" "public"."mod_effect_type" NOT NULL,
  "numeric_value" integer,
  "quality_name" "public"."weapon_quality",
  "quality_value" integer,
  "ammo_type" "public"."ammo_type",
  "description_key" varchar(100)
);--> statement-breakpoint

-- Weapon compatible mods table (specific mod-weapon pairs)
CREATE TABLE "weapon_compatible_mods" (
  "id" serial PRIMARY KEY,
  "weapon_item_id" integer NOT NULL REFERENCES "items"("id") ON DELETE CASCADE,
  "mod_item_id" integer NOT NULL REFERENCES "items"("id") ON DELETE CASCADE,
  UNIQUE ("weapon_item_id", "mod_item_id")
);--> statement-breakpoint

-- Installed mods on inventory items
CREATE TABLE "inventory_item_mods" (
  "id" serial PRIMARY KEY,
  "target_inventory_id" integer NOT NULL REFERENCES "character_inventory"("id") ON DELETE CASCADE,
  "mod_inventory_id" integer NOT NULL REFERENCES "character_inventory"("id") ON DELETE CASCADE
);
