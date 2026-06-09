import { BookingStatus } from "@prisma/client";

export type { BookingStatus };

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Service types
export interface ServiceWithCount {
  id: string;
  name: string;
  description: string;
  summary: string;
  price: number;
  duration: number;
  imageUrl: string | null;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
  };
}

// Booking types
export interface BookingWithRelations {
  id: string;
  serviceId: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  note: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  client: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
  };
}

// Client types
export interface ClientWithBookings {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  source: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  bookings: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    service: {
      id: string;
      name: string;
    };
  }>;
  _count?: {
    bookings: number;
  };
}

// Slot types
export interface TimeSlotInfo {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// Holiday types
export interface HolidayInfo {
  id: number;
  date: string;
  reason: string | null;
}

// Site setting
export interface SiteSettingInfo {
  [key: string]: string;
}

// Dashboard stats
export interface DashboardStats {
  todayBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalClients: number;
  totalRevenue: number;
}

// Available slot
export interface AvailableSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

// Booking form data
export interface BookingFormData {
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
}
