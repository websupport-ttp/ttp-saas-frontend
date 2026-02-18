// Export all data collections
export * from './destinations';
export * from './hotels';
export * from './services';
export * from './testimonials';

// Re-export main collections for convenience
export { popularDestinations, getFeaturedDestinations } from './destinations';
export { featuredHotels, getFeaturedHotels } from './hotels';
export { serviceFeatures, mainServices, getMainServices } from './services';
export { customerTestimonials, getFeaturedTestimonials } from './testimonials';