'use client';

import React from 'react';
import {
  Wifi,
  Restaurant,
  LocalParking,
  FitnessCenter,
  Spa,
  Pool,
  RoomService,
  Business,
  Coffee,
  AcUnit,
  Bathtub,
  Elevator,
  LocalLaundryService,
  Pets,
  SmokeFree,
  AccessibleForward,
  ChildCare,
  LocalBar,
  BeachAccess,
  GolfCourse,
  DirectionsCar,
  MeetingRoom,
  SupportAgent,
  Waves,
  Anchor,
  Sailing
} from '@mui/icons-material';

interface AmenityIconProps {
  name: string;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'Free WiFi': Wifi,
  'WiFi': Wifi,
  'Restaurant': Restaurant,
  'Parking Available': LocalParking,
  'Parking': LocalParking,
  'Fitness Center': FitnessCenter,
  'Gym': FitnessCenter,
  'Spa': Spa,
  'Pool': Pool,
  'Swimming Pool': Pool,
  'Room Service': RoomService,
  'Business Center': Business,
  'Meeting Rooms': MeetingRoom,
  'Meeting Room': MeetingRoom,
  'Conference Room': MeetingRoom,
  'Tea/Coffee Machine': Coffee,
  'Coffee': Coffee,
  'Air Conditioning': AcUnit,
  'AC': AcUnit,
  'Bathroom': Bathtub,
  'Bathtub': Bathtub,
  'Elevator': Elevator,
  'Laundry': LocalLaundryService,
  'Laundry Service': LocalLaundryService,
  'Pets Allowed': Pets,
  'Pet Friendly': Pets,
  'Non-smoking': SmokeFree,
  'No Smoking': SmokeFree,
  'Wheelchair Accessible': AccessibleForward,
  'Accessible': AccessibleForward,
  'Child Care': ChildCare,
  'Kids Club': ChildCare,
  'Bar': LocalBar,
  'Lounge': LocalBar,
  'Beach Access': BeachAccess,
  'Beach': BeachAccess,
  'Golf Course': GolfCourse,
  'Golf': GolfCourse,
  'Car Rental': DirectionsCar,
  'Concierge': SupportAgent,
  'Concierge Service': SupportAgent,
  'Waterfront Views': Waves,
  'Waterfront': Waves,
  'Ocean View': Waves,
  'Sea View': Waves,
  'Marina': Anchor,
  'Marina Access': Anchor,
  'Boat Dock': Anchor,
  'Sailing': Sailing,
  'Water Sports': Sailing,
};

export default function AmenityIcon({ name, className = "h-5 w-5 text-gray-600" }: AmenityIconProps) {
  const IconComponent = iconMap[name] || Wifi; // Default to WiFi icon if not found
  
  return <IconComponent className={className} />;
}