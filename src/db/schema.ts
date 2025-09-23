import { integer, pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    status: varchar("status",{length:255}).notNull().default("active"),
    emailVerified: boolean("email_verified").notNull().default(false),
    verificationToken: varchar("verification_token", { length: 255 }),
    verificationExpires: timestamp("verification_expires"),
    passwordResetToken: varchar("password_reset_token", { length: 255 }),
    passwordResetExpires: timestamp("password_reset_expires"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const admin = pgTable("admin", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(), // Remove foreign key constraint to allow both users and admin IDs
    token: varchar("token", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const conversations = pgTable("conversations", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull(), // Can be either users.id or admin.id
    userType: varchar("user_type", { length: 10 }).notNull().default("user"), // 'user' or 'admin'
    title: varchar("title", { length: 255 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    conversationId: integer().notNull().references(() => conversations.id, { onDelete: 'cascade' }),
    parentMessageId: integer(), // References messages.id for tree structure, null for root messages
    branchId: varchar("branch_id", { length: 50 }).notNull().default("main"), // Branch identifier
    role: varchar("role", { length: 20 }).notNull(), // 'user' or 'assistant'
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conversationBranches = pgTable("conversation_branches", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    conversationId: integer().notNull().references(() => conversations.id, { onDelete: 'cascade' }),
    branchId: varchar("branch_id", { length: 50 }).notNull(), // Unique identifier for the branch
    branchName: varchar("branch_name", { length: 100 }), // Human-readable name
    parentMessageId: integer(), // Message from which this branch was forked
    isMainBranch: boolean("is_main_branch").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

