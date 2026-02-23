'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CarRental, CarExtra } from '@/types/car-hire';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { calculateCarRentalCost, calculateRentalDays, formatCarFeatures } from '@/lib/car-hire-utils';
import { COMMON_CAR_EXTRAS } from '@/lib/constants/car-hire';
import { cn } from '@/lib/utils';

interface CarDetailsViewProps {
  car: CarRental;
  pickupDate: Date;
  returnDate: Date;
  selectedExtras: CarExtra[];
  onExtrasChange: (extras: CarExtra[]) => void;
  onBookNow: () => void;
  className?: string;
}

export default function CarDetailsView({
  car,
  pickupDate,
  returnDate,
  selectedExtras,
  onExtrasChange,
  onBookNow,
  className
}: CarDetailsViewProps) {
  const [extrasQuantities, setExtrasQuantities] = useState<{ [key: string]: number }>({});
  
  const rentalDays = calculateRentalDays(pickupDate, returnDate);
  const baseCost = car.pricePerDay * rentalDays;
  const totalCost = calculateCarRentalCost(car, pickupDate, returnDate, selectedExtras);
  const extrasCost = totalCost - baseCost;

  const handleExtraToggle = (extraId: string, checked: boolean) => {
    const extra = COMMON_CAR_EXTRAS.find(e => e.id === extraId);
    if (!extra) return;

    if (checked) {
      const quantity = extrasQuantities[extraId] || 1;
      const newExtra: CarExtra = {
        id: extra.id,
        name: extra.name,
        description: `${extra.name} for ${rentalDays} days`,
        pricePerDay: extra.pricePerDay,
        quantity,
        category: extra.category
      };
      onExtrasChange([...selectedExtras, newExtra]);
    } else {
      onExtrasChange(selectedExtras.filter(e => e.id !== extraId));
      setExtrasQuantities(prev => {
        const { [extraId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleQuantityChange = (extraId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setExtrasQuantities(prev => ({ ...prev, [extraId]: quantity }));
    
    const updatedExtras = selectedExtras.map(extra => 
      extra.id === extraId ? { ...extra, quantity } : extra
    );
    onExtrasChange(updatedExtras);
  };

  const isExtraSelected = (extraId: string) => {
    return selectedExtras.some(extra => extra.id === extraId);
  };

  const getExtraQuantity = (extraId: string) => {
    const extra = selectedExtras.find(e => e.id === extraId);
    return extra?.quantity || extrasQuantities[extraId] || 1;
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-lg overflow-hidden', className)}>
      {/* Car Image and Basic Info */}
      <div className="relative h-64 sm:h-80">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">{car.name}</h2>
          <p className="text-lg opacity-90">{car.supplier?.name || 'The Travel Place'}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Car Specifications */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Car Features</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formatCarFeatures(car).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* Additional Features */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {car.features.filter(f => f.included).map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-700">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Location and Hours */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Pickup Location</h3>
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">{car.supplier?.location || car.location || 'Lagos, Nigeria'}</p>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">Weekdays:</span> {car.supplier?.hoursOfOperation?.weekdays || '8:00 AM - 6:00 PM'}</p>
              <p><span className="font-medium">Weekends:</span> {car.supplier?.hoursOfOperation?.weekends || '9:00 AM - 5:00 PM'}</p>
            </div>
          </div>
        </div>

        {/* Extras Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Extras</h3>
          <div className="space-y-4">
            {COMMON_CAR_EXTRAS.map((extra) => {
              const isSelected = isExtraSelected(extra.id);
              const quantity = getExtraQuantity(extra.id);
              const dailyCost = extra.pricePerDay * quantity;
              const totalExtraCost = dailyCost * rentalDays;

              return (
                <div key={extra.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Checkbox
                        id={`extra-${extra.id}`}
                        label={extra.name}
                        description={`$${extra.pricePerDay}/day`}
                        checked={isSelected}
                        onChange={(e) => handleExtraToggle(extra.id, e.target.checked)}
                      />
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        ${totalExtraCost} total
                      </p>
                      <p className="text-xs text-gray-500">
                        ${dailyCost}/day × {rentalDays} days
                      </p>
                    </div>
                  </div>
                  
                  {isSelected && (extra.id === 'child_seat' || extra.id === 'booster_seat' || extra.id === 'additional_driver') && (
                    <div className="mt-3 flex items-center space-x-3">
                      <label className="text-sm font-medium text-gray-700">Quantity:</label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(extra.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(extra.id, quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Car rental ({rentalDays} days)</span>
              <span className="font-medium">${baseCost}</span>
            </div>
            
            {selectedExtras.length > 0 && (
              <>
                {selectedExtras.map((extra) => (
                  <div key={extra.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {extra.name} {extra.quantity > 1 && `(×${extra.quantity})`}
                    </span>
                    <span className="text-gray-600">
                      ${extra.pricePerDay * extra.quantity * rentalDays}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-2">
                  <span className="text-gray-700">Extras subtotal</span>
                  <span className="font-medium">${extrasCost}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-3">
              <span>Total</span>
              <span className="text-brand-red">${totalCost}</span>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="mt-8">
          <Button
            onClick={onBookNow}
            size="lg"
            className="text-lg font-semibold"
          >
            Book Now - ${totalCost}
          </Button>
        </div>
      </div>
    </div>
  );
}