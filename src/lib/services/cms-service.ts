// CMS API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface HeroSlide {
  _id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: {
    url: string;
    publicId?: string;
  };
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

export interface HotDeal {
  _id?: string;
  title: string;
  description: string;
  image?: {
    url: string;
    publicId?: string;
  };
  originalPrice: number;
  discountedPrice: number;
  discountPercentage?: number;
  category: 'Flight' | 'Hotel' | 'Package' | 'Car Rental' | 'Insurance';
  validFrom: string;
  validUntil: string;
  link?: string;
  isActive: boolean;
  featured: boolean;
}

export interface Article {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: {
    url: string;
    publicId?: string;
  };
  author: string | { firstName: string; lastName: string };
  category: 'Travel Tips' | 'Destinations' | 'News' | 'Guides' | 'Reviews';
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  featured: boolean;
}

export interface GoogleReview {
  _id?: string;
  reviewId: string;
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text?: string;
  time: string;
  language: string;
  isVisible: boolean;
}

class CMSService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  // Hero Slides
  async getHeroSlides(activeOnly = false): Promise<{ data: HeroSlide[] }> {
    const url = `${API_BASE_URL}/api/v1/cms/hero-slides${activeOnly ? '?active=true' : ''}`;
    return this.fetchWithAuth(url);
  }

  async createHeroSlide(slide: Omit<HeroSlide, '_id'>): Promise<{ data: HeroSlide }> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/hero-slides`, {
      method: 'POST',
      body: JSON.stringify(slide),
    });
  }

  async updateHeroSlide(id: string, slide: Partial<HeroSlide>): Promise<{ data: HeroSlide }> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/hero-slides/${id}`, {
      method: 'PUT',
      body: JSON.stringify(slide),
    });
  }

  async deleteHeroSlide(id: string): Promise<void> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/hero-slides/${id}`, {
      method: 'DELETE',
    });
  }

  // Hot Deals
  async getHotDeals(activeOnly = false, category?: string): Promise<{ data: HotDeal[] }> {
    const params = new URLSearchParams();
    if (activeOnly) params.append('active', 'true');
    if (category) params.append('category', category);
    
    const url = `${API_BASE_URL}/api/v1/cms/hot-deals${params.toString() ? `?${params.toString()}` : ''}`;
    return this.fetchWithAuth(url);
  }

  async createHotDeal(deal: Omit<HotDeal, '_id'>): Promise<{ data: HotDeal }> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/hot-deals`, {
      method: 'POST',
      body: JSON.stringify(deal),
    });
  }

  async updateHotDeal(id: string, deal: Partial<HotDeal>): Promise<{ data: HotDeal }> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/hot-deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deal),
    });
  }

  async deleteHotDeal(id: string): Promise<void> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/hot-deals/${id}`, {
      method: 'DELETE',
    });
  }

  // Articles
  async getArticles(publishedOnly = false, category?: string, featuredOnly = false): Promise<{ data: Article[] }> {
    const params = new URLSearchParams();
    if (publishedOnly) params.append('published', 'true');
    if (category) params.append('category', category);
    if (featuredOnly) params.append('featured', 'true');
    
    const url = `${API_BASE_URL}/api/v1/cms/articles${params.toString() ? `?${params.toString()}` : ''}`;
    return this.fetchWithAuth(url);
  }

  async getArticleBySlug(slug: string): Promise<{ data: Article }> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/articles/${slug}`);
  }

  async createArticle(article: Omit<Article, '_id' | 'author' | 'viewCount'>): Promise<{ data: Article }> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/articles`, {
      method: 'POST',
      body: JSON.stringify(article),
    });
  }

  async updateArticle(id: string, article: Partial<Article>): Promise<{ data: Article }> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  }

  async deleteArticle(id: string): Promise<void> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Google Reviews
  async getGoogleReviews(): Promise<{ data: GoogleReview[] }> {
    return this.fetchWithAuth(`${API_BASE_URL}/api/v1/cms/google-reviews`);
  }
}

export const cmsService = new CMSService();
