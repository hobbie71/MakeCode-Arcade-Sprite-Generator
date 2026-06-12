import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ARCADE_PALETTE, SPRITE, MSC } from "../theme";

/**
 * A short, self-contained loop: a prompt types in, the sprite pops in
 * pixel-by-pixel, brief hold, fade back to the start. Authored to loop seamlessly
 * at 150 frames @ 30fps. Kept as the simplest example composition — a good
 * starting point to copy when authoring a new one.
 */
const PROMPT = "blue ninja warrior";
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const POP = Easing.bezier(0.34, 1.56, 0.64, 1);
const CELL = 8;

export const SpriteLoop: React.FC = () => {
  const frame = useCurrentFrame();

  const chars = Math.round(
    interpolate(frame, [6, 50], [0, PROMPT.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const caretOn = frame % 16 < 8;
  const btn = interpolate(frame, [50, 56, 62], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = interpolate(frame, [132, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: MSC.bg,
        opacity: fade,
        fontFamily: FONT,
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}>
      <div
        style={{
          width: 760,
          background: MSC.white,
          border: `1px solid ${MSC.border}`,
          borderRadius: 20,
          padding: 36,
          boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
        }}>
        <div
          style={{
            color: MSC.slate,
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 18,
          }}>
          Describe your sprite
        </div>
        <div
          style={{
            height: 76,
            borderRadius: 14,
            border: `2px solid ${MSC.blue}`,
            background: MSC.blueTint,
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            color: MSC.ink,
            fontSize: 34,
            fontWeight: 600,
          }}>
          {PROMPT.slice(0, chars)}
          <span style={{ opacity: caretOn ? 1 : 0 }}>|</span>
        </div>
        <div
          style={{
            marginTop: 22,
            height: 68,
            borderRadius: 14,
            background: MSC.blue,
            color: MSC.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 800,
            transform: `scale(${1 - btn * 0.04})`,
          }}>
          ✦ Generate sprite
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: SPRITE[0].length * CELL,
          height: SPRITE.length * CELL,
        }}>
        {SPRITE.flatMap((row, r) =>
          row.split("").map((ch, c) => {
            if (ch === ".") return null;
            const start = 64 + (r + c) * 0.4;
            const scale = interpolate(frame, [start, start + 8], [0, 1], {
              easing: POP,
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            if (scale <= 0) return null;
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: "absolute",
                  left: c * CELL,
                  top: r * CELL,
                  width: CELL,
                  height: CELL,
                  background: ARCADE_PALETTE[ch],
                  transform: `scale(${scale})`,
                }}
              />
            );
          })
        )}
      </div>
    </AbsoluteFill>
  );
};
