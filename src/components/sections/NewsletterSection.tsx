import React, { useState } from 'react';
import Image from 'next/image';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      // Simulate API call - replace with actual newsletter subscription logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        {/* Background Image */}
        <div className="newsletter-background">
          <Image
            src="/images/newsletter-background.svg"
            alt="Newsletter background"
            width={666}
            height={608}
            className="newsletter-bg-image"
          />
        </div>

        {/* Content */}
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Subscribe to our Newsletter</h2>
            <p className="newsletter-description">
              Stay in the loop with the latest flight deals, visa updates, hotel discounts,
              and insider travel tips — all tailored for travellers. Whether you're planning
              your next international trip, applying for a visa, or just exploring your options,
              our weekly newsletter keeps you informed, inspired, and ready to go
            </p>
          </div>

          {/* Email Input Form */}
          <div className="newsletter-form">
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Input your email address in here"
                  className="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting || !email}
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <Image
                      src="/images/newsletter-arrow-icon.svg"
                      alt="Submit"
                      width={24}
                      height={24}
                    />
                  )}
                </button>
              </div>
            </form>
            {message && (
              <p className={`newsletter-message ${message.includes('Thank you') ? 'success' : 'error'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;