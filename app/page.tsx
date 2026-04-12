import Hero from "@/components/sections/Hero";
import FeaturedBuild from "@/components/sections/FeaturedBuild";
import EventsTicker from "@/components/sections/EventsTicker";
import BlogPreview from "@/components/sections/BlogPreview";
import NewsletterStrip from "@/components/sections/NewsletterStrip";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <Hero />
      <FeaturedBuild />
      <EventsTicker />
      <BlogPreview />
      <NewsletterStrip />
    </main>
  );
}
