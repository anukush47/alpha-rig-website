import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity";

const BASE = "https://alpharig.in";

interface SanitySlugEntry {
  slug: string;
  _updatedAt: string;
}

async function getSlugs(type: string): Promise<SanitySlugEntry[]> {
  return sanityClient.fetch(
    `*[_type == $type && defined(slug.current)]{ "slug": slug.current, _updatedAt }`,
    { type }
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, buildSlugs, productSlugs] = await Promise.all([
    getSlugs("blogPost"),
    getSlugs("customBuild"),
    getSlugs("product"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,           lastModified: new Date(), changeFrequency: "daily",   priority: 1.0  },
    { url: `${BASE}/builds`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9  },
    { url: `${BASE}/events`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9  },
    { url: `${BASE}/store`,   lastModified: new Date(), changeFrequency: "daily",   priority: 0.9  },
    { url: `${BASE}/blog`,    lastModified: new Date(), changeFrequency: "daily",   priority: 0.8  },
    { url: `${BASE}/about`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.6  },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5  },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map(({ slug, _updatedAt }) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: new Date(_updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const buildRoutes: MetadataRoute.Sitemap = buildSlugs.map(({ slug, _updatedAt }) => ({
    url: `${BASE}/builds/${slug}`,
    lastModified: new Date(_updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map(({ slug, _updatedAt }) => ({
    url: `${BASE}/store/${slug}`,
    lastModified: new Date(_updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...buildRoutes, ...productRoutes];
}
