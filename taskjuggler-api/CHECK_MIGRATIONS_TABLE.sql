-- Check what migrations Laravel thinks have run
-- Run this in Railway PostgreSQL → Data → Click on 'migrations' table

SELECT * FROM migrations ORDER BY id DESC LIMIT 20;

-- This will show which migrations Laravel thinks have run
-- If you see entries for migrations that didn't create tables, that's the problem

