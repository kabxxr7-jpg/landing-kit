import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="section">
      <div className="container-page max-w-2xl text-center">
        <p className="eyebrow">Error 404</p>
        <h1 id="nf-title" className="h-display mt-3">
          That page has moved, or never existed
        </h1>
        <p className="mt-5 text-lg text-muted">The link may be mistyped. These pages do exist:</p>
        <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
          <Link href="/" className="btn btn-primary">
            Back to the home page
          </Link>
          <Link href="/case-study" className="btn btn-secondary">
            Read the case study
          </Link>
        </div>
      </div>
    </section>
  );
}
