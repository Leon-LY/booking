import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, BanknoteIcon, ArrowRight, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getService(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
  });
  if (!service || !service.isActive) return null;
  return { ...service, price: Number(service.price) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);
  if (!service) return { title: "服务未找到" };
  return { title: service.name };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "服务项目", href: "/services" },
              { label: service.name },
            ]}
          />
        </div>

        <section className="pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Image */}
            <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-8 shadow-sm">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 via-background to-secondary/20">
                  <span className="text-8xl font-bold text-primary/15">
                    {service.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary" className="text-sm px-3 py-1">{service.category}</Badge>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {service.duration} 分钟
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <BanknoteIcon className="w-4 h-4" />
                {service.price === 0 ? "免费" : `¥${service.price}`}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              {service.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {service.summary}
            </p>

            <Separator className="my-8" />

            <div className="prose prose-neutral max-w-none mb-10">
              {service.description.split("\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/booking/${service.id}`}
                className={buttonVariants({ size: "lg", className: "text-lg px-10 h-12 shadow-lg shadow-primary/20" })}
              >
                <CalendarCheck className="mr-2 w-5 h-5" />
                立即预约
              </Link>
              <Link
                href="/services"
                className={buttonVariants({ variant: "outline", size: "lg", className: "text-lg px-10 h-12" })}
              >
                返回服务列表
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
