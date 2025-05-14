import { Briefcase } from "lucide-react";
import Link from "next/link";

export function AppLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 px-2"
      aria-label="SISD Challenge Home"
    >
      <Briefcase className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        SISD
      </span>
    </Link>
  );
}
