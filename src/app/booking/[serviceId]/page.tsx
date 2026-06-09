"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StepIndicator } from "@/components/booking/step-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { toast } from "sonner";
import { format, parseISO, addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Loader2 } from "lucide-react";

interface ServiceInfo {
  id: string;
  name: string;
  summary: string;
  price: number;
  duration: number;
  category: string;
}

interface AvailableSlot {
  startTime: string;
  endTime: string;
}

const clientFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10,15}$/, "Enter a valid phone number (10-15 digits)"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  note: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = params.serviceId as string;
  const stepParam = searchParams.get("step");

  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
  });

  useEffect(() => {
    if (stepParam) {
      const s = parseInt(stepParam);
      if (s >= 1 && s <= 3) setStep(s);
    }
  }, [stepParam]);

  useEffect(() => {
    fetch(`/api/services/${serviceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setService(data.data);
        } else {
          setError("Service not found");
        }
      })
      .catch(() => setError("Failed to load service"))
      .finally(() => setLoading(false));
  }, [serviceId]);

  const fetchSlots = useCallback(
    async (selectedDate: Date) => {
      setSlotsLoading(true);
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      try {
        const res = await fetch(
          `/api/bookings/available-slots?date=${dateStr}&serviceId=${serviceId}`
        );
        const data = await res.json();
        if (data.success) {
          setSlots(data.data);
        }
      } catch {
        toast.error("Failed to load available slots");
      } finally {
        setSlotsLoading(false);
      }
    },
    [serviceId]
  );

  const handleDateSelect = (d: Date | undefined) => {
    setDate(d);
    setSelectedSlot(null);
    if (d) fetchSlots(d);
  };

  const handleNext = () => {
    if (step === 1 && service) {
      setStep(2);
      router.replace(`/booking/${serviceId}?step=2`, { scroll: false });
    } else if (step === 2 && selectedSlot) {
      setStep(3);
      router.replace(`/booking/${serviceId}?step=3`, { scroll: false });
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      router.replace(`/booking/${serviceId}?step=1`, { scroll: false });
    } else if (step === 3) {
      setStep(2);
      router.replace(`/booking/${serviceId}?step=2`, { scroll: false });
    }
  };

  const onSubmit = async (formData: ClientFormData) => {
    if (!date || !selectedSlot) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date: format(date, "yyyy-MM-dd"),
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          ...formData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/booking/success?ref=${data.data.id}`);
      } else {
        toast.error(data.error || "Failed to create booking");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-16">
          <div className="max-w-2xl mx-auto px-4">
            <Skeleton className="h-8 w-48 mx-auto mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <Header />
        <main className="flex-1 py-16">
          <ErrorState
            title="Service Not Found"
            message={error || "The service you're looking for doesn't exist."}
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-8 md:py-16">
        <div className="max-w-2xl mx-auto px-4">
          <StepIndicator currentStep={step} />

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Confirm Your Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.summary}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration} minutes
                      </span>
                      <span>
                        {Number(service.price) === 0
                          ? "Free"
                          : `¥${Number(service.price)}`}
                      </span>
                    </div>
                  </div>
                </div>
                <Button onClick={handleNext} className="w-full">
                  Next: Select Time <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(d) => d < addDays(new Date(), 0)}
                    className="rounded-md border"
                  />
                </div>

                {date && (
                  <div>
                    <h4 className="font-medium mb-3">
                      Available times for {format(date, "MMMM d, yyyy")}:
                    </h4>
                    {slotsLoading ? (
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Skeleton key={i} className="h-10" />
                        ))}
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No available slots for this date. Please try another day.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {slots.map((slot) => (
                          <Button
                            key={slot.startTime}
                            variant={
                              selectedSlot?.startTime === slot.startTime
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot.startTime}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!selectedSlot}
                    className="flex-1"
                  >
                    Next: Your Info <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Booking summary */}
                <div className="p-3 bg-muted/50 rounded-lg mb-6 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <p className="text-muted-foreground ml-6">
                    {date && format(date, "MMMM d, yyyy")} at{" "}
                    {selectedSlot?.startTime} - {selectedSlot?.endTime}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" {...register("name")} placeholder="Your full name" />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="Your phone number"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="Your address (optional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="note">Note</Label>
                    <Textarea
                      id="note"
                      {...register("note")}
                      placeholder="Any special requests or notes..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
