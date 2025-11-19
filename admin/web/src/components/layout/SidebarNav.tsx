import type { ReactElement, ElementType } from "react";
import { SidebarNavItem } from "./SidebarNavItem.js";

export type NavItem = {
  to: string;
  label: string;
  icon: ElementType;
};

export type SidebarNavProps = {
  navItems: NavItem[];
  isIconOnly: boolean;
  isMobileViewport: boolean;
};

export function SidebarNav({
  navItems,
  isIconOnly,
  isMobileViewport,
}: SidebarNavProps): ReactElement {
  return (
    <nav
      role="navigation"
      aria-label="Основная навигация админ-панели"
      className={
        isMobileViewport
          ? "flex items-center gap-2 overflow-x-auto"
          : "flex flex-col gap-2 w-full"
      }>
      {navItems.map(({ to, label, icon }) => (
        <SidebarNavItem
          key={to}
          to={to}
          label={label}
          icon={icon}
          isIconOnly={isIconOnly}
          isMobileViewport={isMobileViewport}
        />
      ))}
    </nav>
  );
}

export default SidebarNav;
