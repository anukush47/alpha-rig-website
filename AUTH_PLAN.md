# Alpha Rig — User Auth & Account System Plan

## Auth Stack: Clerk

**Why Clerk (not NextAuth / custom JWT):**
- Discord + Google OAuth out of the box — Discord is the #1 gaming community platform
- Pre-built `<SignIn>` / `<SignUp>` components with full CSS variable theming (matches void/forge/ember design system)
- Native Next.js App Router middleware — one file protects all `/account/*` routes
- User webhooks (`user.created`, `user.deleted`) sync into Sanity automatically
- Built-in 2FA, magic links, session management — zero custom auth logic
- Free tier: 10,000 MAU

**User data storage:**
| Data | Where |
|---|---|
| Auth identity (userId, email, OAuth) | Clerk |
| Extended gaming profile | Sanity `userProfile` doc keyed by Clerk userId |
| Wishlist, saved builds | Sanity docs with `userId` string field |
| Orders | Sanity `userOrder` docs with `userId` + Razorpay `orderId` |
| Alpha Points ledger | Sanity `alphaPoints` docs |

---

## Feature Tiers

### TIER 1 — Auth Foundation
| Feature | Detail |
|---|---|
| Sign In / Sign Up pages | `/sign-in`, `/sign-up` — full-screen split layout: brand left, Clerk form right |
| Navbar auth state | Shows "Sign In" button → swaps to avatar + dropdown after login |
| Protected routes | `middleware.ts` — any `/account/*` hit while logged out → redirect to `/sign-in` |
| Profile settings | Name, gaming handle, avatar — Clerk manages identity data |
| Clerk → Sanity webhook | On signup, auto-creates `userProfile` doc in Sanity keyed to userId |

### TIER 2 — E-commerce Core (Amazon/Flipkart parity)
| Feature | Detail |
|---|---|
| Order history | `/account/orders` — all Razorpay orders tied to userId |
| Order detail | `/account/orders/[id]` — items, total, payment ID, delivery address |
| Wishlist | Heart button on every product card → `/account/wishlist` — price shown, direct Add to Cart |
| Saved addresses | Up to 3 delivery addresses, auto-fills checkout form |
| Cart sync | On login, merge localStorage cart into account (cross-device persistence) |

### TIER 3 — Gaming Identity Layer ⚡ (The Differentiator)
| Feature | Detail |
|---|---|
| **Forge Level system** | Gamified loyalty — 5 tiers with points earn rules (see below) |
| **Alpha Points** | `/account/points` — balance, earn history, guide |
| **Rig Identity Card** | Shareable gaming ID card — downloadable as PNG via html2canvas (already installed) |
| **Build Vault** | `/account/builds` — save PC build configs, request quote from saved build |
| **Tournament Wall** | `/account/events` — all registrations with 🥇🥈🥉 placements where results exist |

### TIER 4 — Advanced (Phase 2, build later)
- Price drop / back-in-stock alerts for wishlist
- Referral link generation + tracking
- Tier-based early access to new products/events
- Community "Rig Showcase" (public build sharing)

---

## Forge Level System

```
RECRUIT    ░░░░░░░░░░   0 – 499 pts      Gray
SOLDIER    ███░░░░░░░   500 – 1,499 pts  Steel blue
VETERAN    ██████░░░░   1,500 – 4,999    Purple
LEGEND     █████████░   5,000 – 9,999    Gold
ALPHA      ██████████   10,000+          Dragon-fire red + glow ✦
```

**Point earn rules:**
| Action | Points |
|---|---|
| Purchase (per ₹100 spent) | 1 pt |
| Event registration | 50 pt |
| PC counseling session | 100 pt |
| Newsletter signup | 10 pt |
| Referral (new user signs up via your link) | 200 pt |
| First purchase ever | +100 pt bonus |
| Profile fully completed | 25 pt |

---

## Rig Identity Card (Shareable PNG)

```
┌─────────────────────────────────────────────┐
│  ALPHA RIG                    [crosshair ✛] │
│  ─────────────────────────────────────────  │
│  ◉ [AVATAR]    GAMER_HANDLE                 │
│                FORGE LEVEL: VETERAN         │
│                ▓▓▓▓▓▓░░░░  2,340 pts        │
│                                             │
│  Builds: 2    Events: 5    Reads: 47        │
│                                             │
│  alpharig.in                                │
└─────────────────────────────────────────────┘
         [ Download PNG ]   [ Copy Link ]
```

---

## Account Dashboard Layout

```
NAVBAR  [Logo]  [Nav links]  [Cart]  [◉ Avatar ▾]
─────────────────────────────────────────────────
SIDEBAR (220px)  │  WELCOME BACK, ALPHA_GAMER
                 │  ▓▓▓▓▓░░░░  VETERAN · 2,340 pts
  Dashboard      ├──────────────────────────────
  Orders    (3)  │  [Orders]  [Wishlist]  [Builds]  [Points]
  Wishlist  (7)  │     3          7          2        2,340
  Builds    (2)  │
  Events    (5)  │  Recent Orders (last 3)
  Profile        │  Wishlist Preview (first 4 products)
  Points         │  Rig Identity Card + [Download PNG]
  ───────────    │
  Sign Out
```

---

## Sign In / Sign Up Page Layout

```
┌────────────────────────────────────────────────────────┐
│  LEFT PANEL (desktop only)          RIGHT PANEL        │
│  ─────────────────────────          ─────────────────  │
│  Void bg + red grid lines           Glass card         │
│  Creature silhouette (30% opacity)  "FORGE YOUR        │
│  3 social proof stat pills           IDENTITY" h1      │
│  "500+ builders trust Alpha Rig"    Clerk <SignIn />   │
│                                     Discord + Google   │
└────────────────────────────────────────────────────────┘
```

---

## Clerk Theme (matches Alpha Rig design system)

```typescript
appearance={{
  variables: {
    colorPrimary: "#c0392b",          // dragon-fire red
    colorBackground: "#111111",       // forge
    colorInputBackground: "#1a1a1a",  // armor
    colorText: "#ffffff",
    colorTextSecondary: "#888888",    // steel
    borderRadius: "4px",
    fontFamily: "var(--font-rajdhani)",
  },
  elements: {
    card: "border border-white/6 shadow-none",
    formButtonPrimary: "bg-[#c0392b] hover:bg-[#e74c3c]",
  }
}}
```

---

## New Files

### Auth & Middleware
| File | Purpose |
|---|---|
| `middleware.ts` | Clerk auth middleware, protects `/account/*` |
| `app/sign-in/[[...sign-in]]/page.tsx` | Branded sign-in page |
| `app/sign-up/[[...sign-up]]/page.tsx` | Branded sign-up page |

### Account Pages (all protected)
| File | Purpose |
|---|---|
| `app/account/layout.tsx` | Account shell with sidebar nav |
| `app/account/page.tsx` | Dashboard — stats + recent activity |
| `app/account/orders/page.tsx` | Full order history |
| `app/account/orders/[id]/page.tsx` | Order detail |
| `app/account/wishlist/page.tsx` | Wishlist product grid |
| `app/account/builds/page.tsx` | Build Vault |
| `app/account/events/page.tsx` | Tournament Wall |
| `app/account/profile/page.tsx` | Profile + gaming handle settings |
| `app/account/points/page.tsx` | Alpha Points + Forge Level |

### API Routes
| File | Purpose |
|---|---|
| `app/api/webhooks/clerk/route.ts` | Sync user.created/deleted to Sanity |
| `app/api/user/profile/route.ts` | GET/PATCH extended profile |
| `app/api/wishlist/route.ts` | GET/POST wishlist items |
| `app/api/wishlist/[productId]/route.ts` | DELETE wishlist item |
| `app/api/saved-builds/route.ts` | GET/POST saved builds |
| `app/api/saved-builds/[id]/route.ts` | DELETE saved build |
| `app/api/orders/route.ts` | GET user orders |

### Components
| File | Purpose |
|---|---|
| `components/layout/AccountSidebar.tsx` | Sidebar nav |
| `components/ui/ForgeLevel.tsx` | Level badge + animated progress bar |
| `components/ui/RigIdentityCard.tsx` | Shareable card + html2canvas PNG download |
| `components/ui/WishlistButton.tsx` | Heart toggle on product cards |
| `components/ui/AlphaPointsBadge.tsx` | Points chip in navbar dropdown |

### Sanity Schemas (new)
| Schema | Fields |
|---|---|
| `userProfile` | clerkUserId, displayName, gamingHandle, bio, avatarUrl, totalPoints, forgeLevel |
| `wishlistItem` | userId, product (reference), addedAt |
| `savedBuild` | userId, name, components (array), totalBudget, notes, createdAt |
| `userOrder` | userId, razorpayOrderId, razorpayPaymentId, items (array), total, status, createdAt |
| `alphaPoints` | userId, points, action, description, createdAt |

---

## Files to Modify

| File | Change |
|---|---|
| `package.json` | Add `@clerk/nextjs` |
| `.env.local` | Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` |
| `app/layout.tsx` | Wrap with `<ClerkProvider>` |
| `components/layout/Navbar.tsx` | Add `<UserButton>` + `<SignInButton>` from Clerk |
| `sanity/schemas/index.ts` | Export 5 new schemas |
| `sanity.config.ts` | Add new schemas under Audience section in Studio |
| `lib/queries.ts` | Add user GROQ queries |
| `app/checkout/page.tsx` | Attach userId to order on creation |

---

## Environment Variables Needed

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

Get these from: clerk.com → Create App "Alpha Rig" → Enable Google + Discord OAuth → API Keys

---

## Implementation Sessions

| Session | Scope |
|---|---|
| **A — Auth Foundation** | Clerk install + ClerkProvider + middleware + sign-in/sign-up pages + Navbar auth state + webhook + userProfile schema |
| **B — Dashboard + Orders** | Account layout + sidebar + dashboard + userOrder schema + orders API + order history + detail pages |
| **C — Wishlist + Addresses** | wishlistItem schema + wishlist API + WishlistButton on product cards + wishlist page + saved addresses |
| **D — Gaming Identity** | Forge Level + Alpha Points schema/API/page + RigIdentityCard PNG download + Build Vault |
| **E — Tournament Wall + Polish** | Events history page + cart sync on login + Studio structure update + final polish |

---

## Verification Checklist

- [ ] Sign up with Google → `userProfile` doc created in Sanity via webhook
- [ ] Sign up with Discord → same
- [ ] Add product to wishlist → appears in `/account/wishlist`
- [ ] Place order → appears in `/account/orders` with correct items + total
- [ ] Register for event → appears in `/account/events`
- [ ] Points balance updates after purchase
- [ ] Rig Identity Card downloads as PNG with correct user data
- [ ] Sign out → `/account` redirects to `/sign-in`
- [ ] Clerk dashboard shows real users + session data
- [ ] Navbar shows avatar when logged in, Sign In button when logged out
