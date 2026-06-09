import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomeSkeleton } from "@/components/loading/home-skeleton";

export default function RootLoading() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HomeSkeleton />
      </main>
      <Footer />
    </>
  );
}
