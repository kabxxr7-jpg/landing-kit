import Link from "next/link";

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="section">
      <div className="container-page">
        <div className="reveal rounded-[2rem] bg-brand px-6 py-12 text-center text-on-brand md:px-14 md:py-16">
          <h2 id="cta-title" className="h-section mx-auto max-w-2xl">
            Give your team its afternoons back
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-95">
            Start on the free plan, connect a calendar, and send your first booking link in about five minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
            <Link href="/#pricing" className="btn btn-inverse">
              Compare plans
            </Link>
            <a href="mailto:hello@tidepool.example" className="btn btn-outline-inverse">
              Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
