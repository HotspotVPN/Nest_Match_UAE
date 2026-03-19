-- ═══════════════════════════════════════════════════════════════
-- NestMatch UAE — Inbox Messages Table
-- Migration 0008 — 19 March 2026
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS inbox_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Classification
  category TEXT NOT NULL CHECK (category IN ('action', 'message', 'update')),
  type TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('critical', 'high', 'normal', 'low')),

  -- Content
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  cta_label TEXT,
  cta_link TEXT,

  -- Related entities
  property_id TEXT,
  agreement_id TEXT,
  viewing_id TEXT,
  sender_id TEXT,

  -- State
  read_at TEXT,
  actioned_at TEXT,
  archived_at TEXT,

  -- Audit
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_inbox_user ON inbox_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_inbox_category ON inbox_messages(user_id, category);
CREATE INDEX IF NOT EXISTS idx_inbox_unread ON inbox_messages(user_id, read_at);
