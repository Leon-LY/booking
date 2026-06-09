import { Package, Calendar, ClipboardCheck } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Choose Service",
    description: "Browse our services and pick the one that fits your needs",
  },
  {
    icon: Calendar,
    title: "Pick Time",
    description: "Select a convenient date and time for your consultation",
  },
  {
    icon: ClipboardCheck,
    title: "Confirm Booking",
    description: "Fill in your details and we'll confirm your appointment",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <step.icon className="w-8 h-8" />
              </div>
              <div className="text-lg font-semibold text-primary mb-2">
                Step {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
