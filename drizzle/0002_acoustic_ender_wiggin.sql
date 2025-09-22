ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "userId" SET NOT NULL;