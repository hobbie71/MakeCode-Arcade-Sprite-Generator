export const PIXEL_SIZE = 20;

export const MAX_ZOOM = 3;
export const MIN_ZOOM = 0.2;
export const ZOOM_AMOUNT = 0.2;

// Lower zoom floor used ONLY when fitting (not manual zoom). Big canvases /
// extreme aspect ratios need a smaller zoom than MIN_ZOOM to fit fully on
// screen; clamping fit to MIN_ZOOM is what made large sprites overflow behind
// the UI. Manual zoom (wheel, presets) still clamps to [MIN_ZOOM, MAX_ZOOM].
export const FIT_MIN_ZOOM = 0.02;

// Fit / centering reserve room for the floating action bar (Generate / Resize /
// Export) so the canvas never renders behind it. The bar is a FIXED pixel height
// that sits higher on small screens, so it's measured at fit time rather than
// approximated with a flat percentage — a percentage clears the bar on tall
// viewports but not short ones. These tune the measured reserve:
//   CANVAS_FIT_PADDING  uniform breathing room around the fitted canvas
//   FIT_BOTTOM_GAP      extra clearance kept between the canvas and the bar
//   FIT_BOTTOM_FALLBACK reserve used only if the bar can't be measured
export const CANVAS_FIT_PADDING = 0.06;
export const FIT_BOTTOM_GAP = 16;
export const FIT_BOTTOM_FALLBACK = 96;
