import { StatsIcon } from "../components/icons/StatsIcon.js";
import { ViewRespIcon } from "../components/icons/ViewRespIcon.js";

export const NAV_ITEMS = [
  { to: "/", label: "Обзор", icon: StatsIcon },
  { to: "/submissions", label: "Опросы", icon: ViewRespIcon },
  { to: "/sections", label: "Секции", icon: ViewRespIcon },
];

export default NAV_ITEMS;
