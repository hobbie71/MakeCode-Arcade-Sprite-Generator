import { MC } from "../theme";
import { PixelSprite } from "./PixelSprite";
import { MsIcon } from "./fabric";

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const CtrlBtn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 34,
      height: 30,
      borderRadius: 6,
      background: MC.simTealDark,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: 15,
    }}
  >
    {children}
  </div>
);

/** The MakeCode Arcade simulator panel: console screen + D-pad + A/B + control row. */
export const Simulator: React.FC<{
  showHeart?: boolean;
  heartIn?: number;
  showPlay?: boolean;
}> = ({ showHeart = false, heartIn = 1, showPlay = false }) => (
  <div
    style={{
      width: 270,
      background: MC.simTeal,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 22,
      fontFamily: font,
    }}
  >
    {/* Console body */}
    <div
      style={{
        width: 224,
        borderRadius: 16,
        background: MC.simTeal,
        boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.07)",
        padding: "14px 14px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Screen */}
      <div
        style={{
          width: 196,
          height: 150,
          borderRadius: 8,
          background: MC.simScreen,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {showHeart ? (
          <div style={{ opacity: heartIn }}>
            <PixelSprite cell={4} />
          </div>
        ) : showPlay ? (
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              border: "4px solid rgba(255,255,255,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderLeft: "20px solid rgba(255,255,255,0.85)",
                marginLeft: 5,
              }}
            />
          </div>
        ) : null}
      </div>

      {/* Menu + reset row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        <div
          style={{
            background: "#2C2C2C",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            padding: "3px 12px",
            borderRadius: 6,
          }}
        >
          Menu
        </div>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "#2C2C2C",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MsIcon name="Sync" style={{ fontSize: 11 }} />
        </div>
      </div>

      {/* Controls: D-pad + A/B */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 16,
          padding: "0 8px",
        }}
      >
        {/* D-pad */}
        <div style={{ position: "relative", width: 64, height: 64 }}>
          <div
            style={{
              position: "absolute",
              left: 22,
              top: 0,
              width: 20,
              height: 64,
              background: "#3A3A3A",
              borderRadius: 5,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 22,
              width: 64,
              height: 20,
              background: "#3A3A3A",
              borderRadius: 5,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 24,
              width: 16,
              height: 16,
              background: "#4A4A4A",
              borderRadius: 3,
            }}
          />
        </div>
        {/* A / B */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            paddingBottom: 6,
          }}
        >
          {["B", "A"].map((b, i) => (
            <div
              key={b}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: MC.simBtn,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 18,
                marginBottom: i === 1 ? 14 : 0,
              }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* branding */}
      <div
        style={{
          marginTop: 10,
          color: "rgba(0,0,0,0.45)",
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <MsIcon name="WindowsLogo" style={{ fontSize: 11 }} /> Microsoft
      </div>
    </div>

    {/* Control toolbar row */}
    <div style={{ display: "flex", gap: 7, marginTop: 16 }}>
      <CtrlBtn><MsIcon name="Play" /></CtrlBtn>
      <CtrlBtn><MsIcon name="Refresh" /></CtrlBtn>
      <CtrlBtn><MsIcon name="Bug" /></CtrlBtn>
      <CtrlBtn><MsIcon name="Volume3" /></CtrlBtn>
      <CtrlBtn><MsIcon name="KeyboardClassic" /></CtrlBtn>
      <CtrlBtn><MsIcon name="FullScreen" /></CtrlBtn>
    </div>
  </div>
);
