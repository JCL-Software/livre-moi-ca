import Link from "next/link";
import CardBox from "@/components/admin/shared/CardBox";

type StatItem = {
  key: string;
  title: string;
  value: string;
  href: string;
  bgcolor: string;
  textclr: string;
};

export function AdminQuickStats({ items }: { items: StatItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Link key={item.key} href={item.href}>
          <CardBox className={`border-none shadow-none ${item.bgcolor}`}>
            <div className="p-2 text-center transition-transform hover:scale-[1.02]">
              <p className={`font-semibold ${item.textclr}`}>{item.title}</p>
              <h5 className={`mt-1 text-2xl font-bold ${item.textclr}`}>{item.value}</h5>
            </div>
          </CardBox>
        </Link>
      ))}
    </div>
  );
}
