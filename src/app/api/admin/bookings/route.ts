import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { apiSuccess, apiError, getPaginationParams, getPaginationMeta } from "@/lib/utils";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { BookingStatus } from "@prisma/client";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(searchParams);
    const status = searchParams.get("status") as BookingStatus | null;
    const dateStr = searchParams.get("date");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status && Object.values(BookingStatus).includes(status)) {
      where.status = status;
    }

    if (dateStr) {
      const date = parseISO(dateStr);
      where.date = {
        gte: startOfDay(date),
        lte: endOfDay(date),
      };
    }

    if (search) {
      where.OR = [
        { client: { name: { contains: search, mode: "insensitive" } } },
        { client: { phone: { contains: search } } },
        { service: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          service: {
            select: { id: true, name: true, duration: true, price: true },
          },
          client: {
            select: { id: true, name: true, phone: true, email: true },
          },
        },
        orderBy: [{ date: "desc" }, { startTime: "asc" }],
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return apiSuccess(bookings, getPaginationMeta(total, page, limit));
  } catch (error) {
    console.error("GET /api/admin/bookings error:", error);
    return apiError("Failed to fetch bookings", 500);
  }
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const { status, adminNote } = body;

    if (!id) {
      return apiError("Booking id is required");
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNote !== undefined && { adminNote }),
      },
    });

    return apiSuccess(booking);
  } catch (error) {
    console.error("PATCH /api/admin/bookings error:", error);
    return apiError("Failed to update booking", 500);
  }
}
