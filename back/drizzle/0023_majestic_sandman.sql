CREATE TYPE "public"."crafting_skill" AS ENUM('repair', 'science', 'survival', 'explosives');--> statement-breakpoint
CREATE TYPE "public"."recipe_rarity" AS ENUM('frequente', 'peu_frequente', 'rare');--> statement-breakpoint
CREATE TYPE "public"."workbench_type" AS ENUM('weapon', 'armor', 'chemistry', 'cooking', 'power_armor', 'robot');--> statement-breakpoint
CREATE TABLE "character_known_recipes" (
	"character_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	CONSTRAINT "character_known_recipes_character_id_recipe_id_pk" PRIMARY KEY("character_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_perk_requirements" (
	"id" serial PRIMARY KEY NOT NULL,
	"recipe_id" integer NOT NULL,
	"perk_id" varchar(100) NOT NULL,
	"min_rank" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_key" varchar(255),
	"workbench_type" "workbench_type" NOT NULL,
	"complexity" integer NOT NULL,
	"skill" "crafting_skill" NOT NULL,
	"rarity" "recipe_rarity" DEFAULT 'frequente' NOT NULL,
	"result_mod_id" integer,
	"result_item_id" integer,
	CONSTRAINT "recipes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "character_known_recipes" ADD CONSTRAINT "character_known_recipes_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_known_recipes" ADD CONSTRAINT "character_known_recipes_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_perk_requirements" ADD CONSTRAINT "recipe_perk_requirements_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_perk_requirements" ADD CONSTRAINT "recipe_perk_requirements_perk_id_perks_id_fk" FOREIGN KEY ("perk_id") REFERENCES "public"."perks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_result_mod_id_mods_id_fk" FOREIGN KEY ("result_mod_id") REFERENCES "public"."mods"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_result_item_id_items_id_fk" FOREIGN KEY ("result_item_id") REFERENCES "public"."items"("id") ON DELETE set null ON UPDATE no action;