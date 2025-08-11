import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const proxyRequests = pgTable("proxy_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  originalUrl: text("original_url").notNull(),
  proxyUrl: text("proxy_url").notNull(),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
});

export const insertProxyRequestSchema = createInsertSchema(proxyRequests).pick({
  originalUrl: true,
  proxyUrl: true,
});

export type InsertProxyRequest = z.infer<typeof insertProxyRequestSchema>;
export type ProxyRequest = typeof proxyRequests.$inferSelect;

// User schema remains for potential future auth features
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
