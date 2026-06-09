"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ClientWithBookings {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  source: string | null;
  note: string | null;
  createdAt: string;
  bookings: Array<{
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    service: { id: string; name: string };
  }>;
}

interface ClientListItem {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  createdAt: string;
  _count: { bookings: number };
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "default",
  CONFIRMED: "secondary",
  COMPLETED: "outline",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedClient, setSelectedClient] = useState<ClientWithBookings | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const limit = 10;

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/clients?${params}`);
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
        setTotal(data.meta?.total || 0);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setDialogOpen(true);
    try {
      const res = await fetch(`/api/admin/clients/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedClient(data.data);
      }
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clients</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchClients} />
      ) : clients.length === 0 ? (
        <EmptyState title="No clients found" description={search ? "Try a different search term." : "Clients will appear when someone makes a booking."} />
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="p-3 font-medium">Name</th>
                  <th className="p-3 font-medium">Phone</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Bookings</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-muted/30">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3 text-muted-foreground">{c.email || "-"}</td>
                    <td className="p-3">
                      <Badge variant="secondary">{c._count.bookings}</Badge>
                    </td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm" onClick={() => openDetail(c.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
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

      {/* Client Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {detailLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : selectedClient ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedClient.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedClient.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedClient.email || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-medium">{selectedClient.address || "-"}</p>
                </div>
                {selectedClient.note && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Note</Label>
                    <p className="text-sm mt-1">{selectedClient.note}</p>
                  </div>
                )}
              </div>

              {selectedClient.bookings.length > 0 && (
                <div>
                  <Label className="mb-2 block">Booking History</Label>
                  <div className="space-y-2">
                    {selectedClient.bookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-2 border rounded-lg text-sm flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium">{b.service.name}</span>
                          <span className="text-muted-foreground ml-2">
                            {format(parseISO(b.date), "MMM d, yyyy")} {b.startTime}
                          </span>
                        </div>
                        <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Failed to load client details.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
