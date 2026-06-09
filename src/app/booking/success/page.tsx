"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Home, ArrowRight } from "lucide-react";

interface BookingInfo {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  service: { name: string; duration: number };
  client: { name: string; phone: string };
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ref) {
      // For simplicity, we just display the success without fetching
      // In production, you'd fetch booking details
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [ref]);

  return (
    <>
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Your consultation has been booked successfully. We&apos;ll contact
                you shortly to confirm the details.
              </p>

              {ref && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm text-left">
                  <p className="text-muted-foreground">
                    Booking Reference: <span className="font-mono font-medium text-foreground">{ref}</span>
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className={buttonVariants({ variant: "outline" })}>
                  <Home className="mr-2 w-4 h-4" />
                  Back to Home
                </Link>
                <Link href="/services" className={buttonVariants()}>
                  Browse More Services
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="flex-1 py-16">
            <div className="max-w-lg mx-auto px-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
