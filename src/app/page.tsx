import { Hero } from "@/components/home/hero";
import { ProcessSteps } from "@/components/home/process-steps";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/home/services-overview";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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

export default async function HomePage() {
  const services = await getTopServices();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />

        {services.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold">热门服务</h2>
                  <p className="text-muted-foreground mt-2">
                    为您量身定制的专业设计咨询服务
                  </p>
                </div>
                <Link
                  href="/services"
                  className={buttonVariants({ variant: "outline", className: "hidden sm:flex" })}
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

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: "满意客户" },
                { number: "50+", label: "资深设计师" },
                { number: "3+", label: "年行业经验" },
                { number: "98%", label: "好评率" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
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
