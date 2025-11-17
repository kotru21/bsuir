import { useEffect, useState } from "react";

const DEFAULT_VIEWPORT_WIDTH = 0;

const getViewportWidth = (): number => {
  if (typeof window === "undefined") {
    return DEFAULT_VIEWPORT_WIDTH;
  }
  return window.innerWidth;
};

/**
 * Tracks viewport width without throttling to keep media-driven UI responsive.
 */
export function useViewportWidth(): number {
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    getViewportWidth()
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleResize = () => {
      setViewportWidth(getViewportWidth());
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return viewportWidth;
}
