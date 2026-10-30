import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const TITLE = "How Fjordline Studio cut scheduling email by 62%";
const DESCRIPTION =
  "A fictional case study: a 14-person design studio replaced scheduling threads with Tidepool booking links and measured eight weeks before and after.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/case-study" },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: "/case-study" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const SECTIONS = [
  { id: "situation", label: "The situation" },
  { id: "friction", label: "What was getting in the way" },
  { id: "changes", label: "What they changed" },
  { id: "results", label: "Results" },
  { id: "numbers", label: "A note on the numbers" },
  { id: "differently", label: "What they would do differently" },
  { id: "takeaways", label: "Takeaways" },
] as const;

const FACTS = [
  { term: "Company", detail: "Fjordline Studio, a design and web studio" },
  { term: "Team", detail: "14 people across three time zones" },
  { term: "Plan", detail: "Team" },
  { term: "Rollout", detail: "Two weeks" },
  { term: "Measured", detail: "Eight weeks before, eight weeks after" },
] as const;

const RESULTS = [
  { measure: "Emails per booked meeting", before: "4.7", after: "1.8", change: "62% fewer" },
  { measure: "Hours on scheduling, per person per week", before: "3.1", after: "1.4", change: "55% fewer" },
  { measure: "Double bookings, eight-week total", before: "9", after: "1", change: "8 fewer" },
  { measure: "Focus blocks interrupted, per month", before: "31", after: "6", change: "81% fewer" },
] as const;

export default function CaseStudyPage() {
  return (
    <article className="section pt-10 md:pt-14">
      <div className="container-page">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page">Case study</li>
          </ol>
        </nav>

        <header className="mt-8 max-w-3xl">
          <p className="eyebrow">Case study</p>
          <h1 className="h-display mt-3">{TITLE}</h1>
          <p className="mt-5 text-lg text-muted md:text-xl">
            Fourteen people, forty meetings a week, and an inbox full of &ldquo;does Thursday work?&rdquo;. Here is what changed when the
            studio moved its scheduling to booking links, and what the before-and-after numbers did and did not show.
          </p>
          <p role="note" className="mt-6 rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
            <strong className="text-ink">Fictional example.</strong> Tidepool, Fjordline Studio and every figure on this page are invented to
            show a long-form layout. They are not results from a real customer.
          </p>
        </header>

        <dl className="mt-10 grid gap-x-8 gap-y-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2 lg:grid-cols-5">
          {FACTS.map((fact) => (
            <div key={fact.term}>
              <dt className="text-xs font-extrabold uppercase tracking-widest text-muted">{fact.term}</dt>
              <dd className="mt-1 font-semibold">{fact.detail}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-10 grid-cols-[minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-labelledby="toc-title">
              <h2 id="toc-title" className="text-sm font-extrabold uppercase tracking-widest text-muted">
                On this page
              </h2>
              <ol className="mt-3 space-y-1 border-l-2 border-line">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-ink hover:border-brand hover:text-brand">
                      {section.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="prose-lite">
            <section aria-labelledby="situation">
              <h2 id="situation" className="mt-0">
                The situation
              </h2>
              <p>
                Fjordline is a design and web studio of fourteen: designers, developers and two producers. Clients sit in London, Lisbon and
                Singapore, so almost every call crosses a time zone, and the studio runs about forty client and internal meetings in a normal
                week.
              </p>
              <p>
                Until this year, every one of those meetings was arranged by hand. A producer would propose three times by email, the client
                would answer with a fourth, and someone would then copy the result into three calendars.
              </p>
            </section>

            <section aria-labelledby="friction">
              <h2 id="friction">What was getting in the way</h2>
              <ul>
                <li>
                  <strong>Threads that never ended.</strong> A booked meeting took 4.7 emails on average. A few took more than ten.
                </li>
                <li>
                  <strong>Double bookings.</strong> Nine in the eight weeks before the change, usually because a calendar was updated after the
                  confirmation went out.
                </li>
                <li>
                  <strong>Eroded focus time.</strong> Designers blocked out mornings for deep work, and new meetings kept landing inside them
                  because nobody scheduling could see the block.
                </li>
              </ul>
            </section>

            <section aria-labelledby="changes">
              <h2 id="changes">What they changed</h2>
              <p>The rollout took two weeks and needed no training session. The order mattered more than the speed.</p>
              <ol>
                <li>
                  <strong>Week 1, day 1.</strong> Everyone connected their calendar and marked their focus blocks once. That single step is
                  what lets the ranking protect them later.
                </li>
                <li>
                  <strong>Week 1, day 3.</strong> Each producer put one booking link in their email signature, replacing the &ldquo;propose three
                  times&rdquo; habit.
                </li>
                <li>
                  <strong>Week 2.</strong> Client intro calls moved to a round-robin page so the load spread across the people who were free.
                </li>
                <li>
                  <strong>Week 2, last day.</strong> Reminders went on for every external meeting.
                </li>
              </ol>
            </section>

            <section aria-labelledby="results">
              <h2 id="results">Results</h2>
              <p>
                Over the eight weeks after the rollout, compared with the eight weeks before, the studio measured the changes below.
              </p>

              <ul role="list" className="list-none pl-0 grid gap-4 sm:grid-cols-3">
                <li className="card mt-0 p-5">
                  <p className="text-4xl font-extrabold tracking-tight text-brand">62%</p>
                  <p className="mt-1 text-sm text-muted">fewer emails per booked meeting</p>
                </li>
                <li className="card mt-0 p-5">
                  <p className="text-4xl font-extrabold tracking-tight text-brand">1.7 h</p>
                  <p className="mt-1 text-sm text-muted">saved per person, every week</p>
                </li>
                <li className="card mt-0 p-5">
                  <p className="text-4xl font-extrabold tracking-tight text-brand">9 to 1</p>
                  <p className="mt-1 text-sm text-muted">double bookings over eight weeks</p>
                </li>
              </ul>

              <figure>
                <Image
                  src="/images/case-study-chart.png"
                  alt="Two bar charts. Emails per booked meeting fell from 4.7 to 1.8. Hours spent on scheduling per person per week fell from 3.1 to 1.4."
                  width={1600}
                  height={960}
                  sizes="(min-width: 1024px) 680px, calc(100vw - 2rem)"
                  loading="lazy"
                  className="h-auto w-full rounded-2xl ring-1 ring-line"
                />
                <figcaption className="mt-3 text-sm text-muted">
                  Scheduling effort before and after, 14 people. Lower is better in both charts.
                </figcaption>
              </figure>

              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[34rem] border-collapse text-left text-base">
                  <caption className="sr-only">Before and after, eight weeks each side</caption>
                  <thead className="bg-surface-2">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-bold">
                        Measure
                      </th>
                      <th scope="col" className="px-4 py-3 font-bold">
                        Before
                      </th>
                      <th scope="col" className="px-4 py-3 font-bold">
                        After
                      </th>
                      <th scope="col" className="px-4 py-3 font-bold">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-surface">
                    {RESULTS.map((row) => (
                      <tr key={row.measure}>
                        <th scope="row" className="px-4 py-3 font-semibold">
                          {row.measure}
                        </th>
                        <td className="px-4 py-3">{row.before}</td>
                        <td className="px-4 py-3">{row.after}</td>
                        <td className="px-4 py-3 font-bold text-brand">{row.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <figure className="rounded-2xl border-l-4 border-brand bg-surface-2 p-6">
                <blockquote className="text-xl font-semibold leading-snug">
                  &ldquo;The best part is what we stopped noticing. Nobody talks about scheduling any more.&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-sm text-muted">Maren Oyelaran, operations lead, Fjordline Studio (fictional)</figcaption>
              </figure>
            </section>

            <section aria-labelledby="numbers">
              <h2 id="numbers">A note on the numbers</h2>
              <p>
                These are before-and-after figures, not a controlled experiment. The hours are self-reported, the studio did not run a
                comparison group, and the second period had no holidays while the first had one. Treat the direction as reliable and the exact
                percentages as approximate.
              </p>
              <p>
                The email count is the sturdier figure, because it was counted from the producers&rsquo; mailboxes rather than recalled.
              </p>
            </section>

            <section aria-labelledby="differently">
              <h2 id="differently">What they would do differently</h2>
              <p>
                They would mark focus blocks in week one for <em>everyone</em>, including the producers. Two producers skipped it, and their
                bookings were the ones that still landed in other people&rsquo;s protected time.
              </p>
            </section>

            <section aria-labelledby="takeaways">
              <h2 id="takeaways">Takeaways</h2>
              <ul>
                <li>The biggest single change was giving every producer one booking link, not any one feature.</li>
                <li>Ranking only protects focus time that has been marked, so marking it comes first.</li>
                <li>Count emails, not just opinions: it was the one number nobody could argue with.</li>
              </ul>
            </section>

            <div className="card mt-12 p-6 md:p-8">
              <h2 className="mt-0 text-2xl">Try it with your team</h2>
              <p className="mt-3 text-muted">The free plan covers one person. Team starts at $12 a seat.</p>
              <Link href="/#pricing" className="btn btn-primary mt-5">
                See plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
