import { pgTable, integer, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const shortLinks = pgTable(
  'short_links',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull(), // Clerk user ID
    shortCode: text('short_code').notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    shortCodeUnique: uniqueIndex('short_code_unique_idx').on(table.shortCode),
    userIdIdx: uniqueIndex('user_id_short_code_idx').on(table.userId, table.shortCode),
  })
);
