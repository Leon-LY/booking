import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { step: 1, label: "Confirm Service" },
  { step: 2, label: "Select Time" },
  { step: 3, label: "Your Info" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((s, index) => (
        <div key={s.step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep > s.step
                  ? "bg-primary text-primary-foreground"
                  : currentStep === s.step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {currentStep > s.step ? (
                <Check className="w-5 h-5" />
              ) : (
                s.step
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1.5 hidden sm:block",
                currentStep >= s.step
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 sm:w-24 h-0.5 mx-2 mt-[-1rem]",
                currentStep > s.step ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
