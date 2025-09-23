CREATE TABLE "conversation_branches" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "conversation_branches_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"conversationId" integer NOT NULL,
	"branch_id" varchar(50) NOT NULL,
	"branch_name" varchar(100),
	"parentMessageId" integer,
	"is_main_branch" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "parentMessageId" integer;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "branch_id" varchar(50) DEFAULT 'main' NOT NULL;--> statement-breakpoint
ALTER TABLE "conversation_branches" ADD CONSTRAINT "conversation_branches_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;