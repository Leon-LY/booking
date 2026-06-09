import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { ProcessSteps } from "@/components/home/process-steps";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/home/services-overview";
import { AnimatedCounter } from "@/components/home/animated-counter";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HomeSkeleton } from "@/components/loading/home-skeleton";

export const dynamic = "force-dynamic";

async function getTopServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 3,
  });
  return services.map((s) => ({
    ...s,
    price: Number(s.price),
  }));
}

async function HomeContent() {
  const services = await getTopServices();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />

        {services.length > 0 && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">热门服务</h2>
                  <p className="text-muted-foreground mt-2 text-lg">
                    为您量身定制的专业设计咨询服务
                  </p>
                </div>
                <Link
                  href="/services"
                  className={buttonVariants({ variant: "outline", className: "hidden sm:inline-flex" })}
                >
                  查看全部 <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))}
              </div>
              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/services"
                  className={buttonVariants({ variant: "outline" })}
                >
                  查看全部服务 <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <ProcessSteps />

        {/* Trust Stats with animated counters */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-3">值得信赖</h2>
            <p className="text-muted-foreground mb-12">用数字说话</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { target: 500, suffix: "+", label: "满意客户" },
                { target: 50, suffix: "+", label: "资深设计师" },
                { target: 3, suffix: "+", label: "年行业经验" },
                { target: 98, suffix: "%", label: "好评率" },
              ].map((stat) => (
                <div key={stat.label} className="p-4">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="flex-1"><HomeSkeleton /></main>
        <Footer />
      </>
    }>
      <HomeContent />
    </Suspense>
  );
}
