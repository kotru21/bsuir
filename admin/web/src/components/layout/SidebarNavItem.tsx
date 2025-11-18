import { NavLink } from "react-router-dom";
import type { ComponentType, ReactElement, SVGProps } from "react";
import { cn } from "../../lib/cn";

const ICON_ONLY_CLASSES = "h-12 w-12 justify-center p-0";
const MOBILE_LABEL_CLASSES = "gap-2 px-3 py-2";
const DESKTOP_LABEL_CLASSES = "gap-3 px-4 py-3";
const BASE_LINK_CLASSES =
  "group relative flex items-center rounded-2xl text-sm font-medium hover:bg-slate-100/80 hover:text-slate-900 dark:hover:bg-slate-800/70 dark:hover:text-white";
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
          "cursor-pointer transition-colors duration-200", // только transition-colors
          isActive
            ? "bg-sky-500/15 text-sky-600 ring-1 ring-inset ring-sky-500/30 dark:bg-sky-500/20 dark:text-sky-200"
            : "text-slate-600 dark:text-slate-300",
          getSpacingClasses(isIconOnly, isMobileViewport)
        )
      }>
      {/* Иконка - всегда на месте */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-sm transition-colors duration-200 group-hover:bg-sky-100 group-hover:text-sky-600 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-sky-500/20 dark:group-hover:text-sky-200">
        <Icon className="h-4 w-4" aria-hidden />
      </span>

      {/* Текст - плавное появление */}
      {!isIconOnly && (
        <span className="whitespace-nowrap text-sm font-medium overflow-hidden">
          <span
            className="block transition-all duration-300 ease-in-out"
            style={{
              opacity: isIconOnly ? 0 : 1,
              transform: isIconOnly ? "translateX(-10px)" : "translateX(0)",
              transitionDelay: isIconOnly ? "0ms" : "100ms",
            }}>
            {label}
          </span>
        </span>
      )}
    </NavLink>
  );
}
