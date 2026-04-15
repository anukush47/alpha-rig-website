# Alpha Rig — Implementation Plan
# Paste this file at the start of a new session to restore context.

---

## Project
- Name: Alpha Rig Private Limited
- Stack: Next.js 14 App Router, Sanity CMS, Tailwind + inline styles, Framer Motion, Razorpay
- Repo: /Users/priyanka/Desktop/alpha rig/alpha-rig
- Dev server: localhost:3001
- Sanity projectId: jpsytg9h, dataset: production
- Design: #0A0A0A bg, #C0392B red, Bebas Neue (display), Rajdhani (body), Space Mono (mono)
- Rule: DO NOT push to GitHub until explicitly told

## What is already built & committed
- PageLoader (full-screen themed loading overlay)
- not-found.tsx (404 with glitch effect + cursor glow)
- error.tsx (500 with auto-retry countdown)
- global-error.tsx (root crash page, re-declares fonts + own html/body)
- Store page → Coming Soon (ComingSoon component)
- Navbar: no cart icon
- Footer: Build With Us link added

## What is built but NOT yet committed
- app/build-with-us/page.tsx — 5-step counseling form, Razorpay ₹299 payment
- app/api/counseling-order/route.ts — creates Razorpay order server-side
- components/ui/ComingSoon.tsx — reusable coming soon component

## Pending before Build With Us goes live
- Add Razorpay env vars to Vercel: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_RAZORPAY_KEY_ID
- Add Razorpay webhook for payment confirmation

---

## The 6-Session Implementation Plan
## Focus: Blogs, Advertisements, Sponsorships, Events, Brand Building
## Do NOT start any session without user saying "start session N"

---

### SESSION 1 — Newsletter Foundation (~30 min)
Feature: Real newsletter API (replaces setTimeout mock)
- Create: app/api/newsletter/route.ts (Mailchimp or Beehiiv API call)
- Update: components/sections/NewsletterStrip.tsx (POST to real endpoint)
- Why first: Sessions 3 (mid-article embed) and 6 (event interest form) reuse this endpoint
Files: 2

### SESSION 2 — All Sanity Schema Changes (~45 min)
Do ALL schema changes in one session to avoid repeated Sanity tool overhead.

blogPost.ts — add fields:
- likes: number (for clap system)
- series: reference → blogSeries (for blog series)
- sponsored: boolean + sponsorName: string + sponsorUrl: url (for sponsored posts)

New blogSeries schema:
- title, slug, description, coverImage, posts[] (ordered references)

event.ts — add fields:
- registrationOpen: boolean + registrationFormUrl: url
- results: array of {place, teamName, prize}
- leaderboard: array of {rank, player, score}
- recapVideoUrl: url (YouTube)
- recapGallery: array of image
- sponsors: array of {name, logo, tier}

New adSlot schema (for ad zones):
- position: string (blog-after-intro, blog-mid, blog-end)
- active: boolean
- customHtml: text (brand creative)
- fallbackToAdsense: boolean

New sponsor schema:
- name, logo, url, tier (Title/Gold/Silver/Community), active: boolean

Files: sanity/schemas/blogPost.ts, sanity/schemas/event.ts, sanity/schemas/index.ts

### SESSION 3 — Blog Post Enhancement Layer (~90 min)
All features live on/around app/blog/[slug]/page.tsx

Feature 1: Social share bar
- Component: components/ui/ShareBar.tsx
- Sticky vertical (desktop) / horizontal strip (mobile)
- Channels: X, WhatsApp, LinkedIn, copy link

Feature 2: Reading progress bar
- Component: components/ui/ReadingProgress.tsx
- Fixed red bar at top of viewport, fills on scroll
- requestAnimationFrame, no library

Feature 3: Clap / reaction
- Component: components/ui/ClapButton.tsx
- API: app/api/blog/[slug]/clap/route.ts (Sanity patch inc({likes:1}))
- Optimistic UI, no auth

Feature 4: Author card
- Component: components/ui/AuthorCard.tsx
- Shows at article bottom: avatar, name, bio, social links

Feature 5: Mid-article newsletter embed
- Compact NewsletterStrip variant inserted after 3rd paragraph
- Reuses Session 1 API endpoint

Feature 7: Trending this week sidebar
- New query in lib/queries.ts: getTrendingPosts(limit, since)
- Right sidebar on desktop blog post page
- Shows top 3 posts by view count this week

Files: app/blog/[slug]/page.tsx, lib/queries.ts + 5 new components + 1 new API route

### SESSION 4 — Monetization Pages (~60 min)
All static/CMS pages with same design pattern.

Feature 8: /advertise page
- Sections: audience stats, ad formats, pricing tiers, inquiry form
- API: app/api/partnership-inquiry/route.ts

Feature 12 + 14: /sponsors page + inquiry form
- Sponsor tier wall (Title → Gold → Silver → Community)
- Sanity-managed sponsor list (schema from Session 2)
- Same inquiry API as /advertise

Feature 15: Homepage sponsor bar
- Subtle logo pill row near footer in app/page.tsx
- Only renders if sponsors exist in Sanity (invisible when empty)

Files: app/advertise/page.tsx (new), app/sponsors/page.tsx (new), app/page.tsx, app/api/partnership-inquiry/route.ts (new)

### SESSION 5 — Ad Infrastructure (~30 min)

Feature 11: Google AdSense
- One <Script> in layout.tsx
- AdUnit component: components/ui/AdUnit.tsx

Feature 10: Managed ad zones
- Component: components/ui/SponsoredSlot.tsx
- Renders custom Sanity creative OR AdSense fallback
- Positions: blog-after-intro, blog-mid, blog-end
- Swap creatives from Sanity Studio without code deploy

Files: app/layout.tsx, 2 new components

### SESSION 6 — Events Revamp (~90 min)
All events features. Schema fields already added in Session 2.

Feature 13: Sponsor strip on event pages
- Horizontal scrollable logo row below event hero
- Data from event.sponsors[] (Session 2 schema)

Feature 16: Event registration form
- Shows if event.registrationOpen === true
- API: app/api/events/register/route.ts → saves to Sanity, sends confirmation email (Resend.com)

Feature 17: Countdown timer wiring
- CountdownTimer component already exists
- Wire to event detail pages for upcoming/registration-open events (10 min change)

Feature 18: Results + leaderboard
- Conditional section on event detail page
- Renders podium/table from event.results and event.leaderboard

Feature 19: Event recap section
- If recapVideoUrl: YouTube iframe embed (styled)
- If recapGallery: masonry image grid

Feature 20: Register interest form
- On events listing page sidebar
- name + email + game preference → POST to /api/newsletter with tags:["events"]

Feature 21: Hall of Fame page
- app/hall-of-fame/page.tsx
- Pulls all events where results is populated
- Shows winner, event, prize, date — evergreen SEO

Files: app/events/[slug]/page.tsx, app/events/EventsContent.tsx, app/hall-of-fame/page.tsx (new), app/api/events/register/route.ts (new), lib/queries.ts

---

## SESSION 7 — Award-Winning Layer (after all 6 sessions complete)
These features are what make judges score 9+. Plan last, when everything else is stable.

1. Lenis smooth scroll — install @studio-freight/lenis, wrap in layout.tsx
2. Film grain overlay — fixed canvas element, animated noise at 8% opacity, zero deps
3. Custom cursor — 10px red dot, scales on hover, contextual labels (READ/OPEN/PLAY), hides on touch
4. Page transitions — Framer Motion AnimatePresence at layout level, fade+slide 100ms
5. Scroll-driven text reveals — per-character heading reveals (translateY 100%→0 staggered)
6. Creature animation — idle rotation, cursor follow (subtle), hover reaction (already have 3D model)
7. Count-up stats — IntersectionObserver + requestAnimationFrame, numbers animate on scroll into view
8. og-image.jpg — create in Figma/Canva, 1200x630, save to public/ (see below)

---

## BEFORE ANY SESSION — Do this first:
Create public/og-image.jpg (explained in file below)
Currently referenced everywhere in metadata but file does not exist.
Every social share shows a broken image until this is created.

---

## What is og-image.jpg

When someone shares alpharig.in on WhatsApp, Twitter, LinkedIn, iMessage — the
platform fetches a preview image from your site. That image is og-image.jpg.

It is defined in layout.tsx:
  images: [{ url: "/og-image.jpg", width: 1200, height: 630 }]

Without this file existing in public/, every share looks like a broken link.

How to create it:
1. Open Figma or Canva
2. Create a 1200 x 630 px canvas
3. Background: #0A0A0A (black)
4. Add "ALPHA RIG" in Bebas Neue or bold font, white, large
5. Add tagline "FORGE YOUR LEGEND" in smaller text, #C0392B red
6. Optional: subtle red grid lines or the creature silhouette
7. Export as JPG, name it og-image.jpg
8. Save to: /Users/priyanka/Desktop/alpha rig/alpha-rig/public/og-image.jpg

Once created, every page that shares a link will show this branded card.
Individual blog posts already generate their own OG image from the post's cover image (ogImage() in lib/sanity.ts), so og-image.jpg only acts as the site-wide fallback.

---

## Award Submission Targets (after Session 7)
- CSS Design Awards — first target, free, weekly jury
- Awwwards SOTD — $29 submission, score 8.5+ needed
- The FWA — innovation-focused, pitch the creature animation
- Webby Awards — India/esports category, January deadline

## Content needed to score well (no design replaces this):
- 8-10 real long-form blog posts (1,500+ words each)
- 3+ real events with results and photos
- 5+ real custom builds with proper photography
- Real team page with real faces and photos

---

## Sanity schemas location
/Users/priyanka/Desktop/alpha rig/alpha-rig/sanity/schemas/
Files: blogPost.ts, customBuild.ts, event.ts, product.ts, index.ts

## Key lib files
- lib/queries.ts — all GROQ queries + TypeScript types
- lib/sanity.ts — client, preview client, urlFor, ogImage helpers
- lib/analytics.ts — trackEvent wrapper
- lib/store.ts — Zustand cart store (orphaned, CartDrawer still in SiteShell)

## Dead code to clean up eventually
- lib/store.ts (cart store, no cart icon)
- components/ui/CartDrawer.tsx (mounted in SiteShell but unreachable)
- app/checkout/page.tsx (orphaned)
- app/order-confirmation/page.tsx (orphaned)
