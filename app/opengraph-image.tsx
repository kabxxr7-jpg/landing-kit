import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Tidepool: find the meeting time, skip the email thread";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Scheduling for teams", title: "Find the meeting time. Skip the email thread." });
}
