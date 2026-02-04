# Official Notice Project Plan

## Overview
Official Notice is transaction infrastructure that ensures everyone who needs to know about a deadline knows — and everyone who needs a document has it.

## Part 1: Authentication & Identity
- [x] Backend: Laravel Sanctum integration
- [x] Frontend: Login/Register views
- [x] Identity: Stripe Identity integration (Step 1 of Virtual Notary)

## Part 2: Document Management
- [x] Backend: Document model and storage (S3)
- [ ] Frontend: Document CRUD and management UI
- [ ] Integration: Document to Transaction linking

## Part 3: AI Analysis & Extraction
- [x] Backend: OpenAI integration for date extraction
- [x] Backend: Plain-language summary generation
- [ ] Frontend: AI analysis dashboard/view

## Part 4: Milestone & Notification Engine
- [x] Backend: Milestone model and recurring rules (RRULE)
- [x] Backend: Notification service (Email, SMS via Twilio)
- [ ] Frontend: Milestone calendar and tracking

## Part 5: Virtual Notary (Face Matching)
- [x] Backend: AWS Rekognition integration
- [ ] Frontend: Photo capture and face matching UI

## Part 6: Feature Status Summary

| Feature | Backend | Frontend | Integration |
| :--- | :---: | :---: | :---: |
| Document Areas (CRUD) | ✅ | ✅ | ✅ |
| Document Upload & Analysis | ✅ | ✅ | ✅ |
| Critical Date Tracking | ✅ | ✅ | ✅ |
| Identity Verification (Stripe) | ✅ | ✅ | ✅ |
| Face Matching (AWS) | ✅ | ⚠️ | ⚠️ |
| Verified Signing Flow | ✅ | ✅ | ✅ |
| Notification Reminders | ✅ | N/A | N/A |
| Subscription/Billing | ⚠️ Table only | ❌ | ❌ |
| Team Management | ⚠️ Table only | ❌ | ❌ |

## Part 7: Billing & Team Operations
- [ ] Backend: Stripe Subscription logic
- [ ] Frontend: Subscription selection and payment
- [ ] Team: Organization and Member management

## Part 8: Audit & Compliance
- [x] Backend: Detailed audit logging
- [x] Backend: Secure document signing (ESIGN compliant)
