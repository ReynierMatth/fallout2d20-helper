CREATE TYPE "public"."ammo_type" AS ENUM('10mm', '.308', '.38', '.44', '.45', '.50', '5mm', '5.56mm', '2mmEC', 'shotgunShell', 'fusionCell', 'plasmaCartridge', 'flamerFuel', 'fusionCore', 'gammaRound', 'missile', 'miniNuke', 'railwaySpike', 'syringerAmmo', 'flare', 'cannonball', 'none');--> statement-breakpoint
CREATE TYPE "public"."armor_type" AS ENUM('armor', 'powerArmor');--> statement-breakpoint
CREATE TYPE "public"."body_location" AS ENUM('head', 'torso', 'armLeft', 'armRight', 'legLeft', 'legRight', 'all');--> statement-breakpoint
CREATE TYPE "public"."character_type" AS ENUM('pc', 'npc');--> statement-breakpoint
CREATE TYPE "public"."chem_duration" AS ENUM('instant', 'brief', 'lasting');--> statement-breakpoint
CREATE TYPE "public"."combatant_status" AS ENUM('active', 'unconscious', 'dead', 'fled');--> statement-breakpoint
CREATE TYPE "public"."condition_type" AS ENUM('stunned', 'prone', 'blinded', 'deafened', 'poisoned', 'irradiated', 'fatigued', 'crippled', 'addicted', 'unconscious');--> statement-breakpoint
CREATE TYPE "public"."damage_type" AS ENUM('physical', 'energy', 'radiation', 'poison');--> statement-breakpoint
CREATE TYPE "public"."equipment_category" AS ENUM('weapon', 'armor', 'clothing', 'ammo', 'chem', 'food', 'misc', 'caps');--> statement-breakpoint
CREATE TYPE "public"."food_type" AS ENUM('food', 'drink');--> statement-breakpoint
CREATE TYPE "public"."general_good_type" AS ENUM('Tool/Utility', 'Materials');--> statement-breakpoint
CREATE TYPE "public"."item_type" AS ENUM('weapon', 'armor', 'robotArmor', 'clothing', 'ammunition', 'syringerAmmo', 'chem', 'food', 'generalGood', 'oddity');--> statement-breakpoint
CREATE TYPE "public"."location_choice" AS ENUM('left', 'right', 'choice');--> statement-breakpoint
CREATE TYPE "public"."origin_id" AS ENUM('brotherhood', 'ghoul', 'superMutant', 'misterHandy', 'survivor', 'vaultDweller');--> statement-breakpoint
CREATE TYPE "public"."robot_location" AS ENUM('all', 'optic', 'body', 'arm', 'thruster');--> statement-breakpoint
CREATE TYPE "public"."skill_name" AS ENUM('athletics', 'barter', 'bigGuns', 'energyWeapons', 'explosives', 'lockpick', 'medicine', 'meleeWeapons', 'pilot', 'repair', 'science', 'smallGuns', 'sneak', 'speech', 'survival', 'throwing', 'unarmed');--> statement-breakpoint
CREATE TYPE "public"."special_attribute" AS ENUM('strength', 'perception', 'endurance', 'charisma', 'intelligence', 'agility', 'luck');--> statement-breakpoint
CREATE TYPE "public"."survivor_trait_id" AS ENUM('gifted', 'educated', 'smallFrame', 'heavyHanded', 'fastShot');--> statement-breakpoint
CREATE TYPE "public"."weapon_quality" AS ENUM('accurate', 'blast', 'breaking', 'burst', 'closeQuarters', 'concealed', 'debilitating', 'freezing', 'gatling', 'inaccurate', 'mine', 'nightVision', 'parry', 'persistent', 'piercing', 'radioactive', 'reliable', 'recon', 'spread', 'stun', 'suppressed', 'thrown', 'twoHanded', 'unreliable', 'vicious', 'silent');--> statement-breakpoint
CREATE TYPE "public"."weapon_range" AS ENUM('close', 'medium', 'long', 'extreme');--> statement-breakpoint
CREATE TYPE "public"."weapon_skill" AS ENUM('smallGuns', 'bigGuns', 'energyWeapons', 'meleeWeapons', 'unarmed', 'throwing', 'explosives');--> statement-breakpoint
CREATE TABLE "ammunition" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"flat_amount" integer NOT NULL,
	"random_amount" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "armors" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"location" "body_location" NOT NULL,
	"dr_physical" integer NOT NULL,
	"dr_energy" integer NOT NULL,
	"dr_radiation" integer NOT NULL,
	"dr_poison" integer,
	"type" "armor_type" NOT NULL,
	"set" varchar(50),
	"hp" integer
);
--> statement-breakpoint
CREATE TABLE "chems" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"duration" "chem_duration" NOT NULL,
	"addictive" boolean NOT NULL,
	"addiction_level" integer,
	"effect" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clothing" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"dr_physical" integer DEFAULT 0,
	"dr_energy" integer DEFAULT 0,
	"dr_radiation" integer DEFAULT 0,
	"dr_poison" integer
);
--> statement-breakpoint
CREATE TABLE "clothing_effects" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"effect_type" varchar(20) NOT NULL,
	"target" varchar(50),
	"value" varchar(50),
	"description_key" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clothing_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"location" "body_location" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"food_type" "food_type" NOT NULL,
	"hp_healed" integer NOT NULL,
	"irradiated" boolean NOT NULL,
	"effect" text
);
--> statement-breakpoint
CREATE TABLE "general_goods" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"good_type" "general_good_type" NOT NULL,
	"effect" text,
	"effect_key" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_type" "item_type" NOT NULL,
	"name" varchar(100) NOT NULL,
	"name_key" varchar(100),
	"value" integer NOT NULL,
	"rarity" integer DEFAULT 0 NOT NULL,
	"weight" real DEFAULT 0 NOT NULL,
	CONSTRAINT "items_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "oddities" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"good_type" "general_good_type" NOT NULL,
	"effect" text
);
--> statement-breakpoint
CREATE TABLE "robot_armors" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"dr_physical" integer NOT NULL,
	"dr_energy" integer NOT NULL,
	"is_bonus" boolean DEFAULT false NOT NULL,
	"location" "robot_location" NOT NULL,
	"carry_modifier" real,
	"perk_required" varchar(50),
	"special_effect_key" varchar(100),
	"special_effect_description" text
);
--> statement-breakpoint
CREATE TABLE "syringer_ammo" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"effect" text NOT NULL,
	"effect_key" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "weapon_qualities" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"quality" "weapon_quality" NOT NULL,
	"value" integer
);
--> statement-breakpoint
CREATE TABLE "weapons" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"skill" "weapon_skill" NOT NULL,
	"damage" integer NOT NULL,
	"damage_type" "damage_type" NOT NULL,
	"damage_bonus" integer,
	"fire_rate" integer NOT NULL,
	"range" "weapon_range" NOT NULL,
	"ammo" "ammo_type" NOT NULL,
	"ammo_per_shot" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "character_conditions" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"condition" "condition_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_exercise_bonuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"attribute" "special_attribute" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_gifted_bonuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"attribute" "special_attribute" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"equipped" boolean DEFAULT false NOT NULL,
	"equipped_location" "body_location"
);
--> statement-breakpoint
CREATE TABLE "character_perks" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"perk_id" varchar(50) NOT NULL,
	"rank" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"skill" "skill_name" NOT NULL,
	"rank" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_special" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"attribute" "special_attribute" NOT NULL,
	"value" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_survivor_traits" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"trait_id" "survivor_trait_id" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_tag_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"character_id" integer NOT NULL,
	"skill" "skill_name" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" character_type NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"origin_id" "origin_id",
	"max_hp" integer NOT NULL,
	"current_hp" integer NOT NULL,
	"defense" integer NOT NULL,
	"initiative" integer NOT NULL,
	"melee_damage_bonus" integer DEFAULT 0 NOT NULL,
	"carry_capacity" integer NOT NULL,
	"max_luck_points" integer NOT NULL,
	"current_luck_points" integer NOT NULL,
	"caps" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "origin_bonus_tag_skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin_id" "origin_id" NOT NULL,
	"skill" "skill_name" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "origin_special_max_overrides" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin_id" "origin_id" NOT NULL,
	"attribute" "special_attribute" NOT NULL,
	"max_value" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "origin_special_modifiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin_id" "origin_id" NOT NULL,
	"attribute" "special_attribute" NOT NULL,
	"modifier" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "origins" (
	"id" "origin_id" PRIMARY KEY NOT NULL,
	"name_key" varchar(100) NOT NULL,
	"description_key" varchar(100) NOT NULL,
	"trait_name_key" varchar(100) NOT NULL,
	"trait_description_key" varchar(100) NOT NULL,
	"skill_max_override" integer,
	"is_robot" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "survivor_traits" (
	"id" "survivor_trait_id" PRIMARY KEY NOT NULL,
	"name_key" varchar(100) NOT NULL,
	"benefit_key" varchar(100) NOT NULL,
	"drawback_key" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perk_excluded_perks" (
	"id" serial PRIMARY KEY NOT NULL,
	"perk_id" varchar(50) NOT NULL,
	"excluded_perk_id" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perk_rank_effects" (
	"id" serial PRIMARY KEY NOT NULL,
	"perk_id" varchar(50) NOT NULL,
	"rank" integer NOT NULL,
	"effect_key" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perk_required_perks" (
	"id" serial PRIMARY KEY NOT NULL,
	"perk_id" varchar(50) NOT NULL,
	"required_perk_id" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perk_skill_prerequisites" (
	"id" serial PRIMARY KEY NOT NULL,
	"perk_id" varchar(50) NOT NULL,
	"skill" "skill_name" NOT NULL,
	"min_rank" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perk_special_prerequisites" (
	"id" serial PRIMARY KEY NOT NULL,
	"perk_id" varchar(50) NOT NULL,
	"attribute" "special_attribute" NOT NULL,
	"min_value" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perks" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name_key" varchar(100) NOT NULL,
	"effect_key" varchar(100) NOT NULL,
	"max_ranks" integer DEFAULT 1 NOT NULL,
	"level_required" integer,
	"level_increase_per_rank" integer,
	"not_for_robots" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "equipment_pack_choice_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_item_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer DEFAULT 1,
	"quantity_cd" integer,
	"location" "location_choice"
);
--> statement-breakpoint
CREATE TABLE "equipment_pack_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"pack_id" varchar(50) NOT NULL,
	"sort_order" integer DEFAULT 0,
	"item_id" integer,
	"quantity" integer DEFAULT 1,
	"quantity_cd" integer,
	"location" "location_choice",
	"is_choice_group" boolean DEFAULT false,
	"choice_count" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "equipment_packs" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name_key" varchar(100) NOT NULL,
	"description_key" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level_bonus_caps" (
	"id" serial PRIMARY KEY NOT NULL,
	"min_level" integer NOT NULL,
	"max_level" integer NOT NULL,
	"base_caps" integer NOT NULL,
	"bonus_caps_cd" integer NOT NULL,
	"max_rarity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "origin_equipment_packs" (
	"id" serial PRIMARY KEY NOT NULL,
	"origin_id" "origin_id" NOT NULL,
	"pack_id" varchar(50) NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "robot_arm_attachments" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name_key" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag_skill_bonus_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"skill" "skill_name" NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer DEFAULT 1,
	"quantity_cd" integer
);
--> statement-breakpoint
ALTER TABLE "ammunition" ADD CONSTRAINT "ammunition_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armors" ADD CONSTRAINT "armors_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chems" ADD CONSTRAINT "chems_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothing" ADD CONSTRAINT "clothing_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothing_effects" ADD CONSTRAINT "clothing_effects_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothing_locations" ADD CONSTRAINT "clothing_locations_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food" ADD CONSTRAINT "food_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_goods" ADD CONSTRAINT "general_goods_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oddities" ADD CONSTRAINT "oddities_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "robot_armors" ADD CONSTRAINT "robot_armors_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syringer_ammo" ADD CONSTRAINT "syringer_ammo_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_qualities" ADD CONSTRAINT "weapon_qualities_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapons" ADD CONSTRAINT "weapons_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_conditions" ADD CONSTRAINT "character_conditions_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_exercise_bonuses" ADD CONSTRAINT "character_exercise_bonuses_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_gifted_bonuses" ADD CONSTRAINT "character_gifted_bonuses_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_inventory" ADD CONSTRAINT "character_inventory_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_inventory" ADD CONSTRAINT "character_inventory_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_perks" ADD CONSTRAINT "character_perks_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_skills" ADD CONSTRAINT "character_skills_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_special" ADD CONSTRAINT "character_special_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_survivor_traits" ADD CONSTRAINT "character_survivor_traits_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_tag_skills" ADD CONSTRAINT "character_tag_skills_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "origin_bonus_tag_skills" ADD CONSTRAINT "origin_bonus_tag_skills_origin_id_origins_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."origins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "origin_special_max_overrides" ADD CONSTRAINT "origin_special_max_overrides_origin_id_origins_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."origins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "origin_special_modifiers" ADD CONSTRAINT "origin_special_modifiers_origin_id_origins_id_fk" FOREIGN KEY ("origin_id") REFERENCES "public"."origins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perk_excluded_perks" ADD CONSTRAINT "perk_excluded_perks_perk_id_perks_id_fk" FOREIGN KEY ("perk_id") REFERENCES "public"."perks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perk_rank_effects" ADD CONSTRAINT "perk_rank_effects_perk_id_perks_id_fk" FOREIGN KEY ("perk_id") REFERENCES "public"."perks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perk_required_perks" ADD CONSTRAINT "perk_required_perks_perk_id_perks_id_fk" FOREIGN KEY ("perk_id") REFERENCES "public"."perks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perk_skill_prerequisites" ADD CONSTRAINT "perk_skill_prerequisites_perk_id_perks_id_fk" FOREIGN KEY ("perk_id") REFERENCES "public"."perks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perk_special_prerequisites" ADD CONSTRAINT "perk_special_prerequisites_perk_id_perks_id_fk" FOREIGN KEY ("perk_id") REFERENCES "public"."perks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_pack_choice_options" ADD CONSTRAINT "equipment_pack_choice_options_parent_item_id_equipment_pack_items_id_fk" FOREIGN KEY ("parent_item_id") REFERENCES "public"."equipment_pack_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_pack_choice_options" ADD CONSTRAINT "equipment_pack_choice_options_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_pack_items" ADD CONSTRAINT "equipment_pack_items_pack_id_equipment_packs_id_fk" FOREIGN KEY ("pack_id") REFERENCES "public"."equipment_packs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_pack_items" ADD CONSTRAINT "equipment_pack_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "origin_equipment_packs" ADD CONSTRAINT "origin_equipment_packs_pack_id_equipment_packs_id_fk" FOREIGN KEY ("pack_id") REFERENCES "public"."equipment_packs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_skill_bonus_items" ADD CONSTRAINT "tag_skill_bonus_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;