import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">设</span>
              </div>
              <span className="font-bold text-xl">设计拍档</span>
            </div>
            <p className="text-sm text-muted-foreground">
              专业设计咨询预约平台 &mdash; 帮您打造理想中的美好空间。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  服务项目
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">联系我们</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📞 400-888-8888</li>
              <li>📧 hello@shejipaidang.com</li>
              <li>📍 北京市朝阳区创意设计大街 123 号</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 设计拍档 版权所有
        </div>
      </div>
    </footer>
  );
}
