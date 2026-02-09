# colaboreaza.ro - Product Requirements Document

## Original Problem Statement
Build a web-based platform called "colaboreaza.ro", a reverse influencer marketplace where brands post public collaboration offers and influencers apply to them. The platform should prioritize speed, transparency, and viral growth.

## Architecture
- **Backend:** FastAPI (Python), MongoDB via Motor, JWT Auth + Emergent Google OAuth
- **Frontend:** React, Tailwind CSS, Shadcn UI, i18next (RO/EN)
- **Database:** MongoDB (test_database)
- **Payments:** Stripe (test mode)

## User Roles
- **Brand:** Create/manage collaboration posts, view applicants, review influencers
- **Influencer:** Create public profile, browse/apply for collaborations, manage social posts
- **Admin:** Moderate users/collaborations, manage commission rates, view reports

## Completed Features

### Phase 1 - Core (Complete)
- [x] JWT email/password authentication
- [x] Google Social Login (Emergent-managed)
- [x] Brand Dashboard (create/manage collaborations, view applicants)
- [x] Influencer Dashboard (profile management, apply for collaborations)
- [x] Public collaboration board with search
- [x] Public shareable influencer profiles
- [x] Landing page with live stats
- [x] Internationalization (RO/EN)

### Phase 2 (Complete)
- [x] Admin panel for moderation
- [x] Full-text search for collaborations
- [x] PRO Analytics dashboard (brand + influencer)
- [x] SMTP Email notifications infrastructure (needs user SMTP credentials)
- [x] Stripe payment integration (test mode) for PRO plans

### Phase 3 (Complete)
- [x] Mutual feedback/rating system (brand <-> influencer)
- [x] "Top 10 Influencers" leaderboard based on ratings

### Phase 4 (Complete - Dec 2025)
- [x] Social media post embedding (oEmbed for YouTube, TikTok, Instagram)
- [x] SocialPostsEditor in influencer dashboard (add/remove featured posts)
- [x] SocialPostsCarousel on public influencer profiles
- [x] Automated commission system (configurable rate, default 10%)
- [x] Admin commission management tab (view/update rate, history)
- [x] Commission auto-calculation on collaboration completion

## Pending / In Progress
- [ ] Email notifications: Infrastructure ready, user needs to configure SMTP credentials (EMAIL_ENABLED=false)

## Backlog / Future Tasks
- **P2: Gamification Badges** - Award badges ("Top Rated", "Verified") to influencer profiles based on rating and verification status
- **Refactoring:** Break down server.py monolith into modular structure (routers, models, services)
- **Lint cleanup:** Address React useEffect dependency warnings

## Key API Endpoints
- `/api/auth/{register, login, me, session, logout}`
- `/api/collaborations` (CRUD, search, status management)
- `/api/applications` (create, list, status management)
- `/api/influencers/{profile, top, list, {username}}`
- `/api/brands/profile`
- `/api/reviews` (create, list by user/application, pending)
- `/api/admin/{stats, users, collaborations, reports, commissions}`
- `/api/analytics/{brand, influencer}`
- `/api/payments/{checkout, status}`
- `/api/settings/commission` (GET/PUT, admin only)
- `/api/commission/calculate`
- `/api/oembed` (social post embedding)
- `/api/stats/public`

## DB Collections
- users, influencer_profiles, brand_profiles, collaborations, applications
- reviews, reports, payment_transactions, user_sessions
- commissions, settings

## Test Credentials
- Brand: testbrand_new@test.com / TestPass123
- Influencer: testinfluencer_new@test.com / TestPass123 (username: testcreator)
- Admin: admin2@colaboreaza.ro / AdminPass123 (is_admin=true in DB)

## Test Reports
- /app/test_reports/iteration_1.json through iteration_4.json
