# Figma Assets Required for Hotel Services Flow

## Overview
This document outlines the Figma assets that need to be downloaded and organized for the Hotel Services Flow implementation.

## Required Assets

### 1. Hotel Images (Task 2.1)

#### Hotel Card Images for Search Results
- **Location**: `public/images/hotels/cards/`
- **Purpose**: Thumbnail images displayed on hotel search results page
- **Format**: PNG or JPG
- **Recommended Size**: 300x200px or similar aspect ratio
- **Naming Convention**: `hotel-card-[id].png` (e.g., `hotel-card-1.png`)

#### Hotel Detail Gallery Images
- **Location**: `public/images/hotels/galleries/`
- **Purpose**: High-resolution images for hotel detail page galleries
- **Format**: PNG or JPG
- **Recommended Size**: 800x600px or higher resolution
- **Naming Convention**: `hotel-[id]-gallery-[index].png` (e.g., `hotel-1-gallery-1.png`)

### 2. Icons and UI Elements (Task 2.2)

#### Amenity Icons
- **Location**: `public/images/icons/amenities/`
- **Required Icons**:
  - WiFi: `wifi.svg`
  - Restaurant: `restaurant.svg`
  - Bathroom: `bathroom.svg`
  - Pool: `pool.svg`
  - Gym: `gym.svg`
  - Spa: `spa.svg`
  - Parking: `parking.svg`
  - Air Conditioning: `ac.svg`
  - Room Service: `room-service.svg`
  - Business Center: `business-center.svg`
- **Format**: SVG preferred for scalability
- **Size**: 24x24px or 32x32px

#### Location and UI Icons
- **Location**: `public/images/icons/ui/`
- **Required Icons**:
  - Location pin: `location-pin.svg`
  - Calendar: `calendar.svg`
  - Person/Guest: `person.svg`
  - Star rating: `star.svg`
  - Search: `search.svg`
  - Filter: `filter.svg`
  - Arrow left: `arrow-left.svg`
  - Arrow right: `arrow-right.svg`
- **Format**: SVG preferred
- **Size**: 16x16px to 24x24px

#### Payment Method Icons
- **Location**: `public/images/icons/payment/`
- **Required Icons**:
  - Credit Card: `credit-card.svg`
  - Google Pay: `google-pay.svg`
  - Apple Pay: `apple-pay.svg`
  - PayPal: `paypal.svg`
  - Cryptocurrency: `crypto.svg`
- **Format**: SVG preferred
- **Size**: 32x32px or 40x40px

## Current Status

### Completed
- ✅ Directory structure created
- ✅ Existing hotel images organized in `cards` directory
- ✅ Amenity icons created (WiFi, Restaurant, Bathroom, Pool, Gym, Spa, Parking, AC, Room Service, Business Center)
- ✅ UI icons organized and created (Location Pin, Calendar, Person, Search, Star, Filter, Arrow Left, Arrow Right)
- ✅ Payment method icons created (Credit Card, Google Pay, Apple Pay, PayPal, Cryptocurrency)
- ✅ Hotel card images organized from existing assets

### Pending (Figma-specific assets)
- ❌ Figma file URL/key needed to download additional assets
- ❌ Additional hotel card images extraction from Figma (if needed)
- ❌ Hotel gallery images extraction from Figma
- ❌ Custom branded icons extraction from Figma (if different from created ones)

## Next Steps

1. **Obtain Figma File Information**
   - Get Figma file URL or file key
   - Ensure access permissions to the Figma file

2. **Download Assets Using Figma CLI Tool**
   - Extract hotel images for cards and galleries
   - Download all required icons
   - Organize assets in the prepared directory structure

3. **Verify Asset Quality**
   - Check image resolutions and formats
   - Ensure all required assets are downloaded
   - Test asset loading in the application

## Requirements Mapping

This task addresses the following requirements:
- **Requirement 1.5**: Hotel card display with images
- **Requirement 2.3**: Amenity filtering with icons
- **Requirement 3.2**: Hotel gallery display
- **Requirement 3.3**: Amenity display with icons
- **Requirement 5.1**: Payment method selection with icons

## Notes

- All existing hotel images have been copied to the `cards` directory as placeholders
- The directory structure is ready for Figma asset integration
- SVG format is preferred for icons to ensure scalability across different screen sizes
- Image optimization should be considered after download to ensure optimal web performance