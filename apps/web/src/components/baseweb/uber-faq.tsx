"use client";

import { Accordion, Panel } from "baseui/accordion";

export type UberFaqItem = {
  question: string;
  answer: string;
};

export type UberFaqGroup = {
  title: string;
  items: UberFaqItem[];
};

function FaqAccordion({ items }: { items: UberFaqItem[] }) {
  return (
    <Accordion accordion>
      {items.map((item) => (
        <Panel key={item.question} title={item.question}>
          {item.answer}
        </Panel>
      ))}
    </Accordion>
  );
}

export function UberFaq({
  title,
  subtitle,
  groups,
  items,
}: {
  title: string;
  subtitle?: string;
  groups?: UberFaqGroup[];
  items?: UberFaqItem[];
}) {
  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div className="md:sticky md:top-28">
            <h2 className="uber-section-title">{title}</h2>
            {subtitle ? (
              <p className="uber-section-lead mt-2 max-w-sm">{subtitle}</p>
            ) : null}
          </div>

          <div className="space-y-10">
            {groups
              ? groups.map((group) => (
                  <div key={group.title}>
                    <p className="uber-home-kicker mb-2">{group.title}</p>
                    <FaqAccordion items={group.items} />
                  </div>
                ))
              : null}
            {items ? <FaqAccordion items={items} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
