export type Feature = {
  id: string;
  title: string;
  body: string;
  points: string[];
  image: { src: string; alt: string };
};

export type Plan = {
  id: string;
  name: string;
  price: string;
  unit: string;
  blurb: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export type Faq = { id: string; question: string; answer: string };

export const LOGOS = ["Alderwick", "Brightfield", "Cobalt & Co", "Driftline", "Evermoor"] as const;

export const FEATURES: Feature[] = [
  {
    id: "find",
    title: "Finds the time that costs the least",
    body: "Tidepool reads every calendar in the room and ranks the open slots by what they cost: broken focus blocks, odd hours in someone's time zone, back-to-back meetings with no buffer.",
    points: ["Protects focus time you mark once", "Weighs time zones and travel buffers", "Shows why a slot ranked first"],
    image: {
      src: "/images/feature-find.svg",
      alt: "A week grid with protected focus blocks hatched out and one dashed slot labelled best fit.",
    },
  },
  {
    id: "book",
    title: "Books it without the thread",
    body: "Share one link. Guests pick from the slots you would actually take, and the invite, the video link and the reminder are created for you. No reply-all, no 'does Thursday work?'.",
    points: ["One personal or team booking link", "Invites and video links added for you", "Reminders that cut no-shows"],
    image: {
      src: "/images/feature-book.svg",
      alt: "A booking link above three completed steps: guest picks a time, invites sent, reminder set.",
    },
  },
  {
    id: "sync",
    title: "Keeps the whole team in step",
    body: "Round-robin pages spread bookings across the people who are free. Shared availability shows the overlap for a group at a glance, so a four-person meeting stops being a puzzle.",
    points: ["Round-robin and group booking pages", "Overlap view for up to 12 people", "Changes flow back to every calendar"],
    image: {
      src: "/images/feature-sync.svg",
      alt: "Four people's availability bars with the window they all share highlighted.",
    },
  },
];

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$0",
    unit: "free, for one person",
    blurb: "Everything you need to stop emailing back and forth.",
    features: ["1 connected calendar", "1 booking page", "3 meeting types", "Email reminders"],
    cta: { label: "Start free", href: "mailto:hello@tidepool.example?subject=Starter%20plan" },
  },
  {
    id: "team",
    name: "Team",
    price: "$12",
    unit: "per seat, per month, billed annually",
    blurb: "For teams that book together and protect each other's focus.",
    features: [
      "Unlimited calendars and meeting types",
      "Focus-time protection",
      "Round-robin and group booking",
      "Overlap view for up to 12 people",
      "Reminders by email and text",
    ],
    cta: { label: "Start 14-day trial", href: "mailto:hello@tidepool.example?subject=Team%20plan" },
    featured: true,
  },
  {
    id: "business",
    name: "Business",
    price: "$24",
    unit: "per seat, per month, billed annually",
    blurb: "Controls and support for larger organisations.",
    features: ["Everything in Team", "Single sign-on", "Audit log and data export", "Admin roles and policies", "Priority support"],
    cta: { label: "Talk to us", href: "mailto:hello@tidepool.example?subject=Business%20plan" },
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "We used to lose Monday mornings to calendar tennis. Now the link goes out and the meeting is simply there.",
    name: "Maren Oyelaran",
    role: "Operations lead, Fjordline Studio",
    initials: "MO",
  },
  {
    quote: "The ranking is the part I trust. When it says a slot breaks someone's focus block, it shows me which one.",
    name: "Jonas Kjeldsen",
    role: "Engineering manager, Driftline",
    initials: "JK",
  },
  {
    quote: "Round-robin finally spread our intro calls fairly. Nobody is the default person for everything any more.",
    name: "Aiko Lindqvist",
    role: "Head of customer success, Brightfield",
    initials: "AL",
  },
];

export const FAQS: Faq[] = [
  {
    id: "pick",
    question: "How does Tidepool pick a time?",
    answer:
      "It reads free and busy blocks from the calendars you connect, then scores each open slot: whether it breaks a protected focus block, falls outside someone's working hours, or leaves no buffer between meetings. You see the top few slots and the reason for each ranking.",
  },
  {
    id: "calendars",
    question: "Which calendars does it work with?",
    answer:
      "Tidepool connects to the major calendar providers over standard calendar protocols. It reads free and busy time only, and writes just one thing: the event you book. You can connect as many calendars per person as you like.",
  },
  {
    id: "guests",
    question: "Do guests need an account to book?",
    answer:
      "No. Guests open your link, pick a slot in their own time zone and enter an email address. They get the invite straight away and can reschedule from the same link.",
  },
  {
    id: "free",
    question: "Is there a free plan?",
    answer:
      "Yes. Starter is free for one person: one calendar, one booking page and three meeting types. Team and Business add shared booking pages, focus-time protection and admin controls.",
  },
  {
    id: "zones",
    question: "How are time zones handled?",
    answer:
      "Every slot is stored in UTC and shown in the viewer's own zone. When you invite people across zones, Tidepool flags slots that fall outside someone's working hours instead of hiding them, so you can still choose.",
  },
  {
    id: "data",
    question: "What happens to my calendar data?",
    answer:
      "Tidepool needs free and busy times to rank slots, never event titles or notes. Disconnect a calendar at any time and the cached availability for it is deleted.",
  },
];
