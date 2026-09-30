-- Single-owner application state. JSONB retains task history and legacy keys.
-- No browser-facing API: all access uses authenticated server handlers.
CREATE TABLE IF NOT EXISTS tracker_state (
  id text PRIMARY KEY CHECK (id = 'owner'),
  data jsonb NOT NULL CHECK (
    jsonb_typeof(data) = 'object'
    AND data ? 'lessons'
    AND jsonb_typeof(data->'lessons') = 'object'
  ),
  updated_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON tracker_state FROM PUBLIC;
