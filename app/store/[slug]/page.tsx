import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getAllProducts } from "@/lib/queries";
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
  return {
    title: `${product.name} | Alpha Rig Store`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Alpha Rig`,
      description: product.description,
      type: "website",
    },
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
