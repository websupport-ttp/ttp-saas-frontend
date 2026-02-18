'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HotelGalleryProps } from '@/types/hotels';

export default function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images.main);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const allImages = [images.main, ...images.thumbnails];
  const displayedThumbnails = showAllPhotos ? images.thumbnails : images.thumbnails.slice(0, 4);

  return (
    <div className="hotel-gallery">
      {/* Main Image Display */}
      <div className="main-image-container mb-4">
        <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
          <Image
            src={selectedImage}
            alt={`${hotelName} - Main view`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Thumbnails Grid */}
      <div className="thumbnails-section">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
          {images.thumbnails.length > 4 && (
            <button
              onClick={() => setShowAllPhotos(!showAllPhotos)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
            >
              {showAllPhotos ? 'Show Less' : `See More Photos (${images.thumbnails.length})`}
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {/* Main image thumbnail */}
          <button
            onClick={() => setSelectedImage(images.main)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === images.main
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Image
              src={images.main}
              alt={`${hotelName} - Thumbnail 1`}
              fill
              className="object-cover"
            />
          </button>

          {/* Additional thumbnails */}
          {displayedThumbnails.map((thumbnail, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(thumbnail)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === thumbnail
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={thumbnail}
                alt={`${hotelName} - Thumbnail ${index + 2}`}
                fill
                className="object-cover"
              />
            </button>
          ))}

          {/* Show more photos indicator */}
          {!showAllPhotos && images.thumbnails.length > 4 && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-gray-600 text-sm font-medium">
                  +{images.thumbnails.length - 4}
                </div>
                <div className="text-gray-500 text-xs">more</div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}