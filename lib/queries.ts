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
  tags: string[];
  author: string;
  publishedAt: string;
  coverImage: SanityImage;
}

export interface BlogPostFull extends BlogPostSummary {
  body: unknown[];
  seoTitle?: string;
  seoDescription?: string;
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

export interface EventFull extends EventSummary {
  description: string;
  registrationLink?: string;
  highlights?: string;
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
  _id, title, slug, excerpt, category, tags, author, publishedAt,
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
      seoDescription
    }`,
    { slug }
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
      highlights
    }`,
    { slug }
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
