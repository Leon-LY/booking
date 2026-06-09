"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  note: string | null;
  adminNote: string | null;
  service: { id: string; name: string; duration: number; price: number };
  client: { id: string; name: string; phone: string; email: string | null };
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "default",
  CONFIRMED: "secondary",
  COMPLETED: "outline",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

const statusOptions = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const limit = 10;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (status !== "ALL") params.set("status", status);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/bookings?${params}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
        setTotal(data.meta?.total || 0);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const handleSaveNote = async () => {
    if (!selectedBooking) return;
    try {
      const res = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Note saved");
        setDialogOpen(false);
        fetchBookings();
      }
    } catch {
      toast.error("Failed to save note");
    }
  };

  const openDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setAdminNote(booking.adminNote || "");
    setDialogOpen(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookings</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search client name, phone, or service..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => { if (v) { setStatus(v); setPage(1); } }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s === "ALL" ? "All Status" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : bookings.length === 0 ? (
        <EmptyState title="No bookings found" description="Bookings will appear here when clients make appointments." />
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="p-3 font-medium">Client</th>
                  <th className="p-3 font-medium">Service</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Time</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="font-medium">{b.client.name}</div>
                      <div className="text-xs text-muted-foreground">{b.client.phone}</div>
                    </td>
                    <td className="p-3">{b.service.name}</td>
                    <td className="p-3">{format(parseISO(b.date), "MMM d, yyyy")}</td>
                    <td className="p-3">{b.startTime} - {b.endTime}</td>
                    <td className="p-3">
                      <Select
                        value={b.status}
                        onValueChange={(v) => { if (v) handleStatusChange(b.id, v); }}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue>
                            <Badge variant={statusVariant[b.status]} className="text-xs">
                              {b.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.filter(s => s !== "ALL").map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => openDetail(b)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-muted-foreground">Client</Label>
                  <p className="font-medium">{selectedBooking.client.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedBooking.client.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Service</Label>
                  <p className="font-medium">{selectedBooking.service.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {format(parseISO(selectedBooking.date), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Time</Label>
                  <p className="font-medium">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={statusVariant[selectedBooking.status]}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
              {selectedBooking.note && (
                <div>
                  <Label className="text-muted-foreground">Client Note</Label>
                  <p className="text-sm mt-1">{selectedBooking.note}</p>
                </div>
              )}
              <div>
                <Label>Admin Note</Label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSaveNote} className="w-full">
                Save Note
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
