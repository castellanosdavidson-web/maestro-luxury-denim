-- Tabla de configuración de la portada (1 sola fila)
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  hero_title text DEFAULT 'DISEÑADO
PARA MUJERES',
  hero_subtitle text DEFAULT 'que imponen estilo.',
  hero_caption text DEFAULT 'Denim premium · Edición limitada',
  hero_value_prop text DEFAULT 'Confección colombiana con estándares globales',
  hero_image text DEFAULT '',
  hero_font_size text DEFAULT 'large',
  hero_font_family text DEFAULT 'editorial',
  updated_at timestamptz DEFAULT now()
);

-- Insertar fila inicial de configuración
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  description text DEFAULT '',
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  image text DEFAULT '',
  category_id text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  image text DEFAULT '',
  col_span text DEFAULT 'col-span-1',
  row_span text DEFAULT 'row-span-1',
  status text DEFAULT 'Activa'
);

-- Insertar categorías base
INSERT INTO categories (id, name, image, col_span, row_span) VALUES
  ('chaquetas',     'Chaquetas',       'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800', 'col-span-1 md:col-span-2', 'row-span-1 md:row-span-2'),
  ('blusas-y-corset','Blusas y Corset','https://images.unsplash.com/photo-1621815155702-8ebfce7e012e?q=80&w=800', 'col-span-1', 'row-span-1'),
  ('pantalones',    'Pantalones',      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800', 'col-span-1', 'row-span-1'),
  ('vestidos',      'Vestidos',        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800', 'col-span-1', 'row-span-1'),
  ('faldas',        'Faldas',          'https://images.unsplash.com/photo-1582142407894-ec85a1260a46?q=80&w=800', 'col-span-1 md:col-span-2', 'row-span-1'),
  ('gabardinas',    'Gabardinas',      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800', 'col-span-1', 'row-span-1'),
  ('chalecos',      'Chalecos',        'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=800', 'col-span-1', 'row-span-1'),
  ('enterizo',      'Enterizo',        'https://images.unsplash.com/photo-1601614947936-a83a055d78be?q=80&w=800', 'col-span-1', 'row-span-1')
ON CONFLICT (id) DO NOTHING;

-- Habilitar Row Level Security y permitir acceso público de lectura
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read settings"   ON settings   FOR SELECT USING (true);
CREATE POLICY "Public write settings"  ON settings   FOR ALL    USING (true);
CREATE POLICY "Public read products"   ON products   FOR SELECT USING (true);
CREATE POLICY "Public write products"  ON products   FOR ALL    USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public write categories"ON categories FOR ALL    USING (true);
