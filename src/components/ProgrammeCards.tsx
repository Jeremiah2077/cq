import Link from "next/link";

type Programme = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  tagColor: string;
  accentColor: string;
  href: string;
  cta: string;
  image: string;
};

const PROGRAMMES: Programme[] = [
  {
    slug: "pioneer",
    title: "Pioneer Programme",
    subtitle: "Be the first from your school.",
    description:
      "A fully-funded place for one student per Irish school. 11 days in China, filming, learning, and representing your school.",
    tag: "Free",
    tagColor: "#2d8a4e",
    accentColor: "var(--accent)",
    href: "/pioneer.html",
    cta: "Learn more",
    image: "/images/beijing/greatwall.jpg",
  },
  {
    slug: "roots",
    title: "Roots",
    subtitle: "Heritage & Culture",
    description:
      "Beijing, Xi'an, Shanghai. 11 days through imperial palaces, the Terracotta Army, the Great Wall, and modern Shanghai.",
    tag: "School Trip",
    tagColor: "var(--primary)",
    accentColor: "var(--primary)",
    href: "/roots.html",
    cta: "View itinerary",
    image: "/images/forbidden-city.jpg",
  },
  {
    slug: "pulse",
    title: "Pulse",
    subtitle: "STEM & Innovation",
    description:
      "Shanghai, Hangzhou, Shenzhen. 11 days inside AI labs, drone factories, and the world's fastest tech ecosystem.",
    tag: "School Trip",
    tagColor: "var(--primary)",
    accentColor: "var(--primary)",
    href: "/pulse.html",
    cta: "View itinerary",
    image: "/images/xdf-scene1.jpg",
  },
  {
    slug: "horizon",
    title: "Horizon",
    subtitle: "Nature & Landscapes",
    description:
      "Chengdu, Guilin, Zhangjiajie. 11 days with pandas, rice terraces, karst peaks, and the Avatar mountains.",
    tag: "School Trip",
    tagColor: "var(--primary)",
    accentColor: "var(--primary)",
    href: "/horizon.html",
    cta: "View itinerary",
    image: "/images/zhangjiajie.jpg",
  },
];

export function ProgrammeCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {PROGRAMMES.map((p) => (
        <Link
          key={p.slug}
          href={p.href}
          className="group block bg-white border border-[var(--gray-200)] rounded-[var(--radius-md)] overflow-hidden hover:border-[var(--gray-300)] hover:shadow-[0_8px_30px_rgba(15,25,35,0.08)] transition-all"
        >
          <div className="relative h-[160px] overflow-hidden bg-[var(--gray-100)]">
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <span
              className="absolute top-3 left-3 text-[0.68rem] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-[4px] text-white"
              style={{ background: p.tagColor }}
            >
              {p.tag}
            </span>
          </div>
          <div className="p-6">
            <div
              className="text-[0.7rem] tracking-[2px] uppercase font-semibold mb-1.5"
              style={{ color: p.accentColor }}
            >
              {p.subtitle}
            </div>
            <div className="font-display text-[1.3rem] leading-[1.2] text-[var(--ink)] mb-2">
              {p.title}
            </div>
            <p className="text-[0.88rem] text-[var(--gray-500)] leading-[1.65] mb-4">
              {p.description}
            </p>
            <span
              className="text-[0.85rem] font-semibold"
              style={{ color: p.accentColor }}
            >
              {p.cta} →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
