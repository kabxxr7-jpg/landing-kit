import { CheckIcon } from "./icons";
import { PLANS } from "@/lib/content";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section bg-surface-2">
      <div className="container-page">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pricing</p>
          <h2 id="pricing-title" className="h-section mt-3">
            Simple plans that grow with the team
          </h2>
          <p className="mt-4 text-muted">Prices are for the fictional product and are shown to demonstrate the layout.</p>
        </div>

        <ul role="list" className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((plan) => (
            <li key={plan.id} className="reveal flex">
              <article
                aria-labelledby={`plan-${plan.id}`}
                className={
                  "card relative flex w-full flex-col p-7 " +
                  (plan.featured ? "border-2 border-brand shadow-xl lg:-my-3 lg:py-10" : "")
                }
              >
                {plan.featured ? (
                  <p className="absolute -top-3.5 left-7 rounded-full bg-brand px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-on-brand">
                    Most popular
                  </p>
                ) : null}
                <h3 id={`plan-${plan.id}`} className="text-xl">
                  {plan.name}
                </h3>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                </p>
                <p className="mt-1 text-sm text-muted">{plan.unit}</p>
                <p className="mt-4 text-muted">{plan.blurb}</p>
                <ul role="list" className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon width={20} height={20} strokeWidth={3} className="mt-1 shrink-0 text-brand" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href={plan.cta.href} className={"btn mt-8 " + (plan.featured ? "btn-primary" : "btn-secondary")}>
                  {plan.cta.label}
                  <span className="sr-only"> on the {plan.name} plan</span>
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
