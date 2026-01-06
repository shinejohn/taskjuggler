# 🔐 4calls.ai Test Credentials

## Login Information

**Email:** `test@4calls.ai`  
**Password:** `password123`

## What's Included

This test account includes:
- ✅ User account (test@4calls.ai)
- ✅ Organization: "Test Organization"
- ✅ Coordinator: "Sally" (Receptionist role)
- ✅ Role Template: "Receptionist"
- ✅ Persona Template: "Friendly Professional"

## How to Use

1. Navigate to your deployed frontend URL
2. Click "Login"
3. Enter the credentials above
4. You'll be redirected to the dashboard
5. You should see:
   - Your organization
   - Coordinator "Sally"
   - Dashboard metrics
   - All pages accessible

## Creating Additional Test Users

You can create more test users by:
1. Using the registration page (`/register`)
2. Or running the seeder again (it uses `firstOrCreate` so won't duplicate)

## Notes

- The test user is created by `CoordinatorTestUserSeeder`
- Set `APP_SEED_DB=true` in ECS task definition to enable seeding
- After first deployment, set `APP_SEED_DB=false` to prevent re-seeding

