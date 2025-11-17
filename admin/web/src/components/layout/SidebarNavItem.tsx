import { NavLink } from "react-router-dom";
import type { ComponentType, ReactElement, SVGProps } from "react";
import { cn } from "../../lib/cn";

const ICON_ONLY_CLASSES = "h-12 w-12 justify-center p-0";
const MOBILE_LABEL_CLASSES = "gap-2 px-3 py-2";
const DESKTOP_LABEL_CLASSES = "gap-3 px-4 py-3";
const BASE_LINK_CLASSES =
  "group relative flex items-center rounded-2xl text-sm font-medium transition-all hover:bg-slate-100/80 hover:text-slate-900 dark:hover:bg-slate-800/70 dark:hover:text-white";
const FOCUS_RING_CLASSES =
  "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-500";

export type SidebarNavItemProps = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isIconOnly: boolean;
  isMobileViewport: boolean;
};

const getSpacingClasses = (
  isIconOnly: boolean,
  isMobileViewport: boolean
): string => {
  if (isIconOnly) {
    return ICON_ONLY_CLASSES;
  }
  return isMobileViewport ? MOBILE_LABEL_CLASSES : DESKTOP_LABEL_CLASSES;
};

export function SidebarNavItem({
  to,
  label,
  icon,
  isIconOnly,
  isMobileViewport,
}: SidebarNavItemProps): ReactElement {
  const Icon = icon as ComponentType<SVGProps<SVGSVGElement>>;

  return (
    <NavLink
      key={to}
      end={to === "/"}
      to={to}
      aria-label={isIconOnly ? label : undefined}
      className={({ isActive }) =>
        cn(
          BASE_LINK_CLASSES,
          FOCUS_RING_CLASSES,
          "cursor-pointer",
          isActive
            ? "bg-sky-500/15 text-sky-600 ring-1 ring-inset ring-sky-500/30 dark:bg-sky-500/20 dark:text-sky-200"
            : "text-slate-600 dark:text-slate-300",
          getSpacingClasses(isIconOnly, isMobileViewport)
        )
      }>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm transition-colors group-hover:bg-sky-100 group-hover:text-sky-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-sky-500/20 dark:group-hover:text-sky-200">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span
        aria-hidden={isIconOnly}
        className={cn(
          "whitespace-nowrap text-sm font-medium transition-all duration-300",
          isIconOnly ? "hidden" : ""
        )}>
        {label}
      </span>
    </NavLink>
  );
}
