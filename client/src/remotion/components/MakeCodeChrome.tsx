import { MC } from "../theme";
import { MsIcon } from "./fabric";

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/**
 * MakeCode Arcade top bar. `active` can be a string or, for the tab-switch
 * animation, a number 0..1 sliding the active highlight from JavaScript (0)
 * to Assets is handled by the caller passing the right string.
 */
export const MakeCodeHeader: React.FC<{
  active: "Blocks" | "JavaScript" | "Assets";
}> = ({ active }) => (
  <div
    style={{
      height: 56,
      background: MC.orange,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 22px",
      flexShrink: 0,
      fontFamily: font,
    }}
  >
    <div
      style={{
        color: "#fff",
        fontSize: 18,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ opacity: 0.9 }}>⊞ Microsoft</span>
      <span style={{ opacity: 0.5 }}>|</span>
      <span>MakeCode Arcade</span>
    </div>
    <div
      style={{
        display: "flex",
        background: "rgba(0,0,0,0.12)",
        borderRadius: 9,
        padding: 3,
        gap: 3,
      }}
    >
      {["Blocks", "JavaScript", "Assets"].map((t) => (
        <div
          key={t}
          style={{
            padding: "8px 20px",
            fontSize: 16,
            fontWeight: 700,
            color: t === active ? MC.orangeDark : "#fff",
            background: t === active ? "#fff" : "transparent",
            borderRadius: 7,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MsIcon
            name={
              t === "Blocks" ? "Puzzle" : t === "JavaScript" ? "Code" : "Photo2"
            }
            style={{ fontSize: 15 }}
          />
          {t}
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {["Home", "Share", "Unknown", "Settings"].map((g) => (
        <div
          key={g}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.22)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MsIcon name={g} style={{ fontSize: 14 }} />
        </div>
      ))}
      <div
        style={{
          background: "#fff",
          color: MC.orangeDark,
          fontWeight: 700,
          fontSize: 15,
          padding: "7px 16px",
          borderRadius: 8,
        }}
      >
        Sign In
      </div>
    </div>
  </div>
);
