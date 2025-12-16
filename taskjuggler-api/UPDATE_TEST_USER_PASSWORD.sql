-- Update password for existing test user
-- Password: Test1234!
-- Hash: $2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

UPDATE users 
SET 
    password = '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    updated_at = NOW()
WHERE email = 'test@taskjuggler.com'
RETURNING id, email, name;

-- Verify the update
SELECT 
    id,
    name,
    email,
    created_at,
    updated_at
FROM users 
WHERE email = 'test@taskjuggler.com';

