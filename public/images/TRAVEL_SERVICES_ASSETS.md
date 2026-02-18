# Travel Services Visual Assets Documentation

## Overview
This document outlines all visual assets created for the additional travel services (car hire, visa applications, and travel insurance) and the comprehensive styling system implemented for visual consistency.

## Asset Structure

### Car Hire Assets

#### Car Images (`/images/cars/`)
- `toyota-corolla.svg` / `toyota-corolla.jpg` - Economy car representation
- `honda-civic.svg` / `honda-civic.jpg` - Compact car representation  
- `ford-explorer.svg` / `ford-explorer.jpg` - SUV representation
- `bmw-3-series.svg` / `bmw-3-series.jpg` - Luxury car representation
- `nissan-sentra.svg` / `nissan-sentra.jpg` - Budget compact car
- `chevrolet-tahoe.svg` / `chevrolet-tahoe.jpg` - Large SUV representation
- `placeholder-car.png` / `placeholder-car.jpg` - Fallback images

#### Supplier Logos (`/images/suppliers/`)
- `budget.png` - Budget car rental logo
- `hertz.png` - Hertz car rental logo
- `enterprise.png` - Enterprise car rental logo
- `avis.png` - Avis car rental logo
- `thrifty.png` - Thrifty car rental logo

#### Car Feature Icons (`/images/icons/car-features/`)
- `snowflake.svg` - Air conditioning icon
- `road.svg` - Unlimited mileage icon
- `gear.svg` - Transmission type icon
- `map-pin.svg` - GPS navigation icon
- `bluetooth.svg` - Bluetooth connectivity icon
- `usb.svg` - USB ports icon

### Visa Application Assets

#### Country Flags (`/images/flags/`)
- `US.svg` - United States flag
- `GB.svg` - United Kingdom flag
- `CA.svg` - Canada flag
- `AU.svg` - Australia flag
- `DE.svg` - Germany flag
- `FR.svg` - France flag
- `JP.svg` - Japan flag
- `CN.svg` - China flag
- `IN.svg` - India flag
- `BR.svg` - Brazil flag

#### Visa Type Icons (`/images/icons/visa/`)
- `tourist.svg` - Tourist visa icon
- `business.svg` - Business visa icon
- `transit.svg` - Transit visa icon
- `embassy.svg` - Embassy building icon
- `consulate.svg` - Consulate building icon

#### Progress Indicators (`/images/icons/visa/`)
- `step-1.svg` through `step-5.svg` - Numbered progress indicators

### Travel Insurance Assets

#### Coverage Icons (`/images/icons/insurance/`)
- `medical.svg` - Medical coverage icon
- `trip-cancellation.svg` - Trip cancellation coverage icon
- `baggage.svg` - Baggage coverage icon
- `flight-delay.svg` - Flight delay coverage icon
- `emergency-evacuation.svg` - Emergency evacuation icon
- `personal-liability.svg` - Personal liability coverage icon

#### Plan Comparison Graphics (`/images/icons/insurance/`)
- `basic-plan.svg` - Basic plan visual indicator
- `standard-plan.svg` - Standard plan visual indicator
- `premium-plan.svg` - Premium plan visual indicator

#### Policy Documents (`/images/icons/insurance/`)
- `policy-document.svg` - Policy document preview icon
- `certificate.svg` - Insurance certificate icon

## Styling System

### Core CSS File
`/src/styles/travel-services-polish.css` - Comprehensive styling system providing:

#### Global Components
- `.service-card` - Consistent card styling with hover effects
- `.service-header` - Standardized header styling
- `.service-form` - Form container styling
- `.form-section` - Form section organization

#### Button System
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons  
- `.btn-success` - Success/confirmation buttons
- All buttons include hover effects and micro-interactions

#### Form Elements
- `.input-field` - Text input styling
- `.select-field` - Select dropdown styling
- `.checkbox-field` - Checkbox styling
- `.radio-field` - Radio button styling
- Focus states and transitions included

#### Progress Indicators
- `.progress-container` - Progress bar container
- `.progress-step` - Individual progress steps
- `.progress-step-number` - Step number styling
- `.progress-line` - Connecting lines between steps

#### Service-Specific Enhancements

##### Car Hire
- `.car-card` - Car listing card styling
- `.car-image` - Car image with hover zoom effect
- `.car-features` - Feature badge container
- `.car-feature-badge` - Individual feature badges
- `.supplier-logo` - Supplier logo styling

##### Visa Application
- `.visa-card` - Visa application card styling
- `.country-flag` - Country flag display
- `.visa-type-badge` - Visa type indicators
- `.appointment-location` - Appointment location cards

##### Travel Insurance
- `.insurance-plan-card` - Insurance plan cards
- `.insurance-plan-card.popular` - Popular plan highlighting
- `.coverage-item` - Coverage line items
- `.coverage-amount` - Coverage amount display
- `.premium-display` - Premium pricing display

#### Accessibility Features
- High contrast mode support
- Reduced motion support for users with vestibular disorders
- Focus indicators for keyboard navigation
- Screen reader support classes

#### Responsive Design
- Mobile-first approach
- Tablet-specific adjustments
- Large screen optimizations
- Touch-friendly interactions on mobile

#### Micro-interactions
- `.hover-lift` - Subtle lift effect on hover
- `.fade-in` - Fade in animation
- `.slide-in-right` - Slide in from right animation
- Loading states and error states

## Implementation Guidelines

### Using the Assets

#### Car Images
```jsx
<img 
  src="/images/cars/toyota-corolla.jpg" 
  alt="Toyota Corolla - Economy Car"
  className="car-image"
  onError={(e) => {
    e.target.src = '/images/placeholder-car.jpg';
  }}
/>
```

#### Country Flags
```jsx
<img 
  src="/images/flags/US.svg" 
  alt="United States Flag"
  className="country-flag"
/>
```

#### Feature Icons
```jsx
<img 
  src="/images/icons/car-features/snowflake.svg" 
  alt="Air Conditioning"
  className="w-5 h-5"
/>
```

### Applying Styles

#### Service Cards
```jsx
<div className="service-card">
  <div className="service-header">
    <h2 className="service-title">Service Name</h2>
    <p className="service-subtitle">Service description</p>
  </div>
  <div className="service-form">
    {/* Form content */}
  </div>
</div>
```

#### Buttons
```jsx
<button className="btn-primary hover-lift">
  Primary Action
</button>
<button className="btn-secondary">
  Secondary Action
</button>
```

#### Form Fields
```jsx
<input 
  type="text" 
  className="input-field focus-visible" 
  placeholder="Enter text"
/>
<select className="select-field focus-visible">
  <option>Select option</option>
</select>
```

## Accessibility Compliance

### WCAG 2.1 AA Standards
- Color contrast ratios meet minimum requirements
- All interactive elements are keyboard accessible
- Images have appropriate alt text
- Form fields have proper labels
- Heading hierarchy is maintained

### Screen Reader Support
- Semantic HTML structure
- ARIA labels where needed
- Skip navigation links
- Live regions for dynamic content

### Keyboard Navigation
- Logical tab order
- Visible focus indicators
- No keyboard traps
- Consistent navigation patterns

## Browser Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallbacks
- CSS Grid with Flexbox fallback
- Modern CSS with vendor prefixes
- Progressive enhancement approach

## Performance Considerations

### Image Optimization
- SVG icons for scalability
- Appropriate image formats (SVG for icons, JPG for photos)
- Lazy loading implementation ready
- Responsive image sizing

### CSS Optimization
- Utility-first approach with Tailwind CSS
- Component-based styling
- Minimal custom CSS
- Tree-shaking compatible

## Maintenance Guidelines

### Adding New Assets
1. Follow naming conventions
2. Maintain consistent sizing
3. Include appropriate alt text
4. Test across devices
5. Update documentation

### Modifying Styles
1. Use existing utility classes when possible
2. Follow BEM methodology for custom classes
3. Test accessibility impact
4. Verify responsive behavior
5. Update style guide

### Quality Assurance
1. Run accessibility checker (included)
2. Test keyboard navigation
3. Verify color contrast
4. Check responsive design
5. Validate HTML semantics

## Future Enhancements

### Planned Improvements
- Dark mode support
- Additional animation options
- More comprehensive icon library
- Enhanced mobile interactions
- Performance monitoring integration

### Extensibility
- Modular CSS architecture
- Component-based approach
- Theme customization support
- Plugin system compatibility