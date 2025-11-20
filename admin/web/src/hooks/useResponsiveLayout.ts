import { useMemo } from "react";
import { useViewportWidth } from "./useViewportWidth";
import {
  MOBILE_BREAKPOINT_PX,
  MOBILE_LABEL_BREAKPOINT_PX,
} from "../constants/breakpoints.js";

export function useResponsiveLayout({
  mobilePx = MOBILE_BREAKPOINT_PX,
  mobileLabelPx = MOBILE_LABEL_BREAKPOINT_PX,
} = {}) {
  const viewportWidth = useViewportWidth();

  const isMobileViewport = viewportWidth > 0 && viewportWidth < mobilePx;

  const showMobileLabels = isMobileViewport && viewportWidth >= mobileLabelPx;

  return useMemo(
    () => ({
      viewportWidth,
      isMobileViewport,
      showMobileLabels,
    }),
    [viewportWidth, isMobileViewport, showMobileLabels]
  );
}

export default useResponsiveLayout;
