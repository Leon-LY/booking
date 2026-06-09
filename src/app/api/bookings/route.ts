import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, hasOverlap } from "@/lib/utils";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, date: dateStr, startTime, endTime, name, phone, email, address, note } = body;

    // Validate required fields
    if (!serviceId || !dateStr || !startTime || !endTime || !name || !phone) {
      return apiError("Missing required fields: serviceId, date, startTime, endTime, name, phone");
    }

    // Validate phone format (simple)
    if (!/^\d{10,15}$/.test(phone.replace(/[\s-]/g, ""))) {
      return apiError("Invalid phone number format");
    }

    const date = parseISO(dateStr);
    const today = startOfDay(new Date());

    // Can't book in the past
    if (startOfDay(date) < today) {
      return apiError("Cannot book in the past");
    }

    // Check if service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.isActive) {
      return apiError("Service not available");
    }

    // Conflict detection: check for overlapping bookings
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    const hasConflict = conflictingBookings.some((booking) =>
      hasOverlap(startTime, endTime, booking.startTime, booking.endTime)
    );

    if (hasConflict) {
      return apiError("Selected time slot is no longer available");
    }

    // Find or create client
    let client = await prisma.client.findUnique({
      where: { phone },
    });

    if (client) {
      // Update client info if provided
      client = await prisma.client.update({
        where: { phone },
        data: {
          name: name || client.name,
          ...(email !== undefined && { email }),
          ...(address !== undefined && { address }),
          ...(note !== undefined && { note }),
        },
      });
    } else {
      client = await prisma.client.create({
        data: {
          name,
          phone,
          email: email || null,
          address: address || null,
          note: note || null,
        },
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        clientId: client.id,
        date: startOfDay(date),
        startTime,
        endTime,
        status: "PENDING",
        note: note || null,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    return apiSuccess(booking);
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return apiError("Failed to create booking", 500);
  }
}
