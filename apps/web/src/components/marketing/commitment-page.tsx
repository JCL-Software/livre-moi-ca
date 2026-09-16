import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CommitmentBlock = {
  title: string;
  body: ReactNode;
};

export function CommitmentPage({
  kicker,
  title,
  lead,
  blocks,
  related,
  layout = "stack",
  contentMaxWidth = "max-w-3xl",
}: {
  kicker: string;
  title: string;
  lead: ReactNode;
  blocks: CommitmentBlock[];
  related?: { href: string; label: string }[];
  layout?: "stack" | "timeline";
  contentMaxWidth?: string;
}) {
  return (
    <article>
      <section className="section-plain py-16 md:py-20">
        <div className={cn("mx-auto px-4", contentMaxWidth)}>
          <p className="uber-home-kicker">{kicker}</p>
          <h1 className="uber-home-title mt-3">{title}</h1>
          <div className="uber-home-lead mt-4 max-w-3xl space-y-3">{lead}</div>
        </div>
      </section>

      <section className="section-muted py-16 md:py-20">
        <div className={cn("mx-auto px-4", contentMaxWidth)}>
          {layout === "timeline" ? (
            <ol className="commitment-timeline">
              {blocks.map((block) => (
                <li key={block.title} className="commitment-timeline-item">
                  <h2 className="uber-card-title">{block.title}</h2>
                  <div className="uber-section-lead mt-3 max-w-none space-y-3 text-left">
                    {block.body}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="space-y-12">
              {blocks.map((block) => (
                <section key={block.title} className="space-y-3">
                  <h2 className="uber-section-title text-left">{block.title}</h2>
                  <div className="uber-section-lead max-w-none space-y-3 text-left">
                    {block.body}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>

      {related && related.length > 0 ? (
        <section className="section-plain py-12 md:py-16">
          <div className={cn("mx-auto px-4", contentMaxWidth)}>
            <nav
              aria-label="Pages liées"
              className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[#E2E2E2] pt-6 text-sm"
            >
              {related.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-medium text-[#545454] underline-offset-4 hover:text-black hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>
      ) : null}
    </article>
  );
}
