CREATE TYPE "public"."power_armor_set" AS ENUM('frame', 'raiderPower', 't45', 't51', 't60', 'x01');--> statement-breakpoint
ALTER TYPE "public"."item_type" ADD VALUE 'powerArmor' BEFORE 'robotArmor';--> statement-breakpoint
CREATE TABLE "power_armors" (
	"item_id" integer PRIMARY KEY NOT NULL,
	"set" "power_armor_set" NOT NULL,
	"location" "body_location" NOT NULL,
	"dr_physical" integer NOT NULL,
	"dr_energy" integer NOT NULL,
	"dr_radiation" integer NOT NULL,
	"hp" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "power_armors" ADD CONSTRAINT "power_armors_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;