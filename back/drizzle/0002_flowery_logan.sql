CREATE TYPE "public"."session_status" AS ENUM('active', 'paused', 'completed');--> statement-breakpoint
CREATE TABLE "session_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"character_id" integer NOT NULL,
	"turn_order" integer,
	"combat_status" "combatant_status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"status" "session_status" DEFAULT 'active' NOT NULL,
	"group_ap" integer DEFAULT 0 NOT NULL,
	"max_group_ap" integer DEFAULT 6 NOT NULL,
	"gm_ap" integer DEFAULT 0 NOT NULL,
	"combat_active" boolean DEFAULT false NOT NULL,
	"current_round" integer DEFAULT 0 NOT NULL,
	"current_turn_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "character_inventory" ADD COLUMN "current_hp" integer;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "radiation_damage" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;