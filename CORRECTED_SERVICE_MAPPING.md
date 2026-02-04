# AI Tools Platform - CORRECTED Service Mapping

## 📸 Current Railway Setup (Corrected)

### ✅ **AI Tool Apps** (Frontend Services - 8 total)

| Railway Service Name | Code Directory | App Name | Status |
|---------------------|----------------|----------|--------|
| taskjuggler | taskjuggler-web | TaskJuggler Web | ❌ Build failed |
| 4calls | coordinator-web | **Coordinator** | ❌ Build failed |
| URPA | urpa-web | URPA Scheduler | ❌ Build failed |
| 4process | process-web | 4Process | ❌ Build failed |
| 4projects | projects-web | 4Projects | ❌ Build failed |
| Site Health | scanner-web | Site Health Scanner | ❌ Build failed |
| Idea Circuit | ideacircuit-web | Idea Circuit | ❌ Build failed |
| Official Notice | official-notice-web | Official Notice | ❌ Build failed |

### ✅ **AI Tool Back End** (Infrastructure - 5 total)

| Service Name | Type | Status | Notes |
|-------------|------|--------|-------|
| Postgres - AI TOOLs | Database | ✅ Online | Correct |
| Valkey-CTyp | Redis | ❌ Crashed 7h ago | **Needs restart** |
| ai-tools-api | Laravel API | ❌ Build failed | Correct name |
| horizon | Service | ❌ Build failed | **Delete - not needed** |
| AI Storage??? | Empty | Empty | **Delete - not needed** |

---

## 🔍 CORRECTED Analysis

### **What You Have (8 Frontend Apps):**

1. ✅ **taskjuggler** → taskjuggler-web (TaskJuggler)
2. ✅ **4calls** → coordinator-web (Coordinator) ← **This is correct!**
3. ✅ **URPA** → urpa-web (URPA Scheduler)
4. ✅ **4process** → process-web (4Process)
5. ✅ **4projects** → projects-web (4Projects)
6. ✅ **Site Health** → scanner-web (Site Health Scanner)
7. ✅ **Idea Circuit** → ideacircuit-web (Idea Circuit)
8. ✅ **Official Notice** → official-notice-web (Official Notice)

### **What You're Missing (1 Frontend App):**

9. ❌ **4Doctors** → 4doctors-web (4Healthcare) ← **MISSING!**

---

## 📋 Corrected Service List

### **Should Have (Total: 12 services)**

**Frontend Apps (9):**
- [x] taskjuggler (for taskjuggler-web)
- [x] 4calls (for coordinator-web) ← **Correct!**
- [x] URPA (for urpa-web)
- [x] 4process (for process-web)
- [x] 4projects (for projects-web)
- [x] Site Health (for scanner-web)
- [x] Idea Circuit (for ideacircuit-web)
- [x] Official Notice (for official-notice-web)
- [ ] **4Doctors** (for 4doctors-web) ← **MISSING - Need to create!**

**Infrastructure (3):**
- [x] Postgres - AI TOOLs
- [x] Valkey-CTyp
- [x] ai-tools-api

**Remove (2):**
- [x] horizon (delete)
- [x] AI Storage??? (delete)

---

## 🎯 CORRECTED Action Plan

### Step 1: Restart Valkey-CTyp (CRITICAL)
This is crashed and everything needs it!

### Step 2: Delete Unnecessary Services
- Delete "horizon"
- Delete "AI Storage???"

### Step 3: Create Missing Service - 4Doctors

**Create new service in Railway:**
```
Service Name: 4Doctors
Repository: shinejohn/taskjuggler
Root Directory: 4doctors-web
Environment Variables:
  VITE_API_URL=https://ai-tools-api-production.up.railway.app
  NODE_ENV=production
  APP_NAME=4Healthcare
  VITE_APP_NAME=4Healthcare
```

### Step 4: Update Environment Variables

All services need the correct API URL and Redis host:

```bash
# Update Redis host
railway variables --set "REDIS_HOST=Valkey-CTyp.railway.internal"

# Update all frontend services
API_URL="https://ai-tools-api-production.up.railway.app"

railway variables --service "taskjuggler" --set "VITE_API_URL=${API_URL}"
railway variables --service "4calls" --set "VITE_API_URL=${API_URL}"
railway variables --service "URPA" --set "VITE_API_URL=${API_URL}"
railway variables --service "4process" --set "VITE_API_URL=${API_URL}"
railway variables --service "4projects" --set "VITE_API_URL=${API_URL}"
railway variables --service "Site Health" --set "VITE_API_URL=${API_URL}"
railway variables --service "Idea Circuit" --set "VITE_API_URL=${API_URL}"
railway variables --service "Official Notice" --set "VITE_API_URL=${API_URL}"

# After creating 4Doctors:
railway variables --service "4Doctors" --set "VITE_API_URL=${API_URL}"
```

### Step 5: Trigger Redeployments

After fixing variables, redeploy all services to pick up the start scripts we added.

---

## 📊 Complete Service Mapping

| Railway Service | Code Directory | Purpose | Status |
|----------------|----------------|---------|--------|
| **Frontend Apps** |
| taskjuggler | taskjuggler-web | TaskJuggler UI | ✅ Exists |
| 4calls | coordinator-web | Coordinator | ✅ Exists |
| **4Doctors** | 4doctors-web | 4Healthcare | ❌ **MISSING** |
| URPA | urpa-web | Scheduler | ✅ Exists |
| 4process | process-web | Process Mgmt | ✅ Exists |
| 4projects | projects-web | Project Mgmt | ✅ Exists |
| Site Health | scanner-web | Site Scanner | ✅ Exists |
| Idea Circuit | ideacircuit-web | Ideas | ✅ Exists |
| Official Notice | official-notice-web | Legal Notices | ✅ Exists |
| **Backend** |
| ai-tools-api | taskjuggler-api | Platform API | ✅ Exists |
| Postgres - AI TOOLs | (managed) | Database | ✅ Exists |
| Valkey-CTyp | (managed) | Redis | ✅ Exists (crashed) |

---

## 🚨 Priority Actions (In Order)

1. **Restart Valkey-CTyp** ← Do NOW! Everything is broken without this
2. **Delete horizon and AI Storage???** ← Cleanup
3. **Create 4Doctors service** ← Missing healthcare app
4. **Update REDIS_HOST** to Valkey-CTyp.railway.internal
5. **Update all VITE_API_URL** to point to ai-tools-api
6. **Redeploy all services** ← Pick up start scripts

---

## ✅ What's Actually Correct

- ✅ You have 8 of 9 frontend apps
- ✅ ai-tools-api is correctly named
- ✅ Postgres - AI TOOLs exists
- ✅ Valkey-CTyp exists (just needs restart)
- ✅ **4calls = Coordinator** is correct!

## ❌ What Needs Fixing

- ❌ Valkey-CTyp crashed (restart it)
- ❌ Missing 4Doctors service (create it)
- ❌ horizon service exists (delete it)
- ❌ AI Storage??? exists (delete it)
- ❌ All builds failing (need to redeploy with start scripts)

---

**So the only MISSING app is 4Doctors (4Healthcare)! Everything else is there, just needs configuration fixes and redeployment.** 🎯
