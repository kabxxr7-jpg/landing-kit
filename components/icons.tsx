import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** The Tidepool mark: two stacked waves in a rounded square. */
export function LogoMark(props: IconProps) {
  return (
    <svg width={32} height={32} viewBox="0 0 32 32" aria-hidden focusable={false} {...props}>
      <rect width="32" height="32" rx="9" fill="var(--brand)" />
      <path
        d="M6 13c3-3.2 6-3.2 10 0s7 3.2 10 0M6 20c3-3.2 6-3.2 10 0s7 3.2 10 0"
        fill="none"
        stroke="var(--on-brand)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
