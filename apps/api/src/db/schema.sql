-- endpoints: registered webhook receiver URLs
CREATE TABLE endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  secret TEXT NOT NULL, -- HMAC signing secret
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- events: incoming events to fan out
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- deliveries: one row per (event x endpoint) pair
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  endpoint_id UUID REFERENCES endpoints(id),
  status TEXT DEFAULT 'pending', -- pending | delivered | retrying | dead
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  next_retry_at TIMESTAMPTZ,
  last_response TEXT, -- HTTP status code from last attempt
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
