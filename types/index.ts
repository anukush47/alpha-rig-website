// Sanity image reference
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

// Build
export interface Build {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: SanityImage;
  summary: string;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    cooling: string;
    psu: string;
    case: string;
  };
  price: number;
  category: "gaming" | "workstation" | "content-creation" | "budget";
  featured: boolean;
  publishedAt: string;
}

// Event
export interface Event {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: SanityImage;
  description: string;
  date: string;
  location: string;
  registrationUrl?: string;
  status: "upcoming" | "past" | "live";
}

// Blog Post
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: SanityImage;
  excerpt: string;
  body: unknown[];
  author: {
    name: string;
    avatar: SanityImage;
  };
  tags: string[];
  publishedAt: string;
}

// Product (Store)
export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  images: SanityImage[];
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  inStock: boolean;
  specs?: Record<string, string>;
}

// Cart item (Zustand)
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
