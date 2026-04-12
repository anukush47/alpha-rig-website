// Sanity Studio needs full viewport height and no navbar/footer interference.
// Metadata and viewport are exported here (server component) so the page can be "use client".
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
