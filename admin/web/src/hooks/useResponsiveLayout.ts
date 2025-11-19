import { useMemo } from "react";
import { useViewportWidth } from "./useViewportWidth";
import {
  MOBILE_BREAKPOINT_PX,
  MOBILE_LABEL_BREAKPOINT_PX,
  HIDE_LOGOUT_TEXT_BREAKPOINT_PX,
} from "../constants/breakpoints.js";

export function useResponsiveLayout({
  mobilePx = MOBILE_BREAKPOINT_PX,
  mobileLabelPx = MOBILE_LABEL_BREAKPOINT_PX,
  hideLogoutPx = HIDE_LOGOUT_TEXT_BREAKPOINT_PX,
} = {}) {
  const viewportWidth = useViewportWidth();

  const isMobileViewport = viewportWidth > 0 && viewportWidth < mobilePx;

  const showMobileLabels = isMobileViewport && viewportWidth >= mobileLabelPx;

  // Hide logout text starting at the specified breakpoint, but only when
  // we are on a mobile-like viewport. On desktop (>= mobilePx) the full
  // sidebar always displays the logout label even if the width exceeds
  // `hideLogoutPx`.
  const hideLogoutText =
    viewportWidth > 0 && isMobileViewport && viewportWidth >= hideLogoutPx;

  return useMemo(
    () => ({
      viewportWidth,
      isMobileViewport,
      showMobileLabels,
      hideLogoutText,
    }),
    [viewportWidth, isMobileViewport, showMobileLabels, hideLogoutText]
  );
}

export default useResponsiveLayout;
