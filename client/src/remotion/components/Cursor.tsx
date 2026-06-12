import { interpolate, useCurrentFrame, Easing } from "remotion";

export type CursorWaypoint = { frame: number; x: number; y: number };

const glide = Easing.bezier(0.4, 0, 0.2, 1);

/**
 * A fake macOS-style cursor that glides through waypoints (scene-local
 * frames) and emits a click ripple at each frame in `clicks`.
 */
export const Cursor: React.FC<{
  path: CursorWaypoint[];
  clicks?: number[];
  scale?: number;
}> = ({ path, clicks = [], scale = 1.1 }) => {
  const frame = useCurrentFrame();

  const frames = path.map((p) => p.frame);
  const x = interpolate(frame, frames, path.map((p) => p.x), {
    easing: glide,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, frames, path.map((p) => p.y), {
    easing: glide,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Press-down squish around each click
  const press = clicks.reduce((acc, c) => {
    const p = interpolate(frame, [c - 2, c, c + 5], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.max(acc, p);
  }, 0);

  return (
    <>
      {clicks.map((c) => {
        const t = interpolate(frame, [c, c + 14], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (t <= 0 || t >= 1) return null;
        const size = 14 + t * 52;
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              border: "3px solid rgba(72,102,232,0.85)",
              opacity: 1 - t,
              pointerEvents: "none",
            }}
          />
        );
      })}
      <svg
        width={26 * scale}
        height={30 * scale}
        viewBox="0 0 26 30"
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `scale(${1 - press * 0.12})`,
          transformOrigin: "4px 4px",
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))",
          pointerEvents: "none",
        }}
      >
        <path
          d="M 4 2 L 4 24 L 9.5 19 L 13 27 L 17 25.2 L 13.5 17.5 L 21 17 Z"
          fill="#FFFFFF"
          stroke="#111111"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
