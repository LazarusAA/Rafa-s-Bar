-- -----------------------------------------------------------------------------
-- 1. CONFIGURATION & EXTENSIONS
-- -----------------------------------------------------------------------------

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create Enums for strict typing
CREATE TYPE item_category AS ENUM ('beers', 'cocktails', 'food', 'shots', 'non_alcoholic');
CREATE TYPE order_status AS ENUM ('pending', 'delivered', 'canceled');

-- -----------------------------------------------------------------------------
-- 2. TABLE DEFINITIONS
-- -----------------------------------------------------------------------------

-- Table: Menu Items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0), -- Stored in Colones (e.g., 1500)
    category item_category NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_number TEXT NOT NULL, -- Text allows "Bar 1", "Table 4A"
    status order_status DEFAULT 'pending',
    total_price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: Order Items (Junction Table)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    menu_item_id UUID REFERENCES menu_items(id) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time_of_order INTEGER NOT NULL, -- Snapshot price in case menu changes
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: Genre Battles (For Voting)
CREATE TABLE genre_battles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    genre_a_name TEXT NOT NULL,
    genre_b_name TEXT NOT NULL,
    votes_a INTEGER DEFAULT 0,
    votes_b INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: Flash Promos (The "FOMO" Banner)
CREATE TABLE flash_promos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 3. INDEXING FOR PERFORMANCE
-- -----------------------------------------------------------------------------

CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_promos_active ON flash_promos(is_active);

-- -----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE genre_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE flash_promos ENABLE ROW LEVEL SECURITY;

-- ---> POLICIES FOR: MENU ITEMS
-- Public: Read-only for available items
CREATE POLICY "Public can view menu" ON menu_items 
    FOR SELECT TO anon USING (true);
-- Staff: Full access
CREATE POLICY "Staff manage menu" ON menu_items 
    FOR ALL TO authenticated USING (true);

-- ---> POLICIES FOR: ORDERS
-- Public: Can create orders (INSERT only). They cannot SELECT (view) orders to prevent data leaks.
CREATE POLICY "Public can create orders" ON orders 
    FOR INSERT TO anon WITH CHECK (true);
-- Staff: Full access
CREATE POLICY "Staff manage orders" ON orders 
    FOR ALL TO authenticated USING (true);

-- ---> POLICIES FOR: ORDER ITEMS
-- Public: Can add items to orders
CREATE POLICY "Public can add items" ON order_items 
    FOR INSERT TO anon WITH CHECK (true);
-- Staff: Full access
CREATE POLICY "Staff manage order items" ON order_items 
    FOR ALL TO authenticated USING (true);

-- ---> POLICIES FOR: FLASH PROMOS
-- Public: Read active promos
CREATE POLICY "Public view active promos" ON flash_promos 
    FOR SELECT TO anon USING (is_active = true);
-- Staff: Full access
CREATE POLICY "Staff manage promos" ON flash_promos 
    FOR ALL TO authenticated USING (true);

-- ---> POLICIES FOR: GENRE BATTLES
-- Public: View active battles
CREATE POLICY "Public view battles" ON genre_battles 
    FOR SELECT TO anon USING (is_active = true);
-- Staff: Full access
CREATE POLICY "Staff manage battles" ON genre_battles 
    FOR ALL TO authenticated USING (true);

-- -----------------------------------------------------------------------------
-- 5. SECURE VOTING FUNCTION (RPC)
-- -----------------------------------------------------------------------------
-- Instead of giving Public UPDATE permissions (which is risky), we use a function.
-- Call this from your Next.js app using: supabase.rpc('vote_for_genre', { battle_id: '...', choice: 'a' })

CREATE OR REPLACE FUNCTION vote_for_genre(battle_id UUID, choice TEXT)
RETURNS VOID AS $$
BEGIN
  IF choice = 'a' THEN
    UPDATE genre_battles SET votes_a = votes_a + 1 WHERE id = battle_id;
  ELSIF choice = 'b' THEN
    UPDATE genre_battles SET votes_b = votes_b + 1 WHERE id = battle_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to public
GRANT EXECUTE ON FUNCTION vote_for_genre(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION vote_for_genre(UUID, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 6. REALTIME SUBSCRIPTIONS
-- -----------------------------------------------------------------------------

-- Add tables to the publication so the frontend updates instantly
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE genre_battles;
ALTER PUBLICATION supabase_realtime ADD TABLE flash_promos;

-- -----------------------------------------------------------------------------
-- 7. SEED DATA (COSTA RICA CONTEXT)
-- -----------------------------------------------------------------------------

INSERT INTO menu_items (name, description, price, category, is_available) VALUES
('Imperial', 'La cerveza de Costa Rica. Bien fría.', 1200, 'beers', true),
('Chiliguaro', 'El clásico shot picante. Receta de la casa.', 1000, 'shots', true),
('Chifrijo', 'Arroz, frijoles tiernos, chicharrones y pico de gallo.', 4500, 'food', true),
('Cacique (Pacha)', 'Pacha de Guaro Cacique para la mesa + Limón y Sal.', 6000, 'shots', true),
('Hamburguesa La Cali', 'Torta de carne artesanal, queso, tocineta y papas.', 5500, 'food', true);

INSERT INTO genre_battles (genre_a_name, genre_b_name, votes_a, votes_b, is_active) VALUES
('Reggaeton Viejo (Plan B)', 'Reggaeton Nuevo (Bad Bunny)', 12, 8, true);

INSERT INTO flash_promos (message_text, is_active) VALUES
('🚨 2x1 en CHILIGUAROS por los próximos 10 minutos! 🚨', false);
