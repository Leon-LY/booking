import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ServiceCard } from "@/components/home/services-overview";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/shared/empty-state";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
};

async function getServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return services.map((s) => ({
    ...s,
    price: Number(s.price),
  }));
}

export default async function ServicesPage() {
  const services = await getServices();

  // Get unique categories
  const categories = Array.from(
    new Set(services.map((s) => s.category))
  ).sort();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Our Services</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose from our range of professional design consultation
                services. Each session is tailored to your unique needs.
              </p>
            </div>

            {services.length === 0 ? (
              <EmptyState
                title="No services available"
                description="Check back soon for new services."
              />
            ) : (
              <div className="space-y-12">
                {categories.map((category) => {
                  const categoryServices = services.filter(
                    (s) => s.category === category
                  );
                  if (categoryServices.length === 0) return null;
                  return (
                    <div key={category}>
                      <h2 className="text-2xl font-semibold mb-6 capitalize">
                        {category}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryServices.map((service) => (
                          <ServiceCard key={service.id} {...service} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
