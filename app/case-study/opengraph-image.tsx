import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Case study: how Fjordline Studio cut scheduling email by 62%";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Case study", title: "How Fjordline Studio cut scheduling email by 62%" });
}
