import { LOGOS } from "@/lib/content";

/** Text placeholders on purpose: no real company marks. Swap in client logos as <Image> elements. */
export function LogoStrip() {
  return (
    <section aria-labelledby="logos-title" className="border-y border-line bg-surface-2">
      <div className="container-page py-8">
        <h2 id="logos-title" className="text-center text-sm font-bold uppercase tracking-widest text-muted">
          Used by scheduling-heavy teams (placeholder names)
        </h2>
        <ul role="list" className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {LOGOS.map((name, index) => (
            <li
              key={name}
              className={
                "text-xl text-ink/80 " +
                (index % 3 === 0 ? "font-extrabold tracking-tight" : index % 3 === 1 ? "font-semibold italic" : "font-bold uppercase tracking-widest text-base")
              }
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
