'use client';

import React from 'react';
import Link from 'next/link'; // 🚀 ফিক্স: নিশ্চিত করা হলো সঠিক Next.js রাউটার ইম্পোর্ট
import { motion } from 'framer-motion';

// ─── TYPES & INTERFACES ───
export interface BlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  featuredImage: string;
  tags: string[];
  readingTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}

interface BlogListProps {
  posts: BlogPostData[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  isLandingPreview?: boolean;
}

interface BlogPostLayoutProps {
  post: BlogPostData;
  relatedPosts?: BlogPostData[];
}

// ─── 1. TagBadge Component ───
export const TagBadge: React.FC<{ tag: string }> = ({ tag }) => {
  return (
    <span className="inline-block px-2.5 py-1 text-[10px] font-sans font-medium tracking-widest uppercase bg-stone-100 text-stone-600 border border-stone-200/60 rounded-sm hover:border-amber-700 hover:text-amber-800 transition-colors duration-300 cursor-pointer">
      {tag}
    </span>
  );
};

// ─── 2. BlogCard Component (Landing / List Grid) ───
export const BlogCard: React.FC<{ post: BlogPostData; index: number }> = ({ post, index }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="group flex flex-col space-y-4 bg-white border border-stone-200/60 p-4 sm:p-5 rounded-sm hover:shadow-md transition-shadow duration-500"
    >
      {/* Article Featured Image */}
      <Link href={`/blog/${post.slug}`} className="block w-full aspect-[16/10] overflow-hidden bg-stone-100 relative rounded-sm focus:outline-none">
        <motion.div
          className="w-full h-full bg-cover bg-center absolute inset-0 mix-blend-luminosity group-hover:mix-blend-normal"
          style={{ backgroundImage: `url('${post.featuredImage}')` }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </Link>

      {/* Meta Analytics Grid */}
      <div className="flex items-center justify-between text-[11px] font-sans tracking-wider text-stone-400">
        <span className="tabular-nums font-light">{post.publishedAt}</span>
        <span className="font-medium uppercase text-amber-700">{post.readingTime}</span>
      </div>

      {/* Title & Excerpt Container */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* 🚀 ফিক্স: সম্পূর্ণ টাইটেল লিঙ্কিং পাথ ঠিক করা হলো */}
          <Link href={`/blog/${post.slug}`} className="block focus:outline-none text-stone-900 hover:text-amber-800 transition-colors">
            <h3 className="text-xl font-serif font-light tracking-wide leading-tight">
              {post.title}
            </h3>
          </Link>
          <p className="text-xs font-sans font-light tracking-wide text-stone-500 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Dynamic Badges Stack */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-stone-100 mt-4">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </motion.article>
  );
};

// ─── 3. BlogList Component ───
export const BlogList: React.FC<BlogListProps> = ({
  posts,
  sectionTitle = "Atelier Chronicles",
  sectionSubtitle = "Space, Object & Architecture Notes",
  isLandingPreview = false,
}) => {
  const displayedPosts = isLandingPreview ? posts.slice(0, 3) : posts;

  return (
    <section className="w-full bg-stone-50 py-16 sm:py-24 xl:py-32 border-b border-stone-200 overflow-hidden font-serif">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        
        {/* Directory Editorial Header */}
        <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row items-baseline sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-amber-700 font-semibold">
              {sectionSubtitle}
            </p>
            <h2 className="text-3xl sm:text-4xl font-light tracking-wide text-stone-900">
              {sectionTitle}
            </h2>
          </div>
          {isLandingPreview && (
            <Link 
              href="/blog" 
              className="text-xs uppercase font-sans tracking-widest text-stone-600 hover:text-amber-800 font-semibold border-b border-stone-400 hover:border-amber-800 pb-1 transition-all"
            >
              View Journal Archive →
            </Link>
          )}
        </div>

        {/* Grid Setup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedPosts.map((post, idx) => (
            <BlogCard key={post.slug} post={post} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
};

// ─── 4. BlogPost Component (/blog/[slug]) ───
export const BlogPost: React.FC<BlogPostLayoutProps> = ({ post, relatedPosts = [] }) => {
  return (
    <article className="w-full bg-stone-50 pt-28 pb-20 font-serif overflow-hidden">
      <header className="max-w-4xl mx-auto px-4 text-center space-y-6 mb-12 md:mb-16">
        <div className="flex items-center justify-center space-x-3">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-light tracking-wide text-stone-900 leading-[1.12]">
          {post.title}
        </h1>

        <div className="flex items-center justify-center gap-4 text-xs font-sans text-stone-500 pt-2 tracking-wide border-b border-stone-200/60 pb-6 max-w-xl mx-auto">
          <img src={post.author.avatar} alt={post.author.name} className="w-9 h-9 rounded-full object-cover border border-stone-200" />
          <div className="text-left leading-tight">
            <p className="font-semibold text-stone-800">{post.author.name}</p>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">{post.author.role}</p>
          </div>
          <div className="h-4 w-[1px] bg-stone-300 mx-1" />
          <p className="tabular-nums font-light">{post.publishedAt}</p>
          <div className="h-4 w-[1px] bg-stone-300 mx-1" />
          <p className="font-medium uppercase text-amber-700 text-[11px] tracking-widest">{post.readingTime}</p>
        </div>
      </header>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 mb-14 md:mb-20">
        <div 
          className="w-full h-[40vh] sm:h-[55vh] lg:h-[65vh] xl:h-[70vh] bg-cover bg-center rounded-sm border border-stone-200 mix-blend-luminosity"
          style={{ backgroundImage: `url('${post.featuredImage}')` }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div 
          className="font-serif font-light text-base sm:text-lg text-stone-800 leading-[1.85] tracking-wide space-y-6 sm:space-y-8 select-text
            prose prose-stone max-w-none 
            first-letter:text-5xl first-letter:font-light first-letter:text-amber-800 first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:mt-1"
          dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }}
        />

        {relatedPosts.length > 0 && (
          <div className="border-t border-stone-200 pt-16 mt-20">
            <h3 className="text-xl sm:text-2xl font-light tracking-wide text-stone-900 mb-8">
              Related Editorial Architecture Notes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.slice(0, 2).map((relatedPost, idx) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};