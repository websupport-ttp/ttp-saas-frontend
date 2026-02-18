import { Testimonial } from '@/types';

export const customerTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    text: 'The Travel Place made our dream vacation to Japan absolutely perfect! From booking flights to finding the best hotels, everything was seamless. The customer service was exceptional, and we saved so much money compared to other platforms.',
    author: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'Tech Solutions Inc.',
    avatar: '/images/author-avatar.jpg',
    rating: 5,
    location: 'New York, USA',
    date: '2024-02-15'
  },
  {
    id: 'testimonial-2',
    text: 'I\'ve used many travel booking sites, but The Travel Place stands out for its user-friendly interface and incredible deals. Booked a last-minute trip to Greece and got amazing prices on both flights and accommodation.',
    author: 'Michael Chen',
    role: 'Software Engineer',
    company: 'Digital Innovations',
    avatar: '/images/author-avatar-1.svg',
    rating: 5,
    location: 'San Francisco, USA',
    date: '2024-01-28'
  },
  {
    id: 'testimonial-3',
    text: 'Outstanding service! The visa assistance program helped me navigate the complex application process for my business trip to Morocco. The team was knowledgeable, responsive, and made everything stress-free.',
    author: 'Emma Rodriguez',
    role: 'Business Consultant',
    company: 'Global Strategies',
    avatar: '/images/author-avatar-2.svg',
    rating: 5,
    location: 'Miami, USA',
    date: '2024-03-10'
  },
  {
    id: 'testimonial-4',
    text: 'The Travel Place exceeded all my expectations! Their tour package to Peru was incredibly well-organized. The local guides were fantastic, and every detail was perfectly planned. Highly recommend for adventure travelers!',
    author: 'David Thompson',
    role: 'Adventure Photographer',
    company: 'Freelance',
    avatar: '/images/author-avatar.svg',
    rating: 5,
    location: 'Denver, USA',
    date: '2024-02-22'
  },
  {
    id: 'testimonial-5',
    text: 'Booking our honeymoon through The Travel Place was the best decision we made. They found us the perfect romantic resort in Santorini at an unbeatable price. The booking process was smooth and the support team was always available.',
    author: 'Lisa & James Wilson',
    role: 'Newlyweds',
    company: '',
    avatar: '/images/author-avatar-1.svg',
    rating: 5,
    location: 'Chicago, USA',
    date: '2024-01-18'
  },
  {
    id: 'testimonial-6',
    text: 'As a frequent business traveler, I appreciate The Travel Place\'s efficiency and reliability. Their corporate travel solutions have streamlined our company\'s travel booking process significantly. Great value and excellent service!',
    author: 'Robert Kim',
    role: 'Operations Manager',
    company: 'International Corp',
    avatar: '/images/author-avatar-2.svg',
    rating: 4,
    location: 'Seattle, USA',
    date: '2024-03-05'
  },
  {
    id: 'testimonial-7',
    text: 'The family vacation package to Thailand was absolutely wonderful! The Travel Place took care of every detail, from kid-friendly hotels to exciting activities. Our children are still talking about the amazing experiences we had.',
    author: 'Jennifer Martinez',
    role: 'Teacher',
    company: 'Lincoln Elementary',
    avatar: '/images/author-avatar.svg',
    rating: 5,
    location: 'Austin, USA',
    date: '2024-02-08'
  }
];

export const getTestimonialById = (id: string): Testimonial | undefined => {
  return customerTestimonials.find(testimonial => testimonial.id === id);
};

export const getFeaturedTestimonials = (count: number = 5): Testimonial[] => {
  return customerTestimonials.slice(0, count);
};

export const getTestimonialsByRating = (minRating: number): Testimonial[] => {
  return customerTestimonials.filter(testimonial => testimonial.rating >= minRating);
};

export const getRecentTestimonials = (count: number = 3): Testimonial[] => {
  return customerTestimonials
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};