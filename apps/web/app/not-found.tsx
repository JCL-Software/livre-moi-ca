import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { NotFoundContent } from "@/components/layout/not-found-content";

export default function RootNotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#F3F3F3]">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
