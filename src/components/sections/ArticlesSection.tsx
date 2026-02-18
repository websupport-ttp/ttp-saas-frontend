'use client'

import Image from 'next/image'
import Link from 'next/link'

const articles = [
  {
    id: 1,
    title: 'Best Travel Destinations for 2024',
    excerpt: 'Discover the most amazing places to visit this year, from hidden gems to popular tourist spots that offer unforgettable experiences.',
    image: '/images/testimonial-bg.png',
    author: 'Sarah Johnson',
    date: 'March 15, 2024',
    readTime: '5 min read',
    category: 'Travel Tips',
    slug: 'best-travel-destinations-2024'
  },
  {
    id: 2,
    title: 'Ultimate Guide to Budget Travel',
    excerpt: 'Learn how to travel the world without breaking the bank. Tips and tricks for finding cheap flights, accommodation, and activities.',
    image: '/images/labuan-bajo.png',
    author: 'Michael Chen',
    date: 'March 12, 2024',
    readTime: '8 min read',
    category: 'Budget Travel',
    slug: 'ultimate-guide-budget-travel'
  },
  {
    id: 3,
    title: 'Essential Travel Insurance Tips',
    excerpt: 'Everything you need to know about travel insurance, from choosing the right coverage to making claims when things go wrong.',
    image: '/images/le-pirate-hotel.png',
    author: 'Emma Wilson',
    date: 'March 10, 2024',
    readTime: '6 min read',
    category: 'Travel Safety',
    slug: 'essential-travel-insurance-tips'
  }
]

export default function ArticlesSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-5 h-5 bg-yellow-600 rounded-sm"></div>
            <span className="text-yellow-600 font-semibold text-sm tracking-[10%] uppercase">
              Latest Articles
            </span>
          </div>
          <h2 className="text-gray-900 text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Travel Insights & Tips
          </h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
            Stay updated with the latest travel trends, tips, and destination guides to make your next adventure unforgettable.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Article Image */}
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Article Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>{article.author}</span>
                </div>

                {/* Article Title */}
                <h3 className="text-gray-900 text-lg lg:text-xl font-bold mb-3 line-clamp-2 group-hover:text-brand-red transition-colors duration-200">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>

                {/* Article Excerpt */}
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Read More Link */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center gap-2 text-brand-red font-semibold text-sm hover:gap-3 transition-all duration-200"
                >
                  Read More
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Articles Button */}
        <div className="text-center mt-12">
          <Link
            href="/articles"
            className="inline-flex items-center gap-3 bg-brand-red hover:bg-brand-red-dark text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            View All Articles
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}