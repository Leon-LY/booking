import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, DollarSign, ArrowRight } from "lucide-react";
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
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="aspect-video bg-muted rounded-xl overflow-hidden mb-8">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <span className="text-6xl font-bold text-primary/30">
                    {service.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary">{service.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {service.duration} 分钟
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                {service.price === 0 ? "免费" : `¥${service.price}`}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {service.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {service.summary}
            </p>

            <Separator className="my-8" />

            <div className="prose prose-neutral max-w-none mb-8">
              {service.description.split("\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            <Link
              href={`/booking/${service.id}`}
              className={buttonVariants({ size: "lg", className: "text-lg px-8" })}
            >
              立即预约 <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
