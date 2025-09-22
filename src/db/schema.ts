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

