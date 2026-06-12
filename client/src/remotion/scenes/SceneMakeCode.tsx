import { interpolate, useCurrentFrame, Easing } from "remotion";
import { MC } from "../theme";
import { Cursor } from "../components/Cursor";
import { Caption } from "../components/Caption";
import { PixelSprite } from "../components/PixelSprite";
import { Simulator } from "../components/Simulator";
import { MakeCodeHeader } from "../components/MakeCodeChrome";
import { ImageEditor } from "../components/ImageEditor";
import { MsIcon } from "../components/fabric";

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// Scene-local timeline (≈300 frames @ 30fps)
// The cursor moves at a consistent ~11 px/frame everywhere (matching scene 1).
// Click events are spaced so each move arrives at its target before the click.
export const PLUS_CLICK = 54;
export const IMAGE_CLICK = 86;
const EDITOR_IN: [number, number] = [92, 106];
// Captions appear ~1s before their action so they can be read. Resize step is
// deliberate: double-click a box, then the "32" types in digit-by-digit
// (W_TYPE3 = "3" shows, W_TYPED = "32" shows). Both boxes → canvas 16x16→32x32.
const SIZE_CAPTION_IN = 110;
const W_DBLCLICK = 150;
const W_TYPE3 = 162;
const W_TYPED = 170;
const H_DBLCLICK = 192;
const H_TYPE3 = 204;
const H_TYPED = 212;
const RESIZE_AT = 214;
const PASTE_CAPTION_IN = 232;
const PASTE_PRESS = 264;
const DONE_CLICK = 338;
const EDITOR_OUT: [number, number] = [344, 364];

const tiles = [
  { label: "Image", icon: "Photo2" },
  { label: "Tile", icon: "GridViewMedium" },
  { label: "Tilemap", icon: "Nav2DMapView" },
  { label: "Animation", icon: "Video" },
  { label: "Song", icon: "MusicInCollectionFill" },
];

// White/gray transparent-checker background (MakeCode shows sprites on this).
const CHECKER: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, #D6D6D6 25%, transparent 25%, transparent 75%, #D6D6D6 75%), linear-gradient(45deg, #D6D6D6 25%, transparent 25%, transparent 75%, #D6D6D6 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 8px 8px",
  backgroundColor: "#FFFFFF",
};

// Wireframe stand-in for an asset action button (Edit / Duplicate / Copy / …).
const WireButton: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 30,
      padding: "0 12px",
      borderRadius: 6,
      border: "1px solid #E4E0CF",
      background: "#fff",
    }}
  >
    <div style={{ width: 14, height: 14, borderRadius: 3, background: "#CBD2DC" }} />
    <div style={{ width: 58, height: 10, borderRadius: 5, background: "#CBD2DC" }} />
  </div>
);

export const SceneMakeCode: React.FC = () => {
  const frame = useCurrentFrame();

  const editorIn = interpolate(frame, EDITOR_IN, [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const editorOut = interpolate(frame, EDITOR_OUT, [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const editorVis = editorIn * (1 - editorOut);
  const done = frame > EDITOR_OUT[1] - 4;

  // Modal: appears after + click, gone once the editor takes over
  const modalIn = interpolate(frame, [PLUS_CLICK + 4, PLUS_CLICK + 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const modalOut = interpolate(frame, [IMAGE_CLICK + 2, IMAGE_CLICK + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const modalVis = modalIn * (1 - modalOut);

  const plusPress = interpolate(
    frame,
    [PLUS_CLICK - 2, PLUS_CLICK + 1, PLUS_CLICK + 6],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Hover state ignored for now — the tile only shows the pressed (active)
  // state on the click itself.
  const imageHover = false;
  const imagePress = interpolate(
    frame,
    [IMAGE_CLICK - 2, IMAGE_CLICK + 1, IMAGE_CLICK + 6],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Resize-step state handed to the editor: the size fields type in digit by
  // digit ("16" → "3" → "32"), the focus highlight spans the double-click
  // through the typing, and the canvas resolution flips once both are set.
  const wValue = frame >= W_TYPED ? "32" : frame >= W_TYPE3 ? "3" : "16";
  const hValue = frame >= H_TYPED ? "32" : frame >= H_TYPE3 ? "3" : "16";
  const wFocus = frame >= W_DBLCLICK - 2 && frame < W_TYPED + 8;
  const hFocus = frame >= H_DBLCLICK - 2 && frame < H_TYPED + 8;
  const cells = frame >= RESIZE_AT ? 32 : 16;

  // layout anchors. Grid is positioned inside the main column (which starts
  // at MAIN_X), so gridX/gridY are column-relative; PLUS_C* are scene-space.
  const MAIN_X = 470;
  const HEADER_H = 56;
  const cell = 104;
  const gridX = 34;
  const gridY = 80;
  const PLUS_CX = MAIN_X + gridX + cell / 2;
  const PLUS_CY = HEADER_H + gridY + cell / 2;
  const heartIn = interpolate(frame, [EDITOR_OUT[1] - 2, EDITOR_OUT[1] + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        fontFamily: font,
        background: MC.cream,
      }}
    >
      <MakeCodeHeader active="Assets" />

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Simulator showHeart={done} heartIn={heartIn} showPlay={!done} />

        {/* Asset preview column */}
        <div
          style={{
            width: 200,
            background: "#FFFFFF",
            borderRight: "1px solid #E4E0CF",
            padding: "18px 16px",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: "#2B2B2B" }}>
            Asset Preview
          </div>
          <div
            style={{
              marginTop: 12,
              width: "100%",
              height: 120,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...(done ? CHECKER : { background: "#E9E5D4" }),
            }}
          >
            {done ? (
              <div style={{ opacity: heartIn }}>
                <PixelSprite cell={3} />
              </div>
            ) : null}
          </div>

          {done ? (
            <div style={{ opacity: heartIn }}>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#2B2B2B",
                }}
              >
                myImage
              </div>
              {/* Type / Size — wireframe text */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 9,
                }}
              >
                <div style={{ width: 86, height: 10, borderRadius: 5, background: "#CBD2DC" }} />
                <div style={{ width: 104, height: 10, borderRadius: 5, background: "#CBD2DC" }} />
              </div>
              {/* Edit / Duplicate / Copy / Delete — wireframe buttons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 14,
                }}
              >
                <WireButton />
                <WireButton />
                <WireButton />
                <WireButton />
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: 10,
                fontSize: 14,
                fontWeight: 700,
                color: "#2B2B2B",
              }}
            >
              No asset selected
            </div>
          )}
          <div
            style={{
              marginTop: 16,
              background: MC.simTeal,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              padding: "9px 0",
              borderRadius: 7,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <MsIcon name="Color" /> Colors
          </div>
        </div>

        {/* My Assets grid */}
        <div style={{ flex: 1, position: "relative", paddingTop: 18 }}>
          <div
            style={{
              display: "flex",
              gap: 26,
              paddingLeft: 34,
              borderBottom: "1px solid #E4E0CF",
              paddingBottom: 10,
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 800, color: "#2B2B2B" }}>
              My Assets
            </span>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#9A937C" }}>
              Gallery
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              left: gridX,
              top: gridY,
              display: "grid",
              gridTemplateColumns: `repeat(6, ${cell}px)`,
              gap: 14,
            }}
          >
            {/* green + */}
            <div
              style={{
                width: cell,
                height: cell,
                borderRadius: 8,
                background: MC.addGreen,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 44,
                fontWeight: 300,
                transform: `scale(${1 - plusPress * 0.06})`,
              }}
            >
              ＋
            </div>
            {/* new heart asset (after Done) — sits on a transparent checker */}
            <div
              style={{
                width: cell,
                height: cell,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...(done
                  ? { ...CHECKER, boxShadow: "inset 0 0 0 2px #A8A48E" }
                  : { background: MC.assetCell }),
              }}
            >
              {done ? (
                <div style={{ opacity: heartIn }}>
                  <PixelSprite cell={3} />
                </div>
              ) : null}
            </div>
            {Array.from({ length: 22 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: cell,
                  height: cell,
                  borderRadius: 8,
                  background: MC.assetCell,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Create New Asset modal */}
      {modalVis > 0.01 ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `rgba(15,23,42,${0.45 * modalVis})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 290,
              top: 110,
              width: 700,
              borderRadius: 16,
              background: "#fff",
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              padding: "26px 34px 34px",
              opacity: modalVis,
              transform: `scale(${0.94 + modalVis * 0.06})`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: "#2B2B2B" }}>
                Create New Asset
              </div>
              <div style={{ fontSize: 20, color: "#9A937C" }}>
                <MsIcon name="ChromeClose" />
              </div>
            </div>
            <div
              style={{
                width: 360,
                height: 14,
                borderRadius: 7,
                background: "#CBD2DC",
                marginTop: 14,
              }}
            />
            <div
              style={{
                marginTop: 22,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 18,
              }}
            >
              {tiles.map((t) => {
                const active = t.label === "Image";
                const hovered = active && imageHover;
                const press = active ? imagePress : 0;
                return (
                  <div
                    key={t.label}
                    style={{
                      height: 132,
                      borderRadius: 12,
                      background: hovered ? MC.simTealDark : MC.simTeal,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      color: "#fff",
                      border: hovered
                        ? "3px solid #2A6E69"
                        : "3px solid transparent",
                      transform: `scale(${1 - press * 0.06})`,
                      boxShadow: hovered
                        ? "0 6px 18px rgba(0,0,0,0.22)"
                        : "none",
                    }}
                  >
                    <MsIcon name={t.icon} style={{ fontSize: 42 }} />
                    <div style={{ fontSize: 18, fontWeight: 800 }}>
                      {t.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}

      {/* Full-screen image editor */}
      {editorVis > 0.01 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: editorVis,
            transform: `scale(${0.96 + editorVis * 0.04})`,
            transformOrigin: "50% 50%",
          }}
        >
          <ImageEditor
            cells={cells}
            wValue={wValue}
            hValue={hValue}
            wFocus={wFocus}
            hFocus={hFocus}
            paintAt={PASTE_PRESS + 2}
          />
        </div>
      ) : null}

      {/* Unified captions — large, centered, ~1s readable before each action */}
      <Caption
        text="Adjust size to sprite size"
        appearAt={SIZE_CAPTION_IN}
        disappearAt={RESIZE_AT}
        arrowTo={{ x: 124, y: 604 }}
      />
      <Caption
        text="Paste your sprite"
        appearAt={PASTE_CAPTION_IN}
        disappearAt={PASTE_PRESS}
        pressAt={PASTE_PRESS}
      />

      {/* Interaction cursor: enter → + → Image → size boxes (double-clicks).
          Every glide is a uniform 16 px/frame; the moves double as the
          ~1s readable beat after the size caption appears. */}
      {frame < 222 ? (
        <Cursor
          path={[
            // Enter from the right side, middle height.
            { frame: 0, x: 1080, y: 330 },
            { frame: 16, x: 1080, y: 330 },
            // → +  (543px over 34f)
            { frame: 50, x: PLUS_CX, y: PLUS_CY },
            // dwell on + so the Create-asset modal can appear and be seen
            { frame: 64, x: PLUS_CX, y: PLUS_CY },
            // → Image tile  (200px over 16f)
            { frame: 80, x: 405, y: 320 },
            // hold while the editor opens + the size caption is read
            { frame: 110, x: 405, y: 320 },
            // → width box  (474px over 30f)
            { frame: 140, x: 44, y: 628 },
            // dwell for the double-click + digit-by-digit "32"
            { frame: 176, x: 44, y: 628 },
            // → height box  (80px over 10f)
            { frame: 186, x: 124, y: 628 },
            { frame: 218, x: 124, y: 628 },
          ]}
          clicks={[
            PLUS_CLICK,
            IMAGE_CLICK,
            // deliberate double-clicks — the two presses are spaced apart
            W_DBLCLICK,
            W_DBLCLICK + 6,
            H_DBLCLICK,
            H_DBLCLICK + 6,
          ]}
        />
      ) : null}

      {/* In-editor cursor: glide to Done (483px over ~32f = 16 px/frame) */}
      {frame >= 302 && editorOut < 1 ? (
        <Cursor
          path={[
            { frame: 304, x: 760, y: 470 },
            { frame: DONE_CLICK - 2, x: 1216, y: 628 },
            { frame: DONE_CLICK + 18, x: 1216, y: 628 },
          ]}
          clicks={[DONE_CLICK]}
        />
      ) : null}
    </div>
  );
};
