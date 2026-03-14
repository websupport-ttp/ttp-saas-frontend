'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const articleContent: Record<string, { title: string; content: string }> = {
  'essential-travel-insurance-tips': {
    title: 'Essential Travel Insurance Tips',
    content: `
      <h2>Why Travel Insurance Matters</h2>
      <p>Travel insurance is one of the most important investments you can make before any trip. It protects you against unexpected events that could derail your plans and cost you money.</p>

      <h2>What to Look For</h2>
      <ul>
        <li><strong>Medical Coverage:</strong> Ensure adequate coverage for medical emergencies abroad</li>
        <li><strong>Trip Cancellation:</strong> Protection if you need to cancel your trip</li>
        <li><strong>Baggage Coverage:</strong> Compensation for lost or delayed luggage</li>
        <li><strong>Travel Delays:</strong> Coverage for unexpected travel delays</li>
        <li><strong>Emergency Evacuation:</strong> Critical for remote destinations</li>
      </ul>

      <h2>Tips for Choosing the Right Policy</h2>
      <p>Compare multiple policies before purchasing. Read the fine print carefully and understand what's covered and what's not. Consider your destination, trip duration, and activities planned.</p>

      <h2>When to Buy</h2>
      <p>Purchase travel insurance as soon as you book your trip. Most policies have a time limit for purchase after booking, and buying early ensures you have maximum coverage.</p>
    `
  },
  'best-travel-destinations-2024': {
    title: 'Best Travel Destinations 2024',
    content: `
      <h2>Top Destinations to Visit in 2024</h2>
      <p>2024 is shaping up to be an exciting year for travel. Here are some of the best destinations to add to your travel bucket list.</p>

      <h2>Europe</h2>
      <p>Europe continues to be a top destination with its rich history, culture, and cuisine. Consider visiting Portugal, Greece, or the Swiss Alps for unforgettable experiences.</p>

      <h2>Asia</h2>
      <p>Asia offers diverse experiences from bustling cities to serene temples. Thailand, Japan, and Vietnam are popular choices for travelers seeking authentic cultural experiences.</p>

      <h2>Africa</h2>
      <p>Africa is increasingly popular for safari adventures and cultural tourism. Kenya, Tanzania, and South Africa offer incredible wildlife experiences.</p>

      <h2>Americas</h2>
      <p>From the beaches of the Caribbean to the mountains of Peru, the Americas offer diverse travel experiences for every type of traveler.</p>

      <h2>Planning Your Trip</h2>
      <p>Start planning early to get the best deals on flights and accommodations. Consider visiting during shoulder seasons for better prices and fewer crowds.</p>
    `
  },
  'ultimate-guide-budget-travel': {
    title: 'Ultimate Guide to Budget Travel',
    content: `
      <h2>Travel on a Budget Without Sacrificing Experience</h2>
      <p>Budget travel doesn't mean missing out on amazing experiences. With smart planning and a few tips, you can travel affordably while still enjoying your destination.</p>

      <h2>Book Flights Smart</h2>
      <ul>
        <li>Use flight comparison websites to find the best deals</li>
        <li>Book flights on Tuesdays or Wednesdays for better prices</li>
        <li>Consider flying during off-peak seasons</li>
        <li>Look for budget airlines and compare total costs including baggage</li>
      </ul>

      <h2>Accommodation Tips</h2>
      <p>Consider hostels, guesthouses, or vacation rentals instead of hotels. These options are often cheaper and provide opportunities to meet other travelers.</p>

      <h2>Eat Like a Local</h2>
      <p>Skip expensive tourist restaurants and eat where locals eat. Street food and local markets offer authentic cuisine at a fraction of the cost.</p>

      <h2>Use Public Transportation</h2>
      <p>Public transportation is usually much cheaper than taxis or rental cars. Many cities offer multi-day passes that provide good value.</p>

      <h2>Free Activities</h2>
      <p>Many destinations offer free attractions like parks, museums on certain days, and walking tours. Research what's available before you arrive.</p>

      <h2>Travel Slowly</h2>
      <p>Spending more time in fewer places reduces transportation costs and allows you to experience destinations more deeply.</p>
    `
  }
};

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articleContent[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
            <Link
              href="/articles"
              className="inline-block px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/articles"
          className="text-brand-red hover:text-red-700 font-medium mb-6 inline-block"
        >
          ← Back to Articles
        </Link>

        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>
          
          <div 
            className="prose prose-sm max-w-none text-gray-600 space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/articles"
              className="inline-block px-6 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Articles
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
