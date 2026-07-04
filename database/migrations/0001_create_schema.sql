-- 0001_create_schema.sql
-- Production-ready schema for DocMind AI
-- Creates core tables: users, documents, chats, messages, summaries, notes

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper: set updated_at timestamp on update
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================
-- Users
-- =====================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

CREATE TRIGGER trg_users_set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =====================
-- Documents
-- =====================
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  original_name text,
  stored_name text,
  file_type text,
  file_hash text,
  file_extension text,
  file_size bigint NOT NULL,
  mime_type text,
  pages integer,
  language text,
  storage_path text NOT NULL,
  status text NOT NULL DEFAULT 'uploaded',
  processing_status text NOT NULL DEFAULT 'uploaded',
  ai_ready boolean NOT NULL DEFAULT false,
  thumbnail_url text,
  favorite boolean NOT NULL DEFAULT false,
  last_opened_at timestamptz,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents (user_id);
CREATE INDEX IF NOT EXISTS idx_documents_storage_path ON documents (storage_path);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents (created_at);

CREATE TRIGGER trg_documents_set_timestamp
BEFORE UPDATE ON documents
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =====================
-- Chats
-- =====================
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats (user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats (created_at);

CREATE TRIGGER trg_chats_set_timestamp
BEFORE UPDATE ON chats
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =====================
-- Messages
-- =====================
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages (chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);

CREATE TRIGGER trg_messages_set_timestamp
BEFORE UPDATE ON messages
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =====================
-- Summaries
-- =====================
CREATE TABLE IF NOT EXISTS summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_summaries_document_id ON summaries (document_id);
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries (created_at);

CREATE TRIGGER trg_summaries_set_timestamp
BEFORE UPDATE ON summaries
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- =====================
-- Notes
-- =====================
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_document_id ON notes (document_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at);

CREATE TRIGGER trg_notes_set_timestamp
BEFORE UPDATE ON notes
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_name ON documents (user_id, name);
