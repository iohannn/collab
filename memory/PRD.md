# colaboreaza.ro - Product Requirements Document

## Overview
**Product Name:** colaboreaza.ro  
**Type:** Reverse Influencer Marketplace MVP  
**Date Created:** 2026-02-05  
**Status:** MVP Complete

---

## Original Problem Statement
Build a web-based platform called "colaboreaza.ro" - a reverse influencer marketplace where:
- Brands post collaboration offers publicly
- Influencers apply to those offers
- Prices, deliverables, and deadlines are transparent
- Collaborations are closed fast (48h max)

**User Choices:**
- Authentication: Both JWT email/password + Google OAuth
- Design Theme: Light/neutral (trust-focused, minimal)
- Language: Romanian default + English with language switcher
- Monetization: Stripe test mode integration

---

## User Personas

### Brand Users
- Marketing managers looking for influencer partnerships
- Small business owners seeking content creators
- Agencies managing multiple campaigns

### Influencer/Creator Users
- Content creators on Instagram, TikTok, YouTube
- Looking for paid brand collaborations
- Want transparent pricing and quick deals

---

## Core Requirements

### Authentication
- [x] Email/password registration and login
- [x] Google OAuth via Emergent Auth
- [x] JWT tokens for session management
- [x] Protected routes for dashboards

### Brand Features
- [x] Create collaborations with full details
- [x] Set budget (min/max), deadline, platform
- [x] Define deliverables
- [x] View and manage applicants
- [x] Accept/reject applications
- [x] Track active/closed/completed collaborations

### Influencer Features
- [x] Create and edit public profile
- [x] Set pricing (per post, story, bundle)
- [x] Add platforms and niches
- [x] Browse public collaborations
- [x] Apply to collaborations
- [x] Track application status

### Public Features
- [x] View collaborations without login (FOMO)
- [x] SEO-friendly influencer profile URLs
- [x] Countdown timers on collaborations
- [x] Applicant count display
- [x] Platform filtering

### Monetization
- [x] Stripe integration in test mode
- [x] PRO plan for brands (€29/month)
- [x] Featured placement for influencers (€9/week)
- [x] Payment status polling

---

## What's Been Implemented (2026-02-05)

### Backend (FastAPI + MongoDB)
- Complete REST API with 15+ endpoints
- JWT authentication + Google OAuth session handling
- User, Collaboration, Application, Payment models
- Stripe checkout integration
- Public stats endpoint

### Frontend (React)
- Landing page with stats, CTA, brand marquee
- Login/Register pages with Google OAuth
- Brand Dashboard with collaboration management
- Influencer Dashboard with profile editor
- Public collaboration listings with filters
- Collaboration detail page with apply modal
- Public influencer profiles
- Pricing page with Stripe checkout
- Romanian/English language switcher
- Responsive design with Outfit/Satoshi fonts
- Electric Orange (#FF4F00) as primary color

### Design
- Light theme with high-contrast elements
- Ticket-style collaboration cards
- Countdown timers with urgency styling
- Brand marquee animation
- Glass morphism header
- Clean dashboard layouts

---

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Email notifications for applications
- [ ] Admin panel for moderation
- [ ] Report user functionality

### P1 - High Priority
- [ ] Collaboration search by keyword
- [ ] Influencer verification badges
- [ ] Application messaging/chat
- [ ] Analytics dashboard for PRO users

### P2 - Medium Priority  
- [ ] Social media verification (connect accounts)
- [ ] Portfolio/media uploads
- [ ] Review/rating system
- [ ] Saved collaborations

### P3 - Nice to Have
- [ ] Mobile app (React Native)
- [ ] Collaboration templates
- [ ] Bulk application management
- [ ] Export data features

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Tailwind CSS, Shadcn/UI |
| Backend | FastAPI, Python |
| Database | MongoDB |
| Auth | JWT + Emergent Google OAuth |
| Payments | Stripe (test mode) |
| Hosting | Kubernetes (Emergent) |

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login with email/password |
| POST | /api/auth/session | Exchange Google OAuth session |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/logout | Logout |
| GET/POST | /api/brands/profile | Brand profile |
| GET/POST | /api/influencers/profile | Influencer profile |
| GET | /api/influencers/{username} | Public profile |
| GET | /api/influencers | List influencers |
| POST | /api/collaborations | Create collaboration |
| GET | /api/collaborations | List public collaborations |
| GET | /api/collaborations/my | User's collaborations |
| GET | /api/collaborations/{id} | Single collaboration |
| PATCH | /api/collaborations/{id}/status | Update status |
| POST | /api/applications | Apply to collaboration |
| GET | /api/applications/my | My applications |
| GET | /api/applications/collab/{id} | Collaboration applications |
| PATCH | /api/applications/{id}/status | Accept/reject |
| POST | /api/payments/checkout | Create Stripe checkout |
| GET | /api/payments/status/{id} | Check payment status |
| GET | /api/stats/public | Public stats |

---

## Next Actions

1. **Add email notifications** - Alert brands when they receive applications
2. **Implement admin panel** - For moderation and user management
3. **Add search functionality** - Full-text search for collaborations
4. **Improve onboarding** - Guide new users through profile setup
5. **Add analytics** - Track views, applications, conversion rates
