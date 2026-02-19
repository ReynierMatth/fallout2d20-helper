ALTER TYPE "public"."item_type" ADD VALUE 'magazine';--> statement-breakpoint
CREATE TABLE "diseases" (
	"id" serial PRIMARY KEY NOT NULL,
	"d20_roll" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"name_key" varchar(100),
	"effect_key" varchar(100) NOT NULL,
	"duration" integer NOT NULL,
	CONSTRAINT "diseases_d20_roll_unique" UNIQUE("d20_roll"),
	CONSTRAINT "diseases_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "magazine_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"magazine_id" integer NOT NULL,
	"d20_min" integer NOT NULL,
	"d20_max" integer NOT NULL,
	"issue_name" varchar(200) NOT NULL,
	"issue_name_key" varchar(200),
	"effect_description_key" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "magazines" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"perk_description_key" varchar(200) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clothing" ADD COLUMN "effect" jsonb;--> statement-breakpoint
ALTER TABLE "magazine_issues" ADD CONSTRAINT "magazine_issues_magazine_id_items_id_fk" FOREIGN KEY ("magazine_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "magazines" ADD CONSTRAINT "magazines_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;