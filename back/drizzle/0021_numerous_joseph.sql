ALTER TABLE "session_participants" DROP CONSTRAINT "session_participants_character_id_characters_id_fk";
--> statement-breakpoint
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;
