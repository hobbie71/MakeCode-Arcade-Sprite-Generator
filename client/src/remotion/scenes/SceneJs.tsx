import { interpolate, useCurrentFrame } from "remotion";
import { MC, JS_OPEN, JS_IMG_BODY, JS_CLOSE } from "../theme";
import { Caption } from "../components/Caption";
import { Simulator } from "../components/Simulator";
import { MakeCodeHeader } from "../components/MakeCodeChrome";

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const mono = "Menlo, Consolas, 'Courier New', monospace";

// Scene-local timeline. Each caption appears ~1s before its action so it can be
// read: Option-2 caption → type wrapper → Paste caption → paste literal → close.
const OPT2_CAPTION_IN = 8;
const OPEN_START = 48;
const FPC = 1.4; // frames per typed character
const PASTE_CAPTION_IN = 94;
export const PASTE_PRESS = 126;
const CLOSE_START = 146;
const HEART_FROM = 182;

const KEY = "#001080"; // keyword / identifiers
const STR = "#A31515"; // string (the img literal)
const COMMENT = "#008000";

const Caret: React.FC = () => (
  <span
    style={{
      display: "inline-block",
      width: 2,
      height: 14,
      background: "#333",
      verticalAlign: "text-bottom",
      marginLeft: 1,
    }}
  />
);

/** Scene 4 — "Option 2": build the sprite in JavaScript by typing the wrapper
 *  and pasting only the img`...` template literal that MakeSpriteCode copied. */
export const SceneJs: React.FC = () => {
  const frame = useCurrentFrame();

  const openChars = Math.max(
    0,
    Math.min(JS_OPEN.length, Math.floor((frame - OPEN_START) / FPC)),
  );
  const pasted = frame >= PASTE_PRESS + 2;
  const closeChars = pasted
    ? Math.max(
        0,
        Math.min(JS_CLOSE.length, Math.floor((frame - CLOSE_START) / FPC)),
      )
    : 0;
  const closeDone = closeChars >= JS_CLOSE.length;

  // pasted literal stays selection-highlighted briefly
  const hl = interpolate(frame, [PASTE_PRESS + 2, PASTE_PRESS + 30], [0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hlBg = hl > 0 ? `rgba(72,102,232,${hl})` : "transparent";
  const caretOn = Math.floor(frame / 15) % 2 === 0;

  const heartIn = interpolate(frame, [HEART_FROM, HEART_FROM + 12], [0, 1], {
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
        background: "#fff",
      }}
    >
      <MakeCodeHeader active="JavaScript" />
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Simulator
          showHeart={frame >= HEART_FROM}
          heartIn={heartIn}
          showPlay={frame < HEART_FROM}
        />

        {/* Monaco-style editor */}
        <div
          style={{
            flex: 1,
            background: MC.monacoBg,
            display: "flex",
            fontFamily: mono,
            fontSize: 13,
            lineHeight: "16px",
            paddingTop: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 52,
              textAlign: "right",
              paddingRight: 14,
              color: MC.lineNum,
              background: MC.gutter,
              flexShrink: 0,
              paddingTop: 2,
              height: "100%",
            }}
          >
            {Array.from({ length: 36 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          <div style={{ paddingLeft: 22, paddingTop: 2 }}>
            {/* line 1: comment */}
            <div style={{ color: COMMENT, whiteSpace: "pre" }}>
              // Paste your sprite below
            </div>

            {/* line 2: the create statement, typed then pasted then typed */}
            {!pasted ? (
              <div style={{ color: KEY, whiteSpace: "pre" }}>
                {JS_OPEN.slice(0, openChars)}
                {caretOn ? <Caret /> : null}
              </div>
            ) : (
              <>
                <div style={{ whiteSpace: "pre" }}>
                  <span style={{ color: KEY }}>{JS_OPEN}</span>
                  <span style={{ color: STR, background: hlBg }}>img`</span>
                </div>
                {JS_IMG_BODY.map((l, i) => (
                  <div
                    key={i}
                    style={{ color: STR, background: hlBg, whiteSpace: "pre" }}
                  >
                    {l}
                  </div>
                ))}
                <div style={{ whiteSpace: "pre" }}>
                  <span style={{ color: STR, background: hlBg }}>`</span>
                  <span style={{ color: KEY }}>
                    {JS_CLOSE.slice(0, closeChars)}
                  </span>
                  {!closeDone && caretOn ? <Caret /> : null}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Unified captions — large, centered, read ~1s before each action */}
      <Caption
        text="Option 2 · Paste into the text editor"
        appearAt={OPT2_CAPTION_IN}
        disappearAt={OPEN_START - 6}
      />
      <Caption
        text="Paste your sprite"
        appearAt={PASTE_CAPTION_IN}
        disappearAt={PASTE_PRESS}
        pressAt={PASTE_PRESS}
      />
    </div>
  );
};
