"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { Plus, Trash2, Pencil } from "lucide-react";

interface TimeSlot {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Holiday {
  id: number;
  date: string;
  reason: string | null;
}

interface SiteSettings {
  [key: string]: string;
}

const DAY_LABELS = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<"slots" | "holidays" | "settings">("slots");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [slotForm, setSlotForm] = useState({
    dayOfWeek: "1",
    startTime: "09:00",
    endTime: "12:00",
  });
  const [holidayDate, setHolidayDate] = useState<Date | undefined>(undefined);
  const [holidayReason, setHolidayReason] = useState("");
  const [settingsForm, setSettingsForm] = useState<[string, string][]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [slotsRes, holidaysRes, settingsRes] = await Promise.all([
        fetch("/api/admin/timeslots"),
        fetch("/api/admin/holidays"),
        fetch("/api/admin/settings"),
      ]);
      const [slotsData, holidaysData, settingsData] = await Promise.all([
        slotsRes.json(),
        holidaysRes.json(),
        settingsRes.json(),
      ]);
      if (slotsData.success) setSlots(slotsData.data);
      if (holidaysData.success) setHolidays(holidaysData.data);
      if (settingsData.success) {
        setSiteSettings(settingsData.data);
        setSettingsForm(Object.entries(settingsData.data));
      }
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Time Slot handlers
  const openSlotCreate = () => {
    setEditingSlot(null);
    setSlotForm({ dayOfWeek: "1", startTime: "09:00", endTime: "12:00" });
    setSlotDialogOpen(true);
  };

  const openSlotEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setSlotForm({ dayOfWeek: String(slot.dayOfWeek), startTime: slot.startTime, endTime: slot.endTime });
    setSlotDialogOpen(true);
  };

  const handleSaveSlot = async () => {
    try {
      const body = {
        dayOfWeek: parseInt(slotForm.dayOfWeek),
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
      };
      const url = editingSlot
        ? `/api/admin/timeslots/${editingSlot.id}`
        : "/api/admin/timeslots";
      const method = editingSlot ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingSlot ? "Time slot updated" : "Time slot created");
        setSlotDialogOpen(false);
        fetchData();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to save time slot");
    }
  };

  const handleDeleteSlot = async (id: number) => {
    if (!confirm("Delete this time slot?")) return;
    try {
      await fetch(`/api/admin/timeslots/${id}`, { method: "DELETE" });
      toast.success("Time slot deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleSlot = async (slot: TimeSlot) => {
    try {
      const res = await fetch(`/api/admin/timeslots/${slot.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !slot.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Time slot ${slot.isActive ? "deactivated" : "activated"}`);
        fetchData();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  // Holiday handlers
  const handleAddHoliday = async () => {
    if (!holidayDate) return;
    try {
      const res = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(holidayDate, "yyyy-MM-dd"),
          reason: holidayReason || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Holiday added");
        setHolidayDate(undefined);
        setHolidayReason("");
        fetchData();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to add holiday");
    }
  };

  const handleDeleteHoliday = async (id: number) => {
    if (!confirm("Remove this holiday?")) return;
    try {
      await fetch(`/api/admin/holidays/${id}`, { method: "DELETE" });
      toast.success("Holiday removed");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Settings handlers
  const handleUpdateSetting = async (key: string, value: string) => {
    const updated = { ...siteSettings, [key]: value };
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updated }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings updated");
        setSiteSettings(updated);
      }
    } catch {
      toast.error("Failed to update settings");
    }
  };

  const handleAddSetting = async () => {
    if (!newKey || !newValue) return;
    const updated = { ...siteSettings, [newKey]: newValue };
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updated }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Setting added");
        setSiteSettings(updated);
        setSettingsForm(Object.entries(updated));
        setNewKey("");
        setNewValue("");
      }
    } catch {
      toast.error("Failed to add setting");
    }
  };

  const handleDeleteSetting = async (key: string) => {
    const { [key]: _, ...rest } = siteSettings;
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: rest }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Setting removed");
        setSiteSettings(rest);
        setSettingsForm(Object.entries(rest));
      }
    } catch {
      toast.error("Failed to remove setting");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {(["slots", "holidays", "settings"] as const).map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "ghost"}
            onClick={() => setTab(t)}
            className="capitalize"
          >
            {t === "slots" ? "Time Slots" : t === "holidays" ? "Holidays" : "Site Settings"}
          </Button>
        ))}
      </div>

      {/* Time Slots */}
      {tab === "slots" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Time Slots</h2>
            <Button onClick={openSlotCreate}>
              <Plus className="w-4 h-4 mr-2" /> Add Slot
            </Button>
          </div>
          <div className="space-y-2">
            {DAY_LABELS.map((day, index) => {
              const daySlots = slots.filter((s) => s.dayOfWeek === index);
              return (
                <div key={day} className="border rounded-lg p-3">
                  <h3 className="font-medium text-sm mb-2">{day}</h3>
                  {daySlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No slots</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {daySlots.map((slot) => (
                        <div key={slot.id} className="flex items-center gap-2">
                          <button onClick={() => handleToggleSlot(slot)}>
                            <Badge variant={slot.isActive ? "default" : "secondary"} className="cursor-pointer">
                              {slot.startTime} - {slot.endTime}
                            </Badge>
                          </button>
                          <Button variant="ghost" size="sm" onClick={() => openSlotEdit(slot)}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Holidays */}
      {tab === "holidays" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Holidays</h2>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div>
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={holidayDate}
                onSelect={setHolidayDate}
                className="rounded-md border w-fit"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <Label>Reason (optional)</Label>
                <Input
                  value={holidayReason}
                  onChange={(e) => setHolidayReason(e.target.value)}
                  placeholder="e.g., National Holiday"
                />
              </div>
              <Button onClick={handleAddHoliday} disabled={!holidayDate}>
                Add Holiday
              </Button>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <span className="font-medium">
                    {format(parseISO(h.date), "MMM d, yyyy")}
                  </span>
                  {h.reason && (
                    <span className="text-muted-foreground ml-2">{h.reason}</span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteHoliday(h.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
            {holidays.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No holidays set.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Site Settings */}
      {tab === "settings" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Site Settings</h2>
          <div className="space-y-3">
            {settingsForm.map(([key, value]) => (
              <div key={key} className="flex items-end gap-3">
                <div className="flex-1">
                  <Label>{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) => {
                      setSettingsForm((prev) =>
                        prev.map(([k, v]) => (k === key ? [k, e.target.value] : [k, v])) as [string, string][]
                      );
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateSetting(key, settingsForm.find(([k]) => k === key)?.[1] || "")}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSetting(key)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-3 pt-4 border-t">
            <div>
              <Label>Key</Label>
              <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="setting_key" />
            </div>
            <div className="flex-1">
              <Label>Value</Label>
              <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="setting value" />
            </div>
            <Button onClick={handleAddSetting}>
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
        </div>
      )}

      {/* Slot Dialog */}
      <Dialog open={slotDialogOpen} onOpenChange={setSlotDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSlot ? "Edit Time Slot" : "Add Time Slot"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Day of Week</Label>
              <Select
                value={slotForm.dayOfWeek}
                onValueChange={(v) => { if (v) setSlotForm({ ...slotForm, dayOfWeek: v }); }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAY_SHORT.map((day, i) => (
                    <SelectItem key={i} value={String(i)}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={slotForm.startTime}
                  onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={slotForm.endTime}
                  onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleSaveSlot} className="w-full">
              {editingSlot ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
