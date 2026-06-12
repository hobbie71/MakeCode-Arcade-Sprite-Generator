import { MSC } from "../theme";

export const CHROME_H = 64;

/**
 * Minimal browser chrome: traffic lights + a centered URL pill.
 * Children render in the content area below it.
 */
export const BrowserFrame: React.FC<{
  url: string;
  urlFlash?: number; // 0..1, highlights the URL pill during navigation
  children: React.ReactNode;
}> = ({ url, urlFlash = 0, children }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#DDE1E8",
      }}
    >
      <div
        style={{
          height: CHROME_H,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          background: "#E9ECF2",
          borderBottom: "1px solid #CBD2DC",
        }}
      >
        <div style={{ display: "flex", gap: 9 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            paddingRight: 64,
          }}
        >
          <div
            style={{
              minWidth: 460,
              textAlign: "center",
              padding: "9px 26px",
              borderRadius: 999,
              background: urlFlash > 0 ? `rgba(72,102,232,${0.12 * urlFlash})` : "#FFFFFF",
              border: `2px solid ${urlFlash > 0 ? MSC.blue : "#CBD2DC"}`,
              fontSize: 19,
              fontWeight: 600,
              color: MSC.ink,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            <span style={{ color: "#94A3B8" }}>https://</span>
            {url}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
};
