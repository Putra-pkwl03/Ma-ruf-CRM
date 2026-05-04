-- ==========================================
-- SEED DATA UNTUK PT. SMART CRM (PRODUCTION READY)
-- ==========================================

-- 0. Pastikan Ekstensi Aktif
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. INSERT DATA PRODUK
-- Menggunakan TRUNCATE agar data bersih saat re-seed (Opsional)
TRUNCATE public.products RESTART IDENTITY CASCADE;

INSERT INTO public.products (name, hpp, margin_percent, created_at)
VALUES 
('Smart Home 10 Mbps', 150000, 15, NOW()),
('Smart Home 30 Mbps', 250000, 20, NOW()),
('Smart Business 50 Mbps', 500000, 25, NOW()),
('Smart Dedicated 100 Mbps', 2000000, 30, NOW()),
('CCTV Cloud Storage', 50000, 10, NOW());
 
-- 2. INSERT AUTH USERS & PROFILES
DO $$
DECLARE
    manager_id UUID := gen_random_uuid();
    sales_id UUID := gen_random_uuid();
BEGIN
    -- Bersihkan user lama jika ada (berdasarkan email)
    DELETE FROM auth.users WHERE email IN ('manager@ptsmart.id', 'sales@ptsmart.id');

    -- A. Insert User Manager
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, 
        email_confirmed_at, recovery_sent_at, last_sign_in_at,
        raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at, confirmation_token, email_change, 
        email_change_token_new, recovery_token
    ) VALUES (
        manager_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
        'manager@ptsmart.id', crypt('password123', gen_salt('bf')), 
        NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Budi Manager"}', 
        NOW(), NOW(), '', '', '', ''
    );

    -- B. Insert User Sales
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, 
        email_confirmed_at, recovery_sent_at, last_sign_in_at,
        raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at, confirmation_token, email_change, 
        email_change_token_new, recovery_token
    ) VALUES (
        sales_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
        'sales@ptsmart.id', crypt('password123', gen_salt('bf')), 
        NOW(), NOW(), NOW(),
        '{"provider":"email","providers":["email"]}', '{"full_name":"Ma''ruf Sales"}', 
        NOW(), NOW(), '', '', '', ''
    );

    -- C. INSERT/UPDATE Profiles
    -- Kita gunakan ON CONFLICT agar tidak error jika profil sudah ada
    INSERT INTO public.profiles (id, full_name, role, created_at)
    VALUES 
    (manager_id, 'Budi Manager', 'manager', NOW()),
    (sales_id, 'Ma''ruf Sales', 'sales', NOW())
    ON CONFLICT (id) DO UPDATE 
    SET role = EXCLUDED.role, full_name = EXCLUDED.full_name;

END $$;