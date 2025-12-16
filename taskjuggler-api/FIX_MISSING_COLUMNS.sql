-- Fix missing columns in users table
-- Run this in Railway PostgreSQL Query tab

-- Step 1: Add current_profile_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'current_profile_id'
    ) THEN
        ALTER TABLE users ADD COLUMN current_profile_id UUID;
        CREATE INDEX IF NOT EXISTS idx_users_current_profile_id ON users(current_profile_id);
        
        -- Add foreign key constraint
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
            ALTER TABLE users 
            ADD CONSTRAINT fk_users_current_profile_id 
            FOREIGN KEY (current_profile_id) REFERENCES profiles(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

-- Step 2: Ensure all users have a default profile and current_profile_id set
DO $$
DECLARE
    v_user_record RECORD;
    v_profile_id UUID;
BEGIN
    -- Loop through all users who don't have a current_profile_id
    FOR v_user_record IN 
        SELECT id, email FROM users WHERE current_profile_id IS NULL
    LOOP
        -- Check if user has a default profile
        SELECT id INTO v_profile_id 
        FROM profiles 
        WHERE user_id = v_user_record.id AND is_default = true 
        LIMIT 1;
        
        -- If no default profile exists, create one
        IF v_profile_id IS NULL THEN
            INSERT INTO profiles (id, user_id, name, slug, is_default, settings, created_at, updated_at)
            VALUES (
                gen_random_uuid(),
                v_user_record.id,
                'Default',
                'default',
                true,
                '{}'::jsonb,
                NOW(),
                NOW()
            )
            RETURNING id INTO v_profile_id;
        END IF;
        
        -- Update user's current_profile_id
        UPDATE users 
        SET current_profile_id = v_profile_id
        WHERE id = v_user_record.id;
    END LOOP;
END $$;

-- Step 3: Verify the fix
SELECT 
    u.id,
    u.email,
    u.current_profile_id,
    p.name as profile_name,
    p.is_default
FROM users u
LEFT JOIN profiles p ON p.id = u.current_profile_id
WHERE u.email = 'test@taskjuggler.com';

-- Expected: Should show test user with current_profile_id set and linked to a profile

