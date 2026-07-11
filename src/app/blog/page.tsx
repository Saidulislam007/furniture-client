import { BlogList, BlogPostData } from "@/components/sections/BlogSection";

// 🚀 📝 লোকাল লাক্সারি ব্লগ মক ডেটা (যা এই পেজের বিল্ড এরর দূর করবে)
const dummyBlogPosts: BlogPostData[] = [
  {
    title: "The Subtle Art of Structural Minimalism",
    slug: "structural-minimalism",
    excerpt: "Exploring how negative space and honest materiality redefine contemporary high-end residential living rooms.",
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

export default function BlogDirectoryPage() {
  return (
    <div className="pt-12 bg-stone-50">
      <BlogList 
        posts={dummyBlogPosts} 
        isLandingPreview={false} 
        sectionTitle="The Atelier Journal" 
      />
    </div>
  );
}