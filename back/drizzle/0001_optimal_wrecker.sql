CREATE TABLE "personal_trinkets" (
	"id" serial PRIMARY KEY NOT NULL,
	"roll" integer NOT NULL,
	"name_key" varchar(100) NOT NULL,
	"effect" text,
	CONSTRAINT "personal_trinkets_roll_unique" UNIQUE("roll")
);
--> statement-breakpoint
ALTER TABLE "chems" RENAME COLUMN "effect" TO "effect_key";--> statement-breakpoint
ALTER TABLE "food" RENAME COLUMN "effect" TO "effect_key";--> statement-breakpoint
ALTER TABLE "syringer_ammo" ALTER COLUMN "effect_key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "general_goods" DROP COLUMN "effect";--> statement-breakpoint
ALTER TABLE "syringer_ammo" DROP COLUMN "effect";