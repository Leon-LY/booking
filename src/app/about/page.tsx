import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-8 text-center">关于我们</h1>

            <div className="prose prose-neutral max-w-none space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                设计拍档是一个专业的室内设计咨询预约平台，致力于连接客户与资深设计师。
                我们相信每个空间都有潜力变得美观、实用且独具个性。
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">我们的使命</h2>
              <p className="text-muted-foreground leading-relaxed">
                让专业设计咨询触手可及。无论是单间改造还是全屋装修，
                我们的设计师都将全程为您提供专业指导。
              </p>

              <h2 className="text-2xl font-semibold mt-12 mb-4">
                为什么选择我们
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  经验丰富的专业设计师，有大量成功案例
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  一对一量身定制的个性化咨询服务
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  灵活的时间安排，方便您的日程
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  透明定价，无隐藏费用
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-12 mb-4">联系我们</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>📞 电话：400-888-8888</p>
                <p>📧 邮箱：hello@shejipaidang.com</p>
                <p>📍 地址：北京市朝阳区创意设计大街 123 号</p>
                <p>🕐 工作时间：周一至周六 9:00 - 18:00</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
