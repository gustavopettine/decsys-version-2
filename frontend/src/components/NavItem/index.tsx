import { ElementType } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export interface NavItemProps {
  title: string;
  icon: ElementType;
  href: string;
}

export function NavItem({ title, icon: Icon, href }: NavItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`group flex w-full items-center gap-3 rounded px-3 py-2 transition-colors
        ${isActive ? "dark:bg-zinc-800 text-blue-500" : "dark:hover:bg-zinc-800"}
      `}
    >
      <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-blue-500" : "dark:text-zinc-500 dark:group-hover:text-blue-500"}`} />
      <span className={`font-medium transition-colors ${isActive ? "text-blue-500" : "dark:text-zinc-100 dark:group-hover:text-blue-500"}`}>
        {title}
      </span>
      <ChevronRight className={`ml-auto h-5 w-5 transition-colors ${isActive ? "text-blue-500" : "dark:text-zinc-500 dark:group-hover:text-blue-500"}`} />
    </button>
  );
}
