-- Fix ALL missing tables and columns
-- Run this in Railway PostgreSQL Query tab

-- Step 1: Create personal_access_tokens table (Laravel Sanctum)
CREATE TABLE IF NOT EXISTS personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS personal_access_tokens_tokenable_type_tokenable_id_index 
ON personal_access_tokens(tokenable_type, tokenable_id);

-- Step 2: Add current_profile_id to users table
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
        
        RAISE NOTICE '✅ Added current_profile_id column';
    ELSE
        RAISE NOTICE '✅ current_profile_id column already exists';
    END IF;
END $$;

-- Step 3: Ensure all users have profiles and current_profile_id set
DO $$
DECLARE
    v_user_record RECORD;
    v_profile_id UUID;
    v_count INTEGER := 0;
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
        
        v_count := v_count + 1;
    END LOOP;
    
    RAISE NOTICE '✅ Updated % users with current_profile_id', v_count;
END $$;

-- Step 4: Verify everything is set up
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = 'personal_access_tokens'
    ) THEN '✅ personal_access_tokens table exists' ELSE '❌ personal_access_tokens MISSING' END as sanctum_check,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'current_profile_id'
    ) THEN '✅ current_profile_id exists' ELSE '❌ current_profile_id MISSING' END as profile_id_check;

-- Step 5: Verify test user
SELECT 
    u.id,
    u.email,
    u.current_profile_id,
    p.name as profile_name
FROM users u
LEFT JOIN profiles p ON p.id = u.current_profile_id
WHERE u.email = 'test@taskjuggler.com';

