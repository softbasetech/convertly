import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  googleId: text("google_id"),
  displayName: text("display_name"),
  role: text("role").default("user").notNull(),
  dailyConversionsRemaining: integer("daily_conversions_remaining").default(5),
  lastConversionReset: timestamp("last_conversion_reset").defaultNow(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isPro: boolean("is_pro").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Conversion schema
export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sourceFormat: text("source_format").notNull(),
  targetFormat: text("target_format").notNull(), 
  originalFilename: text("original_filename").notNull(),
  convertedFilename: text("converted_filename").notNull(),
  status: text("status").default("completed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// QR Code schema
export const qrCodes = pgTable("qr_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // url, text, email, etc.
  name: text("name"),
  options: jsonb("options"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// API Keys schema
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  googleId: true,
  displayName: true,
});

export const insertConversionSchema = createInsertSchema(conversions).pick({
  userId: true,
  sourceFormat: true,
  targetFormat: true,
  originalFilename: true,
  convertedFilename: true,
  status: true,
});

export const insertQRCodeSchema = createInsertSchema(qrCodes).pick({
  userId: true,
  content: true,
  type: true,
  name: true,
  options: true,
});

export const insertAPIKeySchema = createInsertSchema(apiKeys).pick({
  userId: true,
  key: true,
  name: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const qrCodeSchema = z.object({
  content: z.string().min(1, "Content is required"),
  type: z.enum(["url", "text", "email"]),
  name: z.string().optional(),
  options: z.object({
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
    size: z.number().optional(),
    margin: z.number().optional(),
  }).optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Conversion = typeof conversions.$inferSelect;
export type QRCode = typeof qrCodes.$inferSelect;
export type APIKey = typeof apiKeys.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type QRCodeData = z.infer<typeof qrCodeSchema>;
