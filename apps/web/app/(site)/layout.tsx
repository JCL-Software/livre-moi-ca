import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RememberSearchOrigin } from "@/components/search/search-back-link";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RememberSearchOrigin />
      <Header />
      <main className="flex-1 bg-[#F3F3F3]">{children}</main>
      <Footer />
    </>
  );
}
