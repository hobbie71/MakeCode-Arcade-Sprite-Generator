import { MC, ARCADE_PALETTE } from "../theme";
import { PixelSprite } from "./PixelSprite";
import { MsIcon } from "./fabric";

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

// Tool rail using the same Fabric MDL2 icon names the main app uses.
const LineGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path
      d="M5 19 L19 5"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const RailBtn: React.FC<{ icon: string; active?: boolean }> = ({
  icon,
  active,
}) => (
  <div
    style={{
      width: 42,
      height: 42,
      borderRadius: 8,
      background: active ? MC.railBtnActive : MC.railBtn,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
    }}
  >
    {icon === "Line" ? <LineGlyph /> : <MsIcon name={icon} style={{ fontSize: 20 }} />}
  </div>
);

// A focusable width/height field in the bottom bar.
const SizeBox: React.FC<{ value: string; focus?: boolean }> = ({
  value,
  focus,
}) => (
  <div
    style={{
      minWidth: 30,
      textAlign: "center",
      padding: "5px 9px",
      borderRadius: 6,
      background: focus ? "#26356B" : "#2C2C2C",
      border: focus ? "2px solid #4D6FE8" : "2px solid #3A3A3A",
      color: "#fff",
      fontWeight: 800,
    }}
  >
    {value}
  </div>
);

/**
 * Full-screen MakeCode image editor (screenshot-accurate). `cells` is the
 * canvas resolution (16 or 32); the sprite shows once it's 32. The bottom-bar
 * size fields reflect `wValue`/`hValue` and highlight when focused.
 */
export const ImageEditor: React.FC<{
  cells?: number;
  wValue?: string;
  hValue?: string;
  wFocus?: boolean;
  hFocus?: boolean;
  paintAt?: number;
}> = ({
  cells = 16,
  wValue = "16",
  hValue = "16",
  wFocus = false,
  hFocus = false,
  paintAt,
}) => {
  const canvas = 448;
  const cell = canvas / cells;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: MC.editorBg,
        display: "flex",
        flexDirection: "column",
        fontFamily: font,
      }}
    >
      {/* Blue header */}
      <div
        style={{
          height: 50,
          background: MC.editorBlue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              padding: "7px 22px",
              borderRadius: 8,
              background: "#fff",
              color: MC.editorBlue,
              fontWeight: 800,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MsIcon name="Edit" style={{ fontSize: 15 }} /> Editor
          </div>
          <div
            style={{
              padding: "7px 22px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <MsIcon name="Photo2" style={{ fontSize: 15 }} /> Gallery
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 18,
            color: "#fff",
            fontSize: 20,
          }}
        >
          <MsIcon name="ChromeClose" />
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Left rail: tools + current color + palette */}
        <div
          style={{
            width: 116,
            background: MC.editorRail,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 12,
            gap: 10,
          }}
        >
          {/* brush sizes + flips */}
          <div style={{ display: "flex", gap: 5 }}>
            {[7, 10, 13].map((s) => (
              <div
                key={s}
                style={{
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: s, height: s, background: "#fff", borderRadius: 2 }} />
              </div>
            ))}
          </div>
          {/* tool grid */}
          <div style={{ display: "grid", gridTemplateColumns: "42px 42px", gap: 8 }}>
            <RailBtn icon="Edit" active />
            <RailBtn icon="EraseTool" />
            <RailBtn icon="RectangleShape" />
            <RailBtn icon="BucketColor" />
            <RailBtn icon="CircleRing" />
            <RailBtn icon="Line" />
            <RailBtn icon="SelectAll" />
            <RailBtn icon="HandsFree" />
          </div>
          {/* palette */}
          <div style={{ display: "grid", gridTemplateColumns: "32px 32px", gap: 7 }}>
            {Object.entries(ARCADE_PALETTE).map(([k, c]) => (
              <div
                key={k}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 5,
                  background:
                    k === "0" || c === "#FFFFFF"
                      ? "#fff"
                      : c,
                  border:
                    k === "2"
                      ? "3px solid #fff"
                      : "1px solid rgba(255,255,255,0.18)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: MC.editorBg,
          }}
        >
          <div
            style={{
              width: canvas,
              height: canvas,
              backgroundImage:
                `linear-gradient(45deg, ${MC.checkerDark} 25%, transparent 25%, transparent 75%, ${MC.checkerDark} 75%), linear-gradient(45deg, ${MC.checkerDark} 25%, transparent 25%, transparent 75%, ${MC.checkerDark} 75%)`,
              backgroundSize: `${cell * 2}px ${cell * 2}px`,
              backgroundPosition: `0 0, ${cell}px ${cell}px`,
              backgroundColor: MC.checkerLight,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.12)",
              position: "relative",
            }}
          >
            {/* sprite fills the (resized) 32x32 canvas */}
            {cells === 32 ? (
              <div style={{ position: "absolute", left: 0, top: 0 }}>
                <PixelSprite cell={cell} paintAt={paintAt} stagger={0.4} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          height: 54,
          background: MC.bottomBar,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          color: "#C9CDD6",
          fontSize: 15,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SizeBox value={wValue} focus={wFocus} />
          <MsIcon name="Lock" style={{ fontSize: 14 }} />
          <SizeBox value={hValue} focus={hFocus} />
          <span style={{ marginLeft: 14, opacity: 0.7 }}>8, 6</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              background: "#fff",
              color: "#1A1A1A",
              padding: "7px 16px",
              borderRadius: 7,
              fontWeight: 700,
            }}
          >
            myImage
          </div>
          <MsIcon name="Undo" style={{ fontSize: 17 }} />
          <MsIcon name="Redo" style={{ fontSize: 17 }} />
          <span style={{ opacity: 0.4 }}>|</span>
          <MsIcon name="ZoomOut" style={{ fontSize: 17 }} />
          <MsIcon name="ZoomIn" style={{ fontSize: 17 }} />
          <div
            style={{
              background: MC.doneGreen,
              color: "#fff",
              padding: "9px 24px",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 17,
            }}
          >
            Done
          </div>
        </div>
      </div>
    </div>
  );
};
