# PropConnect: Feature Priority Matrix & Implementation Roadmap
## MVP, Phase 2, and Scale Phases Mapped to Market Demands

---

## Executive Summary

This document translates market research into a **prioritized feature roadmap**, showing WHAT to build, WHEN to build it, and WHY based on market data and user feedback. It includes:

- **MVP Features** (Phase 1, Months 1-3): Minimum viable feature set to launch and test P2P viability
- **Phase 2 Features** (Months 4-12): Expand buyer-side tools and platform reach
- **Scale Features** (Year 2+): Enterprise partnerships, legal services, international expansion

Each feature includes:
- **Market Justification** (why)
- **User Pain Point Addressed** (what problem solved)
- **Success Metrics** (how to measure)
- **Implementation Guidance** (rough complexity/effort)

---

## MVP PHASE: MONTH 1-3 (Launch Window)

### Goal
Launch a **minimal, tested P2P platform** in 2-3 Tier-2 Italian cities (Bologna, Palermo, Naples) to validate product-market fit and acquire first 100-200 listings.

### MVP Feature Set

#### 1. SELLER LISTING CREATION (5-Step Form)
**Market Justification**:
- User pain point: "Overwhelming forms on Immobiliare.it" → simplify to 5 steps
- Competitive advantage: Faster listing creation than agent-assisted

**Features**:
- ✅ Step 1: Basic Info (type, location, size, rooms)
- ✅ Step 2: Highlights (checkboxes: terrace, garage, energy rating)
- ✅ Step 3: Photos (min 5, max 20)
- ✅ Step 4: Price & Legal Checklist (tax calc, disclosure form)
- ✅ Step 5: Review & Publish

**Pain Point Addressed**:
- "I'm terrified of missing a legal requirement" → Legal checklist upfront
- "How do I know if my price is fair?" → Price calculator with comps

**Success Metrics**:
- Listing completion rate: >80% (users who start, finish)
- Time to publish: <10 minutes avg
- Legal checklist completion: >85%

**Implementation Effort**:
- Backend: Forms schema, file uploads, price API integration (~40 hrs)
- Frontend: React forms, mobile responsive (~30 hrs)
- Total: ~70 hrs (Medium)

---

#### 2. SEARCH & DISCOVERY (Map + List View)
**Market Justification**:
- Buyer pain: "Too many agent listings mixed with private sellers" → dedicated P2P listings
- Competitive advantage: Clean, simple search vs. cluttered Immobiliare.it

**Features**:
- ✅ Search bar: location, price range, rooms, sqft
- ✅ Dual map + list view (desktop only for MVP)
- ✅ Listing cards with photo, price, key specs, seller verification badge
- ✅ Save searches (requires login)

**Pain Point Addressed**:
- "How do I find private sellers only?" → All listings are P2P (no agents)
- "I don't trust unverified sellers" → Verification badges visible

**Success Metrics**:
- Search query completion rate: >70%
- Click-through from listing card to detail: >25%
- Mobile traffic share: >40%

**Implementation Effort**:
- Backend: Search API, database indexing (~60 hrs)
- Frontend: Map integration (Leaflet/Mapbox), list rendering (~50 hrs)
- Total: ~110 hrs (Medium-High)

---

#### 3. PROPERTY DETAIL PAGE
**Market Justification**:
- Buyer pain: "Incomplete info on Facebook Marketplace" → comprehensive details
- Competitive advantage: Trust signals (seller verified, cost breakdown, Q&A)

**Features**:
- ✅ Photo gallery (swipeable on mobile)
- ✅ Key specs, price, energy rating
- ✅ Seller info + verification badge + seller reviews
- ✅ Cost breakdown (taxes, notary, total cost to buyer)
- ✅ Location map + nearby amenities
- ✅ Building info (age, heating, maintenance fees)
- ✅ Questions & Answers section (crowdsourced clarity)

**Pain Point Addressed**:
- "What are the hidden costs?" → Full cost breakdown
- "Is this seller trustworthy?" → Verification badge + reviews + Q&A
- "Is this property in a good neighborhood?" → Location detail + amenities

**Success Metrics**:
- Page load time: <2 seconds (p95)
- Q&A section engagement: >20% of visitors ask/answer
- Inquiry rate from detail page: >15% of visitors

**Implementation Effort**:
- Backend: Detail data schema, Q&A database (~50 hrs)
- Frontend: Gallery, cost calculator, maps (~60 hrs)
- Total: ~110 hrs (Medium-High)

---

#### 4. BUYER INQUIRY & VERIFICATION
**Market Justification**:
- Seller pain: "Half my inquiries are scams or agents" → verification filters
- Buyer pain: "Unqualified sellers waste my time" → signal serious intent
- Competitive advantage: Verification reduces friction for both sides

**Features**:
- ✅ Inquiry form: name, email, phone, buyer type (private/investor/agent), financing status
- ✅ SMS phone verification (OTP)
- ✅ Financing pre-approval upload (optional but valued)
- ✅ Verification badges on seller dashboard (green/yellow/red status)
- ✅ Seller can filter by verification status
- ✅ Seller can block/report suspicious inquiries

**Pain Point Addressed**:
- Seller: "How do I know which inquiries are serious?" → Verification status visible
- Buyer: "I don't want my info given to just anyone" → Selective, verified sharing
- Platform: Reduce fraud → verification layer

**Success Metrics**:
- Verification completion rate: >80%
- Buyer report rate (false inquiries): <5%
- Seller response time (to verified inquiries): <24 hrs

**Implementation Effort**:
- Backend: Verification logic, SMS integration, data privacy (~80 hrs)
- Frontend: Inquiry form, verification UX, seller dashboard filtering (~60 hrs)
- Total: ~140 hrs (High)

---

#### 5. MESSAGING HUB (In-App Chat)
**Market Justification**:
- Seller pain: "Managing calls, WhatsApp, emails is exhausting" → centralized messaging
- Buyer pain: "I don't know if I'm contacting the right person" → official channel

**Features**:
- ✅ 1-on-1 messaging between buyer and seller
- ✅ All conversations threaded in one inbox
- ✅ Search/filter messages
- ✅ Notifications (push, email, SMS optional)
- ✅ Read receipts
- ✅ Block/report users

**Pain Point Addressed**:
- "I spend hours coordinating on different platforms" → Everything in-app
- "Did they really say that?" → Searchable message history

**Success Metrics**:
- Message response time (seller): <4 hours avg
- Conversation completion rate (inquiry → viewing scheduled): >30%
- User satisfaction (NPS on messaging): >60

**Implementation Effort**:
- Backend: Chat DB, WebSocket for real-time, notifications (~100 hrs)
- Frontend: Chat UI, push notification integration (~60 hrs)
- Total: ~160 hrs (High)

---

#### 6. VIEWING SCHEDULER (Calendar Integration)
**Market Justification**:
- Seller pain: "Managing showing times on WhatsApp is chaotic" → calendar
- Buyer pain: "I can't coordinate times; seller never confirms" → automatic reminders

**Features**:
- ✅ Calendar UI showing available times (seller controls availability)
- ✅ Buyer selects preferred time slot
- ✅ Auto-confirmation message to both parties
- ✅ SMS/push reminders (24 hrs before, 1 hr before)
- ✅ Reschedule/cancel with reason

**Pain Point Addressed**:
- "I spent 10 hours on the phone scheduling showings" → Calendar UI self-service
- "Half the showings were canceled last-minute" → Reminders reduce no-shows

**Success Metrics**:
- Showing confirmation rate: >85%
- No-show rate: <15% (vs. typical 30-40% for phone scheduling)
- Buyer satisfaction (NPS on scheduler): >55

**Implementation Effort**:
- Backend: Calendar logic, availability management (~40 hrs)
- Frontend: Calendar UX, reminder notifications (~40 hrs)
- Total: ~80 hrs (Medium)

---

#### 7. SELLER DASHBOARD (Listing Management)
**Market Justification**:
- Seller pain: "I don't know if my listing is working" → centralized dashboard
- Competitive advantage: Analytics transparency vs. agent opacity

**Features**:
- ✅ Listing status (live, paused, sold)
- ✅ Quick stats: views, inquiries, scheduled viewings
- ✅ Inquiry inbox (filtered by verification status)
- ✅ Ability to edit listing, change price, add photos
- ✅ Performance tips ("Your price is 15% above average, consider reducing")
- ✅ Bulk actions (pause, remove, archive)

**Pain Point Addressed**:
- "Is my listing working?" → Transparent view counts + inquiries
- "I want to adjust my price mid-sale" → Easy price edit
- "How do I compare to other sellers?" → Performance tips

**Success Metrics**:
- Dashboard login rate: >60% of sellers (repeat engagement)
- Price adjustment rate: >20% (sellers use data to optimize)
- Seller NPS: >50

**Implementation Effort**:
- Backend: Analytics aggregation, data queries (~60 hrs)
- Frontend: Dashboard charts, listing management UI (~50 hrs)
- Total: ~110 hrs (Medium-High)

---

#### 8. LEGAL TEMPLATES & EDUCATION CONTENT
**Market Justification**:
- Seller pain: "I'm terrified I'll miss a legal requirement" → templates + guides
- Competitive advantage: Education reduces trust barrier (vs. Facebook Marketplace chaos)

**Features**:
- ✅ Disclosure form template (Italian law 129/1994 compliant)
- ✅ Simple "How to Sell Privately in Italy" guide (step-by-step, visual)
- ✅ FAQ: taxes, notary, buyer protection, closing process
- ✅ Glossary: Italian real estate terms (catasto, imposta, etc.)
- ✅ Partner links: notary finders, tax advisors (affiliate revenue)

**Pain Point Addressed**:
- "What am I legally required to disclose?" → Checklist + template
- "What happens at closing?" → Step-by-step guide
- "What does 'catasto' mean?" → Glossary

**Success Metrics**:
- Guide completion rate: >40% of sellers
- FAQ views: >3 per seller (repeat education)
- Legal dispute rate (seller complaints): <2%

**Implementation Effort**:
- Content: Write guides, FAQs, glossary (~40 hrs)
- Frontend: Help center UI (~20 hrs)
- Partnerships: Vet notaries, tax advisors (~20 hrs)
- Total: ~80 hrs (Medium)

---

### MVP Phase 1: Total Effort Estimate
**Total Development Hours**: ~950 hours (~6-7 months with one full-time developer + one designer)

**Accelerators**:
- Use no-code backend (Firebase, Supabase) initially → save ~200 hrs
- Use template UI components (Material UI, Tailwind) → save ~150 hrs
- Partner with existing payment/SMS providers → save ~100 hrs

**Realistic Accelerated Timeline**: 3-4 months with 2 developers + 1 designer

---

## PHASE 2: MONTHS 4-12 (Expansion & Buyer Growth)

### Goal
- Expand buyer-side experience and matching
- Grow to 3-5 Tier-2 cities, approach Milan/Rome
- Increase transaction volume 3-5x

### Phase 2 Feature Set

#### Feature 1: BUYER ALERTS & SAVED SEARCHES
**Market Finding**: Buyer pain—"I have to check the site every day for new listings"

**Implementation**:
- ✅ Save searches (e.g., "Apt 2 bed, Naples, €200k-€300k")
- ✅ Get daily/weekly email alerts with new listings matching saved search
- ✅ Push notifications (opt-in) on mobile
- ✅ Customize alert frequency

**Success Metrics**:
- Saved searches per registered user: >2
- Alert click-through rate: >20%
- User retention (repeat logins): >60% week-over-week

**Effort**: ~80 hrs (Medium)

---

#### Feature 2: MORTGAGE PRE-APPROVAL INTEGRATION
**Market Finding**: Buyer pain—"I don't know if I can afford this"
Seller pain—"How serious is this buyer?"

**Implementation**:
- ✅ Partner with 2-3 fintech lenders (SoFi-style, Italy-focused)
- ✅ "Get Pre-Approved" button on detail page
- ✅ Quick pre-qual (name, income, credit, target price)
- ✅ Pre-approval letter (digital) stored in buyer profile
- ✅ Seller sees "Pre-Approved: €280k" on dashboard
- ✅ Revenue: Referral fees from lenders (~10-15% of loan value)

**Success Metrics**:
- Pre-approval rate (among buyers): >25%
- Seller response rate (to pre-approved inquiries): +40% vs. unverified
- Referral revenue: €X per pre-approval

**Effort**: ~200 hrs (High—requires lender integration)

---

#### Feature 3: ENERGY RATING & SUSTAINABILITY SCORING
**Market Finding**: Market opportunity—EU regulations + buyer demand for green homes

**Implementation**:
- ✅ Energy rating field in listing (A, B, C, D, E)
- ✅ Estimated heating/cooling costs (if rating provided)
- ✅ "Recent Renovation" status (trigger for green interest)
- ✅ Filter search by energy rating
- ✅ PropConnect sustainability badge for A/B rated homes
- ✅ Educational content: "Why Energy Efficiency Matters"

**Success Metrics**:
- A/B rated listings click-through rate: +30% vs. D/E
- Time-on-market (A/B homes): 20% faster
- Listing premium (price per m² for A/B vs. D): +5-10%

**Effort**: ~100 hrs (Medium)

---

#### Feature 4: NEIGHBORHOOD DATA & WALKABILITY SCORE
**Market Finding**: Buyer pain—"Is this a good area to live?"

**Implementation**:
- ✅ On detail page: nearby schools, transit, shops, parks, hospitals
- ✅ Walkability score (1-10, based on proximity to amenities)
- ✅ Crime rates (public data, if available Italy-wide)
- ✅ Commute time calculator (to user's workplace, if provided)
- ✅ Schools + ratings (if data available)

**Success Metrics**:
- Neighborhood section engagement: >50% of detail page visitors
- Commute calculator usage: >30%

**Effort**: ~120 hrs (Medium—data integration challenge)

---

#### Feature 5: OFFER/NEGOTIATION TOOLS
**Market Finding**: Buyer pain—"Am I supposed to negotiate? What's a fair offer?"

**Implementation**:
- ✅ "Make Offer" button on detail page
- ✅ Offer form: proposed price, financing, closing date, conditions
- ✅ Seller notification + dashboard widget (highlight new offers)
- ✅ Counter-offer function (seller proposes revised terms)
- ✅ Negotiation history (all offers/counter-offers visible to both)
- ✅ Binding agreement draft (basic contract for preliminary agreement)

**Success Metrics**:
- Offer submission rate: >15% of inquiries convert to offers
- Negotiation completion rate: >50% of negotiations reach agreement
- Average negotiation cycles: 1-2 (efficient)

**Effort**: ~180 hrs (High—legal/contract complexity)

---

#### Feature 6: VIDEO TOUR HOSTING & UPLOAD
**Market Finding**: Buyer pain—"I can't visit right now; do you have a video?"
Seller opportunity—"Video tours get +40% engagement"

**Implementation**:
- ✅ Upload video (seller or professional)
- ✅ Auto-hosting & playback (lazy load to reduce bandwidth)
- ✅ Video tours searchable/filterable
- ✅ Video statistics (views, completion %)
- ✅ "Professional Tour" badge (if seller uses partner videographer)

**Success Metrics**:
- Video upload rate (listings with video): >20%
- Engagement (listings with video vs. without): +40% inquiries
- Video completion rate: >70%

**Effort**: ~140 hrs (Medium-High—video hosting infrastructure)

---

#### Feature 7: EXPANDED CITY COVERAGE (Milan, Rome)
**Market Finding**: Market opportunity—Milan + Rome = 40% of Italian property sales

**Implementation**:
- ✅ Launch in Milan + Rome (with local marketing push)
- ✅ Localized content (Milan price trends, Rome neighborhood guides)
- ✅ Local notary/legal partnerships
- ✅ Paid ads (Google Ads, Facebook) targeting Milan/Rome sellers
- ✅ PR push: "PropConnect Launches in Milan"

**Success Metrics**:
- Listings in Milan/Rome: >1,000 within 6 months
- Transactions closed: >50 per month per city
- Cost per acquisition (seller): <€75

**Effort**: ~150 hrs (Marketing + operations heavy, not dev-heavy)

---

### Phase 2: Total Effort Estimate
**Total Development Hours**: ~950 hours (5-6 months with 2 developers)

**Phase 2 Cumulative Impact**:
- Buyer growth: 5x increase (more matches, alerts, tools)
- Transaction velocity: 2-3x faster (offers, negotiation tools)
- Geographic coverage: 5+ cities (Milan, Rome, Bologna, Naples, Palermo, others)
- Estimated transaction volume: 100-200 completed sales/month

---

## PHASE 3: SCALE (YEAR 2+)

### Goal
- Professionalize operations (legal, escrow, compliance)
- Partner with ecosystem (notaries, lenders, agents)
- Expand nationally, then internationally

### Phase 3 Features

#### 1. LICENSED ESCROW SERVICE
**Market Finding**: Trust barrier—"How do I know the money won't disappear?"

**Implementation**:
- ✅ Partner with licensed financial intermediary (Italian law requires this)
- ✅ Buyer deposits funds into PropConnect escrow
- ✅ Money held until closing
- ✅ Automatic release post-notary signature
- ✅ Revenue: 0.5% of transaction value

**Effort**: ~300 hrs (Highly regulated, require legal/compliance expertise)

---

#### 2. NOTARY & LEGAL SERVICES MARKETPLACE
**Market Finding**: User pain—"I don't know which notary to hire"

**Implementation**:
- ✅ Verified notary directory (with ratings + reviews)
- ✅ Book notary directly from PropConnect
- ✅ RevShare with notaries (15-20% of booking)
- ✅ Legal document automation (disclosure forms, preliminary contracts auto-generated)

**Effort**: ~200 hrs

---

#### 3. TAX ADVISOR NETWORK
**Market Finding**: Seller pain—"What taxes do I owe?"

**Implementation**:
- ✅ Tax advisor directory + booking
- ✅ "Estimate Your Taxes" tool (automated calculation based on inputs)
- ✅ Advisory calls (à la carte: €50-100 per 30-min consultation)
- ✅ Revenue: Referral + commission model

**Effort**: ~150 hrs

---

#### 4. PROFESSIONAL PHOTOGRAPHY SERVICE
**Market Finding**: Seller opportunity—"My photos are terrible; I need pro photos"

**Implementation**:
- ✅ Partner with local photographers
- ✅ On-demand booking (€150-300 per session)
- ✅ Professional photos uploaded to listing
- ✅ Statistics show listings with pro photos sell 30%+ faster
- ✅ Revenue: 20-30% commission per booking

**Effort**: ~100 hrs (Marketplace backend)

---

#### 5. FRANCHISE MODEL (Local Partners)
**Market Finding**: Expansion opportunity—"Each region has different legal/market dynamics"

**Implementation**:
- ✅ Partner with local real estate consultants (Tier-2 cities)
- ✅ Co-branded portal (PropConnect + Local Partner)
- ✅ Local partner handles customer support, marketing, legal guidance
- ✅ RevShare: 80/20 (PropConnect/Partner, variable by region)
- ✅ Standardized playbook for all franchisees

**Effort**: ~400 hrs (Operations/legal heavy)

---

#### 6. INTERNATIONAL EXPANSION (EU)
**Market Finding**: Market opportunity—"Same P2P demand in Spain, France, Germany"

**Implementation**:
- ✅ Launch in Spain + France (Year 2-3)
- ✅ Localize for each country (taxes, laws, language)
- ✅ Hire local teams
- ✅ Partner with local lenders, notaries
- ✅ Unified backend, localized frontend

**Effort**: ~1,000+ hrs (Major project, multi-market localization)

---

## FEATURE PRIORITIZATION MATRIX

| Feature | MVP | Phase 2 | Phase 3 | Effort | Market Impact | Seller Priority | Buyer Priority |
|---------|-----|---------|---------|--------|---------------|-----------------|-----------------|
| Listing Form | ✅ | ✅ | ✅ | High | Critical | 🔴 Critical | 🟡 High |
| Search/Discovery | ✅ | ✅ | ✅ | High | Critical | 🟡 High | 🔴 Critical |
| Detail Page | ✅ | ✅ | ✅ | High | Critical | 🟡 High | 🔴 Critical |
| Buyer Verification | ✅ | ✅ | ✅ | High | High | 🔴 Critical | 🟡 High |
| Messaging | ✅ | ✅ | ✅ | High | High | 🔴 Critical | 🟡 High |
| Calendar/Scheduler | ✅ | ✅ | ✅ | Medium | Medium | 🔴 Critical | 🟡 High |
| Dashboard | ✅ | ✅ | ✅ | Medium | High | 🔴 Critical | - |
| Legal Content | ✅ | ✅ | ✅ | Medium | High | 🔴 Critical | 🟡 Medium |
| Buyer Alerts | - | ✅ | ✅ | Medium | High | - | 🔴 Critical |
| Mortgage Integration | - | ✅ | ✅ | High | High | 🟡 Medium | 🔴 Critical |
| Energy Scoring | - | ✅ | ✅ | Medium | Medium | 🟡 High | 🟡 High |
| Neighborhood Data | - | ✅ | ✅ | Medium | Medium | - | 🔴 Critical |
| Offers/Negotiation | - | ✅ | ✅ | High | High | 🟡 High | 🔴 Critical |
| Video Tours | - | ✅ | ✅ | Medium | Medium | 🟡 High | 🟡 High |
| Escrow Service | - | - | ✅ | High | High | 🔴 Critical | 🔴 Critical |
| Notary Marketplace | - | - | ✅ | Medium | Medium | 🟡 High | 🟡 Medium |
| Tax Advisor Network | - | - | ✅ | Medium | Low | 🟡 High | - |
| Pro Photography | - | - | ✅ | Low | Low | 🟡 Medium | - |
| Franchise Model | - | - | ✅ | High | High | - | - |
| International | - | - | ✅ | Critical | High | - | - |

---

## Go-to-Market (GTM) Strategy by Phase

### Phase 1: MVP Launch Strategy
**Target**: Private sellers in Naples, Bologna, Palermo (Tier-2 cities)
**Why**: Lower competition from agents; lower CAC; prove concept before Milan/Rome
**Timeline**: Month 1-3
**Marketing**:
- PR in local news ("New platform lets Italians sell homes directly")
- Facebook Ads targeting property owners (interest: real estate, selling home)
- Landing page with testimonials (seed with friends/beta users)
- Reddit/Facebook groups (connect with sellers seeking alternatives)
- Target CAC: <€50 per seller

**Messaging**: 
- "Sell Your Home Directly, Save 3-5%"
- "No Agent Fees. No Hidden Costs. Just You and the Buyer."

---

### Phase 2: Expansion to Milan/Rome
**Target**: Private sellers + investors in Milan/Rome
**Why**: 40% of Italian market; higher price points → higher transaction value
**Timeline**: Months 6-12
**Marketing**:
- Premium positioning (not just "cheap alternative")
- Influencer partnerships (popular Milan/Rome real estate figures)
- LinkedIn targeting (professionals upgrading homes)
- Traditional PR (business press)
- Google Ads (high intent: "sell my house Milan")
- Target CAC: €75-100 per seller (higher prices justify it)

**Messaging**:
- "PropConnect: Milan's Trusted Alternative to Traditional Agents"
- "60% Faster Sale. 5% More in Your Pocket."

---

### Phase 3: Ecosystem & Scale
**Target**: Full Italian market + early EU expansion
**Partnerships**:
- Notary associations (co-marketing)
- Lenders (pre-approval integration)
- Local agencies (franchise model)
- Press coverage (fintech + real estate publications)

**Messaging**:
- "PropConnect: The Future of Real Estate Trading in Europe"

---

## Success Criteria by Phase

### MVP Phase (Months 1-3)
- ✅ 100-200 listings published
- ✅ 20-50 transactions completed (Gross Merchandise Value: €5-15M)
- ✅ Seller NPS: >40
- ✅ Buyer NPS: >45
- ✅ Legal issues/complaints: <5
- ✅ User retention (30-day): >50%

### Phase 2 (Months 4-12)
- ✅ 2,000-5,000 active listings
- ✅ 200-500 transactions/month
- ✅ GMV: €100-300M annually
- ✅ Seller NPS: >55
- ✅ Buyer NPS: >60
- ✅ Coverage: 5-6 major Italian cities
- ✅ Revenue: €500k-2M (commissions + services)

### Phase 3 (Year 2+)
- ✅ 10,000+ active listings
- ✅ 1,000+ transactions/month
- ✅ Profitability: EBITDA positive
- ✅ Expansion: 2-3 EU countries
- ✅ Exit options: Acquisition by Immobiliare/RE/MAX OR IPO path

---

## Conclusion

This roadmap bridges **market demand** → **feature prioritization** → **execution timeline**. Each feature is justified by market research or user feedback, ensuring dev effort is focused on high-impact features.

**For Developers**: Use this as your source of truth for what to build next. If a feature request comes in, ask: "Is it in the roadmap? Is it Phase 1 or Phase 2+?"

**For Product/Business**: Use this to communicate to investors: "Here's our 18-month roadmap, and here's why each feature matters for acquiring sellers and buyers."

---

**Document Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Ready for Sprint Planning
