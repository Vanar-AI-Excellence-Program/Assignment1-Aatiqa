ALTER TABLE "conversations" DROP CONSTRAINT "conversations_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "user_type" varchar(10) DEFAULT 'user' NOT NULL;