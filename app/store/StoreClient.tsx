"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { ProductSummary } from "@/lib/queries";

const CATEGORIES = [
  "All",
  "GPU",
  "CPU",
  "RAM",
  "Storage",
  "Case",
  "Cooling",
  "Peripherals",
  "Alpha Rig Original",
] as const;

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Featured",        value: "featured"   },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc"},
  { label: "Newest",          value: "newest"     },
];

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "1.5px",
        padding: "7px 14px",
        borderRadius: "6px",
        border: `1px solid ${active ? "#C0392B" : "rgba(255,255,255,0.07)"}`,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.18s ease",
        background: active ? "#C0392B" : "rgba(255,255,255,0.03)",
        color: active ? "#fff" : "rgba(255,255,255,0.45)",
        boxShadow: active ? "0 2px 12px rgba(192,57,43,0.3)" : "none",
      }}
    >
      {children}
    </button>
  );
}

export default function StoreClient({ products }: { products: ProductSummary[] }) {
  const [category, setCategory] = useState<string>("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "All") list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (minPrice !== "") list = list.filter((p) => p.price >= Number(minPrice));
    if (maxPrice !== "") list = list.filter((p) => p.price <= Number(maxPrice));

    list.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0; // newest — already ordered by Sanity
    });

    return list;
  }, [products, category, inStockOnly, minPrice, maxPrice, sort]);

  // ── Filter panel (shared between sidebar + mobile sheet) ──────────────────
  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      {/* Categories */}
      <div className="flex flex-col gap-3">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.3)" }}>
          CATEGORY
        </span>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: category === cat ? 700 : 400,
                color: category === cat ? "#C0392B" : "rgba(255,255,255,0.5)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "5px 0",
                transition: "color 0.15s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                if (category !== cat)
                  (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                if (category !== cat)
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="flex flex-col gap-3">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "rgba(255,255,255,0.3)" }}>
          PRICE RANGE (₹)
        </span>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "#ccc",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "7px 10px",
              outline: "none",
            }}
          />
          <span style={{ color: "#333", flexShrink: 0 }}>—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              width: "100%",
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "#ccc",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "7px 10px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* In stock */}
      <label
        className="flex items-center gap-3 cursor-pointer select-none"
        style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}
      >
        <div
          onClick={() => setInStockOnly((v) => !v)}
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "4px",
            border: `1px solid ${inStockOnly ? "#C0392B" : "rgba(255,255,255,0.15)"}`,
            background: inStockOnly ? "#C0392B" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.15s",
          }}
        >
          {inStockOnly && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        In Stock Only
      </label>

      {/* Reset */}
      {(category !== "All" || minPrice || maxPrice || inStockOnly) && (
        <button
          onClick={() => { setCategory("All"); setMinPrice(""); setMaxPrice(""); setInStockOnly(false); }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "9px",
            letterSpacing: "2px",
            color: "#C0392B",
            background: "none",
            border: "1px solid rgba(192,57,43,0.25)",
            borderRadius: "5px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          CLEAR FILTERS
        </button>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px 80px" }}>

      {/* ── Mobile filter toggle ── */}
      <div className="lg:hidden mb-4 flex gap-3 items-center flex-wrap">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "1.5px",
            padding: "8px 16px",
            borderRadius: "7px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          FILTERS
        </button>

        {/* Active category pill on mobile */}
        {category !== "All" && (
          <PillButton active onClick={() => setCategory("All")}>{category} ×</PillButton>
        )}
      </div>

      {/* ── Mobile filter sheet ── */}
      {sidebarOpen && (
        <div
          className="lg:hidden mb-6 p-5 rounded-xl"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "rgba(18,18,18,0.95)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <FilterPanel />
        </div>
      )}

      <div className="flex gap-8">
        {/* ── Desktop sidebar ── */}
        <aside
          className="hidden lg:block shrink-0 sticky top-28 self-start"
          style={{ width: "200px" }}
        >
          <div
            className="p-5 rounded-xl"
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background: "rgba(18,18,18,0.7)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <FilterPanel />
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div
            className="flex items-center justify-between gap-4 mb-6 flex-wrap"
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "1px", color: "#555" }}>
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <PillButton
                  key={opt.value}
                  active={sort === opt.value}
                  onClick={() => setSort(opt.value)}
                >
                  {opt.label}
                </PillButton>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-32 gap-4">
              <p style={{ fontFamily: "var(--font-bebas)", fontSize: "2rem", color: "#222", letterSpacing: "0.06em" }}>
                No products found
              </p>
              <p style={{ fontFamily: "var(--font-rajdhani)", fontSize: "14px", color: "#444" }}>
                Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
                gap: "16px",
              }}
            >
              {filtered.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
