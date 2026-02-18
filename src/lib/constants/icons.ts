/**
 * Icon components using Material Design Icons
 * Organized by category for easy access
 */

import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import SettingsIcon from '@mui/icons-material/Settings';
import BluetoothIcon from '@mui/icons-material/Bluetooth';
import PlaceIcon from '@mui/icons-material/Place';
import UsbIcon from '@mui/icons-material/Usb';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import WifiIcon from '@mui/icons-material/Wifi';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BathtubIcon from '@mui/icons-material/Bathtub';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SpaIcon from '@mui/icons-material/Spa';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CreditCardIcon from '@mui/icons-material/CreditCard';

// Material UI Icon Components
export const AMENITY_ICON_COMPONENTS = {
  wifi: WifiIcon,
  restaurant: RestaurantIcon,
  bathroom: BathtubIcon,
  pool: PoolIcon,
  gym: FitnessCenterIcon,
  spa: SpaIcon,
  parking: LocalParkingIcon,
  ac: AcUnitIcon,
  roomService: RoomServiceIcon,
  businessCenter: BusinessCenterIcon,
} as const;

export const UI_ICON_COMPONENTS = {
  locationPin: LocationOnIcon,
  calendar: CalendarTodayIcon,
  person: PersonIcon,
  users: PeopleIcon,
  search: SearchIcon,
  star: StarIcon,
  filter: FilterListIcon,
  arrowLeft: ArrowBackIcon,
  arrowRight: ArrowForwardIcon,
  snowflake: AcUnitIcon,
  infinity: AllInclusiveIcon,
  gear: SettingsIcon,
  bluetooth: BluetoothIcon,
  mapPin: PlaceIcon,
  usb: UsbIcon,
  road: DirectionsCarIcon,
} as const;

export const PAYMENT_ICON_COMPONENTS = {
  creditCard: CreditCardIcon,
} as const;

// Legacy SVG paths (kept for backward compatibility)
export const AMENITY_ICONS = {
  wifi: '/images/icons/amenities/wifi.svg',
  restaurant: '/images/icons/amenities/restaurant.svg',
  bathroom: '/images/icons/amenities/bathroom.svg',
  pool: '/images/icons/amenities/pool.svg',
  gym: '/images/icons/amenities/gym.svg',
  spa: '/images/icons/amenities/spa.svg',
  parking: '/images/icons/amenities/parking.svg',
  ac: '/images/icons/amenities/ac.svg',
  roomService: '/images/icons/amenities/room-service.svg',
  businessCenter: '/images/icons/amenities/business-center.svg',
} as const;

export const UI_ICONS = {
  locationPin: '/images/icons/ui/location-pin.svg',
  calendar: '/images/icons/ui/calendar.svg',
  person: '/images/icons/ui/person.svg',
  users: '/images/icons/ui/users.svg',
  search: '/images/icons/ui/search.svg',
  star: '/images/icons/ui/star.svg',
  filter: '/images/icons/ui/filter.svg',
  arrowLeft: '/images/icons/ui/arrow-left.svg',
  arrowRight: '/images/icons/ui/arrow-right.svg',
  snowflake: '/images/icons/ui/snowflake.svg',
  infinity: '/images/icons/ui/infinity.svg',
  gear: '/images/icons/ui/gear.svg',
  bluetooth: '/images/icons/ui/bluetooth.svg',
  mapPin: '/images/icons/ui/map-pin.svg',
  usb: '/images/icons/ui/usb.svg',
  road: '/images/icons/ui/road.svg',
} as const;

export const PAYMENT_ICONS = {
  creditCard: '/images/icons/payment/credit-card.svg',
  googlePay: '/images/icons/payment/google-pay.svg',
  applePay: '/images/icons/payment/apple-pay.svg',
  paypal: '/images/icons/payment/paypal.svg',
  crypto: '/images/icons/payment/crypto.svg',
} as const;

export const HOTEL_IMAGES = {
  cards: {
    hotel1: '/images/hotels/cards/hotel-1.png',
    hotel2: '/images/hotels/cards/hotel-2.png',
    hotel3: '/images/hotels/cards/hotel-3.png',
    hotel4: '/images/hotels/cards/hotel-4.png',
    hotel5: '/images/hotels/cards/hotel-5.png',
  },
  galleries: {
    // To be populated when Figma gallery images are downloaded
  },
} as const;

// Type definitions for icon categories
export type AmenityIconKey = keyof typeof AMENITY_ICON_COMPONENTS;
export type UIIconKey = keyof typeof UI_ICON_COMPONENTS;
export type PaymentIconKey = keyof typeof PAYMENT_ICON_COMPONENTS;

// Helper function to get amenity icon component by key
export const getAmenityIconComponent = (key: AmenityIconKey) => {
  return AMENITY_ICON_COMPONENTS[key];
};

// Helper function to get UI icon component by key
export const getUIIconComponent = (key: UIIconKey) => {
  return UI_ICON_COMPONENTS[key];
};

// Helper function to get payment icon component by key
export const getPaymentIconComponent = (key: PaymentIconKey) => {
  return PAYMENT_ICON_COMPONENTS[key];
};

// Legacy helper functions (kept for backward compatibility)
export const getAmenityIcon = (key: keyof typeof AMENITY_ICONS): string => {
  return AMENITY_ICONS[key];
};

export const getUIIcon = (key: keyof typeof UI_ICONS): string => {
  return UI_ICONS[key];
};

export const getPaymentIcon = (key: keyof typeof PAYMENT_ICONS): string => {
  return PAYMENT_ICONS[key];
};

// All icons combined for easy access
export const ALL_ICONS = {
  amenities: AMENITY_ICONS,
  ui: UI_ICONS,
  payment: PAYMENT_ICONS,
} as const;

export const ALL_ICON_COMPONENTS = {
  amenities: AMENITY_ICON_COMPONENTS,
  ui: UI_ICON_COMPONENTS,
  payment: PAYMENT_ICON_COMPONENTS,
} as const;