import { sanityClient } from "./sanity";

// ─── Types ────────────────────────────────────────────────────────────────────
// These mirror the Sanity document structures for strong typing.

export interface SanitySlug { current: string }

export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number; width: number; height: number };
}

export interface SpecRow { label: string; value: string }

// Blog
export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt: string;
  category: string;
  subcategories?: string[];
  tags: string[];
  author: string;
  authorBio?: string;
  publishedAt: string;
  readingTime?: number;
  featured?: boolean;
  likes?: number;
  sponsored?: boolean;
  coverImage: SanityImage;
}

export interface BlogPostFull extends BlogPostSummary {
  body: unknown[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  likes?: number;
  sponsored?: boolean;
  sponsorName?: string;
  sponsorUrl?: string;
}

// Build
export interface BuildSummary {
  _id: string;
  name: string;
  slug: SanitySlug;
  tagline: string;
  category: string;
  price: number;
  featured: boolean;
  available: boolean;
  images: SanityImage[];
}

export interface BuildFull extends BuildSummary {
  description: string;
  specs: SpecRow[];
  completionDate?: string;
}

// Event
export interface EventSummary {
  _id: string;
  name: string;
  slug: SanitySlug;
  game: string;
  eventDate: string;
  venue: string;
  prizePool: number;
  status: "upcoming" | "registration-open" | "live" | "completed";
  coverImage?: SanityImage;
}

export interface EventResult {
  place: number;
  teamName: string;
  prize?: string;
  note?: string;
}

export interface EventLeaderboardRow {
  rank: number;
  player: string;
  team?: string;
  kills?: number;
  score?: number;
}

export interface EventSponsor {
  name: string;
  logo?: SanityImage;
  url?: string;
  tier: string;
}

export interface EventFull extends EventSummary {
  description: string;
  registrationLink?: string;
  highlights?: string;
  registrationOpen?: boolean;
  maxTeams?: number;
  results?: EventResult[];
  leaderboard?: EventLeaderboardRow[];
  recapVideoUrl?: string;
  recapGallery?: SanityImage[];
  eventSponsors?: EventSponsor[];
}

// Product
export interface ProductSummary {
  _id: string;
  name: string;
  slug: SanitySlug;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  featured: boolean;
  images: SanityImage[];
}

export interface ProductFull extends ProductSummary {
  description: string;
  specs: SpecRow[];
}

// ─── GROQ projections ─────────────────────────────────────────────────────────
const BLOG_SUMMARY = `
  _id, title, slug, excerpt, category, subcategories, tags,
  author, authorBio, publishedAt, readingTime, featured,
  "likes": coalesce(likes, 0),
  sponsored, sponsorName, sponsorUrl,
  coverImage { ..., asset-> }
`;

const BUILD_SUMMARY = `
  _id, name, slug, tagline, category, price, featured, available,
  images[]{ ..., asset-> }
`;

const EVENT_SUMMARY = `
  _id, name, slug, game, eventDate, venue, prizePool, status,
  coverImage { ..., asset-> }
`;

const PRODUCT_SUMMARY = `
  _id, name, slug, brand, category, price, compareAtPrice, inStock, featured,
  images[]{ ..., asset-> }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

// Blog
export async function getAllBlogPosts(): Promise<BlogPostSummary[]> {
  return sanityClient.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) { ${BLOG_SUMMARY} }`
  );
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPostSummary[]> {
  return sanityClient.fetch(
    `*[_type == "blogPost" && category == $category] | order(publishedAt desc) { ${BLOG_SUMMARY} }`,
    { category }
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  return sanityClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0] {
      ${BLOG_SUMMARY},
      body,
      seoTitle,
      seoDescription,
      seoKeywords,
      "likes": coalesce(likes, 0),
      sponsored,
      sponsorName,
      sponsorUrl
    }`,
    { slug }
  );
}

export async function getTrendingPosts(limit = 4): Promise<BlogPostSummary[]> {
  return sanityClient.fetch(
    `*[_type == "blogPost"] | order(coalesce(likes, 0) desc, publishedAt desc) [0...$limit] { ${BLOG_SUMMARY} }`,
    { limit }
  );
}

export async function getRecentBlogPosts(limit = 3): Promise<BlogPostSummary[]> {
  return sanityClient.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) [0...$limit] { ${BLOG_SUMMARY} }`,
    { limit }
  );
}

// Builds
export async function getAllBuilds(): Promise<BuildSummary[]> {
  return sanityClient.fetch(
    `*[_type == "customBuild"] | order(completionDate desc) { ${BUILD_SUMMARY} }`
  );
}

export async function getFeaturedBuilds(): Promise<BuildSummary[]> {
  return sanityClient.fetch(
    `*[_type == "customBuild" && featured == true] | order(completionDate desc) { ${BUILD_SUMMARY} }`
  );
}

export async function getBuildsByCategory(category: string): Promise<BuildSummary[]> {
  return sanityClient.fetch(
    `*[_type == "customBuild" && category == $category] | order(completionDate desc) { ${BUILD_SUMMARY} }`,
    { category }
  );
}

export async function getBuildBySlug(slug: string): Promise<BuildFull | null> {
  return sanityClient.fetch(
    `*[_type == "customBuild" && slug.current == $slug][0] {
      ${BUILD_SUMMARY},
      description,
      specs,
      completionDate
    }`,
    { slug }
  );
}

// Events
export async function getAllEvents(): Promise<EventFull[]> {
  return sanityClient.fetch(
    `*[_type == "event"] | order(eventDate desc) {
      ${EVENT_SUMMARY},
      description,
      registrationLink,
      highlights
    }`
  );
}

export async function getUpcomingEvents(): Promise<EventSummary[]> {
  return sanityClient.fetch(
    `*[_type == "event" && status in ["upcoming", "registration-open", "live"]]
     | order(eventDate asc) { ${EVENT_SUMMARY} }`
  );
}

export async function getEventBySlug(slug: string): Promise<EventFull | null> {
  return sanityClient.fetch(
    `*[_type == "event" && slug.current == $slug][0] {
      ${EVENT_SUMMARY},
      description,
      registrationLink,
      highlights,
      registrationOpen,
      maxTeams,
      results[]{ place, teamName, prize, note },
      leaderboard[]{ rank, player, team, kills, score },
      recapVideoUrl,
      recapGallery[]{ ..., asset-> },
      eventSponsors[]{ name, url, tier, logo{ ..., asset-> } }
    }`,
    { slug }
  );
}

export async function getCompletedEventsWithResults(): Promise<EventFull[]> {
  return sanityClient.fetch(
    `*[_type == "event" && status == "completed" && defined(results)] | order(eventDate desc) {
      ${EVENT_SUMMARY},
      description,
      highlights,
      results[]{ place, teamName, prize, note }
    }`
  );
}

// Ad Slots
export interface AdSlotData {
  _id: string;
  position: string;
  label: string;
  active: boolean;
  sponsorName?: string;
  sponsorLogo?: SanityImage;
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  customHtml?: string;
  startDate?: string;
  endDate?: string;
}

export async function getAdSlot(position: string): Promise<AdSlotData | null> {
  return sanityClient.fetch(
    `*[_type == "adSlot" && position == $position && active == true][0] {
      _id, position, label, active, sponsorName,
      sponsorLogo { ..., asset-> },
      headline, body, ctaLabel, ctaUrl, customHtml,
      startDate, endDate
    }`,
    { position }
  );
}

// Sponsors
export interface Sponsor {
  _id: string;
  name: string;
  url?: string;
  tier: "title" | "gold" | "silver" | "community";
  description?: string;
  logo?: SanityImage;
  featuredOnHome?: boolean;
}

const SPONSOR_FIELDS = `_id, name, url, tier, description, featuredOnHome, logo { ..., asset-> }`;

export async function getActiveSponsors(): Promise<Sponsor[]> {
  return sanityClient.fetch(
    `*[_type == "sponsor" && active == true] | order(tier asc, name asc) { ${SPONSOR_FIELDS} }`
  );
}

export async function getHomepageSponsors(): Promise<Sponsor[]> {
  return sanityClient.fetch(
    `*[_type == "sponsor" && active == true && featuredOnHome == true] | order(tier asc) { ${SPONSOR_FIELDS} }`
  );
}

// Products
export async function getAllProducts(): Promise<ProductSummary[]> {
  return sanityClient.fetch(
    `*[_type == "product"] | order(name asc) { ${PRODUCT_SUMMARY} }`
  );
}

export async function getProductsByCategory(category: string): Promise<ProductSummary[]> {
  return sanityClient.fetch(
    `*[_type == "product" && category == $category] | order(name asc) { ${PRODUCT_SUMMARY} }`,
    { category }
  );
}

export async function getFeaturedProducts(limit = 4): Promise<ProductSummary[]> {
  return sanityClient.fetch(
    `*[_type == "product" && featured == true] | order(name asc) [0...$limit] { ${PRODUCT_SUMMARY} }`,
    { limit }
  );
}

export async function getProductBySlug(slug: string): Promise<ProductFull | null> {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      ${PRODUCT_SUMMARY},
      description,
      specs
    }`,
    { slug }
  );
}
