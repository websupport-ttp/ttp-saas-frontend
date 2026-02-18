// ============================================================================
// EMAIL UTILITY FUNCTIONS
// ============================================================================

/**
 * Email template types for different services
 */
export type EmailTemplate = 
  | 'car-rental-confirmation'
  | 'hotel-booking-confirmation'
  | 'flight-booking-confirmation'
  | 'visa-application-confirmation'
  | 'insurance-policy-confirmation';

/**
 * Email data interface for different booking types
 */
export interface EmailData {
  to: string;
  customerName: string;
  confirmationNumber: string;
  bookingDetails: any;
  template: EmailTemplate;
}

/**
 * Simulate sending a confirmation email
 * In a real application, this would integrate with an email service like SendGrid, AWS SES, etc.
 */
export async function sendConfirmationEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log email details for development
    console.log('📧 Sending confirmation email:', {
      to: emailData.to,
      template: emailData.template,
      confirmationNumber: emailData.confirmationNumber,
      customerName: emailData.customerName
    });
    
    // Simulate successful email sending
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    return {
      success: true,
      messageId
    };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Generate email subject based on template type
 */
export function getEmailSubject(template: EmailTemplate, confirmationNumber: string): string {
  const subjects = {
    'car-rental-confirmation': `Car Rental Confirmation - ${confirmationNumber}`,
    'hotel-booking-confirmation': `Hotel Booking Confirmation - ${confirmationNumber}`,
    'flight-booking-confirmation': `Flight Booking Confirmation - ${confirmationNumber}`,
    'visa-application-confirmation': `Visa Assistance Confirmation - ${confirmationNumber}`,
    'insurance-policy-confirmation': `Travel Insurance Policy - ${confirmationNumber}`
  };
  
  return subjects[template] || `Booking Confirmation - ${confirmationNumber}`;
}