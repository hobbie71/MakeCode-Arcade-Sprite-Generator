import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { useFabricIcons } from "../components/useFabricIcons";
import { SceneCopy } from "../scenes/SceneCopy";
import { SceneMakeCode } from "../scenes/SceneMakeCode";
import { SceneJs } from "../scenes/SceneJs";

// Absolute-frame plan (705 frames @ 30fps). Cursor moves at a uniform 16px/frame;
// discrete actions are evenly paced (dwell to see the modal, deliberate
// double-click + digit-by-digit typing); each caption is read ~1s before use.
// The final frame holds an extra ~0.5s before the loop.
//   0–92     Scene 1: copy on makespritecode.com (cursor holds on the button)
//  72–88     navigation slide → arcade.makecode.com
//  72–490    Scene 2/3: Assets → + → Image editor → resize 16→32 → ⌘V paste → Done
//            (holds its final frame behind the full JS crossfade — no white flash)
// 474–705    Scene 4: "Option 2" — type wrapper, paste img literal, type closing + hold
const NAV_START = 72;
const NAV_END = 88;
const MC_FROM = 72;
const MC_DUR = 418;
const JS_FROM = 474;
const JS_DUR = 231;

export const ExportFlowDemo: React.FC = () => {
  useFabricIcons();
  const frame = useCurrentFrame();

  const navP = interpolate(frame, [NAV_START, NAV_END], [0, 1], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlFlash = interpolate(
    frame,
    [NAV_START - 4, NAV_START + 2, NAV_END, NAV_END + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const jsFade = interpolate(frame, [JS_FROM, JS_FROM + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <BrowserFrame
        url={
          frame < (NAV_START + NAV_END) / 2
            ? "makespritecode.com/studio"
            : "arcade.makecode.com"
        }
        urlFlash={urlFlash}
      >
        <Sequence durationInFrames={NAV_END + 4}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${-navP * 1280}px)`,
            }}
          >
            <SceneCopy />
          </div>
        </Sequence>

        <Sequence from={MC_FROM} durationInFrames={MC_DUR}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${(1 - navP) * 1280}px)`,
            }}
          >
            <SceneMakeCode />
          </div>
        </Sequence>

        <Sequence from={JS_FROM} durationInFrames={JS_DUR}>
          <div style={{ position: "absolute", inset: 0, opacity: jsFade }}>
            <SceneJs />
          </div>
        </Sequence>
      </BrowserFrame>
    </AbsoluteFill>
  );
};
