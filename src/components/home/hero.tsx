import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Professional Design
          <br />
          <span className="text-primary">Consultation Booking</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Book a one-on-one consultation with our expert designers. We&apos;ll help
          you bring your vision to life with personalized design solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/services"
            className={buttonVariants({ size: "lg", className: "text-lg px-8" })}
          >
            Browse Services <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/about"
            className={buttonVariants({ variant: "outline", size: "lg", className: "text-lg px-8" })}
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
