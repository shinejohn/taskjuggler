-- Check users table structure
-- Run this in Railway PostgreSQL Query tab

-- 1. Check all columns in users table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 2. Check if current_profile_id column exists
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'current_profile_id'
    ) THEN '✅ current_profile_id exists' ELSE '❌ current_profile_id MISSING' END as current_profile_id_check;

-- 3. Check test user and their profile
SELECT 
    u.id,
    u.email,
    u.name,
    u.current_profile_id,
    p.name as profile_name,
    p.slug as profile_slug
FROM users u
LEFT JOIN profiles p ON p.id = u.current_profile_id
WHERE u.email = 'test@taskjuggler.com';

-- 4. Check if test user has a profile linked
SELECT 
    u.id as user_id,
    u.email,
    p.id as profile_id,
    p.name as profile_name,
    p.is_default
FROM users u
LEFT JOIN profiles p ON p.user_id = u.id AND p.is_default = true
WHERE u.email = 'test@taskjuggler.com';

