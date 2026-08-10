"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { TbLayoutGrid, TbHexagon, TbMicrophone } from "react-icons/tb";
import { BiCodeBlock } from "react-icons/bi";
import { MdOutlineWorkHistory } from "react-icons/md";
import { GoGoal } from "react-icons/go";
import Image from "next/image";

const NAV: { href: string; label: string; icon: IconType }[] = [
  { href: "/", label: "Dashboard", icon: TbLayoutGrid },
  { href: "/skills", label: "Skills", icon: TbHexagon },
  { href: "/projects", label: "Projects", icon: BiCodeBlock },
  { href: "/applications", label: "Applications", icon: MdOutlineWorkHistory },
  { href: "/interviews", label: "Interviews", icon: TbMicrophone },
  { href: "/goals", label: "Goals", icon: GoGoal },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="node-grid sticky top-0 flex min-h-dvh w-16 shrink-0 flex-col overflow-hidden border-r border-line bg-transparent md:w-56">
      <div className="flex items-center justify-center gap-2 px-3 py-5 md:justify-start md:px-5">
        <Image src={"/logo.png"} alt={`log`} width={30} height={30} />
        <span className="hidden font-display text-lg tracking-tight text-primary md:inline">
          SkillTrack
        </span>
      </div>

      <nav
        className="flex-1 flex flex-col gap-5 md:px-5  ps-1 space-y-0.5 py-3"
        aria-label="Main"
      >
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-current={active ? "page" : undefined}
              className={`slidebarLink ${
                active
                  ? "bg-primary/20 text-secondary"
                  : "text-muted hover:bg-panel-hover hover:text-primary"
              }`}
            >
              <Icon
                size={23}
                className={`shrink-0  ${active ? "text-secondary" : "text-primary"}`}
              />
              <span className="sr-only md:not-sr-only">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-line px-5 py-4 md:block">
        <p className="font-mono text-[11px] text-faint">
          Career progress, tracked.
        </p>
      </div>
    </aside>
  );
}
