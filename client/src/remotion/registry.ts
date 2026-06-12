import type { ComponentType } from "react";
import { ExportFlowDemo } from "./compositions/ExportFlowDemo";
import { SpriteLoop } from "./compositions/SpriteLoop";

/**
 * Single source of truth for every live composition. To add a new one:
 *   1. Create a component in compositions/.
 *   2. Add a descriptor here.
 *   3. Render it anywhere with <RemotionClip composition={YOUR_DESCRIPTOR} />.
 *
 * `durationInFrames`, `fps`, `width`, and `height` MUST match how the composition
 * was authored (these are the same numbers the render project registers in its
 * Root.tsx). The RemotionClip wrapper derives the on-page aspect ratio from
 * width/height, so a composition of any shape lays out correctly.
 */
export interface CompositionDescriptor {
  component: ComponentType;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
}

export const EXPORT_FLOW_DEMO: CompositionDescriptor = {
  component: ExportFlowDemo,
  durationInFrames: 705,
  fps: 30,
  width: 1280,
  height: 720,
};

export const SPRITE_LOOP: CompositionDescriptor = {
  component: SpriteLoop,
  durationInFrames: 150,
  fps: 30,
  width: 1280,
  height: 720,
};
