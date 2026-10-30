import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Decorative wash behind the hero. Static, so it costs nothing at runtime. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(60rem_28rem_at_85%_-10%,var(--brand-soft),transparent_70%)]"
      />
      <div className="container-page grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="eyebrow">Scheduling for teams that guard their focus</p>
          <h1 id="hero-title" className="h-display mt-4">
            Find the meeting time. Skip the email thread.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted md:text-xl">
            Tidepool reads everyone&rsquo;s calendars, picks the slot that costs the least focus, and books it. A team of ten gets back
            the afternoon it used to lose to back-and-forth every week.
          </p>
          <div className="mt-8 flex flex-col gap-3 xs:flex-row">
            <Link href="/#pricing" className="btn btn-primary">
              See plans <ArrowRightIcon width={20} height={20} />
            </Link>
            <Link href="/case-study" className="btn btn-secondary">
              Read the case study
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">Free for one person. No card needed to start.</p>

          <dl className="mt-8 flex gap-8 border-t border-line pt-6 sm:gap-12">
            <div>
              <dt className="text-sm text-muted">Emails per booked meeting</dt>
              <dd className="mt-1 text-3xl font-extrabold tracking-tight text-brand">62% fewer</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Saved per person, every week</dt>
              <dd className="mt-1 text-3xl font-extrabold tracking-tight text-brand">1.7 hours</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-muted">
            Figures from the <Link href="/case-study">fictional case study</Link>, shown to demonstrate the layout.
          </p>
        </div>

        <div className="hero-art">
          <Image
            src="/images/hero-app.png"
            alt="The Tidepool week view: three suggested times for a design review, the best fit highlighted, and protected focus blocks hatched on the calendar."
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 640px, calc(100vw - 2rem)"
            loading="eager"
            fetchPriority="high"
            className="h-auto w-full rounded-2xl shadow-2xl ring-1 ring-line"
          />
        </div>
      </div>
    </section>
  );
}
