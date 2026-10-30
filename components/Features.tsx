import Image from "next/image";
import { CheckIcon } from "./icons";
import { FEATURES } from "@/lib/content";

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="section">
      <div className="container-page">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">Features</p>
          <h2 id="features-title" className="h-section mt-3">
            Everything between &ldquo;let&rsquo;s find a time&rdquo; and &ldquo;see you then&rdquo;
          </h2>
        </div>

        <div className="mt-12 space-y-16 md:mt-16 md:space-y-24">
          {FEATURES.map((feature, index) => (
            <article key={feature.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              <div className={"reveal " + (index % 2 === 1 ? "md:order-2" : "")}>
                <h3 className="text-2xl md:text-3xl">{feature.title}</h3>
                <p className="mt-4 text-muted">{feature.body}</p>
                <ul role="list" className="mt-6 space-y-3">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                        <CheckIcon width={16} height={16} strokeWidth={3} />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={"reveal " + (index % 2 === 1 ? "md:order-1" : "")}>
                <Image
                  src={feature.image.src}
                  alt={feature.image.alt}
                  width={640}
                  height={480}
                  sizes="(min-width: 768px) 480px, calc(100vw - 2rem)"
                  loading="lazy"
                  className="h-auto w-full rounded-3xl"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
