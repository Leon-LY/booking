import { Search, CalendarCheck, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "选择服务",
    description: "浏览服务项目，找到最适合您需求的方案",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: CalendarCheck,
    title: "挑选时间",
    description: "选择方便的日期和时间段与设计师交流",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: MessageCircle,
    title: "确认预约",
    description: "填写信息提交预约，我们将尽快与您确认",
    color: "bg-green-50 text-green-600",
  },
];

export function ProcessSteps() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">预约流程</h2>
          <p className="text-muted-foreground">三步轻松完成设计咨询预约</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5">
                  <div className="w-full h-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
                </div>
              )}

              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                <step.icon className="w-7 h-7" />
              </div>
              <div className="text-sm font-semibold text-primary mb-1.5">
                第 {index + 1} 步
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
