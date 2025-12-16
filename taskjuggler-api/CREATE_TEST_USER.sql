-- SQL Script to create test user for Task Juggler
-- Run this directly on your PostgreSQL database via Railway dashboard or psql
-- Password: Test1234!

-- Step 1: Insert or update test user
INSERT INTO users (id, name, email, password, timezone, plan, settings, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'Test User',
    'test@taskjuggler.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: Test1234!
    'America/New_York',
    'free',
    '{}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    updated_at = NOW()
RETURNING id, email;

-- Step 2: Create default profile for the user (if it doesn't exist)
INSERT INTO profiles (id, user_id, name, slug, is_default, settings, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    u.id,
    'Default',
    'default',
    true,
    '{}'::jsonb,
    NOW(),
    NOW()
FROM users u
WHERE u.email = 'test@taskjuggler.com'
AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.user_id = u.id AND p.is_default = true
);

-- Step 3: Update user's current_profile_id
UPDATE users u
SET current_profile_id = (
    SELECT p.id FROM profiles p 
    WHERE p.user_id = u.id AND p.is_default = true 
    LIMIT 1
)
WHERE u.email = 'test@taskjuggler.com'
AND u.current_profile_id IS NULL;

-- Verification query (run this to verify the user was created)
SELECT 
    u.id,
    u.name,
    u.email,
    u.current_profile_id,
    p.name as profile_name
FROM users u
LEFT JOIN profiles p ON p.id = u.current_profile_id
WHERE u.email = 'test@taskjuggler.com';

