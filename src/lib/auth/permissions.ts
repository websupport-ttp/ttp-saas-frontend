// lib/auth/permissions.ts
/**
 * Permission and access control utilities for role-based dashboards
 */

export enum UserRole {
  USER = 'User',
  CUSTOMER = 'customer',
  BUSINESS = 'Business',
  STAFF = 'Staff',
  VENDOR = 'vendor',
  AGENT = 'agent',
  MANAGER = 'Manager',
  EXECUTIVE = 'Executive',
  ADMIN = 'Admin',
}

export enum StaffClearanceLevel {
  TIER_1 = 1,
  TIER_2 = 2,
  TIER_3 = 3,
  TIER_4 = 4,
}

export interface User {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: string; // Accept any string — backend returns lowercase
  isVerified?: boolean;
  staffClearanceLevel?: StaffClearanceLevel;
  staffDepartment?: string;
  staffEmployeeId?: string;
  staffDesignation?: string;
  vendorDetails?: {
    businessName?: string;
    commissionRate?: number;
    isApproved?: boolean;
  };
  agentDetails?: {
    agencyName?: string;
    agentCode?: string;
    commissionRate?: number;
    isApproved?: boolean;
  };
  profilePicture?: {
    url: string;
    publicId: string;
  };
}

export interface DashboardPermissions {
  canViewBookings: boolean;
  canManageBookings: boolean;
  canViewInventory: boolean;
  canManageInventory: boolean;
  canViewReports: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canManageStaff: boolean;
  canViewFinancials: boolean;
  canManageSettings: boolean;
  canProcessPayments: boolean;
  canViewAllCustomers: boolean;
}

/** Normalise role string to lowercase for comparison */
function normaliseRole(role: string | undefined): string {
  return (role || '').toLowerCase();
}

export function getDashboardPermissions(user: User | null): DashboardPermissions {
  const empty: DashboardPermissions = {
    canViewBookings: false, canManageBookings: false, canViewInventory: false,
    canManageInventory: false, canViewReports: false, canViewAnalytics: false,
    canManageUsers: false, canManageStaff: false, canViewFinancials: false,
    canManageSettings: false, canProcessPayments: false, canViewAllCustomers: false,
  };

  if (!user) return empty;

  const role = normaliseRole(user.role);
  const { staffClearanceLevel } = user;

  if (role === 'admin') {
    return { canViewBookings: true, canManageBookings: true, canViewInventory: true, canManageInventory: true, canViewReports: true, canViewAnalytics: true, canManageUsers: true, canManageStaff: true, canViewFinancials: true, canManageSettings: true, canProcessPayments: true, canViewAllCustomers: true };
  }

  if (role === 'executive') {
    return { ...empty, canViewBookings: true, canManageBookings: true, canViewInventory: true, canManageInventory: true, canViewReports: true, canViewAnalytics: true, canManageStaff: true, canViewFinancials: true, canProcessPayments: true, canViewAllCustomers: true };
  }

  if (role === 'manager') {
    return { ...empty, canViewBookings: true, canManageBookings: true, canViewInventory: true, canManageInventory: true, canViewReports: true, canViewAnalytics: true, canProcessPayments: true, canViewAllCustomers: true };
  }

  if (role === 'staff') {
    if (staffClearanceLevel === StaffClearanceLevel.TIER_4) {
      return { ...empty, canViewBookings: true, canManageBookings: true, canViewInventory: true, canManageInventory: true, canViewReports: true, canViewAnalytics: true, canProcessPayments: true, canViewAllCustomers: true };
    }
    if (staffClearanceLevel === StaffClearanceLevel.TIER_3) {
      return { ...empty, canViewBookings: true, canManageBookings: true, canViewInventory: true, canManageInventory: true, canViewReports: true, canProcessPayments: true, canViewAllCustomers: true };
    }
    if (staffClearanceLevel === StaffClearanceLevel.TIER_2) {
      return { ...empty, canViewBookings: true, canManageBookings: true, canViewInventory: true, canManageInventory: true, canProcessPayments: true };
    }
    return { ...empty, canViewBookings: true, canViewInventory: true };
  }

  if (role === 'business') {
    return { ...empty, canViewBookings: true, canManageBookings: true, canViewReports: true };
  }

  // customer / user / guest / vendor / agent — basic access
  return { ...empty, canViewBookings: true };
}

export function getDashboardRoute(user: User | null): string {
  if (!user) return '/';

  const role = normaliseRole(user.role);
  const { staffClearanceLevel } = user;

  if (role === 'admin') return '/dashboard/admin';
  if (role === 'executive') return '/dashboard/admin';
  if (role === 'manager') return '/dashboard/manager';

  if (role === 'staff') {
    if (staffClearanceLevel && staffClearanceLevel >= StaffClearanceLevel.TIER_3) {
      return '/dashboard/staff/supervisor';
    }
    return '/dashboard/staff';
  }

  if (role === 'business') return '/dashboard/business';
  if (role === 'user' || role === 'customer') return '/dashboard/customer';

  return '/dashboard/customer';
}

export function getClearanceDescription(level?: StaffClearanceLevel): string {
  if (!level) return '';
  const descriptions = {
    [StaffClearanceLevel.TIER_1]: 'Tier 1 - Drivers and Office Assistants',
    [StaffClearanceLevel.TIER_2]: 'Tier 2 - Ticketing Officers',
    [StaffClearanceLevel.TIER_3]: 'Tier 3 - Supervisors',
    [StaffClearanceLevel.TIER_4]: 'Tier 4 - Management',
  };
  return descriptions[level] || '';
}

export function hasMinimumClearance(user: User | null, requiredLevel: StaffClearanceLevel): boolean {
  if (!user || normaliseRole(user.role) !== 'staff') return false;
  if (!user.staffClearanceLevel) return false;
  return user.staffClearanceLevel >= requiredLevel;
}

export function canAccessFeature(user: User | null, feature: keyof DashboardPermissions): boolean {
  return getDashboardPermissions(user)[feature];
}
