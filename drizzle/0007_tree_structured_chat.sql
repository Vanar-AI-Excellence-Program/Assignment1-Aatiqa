-- Add tree structure support to messages table
ALTER TABLE "messages" ADD COLUMN "parent_message_id" integer;
ALTER TABLE "messages" ADD COLUMN "branch_id" varchar(50) DEFAULT 'main' NOT NULL;

-- Create conversation_branches table
CREATE TABLE "conversation_branches" (
    "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "conversation_id" integer NOT NULL REFERENCES "conversations"("id") ON DELETE CASCADE,
    "branch_id" varchar(50) NOT NULL,
    "branch_name" varchar(100),
    "parent_message_id" integer,
    "is_main_branch" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Update existing messages to have branch_id 'main'
UPDATE "messages" SET "branch_id" = 'main' WHERE "branch_id" IS NULL;

-- Create indexes for better performance
CREATE INDEX "idx_messages_branch_id" ON "messages"("branch_id");
CREATE INDEX "idx_messages_parent_message_id" ON "messages"("parent_message_id");
CREATE INDEX "idx_conversation_branches_conversation_id" ON "conversation_branches"("conversation_id");
CREATE INDEX "idx_conversation_branches_branch_id" ON "conversation_branches"("branch_id");
