"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Home, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <>
      <Header />
      <main className="flex-1 py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">预约成功！</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                您的设计咨询已预约成功。我们将尽快与您联系确认具体安排。
              </p>

              {ref && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm text-left">
                  <p className="text-muted-foreground">
                    预约编号：<span className="font-mono font-medium text-foreground">{ref}</span>
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/" className={buttonVariants({ variant: "outline" })}>
                  <Home className="mr-2 w-4 h-4" />
                  返回首页
                </Link>
                <Link href="/services" className={buttonVariants()}>
                  浏览更多服务
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="flex-1 py-16">
            <div className="max-w-lg mx-auto px-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </main>
          <Footer />
        </>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
