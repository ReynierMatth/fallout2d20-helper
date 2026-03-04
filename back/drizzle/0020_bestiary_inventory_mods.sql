CREATE TABLE IF NOT EXISTS "bestiary_inventory_mods" (
	"id" serial PRIMARY KEY NOT NULL,
	"bestiary_inventory_id" integer NOT NULL,
	"mod_item_id" integer NOT NULL
);

ALTER TABLE "bestiary_inventory_mods" ADD CONSTRAINT "bestiary_inventory_mods_bestiary_inventory_id_bestiary_inventory_id_fk" FOREIGN KEY ("bestiary_inventory_id") REFERENCES "public"."bestiary_inventory"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "bestiary_inventory_mods" ADD CONSTRAINT "bestiary_inventory_mods_mod_item_id_items_id_fk" FOREIGN KEY ("mod_item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
