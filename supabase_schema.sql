-- Tabulka pro eventy
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  ticket_price DECIMAL(10,2) NOT NULL,
  total_tickets INTEGER NOT NULL,
  sold_tickets INTEGER DEFAULT 0,
  vendor TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Sport', 'Concert', 'Hackathon', 'Conference', 'Other')),
  image_url TEXT,
  blockchain_event_id BIGINT, -- pro propojení s kontraktem (volitelné)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pro rychlejší vyhledávání
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_location ON events(location);

-- RLS (Row Level Security) políčka
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políčka pro čtení - všichni mohou číst
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT USING (true);

-- Políčka pro vkládání - pouze authenticated uživatelé
CREATE POLICY "Authenticated users can insert events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Políčka pro aktualizaci - pouze authenticated uživatelé mohou aktualizovat své eventy
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid()::text = vendor);

-- Trigger pro automatické aktualizování updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Vložení ukázkových dat
INSERT INTO events (name, description, date, location, ticket_price, total_tickets, vendor, event_type, image_url) VALUES
(
  'Prague Blockchain Conference 2024',
  'Největší blockchain konference v České republice s mezinárodními speakery',
  '2024-03-15T10:00:00Z',
  'Prague Convention Centre',
  50.00,
  500,
  '0x1234567890abcdef1234567890abcdef12345678',
  'Conference',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
),
(
  'ETH Prague Hackathon',
  '48hodinový hackathon zaměřený na Ethereum ekosystém',
  '2024-04-20T09:00:00Z',
  'CIIRC CTU',
  25.00,
  300,
  '0x1234567890abcdef1234567890abcdef12345678',
  'Hackathon',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
),
(
  'Crypto Concert: Digital Beats',
  'Elektronická hudba meets kryptoměny - jedinečný hudební zážitek',
  '2024-05-10T20:00:00Z',
  'MeetFactory',
  30.00,
  200,
  '0x1234567890abcdef1234567890abcdef12345678',
  'Concert',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
); 