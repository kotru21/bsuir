import { useCallback, useEffect, useState } from "react";

/**
 * Hook to safely persist and read `sidebarCollapsed` value from localStorage.
 * It gracefully handles cases where localStorage or window is unavailable.
 */
export function useSidebarCollapsed(
  key = "sidebarCollapsed",
  defaultValue = false
) {
  const read = useCallback(() => {
    try {
      if (typeof window === "undefined") return defaultValue;
      return localStorage.getItem(key) === "1";
    } catch (_e) {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const [collapsed, setCollapsed] = useState<boolean>(() => read());

  useEffect(() => {
    try {
      localStorage.setItem(key, collapsed ? "1" : "0");
    } catch (_e) {
      /* ignore */
    }
  }, [key, collapsed]);

  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  return { collapsed, setCollapsed, toggle } as const;
}

export default useSidebarCollapsed;
