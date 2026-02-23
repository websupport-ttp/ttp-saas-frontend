'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/auth/permissions';

interface CarFormProps {
  car: Car | null;
  onClose: (success?: boolean) => void;
  user: User;
}

interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
  transmission: string;
  pricePerDay: number;
  image?: string;
  location: string;
  availability: boolean;
  registrationNumber?: string;
  supplier: {
    name: string;
    rating: number;
  };
}

export default function CarForm({ car, onClose, user }: CarFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'economy',
    capacity: 4,
    doors: 4,
    transmission: 'automatic',
    pricePerDay: 0,
    image: '',
    location: '',
    availability: true,
    registrationNumber: '',
    supplierName: '',
    supplierRating: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: car.year,
        type: car.type,
        capacity: car.capacity,
        doors: car.doors || 4,
        transmission: car.transmission,
        pricePerDay: car.pricePerDay,
        image: car.image || '',
        location: car.location,
        availability: car.availability,
        registrationNumber: car.registrationNumber || '',
        supplierName: car.supplier?.name || 'The Travel Place',
        supplierRating: car.supplier?.rating || 4.5,
      });
      if (car.image) {
        setImagePreview(car.image);
      }
    }
  }, [car]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image;

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/api/v1/car-hire/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: formDataUpload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      return data.data.url;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Upload image first if there's a new file
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        type: formData.type,
        capacity: formData.capacity,
        doors: formData.doors,
        transmission: formData.transmission,
        pricePerDay: formData.pricePerDay,
        image: imageUrl,
        location: formData.location,
        availability: formData.availability,
        registrationNumber: formData.registrationNumber,
        supplier: {
          name: formData.supplierName,
          rating: formData.supplierRating,
        },
      };

      const url = car
        ? `${API_BASE_URL}/api/v1/car-hire/${car._id}`
        : `${API_BASE_URL}/api/v1/car-hire`;

      const response = await fetch(url, {
        method: car ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onClose(true);
      } else {
        setError(data.message || 'Failed to save car');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the car');
      console.error('Error saving car:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {car ? 'Edit Car' : 'Add New Car'}
        </h2>
        <button
          onClick={() => onClose()}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Car Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Car Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="e.g., Toyota Camry 2024"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="e.g., Toyota"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="e.g., Camry"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="2000"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="economy">Economy</option>
              <option value="compact">Compact</option>
              <option value="midsize">Midsize</option>
              <option value="fullsize">Full Size</option>
              <option value="luxury">Luxury</option>
              <option value="suv">SUV</option>
              <option value="minivan">Minivan</option>
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (Passengers) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="2"
              max="15"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {/* Doors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Doors <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="2"
              max="5"
              value={formData.doors}
              onChange={(e) => setFormData({ ...formData, doors: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transmission <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.transmission}
              onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {/* Price Per Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Day ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="e.g., Lagos, Nigeria"
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="e.g., ABC-123-XY"
            />
          </div>

          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="e.g., Premium Car Rentals"
            />
          </div>

          {/* Supplier Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier Rating <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1"
              max="5"
              step="0.1"
              value={formData.supplierRating}
              onChange={(e) => setFormData({ ...formData, supplierRating: parseFloat(e.target.value) })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Car Image
            </label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-full h-48 border border-gray-300 rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Car preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {imageFile ? imageFile.name : 'Choose Image'}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setFormData({ ...formData, image: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Upload a car image (max 5MB). Supported formats: JPG, PNG, WebP
              </p>
            </div>
          </div>

          {/* Availability */}
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Available for booking
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImage ? 'Uploading Image...' : loading ? 'Saving...' : car ? 'Update Car' : 'Add Car'}
          </button>
        </div>
      </form>
    </div>
  );
}
