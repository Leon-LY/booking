import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 md:py-36 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary/20 animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-6 h-6 rounded-full bg-primary/10 animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          专业设计咨询预约平台
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          让设计
          <span className="relative mx-2">
            <span className="text-primary">更简单</span>
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
              viewBox="0 0 100 12"
              preserveAspectRatio="none"
            >
              <path d="M0 6 Q 25 12 50 6 Q 75 0 100 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          预约资深设计师一对一咨询，为您量身定制个性化设计方案。
          <br className="hidden sm:block" />
          从空间规划到材料配色，让专业的人做专业的事。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/services"
            className={buttonVariants({ size: "lg", className: "text-lg px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow" })}
          >
            浏览服务 <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/about"
            className={buttonVariants({ variant: "outline", size: "lg", className: "text-lg px-8 h-12" })}
          >
            了解更多
          </Link>
        </div>

        {/* Quick stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "500+", label: "满意客户" },
            { value: "50+", label: "设计师" },
            { value: "98%", label: "好评率" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
