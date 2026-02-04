# AI Tools Platform - FINAL Service Mapping

## ✅ FINAL Corrected Service List

### **Frontend Apps (8 total - NOT 9)**

| Railway Service | Code Directory | Purpose |
|----------------|----------------|---------|
| taskjuggler | taskjuggler-web | TaskJuggler UI |
| 4calls | coordinator-web | Coordinator |
| URPA | urpa-web | URPA Scheduler |
| 4process | process-web | Process Management |
| 4projects | projects-web | Project Management |
| Site Health | scanner-web | Site Health Scanner |
| Idea Circuit | ideacircuit-web | Idea Circuit |
| Official Notice | official-notice-web | Official Notice |

### **Infrastructure (3 total)**

| Service | Type | Purpose |
|---------|------|---------|
| Postgres - AI TOOLs | Database | PostgreSQL database |
| Valkey-CTyp | Redis | Cache/Queue/Sessions |
| ai-tools-api | Laravel API | Platform API server |

### **NOT Part of AI Tools Platform**

| Service | Platform | Notes |
|---------|----------|-------|
| ~~4Doctors~~ | **Separate Platform** | Has its own platform - DO NOT include |
| ~~4doctors-web~~ | **Separate Platform** | Not part of AI Tools |

### **Services to DELETE**

| Service | Reason |
|---------|--------|
| horizon | Not needed - Horizon runs inside ai-tools-api |
| AI Storage??? | Not needed - empty service |

---

## 📊 Complete AI Tools Platform Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AI TOOLS PLATFORM                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📦 INFRASTRUCTURE (3)                                   │
│  ├─ Postgres - AI TOOLs    (Database)                   │
│  ├─ Valkey-CTyp            (Redis)                      │
│  └─ ai-tools-api           (Laravel API)                │
│                                                          │
│  🎨 FRONTEND APPS (8)                                    │
│  ├─ taskjuggler            (TaskJuggler UI)             │
│  ├─ 4calls                 (Coordinator)                │
│  ├─ URPA                   (Scheduler)                  │
│  ├─ 4process               (Process Mgmt)               │
│  ├─ 4projects              (Project Mgmt)               │
│  ├─ Site Health            (Scanner)                    │
│  ├─ Idea Circuit           (Ideas)                      │
│  └─ Official Notice        (Legal Notices)              │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              4HEALTHCARE PLATFORM (SEPARATE)             │
├─────────────────────────────────────────────────────────┤
│  • 4Doctors (4doctors-web)                              │
│  • Has its own database, API, infrastructure            │
│  • NOT part of AI Tools deployment                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 What You Currently Have (Correct)

### ✅ **8 Frontend Services** (All correct!)
1. taskjuggler ✅
2. 4calls (Coordinator) ✅
3. URPA ✅
4. 4process ✅
5. 4projects ✅
6. Site Health ✅
7. Idea Circuit ✅
8. Official Notice ✅

### ✅ **3 Infrastructure Services**
1. Postgres - AI TOOLs ✅
2. Valkey-CTyp ✅ (needs config fix)
3. ai-tools-api ✅

### ❌ **Services to Remove**
1. horizon (delete)
2. AI Storage??? (delete)

---

## 📝 Updated Action Plan

### Priority 1: Fix Valkey-CTyp (CRITICAL)
1. Go to Valkey-CTyp service in Railway
2. Delete ALL environment variables
3. Restart service
4. Verify it starts successfully

### Priority 2: Clean Up
1. Delete "horizon" service
2. Delete "AI Storage???" service

### Priority 3: Update Environment Variables
Run the quick fix script:
```bash
cd /Users/johnshine/Dropbox/Fibonacco/taskjuggler/Code
./quick-fix-current-setup.sh
```

This will:
- Set REDIS_HOST to Valkey-CTyp.railway.internal
- Update all 8 frontend services with correct API URL

### Priority 4: Redeploy All Services
After Valkey is fixed and variables are updated:
1. Trigger redeployments (or push empty commit)
2. All services should pick up the start scripts we added
3. Everything should deploy successfully

---

## ✅ Final Checklist

**Infrastructure:**
- [ ] Postgres - AI TOOLs online
- [ ] Valkey-CTyp online (after config fix)
- [ ] ai-tools-api deployed

**Frontend Apps (8):**
- [ ] taskjuggler deployed
- [ ] 4calls deployed
- [ ] URPA deployed
- [ ] 4process deployed
- [ ] 4projects deployed
- [ ] Site Health deployed
- [ ] Idea Circuit deployed
- [ ] Official Notice deployed

**Cleanup:**
- [ ] horizon deleted
- [ ] AI Storage??? deleted

**NOT Included:**
- [ ] 4Doctors (on separate platform)

---

## 🔧 Environment Variables Summary

### All Frontend Services Need:
```bash
VITE_API_URL=https://ai-tools-api-production.up.railway.app
NODE_ENV=production
```

### ai-tools-api Needs:
```bash
# Database
DATABASE_URL=postgresql://postgres:FzULulOrNbBNaiUkYutiRcTQMSqPlhhR@postgres-ea870ea6.railway.internal:5432/railway

# Redis
REDIS_HOST=Valkey-CTyp.railway.internal
REDIS_PORT=6379
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# App
APP_NAME=AI Tools API
APP_ENV=production
APP_DEBUG=false
APP_KEY=[generated]
```

---

## 📁 Code Directories in Monorepo

**Part of AI Tools Platform:**
- taskjuggler-api/ ✅
- taskjuggler-web/ ✅
- coordinator-web/ ✅
- urpa-web/ ✅
- process-web/ ✅
- projects-web/ ✅
- scanner-web/ ✅
- ideacircuit-web/ ✅
- official-notice-web/ ✅

**NOT Part of AI Tools Platform:**
- 4doctors-web/ ❌ (separate platform)
- taskjuggler-app/ ❌ (mobile app, not for Railway)

---

**Perfect! So you have exactly 8 frontend apps + 3 infrastructure services = 11 total services for AI Tools platform. 4Doctors is separate and should not be included.** 🎯
