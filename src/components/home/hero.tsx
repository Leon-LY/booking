import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          专业设计
          <br />
          <span className="text-primary">一对一咨询预约</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          预约资深设计师，为您量身定制个性化设计方案，帮您把理想空间变为现实。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/services"
            className={buttonVariants({ size: "lg", className: "text-lg px-8" })}
          >
            浏览服务 <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/about"
            className={buttonVariants({ variant: "outline", size: "lg", className: "text-lg px-8" })}
          >
            了解更多
          </Link>
        </div>
      </div>
    </section>
  );
}
