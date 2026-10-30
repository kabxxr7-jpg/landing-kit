import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="section">
      <div className="container-page">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">What teams say</p>
          <h2 id="testimonials-title" className="h-section mt-3">
            Quieter inboxes, fuller focus blocks
          </h2>
          <p className="mt-4 text-muted">These quotes and names are invented for the demo.</p>
        </div>
        <ul role="list" className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <li key={item.name} className="reveal flex">
              <figure className="card flex w-full flex-col p-7">
                <blockquote className="flex-1 text-lg leading-relaxed">&ldquo;{item.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-sm font-extrabold text-on-brand"
                  >
                    {item.initials}
                  </span>
                  <span className="leading-tight">
                    <span className="block font-bold">{item.name}</span>
                    <span className="block text-sm text-muted">{item.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
