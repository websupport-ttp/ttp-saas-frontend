// lib/auth/permissions.ts
/**
 * Permission and access control utilities for role-based dashboards
 */

export enum UserRole {
  USER = 'User',
  BUSINESS = 'Business',
  STAFF = 'Staff',
  MANAGER = 'Manager',
  EXECUTIVE = 'Executive',
  ADMIN = 'Admin',
}

export enum StaffClearanceLevel {
  TIER_1 = 1, // Drivers and Office Assistants
  TIER_2 = 2, // Ticketing Officers
  TIER_3 = 3, // Supervisors
  TIER_4 = 4, // Management
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  staffClearanceLevel?: StaffClearanceLevel;
  staffDepartment?: string;
  staffEmployeeId?: string;
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

/**
 * Get dashboard permissions based on user role and clearance level
 */
export function getDashboardPermissions(user: User | null): DashboardPermissions {
  if (!user) {
    return {
      canViewBookings: false,
      canManageBookings: false,
      canViewInventory: false,
      canManageInventory: false,
      canViewReports: false,
      canViewAnalytics: false,
      canManageUsers: false,
      canManageStaff: false,
      canViewFinancials: false,
      canManageSettings: false,
      canProcessPayments: false,
      canViewAllCustomers: false,
    };
  }

  const { role, staffClearanceLevel } = user;

  // Admin has all permissions
  if (role === UserRole.ADMIN) {
    return {
      canViewBookings: true,
      canManageBookings: true,
      canViewInventory: true,
      canManageInventory: true,
      canViewReports: true,
      canViewAnalytics: true,
      canManageUsers: true,
      canManageStaff: true,
      canViewFinancials: true,
      canManageSettings: true,
      canProcessPayments: true,
      canViewAllCustomers: true,
    };
  }

  // Executive permissions
  if (role === UserRole.EXECUTIVE) {
    return {
      canViewBookings: true,
      canManageBookings: true,
      canViewInventory: true,
      canManageInventory: true,
      canViewReports: true,
      canViewAnalytics: true,
      canManageUsers: false,
      canManageStaff: true,
      canViewFinancials: true,
      canManageSettings: false,
      canProcessPayments: true,
      canViewAllCustomers: true,
    };
  }

  // Manager permissions
  if (role === UserRole.MANAGER) {
    return {
      canViewBookings: true,
      canManageBookings: true,
      canViewInventory: true,
      canManageInventory: true,
      canViewReports: true,
      canViewAnalytics: true,
      canManageUsers: false,
      canManageStaff: false,
      canViewFinancials: false,
      canManageSettings: false,
      canProcessPayments: true,
      canViewAllCustomers: true,
    };
  }

  // Staff permissions based on clearance level
  if (role === UserRole.STAFF) {
    const basePerm = {
      canViewBookings: false,
      canManageBookings: false,
      canViewInventory: false,
      canManageInventory: false,
      canViewReports: false,
      canViewAnalytics: false,
      canManageUsers: false,
      canManageStaff: false,
      canViewFinancials: false,
      canManageSettings: false,
      canProcessPayments: false,
      canViewAllCustomers: false,
    };

    // Tier 4 - Management
    if (staffClearanceLevel === StaffClearanceLevel.TIER_4) {
      return {
        ...basePerm,
        canViewBookings: true,
        canManageBookings: true,
        canViewInventory: true,
        canManageInventory: true,
        canViewReports: true,
        canViewAnalytics: true,
        canProcessPayments: true,
        canViewAllCustomers: true,
      };
    }

    // Tier 3 - Supervisors
    if (staffClearanceLevel === StaffClearanceLevel.TIER_3) {
      return {
        ...basePerm,
        canViewBookings: true,
        canManageBookings: true,
        canViewInventory: true,
        canManageInventory: true,
        canViewReports: true,
        canProcessPayments: true,
        canViewAllCustomers: true,
      };
    }

    // Tier 2 - Ticketing Officers
    if (staffClearanceLevel === StaffClearanceLevel.TIER_2) {
      return {
        ...basePerm,
        canViewBookings: true,
        canManageBookings: true,
        canViewInventory: true,
        canManageInventory: true,
        canProcessPayments: true,
        canViewAllCustomers: false,
      };
    }

    // Tier 1 - Drivers and Office Assistants
    if (staffClearanceLevel === StaffClearanceLevel.TIER_1) {
      return {
        ...basePerm,
        canViewBookings: true,
        canManageBookings: false,
        canViewInventory: true,
        canManageInventory: false,
      };
    }
  }

  // Business user permissions
  if (role === UserRole.BUSINESS) {
    return {
      canViewBookings: true,
      canManageBookings: true,
      canViewInventory: false,
      canManageInventory: false,
      canViewReports: true,
      canViewAnalytics: false,
      canManageUsers: false,
      canManageStaff: false,
      canViewFinancials: false,
      canManageSettings: false,
      canProcessPayments: false,
      canViewAllCustomers: false,
    };
  }

  // Regular user permissions
  return {
    canViewBookings: true,
    canManageBookings: false,
    canViewInventory: false,
    canManageInventory: false,
    canViewReports: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canManageStaff: false,
    canViewFinancials: false,
    canManageSettings: false,
    canProcessPayments: false,
    canViewAllCustomers: false,
  };
}

/**
 * Get dashboard route based on user role
 */
export function getDashboardRoute(user: User | null): string {
  if (!user) return '/';

  const { role, staffClearanceLevel } = user;

  if (role === UserRole.ADMIN) return '/dashboard/admin';
  if (role === UserRole.EXECUTIVE) return '/dashboard/executive';
  if (role === UserRole.MANAGER) return '/dashboard/manager';
  
  if (role === UserRole.STAFF) {
    if (staffClearanceLevel && staffClearanceLevel >= StaffClearanceLevel.TIER_3) {
      return '/dashboard/staff/supervisor';
    }
    return '/dashboard/staff';
  }

  if (role === UserRole.BUSINESS) return '/dashboard/business';
  if (role === UserRole.CUSTOMER) return '/dashboard/customer';
  
  // Default fallback for any other roles
  return '/dashboard/customer';
}

/**
 * Get clearance level description
 */
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

/**
 * Check if user has minimum clearance level
 */
export function hasMinimumClearance(user: User | null, requiredLevel: StaffClearanceLevel): boolean {
  if (!user || user.role !== UserRole.STAFF) return false;
  if (!user.staffClearanceLevel) return false;
  return user.staffClearanceLevel >= requiredLevel;
}

/**
 * Check if user can access a specific feature
 */
export function canAccessFeature(user: User | null, feature: keyof DashboardPermissions): boolean {
  const permissions = getDashboardPermissions(user);
  return permissions[feature];
}
