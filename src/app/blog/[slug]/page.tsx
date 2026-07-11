import { BlogPost, BlogPostData } from "@/components/sections/BlogSection";
import { notFound } from "next/navigation";

// 📝 লোকাল ডেটাবেজ (যা থেকে slug অনুযায়ী আর্টিকেল ফিল্টার হবে)
const dummyBlogPosts: BlogPostData[] = [
  {
    title: "The Subtle Art of Structural Minimalism",
    slug: "structural-minimalism",
    excerpt: "Exploring how negative space and honest materiality redefine contemporary high-end residential living rooms.",
    content: `
      <p>Minimalism is not the lack of something. It is simply the perfect amount of something. Within high-end architecture, spatial luxury is increasingly defined by what we leave out rather than what we force into a room.</p>
      <br />
      <p>By shifting focus onto continuous paths, balanced ambient lux, and raw architectural elements like texturized white oak, the interior starts breathing. Negative space becomes a deliberate design choice that frames our everyday movements.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800",
    tags: ["Architecture", "Minimalism"],
    readingTime: "5 MIN READ",
    publishedAt: "July 10, 2026",
    author: {
      name: "Soren Lassen",
      role: "Lead Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150"
    }
  },
  {
    title: "Preserving Heritage Woodwork in Modern Design",
    slug: "heritage-woodwork",
    excerpt: "A deep dive into how our master artisans merge centuries-old joinery techniques with sleek texturized modern linears.",
    content: `
      <p>True luxury requires deep roots. In an era of rapid assembly, preserving historical mortise-and-tenon joints brings a structural honesty that modern glue simply cannot replicate.</p>
      <br />
      <p>Our workshop balances this heritage approach with modern, linear furniture profiles. The result is furniture that carries structural weight, sensory warmth, and generational endurance.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
    tags: ["Craftsmanship", "Timber"],
    readingTime: "7 MIN READ",
    publishedAt: "July 02, 2026",
    author: {
      name: "Marcus Vance",
      role: "Master Artisan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150"
    }
  },
  {
    title: "Lighting Configurations for Continuous Spaces",
    slug: "lighting-configurations",
    excerpt: "How to balance architectural white oak profiles with calculated ambient lux to capture shifting structural daylight paths.",
    content: `
      <p>Light changes everything. An architect doesn't just build walls; they calculate how those walls catch the afternoon shadow lines.</p>
      <br />
      <p>We use linear low-profile lighting solutions that blend invisibly into structural beams. This highlights the natural wood grain at night without breaking the clean modern geometry of your open-plan layouts.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
    tags: ["Lighting", "Interior"],
    readingTime: "4 MIN READ",
    publishedAt: "June 24, 2026",
    author: {
      name: "Elena Rostova",
      role: "Spatial Stylist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
    }
  }
];

// --- Next.js 13/14+ Dynamic Route Handler ---
interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function SingleArticlePage({ params }: PageProps) {
  // Promise-based params সমাধান (Next.js আধুনিক স্ট্যান্ডার্ড)
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug;

  // ১. স্লাগ অনুযায়ী রিয়েল পোস্ট ফিল্টারিং
  const currentPost = dummyBlogPosts.find((p) => p.slug === currentSlug);

  // কোনো কারণে পোস্ট না পাওয়া গেলে Next.js 404 পেজ ট্রিগার হবে
  if (!currentPost) {
    notFound();
  }

  // ২. রিলেটেড বা অন্যান্য পোস্ট ফিল্টারিং (বর্তমান পোস্ট বাদে বাকিগুলো)
  const relatedPosts = dummyBlogPosts.filter((p) => p.slug !== currentSlug);

  return (
    <BlogPost 
      post={currentPost} 
      relatedPosts={relatedPosts} 
    />
  );
}