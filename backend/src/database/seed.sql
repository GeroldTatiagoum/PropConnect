-- ============================================================
-- PropConnect — Development Seed Script
-- ============================================================
-- All user passwords: "password"
-- Hash below is bcrypt cost 10 (compatible with bcryptjs.compare).
-- To regenerate:
--   node -e "const b=require('bcryptjs'); console.log(b.hashSync('password',10))"
-- ============================================================
-- Tables populated (≥50 rows each):
--   users (60) · properties (60) · property_media (60)
--   documents (60) · verifications (60) · conversations (55)
--   messages (110) · market_data (50) · valuations (60)
--   audit_logs (60)
-- ============================================================
-- UUID naming convention:
--   00000000-aaaa-0000-0000-NNNNNNNNNNNN  → admins        (1-5)
--   00000000-bbbb-0000-0000-NNNNNNNNNNNN  → brokers       (1-15)
--   00000000-cccc-0000-0000-NNNNNNNNNNNN  → sellers       (1-15)
--   00000000-dddd-0000-0000-NNNNNNNNNNNN  → buyers        (1-25)
--   00000000-eeee-0000-0000-NNNNNNNNNNNN  → properties    (1-60)
--   00000000-ffff-0000-0000-NNNNNNNNNNNN  → conversations (1-55)
-- ============================================================
-- NOTE ON ENUM CASTS
--   TypeORM creates PostgreSQL enum types named {table}_{column}_enum.
--   All enum literals use explicit ::type casts so this script works
--   in both psql and any SQL client without implicit coercion.
-- ============================================================

BEGIN;

-- ============================================================
-- TRUNCATE  (reverse dependency order, cascaded)
-- ============================================================
TRUNCATE
  audit_logs,
  valuations,
  messages,
  conversations,
  verifications,
  documents,
  property_media,
  properties,
  users
RESTART IDENTITY CASCADE;

-- ============================================================
-- 1. USERS  (60 rows: 5 admin · 15 broker · 15 seller · 25 buyer)
-- ============================================================

-- 5 Admins
INSERT INTO users (
  id, email, password_hash, first_name, last_name, phone,
  role, kyc_status, is_active, bio, created_at, updated_at
)
SELECT
  ('00000000-aaaa-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  'admin' || i || '@propconnect.it',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  (ARRAY['Marco','Giulia','Andrea','Francesca','Luca'])[i],
  (ARRAY['Rossi','Ferrari','Bianchi','Romano','Colombo'])[i],
  '+39 02 0000 000' || i,
  'admin'::users_role_enum,
  'approved'::users_kyc_status_enum,
  true,
  'Amministratore della piattaforma PropConnect.',
  NOW() - ((90 + i * 5) || ' days')::interval,
  NOW() - (i || ' days')::interval
FROM generate_series(1, 5) AS i;

-- 15 Brokers
INSERT INTO users (
  id, email, password_hash, first_name, last_name, phone,
  role, kyc_status, is_active, bio, created_at, updated_at
)
SELECT
  ('00000000-bbbb-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  'broker' || i || '@propconnect.it',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  (ARRAY['Stefano','Roberto','Elena','Anna','Giuseppe','Monica','Giovanni','Laura',
         'Antonio','Sara','Francesco','Chiara','Alessandro','Valentina','Matteo'])[i],
  (ARRAY['Ricci','Esposito','Marino','Greco','Bruno','Gallo','Conti','Mancini',
         'Costa','Giordano','Rizzo','Lombardi','Moreno','Barbieri','De Luca'])[i],
  '+39 02 1111 ' || lpad((1000 + i * 37)::text, 4, '0'),
  'broker'::users_role_enum,
  (CASE WHEN i <= 12 THEN 'approved'
        WHEN i <= 14 THEN 'pending'
        ELSE 'rejected' END)::users_kyc_status_enum,
  CASE WHEN i < 15 THEN true ELSE false END,
  'Agente immobiliare certificato con ' || (3 + i) || ' anni di esperienza nel settore.',
  NOW() - ((180 + i * 8) || ' days')::interval,
  NOW() - (i || ' days')::interval
FROM generate_series(1, 15) AS i;

-- 15 Sellers
INSERT INTO users (
  id, email, password_hash, first_name, last_name, phone,
  role, kyc_status, is_active, bio, created_at, updated_at
)
SELECT
  ('00000000-cccc-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  'seller' || i || '@example.it',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  (ARRAY['Lorenzo','Davide','Simone','Federico','Paolo','Roberta','Federica','Silvia',
         'Paola','Claudia','Mario','Carla','Luigi','Rosa','Giovanni'])[i],
  (ARRAY['Ferretti','Fontana','Marchetti','Santoro','Russo','Gentile','Caruso','Leone',
         'Martini','Ferri','Serra','Bianco','De Angelis','Longo','Villa'])[i],
  '+39 33 2222 ' || lpad((2000 + i * 41)::text, 4, '0'),
  'seller'::users_role_enum,
  (CASE WHEN i <= 13 THEN 'approved' ELSE 'pending' END)::users_kyc_status_enum,
  true,
  'Proprietario che vende su PropConnect. ' ||
  CASE WHEN i % 3 = 0 THEN 'Disponibile per visite nel weekend.'
       WHEN i % 3 = 1 THEN 'Rispondo entro 24 ore.'
       ELSE 'Trattativa riservata, solo acquirenti seri.' END,
  NOW() - ((120 + i * 5) || ' days')::interval,
  NOW() - (i || ' days')::interval
FROM generate_series(1, 15) AS i;

-- 25 Buyers
INSERT INTO users (
  id, email, password_hash, first_name, last_name, phone,
  role, kyc_status, is_active, bio, created_at, updated_at
)
SELECT
  ('00000000-dddd-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  'buyer' || i || '@example.it',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  (ARRAY['Marco','Luca','Anna','Giulia','Roberto','Elena','Andrea','Sara','Matteo','Chiara',
         'Giuseppe','Valentina','Stefano','Monica','Giovanni','Laura','Antonio','Roberta',
         'Francesco','Federica','Alessandro','Claudia','Lorenzo','Silvia','Davide'])[i],
  (ARRAY['Pellegrini','Rinaldi','Palumbo','Caputo','Pinto','Catalano','Gentile','Amato',
         'Silvestri','Coppola','Riva','Leone','Neri','Marini','Testa','Pepe','Fabbri',
         'Ferrara','Fiore','Pagano','Benedetti','Orlando','Messina','Costantini','Guerra'])[i],
  '+39 34 3333 ' || lpad((3000 + i * 43)::text, 4, '0'),
  'buyer'::users_role_enum,
  (CASE WHEN i % 3 = 0 THEN 'approved'
        WHEN i % 3 = 1 THEN 'pending'
        ELSE 'approved' END)::users_kyc_status_enum,
  CASE WHEN i = 25 THEN false ELSE true END,
  NULL,
  NOW() - ((60 + i * 2) || ' days')::interval,
  NOW() - (i || ' days')::interval
FROM generate_series(1, 25) AS i;

-- ============================================================
-- 2. PROPERTIES  (60 rows — 4 per seller)
-- ============================================================

INSERT INTO properties (
  id, seller_id,
  address, postal_code, city, province, country,
  latitude, longitude,
  property_type, rooms_count, bathrooms_count,
  total_area_sqm, land_area_sqm,
  price, description, amenities,
  status, published_at,
  view_count, contact_request_count,
  year_built, condition,
  heating_type, cooling_type,
  is_furnished, has_elevator, has_parking, has_terrace, has_garden,
  energy_class, created_at, updated_at
)
SELECT
  ('00000000-eeee-0000-0000-' || lpad(p::text, 12, '0'))::uuid,
  ('00000000-cccc-0000-0000-' || lpad(((p - 1) / 4 + 1)::text, 12, '0'))::uuid,

  (ARRAY['Via Dante Alighieri','Corso Buenos Aires','Via Torino','Piazza Navona',
         'Via Roma','Corso Vittorio Emanuele','Via Napoli','Viale Aventino',
         'Via Milano','Via Venezia','Via Firenze','Corso Garibaldi',
         'Via Mazzini','Piazza della Repubblica','Via Cavour'])
    [((p - 1) % 15) + 1] || ' ' || (p * 3),

  (ARRAY['20121','00185','80133','10128','50123','40126','30122','16123','90133','70122',
         '20135','00196','80121','10121','50129'])[((p - 1) % 15) + 1],

  (ARRAY['Milano','Roma','Napoli','Torino','Firenze','Bologna','Venezia','Genova','Palermo','Bari',
         'Milano','Roma','Napoli','Torino','Firenze'])[((p - 1) % 15) + 1],

  (ARRAY['MI','RM','NA','TO','FI','BO','VE','GE','PA','BA',
         'MI','RM','NA','TO','FI'])[((p - 1) % 15) + 1],

  'IT',

  ROUND(
    ((ARRAY[45.4654,41.9028,40.8518,45.0703,43.7696,44.4949,45.4408,44.4056,38.1157,41.1171,
            45.4500,41.8800,40.8400,45.0600,43.7800])
      [((p - 1) % 15) + 1]::decimal
    + (((p * 17) % 100) - 50) * 0.0003)::numeric, 8),

  ROUND(
    ((ARRAY[9.1859,12.4964,14.2681,7.6869,11.2558,11.3426,12.3155,8.9463,13.3615,16.8719,
            9.2100,12.5200,14.2900,7.7100,11.2800])
      [((p - 1) % 15) + 1]::decimal
    + (((p * 13) % 100) - 50) * 0.0004)::numeric, 8),

  ((ARRAY['apartment','apartment','house','villa','commercial','land','apartment','house',
          'apartment','villa','apartment','commercial','house','apartment','villa'])
    [((p - 1) % 15) + 1])::properties_property_type_enum,

  (ARRAY[2, 3, 4, 5, 4, 1, 3, 5, 2, 6, 3, 4, 3, 2, 5])[((p - 1) % 15) + 1],

  (ARRAY[1, 1, 2, 3, 2, 1, 1, 3, 1, 4, 2, 2, 2, 1, 3])[((p - 1) % 15) + 1],

  ROUND((((p - 1) % 8) * 30 + 45)::numeric, 2),

  CASE WHEN (ARRAY['apartment','apartment','house','villa','commercial','land','apartment','house',
                   'apartment','villa','apartment','commercial','house','apartment','villa'])
              [((p - 1) % 15) + 1]
       IN ('house','villa','land')
       THEN ROUND(((p % 5) * 150 + 80)::numeric, 2)
       ELSE NULL END,

  ROUND((
    (ARRAY[280000,420000,650000,1200000,380000,95000,310000,720000,
           195000,1500000,340000,490000,580000,225000,980000])
      [((p - 1) % 15) + 1]
    + ((p * 7919) % 50000)
  )::numeric, 2),

  'Splendido immobile in ' ||
  (ARRAY['Milano','Roma','Napoli','Torino','Firenze','Bologna','Venezia','Genova','Palermo','Bari',
         'Milano','Roma','Napoli','Torino','Firenze'])[((p - 1) % 15) + 1] || '. ' ||
  (ARRAY[
    'Ottima esposizione sud-ovest, finiture di pregio, vicinanza ai servizi.',
    'Piano alto con vista panoramica, recentemente ristrutturato.',
    'Posizione centrale, luminoso e silenzioso, pronto per entrare.',
    'Immobile di rappresentanza in zona residenziale esclusiva.',
    'Ottimo investimento, affittato con rendita annua del 5%.',
    'Terreno edificabile in zona a bassa densità, ottima opportunità.',
    'Contesto condominiale curato, portineria, box auto doppio.',
    'Accesso indipendente, giardino privato recintato, barbecue.',
    'Edificio storico ristrutturato, soffitti alti, parquet originale.',
    'Nuovo di pacca, impianti a norma, classe energetica A.'
  ])[((p - 1) % 10) + 1],

  (ARRAY[
    '["ascensore","portineria","cantina","posto auto"]'::jsonb,
    '["balcone","cantina","fibra ottica","videocitofono"]'::jsonb,
    '["terrazzo","giardino","posto auto","cantina","piscina"]'::jsonb,
    '["portineria","palestra","sauna","piscina condominiale"]'::jsonb,
    '["allarme","videocamera","cantina","box auto"]'::jsonb
  ])[((p - 1) % 5) + 1],

  (CASE WHEN p <= 40 THEN 'published'
        WHEN p <= 50 THEN 'pending_verification'
        WHEN p <= 56 THEN 'draft'
        ELSE 'archived' END)::properties_status_enum,

  CASE WHEN p <= 40 THEN NOW() - ((65 - p) || ' days')::interval ELSE NULL END,

  (p * 7 + 11) % 350,
  (p * 3 + 5)  % 30,

  1955 + ((p * 13) % 70),

  ((ARRAY['new','good','good','fair','needs_renovation','new','good','fair','new','good',
          'fair','good','new','needs_renovation','good'])
    [((p - 1) % 15) + 1])::properties_condition_enum,

  (ARRAY['autonomo','centralizzato','pompa di calore','autonomo','centralizzato',
         'autonomo','teleriscaldamento','centralizzato'])[((p - 1) % 8) + 1],

  CASE WHEN p % 3 = 0 THEN 'aria condizionata' ELSE NULL END,

  p % 4 = 0,
  p % 3 = 0,
  p % 2 = 0,
  p % 5 = 0,
  (ARRAY['apartment','apartment','house','villa','commercial','land','apartment','house',
         'apartment','villa','apartment','commercial','house','apartment','villa'])
    [((p - 1) % 15) + 1] IN ('house','villa'),

  (ARRAY['A','A','B','B','C','C','D','E','A','B','C','D','A','B','C'])[((p - 1) % 15) + 1],

  NOW() - ((75 - p % 60) || ' days')::interval,
  NOW() - ((20 - p % 18) || ' days')::interval

FROM generate_series(1, 60) AS p;

-- ============================================================
-- 3. PROPERTY_MEDIA  (60 rows — 1 cover per property)
-- ============================================================

INSERT INTO property_media (
  id, property_id, media_type, s3_url, s3_key,
  thumbnail_url, file_size_bytes, display_order, title, created_at
)
SELECT
  gen_random_uuid(),
  ('00000000-eeee-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  (CASE WHEN i % 12 = 0 THEN 'floor_plan'
        WHEN i % 9  = 0 THEN 'virtual_tour'
        WHEN i % 6  = 0 THEN 'video'
        ELSE 'photo' END)::property_media_media_type_enum,
  'https://propconnect-media.s3.eu-south-1.amazonaws.com/properties/'
    || lpad(i::text, 12, '0') || '/cover.jpg',
  'properties/' || lpad(i::text, 12, '0') || '/cover.jpg',
  'https://propconnect-media.s3.eu-south-1.amazonaws.com/properties/'
    || lpad(i::text, 12, '0') || '/cover_thumb.jpg',
  (800000 + i * 48000),
  1,
  'Foto principale — immobile ' || i,
  NOW() - ((75 - i % 60) || ' days')::interval
FROM generate_series(1, 60) AS i;

-- ============================================================
-- 4. DOCUMENTS  (60 rows — KYC documents for users)
-- ============================================================

INSERT INTO documents (
  id, user_id, property_id, document_type, document_side,
  s3_path, s3_key, file_size_bytes, file_mime_type,
  is_verified, verified_by, verified_at, verification_notes,
  created_at, updated_at, expires_at
)
SELECT
  gen_random_uuid(),
  CASE
    WHEN i <= 5  THEN ('00000000-aaaa-0000-0000-' || lpad(i::text, 12, '0'))::uuid
    WHEN i <= 20 THEN ('00000000-bbbb-0000-0000-' || lpad(((i -  5 - 1) % 15 + 1)::text, 12, '0'))::uuid
    WHEN i <= 35 THEN ('00000000-cccc-0000-0000-' || lpad(((i - 20 - 1) % 15 + 1)::text, 12, '0'))::uuid
    ELSE          ('00000000-dddd-0000-0000-' || lpad(((i - 35 - 1) % 25 + 1)::text, 12, '0'))::uuid
  END,
  NULL,
  ((ARRAY['identity_card','passport','driving_license','identity_card','passport',
          'identity_card','driving_license','passport','identity_card','driving_license'])
    [((i - 1) % 10) + 1])::documents_document_type_enum,
  ((ARRAY['front','back','full','front','full','back','full','front','back','full'])
    [((i - 1) % 10) + 1])::documents_document_side_enum,
  's3://propconnect-kyc-documents/kyc/' || i || '/document.pdf',
  'kyc/' || lpad(i::text, 6, '0') || '/document_' || lpad(i::text, 6, '0'),
  (200000 + i * 15000),
  CASE WHEN i % 3 = 0 THEN 'application/pdf' ELSE 'image/jpeg' END,
  (i % 10) != 3 AND (i % 10) != 7,
  CASE WHEN (i % 10) != 3 AND (i % 10) != 7
       THEN ('00000000-aaaa-0000-0000-' || lpad((i % 5 + 1)::text, 12, '0'))::uuid
       ELSE NULL END,
  CASE WHEN (i % 10) != 3 AND (i % 10) != 7
       THEN NOW() - ((25 - i % 20) || ' days')::interval
       ELSE NULL END,
  CASE WHEN (i % 10) != 3 AND (i % 10) != 7
       THEN 'Documento conforme. Verifica completata con successo.'
       ELSE NULL END,
  NOW() - ((55 - i % 45) || ' days')::interval,
  NOW() - ((10 - i % 9)  || ' days')::interval,
  NOW() + '5 years'::interval - ((55 - i % 45) || ' days')::interval
FROM generate_series(1, 60) AS i;

-- ============================================================
-- 5. VERIFICATIONS  (60 rows)
-- ============================================================

INSERT INTO verifications (
  id, user_id, property_id, verification_type, status,
  assigned_broker_id, assigned_at, priority,
  checklist, rejection_reason,
  completed_by, completed_at, notes,
  created_at, updated_at, expires_at
)
SELECT
  gen_random_uuid(),
  CASE
    WHEN i <= 30 THEN ('00000000-cccc-0000-0000-' || lpad(((i - 1) % 15 + 1)::text, 12, '0'))::uuid
    ELSE          ('00000000-dddd-0000-0000-' || lpad(((i - 30 - 1) % 25 + 1)::text, 12, '0'))::uuid
  END,
  CASE WHEN i % 4 = 0
       THEN ('00000000-eeee-0000-0000-' || lpad(((i / 4) % 40 + 1)::text, 12, '0'))::uuid
       ELSE NULL END,
  ((ARRAY['kyc_seller','kyc_user','property_documents','financial_capacity'])
    [((i - 1) % 4) + 1])::verifications_verification_type_enum,
  (CASE WHEN i <= 18 THEN 'approved'
        WHEN i <= 33 THEN 'in_review'
        WHEN i <= 45 THEN 'pending'
        WHEN i <= 55 THEN 'rejected'
        ELSE 'expired' END)::verifications_status_enum,
  CASE WHEN i <= 55
       THEN ('00000000-bbbb-0000-0000-' || lpad(((i - 1) % 12 + 1)::text, 12, '0'))::uuid
       ELSE NULL END,
  CASE WHEN i <= 55 THEN NOW() - ((50 - i % 35) || ' days')::interval ELSE NULL END,
  ((ARRAY['medium','high','urgent','low','medium','high'])
    [((i - 1) % 6) + 1])::verifications_priority_enum,
  '[
    {"id":"chk-1","name":"Documento di identità","required":true,"completed":true,"notes":"Verificato"},
    {"id":"chk-2","name":"Codice fiscale","required":true,"completed":true,"notes":"Verificato"},
    {"id":"chk-3","name":"Dichiarazione dei redditi","required":false,"completed":false,"notes":""}
  ]'::jsonb,
  CASE WHEN i BETWEEN 46 AND 55
       THEN (ARRAY[
         'Documentazione incompleta.',
         'Documento scaduto o non leggibile.',
         'Dati non corrispondenti.',
         'Reddito insufficiente per la verifica finanziaria.',
         'Documento non accettato per questo tipo di verifica.'
       ])[((i - 46) % 5) + 1]
       ELSE NULL END,
  CASE WHEN i <= 18
       THEN ('00000000-bbbb-0000-0000-' || lpad(((i - 1) % 12 + 1)::text, 12, '0'))::uuid
       ELSE NULL END,
  CASE WHEN i <= 18 THEN NOW() - ((35 - i) || ' days')::interval ELSE NULL END,
  'Verifica gestita tramite piattaforma PropConnect.',
  NOW() - ((65 - i) || ' days')::interval,
  NOW() - ((20 - i % 18) || ' days')::interval,
  NOW() + '90 days'::interval - ((65 - i) || ' days')::interval
FROM generate_series(1, 60) AS i;

-- ============================================================
-- 6. CONVERSATIONS  (55 rows)
-- ============================================================

INSERT INTO conversations (
  id, property_id, buyer_id, seller_id, status, last_message_at, created_at, updated_at
)
SELECT
  ('00000000-ffff-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  ('00000000-eeee-0000-0000-' || lpad(((i - 1) % 40 + 1)::text, 12, '0'))::uuid,
  ('00000000-dddd-0000-0000-' || lpad(((i - 1) % 25 + 1)::text, 12, '0'))::uuid,
  ('00000000-cccc-0000-0000-' || lpad((((i - 1) % 40) / 4 + 1)::text, 12, '0'))::uuid,
  (CASE WHEN i <= 40 THEN 'active'
        WHEN i <= 50 THEN 'archived'
        ELSE 'blocked' END)::conversations_status_enum,
  NOW() - ((32 - i % 28) || ' days')::interval,
  NOW() - ((38 - i % 28) || ' days')::interval,
  NOW() - ((32 - i % 28) || ' days')::interval
FROM generate_series(1, 55) AS i;

-- ============================================================
-- 7. MESSAGES  (110 rows — 2 per conversation)
-- ============================================================

-- First message: buyer → seller
INSERT INTO messages (
  id, conversation_id, sender_id, recipient_id,
  content, message_type, metadata, is_deleted, read_at, created_at
)
SELECT
  gen_random_uuid(),
  ('00000000-ffff-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  ('00000000-dddd-0000-0000-' || lpad(((i - 1) % 25 + 1)::text, 12, '0'))::uuid,
  ('00000000-cccc-0000-0000-' || lpad((((i - 1) % 40) / 4 + 1)::text, 12, '0'))::uuid,
  (ARRAY[
    'Buongiorno, sono interessato a questo immobile. Posso avere maggiori informazioni?',
    'Salve, vorrei fissare una visita. Quando sarebbe disponibile?',
    'Ciao, ho visto il vostro annuncio. Il prezzo è trattabile?',
    'Gentile venditore, sono interessata all''immobile. Ci sono spese condominiali?',
    'Buonasera, l''appartamento è ancora disponibile? Grazie mille.',
    'Salve, mi interesserebbe sapere l''anno di ristrutturazione dell''immobile.',
    'Ciao, è possibile visitare anche il sabato mattina?',
    'La proprietà è libera subito o c''è un inquilino?'
  ])[((i - 1) % 8) + 1],
  'text'::messages_message_type_enum,
  NULL,
  false,
  CASE WHEN i <= 40 THEN NOW() - ((29 - i % 22) || ' days')::interval ELSE NULL END,
  NOW() - ((38 - i % 28) || ' days')::interval
FROM generate_series(1, 55) AS i;

-- Second message: seller → buyer (reply)
INSERT INTO messages (
  id, conversation_id, sender_id, recipient_id,
  content, message_type, metadata, is_deleted, read_at, created_at
)
SELECT
  gen_random_uuid(),
  ('00000000-ffff-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  ('00000000-cccc-0000-0000-' || lpad((((i - 1) % 40) / 4 + 1)::text, 12, '0'))::uuid,
  ('00000000-dddd-0000-0000-' || lpad(((i - 1) % 25 + 1)::text, 12, '0'))::uuid,
  (ARRAY[
    'Grazie per l''interesse! Sono disponibile per una visita giovedì o venerdì pomeriggio.',
    'Buongiorno! Sì, l''immobile è ancora disponibile. Quando preferisce venire?',
    'Certamente, c''è margine di trattativa. La chiamo per concordare i dettagli.',
    'Le spese condominiali ammontano a circa €120/mese. Quando vuole visitare?',
    'Perfetto! La contatto entro domani per organizzare il sopralluogo.',
    'La ristrutturazione è del 2019, impianti tutti a norma e certificati.',
    'Certo, il sabato mattina va benissimo. Ci vediamo alle 10:00?',
    'L''immobile è libero da subito, disponibile per rogito in 60 giorni.'
  ])[((i - 1) % 8) + 1],
  'text'::messages_message_type_enum,
  NULL,
  false,
  CASE WHEN i <= 40 THEN NOW() - ((25 - i % 20) || ' days')::interval ELSE NULL END,
  NOW() - ((32 - i % 28) || ' days')::interval
FROM generate_series(1, 55) AS i;

-- ============================================================
-- 8. MARKET_DATA  (50 rows — 10 zones × 5 property types)
-- ============================================================

INSERT INTO market_data (
  id, zone_name, latitude, longitude, property_type, date_recorded,
  avg_price_per_sqm, min_price_per_sqm, max_price_per_sqm,
  avg_days_to_sale, active_listings_count, sold_count_last_30_days,
  created_at
)
SELECT
  gen_random_uuid(),
  z.zone_name,
  z.lat,
  z.lon,
  t.ptype,
  '2026-01-01'::date,
  ROUND((z.base_price * t.multiplier)::numeric, 2),
  ROUND((z.base_price * t.multiplier * 0.76)::numeric, 2),
  ROUND((z.base_price * t.multiplier * 1.38)::numeric, 2),
  25 + z.zone_rank * 3 + t.type_rank * 2,
  15 + z.zone_rank * 4 + t.type_rank * 2,
   1 + z.zone_rank + t.type_rank,
  NOW() - '30 days'::interval
FROM (VALUES
  (1, 'Milano Centro',  45.4654,  9.1859, 8200),
  (2, 'Roma Centro',    41.9028, 12.4964, 7100),
  (3, 'Firenze Centro', 43.7696, 11.2558, 5800),
  (4, 'Venezia Centro', 45.4408, 12.3155, 6500),
  (5, 'Bologna Centro', 44.4949, 11.3426, 4400),
  (6, 'Torino Centro',  45.0703,  7.6869, 3900),
  (7, 'Napoli Centro',  40.8518, 14.2681, 3300),
  (8, 'Genova Centro',  44.4056,  8.9463, 2950),
  (9, 'Palermo Centro', 38.1157, 13.3615, 2150),
  (10,'Bari Centro',    41.1171, 16.8719, 2450)
) AS z(zone_rank, zone_name, lat, lon, base_price)
CROSS JOIN (VALUES
  (1, 'apartment',  1.00),
  (2, 'house',      0.92),
  (3, 'villa',      1.45),
  (4, 'commercial', 1.18),
  (5, 'land',       0.38)
) AS t(type_rank, ptype, multiplier);

-- ============================================================
-- 9. VALUATIONS  (60 rows — one per property)
-- ============================================================

INSERT INTO valuations (
  id, property_id,
  estimated_value, value_range_low, value_range_high,
  confidence_score, factors, algorithm_version,
  created_at, updated_at
)
SELECT
  gen_random_uuid(),
  ('00000000-eeee-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  ROUND((
    (ARRAY[280000,420000,650000,1200000,380000,95000,310000,720000,
           195000,1500000,340000,490000,580000,225000,980000])[((i - 1) % 15) + 1]
    + ((i * 7919) % 50000)
    + ((i * 1597) % 20000) - 10000
  )::numeric, 2),
  ROUND((
    (ARRAY[280000,420000,650000,1200000,380000,95000,310000,720000,
           195000,1500000,340000,490000,580000,225000,980000])[((i - 1) % 15) + 1]
    + ((i * 7919) % 50000)
    + ((i * 1597) % 20000) - 10000
  ) * 0.92::numeric, 2),
  ROUND((
    (ARRAY[280000,420000,650000,1200000,380000,95000,310000,720000,
           195000,1500000,340000,490000,580000,225000,980000])[((i - 1) % 15) + 1]
    + ((i * 7919) % 50000)
    + ((i * 1597) % 20000) - 10000
  ) * 1.12::numeric, 2),
  ROUND((0.62 + (i % 8) * 0.04)::numeric, 2),
  jsonb_build_object(
    'posizione',         ROUND((0.70 + (i % 5) * 0.05)::numeric, 2),
    'stato_immobile',    ROUND((0.60 + (i % 4) * 0.08)::numeric, 2),
    'mercato_locale',    ROUND((0.65 + (i % 6) * 0.05)::numeric, 2),
    'accessibilita',     ROUND((0.55 + (i % 5) * 0.07)::numeric, 2),
    'classe_energetica', ROUND((0.50 + (i % 7) * 0.06)::numeric, 2)
  ),
  'v1.2',
  NOW() - ((45 - i % 35) || ' days')::interval,
  NOW() - ((8  - i % 7)  || ' days')::interval
FROM generate_series(1, 60) AS i;

-- ============================================================
-- 10. AUDIT_LOGS  (60 rows)
-- ============================================================

INSERT INTO audit_logs (
  id, actor_id, action, entity_type, entity_id,
  old_values, new_values,
  ip_address, user_agent, status, created_at
)
SELECT
  gen_random_uuid(),
  CASE
    WHEN i % 4 = 1 THEN ('00000000-aaaa-0000-0000-' || lpad((i % 5  + 1)::text, 12, '0'))::uuid
    WHEN i % 4 = 2 THEN ('00000000-bbbb-0000-0000-' || lpad((i % 15 + 1)::text, 12, '0'))::uuid
    WHEN i % 4 = 3 THEN ('00000000-cccc-0000-0000-' || lpad((i % 15 + 1)::text, 12, '0'))::uuid
    ELSE                 ('00000000-dddd-0000-0000-' || lpad((i % 25 + 1)::text, 12, '0'))::uuid
  END,
  (ARRAY[
    'user.login',             'user.register',         'property.create',
    'property.status_change', 'verification.approve',  'verification.reject',
    'kyc.document_upload',    'user.profile_update',   'property.update',
    'conversation.create',    'user.logout',           'verification.assign_broker'
  ])[((i - 1) % 12) + 1],
  (ARRAY[
    'User','User','Property','Property','Verification','Verification',
    'Document','User','Property','Conversation','User','Verification'
  ])[((i - 1) % 12) + 1],
  CASE
    WHEN ((i - 1) % 12) + 1 IN (3, 4, 9)
      THEN ('00000000-eeee-0000-0000-' || lpad((i % 60 + 1)::text, 12, '0'))::uuid
    WHEN ((i - 1) % 12) + 1 IN (1, 2, 8, 11)
      THEN ('00000000-dddd-0000-0000-' || lpad((i % 25 + 1)::text, 12, '0'))::uuid
    ELSE gen_random_uuid()
  END,
  CASE
    WHEN ((i - 1) % 12) + 1 = 4 THEN '{"status":"draft"}'::jsonb
    WHEN ((i - 1) % 12) + 1 = 8 THEN '{"phone":null}'::jsonb
    ELSE NULL
  END,
  CASE
    WHEN ((i - 1) % 12) + 1 = 4 THEN '{"status":"published"}'::jsonb
    WHEN ((i - 1) % 12) + 1 = 1 THEN jsonb_build_object('last_login_at', NOW() - (i || ' hours')::interval)
    WHEN ((i - 1) % 12) + 1 = 8 THEN jsonb_build_object('phone', '+39 33 ' || (4000 + i * 37))
    ELSE NULL
  END,
  ('192.168.' || ((i * 11) % 254 + 1) || '.' || ((i * 7) % 254 + 1))::inet,
  (ARRAY[
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4) AppleWebKit/605.1.15 Mobile Safari/604',
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124.0 Mobile Safari/537'
  ])[((i - 1) % 4) + 1],
  (CASE WHEN i % 10 = 0 THEN 'failure' ELSE 'success' END)::audit_logs_status_enum,
  NOW() - ((55 - i % 50) || ' days')::interval
FROM generate_series(1, 60) AS i;

COMMIT;

-- ============================================================
-- Quick verification counts
-- ============================================================
SELECT 'users'          AS tbl, COUNT(*) AS rows FROM users
UNION ALL SELECT 'properties',     COUNT(*) FROM properties
UNION ALL SELECT 'property_media', COUNT(*) FROM property_media
UNION ALL SELECT 'documents',      COUNT(*) FROM documents
UNION ALL SELECT 'verifications',  COUNT(*) FROM verifications
UNION ALL SELECT 'conversations',  COUNT(*) FROM conversations
UNION ALL SELECT 'messages',       COUNT(*) FROM messages
UNION ALL SELECT 'market_data',    COUNT(*) FROM market_data
UNION ALL SELECT 'valuations',     COUNT(*) FROM valuations
UNION ALL SELECT 'audit_logs',     COUNT(*) FROM audit_logs
ORDER BY tbl;
