-- Add unique constraint on mods.item_id (needed for upsert in seed)
ALTER TABLE "mods" ADD CONSTRAINT "mods_item_id_unique" UNIQUE ("item_id");
