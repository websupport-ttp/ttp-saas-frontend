'use client';

import Link from 'next/link';

const articles = [
  {
    slug: 'essential-travel-insurance-tips',
    title: 'Essential Travel Insurance Tips',
    excerpt: 'Learn what to look for in travel insurance and how to protect yourself while traveling.',
  },
  {
    slug: 'best-travel-destinations-2024',
    title: 'Best Travel Destinations 2024',
    excerpt: 'Discover the top destinations to visit in 2024 and plan your next adventure.',
  },
  {
    slug: 'ultimate-guide-budget-travel',
    title: 'Ultimate Guide to Budget Travel',
    excerpt: 'Tips and tricks for traveling on a budget without compromising on experience.',
  },
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Articles</h1>
          <p className="text-gray-600">Explore our collection of travel guides, tips, and destination information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <span className="text-brand-red font-medium hover:underline">Read More →</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-block px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
