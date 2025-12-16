-- ============================================================
-- CREATE TEST USER FOR TASK JUGGLER
-- Run this in Railway PostgreSQL Dashboard -> Data -> Query
-- ============================================================
-- Credentials:
-- Email: test@taskjuggler.com
-- Password: Test1234!
-- ============================================================

-- Step 1: Check if current_profile_id column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'current_profile_id'
    ) THEN
        ALTER TABLE users ADD COLUMN current_profile_id UUID;
        CREATE INDEX IF NOT EXISTS idx_users_current_profile_id ON users(current_profile_id);
        
        -- Add foreign key if profiles table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
            ALTER TABLE users 
            ADD CONSTRAINT fk_users_current_profile_id 
            FOREIGN KEY (current_profile_id) REFERENCES profiles(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

-- Step 2: Insert or update test user
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
RETURNING id, email, name;

-- Step 3: Create default profile for the user (if profiles table exists)
DO $$
DECLARE
    v_user_id UUID;
    v_profile_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id FROM users WHERE email = 'test@taskjuggler.com';
    
    -- Only create profile if profiles table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Create profile if it doesn't exist
        INSERT INTO profiles (id, user_id, name, slug, is_default, settings, created_at, updated_at)
        SELECT 
            gen_random_uuid(),
            v_user_id,
            'Default',
            'default',
            true,
            '{}'::jsonb,
            NOW(),
            NOW()
        WHERE NOT EXISTS (
            SELECT 1 FROM profiles p WHERE p.user_id = v_user_id AND p.is_default = true
        )
        RETURNING id INTO v_profile_id;
        
        -- Get profile ID if it already existed
        IF v_profile_id IS NULL THEN
            SELECT id INTO v_profile_id FROM profiles WHERE user_id = v_user_id AND is_default = true LIMIT 1;
        END IF;
        
        -- Update user's current_profile_id if column exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'current_profile_id'
        ) THEN
            UPDATE users 
            SET current_profile_id = v_profile_id
            WHERE id = v_user_id AND current_profile_id IS NULL;
        END IF;
    END IF;
END $$;

-- Step 4: Verification query
SELECT 
    u.id,
    u.name,
    u.email,
    u.current_profile_id,
    p.name as profile_name,
    p.slug as profile_slug
FROM users u
LEFT JOIN profiles p ON p.id = u.current_profile_id
WHERE u.email = 'test@taskjuggler.com';

-- Expected output:
-- id | name      | email                  | current_profile_id | profile_name | profile_slug
-- ---|-----------|------------------------|--------------------|--------------|-------------
-- ...| Test User | test@taskjuggler.com  | ...                | Default      | default

