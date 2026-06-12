import { Player, type PlayerRef } from "@remotion/player";
import { Component, useEffect, useRef, type ReactNode } from "react";
import type { CompositionDescriptor } from "./registry";

interface RemotionClipProps {
  /** A composition descriptor from registry.ts. */
  composition: CompositionDescriptor;
  /** Accessible description of what the clip shows. */
  label?: string;
  /** Extra classes for the wrapper (e.g. shadow, margins). */
  className?: string;
  /**
   * Rendered in place of the live Player if it throws while mounting/rendering
   * (e.g. an unexpected runtime error in <Player> or the composition). Pass the
   * pre-rendered baked video here as a safety net. Async/animation-loop hiccups
   * aren't caught — but those only log, they don't blank the element.
   */
  fallback?: ReactNode;
}

/**
 * Catches a hard render/mount failure of the live <Player> and shows the fallback
 * (the baked video) instead, so a Player error can never blank the element.
 */
class PlayerErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("RemotionClip: live Player failed, using fallback.", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * The one way to drop a live Remotion composition onto the site. Renders the
 * composition in-browser via <Player> (real DOM, native resolution — crisper than
 * a baked video) and is:
 *
 *   • Non-interactive — no controls, no click/keyboard, pointer-events disabled.
 *   • Play-on-reveal — driven imperatively via the PlayerRef + IntersectionObserver
 *     rather than the unreliable `autoPlay` prop. Starts from frame 0 when it scrolls
 *     into view; pauses off-screen or when the tab is hidden, so it never burns CPU
 *     off-screen and never jumps mid-loop on a tab switch (the Player advances by
 *     wall-clock time, so pausing stops the clock).
 *   • Fail-safe — if the Player throws on render, it falls back to `fallback`.
 *   • Shape-agnostic — the aspect ratio comes from the composition's width/height.
 */
export default function RemotionClip({
  composition,
  label,
  className = "",
  fallback,
}: RemotionClipProps) {
  const { component, durationInFrames, fps, width, height } = composition;
  const playerRef = useRef<PlayerRef>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useRef(false);

  useEffect(() => {
    const player = playerRef.current;
    const box = boxRef.current;
    if (!player || !box) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
        if (entry.isIntersecting && !document.hidden) {
          player.seekTo(0);
          player.play();
        } else {
          player.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(box);

    const onVisibilityChange = () => {
      if (document.hidden) player.pause();
      else if (inView.current) player.play();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      aria-label={label}
      className={`pointer-events-none overflow-hidden rounded-card border border-line bg-surface ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}>
      <PlayerErrorBoundary fallback={fallback}>
        <Player
          ref={playerRef}
          component={component}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={width}
          compositionHeight={height}
          loop
          acknowledgeRemotionLicense
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          spaceKeyToPlayOrPause={false}
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        />
      </PlayerErrorBoundary>
    </div>
  );
}
