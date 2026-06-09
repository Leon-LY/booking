import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">页面未找到</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          您访问的页面不存在或已被移除。
        </p>
        <Link href="/" className={buttonVariants()}>
          <Home className="w-4 h-4 mr-2" />
          返回首页
        </Link>
      </div>
    </div>
  );
}
