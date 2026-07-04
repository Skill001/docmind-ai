-- Add missing document metadata fields for storage and file type support

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS stored_name text,
  ADD COLUMN IF NOT EXISTS file_type text;
