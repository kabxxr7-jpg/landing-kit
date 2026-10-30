import { ChevronIcon } from "./icons";
import { FaqGroup } from "./FaqGroup";
import { FAQS } from "@/lib/content";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section bg-surface-2">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="reveal">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="h-section mt-3">
            Questions, answered
          </h2>
          <p className="mt-4 text-muted">Can&rsquo;t find yours? Write to us and a person replies the same day.</p>
        </div>

        {/* `name` makes the group exclusive in the browser: opening one closes the others. */}
        <FaqGroup className="reveal card divide-y divide-line overflow-hidden">
          {FAQS.map((faq, index) => (
            <details key={faq.id} name="faq" open={index === 0} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-lg font-bold hover:text-brand [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronIcon className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-muted">{faq.answer}</p>
            </details>
          ))}
        </FaqGroup>
      </div>
    </section>
  );
}
