import { Package, Calendar, ClipboardCheck } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "选择服务",
    description: "浏览我们的服务项目，找到最适合您需求的方案",
  },
  {
    icon: Calendar,
    title: "挑选时间",
    description: "选择方便的日期和时间段进行一对一咨询",
  },
  {
    icon: ClipboardCheck,
    title: "确认预约",
    description: "填写您的联系信息，我们将及时确认预约安排",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">预约流程</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <step.icon className="w-8 h-8" />
              </div>
              <div className="text-lg font-semibold text-primary mb-2">
                第 {index + 1} 步
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
