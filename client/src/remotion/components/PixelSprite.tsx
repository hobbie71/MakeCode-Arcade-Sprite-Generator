import { interpolate, useCurrentFrame, Easing } from "remotion";
import { ARCADE_PALETTE, SPRITE } from "../theme";

const pop = Easing.bezier(0.34, 1.56, 0.64, 1);

/**
 * Renders the sprite as a block of pixels. If `paintAt` is set, pixels pop in
 * with a diagonal stagger starting at that scene-local frame (so the reveal
 * stays quick regardless of sprite size); otherwise they show statically.
 */
export const PixelSprite: React.FC<{
  cell: number;
  paintAt?: number;
  stagger?: number;
}> = ({ cell, paintAt, stagger = 0.4 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "relative",
        width: SPRITE[0].length * cell,
        height: SPRITE.length * cell,
      }}
    >
      {SPRITE.flatMap((row, r) =>
        row.split("").map((ch, c) => {
          if (ch === ".") return null;
          const color = ARCADE_PALETTE[ch];
          let scale = 1;
          if (paintAt !== undefined) {
            const start = paintAt + (r + c) * stagger;
            scale = interpolate(frame, [start, start + 8], [0, 1], {
              easing: pop,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
          }
          if (scale <= 0) return null;
          return (
            <div
              key={`${r}-${c}`}
              style={{
                position: "absolute",
                left: c * cell,
                top: r * cell,
                width: cell,
                height: cell,
                background: color,
                transform: `scale(${scale})`,
              }}
            />
          );
        }),
      )}
    </div>
  );
};
