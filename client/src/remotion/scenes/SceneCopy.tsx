import { interpolate, useCurrentFrame } from "remotion";
import { MSC, SPRITE_W, SPRITE_H } from "../theme";
import { Cursor } from "../components/Cursor";
import { MsIcon } from "../components/fabric";
import { PixelSprite } from "../components/PixelSprite";

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const COPY_CLICK = 38;

/** A neutral wireframe placeholder bar. */
const Bar: React.FC<{ w: number | string; h: number; round?: number }> = ({
  w,
  h,
  round,
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: round ?? h / 2,
      background: "#CBD2DC",
    }}
  />
);

const Checker: React.FC<{ size: number; cell: number }> = ({ size, cell }) => (
  <div
    style={{
      width: size,
      height: size,
      backgroundImage:
        "linear-gradient(45deg, #D7DBE2 25%, transparent 25%, transparent 75%, #D7DBE2 75%), linear-gradient(45deg, #D7DBE2 25%, transparent 25%, transparent 75%, #D7DBE2 75%)",
      backgroundSize: `${cell * 2}px ${cell * 2}px`,
      backgroundPosition: `0 0, ${cell}px ${cell}px`,
      backgroundColor: "#EDEFF3",
    }}
  />
);

/** Scene 1 — the MakeSpriteCode export dialog; cursor clicks "Copy for MakeCode". */
export const SceneCopy: React.FC = () => {
  const frame = useCurrentFrame();
  const copied = frame >= COPY_CLICK + 3;

  const btnPress = interpolate(
    frame,
    [COPY_CLICK - 2, COPY_CLICK + 1, COPY_CLICK + 6],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: font }}>
      {/* Studio backdrop (simplified) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: MSC.bg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 58,
            background: MSC.white,
            borderBottom: `1px solid ${MSC.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: MSC.ink }}>
            MakeSprite<span style={{ color: MSC.blue }}>Code</span>
          </div>
          <div
            style={{
              background: MSC.blue,
              color: "#fff",
              fontWeight: 700,
              fontSize: 17,
              padding: "10px 24px",
              borderRadius: 10,
            }}
          >
            Export
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <div
            style={{
              width: 52,
              background: MSC.white,
              borderRadius: 12,
              border: `1px solid ${MSC.border}`,
              height: 320,
              marginLeft: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 12,
              gap: 10,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: i === 0 ? MSC.blueTint : "#EDF0F4",
                  border: i === 0 ? `2px solid ${MSC.blue}` : "none",
                }}
              />
            ))}
          </div>
          <Checker size={330} cell={11} />
          <div
            style={{
              width: 210,
              background: MSC.white,
              borderRadius: 12,
              border: `1px solid ${MSC.border}`,
              padding: 16,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
              marginRight: 18,
            }}
          >
            {[
              "#FF2121", "#FF93C4", "#FF8135", "#FFF609",
              "#249CA3", "#78DC52", "#003FAD", "#87F2FF",
              "#8E2EC4", "#A4839F", "#5C406C", "#E5CDC4",
              "#91463D", "#000000", "#FFFFFF", "#EDEFF3",
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  height: 34,
                  borderRadius: 8,
                  background: c,
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dim overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,23,42,0.45)",
        }}
      />

      {/* Export dialog (redesigned) */}
      <div
        style={{
          position: "absolute",
          left: 310,
          top: 30,
          width: 660,
          borderRadius: 18,
          background: MSC.white,
          boxShadow: "0 24px 60px rgba(15,23,42,0.35)",
          padding: "26px 30px",
          overflow: "hidden",
        }}
      >
        {/* close X */}
        <div style={{ position: "absolute", top: 24, right: 26, color: MSC.slate, fontSize: 18 }}>
          <MsIcon name="ChromeClose" />
        </div>

        <div style={{ fontSize: 29, fontWeight: 800, color: MSC.ink }}>
          Export sprite
        </div>
        {/* subtitle → oval */}
        <div style={{ marginTop: 10 }}>
          <Bar w={400} h={13} />
        </div>

        {/* Recommended / Copy card — whole card turns green on copy */}
        <div
          style={{
            marginTop: 20,
            borderRadius: 14,
            border: `1.5px solid ${copied ? MSC.green : "#C7D2FE"}`,
            background: copied ? "#F0FDF4" : MSC.blueTint,
            padding: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* sprite thumbnail (checker) */}
            <div
              style={{
                width: 64,
                height: 64,
                flexShrink: 0,
                borderRadius: 8,
                border: "1px solid #D7DEEA",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage:
                  "linear-gradient(45deg, #D7DBE2 25%, transparent 25%, transparent 75%, #D7DBE2 75%), linear-gradient(45deg, #D7DBE2 25%, transparent 25%, transparent 75%, #D7DBE2 75%)",
                backgroundSize: "12px 12px",
                backgroundPosition: "0 0, 6px 6px",
                backgroundColor: "#EDEFF3",
              }}
            >
              <PixelSprite cell={1.7} />
            </div>

            {/* title + description ovals */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: MSC.ink }}>
                Copy for MakeCode
              </div>
              <div
                style={{
                  marginTop: 9,
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                }}
              >
                <Bar w={250} h={11} />
                <Bar w={190} h={11} />
              </div>
            </div>

            {/* SPRITE SIZE label + badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 7,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 1,
                  color: MSC.slate,
                }}
              >
                SPRITE SIZE
              </div>
              <div
                style={{
                  background: copied ? MSC.green : MSC.blue,
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 800,
                  padding: "5px 14px",
                  borderRadius: 999,
                }}
              >
                {SPRITE_W} × {SPRITE_H}
              </div>
            </div>
          </div>

          {/* Copy button */}
          <div
            style={{
              marginTop: 16,
              height: 52,
              borderRadius: 11,
              background: copied ? MSC.green : MSC.blue,
              color: "#fff",
              fontSize: 19,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transform: `scale(${1 - btnPress * 0.04})`,
              boxShadow: copied
                ? "0 6px 18px rgba(22,163,74,0.35)"
                : "0 6px 18px rgba(72,102,232,0.35)",
            }}
          >
            <MsIcon name={copied ? "CheckMark" : "Copy"} style={{ fontSize: 19 }} />
            {copied ? "Copied!" : "Copy for MakeCode"}
          </div>
        </div>

        {/* "How to paste" heading → info icon + oval */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "2px solid #CBD2DC",
              color: "#9AA6B6",
              fontSize: 12,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            i
          </div>
          <Bar w={300} h={15} />
        </div>

        {/* Video player placeholder */}
        <div
          style={{
            marginTop: 12,
            height: 168,
            borderRadius: 12,
            background: "linear-gradient(#3b4049, #21242a)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 34,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: 12,
              color: "#fff",
            }}
          >
            <MsIcon name="Play" style={{ fontSize: 13 }} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>0:00</span>
            <div
              style={{
                flex: 1,
                height: 3,
                background: "rgba(255,255,255,0.3)",
                borderRadius: 2,
              }}
            />
            <MsIcon name="Volume3" style={{ fontSize: 13 }} />
            <MsIcon name="FullScreen" style={{ fontSize: 13 }} />
          </div>
        </div>

        {/* Steps → numbered ovals */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: MSC.blueTint,
                  color: MSC.blue,
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <Bar w={[360, 440, 320][i]} h={12} />
            </div>
          ))}
        </div>
      </div>

      <Cursor
        path={[
          // → Copy button (over ~27f ≈ 16 px/frame)
          { frame: 4, x: 985, y: 560 },
          { frame: 31, x: 640, y: 262 },
          // Hold on the button through the transition — no aimless drift.
          { frame: 120, x: 640, y: 262 },
        ]}
        clicks={[COPY_CLICK]}
      />
    </div>
  );
};
