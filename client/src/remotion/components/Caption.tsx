import { interpolate, useCurrentFrame, Easing } from "remotion";

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const KeyChip: React.FC<{ children: React.ReactNode; pressed: number }> = ({
  children,
  pressed,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "11px 20px",
      borderRadius: 13,
      background: "linear-gradient(#FFFFFF, #EEF1F6)",
      color: "#1F2937",
      fontSize: 34,
      fontWeight: 800,
      border: "1px solid #D2D8E2",
      boxShadow: `0 ${5 - pressed * 4}px 0 #C2C9D6, 0 ${8 - pressed * 5}px 14px rgba(0,0,0,0.3)`,
      transform: `translateY(${pressed * 4}px)`,
    }}
  >
    {children}
  </div>
);

/**
 * One unified instruction caption used for every pop-up in the GIF — large,
 * centered (x/y are the card center), consistent style. When `pressAt` is set
 * it also shows the ⌘V / Ctrl V keys that depress at that frame. When `arrowTo`
 * is set it draws an arrow from the card down to that scene point.
 */
export const Caption: React.FC<{
  appearAt: number;
  disappearAt: number;
  text: string;
  x?: number;
  y?: number;
  pressAt?: number;
  arrowTo?: { x: number; y: number };
  arrowColor?: string;
}> = ({
  appearAt,
  disappearAt,
  text,
  x = 640,
  y = 300,
  pressAt,
  arrowTo,
  arrowColor = "#FF3030",
}) => {
  const frame = useCurrentFrame();

  const inP = interpolate(frame, [appearAt, appearAt + 10], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outP = interpolate(frame, [disappearAt, disappearAt + 10], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = inP * (1 - outP);
  if (op <= 0) return null;

  const pressed =
    pressAt !== undefined
      ? interpolate(
          frame,
          [pressAt - 3, pressAt, pressAt + 8, pressAt + 14],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  // Arrow from the card's lower-left toward the target point.
  const sx = x - 160;
  const sy = y + 52;
  const ex = arrowTo?.x ?? 0;
  const ey = arrowTo?.y ?? 0;
  const cx = (sx + ex) / 2 - 50;
  const cy = (sy + ey) / 2 + 40;

  return (
    <>
      {arrowTo ? (
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1280,
            height: 656,
            overflow: "visible",
            pointerEvents: "none",
            opacity: op,
            filter: "drop-shadow(0 0 3px rgba(0,0,0,0.85))",
          }}
        >
          <defs>
            <marker
              id="caption-arrowhead"
              markerWidth="9"
              markerHeight="9"
              refX="6"
              refY="4.5"
              orient="auto"
            >
              <path d="M0,0 L9,4.5 L0,9 Z" fill={arrowColor} />
            </marker>
          </defs>
          <path
            d={`M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`}
            stroke={arrowColor}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#caption-arrowhead)"
          />
        </svg>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -50%) translateY(${(1 - inP) * 14}px) scale(${0.95 + inP * 0.05})`,
          opacity: op,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          background: "rgba(0,0,0,0.88)",
          padding: pressAt !== undefined ? "26px 42px" : "24px 42px",
          borderRadius: 22,
          boxShadow: "0 22px 54px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.12)",
          fontFamily: font,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 40,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {text}
        </div>
        {pressAt !== undefined ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <KeyChip pressed={pressed}>
              <span style={{ fontSize: 30 }}>⌘</span> V
            </KeyChip>
            <span style={{ color: "#E2E8F0", fontSize: 24, fontWeight: 700 }}>
              or
            </span>
            <KeyChip pressed={pressed}>
              <span style={{ fontSize: 24 }}>Ctrl</span> V
            </KeyChip>
          </div>
        ) : null}
      </div>
    </>
  );
};
