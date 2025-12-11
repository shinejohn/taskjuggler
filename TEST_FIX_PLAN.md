# Test Fix Plan - Execution Plan

**Date:** December 11, 2024  
**Status:** 🔧 **EXECUTING**

---

## ISSUES IDENTIFIED

### Issue 1: Team Members Table Conflict ⚠️ CRITICAL

**Problem:** Two different `team_members` table structures:
- **Old (2025_12_09_175031):** `owner_id`, `user_id`, `name`, `email`, `phone`, `role` (for contact management)
- **New (2025_12_11_300000):** `team_id`, `user_id`, `is_admin`, `joined_at` (for Teams feature)

**Error:** `no such column: team_members.team_id`

**Root Cause:** Old migration creates table first, new migration skips creation due to `hasTable()` check, but Team model expects new structure.

**Solution:** Rename old table to `contact_team_members` or drop it if not used.

---

### Issue 2: API Response Format Mismatch ⚠️ HIGH

**Problem:** Tests expect `response.json('team.name')` but response may have different structure.

**Error:** Assertion failures on response format

**Solution:** Check actual response format and fix tests or controller.

---

### Issue 3: Database Relationship Issues ⚠️ HIGH

**Problem:** Team model relationships expect new table structure but old structure exists.

**Solution:** Fix table structure conflict first.

---

## FIX PLAN

### Step 1: Fix Team Members Table Conflict

**Action:** Rename old `team_members` table to `contact_team_members`

**Files to Modify:**
1. `database/migrations/2025_12_09_175031_create_team_members_table.php` - Rename table
2. Check if any models reference old table - update if needed

---

### Step 2: Fix API Response Format

**Action:** Verify controller response format matches test expectations

**Files to Check:**
1. `app/Http/Controllers/Api/TeamController.php` - Check `store()` method
2. `app/Http/Controllers/Api/TaskController.php` - Check message methods
3. `app/Http/Controllers/Api/DirectMessageController.php` - Check response format

---

### Step 3: Fix Test Assertions

**Action:** Update tests to match actual API responses

**Files to Modify:**
1. `tests/Feature/TeamsApiTest.php`
2. `tests/Feature/TaskMessagesApiTest.php`
3. `tests/Feature/DirectMessagesApiTest.php`

---

### Step 4: Re-run Tests

**Action:** Verify all fixes work

---

## EXECUTION ORDER

1. ✅ Rename old team_members table
2. ✅ Fix API response formats
3. ✅ Update test assertions
4. ✅ Re-run tests
5. ✅ Generate final report
