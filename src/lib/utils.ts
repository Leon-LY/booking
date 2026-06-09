import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, addMinutes, isBefore, isAfter } from "date-fns";
import { zhCN } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format helpers with Chinese locale
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy-MM-dd");
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy-MM-dd HH:mm");
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy年M月d日", { locale: zhCN });
}

export function formatDisplayDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "yyyy年M月d日 HH:mm", { locale: zhCN });
}

export function formatTime(time: string): string {
  return time;
}

// Day of week helpers (Chinese)
export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  0: "周日",
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
};

export const DAY_OF_WEEK_SHORT: Record<number, string> = {
  0: "日",
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
};

export function getDayOfWeekLabel(day: number): string {
  return DAY_OF_WEEK_LABELS[day] || "未知";
}

// Time slot helpers
export interface TimeSlotCandidate {
  startTime: string;
  endTime: string;
}

export function generateTimeSlots(
  slotStart: string,
  slotEnd: string,
  durationMinutes: number
): TimeSlotCandidate[] {
  const slots: TimeSlotCandidate[] = [];
  let current = parse(slotStart, "HH:mm", new Date());
  const end = parse(slotEnd, "HH:mm", new Date());

  while (isBefore(current, end)) {
    const next = addMinutes(current, durationMinutes);
    if (!isAfter(next, end)) {
      slots.push({
        startTime: format(current, "HH:mm"),
        endTime: format(next, "HH:mm"),
      });
    }
    current = next;
  }

  return slots;
}

export function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function hasOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeStringToMinutes(startA);
  const aEnd = timeStringToMinutes(endA);
  const bStart = timeStringToMinutes(startB);
  const bEnd = timeStringToMinutes(endB);

  return aStart < bEnd && bStart < aEnd;
}

// Response helpers
export function apiSuccess<T>(data: T, meta?: Record<string, unknown>) {
  return Response.json({ success: true, data, ...(meta ? { meta } : {}) });
}

export function apiError(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status });
}

// Base path helper for client-side fetch
const BASE_PATH = "/booking";

export function apiPath(path: string): string {
  return `${BASE_PATH}${path}`;
}

// Pagination
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function getPaginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// Animated counter hook helper
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
