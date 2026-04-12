import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getAllProducts } from "@/lib/queries";
import { urlFor } from "@/lib/sanity";
import ProductDetail from "./ProductDetail";
import ProductCard from "@/components/ui/ProductCard";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const imageUrl = product.images?.[0]?.asset
    ? urlFor(product.images[0]).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;
  const description = product.description?.slice(0, 155) ?? `${product.name} — ${product.brand} | Alpha Rig Store`;
  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} | Alpha Rig Store`,
      description,
      url: `https://alpharig.in/store/${slug}`,
      type: "website",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: product.name }] : [],
    },
    twitter: { card: "summary_large_image", title: product.name, description, images: imageUrl ? [imageUrl] : [] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getAllProducts(),
  ]);

  if (!product) notFound();

  const productImageUrl = product.images?.[0]?.asset
    ? urlFor(product.images[0]).width(800).auto("format").url()
    : undefined;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    image: productImageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Alpha Rig Private Limited" },
    },
  };

  const related = allProducts
    .filter((p) => p.slug.current !== slug && p.category === product.category)
    .slice(0, 4);

  const fallbackRelated = related.length < 4
    ? [
        ...related,
        ...allProducts
          .filter((p) => p.slug.current !== slug && !related.find((r) => r._id === p._id))
          .slice(0, 4 - related.length),
      ]
    : related;

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetail product={product} />

      {/* ── Related products ── */}
      {fallbackRelated.length > 0 && (
        <section style={{ borderTop: "1px solid #111", padding: "64px 24px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "4px", color: "#C0392B", marginBottom: "12px" }}>
              // YOU MIGHT ALSO LIKE
            </p>
            <h2
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(32px, 4vw, 44px)",
                color: "#fff",
                letterSpacing: "0.03em",
                marginBottom: "32px",
              }}
            >
              RELATED PRODUCTS
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
                gap: "16px",
              }}
            >
              {fallbackRelated.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
