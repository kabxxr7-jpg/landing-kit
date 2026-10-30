import Link from "next/link";
import { LogoMark } from "./icons";
import { SiteNav } from "./SiteNav";
import { NAV_LINKS, SITE_NAME } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="container-page relative flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink no-underline" aria-label={`${SITE_NAME}, home`}>
          <LogoMark />
          {SITE_NAME}
        </Link>
        <SiteNav links={NAV_LINKS} cta={{ href: "/#pricing", label: "Start free" }} />
      </div>
    </header>
  );
}
