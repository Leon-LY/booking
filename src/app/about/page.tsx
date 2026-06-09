import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>

            <div className="prose prose-neutral max-w-none space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                DesignPro is a professional interior design consultation platform
                connecting clients with experienced designers. We believe every
                space has the potential to be beautiful, functional, and uniquely
                yours.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To make professional design consultation accessible to everyone.
                Whether you&apos;re renovating a single room or planning a complete
                home makeover, our designers are here to guide you every step of
                the way.
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">
                Why Choose Us
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Experienced professional designers with proven track records
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Personalized one-on-one consultations tailored to your needs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Flexible scheduling that works around your calendar
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Transparent pricing with no hidden costs
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-12 mb-4">Contact Us</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>📞 Phone: 400-888-8888</p>
                <p>📧 Email: hello@designpro.com</p>
                <p>📍 Address: 123 Design Street, Creative District</p>
                <p>🕐 Hours: Monday - Saturday, 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
